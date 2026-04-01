// ===== IPSS App - 共用邏輯 =====

const STORAGE_KEY = 'ipss_session';

const QUESTIONS = [
  {
    id: 1,
    text: '過去一個月，您有多少次排尿後感到沒有排乾淨？',
    options: [
      { score: 0, label: '從來沒有' },
      { score: 1, label: '很少（少於 20% 的時候）' },
      { score: 2, label: '有時候（少於一半）' },
      { score: 3, label: '一半一半' },
      { score: 4, label: '常常（超過一半）' },
      { score: 5, label: '幾乎都是' },
    ],
  },
  {
    id: 2,
    text: '過去一個月，您有多少次在排尿後不到兩小時又需要再次排尿？',
    options: [
      { score: 0, label: '從來沒有' },
      { score: 1, label: '很少（少於 20% 的時候）' },
      { score: 2, label: '有時候（少於一半）' },
      { score: 3, label: '一半一半' },
      { score: 4, label: '常常（超過一半）' },
      { score: 5, label: '幾乎都是' },
    ],
  },
  {
    id: 3,
    text: '過去一個月，您有多少次排尿中斷又再次開始？',
    options: [
      { score: 0, label: '從來沒有' },
      { score: 1, label: '很少（少於 20% 的時候）' },
      { score: 2, label: '有時候（少於一半）' },
      { score: 3, label: '一半一半' },
      { score: 4, label: '常常（超過一半）' },
      { score: 5, label: '幾乎都是' },
    ],
  },
  {
    id: 4,
    text: '過去一個月，您有多少次無法忍住尿意？',
    options: [
      { score: 0, label: '從來沒有' },
      { score: 1, label: '很少（少於 20% 的時候）' },
      { score: 2, label: '有時候（少於一半）' },
      { score: 3, label: '一半一半' },
      { score: 4, label: '常常（超過一半）' },
      { score: 5, label: '幾乎都是' },
    ],
  },
  {
    id: 5,
    text: '過去一個月，您有多少次感到尿流變細或無力？',
    options: [
      { score: 0, label: '從來沒有' },
      { score: 1, label: '很少（少於 20% 的時候）' },
      { score: 2, label: '有時候（少於一半）' },
      { score: 3, label: '一半一半' },
      { score: 4, label: '常常（超過一半）' },
      { score: 5, label: '幾乎都是' },
    ],
  },
  {
    id: 6,
    text: '過去一個月，您有多少次需要用力才能開始排尿？',
    options: [
      { score: 0, label: '從來沒有' },
      { score: 1, label: '很少（少於 20% 的時候）' },
      { score: 2, label: '有時候（少於一半）' },
      { score: 3, label: '一半一半' },
      { score: 4, label: '常常（超過一半）' },
      { score: 5, label: '幾乎都是' },
    ],
  },
  {
    id: 7,
    text: '過去一個月，您通常每晚起床排尿幾次？',
    options: [
      { score: 0, label: '0 次' },
      { score: 1, label: '1 次' },
      { score: 2, label: '2 次' },
      { score: 3, label: '3 次' },
      { score: 4, label: '4 次' },
      { score: 5, label: '5 次以上' },
    ],
  },
];

// ===== QoL 第8題（生活品質，獨立計分 0–6，不計入 IPSS 總分）=====
const QOL_QUESTION = {
  id: 8,
  qol: true,
  text: '如果您今後的排尿狀況將一直像現在這樣，您覺得如何？',
  options: [
    { score: 0, label: '很高興，完全不困擾' },
    { score: 1, label: '滿意，幾乎不困擾' },
    { score: 2, label: '還好，稍微困擾' },
    { score: 3, label: '說不上好壞，有點困擾' },
    { score: 4, label: '不太滿意，感到困擾' },
    { score: 5, label: '很不高興，相當困擾' },
    { score: 6, label: '很痛苦，非常困擾' },
  ],
};

const QOL_LABELS = ['很高興', '滿意', '還好', '說不上好壞', '不太滿意', '很不高興', '很痛苦'];
const QOL_COLORS = ['#27ae60','#27ae60','#52be80','#e67e22','#d35400','#e74c3c','#c0392b'];

// 星星評分產生器（支援半顆）
function renderStars(n) {
  let s = '';
  for (let i = 1; i <= 4; i++) {
    if (i <= Math.floor(n)) s += '★';
    else if (i === Math.ceil(n) && n % 1 !== 0) s += '⭑';
    else s += '☆';
  }
  return `<span style="color:#f5a623;font-size:1.3rem;letter-spacing:2px;">${s}</span>`;
}

// 通用治療比較表（中/重度共用）
const TREATMENT_TABLE = {
  cols: [
    { key: 'drug',  icon: '💊', name: '藥物治療', sub: '每天服藥',        stars: 2,   highlight: false },
    { key: 'micro', icon: '🔧', name: '微創手術', sub: 'UroLift / Rezum', stars: 3.5, highlight: false },
    { key: 'laser', icon: '⚡', name: '雷射手術', sub: 'HoLEP',           stars: 4,   highlight: false },
  ],
  rows: [
    { label: '是否住院', values: { drug: '不需要',     micro: '1–2 天',        laser: '2–3 天' } },
    { label: '恢復時間', values: { drug: '即時',       micro: '1–2 週',        laser: '1–2 週' } },
    { label: '保留射精', values: { drug: '✅ 保留',   micro: '✅ 保留',       laser: '⚠️ 可能影響' } },
    { label: '長期效果', values: { drug: '停藥易復發', micro: '較持久',        laser: '持久、少復發' } },
  ],
  pros: {
    drug:  ['不需手術、風險低', '1–2 週內有感'],
    micro: ['門診手術、恢復快', '可完整保留射精功能'],
    laser: ['出血少、各大小均適用', '效果持久、幾乎不復發'],
  },
  cons: {
    drug:  ['需每天長期服藥', '無法根本解決阻塞'],
    micro: ['適合攝護腺較小者', '長期效果略遜於雷射'],
    laser: ['需住院 1–2 天', '可能影響射精功能'],
  },
};

const RESULTS = {
  mild: {
    grade: '輕度',
    range: '0–7 分',
    cls: 'mild',
    summary: '您的症狀屬於輕微程度，對生活影響不大。目前以調整生活習慣為主，定期追蹤即可。',
    table: null,
    lifestyle: { tips: ['睡前 2 小時少喝水', '減少咖啡、茶、酒精攝取', '定時排尿、訓練膀胱', '規律運動'] },
  },
  moderate: {
    grade: '中度',
    range: '8–19 分',
    cls: 'moderate',
    summary: '您的症狀屬於中等程度，已對日常生活造成影響。建議就醫評估，以下是各種治療方式的直觀比較。',
    table: TREATMENT_TABLE,
  },
  severe: {
    grade: '重度',
    range: '20–35 分',
    cls: 'severe',
    summary: '您的症狀已屬嚴重程度，單靠藥物效果有限。以下是各治療方式的直觀比較，供您與醫師討論。',
    table: TREATMENT_TABLE,
  },
};

// 取得 session
function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// 儲存 session
function saveSession(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 清除 session
function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

// 計算結果等級
function getGrade(score) {
  if (score <= 7) return 'mild';
  if (score <= 19) return 'moderate';
  return 'severe';
}

// 跳轉（相對路徑，支援 file:// 和 http://）
function navigate(page) {
  const base = window.location.href.replace(/\/[^/]*$/, '/');
  window.location.href = base + page;
}
