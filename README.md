# O-X · 생윤 선지노트

생활과 윤리 선지를 사상가·단원별로 정리하고 O/X로 복습하는 웹앱. iPhone·iPad Safari, 오프라인 지원.

## 기능
- **정리** 선지 + O/X + 해설 + 사상가·단원·출처 입력, 검색·필터, 별표, 오늘의 선지
- **퀴즈** 범위(사상가·단원·오답·별표) 선택 후 랜덤 O/X, 채점
- **오답** 틀린 횟수순 모아보기, 다시 풀기
- **인쇄** A4 정리본 / 시험지(정답표 포함), PDF 저장
- **동기화** GitHub Gist로 기기 간 연동
- **위젯** Scriptable 홈 화면 위젯
- **단원** ⚙︎ 설정에서 추가·이름 수정(선지에 자동 반영)·순서 변경·삭제
- **테마** ⚙︎ 설정에서 프리셋 5종, 색상 7가지, 화면 모드, 본문·제목 폰트, 굵기, 글자 크기, 모서리, 여백 직접 설정 (Gist로 기기 간 공유)

## 배포 (GitHub Pages)
Settings → Pages → Branch 선택 → `https://<아이디>.github.io/O-X/` 접속 → Safari 공유 → **홈 화면에 추가**.

## 기기 간 동기화
1. GitHub → Settings → Developer settings → Personal access tokens → **gist** 권한만 체크해 토큰 생성
2. 앱 ⚙︎ 설정 → 토큰 입력, Gist ID 비우고 **연결** (비공개 Gist 생성)
3. 다른 기기: 같은 토큰 + 표시된 Gist ID 입력 후 **연결**

앱을 열 때·변경 3초 후 자동 동기화. 항목별 최신 수정본 우선으로 병합.
iOS는 Safari와 홈 화면 앱의 저장소가 분리되어 있고 오래 쓰지 않으면 지워질 수 있으니 동기화나 JSON 백업을 권장.

## 홈 화면 위젯
1. App Store에서 **Scriptable** 설치
2. `widget/scriptable-widget.js` 내용을 새 스크립트에 붙여넣고 `TOKEN`, `GIST_ID`, `APP_URL` 입력
3. 홈 화면 → 위젯 추가 → Scriptable → 스크립트 선택 (Parameter에 `hide` 입력 시 정답 숨김)

오답이 많은 선지가 더 자주 표시되며, 탭하면 앱에서 해당 선지 퀴즈가 열림.
