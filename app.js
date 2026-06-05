let purchases = JSON.parse(localStorage.getItem('thai_purchases') || '[]');
let isGovMode = false;
let currentResult = null;

function setMode(govMode) {
  isGovMode = govMode;
  document.getElementById('btn-price').classList.toggle('active', !govMode);
  document.getElementById('btn-gov').classList.toggle('active', govMode);
  document.getElementById('amount-label').textContent = govMode ? 'ยอดที่รัฐบาลออกให้ (บาท)' : 'ราคาสินค้ารวม (บาท)';
  document.getElementById('input-amount').placeholder = govMode ? 'กรอกยอดที่รัฐช่วย เช่น 300' : 'กรอกราคาสินค้า เช่น 500';
  document.getElementById('info-text').textContent = govMode
    ? 'กรอกเงินที่รัฐช่วย → คำนวณราคาสินค้าและส่วนที่คุณออก'
    : 'กรอกราคาสินค้า → คำนวณส่วนที่รัฐและคุณออก';
  document.getElementById('input-amount').value = '';
  document.getElementById('results').style.display = 'none';
  currentResult = null;
}

function calculate() {
  const raw = parseFloat(document.getElementById('input-amount').value);
  if (!raw || raw <= 0) {
    document.getElementById('results').style.display = 'none';
    currentResult = null;
    return;
  }
  let total, gov, self;
  if (isGovMode) {
    gov = raw;
    total = raw / 0.6;
    self = total * 0.4;
  } else {
    total = raw;
    gov = raw * 0.6;
    self = raw * 0.4;
  }
  currentResult = { total, gov, self };
  document.getElementById('res-gov').textContent = gov.toFixed(2) + ' ฿';
  document.getElementById('res-self').textContent = self.toFixed(2) + ' ฿';
  document.getElementById('res-total').textContent = total.toFixed(2) + ' บาท';
  document.getElementById('results').style.display = 'block';
}

function save() {
  if (!currentResult) return;
  const name = document.getElementById('input-name').value.trim() || 'รายการที่ ' + Date.now();
  const purchase = {
    id: Date.now().toString(),
    name,
    totalAmount: currentResult.total,
    govPays: currentResult.gov,
    selfPays: currentResult.self,
    date: new Date().toISOString()
  };
  purchases.unshift(purchase);
  localStorage.setItem('thai_purchases', JSON.stringify(purchases));
  document.getElementById('input-name').value = '';
  document.getElementById('input-amount').value = '';
  document.getElementById('results').style.display = 'none';
  currentResult = null;
  showToast('✅ บันทึกรายการเรียบร้อยแล้ว');
  renderHistory();
  renderSummary();
}

function deletePurchase(id) {
  purchases = purchases.filter(p => p.id !== id);
  localStorage.setItem('thai_purchases', JSON.stringify(purchases));
  renderHistory();
  renderSummary();
}

function formatDate(iso) {
  const d = new Date(iso);
  const day = d.getDate(), month = d.getMonth() + 1, year = d.getFullYear() + 543;
  const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year}  ${hh}:${mm} น.`;
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderHistory() {
  const container = document.getElementById('history-container');
  if (purchases.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="big-icon">📋</div><span>ยังไม่มีรายการ</span></div>`;
    return;
  }
  container.innerHTML = '<div class="history-list">' + purchases.map(p => `
    <div class="history-item">
      <button class="del-btn" onclick="deletePurchase('${p.id}')">🗑️</button>
      <div class="h-header">
        <div class="h-name">${escHtml(p.name)}</div>
        <div class="h-total">${p.totalAmount.toFixed(2)} ฿</div>
      </div>s
      <div class="tags">
        <span class="tag blue">รัฐ: ${p.govPays.toFixed(2)} ฿</span>
        <span class="tag red">คุณ: ${p.selfPays.toFixed(2)} ฿</span>
      </div>
      <div class="h-date">${formatDate(p.date)}</div>
    </div>
  `).join('') + '</div>';
}

function renderSummary() {
  const total = purchases.reduce((s, p) => s + p.totalAmount, 0);
  const gov   = purchases.reduce((s, p) => s + p.govPays, 0);
  const self  = purchases.reduce((s, p) => s + p.selfPays, 0);
  document.getElementById('sum-total').textContent = total.toFixed(2) + ' บาท';
  document.getElementById('sum-count').textContent = purchases.length + ' รายการ';
  document.getElementById('sum-gov').textContent  = gov.toFixed(2) + ' ฿';
  document.getElementById('sum-self').textContent = self.toFixed(2) + ' ฿';
  if (purchases.length > 0) {
    document.getElementById('sum-progress').style.display = 'block';
    const govPct  = total === 0 ? 0 : (gov / total * 100);
    const selfPct = total === 0 ? 0 : (self / total * 100);
    document.getElementById('pct-gov').textContent  = govPct.toFixed(1) + '%';
    document.getElementById('pct-self').textContent = selfPct.toFixed(1) + '%';
    document.getElementById('bar-gov').style.width  = govPct + '%';
    document.getElementById('bar-self').style.width = selfPct + '%';
  } else {
    document.getElementById('sum-progress').style.display = 'none';
  }
}

function switchPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.getElementById('nav-' + page).classList.add('active');
  if (page === 'history') renderHistory();
  if (page === 'summary') renderSummary();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Init
renderHistory();
renderSummary();
