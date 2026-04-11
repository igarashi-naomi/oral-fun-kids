// ワールドマップ — 冒険の進捗を可視化するSVGマップ
const WorldMap = (() => {

  // ステージ位置（SVG座標）
  const MAP_NODES = [
    { stage: 1, x: 60, y: 380, icon: '😮', label: 'あいうべ', unlockLabel: 'スタート' },
    { stage: 2, x: 180, y: 300, icon: '🪥', label: 'はみがき', unlockLabel: 'ステージ2' },
    { stage: 3, x: 80, y: 210, icon: '🌀', label: 'ふーふー', unlockLabel: 'ステージ3' },
    { stage: 4, x: 220, y: 140, icon: '👅', label: 'べろべろ', unlockLabel: 'ステージ4' },
    { stage: 5, x: 120, y: 60, icon: '🎵', label: 'もぐもぐ', unlockLabel: 'ステージ5' },
  ];

  function show(unlockedStage, theme) {
    const app = document.getElementById('app');
    const themeColors = {
      kingdom: { path: '#F59E0B', bg: 'linear-gradient(180deg,#1E3A5F,#2D1B69)', nodeBg: '#1E293B' },
      fairy: { path: '#EC4899', bg: 'linear-gradient(180deg,#FDF2F8,#EDE9FE)', nodeBg: '#FDF2F8' },
      space: { path: '#06B6D4', bg: 'linear-gradient(180deg,#0F172A,#1E1B4B)', nodeBg: '#0F172A' },
      animal: { path: '#059669', bg: 'linear-gradient(180deg,#ECFDF5,#D1FAE5)', nodeBg: '#ECFDF5' },
      lab: { path: '#7C3AED', bg: 'linear-gradient(180deg,#F8FAFC,#EDE9FE)', nodeBg: '#F8FAFC' },
    };
    const tc = themeColors[theme?.id] || themeColors.kingdom;

    // パス（道）のSVG
    let pathD = 'M';
    MAP_NODES.forEach((n, i) => {
      pathD += `${n.x + 25} ${n.y + 25}`;
      if (i < MAP_NODES.length - 1) pathD += ' L';
    });

    const nodesHtml = MAP_NODES.map(n => {
      const unlocked = n.stage <= unlockedStage;
      const current = n.stage === unlockedStage;
      const completed = n.stage < unlockedStage;
      const themeName = theme?.games?.[getGameIdForStage(n.stage)]?.name || n.label;

      return `
        <g class="map-node" transform="translate(${n.x},${n.y})">
          <!-- ノード背景 -->
          <circle cx="25" cy="25" r="30" fill="${unlocked ? (completed ? '#10B981' : tc.path) : '#475569'}"
            opacity="${unlocked ? 1 : 0.3}" stroke="${current ? '#fff' : 'none'}" stroke-width="${current ? 3 : 0}"/>
          ${current ? `<circle cx="25" cy="25" r="35" fill="none" stroke="${tc.path}" stroke-width="2" opacity="0.5">
            <animate attributeName="r" values="35;42;35" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite"/>
          </circle>` : ''}
          <!-- アイコン -->
          <text x="25" y="32" text-anchor="middle" font-size="${unlocked ? 24 : 18}"
            opacity="${unlocked ? 1 : 0.3}">${unlocked ? n.icon : '🔒'}</text>
          <!-- ラベル -->
          <text x="25" y="62" text-anchor="middle" font-size="10" fill="${unlocked ? '#fff' : '#64748B'}"
            font-weight="700">${unlocked ? themeName : n.unlockLabel}</text>
          ${completed ? `<text x="42" y="8" font-size="14">✅</text>` : ''}
        </g>
      `;
    }).join('');

    app.innerHTML = `
      <div class="map-screen" style="background:${tc.bg}">
        <div class="game-top-bar" style="position:relative;z-index:2">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <span class="game-progress" style="color:#fff">🗺️ ぼうけんマップ</span>
        </div>
        <div class="map-container">
          <svg viewBox="0 0 300 460" class="map-svg">
            <!-- 道 -->
            <path d="${pathD}" fill="none" stroke="${tc.path}" stroke-width="4" stroke-dasharray="8,4" opacity="0.5"/>
            <!-- アクティブな道 -->
            <path d="${getActivePath(unlockedStage)}" fill="none" stroke="${tc.path}" stroke-width="4"/>
            <!-- デコレーション -->
            <text x="260" y="400" font-size="20" opacity="0.3">🌳</text>
            <text x="30" y="300" font-size="16" opacity="0.3">🌿</text>
            <text x="240" y="200" font-size="18" opacity="0.3">⛰️</text>
            <text x="40" y="100" font-size="20" opacity="0.3">🏰</text>
            <text x="200" y="50" font-size="14" opacity="0.3">⭐</text>
            <!-- ノード -->
            ${nodesHtml}
            <!-- キャラクター位置（現在ステージ） -->
            ${renderCharOnMap(unlockedStage, theme)}
          </svg>
        </div>
      </div>
    `;
  }

  function getGameIdForStage(stage) {
    const map = { 1: 'aiube', 2: 'brushing', 3: 'blowing', 4: 'tongue', 5: 'chewing' };
    return map[stage] || 'aiube';
  }

  function getActivePath(unlockedStage) {
    const active = MAP_NODES.filter(n => n.stage <= unlockedStage);
    if (active.length < 2) return `M${active[0]?.x + 25 || 85} ${active[0]?.y + 25 || 405}`;
    let d = 'M';
    active.forEach((n, i) => {
      d += `${n.x + 25} ${n.y + 25}`;
      if (i < active.length - 1) d += ' L';
    });
    return d;
  }

  function renderCharOnMap(unlockedStage, theme) {
    const node = MAP_NODES.find(n => n.stage === unlockedStage) || MAP_NODES[0];
    const mascot = theme?.mascot || '🦷';
    return `
      <text x="${node.x + 25}" y="${node.y - 10}" text-anchor="middle" font-size="22">
        ${mascot}
        <animate attributeName="y" values="${node.y - 10};${node.y - 16};${node.y - 10}" dur="1.5s" repeatCount="indefinite"/>
      </text>
    `;
  }

  return { show };
})();
