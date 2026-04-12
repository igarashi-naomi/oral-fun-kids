// あいうべ体操ゲーム
const GameAiube = (() => {
  const POSES = [
    {
      char: 'あ', face: '😮', instruction: 'おおきく「あー」', color: '#EF4444', holdSec: 5,
      points: [
        'おくちを たてに おおきくあけよう',
        'のどのおくが みえるくらい パカッ！',
        'あごが いたくなるほど おおきくね'
      ],
      muscle: 'おくちのまわり ぜんぶのきんにく',
      why: 'あごをおおきくあけると おくちのまわりの きんにくがきたえられるよ！'
    },
    {
      char: 'い', face: '😬', instruction: 'よこに「いー」', color: '#F97316', holdSec: 5,
      points: [
        'くちびるを よこに おもいきりひっぱろう',
        'はが ぜんぶ みえるくらい「にーっ」',
        'ほっぺの きんにくが ピーンとはるかんじ'
      ],
      muscle: 'ほっぺときんにく（きょうきん）',
      why: 'ほっぺのきんにくが きたえられて、たべものが こぼれにくくなるよ！'
    },
    {
      char: 'う', face: '😗', instruction: 'まえに「うー」', color: '#3B82F6', holdSec: 5,
      points: [
        'くちびるを まえに つきだそう！',
        'タコの おくちみたいに とがらせてね',
        'くちびるに ちからを いれてキープ'
      ],
      muscle: 'くちびるのきんにく（こうりんきん）',
      why: 'くちびるが つよくなると おくちが とじやすくなって はなこきゅうに なるよ！'
    },
    {
      char: 'べ', face: '😛', instruction: 'べろを「べー」', color: '#10B981', holdSec: 5,
      points: [
        'べろを したに おもいきり だそう！',
        'あごに つくくらい ながーく！',
        'べろの さきまで ちからをいれてね'
      ],
      muscle: 'べろのきんにく（ぜつきん）',
      why: 'べろが つよくなると、たべものを うまくうごかせて ごっくんしやすくなるよ！'
    },
  ];

  const TOTAL_SETS = 1; // 1セット（あいうべ3回→パタカラ1回→完了 約1.5分）
  const REPS_PER_SET = 3; // あいうべ3回

  // パタカラフレーズ（ランダムで使用）
  const PATAKARA_PHRASES = [
    { text: 'パンダのたからもの！', icon: '🐼', audio: 'patakara-panda.wav', character: 'パンダ' },
    { text: 'ラララレモン！', icon: '🍋', audio: 'patakara-lemon.wav', character: 'レモンくん' },
    { text: 'カラスのパンたべた！', icon: '🐦‍⬛', audio: 'patakara-karasu.wav', character: 'カラス' },
    { text: 'パパたかラッパ！', icon: '🎺', audio: 'patakara-papa.wav', character: 'パパ' },
    { text: 'パラパラたらこ！', icon: '🐙', audio: 'patakara-tarako.wav', character: 'たらこ' },
    { text: 'タラコパスタからい！', icon: '🍝', audio: 'patakara-pasta.wav', character: 'パスタ' },
    { text: 'なまむぎ なまごめ\nなまたまご！', icon: '🥚', audio: 'patakara-egg.wav', character: 'たまごちゃん' },
  ];
  let shuffledPatakara = [];

  let currentPose = 0;
  let currentRep = 0;
  let currentSet = 0;
  let timer = null;
  let countdown = 0;
  let startTime = 0;

  function start() {
    if (timer) clearInterval(timer);
    currentPose = 0;
    currentRep = 0;
    currentSet = 0;
    startTime = Date.now();
    // パタカラフレーズをシャッフル
    shuffledPatakara = [...PATAKARA_PHRASES].sort(() => Math.random() - 0.5);
    showPose();
  }

  function showPose() {
    const pose = POSES[currentPose];
    const app = document.getElementById('app');
    countdown = pose.holdSec;

    // 最初の数回は詳しいポイント表示、慣れたら簡易表示
    const showDetail = currentRep < 3;
    const pointHtml = showDetail ? `
      <div class="aiube-points">
        ${pose.points.map(p => `<div class="aiube-point">👉 ${p}</div>`).join('')}
        <div class="aiube-muscle">💪 きたえるきんにく: ${pose.muscle}</div>
      </div>
    ` : `<p class="aiube-hint">${pose.why}</p>`;

    app.innerHTML = `
      <div class="game-screen" style="background:${pose.color}15">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ やめる</button>
          <span class="game-progress">${currentSet + 1}セット　${currentRep + 1}/${REPS_PER_SET}</span>
        </div>

        <div class="aiube-content">
          <div class="aiube-face" style="border-color:${pose.color}" id="aiube-face">${pose.face}</div>
          <div class="aiube-char" style="color:${pose.color}">${pose.char}</div>
          <p class="aiube-instruction">${pose.instruction}</p>
          <div class="aiube-timer" id="aiube-timer">
            <div class="aiube-timer-circle" style="border-color:${pose.color}">
              <span id="aiube-countdown">${countdown}</span>
            </div>
          </div>
          ${pointHtml}
        </div>
      </div>
    `;

    // VOICEVOX音声（「おおきく あー！」等）
    try { Voice.aiube(pose.char); Sounds.tap(); } catch(e) {}

    startCountdown(pose);
  }

  function startCountdown(pose) {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      countdown--;
      const el = document.getElementById('aiube-countdown');
      if (el) el.textContent = countdown;
      try { Sounds.tick(); Voice.countdown(countdown); } catch(e) {}

      // フェイスのパルスアニメーション強化
      const face = document.getElementById('aiube-face');
      if (face && countdown <= 2) {
        face.style.animation = 'pulse 0.5s ease-in-out infinite';
      }

      if (countdown <= 0) {
        clearInterval(timer);
        try {
          Sounds.tap();
          Effects.sparkle(window.innerWidth / 2, window.innerHeight * 0.3, 10);
          Effects.scorePopup('+10', window.innerWidth / 2, window.innerHeight * 0.25, pose.color);
          Effects.vibrate([20]);
        } catch(e) {}
        nextPose();
      }
    }, 1000);
  }

  function nextPose() {
    currentPose++;
    if (currentPose >= POSES.length) {
      currentPose = 0;
      currentRep++;
      if (currentRep >= REPS_PER_SET) {
        currentRep = 0;
        currentSet++;
        if (currentSet >= TOTAL_SETS) {
          // 完了前にパタカラ1回
          showPatakaraBeforeComplete();
          return;
        }
        // セット間休憩
        showBreak();
        return;
      }
    }
    showPose();
  }

  function showBreak() {
    // セット間にパタカラフレーズを練習
    const phraseIdx = (currentSet - 1) % shuffledPatakara.length;
    const phrase = shuffledPatakara[phraseIdx];
    showPatakaraScreen(phrase);
  }

  function showPatakaraScreen(phrase) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen patakara-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ やめる</button>
          <span class="game-progress">${currentSet}/${TOTAL_SETS}セット</span>
        </div>

        <div class="patakara-content">
          <div class="patakara-character">${typeof Anim !== 'undefined' ? Anim.patakaraChar(phrase.icon, 80) : phrase.icon}</div>
          <h2 class="patakara-title">${phrase.character}といっしょに！</h2>
          <p class="patakara-instruction">おおきな声で3かいいってみよう！</p>

          <div class="patakara-phrase" id="patakara-phrase">
            ${phrase.text.replace('\n', '<br>')}
          </div>

          <div class="patakara-counter">
            <span class="patakara-count" id="patakara-count">0</span> / 3かい
          </div>

          <button class="patakara-say-btn" id="patakara-btn" onclick="GameAiube.sayPatakara()">
            🗣️ いえたらタップ！
          </button>
        </div>
      </div>
    `;

    GameAiube._patakaraCount = 0;
    GameAiube._currentPhrase = phrase;

    // 音声再生
    try { Voice.play(phrase.audio); } catch(e) {}
  }

  function sayPatakara() {
    GameAiube._patakaraCount++;
    const countEl = document.getElementById('patakara-count');
    if (countEl) countEl.textContent = GameAiube._patakaraCount;

    try {
      Sounds.tap();
      Effects.sparkle(window.innerWidth / 2, window.innerHeight * 0.5, 10);
      Effects.vibrate([20]);
    } catch(e) {}

    if (GameAiube._patakaraCount >= 3) {
      // パタカラ完了 → エフェクト → 次のセットへ
      try {
        Sounds.correct();
        Effects.confetti(window.innerWidth / 2, window.innerHeight * 0.3, 25);
        Effects.scorePopup('すごい！', window.innerWidth / 2 - 30, window.innerHeight * 0.2, '#F97316');
      } catch(e) {}

      const btn = document.getElementById('patakara-btn');
      if (btn) {
        btn.textContent = 'つぎへ →';
        btn.onclick = () => resumeNextSet();
      }
    } else {
      // もう一回音声再生
      try { Voice.play(GameAiube._currentPhrase.audio); } catch(e) {}
    }
  }

  function showPatakaraBeforeComplete() {
    const phrase = shuffledPatakara[0];
    showPatakaraScreenFinal(phrase);
  }

  function showPatakaraScreenFinal(phrase) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen patakara-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ やめる</button>
          <span class="game-progress">さいごのトレーニング！</span>
        </div>
        <div class="patakara-content">
          <div class="patakara-character">${typeof Anim !== 'undefined' ? Anim.patakaraChar(phrase.icon, 80) : phrase.icon}</div>
          <h2 class="patakara-title">${phrase.character}といっしょに！</h2>
          <p class="patakara-instruction">おおきな声で3かいいってみよう！</p>
          <div class="patakara-phrase" id="patakara-phrase">${phrase.text.replace('\n', '<br>')}</div>
          <div class="patakara-counter"><span class="patakara-count" id="patakara-count">0</span> / 3かい</div>
          <button class="patakara-say-btn" id="patakara-btn" onclick="GameAiube.sayPatakaraFinal()">🗣️ いえたらタップ！</button>
        </div>
      </div>
    `;
    GameAiube._patakaraFinalCount = 0;
    GameAiube._currentPhraseFinal = phrase;
    try { Voice.play(phrase.audio); } catch(e) {}
  }

  function sayPatakaraFinal() {
    GameAiube._patakaraFinalCount++;
    const countEl = document.getElementById('patakara-count');
    if (countEl) countEl.textContent = GameAiube._patakaraFinalCount;
    try { Sounds.tap(); Effects.sparkle(window.innerWidth/2, window.innerHeight*0.5, 10); Effects.vibrate([20]); } catch(e) {}

    if (GameAiube._patakaraFinalCount >= 3) {
      try { Sounds.correct(); Effects.confetti(window.innerWidth/2, window.innerHeight*0.3, 25); } catch(e) {}
      const btn = document.getElementById('patakara-btn');
      if (btn) { btn.textContent = 'かんりょう！🎉'; btn.onclick = () => complete(); }
    } else {
      try { Voice.play(GameAiube._currentPhraseFinal.audio); } catch(e) {}
    }
  }

  function resumeNextSet() {
    showPose();
  }

  function finishEarly() {
    complete();
  }

  function complete() {
    if (timer) clearInterval(timer);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const score = (currentSet * REPS_PER_SET + currentRep) * 4 + currentPose;
    OralApp.logGameComplete('aiube', score, duration);
    OralApp.showComplete('aiube', score);
  }

  function cleanup() { if (timer) { clearInterval(timer); timer = null; } }

  return { start, resumeNextSet, finishEarly, cleanup, sayPatakara, sayPatakaraFinal, _patakaraCount: 0, _patakaraFinalCount: 0, _currentPhrase: null, _currentPhraseFinal: null };
})();
