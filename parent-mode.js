// 保護者モード（拡張版: がんばり表PDF + 兄弟切替）
const ParentMode = (() => {
  const PIN = '1234';
  const gameNames = { aiube: 'あいうべ体操', brushing: 'はみがき', blowing: 'ふーふー', tongue: 'べろべろ', chewing: 'もぐもぐ', quiz: 'クイズ' };

  function show() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="parent-screen">
        <div class="parent-header">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <h2>🔒 ほごしゃモード</h2>
        </div>
        <div class="parent-pin-form">
          <p>あんしょうばんごうを にゅうりょくしてください</p>
          <input type="password" id="parent-pin" class="pin-input" maxlength="4" inputmode="numeric" placeholder="****">
          <button class="btn-game btn-game-home" onclick="ParentMode.checkPin()">かくにん</button>
        </div>
      </div>
    `;
  }

  async function checkPin() {
    const input = document.getElementById('parent-pin').value;
    if (input !== PIN) { alert('暗証番号が違います'); return; }
    showDashboard();
  }

  async function showDashboard() {
    const app = document.getElementById('app');
    const karteNo = OralApp.karteNo;

    let recentLogs = [];
    let streakData = null;

    if (karteNo) {
      try {
        const snap = await db.collection('oralFunctionGameLogs')
          .where('karteNo', '==', karteNo)
          .orderBy('date', 'desc')
          .limit(50)
          .get();
        recentLogs = snap.docs.map(d => d.data());
        const sDoc = await db.collection('oralFunctionStreaks').doc(karteNo).get();
        if (sDoc.exists) streakData = sDoc.data();
      } catch (e) {}
    }

    // 兄弟リスト取得
    const siblings = getSiblings();
    const siblingHtml = siblings.length > 0 ? `
      <div class="parent-section">
        <h3>👧👦 きょうだい切替</h3>
        <div class="sibling-list">
          ${siblings.map(s => `
            <button class="sibling-btn ${s.karteNo === karteNo ? 'sibling-active' : ''}"
              onclick="ParentMode.switchChild('${s.karteNo}', '${s.clinicCode}')">
              ${s.name || 'カルテ' + s.karteNo}
            </button>
          `).join('')}
          <button class="sibling-btn sibling-add" onclick="ParentMode.addSibling()">＋ 追加</button>
        </div>
      </div>
    ` : `
      <div class="parent-section">
        <button class="btn-game btn-game-home" onclick="ParentMode.addSibling()">👧👦 きょうだいを追加</button>
      </div>
    `;

    app.innerHTML = `
      <div class="parent-screen">
        <div class="parent-header">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <h2>📊 保護者ダッシュボード</h2>
        </div>

        ${karteNo ? `<p class="parent-karte-info">カルテNo: ${karteNo}</p>` : ''}

        ${streakData ? `
          <div class="parent-stats">
            <div class="parent-stat-card">
              <span class="parent-stat-num">${streakData.level || 1}</span>
              <span class="parent-stat-label">レベル</span>
            </div>
            <div class="parent-stat-card">
              <span class="parent-stat-num">${streakData.currentStreak || 0}</span>
              <span class="parent-stat-label">連続日数</span>
            </div>
            <div class="parent-stat-card">
              <span class="parent-stat-num">${streakData.totalSessions || 0}</span>
              <span class="parent-stat-label">累計回数</span>
            </div>
            <div class="parent-stat-card">
              <span class="parent-stat-num">${streakData.longestStreak || 0}</span>
              <span class="parent-stat-label">最長連続</span>
            </div>
          </div>

          <!-- がんばり表・健康ノート -->
          <div class="parent-section" style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn-game btn-game-next" onclick="QuestionnaireOralDev.show()">📋 おくちの もんしんひょう</button>
            <button class="btn-game btn-game-next" onclick="HealthNote.show()">🏥 けんこうノート</button>
            <button class="btn-game btn-game-home" onclick="ParentMode.printReport()">🖨️ がんばり表</button>
          </div>
        ` : '<p style="text-align:center;color:#94A3B8">まだ記録がありません</p>'}

        ${siblingHtml}

        <h3 style="margin:16px 0 8px;font-size:16px">最近の記録</h3>
        <div class="parent-log-list">
          ${recentLogs.length === 0 ? '<p style="color:#94A3B8">記録なし</p>' :
            recentLogs.slice(0, 30).map(l => `
              <div class="parent-log-item">
                <span class="parent-log-date">${l.dateStr || '—'}</span>
                <span class="parent-log-game">${gameNames[l.gameType] || l.gameType}</span>
                ${l.score ? `<span class="parent-log-score">${l.score}点</span>` : ''}
              </div>
            `).join('')
          }
        </div>
      </div>
    `;
  }

  // ===== 兄弟管理 =====
  function getSiblings() {
    try {
      return JSON.parse(localStorage.getItem('oralFunSiblings') || '[]');
    } catch { return []; }
  }

  function saveSiblings(list) {
    localStorage.setItem('oralFunSiblings', JSON.stringify(list));
  }

  function addSibling() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="parent-screen">
        <div class="parent-header">
          <button class="btn-back-game" onclick="ParentMode.showDashboard()">◀ もどる</button>
          <h2>👧👦 きょうだい追加</h2>
        </div>
        <div class="parent-section" style="padding:20px">
          <p>QRコードのカルテ番号を入力してください</p>
          <div style="margin:12px 0">
            <label>おなまえ（ニックネーム）</label>
            <input type="text" id="sibling-name" class="form-input-parent" placeholder="たろう">
          </div>
          <div style="margin:12px 0">
            <label>カルテNo</label>
            <input type="text" id="sibling-karte" class="form-input-parent" inputmode="numeric" placeholder="12345">
          </div>
          <div style="margin:12px 0">
            <label>医院</label>
            <select id="sibling-clinic" class="form-input-parent">
              <option value="A">岡本</option>
              <option value="B">イースト</option>
            </select>
          </div>
          <button class="btn-game btn-game-next" onclick="ParentMode.saveSibling()">追加する</button>
        </div>
      </div>
    `;
  }

  function saveSibling() {
    const name = document.getElementById('sibling-name')?.value?.trim();
    const karte = document.getElementById('sibling-karte')?.value?.trim();
    const clinic = document.getElementById('sibling-clinic')?.value || 'A';
    if (!karte) { alert('カルテ番号を入力してください'); return; }

    const siblings = getSiblings();
    // 現在の子供も追加（まだリストにいなければ）
    const currentKarte = OralApp.karteNo;
    if (currentKarte && !siblings.find(s => s.karteNo === currentKarte)) {
      siblings.push({ karteNo: currentKarte, clinicCode: OralApp.clinicCode, name: '' });
    }
    // 新しい兄弟を追加
    if (!siblings.find(s => s.karteNo === karte)) {
      siblings.push({ karteNo: karte, clinicCode: clinic, name: name || '' });
    }
    saveSiblings(siblings);
    alert(`${name || karte} を追加しました！`);
    showDashboard();
  }

  function switchChild(karteNo, clinicCode) {
    // URLパラメータを変更してリロード
    const url = new URL(location.href);
    url.searchParams.set('k', karteNo);
    url.searchParams.set('c', clinicCode);
    location.href = url.toString();
  }

  // ===== がんばり表PDF出力 =====
  async function printReport() {
    const karteNo = OralApp.karteNo;
    if (!karteNo) return;

    let streakData = null;
    let logs = [];
    try {
      const sDoc = await db.collection('oralFunctionStreaks').doc(karteNo).get();
      if (sDoc.exists) streakData = sDoc.data();
      const snap = await db.collection('oralFunctionGameLogs')
        .where('karteNo', '==', karteNo)
        .orderBy('date', 'desc')
        .limit(100)
        .get();
      logs = snap.docs.map(d => d.data());
    } catch (e) {}

    if (!streakData) { alert('記録がありません'); return; }

    const stamps = streakData.stamps || {};
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = `${year}年${month + 1}月`;

    // カレンダーHTML生成
    const dayNames = ['日','月','火','水','木','金','土'];
    const firstDay = new Date(year, month, 1).getDay();
    let calHtml = '<table class="report-cal"><tr>';
    dayNames.forEach(d => { calHtml += `<th>${d}</th>`; });
    calHtml += '</tr><tr>';
    for (let i = 0; i < firstDay; i++) calHtml += '<td></td>';
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayStamps = stamps[dateStr] || [];
      const icons = dayStamps.length > 0 ? dayStamps.map(g => {
        const map = { aiube: '😮', brushing: '🪥', blowing: '🌀', tongue: '👅', chewing: '🎵', quiz: '🧠' };
        return map[g] || '⭐';
      }).join('') : '';
      calHtml += `<td class="${dayStamps.length > 0 ? 'report-done' : ''}">${d}<br><span class="report-icons">${icons}</span></td>`;
      if ((firstDay + d) % 7 === 0 && d < daysInMonth) calHtml += '</tr><tr>';
    }
    calHtml += '</tr></table>';

    // 統計
    const daysWithStamps = Object.keys(stamps).filter(k => k.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length;
    const rate = Math.round(daysWithStamps / now.getDate() * 100);

    const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">
      <title>がんばり表 — ${monthName}</title>
      <style>
        body { font-family: 'Noto Sans JP', sans-serif; margin: 20px; color: #1E293B; }
        h1 { text-align: center; font-size: 24px; color: #F97316; }
        .report-header { display: flex; justify-content: space-between; margin: 12px 0; }
        .report-stats { display: flex; gap: 20px; justify-content: center; margin: 16px 0; }
        .report-stat { text-align: center; padding: 12px 20px; background: #FFF7ED; border: 2px solid #FDBA74; border-radius: 12px; }
        .report-stat-num { display: block; font-size: 28px; font-weight: 900; color: #F97316; }
        .report-stat-label { font-size: 12px; color: #78716C; }
        .report-cal { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .report-cal th { background: #FFF7ED; padding: 8px; text-align: center; font-size: 13px; }
        .report-cal td { border: 1px solid #E2E8F0; padding: 6px; text-align: center; height: 50px; vertical-align: top; font-size: 13px; }
        .report-done { background: #D9F99D; }
        .report-icons { font-size: 11px; }
        .report-msg { text-align: center; margin: 20px 0; padding: 16px; border: 3px solid #F59E0B; border-radius: 16px; background: #FFFBEB; }
        .report-msg h2 { font-size: 20px; color: #B45309; }
        .report-footer { text-align: center; font-size: 11px; color: #94A3B8; margin-top: 24px; }
        .report-sign { display: flex; justify-content: space-around; margin-top: 30px; }
        .report-sign-box { width: 150px; border-top: 1px solid #1E293B; padding-top: 4px; text-align: center; font-size: 12px; }
        @media print { body { margin: 10mm; } }
      </style></head><body>
      <h1>🦷 がんばり表</h1>
      <div class="report-header">
        <span><strong>${monthName}</strong></span>
        <span>カルテNo: ${karteNo}</span>
      </div>

      <div class="report-stats">
        <div class="report-stat">
          <span class="report-stat-num">⭐ Lv.${streakData.level || 1}</span>
          <span class="report-stat-label">レベル</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-num">🔥 ${streakData.currentStreak || 0}</span>
          <span class="report-stat-label">連続日数</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-num">${daysWithStamps}/${now.getDate()}</span>
          <span class="report-stat-label">実施日数</span>
        </div>
        <div class="report-stat">
          <span class="report-stat-num">${rate}%</span>
          <span class="report-stat-label">実施率</span>
        </div>
      </div>

      ${calHtml}

      <div class="report-msg">
        <h2>${rate >= 80 ? '🏆 すばらしい！毎日がんばったね！' : rate >= 50 ? '⭐ よくがんばったね！もう少し！' : '💪 来月はもっとがんばろう！'}</h2>
      </div>

      <div class="report-sign">
        <div class="report-sign-box">おうちの人から ひとこと</div>
        <div class="report-sign-box">えいせいしさんから</div>
      </div>

      <div class="report-footer">いがらし歯科 おくちのぼうけん — がんばり表（${monthName}）</div>
      </body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }

  return { show, checkPin, showDashboard, addSibling, saveSibling, switchChild, printReport };
})();
