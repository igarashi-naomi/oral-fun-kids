// スタンプカレンダー
const StampCalendar = (() => {
  async function show() {
    const app = document.getElementById('app');
    const karteNo = OralApp.karteNo;

    let stamps = {};
    let streak = 0;
    let level = 1;

    if (karteNo) {
      try {
        const doc = await db.collection('oralFunctionStreaks').doc(karteNo).get();
        if (doc.exists) {
          const d = doc.data();
          stamps = d.stamps || {};
          streak = d.currentStreak || 0;
          level = d.level || 1;
        }
      } catch (e) {}
    }

    // 今月のカレンダー生成
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const dayNames = ['日','月','火','水','木','金','土'];

    let calHtml = '<div class="cal-grid">';
    dayNames.forEach(d => { calHtml += `<div class="cal-day-header">${d}</div>`; });
    for (let i = 0; i < firstDay; i++) calHtml += '<div class="cal-empty"></div>';

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayStamps = stamps[dateStr] || [];
      const isToday = d === today;
      const hasStamp = dayStamps.length > 0;

      const icons = dayStamps.map(g => {
        const map = { aiube: '😮', brushing: '🪥', blowing: '🌀', tongue: '👅', chewing: '🎵' };
        return map[g] || '⭐';
      }).join('');

      calHtml += `
        <div class="cal-day ${isToday ? 'cal-today' : ''} ${hasStamp ? 'cal-stamped' : ''}">
          <span class="cal-day-num">${d}</span>
          ${hasStamp ? `<span class="cal-stamp">${icons}</span>` : ''}
        </div>
      `;
    }
    calHtml += '</div>';

    app.innerHTML = `
      <div class="calendar-screen">
        <div class="cal-header">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <h2>📅 スタンプカレンダー</h2>
        </div>
        <div class="cal-stats">
          <span class="cal-stat">⭐ レベル ${level}</span>
          <span class="cal-stat">🔥 ${streak}日れんぞく</span>
        </div>
        <h3 class="cal-month">${year}年${monthNames[month]}</h3>
        ${calHtml}
        <p class="cal-legend">
          😮あいうべ 🪥はみがき 🌀ふーふー 👅べろべろ 🎵もぐもぐ
        </p>
      </div>
    `;
  }

  return { show };
})();
