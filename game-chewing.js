// もぐもぐリズム — 咀嚼リズムに合わせてタップ
const GameChewing = (() => {
  const BPM_LIST = [
    { bpm: 60, label: 'ゆっくり もぐもぐ', emoji: '🐢', duration: 15 },
    { bpm: 80, label: 'ふつうの もぐもぐ', emoji: '🐰', duration: 15 },
    { bpm: 100, label: 'はやい もぐもぐ', emoji: '🐿️', duration: 15 },
  ];

  let currentLevel = 0;
  let score = 0;
  let hits = 0;
  let misses = 0;
  let beatTimer = null;
  let gameTimer = null;
  let nextBeatTime = 0;
  let beatInterval = 0;
  let startTime = 0;
  let isRunning = false;
  let lastTapTime = 0;

  function start() {
    currentLevel = 0;
    score = 0;
    hits = 0;
    misses = 0;
    startTime = Date.now();
    showLevel();
  }

  function showLevel() {
    if (currentLevel >= BPM_LIST.length) {
      complete();
      return;
    }

    const level = BPM_LIST[currentLevel];
    beatInterval = 60000 / level.bpm;
    isRunning = false;

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen chewing-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="GameChewing.stop()">◀ やめる</button>
          <span class="game-progress">レベル ${currentLevel + 1}/${BPM_LIST.length}　⭐ ${score}</span>
        </div>

        <div class="chew-content">
          <div class="chew-emoji" id="chew-emoji">${level.emoji}</div>
          <p class="chew-label">${level.label}</p>
          <p class="chew-hint" id="chew-hint">リズムにあわせてタップしよう！</p>

          <div class="chew-beat-indicator" id="chew-beat">🟡</div>

          <button class="chew-tap-area" id="chew-tap"
            ontouchstart="GameChewing.tap()" onmousedown="GameChewing.tap()">
            <span class="chew-tap-text">もぐ！</span>
          </button>

          <div class="chew-timer" id="chew-timer-bar">
            <div class="chew-timer-fill" id="chew-timer-fill"></div>
          </div>

          <div class="chew-score" id="chew-score-display">
            <span class="chew-hit">⭕ ${hits}</span>
            <span class="chew-miss">❌ ${misses}</span>
          </div>
        </div>
      </div>
    `;

    // 少し待ってからスタート
    setTimeout(() => {
      isRunning = true;
      nextBeatTime = Date.now();
      startBeat(level);
    }, 1500);
  }

  function startBeat(level) {
    let elapsed = 0;
    const totalMs = level.duration * 1000;

    beatTimer = setInterval(() => {
      if (!isRunning) return;

      // ビートインジケーター
      const beatEl = document.getElementById('chew-beat');
      if (beatEl) {
        beatEl.textContent = '🟠';
        beatEl.style.transform = 'scale(1.3)';
        setTimeout(() => {
          if (beatEl) {
            beatEl.textContent = '🟡';
            beatEl.style.transform = 'scale(1)';
          }
        }, 150);
      }

      nextBeatTime = Date.now();
    }, beatInterval);

    // ゲーム全体タイマー
    const startMs = Date.now();
    gameTimer = setInterval(() => {
      elapsed = Date.now() - startMs;
      const pct = Math.min(elapsed / totalMs * 100, 100);
      const fill = document.getElementById('chew-timer-fill');
      if (fill) fill.style.width = `${pct}%`;

      if (elapsed >= totalMs) {
        clearInterval(gameTimer);
        clearInterval(beatTimer);
        isRunning = false;
        levelComplete();
      }
    }, 100);
  }

  function tap() {
    if (!isRunning) return;
    const now = Date.now();

    // 連打防止（200ms）
    if (now - lastTapTime < 200) return;
    lastTapTime = now;

    // ビートとの誤差判定
    const diff = Math.abs(now - nextBeatTime);
    const tolerance = beatInterval * 0.35; // 35%の許容範囲

    const tapBtn = document.getElementById('chew-tap');

    if (diff < tolerance) {
      hits++;
      score += 10;
      if (tapBtn) { tapBtn.style.background = '#D9F99D'; setTimeout(() => { if (tapBtn) tapBtn.style.background = ''; }, 150); }
    } else {
      misses++;
      if (tapBtn) { tapBtn.style.background = '#FEE2E2'; setTimeout(() => { if (tapBtn) tapBtn.style.background = ''; }, 150); }
    }

    // スコア更新
    const scoreEl = document.getElementById('chew-score-display');
    if (scoreEl) scoreEl.innerHTML = `<span class="chew-hit">⭕ ${hits}</span><span class="chew-miss">❌ ${misses}</span>`;
  }

  function levelComplete() {
    currentLevel++;
    if (currentLevel >= BPM_LIST.length) {
      complete();
      return;
    }

    BreakQuiz.showBreakWithQuiz(
      `レベルクリア！ ⭕${hits} ❌${misses}`,
      (action) => {
        if (action === 'continue') showLevel();
        else { complete(); }
      }
    );
  }

  function stop() {
    if (beatTimer) clearInterval(beatTimer);
    if (gameTimer) clearInterval(gameTimer);
    isRunning = false;
    OralApp.showHome();
  }

  function complete() {
    if (beatTimer) clearInterval(beatTimer);
    if (gameTimer) clearInterval(gameTimer);
    isRunning = false;
    const duration = Math.round((Date.now() - startTime) / 1000);
    OralApp.logGameComplete('chewing', score, duration);
    OralApp.showComplete('chewing', score);
  }

  function cleanup() { if (beatTimer) clearInterval(beatTimer); if (gameTimer) clearInterval(gameTimer); beatTimer = null; gameTimer = null; isRunning = false; }

  return { start, tap, showLevel, stop, cleanup };
})();
