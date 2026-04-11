// 実績バッジ + 週間チャレンジ
const Achievements = (() => {
  const BADGES = [
    { id: 'first_exercise', name: 'はじめてのたいそう', icon: '🌱', desc: 'はじめてたいそうをした', check: s => s.totalSessions >= 1 },
    { id: 'streak_3', name: '3にちれんぞく', icon: '🔥', desc: '3日つづけた', check: s => s.longestStreak >= 3 },
    { id: 'streak_7', name: '1しゅうかん', icon: '💪', desc: '7日つづけた', check: s => s.longestStreak >= 7 },
    { id: 'streak_14', name: '2しゅうかん', icon: '⚡', desc: '14日つづけた', check: s => s.longestStreak >= 14 },
    { id: 'streak_30', name: '1かげつ！', icon: '🏆', desc: '30日つづけた！すごい！', check: s => s.longestStreak >= 30 },
    { id: 'streak_100', name: '100にちでんせつ', icon: '👑', desc: '100日！でんせつ！', check: s => s.longestStreak >= 100 },
    { id: 'total_10', name: '10かいたいそう', icon: '⭐', desc: '10かいたいそうした', check: s => s.totalSessions >= 10 },
    { id: 'total_50', name: '50かい', icon: '🌟', desc: '50かいたいそう！', check: s => s.totalSessions >= 50 },
    { id: 'total_100', name: '100かい', icon: '💎', desc: '100かい！マスター！', check: s => s.totalSessions >= 100 },
    { id: 'cards_10', name: '10まいコレクター', icon: '📖', desc: 'カードを10まいあつめた', check: (s, c) => c >= 10 },
    { id: 'cards_25', name: '25まい', icon: '📚', desc: 'カード25まい！', check: (s, c) => c >= 25 },
    { id: 'cards_all', name: 'コンプリート！', icon: '🎖️', desc: 'ぜんぶのカードをあつめた！', check: (s, c) => c >= CARD_DATA.length },
    { id: 'stage_3', name: 'ステージ3', icon: '🗝️', desc: 'ステージ3に すすんだ', check: s => (s.unlockedStage || 1) >= 3 },
    { id: 'stage_5', name: 'ぜんステージ', icon: '🏅', desc: 'ぜんぶのステージをかいほう', check: s => (s.unlockedStage || 1) >= 5 },
    { id: 'level_5', name: 'レベル5', icon: '🎯', desc: 'レベル5にとうたつ', check: s => (s.level || 1) >= 5 },
    { id: 'level_10', name: 'レベル10', icon: '🔱', desc: 'レベル10！', check: s => (s.level || 1) >= 10 },
  ];

  function getEarned(streakData) {
    const cards = typeof Collection !== 'undefined' ? Collection.getCollectedCount() : 0;
    const s = streakData || {};
    return BADGES.filter(b => b.check(s, cards));
  }

  function getNew(streakData) {
    const earned = getEarned(streakData);
    const seen = getSeen();
    return earned.filter(b => !seen.includes(b.id));
  }

  function getSeen() {
    try { return JSON.parse(localStorage.getItem('oralFunBadgesSeen') || '[]'); } catch { return []; }
  }

  function markSeen(badgeIds) {
    const seen = getSeen();
    badgeIds.forEach(id => { if (!seen.includes(id)) seen.push(id); });
    localStorage.setItem('oralFunBadgesSeen', JSON.stringify(seen));
  }

  // 新しいバッジがあれば表示
  function checkAndShowNew(streakData, onDone) {
    const newBadges = getNew(streakData);
    if (newBadges.length === 0) { if (onDone) onDone(); return; }
    showBadgeUnlock(newBadges, 0, onDone);
  }

  function showBadgeUnlock(badges, idx, onDone) {
    if (idx >= badges.length) {
      markSeen(badges.map(b => b.id));
      if (onDone) onDone();
      return;
    }
    const b = badges[idx];
    const app = document.getElementById('app');
    try { Effects.fullConfetti(); Sounds.fanfare(); } catch(e) {}

    app.innerHTML = `
      <div class="complete-screen" style="background:linear-gradient(180deg,#FEF3C7,#FFFBEB)">
        <div class="badge-unlock">
          <p class="badge-unlock-label">🏆 じつせきかいほう！</p>
          <div class="badge-icon-big">${b.icon}</div>
          <h2 class="badge-name-big">${b.name}</h2>
          <p class="badge-desc">${b.desc}</p>
        </div>
        <button class="btn-game btn-game-next" onclick="Achievements._nextBadge()" style="margin-top:20px">
          ${idx < badges.length - 1 ? 'つぎのバッジ →' : 'つづける'}
        </button>
      </div>
    `;

    Achievements._badgeQueue = badges;
    Achievements._badgeIdx = idx;
    Achievements._badgeDone = onDone;
  }

  function _nextBadge() {
    showBadgeUnlock(Achievements._badgeQueue, Achievements._badgeIdx + 1, Achievements._badgeDone);
  }

  // 実績一覧表示
  function showAll(streakData) {
    const earned = getEarned(streakData);
    const earnedIds = earned.map(b => b.id);
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="album-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <span class="game-progress">🏆 じつせき ${earned.length}/${BADGES.length}</span>
        </div>
        <div class="badge-grid">
          ${BADGES.map(b => {
            const got = earnedIds.includes(b.id);
            return `
              <div class="badge-card ${got ? 'badge-earned' : 'badge-locked'}">
                <span class="badge-icon">${got ? b.icon : '🔒'}</span>
                <span class="badge-name">${got ? b.name : '？？？'}</span>
                ${got ? `<span class="badge-desc-sm">${b.desc}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  return { getEarned, checkAndShowNew, showAll, _nextBadge, _badgeQueue: [], _badgeIdx: 0, _badgeDone: null };
})();
