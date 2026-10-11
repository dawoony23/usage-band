import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Window } from '../types'

const windows = atom({ plugin: 'usage-band', key: 'windows' } as const, [] as Window[])

const LABEL: Record<string, string> = { five_hour: '세션(5시간)', seven_day: '주간' }

// 재설정까지 남은 시간: "1시간 43분", "5일 14시간"
export function untilText(resetsAt: string | undefined, now: number): string {
  if (!resetsAt) return ''
  const ms = Date.parse(resetsAt) - now
  if (!(ms > 0)) return '곧 재설정'
  const min = Math.floor(ms / 60000)
  const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60
  if (d > 0) return `${d}일 ${h}시간`
  if (h > 0) return `${h}시간 ${m}분`
  return `${m}분`
}

// 10칸 막대: ■■■■■■■□□□
export function bar(pct: number): string {
  const n = Math.max(0, Math.min(10, Math.round(pct / 10)))
  return '■'.repeat(n) + '□'.repeat(10 - n)
}

export function line(ws: Window[], now: number): string {
  return ws
    .filter(w => LABEL[w.kind])
    .sort((a, b) => (a.kind === 'five_hour' ? -1 : 1) - (b.kind === 'five_hour' ? -1 : 1))
    .map(w => `${LABEL[w.kind]} ${bar(w.percentUsed)} ${Math.round(w.percentUsed)}%${w.resetsAt ? ` · ${untilText(w.resetsAt, now)} 후 재설정` : ''}`)
    .join('   |   ')
}

async function refresh($: EngineInterface, ws: Window[]) {
  await update($, windows, () => ws)
  const text = line(ws, await $.clock.now())
  $.ui.status(text ? `사용량 ${text}` : undefined)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    const u = await $.session.usage()
    await refresh($, u.rateLimits)
    return r
  })

  on('session.measure', async ($, e, next) => {
    await refresh($, e.rateLimits)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const ws = await read($, windows)
    if (e.props.hasSurvey || ws.length === 0) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const now = await $.clock.now()
    const shown = ws.filter(w => LABEL[w.kind])
    if (shown.length === 0) return next(e)
    return (
      <Box>
        {shown.map(w => (
          <Text key={w.kind} color={w.percentUsed >= 90 ? 'red' : w.percentUsed >= 70 ? 'yellow' : undefined} dimColor={w.percentUsed < 70}>
            {LABEL[w.kind]} {bar(w.percentUsed)} {Math.round(w.percentUsed)}%{w.resetsAt ? ` · ${untilText(w.resetsAt, now)} 후 재설정` : ''}{'    '}
          </Text>
        ))}
      </Box>
    )
  })
}
