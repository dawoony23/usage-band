import { expect, test } from 'claude-code/testing'
import { bar, line, untilText } from './register'

const now = Date.parse('2026-10-12T03:20:00+09:00')

test('남은 시간 문구', () => {
  expect(untilText('2026-10-12T05:03:00+09:00', now)).toBe('1시간 43분')
  expect(untilText('2026-10-17T17:20:00+09:00', now)).toBe('5일 14시간')
  expect(untilText('2026-10-12T03:00:00+09:00', now)).toBe('곧 재설정')
})

test('막대와 한 줄 요약', () => {
  expect(bar(70)).toBe('■■■■■■■□□□')
  expect(line([{ kind: 'seven_day', percentUsed: 18 }, { kind: 'five_hour', percentUsed: 70, resetsAt: '2026-10-12T05:03:00+09:00' }], now))
    .toBe('세션(5시간) ■■■■■■■□□□ 70% · 1시간 43분 후 재설정   |   주간 ■■□□□□□□□□ 18%')
})
