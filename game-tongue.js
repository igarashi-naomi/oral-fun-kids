// べろべろチャレンジ — 舌の運動方向に合わせてタップ
const GameTongue = (() => {
  const DIRECTIONS = [
    { dir: 'up', emoji: '⬆️', label: 'うえ！', instruction: 'べろを うえにあげて', color: '#3B82F6',
      tip: 'べろのさきを うわのはの うらがわにつけよう！' },
    { dir: 'down', emoji: '⬇️', label: 'した！', instruction: 'べろを したにさげて', color: '#10B981',
      tip: 'べろを したくちびるの したまで のばしてみよう！' },
    { dir: 'left', emoji: '⬅️', label: 'ひだり！', instruction: 'べろを ひだりにだして', color: '#F97316',
      tip: 'ひだりのほっぺを べろで おすかんじ！' },
    { dir: 'right', emoji: '➡️', label: 'みぎ！', instruction: 'べろを みぎにだして', color: '#EF4444',
      tip: 'みぎのほっぺを べろで おすかんじ！' },
    { dir: 'spot', emoji: '⏫', label: 'スポット！', instruction: 'べろをうわあごにつけて', color: '#8B5CF6',
      tip: 'うわあごの まえのほうのポコッとしたところ！ここが「スポット」だよ！' },
  ];

  const TOTAL_ROUNDS = 20;
  let currentRound = 0;
  let score = 0;
  let currentDir = null;
  let roundTimer = null;
  let startTime = 0;
  let cameraStream = null;
  let cameraOn = false;

  async function toggleCamera() {
    if (cameraOn) {
      if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
      cameraOn = false;
    } else {
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 160, height: 120 } });
        cameraOn = true;
      } catch(e) { cameraOn = false; }
    }
    nextRound(); // 再描画
  }

  function cameraHtml() {
    if (!cameraOn) return '<button class="aiube-camera-btn" onclick="GameTongue.toggleCamera()">📷 カメラON</button>';
    return `<div class="aiube-camera-wrap">
      <video id="tongue-camera" autoplay playsinline muted style="width:120px;height:90px;border-radius:12px;border:3px solid #FFD700;object-fit:cover;transform:scaleX(-1)"></video>
      <button class="aiube-camera-close" onclick="GameTongue.toggleCamera()">✕</button>
    </div>`;
  }

  function attachCamera() {
    if (!cameraOn || !cameraStream) return;
    const v = document.getElementById('tongue-camera');
    if (v) v.srcObject = cameraStream;
  }

  function start() {
    currentRound = 0;
    score = 0;
    startTime = Date.now();
    nextRound();
  }

  function nextRound() {
    if (currentRound >= TOTAL_ROUNDS) {
      complete();
      return;
    }

    // ランダムな方向を選択
    currentDir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="game-screen tongue-screen" style="background:${currentDir.color}10">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="GameTongue.stop()">◀ やめる</button>
          <span class="game-progress">${currentRound + 1}/${TOTAL_ROUNDS}　⭐ ${score}</span>
        </div>

        <div class="tongue-content">
          ${cameraHtml()}
          <div class="tongue-face">👅</div>
          <div class="tongue-direction" style="color:${currentDir.color}">
            <span class="tongue-arrow">${currentDir.emoji}</span>
            <span class="tongue-label">${currentDir.label}</span>
          </div>
          <p class="tongue-instruction">${currentDir.instruction}</p>
          <p class="tongue-tip">💡 ${currentDir.tip}</p>

          <div class="tongue-buttons">
            <div class="tongue-btn-row">
              <div class="tongue-btn-spacer"></div>
              <button class="tongue-btn" data-dir="up" onclick="GameTongue.tap('up')" style="background:#3B82F620;border-color:#3B82F6">⬆️</button>
              <div class="tongue-btn-spacer"></div>
            </div>
            <div class="tongue-btn-row">
              <button class="tongue-btn" data-dir="left" onclick="GameTongue.tap('left')" style="background:#F9731620;border-color:#F97316">⬅️</button>
              <button class="tongue-btn tongue-btn-center" data-dir="spot" onclick="GameTongue.tap('spot')" style="background:#8B5CF620;border-color:#8B5CF6">⏫</button>
              <button class="tongue-btn" data-dir="right" onclick="GameTongue.tap('right')" style="background:#EF444420;border-color:#EF4444">➡️</button>
            </div>
            <div class="tongue-btn-row">
              <div class="tongue-btn-spacer"></div>
              <button class="tongue-btn" data-dir="down" onclick="GameTongue.tap('down')" style="background:#10B98120;border-color:#10B981">⬇️</button>
              <div class="tongue-btn-spacer"></div>
            </div>
          </div>
        </div>

        <div class="tongue-timer-bar">
          <div class="tongue-timer-fill" id="tongue-timer"></div>
        </div>
      </div>
    `;

    attachCamera();

    // 3秒タイマー
    let remaining = 3000;
    const timerEl = document.getElementById('tongue-timer');
    const startMs = Date.now();

    if (roundTimer) clearInterval(roundTimer);
    roundTimer = setInterval(() => {
      const elapsed = Date.now() - startMs;
      const pct = Math.max(0, (1 - elapsed / 3000) * 100);
      if (timerEl) timerEl.style.width = `${pct}%`;
      if (elapsed >= 3000) {
        clearInterval(roundTimer);
        showResult(false);
      }
    }, 50);
  }

  function tap(dir) {
    if (roundTimer) clearInterval(roundTimer);

    if (dir === currentDir.dir) {
      score += 5;
      try { Sounds.correct(); Effects.sparkle(window.innerWidth/2, window.innerHeight*0.4, 12); Effects.vibrate([20]); } catch(e) {}
      showResult(true);
    } else {
      try { Sounds.wrong(); Effects.screenShake(3, 200); } catch(e) {}
      showResult(false);
    }
  }

  function showResult(correct) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen">
        <div class="tongue-result ${correct ? 'tongue-correct' : 'tongue-wrong'}">
          <div class="tongue-result-icon">${correct ? '⭕' : '❌'}</div>
          <h2>${correct ? 'せいかい！' : 'ざんねん...'}</h2>
        </div>
      </div>
    `;

    setTimeout(() => {
      currentRound++;
      nextRound();
    }, 800);
  }

  function stop() {
    if (roundTimer) clearInterval(roundTimer);
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
    cameraOn = false;
    OralApp.showHome();
  }

  function complete() {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
    cameraOn = false;
    const duration = Math.round((Date.now() - startTime) / 1000);
    OralApp.logGameComplete('tongue', score, duration);
    OralApp.showComplete('tongue', score);
  }

  return { start, tap, stop, toggleCamera };
})();
