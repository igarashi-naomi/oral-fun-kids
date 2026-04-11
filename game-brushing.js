// ピカピカはみがきゲーム — 乳歯20本をスワイプでみがく
const GameBrushing = (() => {
  // 乳歯20本の配置（SVG座標）
  const TEETH = [
    // 上顎右 E,D,C,B,A
    { id: 'UR-E', x: 60, y: 80, w: 28, h: 32, label: 'E', row: 'upper' },
    { id: 'UR-D', x: 92, y: 65, w: 26, h: 30, label: 'D', row: 'upper' },
    { id: 'UR-C', x: 120, y: 55, w: 22, h: 28, label: 'C', row: 'upper' },
    { id: 'UR-B', x: 144, y: 48, w: 22, h: 26, label: 'B', row: 'upper' },
    { id: 'UR-A', x: 168, y: 45, w: 24, h: 26, label: 'A', row: 'upper' },
    // 上顎左 A,B,C,D,E
    { id: 'UL-A', x: 198, y: 45, w: 24, h: 26, label: 'A', row: 'upper' },
    { id: 'UL-B', x: 224, y: 48, w: 22, h: 26, label: 'B', row: 'upper' },
    { id: 'UL-C', x: 248, y: 55, w: 22, h: 28, label: 'C', row: 'upper' },
    { id: 'UL-D', x: 272, y: 65, w: 26, h: 30, label: 'D', row: 'upper' },
    { id: 'UL-E', x: 302, y: 80, w: 28, h: 32, label: 'E', row: 'upper' },
    // 下顎右 E,D,C,B,A
    { id: 'LR-E', x: 60, y: 200, w: 28, h: 32, label: 'E', row: 'lower' },
    { id: 'LR-D', x: 92, y: 215, w: 26, h: 30, label: 'D', row: 'lower' },
    { id: 'LR-C', x: 120, y: 225, w: 22, h: 28, label: 'C', row: 'lower' },
    { id: 'LR-B', x: 144, y: 232, w: 22, h: 26, label: 'B', row: 'lower' },
    { id: 'LR-A', x: 168, y: 235, w: 24, h: 26, label: 'A', row: 'lower' },
    // 下顎左
    { id: 'LL-A', x: 198, y: 235, w: 24, h: 26, label: 'A', row: 'lower' },
    { id: 'LL-B', x: 224, y: 232, w: 22, h: 26, label: 'B', row: 'lower' },
    { id: 'LL-C', x: 248, y: 225, w: 22, h: 28, label: 'C', row: 'lower' },
    { id: 'LL-D', x: 272, y: 215, w: 26, h: 30, label: 'D', row: 'lower' },
    { id: 'LL-E', x: 302, y: 200, w: 28, h: 32, label: 'E', row: 'lower' },
  ];

  let dirtyTeeth = {};
  let cleanedCount = 0;
  let totalDirty = 0;
  let timerSec = 180; // 3分
  let timerInterval = null;
  let startTime = 0;
  let isBrushing = false;

  function start() {
    cleanedCount = 0;
    timerSec = 180;
    startTime = Date.now();

    // ランダムに汚れを配置（全歯に50-100%の汚れ）
    dirtyTeeth = {};
    TEETH.forEach(t => {
      dirtyTeeth[t.id] = 30 + Math.floor(Math.random() * 71); // 30-100の汚れ
    });
    totalDirty = TEETH.length;

    render();
    startTimer();
  }

  function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen brushing-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="GameBrushing.stop()">◀ やめる</button>
          <span class="game-progress" id="brush-timer">⏱️ ${formatTime(timerSec)}</span>
          <span class="game-progress" id="brush-count">🪥 ${cleanedCount}/${totalDirty}</span>
        </div>

        <p class="brush-instruction">ゆびでこすって バイキンをやっつけよう！</p>

        <div class="brush-mouth" id="brush-mouth">
          <svg viewBox="0 0 390 310" class="brush-svg" id="brush-svg">
            <!-- 上顎アーチ -->
            <ellipse cx="195" cy="140" rx="155" ry="110" fill="none" stroke="#FECACA" stroke-width="2" stroke-dasharray="4"/>
            <!-- 下顎アーチ -->
            <ellipse cx="195" cy="170" rx="155" ry="100" fill="none" stroke="#FECACA" stroke-width="2" stroke-dasharray="4"/>

            ${TEETH.map(t => {
              const dirt = dirtyTeeth[t.id] || 0;
              const isClean = dirt <= 0;
              const fillColor = isClean ? '#FFFFFF' : `rgba(140,200,60,${dirt / 100 * 0.8})`;
              const strokeColor = isClean ? '#D1D5DB' : '#84CC16';
              return `
                <g class="brush-tooth" data-id="${t.id}">
                  <rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" rx="6" ry="6"
                    fill="${fillColor}" stroke="${strokeColor}" stroke-width="2"
                    id="tooth-${t.id}"/>
                  ${!isClean ? `<text x="${t.x + t.w/2}" y="${t.y + t.h/2 + 4}" text-anchor="middle" font-size="14" fill="#65A30D">🦠</text>` : `<text x="${t.x + t.w/2}" y="${t.y + t.h/2 + 4}" text-anchor="middle" font-size="12">✨</text>`}
                </g>
              `;
            }).join('')}
          </svg>
        </div>

        <div class="brush-progress-bar">
          <div class="brush-progress-fill" id="brush-progress" style="width:${cleanedCount / totalDirty * 100}%"></div>
        </div>
      </div>
    `;

    // タッチイベント
    const svg = document.getElementById('brush-svg');
    svg.addEventListener('touchmove', onBrush, { passive: false });
    svg.addEventListener('mousemove', onBrush);
    svg.addEventListener('touchstart', () => { isBrushing = true; }, { passive: true });
    svg.addEventListener('touchend', () => { isBrushing = false; });
    svg.addEventListener('mousedown', () => { isBrushing = true; });
    svg.addEventListener('mouseup', () => { isBrushing = false; });
  }

  function onBrush(e) {
    if (!isBrushing) return;
    e.preventDefault();

    const svg = document.getElementById('brush-svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = 390 / rect.width;
    const scaleY = 310 / rect.height;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const svgX = (clientX - rect.left) * scaleX;
    const svgY = (clientY - rect.top) * scaleY;

    // 各歯との衝突判定
    TEETH.forEach(t => {
      if (svgX >= t.x - 5 && svgX <= t.x + t.w + 5 && svgY >= t.y - 5 && svgY <= t.y + t.h + 5) {
        brushTooth(t.id);
      }
    });
  }

  function brushTooth(id) {
    if (!dirtyTeeth[id] || dirtyTeeth[id] <= 0) return;
    dirtyTeeth[id] -= 8; // 1スワイプで8%除去

    const toothEl = document.getElementById(`tooth-${id}`);
    if (!toothEl) return;

    if (dirtyTeeth[id] <= 0) {
      dirtyTeeth[id] = 0;
      cleanedCount++;
      // きれいになった — エフェクト付き
      toothEl.setAttribute('fill', '#FFFFFF');
      toothEl.setAttribute('stroke', '#D1D5DB');
      const g = toothEl.parentElement;
      const text = g.querySelector('text');
      if (text) { text.textContent = '✨'; text.setAttribute('font-size', '12'); text.setAttribute('fill', '#000'); }
      // エフェクト
      try {
        const rect = toothEl.getBoundingClientRect();
        Effects.sparkle(rect.left + rect.width/2, rect.top + rect.height/2, 8);
        Effects.scorePopup('+5', rect.left + rect.width/2, rect.top, '#3B82F6');
        Effects.vibrate([15]);
        Sounds.tap();
      } catch(e) {}

      // 進捗更新
      const countEl = document.getElementById('brush-count');
      if (countEl) countEl.textContent = `🪥 ${cleanedCount}/${totalDirty}`;
      const progEl = document.getElementById('brush-progress');
      if (progEl) progEl.style.width = `${cleanedCount / totalDirty * 100}%`;

      if (cleanedCount >= totalDirty) {
        complete();
      }
    } else {
      const opacity = dirtyTeeth[id] / 100 * 0.8;
      toothEl.setAttribute('fill', `rgba(140,200,60,${opacity})`);
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timerSec--;
      const el = document.getElementById('brush-timer');
      if (el) el.textContent = `⏱️ ${formatTime(timerSec)}`;
      if (timerSec <= 0) {
        complete();
      }
    }, 1000);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function stop() {
    if (timerInterval) clearInterval(timerInterval);
    OralApp.showHome();
  }

  function complete() {
    if (timerInterval) clearInterval(timerInterval);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const score = Math.round(cleanedCount / totalDirty * 100);
    OralApp.logGameComplete('brushing', score, duration);
    OralApp.showComplete('brushing', score);
  }

  function cleanup() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

  return { start, stop, cleanup };
})();
