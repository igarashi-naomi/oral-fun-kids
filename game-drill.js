// おくちドリル — 7〜10歳版（くすっドリル + 学習クイズ）
const GameDrill = (() => {
  let currentMode = null; // 'kusutto' | 'math' | 'science' | 'tochigi' | 'english'
  let currentIdx = 0;
  let items = [];
  let score = 0;
  let startTime = 0;

  function start() {
    showModeSelect();
  }

  function showModeSelect() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen drill-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <span class="game-progress">📖 おくちドリル</span>
        </div>
        <h2 class="drill-select-title">どのドリルにする？</h2>
        <div class="drill-mode-grid">
          <button class="drill-mode-btn drill-mode-kusutto" onclick="GameDrill.selectMode('kusutto')">
            <span class="drill-mode-icon">🤣</span>
            <span class="drill-mode-name">くすっドリル</span>
            <span class="drill-mode-desc">笑っても、歯をみがこう！</span>
          </button>
          <button class="drill-mode-btn drill-mode-math" onclick="GameDrill.selectMode('math')">
            <span class="drill-mode-icon">🔢</span>
            <span class="drill-mode-name">さんすう×歯</span>
            <span class="drill-mode-desc">計算しながら歯の知識！</span>
          </button>
          <button class="drill-mode-btn drill-mode-science" onclick="GameDrill.selectMode('science')">
            <span class="drill-mode-icon">🧪</span>
            <span class="drill-mode-name">りか×歯</span>
            <span class="drill-mode-desc">科学で歯のひみつ！</span>
          </button>
          <button class="drill-mode-btn drill-mode-tochigi" onclick="GameDrill.selectMode('tochigi')">
            <span class="drill-mode-icon">🍓</span>
            <span class="drill-mode-name">とちぎ</span>
            <span class="drill-mode-desc">栃木のこと、知ってる？</span>
          </button>
          <button class="drill-mode-btn drill-mode-english" onclick="GameDrill.selectMode('english')">
            <span class="drill-mode-icon">🔤</span>
            <span class="drill-mode-name">えいご×歯</span>
            <span class="drill-mode-desc">英語で歯をみがこう！</span>
          </button>
        </div>
      </div>
    `;
  }

  function selectMode(mode) {
    currentMode = mode;
    currentIdx = 0;
    score = 0;
    startTime = Date.now();

    if (mode === 'kusutto') {
      items = shuffle([...DRILL_DATA.kusutto]);
    } else {
      items = shuffle([...DRILL_DATA[mode]]);
    }
    showNext();
  }

  function showNext() {
    if (currentIdx >= items.length) {
      showResults();
      return;
    }

    if (currentMode === 'kusutto') {
      showKusuttoCard();
    } else {
      showQuizCard();
    }
  }

  // ===== くすっドリル表示 =====
  function showKusuttoCard() {
    const item = items[currentIdx];
    const illust = DRILL_ILLUSTRATIONS[item.illustration] || '';
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="game-screen drill-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ やめる</button>
          <span class="game-progress">${currentIdx + 1}/${items.length}</span>
        </div>

        <div class="drill-card" onclick="GameDrill.revealPunchline()">
          <div class="drill-illust-container">${illust}</div>
          <p class="drill-text">${item.text}</p>
          <div class="drill-punchline" id="drill-punchline" style="visibility:hidden">
            <span class="drill-punchline-text">${item.punchline}</span>
          </div>
          <p class="drill-tap-hint" id="drill-tap-hint">タップしてね！</p>
        </div>

        <div class="drill-category-badge">${item.category}</div>
      </div>
    `;
  }

  function revealPunchline() {
    const pl = document.getElementById('drill-punchline');
    const hint = document.getElementById('drill-tap-hint');
    if (!pl) return;

    if (pl.style.visibility === 'hidden') {
      // パンチライン表示
      pl.style.visibility = 'visible';
      pl.classList.add('drill-punchline-reveal');
      if (hint) hint.style.display = 'none';
      try {
        Voice.play('hamigakou.wav');
        Sounds.correct();
        Effects.sparkle(window.innerWidth / 2, window.innerHeight * 0.6, 15);
      } catch(e) {}
    } else {
      // 次へ
      currentIdx++;
      showNext();
    }
  }

  // ===== 学習クイズ表示 =====
  function showQuizCard() {
    const item = items[currentIdx];
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="game-screen drill-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ やめる</button>
          <span class="game-progress">${currentIdx + 1}/${items.length}　⭐${score}</span>
        </div>

        <div class="drill-quiz-card">
          <p class="drill-quiz-q">${item.q}</p>
          <div class="drill-quiz-options">
            <button class="drill-quiz-btn drill-quiz-a" onclick="GameDrill.answer(0)">
              <span class="drill-quiz-label">A</span> ${item.options[0]}
            </button>
            <button class="drill-quiz-btn drill-quiz-b" onclick="GameDrill.answer(1)">
              <span class="drill-quiz-label">B</span> ${item.options[1]}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function answer(idx) {
    const item = items[currentIdx];
    const correct = idx === item.a;
    if (correct) {
      score += 10;
      try { Sounds.correct(); Voice.correct(); Effects.confetti(window.innerWidth/2, window.innerHeight*0.3, 20); } catch(e) {}
    } else {
      try { Sounds.wrong(); Voice.wrong(); } catch(e) {}
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen drill-screen">
        <div class="game-top-bar">
          <span class="game-progress">${currentIdx + 1}/${items.length}　⭐${score}</span>
        </div>
        <div class="drill-result ${correct ? 'drill-result-correct' : 'drill-result-wrong'}">
          <span class="drill-result-icon">${correct ? '⭕' : '❌'}</span>
          <p class="drill-result-answer">こたえ: <strong>${item.options[item.a]}</strong></p>
          <div class="drill-result-explain">💡 ${item.explain}</div>
        </div>
        <button class="btn-game btn-game-retry" onclick="GameDrill.nextQuiz()" style="margin-top:16px">
          ${currentIdx + 1 < items.length ? 'つぎへ →' : 'けっかを見る →'}
        </button>
      </div>
    `;
  }

  function nextQuiz() {
    currentIdx++;
    showNext();
  }

  // ===== 結果画面 =====
  function showResults() {
    const duration = Math.round((Date.now() - startTime) / 1000);
    try { Effects.fullConfetti(); Sounds.fanfare(); } catch(e) {}

    if (currentMode !== 'kusutto') {
      OralApp.logGameComplete('drill_' + currentMode, score, duration);
    } else {
      OralApp.logGameComplete('drill_kusutto', items.length * 5, duration);
    }

    const app = document.getElementById('app');
    const modeNames = { kusutto: 'くすっドリル', math: 'さんすう×歯', science: 'りか×歯', tochigi: 'とちぎ', english: 'えいご×歯' };

    app.innerHTML = `
      <div class="complete-screen">
        <div class="complete-stars">⭐🌟⭐</div>
        <h1 class="complete-title">${currentMode === 'kusutto' ? 'ぜんぶ読めた！' : `${score}てん！`}</h1>
        <p class="complete-score">${modeNames[currentMode]}</p>
        <div class="complete-stamp">📌 スタンプゲット！</div>
        <div class="complete-coin">🪙 +1</div>
        <div class="complete-actions">
          <button class="btn-game btn-game-retry" onclick="GameDrill.start()">べつのドリル</button>
          <button class="btn-game btn-game-home" onclick="OralApp.showHome()">ホーム</button>
        </div>
      </div>
    `;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return { start, selectMode, revealPunchline, answer, nextQuiz };
})();
