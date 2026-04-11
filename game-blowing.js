// ふーふーチャレンジ — マイク入力で風車やろうそくを吹く
const GameBlowing = (() => {
  const STAGES = [
    { type: 'windmill', emoji: '🌀', label: 'かざぐるまをまわそう！', threshold: 30, targetSec: 3 },
    { type: 'candle', emoji: '🕯️', label: 'ろうそくをけそう！', threshold: 40, targetSec: 2 },
    { type: 'dandelion', emoji: '🌼', label: 'たんぽぽのわたげをとばそう！', threshold: 35, targetSec: 4 },
    { type: 'balloon', emoji: '🎈', label: 'ふうせんをふくらまそう！', threshold: 25, targetSec: 5 },
    { type: 'trumpet', emoji: '🎺', label: 'ラッパをふこう！', threshold: 45, targetSec: 3 },
  ];

  let currentStage = 0;
  let audioCtx = null;
  let analyser = null;
  let micStream = null;
  let animFrame = null;
  let blowProgress = 0;
  let startTime = 0;
  let isBlowing = false;

  function start() {
    currentStage = 0;
    startTime = Date.now();
    showStage();
  }

  function showStage() {
    if (currentStage >= STAGES.length) {
      complete();
      return;
    }

    blowProgress = 0;
    isBlowing = false;
    const stage = STAGES[currentStage];
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="game-screen blowing-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="GameBlowing.stop()">◀ やめる</button>
          <span class="game-progress">ステージ ${currentStage + 1}/${STAGES.length}</span>
        </div>

        <div class="blow-content">
          <div class="blow-emoji" id="blow-emoji">${stage.emoji}</div>
          <p class="blow-instruction">${stage.label}</p>
          <div class="blow-meter">
            <div class="blow-meter-fill" id="blow-meter" style="width:0%"></div>
          </div>
          <p class="blow-hint" id="blow-hint">マイクにむかって「ふー」ってふいてね</p>
          <button class="btn-game btn-game-retry" id="blow-start-btn" onclick="GameBlowing.startMic()">🎤 スタート</button>
        </div>
      </div>
    `;
  }

  async function startMic() {
    const btn = document.getElementById('blow-start-btn');
    if (btn) btn.style.display = 'none';

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      monitorBlow();
    } catch (e) {
      // マイクが使えない場合はタップモードにフォールバック
      const hint = document.getElementById('blow-hint');
      if (hint) hint.textContent = 'マイクがつかえません。ボタンをおしてね！';
      const app = document.getElementById('app');
      const container = app.querySelector('.blow-content');
      if (container) {
        container.innerHTML += `<button class="btn-game btn-game-retry"
          ontouchstart="GameBlowing.tapBlow()" onmousedown="GameBlowing.tapBlow()"
          ontouchend="GameBlowing.tapRelease()" onmouseup="GameBlowing.tapRelease()">
          ふーーー（おしつづけて）</button>`;
      }
    }
  }

  function monitorBlow() {
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const stage = STAGES[currentStage];

    function loop() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      if (avg > stage.threshold) {
        blowProgress += 2;
        isBlowing = true;
      } else {
        isBlowing = false;
      }

      updateMeter(stage);
      if (blowProgress < 100) {
        animFrame = requestAnimationFrame(loop);
      }
    }
    animFrame = requestAnimationFrame(loop);
  }

  // タップモード（マイク不可の場合）
  function tapBlow() {
    isBlowing = true;
    if (!animFrame) tapLoop();
  }

  function tapRelease() {
    isBlowing = false;
  }

  function tapLoop() {
    if (isBlowing) {
      blowProgress += 1.5;
    }
    const stage = STAGES[currentStage];
    updateMeter(stage);
    if (blowProgress < 100) {
      animFrame = requestAnimationFrame(tapLoop);
    }
  }

  function updateMeter(stage) {
    const meter = document.getElementById('blow-meter');
    const emoji = document.getElementById('blow-emoji');
    if (meter) meter.style.width = `${Math.min(blowProgress, 100)}%`;

    // 吹いてる間のアニメーション
    if (emoji && isBlowing) {
      emoji.style.transform = `rotate(${blowProgress * 3.6}deg) scale(${1 + blowProgress / 200})`;
    }

    if (blowProgress >= 100) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
      stageClear();
    }
  }

  function stageClear() {
    const stage = STAGES[currentStage];
    if (currentStage < STAGES.length - 1) {
      BreakQuiz.showBreakWithQuiz(
        `${stage.emoji} ステージ${currentStage + 1} クリア！`,
        (action) => {
          if (action === 'continue') nextStage();
          else { cleanup(); complete(); }
        }
      );
    } else {
      nextStage(); // 最終ステージ→complete
    }
  }

  function nextStage() {
    currentStage++;
    showStage();
  }

  function stop() {
    cleanup();
    OralApp.showHome();
  }

  function cleanup() {
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = null;
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    analyser = null;
  }

  function complete() {
    cleanup();
    const duration = Math.round((Date.now() - startTime) / 1000);
    OralApp.logGameComplete('blowing', STAGES.length * 20, duration);
    OralApp.showComplete('blowing', STAGES.length * 20);
  }

  return { start, startMic, tapBlow, tapRelease, nextStage, stop };
})();
