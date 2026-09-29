const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const msgEl = document.getElementById('msg');
const inputEl = document.getElementById('q');

let articles = [];

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text, kw) {
  const safe = escapeHtml(text);
  if (!kw) return safe;
  const re = new RegExp(escapeRegExp(escapeHtml(kw)), 'gi');
  return safe.replace(re, m => `<mark>${m}</mark>`);
}

function render(items, kw) {
  listEl.innerHTML = items.map(a => `
    <article class="card">
      <h2><span class="jo">${escapeHtml(a['조'])}</span>${escapeHtml(a['제목'])}</h2>
      <p>${highlight(a['본문'], kw)}</p>
    </article>
  `).join('');

  countEl.textContent = `결과 ${items.length}건`;
  msgEl.hidden = items.length !== 0;
  msgEl.className = 'msg';
  if (items.length === 0) {
    msgEl.textContent = `"${kw}"이(가) 본문에 들어있는 조항이 없습니다. 다른 키워드로 검색해 보세요.`;
  }
}

function applyFilter() {
  const kw = inputEl.value.trim();
  const lower = kw.toLowerCase();
  const result = kw
    ? articles.filter(a => a['본문'].toLowerCase().includes(lower))
    : articles;
  render(result, kw);
}

async function init() {
  try {
    const res = await fetch('조항데이터.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    articles = await res.json();
    applyFilter();
  } catch (err) {
    countEl.textContent = '결과 0건';
    msgEl.hidden = false;
    msgEl.className = 'msg error';
    msgEl.textContent =
      '조항데이터.json을 불러오지 못했습니다. 파일이 index.html과 같은 폴더에 있는지 확인하고, ' +
      '로컬 서버(예: python -m http.server)로 열어주세요.';
    console.error(err);
  }
}

inputEl.addEventListener('input', applyFilter);
init();
