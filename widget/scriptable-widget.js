// 생윤 선지노트 · 홈 화면 위젯 (Scriptable)
// 1) App Store에서 Scriptable 설치 → 새 스크립트에 이 파일 내용 붙여넣기
// 2) 아래 TOKEN, GIST_ID, APP_URL 입력
// 3) 홈 화면 편집 → 위젯 추가 → Scriptable → 이 스크립트 선택
// 위젯 편집의 Parameter에 "hide"를 넣으면 정답을 숨깁니다.

const TOKEN = '';        // gist 권한 GitHub 토큰
const GIST_ID = '';      // 앱 설정에 표시된 Gist ID
const APP_URL = '';      // 앱 주소 (예: https://username.github.io/O-X/)

const C = {
  bg: Color.dynamic(new Color('#f1eff8'), new Color('#242a36')),
  ink: Color.dynamic(new Color('#2e3748'), new Color('#e3e5eb')),
  soft: Color.dynamic(new Color('#7a8193'), new Color('#9aa1b1')),
  violet: Color.dynamic(new Color('#9a90c0'), new Color('#bcb3dd')),
  O: Color.dynamic(new Color('#76845a'), new Color('#aab784')),
  X: Color.dynamic(new Color('#b07d87'), new Color('#d5a3ac')),
};

async function loadItems() {
  const fm = FileManager.local();
  const cache = fm.joinPath(fm.documentsDirectory(), 'ox-widget-cache.json');
  try {
    const req = new Request('https://api.github.com/gists/' + GIST_ID);
    req.headers = { Authorization: 'Bearer ' + TOKEN, Accept: 'application/vnd.github+json' };
    const g = await req.loadJSON();
    const f = g.files['ox-data.json'];
    let content = f.content;
    if (f.truncated) content = await new Request(f.raw_url).loadString();
    fm.writeString(cache, content);
    return JSON.parse(content).items.filter(i => !i.deleted);
  } catch (e) {
    if (fm.fileExists(cache)) return JSON.parse(fm.readString(cache)).items.filter(i => !i.deleted);
    return [];
  }
}

function choose(items) {
  // 오답이 많은 선지일수록 자주 나오도록 가중치
  const w = items.map(i => 1 + (i.wrong || 0) * 2 + (i.starred ? 1 : 0));
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let k = 0; k < items.length; k++) { r -= w[k]; if (r <= 0) return items[k]; }
  return items[0];
}

async function build() {
  const hide = (args.widgetParameter || '').trim() === 'hide';
  const items = await loadItems();
  const wg = new ListWidget();
  wg.backgroundColor = C.bg;
  wg.setPadding(14, 16, 14, 16);
  wg.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000);

  const head = wg.addText('생윤 O · X');
  head.font = Font.lightSystemFont(9); head.textColor = C.violet;
  wg.addSpacer(6);

  if (!items.length) {
    const t = wg.addText(TOKEN && GIST_ID ? '선지를 추가하세요' : 'TOKEN과 GIST_ID를 입력하세요');
    t.font = Font.lightSystemFont(12); t.textColor = C.soft;
    return wg;
  }

  const it = choose(items);
  const size = config.widgetFamily;
  const t = wg.addText(it.text);
  t.font = new Font('AppleMyungjo', size === 'small' ? 12 : 14);
  t.textColor = C.ink; t.minimumScaleFactor = 0.7;
  wg.addSpacer();

  const foot = wg.addStack();
  foot.centerAlignContent();
  const meta = foot.addText([it.thinker, it.unit ? (it.unit.match(/^\s*(\d+)\s*\./) ? it.unit.match(/^\s*(\d+)/)[1] + '단원' : it.unit) : ''].filter(Boolean).join(' · '));
  meta.font = Font.lightSystemFont(9); meta.textColor = C.soft; meta.lineLimit = 1;
  foot.addSpacer();
  const a = foot.addText(hide ? '?' : it.answer);
  a.font = new Font('AppleMyungjo', 14); a.textColor = hide ? C.soft : C[it.answer];

  if (APP_URL) wg.url = APP_URL.replace(/#.*$/, '') + '#q=' + encodeURIComponent(it.id);
  return wg;
}

const widget = await build();
if (config.runsInWidget) Script.setWidget(widget);
else await widget.presentMedium();
Script.complete();
