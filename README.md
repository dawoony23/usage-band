# usage-band

Claude 입력창 위에 **5시간 세션 · 주간 사용량**과 재설정까지 남은 시간을 항상 보여주는 모드예요.

```
세션(5시간) ■■■■■■■□□□ 70% · 1시간 43분 후 재설정    주간 ■■□□□□□□□□ 18% · 5일 14시간 후 재설정
```

- 토큰을 쓰지 않아요. Claude가 답할 때 서버가 원래 보내주는 사용량 숫자를 그대로 그려요.
- 70% 넘으면 노란색, 90% 넘으면 빨간색.
- 새 대화에서는 첫 답변이 끝난 뒤부터 보여요.

## 설치

Claude Code 터미널(또는 VS Code의 Claude Code 터미널)에서:

```
/plugin install usage-band --marketplace dawoony23/usage-band
```

`Add marketplace?`에 `y` → 범위는 맨 위 **user**를 Enter.
