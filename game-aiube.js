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

  const TOTAL_SETS = 3; // 目標セット数
  const REPS_PER_SET = 5; // 5回×3セット=短くて集中できる

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

    // 音声ナレーション（「おおきく あー！」等）
    try { Voice.aiube(pose.char); } catch(e) {}

    startCountdown(pose);
  }

  function startCountdown(pose) {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      countdown--;
      const el = document.getElementById('aiube-countdown');
      if (el) el.textContent = countdown;
      try { Sounds.tick(); } catch(e) {}
      // 残り3秒からカウントダウン読み上げ
      try { Voice.countdown(countdown); } catch(e) {}

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
          complete();
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
    BreakQuiz.showBreakWithQuiz(
      `${currentSet}セットめ おわり！`,
      (action) => {
        if (action === 'continue') resumeNextSet();
        else finishEarly();
      }
    );
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

  return { start, resumeNextSet, finishEarly, cleanup };
})();
