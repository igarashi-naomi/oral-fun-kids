// 保護者モード
const ParentMode = (() => {
  const PIN = '1234'; // デフォルトPIN

  function show() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="parent-screen">
        <div class="parent-header">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <h2>🔒 ほごしゃモード</h2>
        </div>
        <div class="parent-pin-form">
          <p>あんしょうばんごうをにゅうりょくしてください</p>
          <input type="password" id="parent-pin" class="pin-input" maxlength="4" inputmode="numeric" placeholder="****">
          <button class="btn-game btn-game-home" onclick="ParentMode.checkPin()">かくにん</button>
        </div>
      </div>
    `;
  }

  async function checkPin() {
    const input = document.getElementById('parent-pin').value;
    if (input !== PIN) {
      alert('あんしょうばんごうがちがいます');
      return;
    }
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
          .limit(30)
          .get();
        recentLogs = snap.docs.map(d => d.data());

        const sDoc = await db.collection('oralFunctionStreaks').doc(karteNo).get();
        if (sDoc.exists) streakData = sDoc.data();
      } catch (e) {
        console.error('データ取得エラー:', e);
      }
    }

    const gameNames = { aiube: 'あいうべ体操', brushing: 'はみがき', blowing: 'ふーふー', tongue: 'べろべろ', chewing: 'もぐもぐ' };

    app.innerHTML = `
      <div class="parent-screen">
        <div class="parent-header">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <h2>📊 保護者ダッシュボード</h2>
        </div>

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
        ` : '<p style="text-align:center;color:#94A3B8">まだ記録がありません</p>'}

        <h3 style="margin:16px 0 8px;font-size:16px">最近の記録</h3>
        <div class="parent-log-list">
          ${recentLogs.length === 0 ? '<p style="color:#94A3B8">記録なし</p>' :
            recentLogs.map(l => `
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

  return { show, checkPin };
})();
