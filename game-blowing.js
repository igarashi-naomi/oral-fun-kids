// ふーふーチャレンジ — マイク入力で風車やろうそくを吹く
const GameBlowing = (() => {
  const STAGES = [
    { type: 'windmill', emoji: '🌀', label: 'かざぐるまをまわそう！', threshold: 30, targetSec: 3, anim: 'rotate' },
    { type: 'candle', emoji: '', label: 'ろうそくをけそう！', threshold: 40, targetSec: 2, anim: 'candle', svg: true },
    { type: 'dandelion', emoji: '', label: 'たんぽぽのわたげをとばそう！', threshold: 35, targetSec: 4, anim: 'dandelion', svg: true },
    { type: 'balloon', emoji: '', label: 'ふうせんをふくらまそう！', threshold: 25, targetSec: 5, anim: 'balloon', svg: true },
    { type: 'trumpet', emoji: '🎺', label: 'ラッパをふこう！', threshold: 45, targetSec: 3, anim: 'rotate' },
  ];

  // ろうそくSVG
  function candleSVG() {
    return `<svg viewBox="0 0 100 200" width="100" height="200">
      <rect x="38" y="80" width="24" height="100" rx="4" fill="#F5E6CA" stroke="#D4C4A0" stroke-width="1.5"/>
      <rect x="35" y="78" width="30" height="8" rx="3" fill="#E8D8B8"/>
      <line x1="50" y1="78" x2="50" y2="55" stroke="#333" stroke-width="2"/>
      <g id="candle-flame">
        <ellipse cx="50" cy="40" rx="12" ry="22" fill="#FF9800" opacity="0.9"/>
        <ellipse cx="50" cy="38" rx="7" ry="15" fill="#FFEB3B" opacity="0.9"/>
        <ellipse cx="50" cy="36" rx="3" ry="8" fill="#FFF9C4"/>
      </g>
    </svg>`;
  }

  // 風船SVG
  function balloonSVG() {
    return `<svg viewBox="0 0 120 200" width="120" height="200">
      <line x1="60" y1="200" x2="60" y2="140" stroke="#999" stroke-width="1.5"/>
      <ellipse id="balloon-body" cx="60" cy="80" rx="35" ry="50" fill="#FF6B6B" stroke="#E55555" stroke-width="1.5"/>
      <polygon points="50,128 60,145 70,128" fill="#FF6B6B" stroke="#E55555" stroke-width="1"/>
      <ellipse cx="48" cy="65" rx="8" ry="12" fill="white" opacity="0.3" transform="rotate(-20,48,65)"/>
    </svg>`;
  }

  // タンポポ綿毛SVG
  function dandelionSVG() {
    return `<svg viewBox="0 0 200 200" width="140" height="140" style="overflow:visible">
      <!-- 茎 -->
      <line x1="100" y1="200" x2="100" y2="100" stroke="#6B8E23" stroke-width="4" stroke-linecap="round"/>
      <!-- 綿毛の中心 -->
      <circle cx="100" cy="80" r="8" fill="#C8B87C"/>
      <!-- 綿毛（白いふわふわ） -->
      ${Array.from({length: 16}, (_, i) => {
        const angle = (i * 22.5) * Math.PI / 180;
        const len = 28 + (i % 3) * 8;
        const x2 = 100 + Math.cos(angle) * len;
        const y2 = 80 + Math.sin(angle) * len;
        const tx = 100 + Math.cos(angle) * (len + 6);
        const ty = 80 + Math.sin(angle) * (len + 6);
        return `<line x1="100" y1="80" x2="${x2}" y2="${y2}" stroke="#E8E0D0" stroke-width="1.5" class="watage watage-${i}"/>
                <circle cx="${tx}" cy="${ty}" r="4" fill="white" stroke="#DDD" stroke-width="0.5" class="watage watage-${i}" opacity="0.95"/>`;
      }).join('')}
      <!-- 種子の小さな点 -->
      ${Array.from({length: 8}, (_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const x = 100 + Math.cos(angle) * 12;
        const y = 80 + Math.sin(angle) * 12;
        return `<circle cx="${x}" cy="${y}" r="2" fill="#B8A860"/>`;
      }).join('')}
    </svg>`;
  }

  // 綿毛飛散エフェクト
  function flyWatage(progress) {
    const seeds = document.querySelectorAll('.watage');
    seeds.forEach((el, i) => {
      const group = Math.floor(i / 2); // line + circle pair
      const flyAt = group * (100 / 16);
      if (progress > flyAt) {
        const t = Math.min((progress - flyAt) / 30, 1);
        const angle = (group * 22.5 - 90 + (Math.random() - 0.5) * 20) * Math.PI / 180;
        const dx = Math.cos(angle) * t * 120 + t * 60; // 右に流れる（風）
        const dy = Math.sin(angle) * t * 80 - t * 40;  // 上に浮く
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.opacity = `${1 - t * 0.8}`;
        el.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      }
    });
  }

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
          <div class="blow-emoji" id="blow-emoji">${stage.svg ? (stage.type === 'candle' ? candleSVG() : stage.type === 'balloon' ? balloonSVG() : dandelionSVG()) : stage.emoji}</div>
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

      updateMeter();
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
    updateMeter();
    if (blowProgress < 100) {
      animFrame = requestAnimationFrame(tapLoop);
    }
  }

  function updateMeter() {
    const meter = document.getElementById('blow-meter');
    const emoji = document.getElementById('blow-emoji');
    if (meter) meter.style.width = `${Math.min(blowProgress, 100)}%`;

    // ステージ別アニメーション
    const stage = STAGES[currentStage];
    if (emoji) {
      switch (stage?.anim) {
        case 'rotate': // 風車・ラッパ
          emoji.style.transform = `rotate(${blowProgress * 3.6}deg)`;
          emoji.style.transition = 'transform 0.1s';
          break;
        case 'candle': { // ろうそく：炎が揺れて消える
          const flame = document.getElementById('candle-flame');
          if (flame) {
            const flicker = isBlowing ? (Math.random() * 20 - 10) : 0;
            const scale = Math.max(0, 1 - blowProgress / 100);
            flame.style.transform = `scale(${scale}) rotate(${flicker}deg)`;
            flame.style.transformOrigin = '50px 55px';
            flame.style.opacity = scale;
            flame.style.transition = 'transform 0.15s, opacity 0.15s';
          }
          break;
        }
        case 'dandelion': // 綿毛：飛散
          if (isBlowing) flyWatage(blowProgress);
          break;
        case 'balloon': { // 風船：膨らむ
          const body = document.getElementById('balloon-body');
          if (body) {
            const s = 1 + blowProgress / 100;
            body.setAttribute('rx', 35 * s);
            body.setAttribute('ry', 50 * s);
          }
          emoji.style.transform = `scale(${1 + blowProgress / 200})`;
          emoji.style.transition = 'transform 0.2s';
          break;
        }
      }
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
          else { cleanup(); earlyComplete(); }
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

  function earlyComplete() {
    // 途中やめ: クリアしたステージ分だけの得点
    cleanup();
    const duration = Math.round((Date.now() - startTime) / 1000);
    const score = (currentStage + 1) * 20; // クリア済ステージ数
    OralApp.logGameComplete('blowing', score, duration);
    OralApp.showComplete('blowing', score);
  }

  function complete() {
    cleanup();
    const duration = Math.round((Date.now() - startTime) / 1000);
    const score = STAGES.length * 20;
    OralApp.logGameComplete('blowing', score, duration);
    OralApp.showComplete('blowing', score);
  }

  return { start, startMic, tapBlow, tapRelease, nextStage, stop };
})();
