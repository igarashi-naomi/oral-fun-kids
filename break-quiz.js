// 休憩クイズ — 体操のセット間にクイズを1問出す共通モジュール
const BreakQuiz = (() => {
  // 全カテゴリからフラットなクイズプールを作る
  function getAllQuestions() {
    if (typeof GameQuiz === 'undefined') return [];
    // GameQuizのQUIZ_CATEGORIESにアクセスできないので、ここにミニクイズプールを持つ
    return BREAK_QUIZ_POOL;
  }

  // 体操・ゲーム間に挟むミニクイズ（厳選・短め）
  const BREAK_QUIZ_POOL = [
    // 歯ブラシ
    { q: 'はブラシは おおきいヘッドと ちいさいヘッド、どっちがいい？', a: 1, options: ['おおきい', 'ちいさい'], explain: 'ちいさいほうが おくまでとどくよ！' },
    { q: 'はブラシは どのくらいでかえる？', a: 0, options: ['1かげつ', '1ねん'], explain: '1かげつで こうかんしよう！' },
    { q: 'ねるまえの はみがきは だいじ？', a: 0, options: ['とてもだいじ！', 'べつにいい'], explain: 'ねているあいだ だえきがへるから、ねるまえが いちばんだいじ！' },
    // フッ素
    { q: 'フッそは しぜんにある もの？', a: 0, options: ['しぜんにある', 'にんこうてき'], explain: 'おちゃや かいすいにも はいっている しぜんの ミネラルだよ！' },
    { q: 'はみがきのあと おくちは たくさんゆすぐ？', a: 1, options: ['たくさん', '1かいだけ'], explain: 'すこしだけゆすぐと フッそが はにのこるよ！' },
    // 動物
    { q: 'サメの はは なんかい はえかわる？', a: 1, options: ['1かい', 'なんまんかい'], explain: 'サメは どんどん はえてくるよ！うらやましいね！' },
    { q: 'ウサギの はは ずっとのびる。ホント？', a: 0, options: ['ホント', 'ウソ'], explain: 'ウサギの はは いっしょう のびつづけるよ！' },
    { q: 'にんげんのおとなの はは なんほん？', a: 1, options: ['20ほん', '28〜32ほん'], explain: 'おとなは 28ほん、おやしらずいれると 32ほん！' },
    { q: 'いちばん はが おおい どうぶつは？', a: 1, options: ['ワニ', 'カタツムリ'], explain: 'カタツムリは やく2まんほんの はがあるよ！' },
    // キシリトール
    { q: 'キシリトールは なんの きから とれる？', a: 0, options: ['しらかばの木', 'さくらの木'], explain: 'フィンランドの しらかばの きから とれるよ！' },
    { q: 'キシリトールは はみがきの かわりになる？', a: 1, options: ['なる', 'ならない'], explain: 'はみがきが いちばんだいじ！' },
    // 歯科豆知識
    { q: 'はを けずるバーに ダイヤモンドがついてる？', a: 0, options: ['ホント', 'ウソ'], explain: 'ダイヤモンドは せかいで いちばんかたいから はも けずれるんだ！' },
    { q: 'むしばのことを はいしゃさんは なんていう？', a: 0, options: ['C（シー）', 'M（エム）'], explain: 'カリエス（むしば）の Cだよ！' },
    { q: 'むしばに なりやすい おやつは？', a: 0, options: ['キャラメル', 'おせんべい'], explain: 'ネバネバ おやつは はに くっつくから むしばになりやすいよ！' },
    { q: 'はの いちばん かたいぶぶんは？', a: 0, options: ['エナメルしつ', 'しんけい'], explain: 'エナメルしつは からだで いちばんかたい！' },
    // 食育
    { q: 'よくかんで たべると いいことは？', a: 0, options: ['あたまがよくなる', 'はが よわくなる'], explain: 'よくかむと のうに ちが めぐって あたまがよくなるよ！' },
    { q: 'ジュースは むしばに なりやすい？', a: 0, options: ['なりやすい', 'ならない'], explain: 'ジュースには おさとうが たくさん！おちゃか おみずが いいよ！' },
    { q: 'おやつは 1にち なんかいがいい？', a: 0, options: ['きまったじかんに 1かい', 'すきなとき なんかいでも'], explain: 'だらだらたべは むしばの もと！じかんをきめてたべよう！' },
    // むしばの成り立ち
    { q: 'むしばをつくるのは ミュータンスきん。エサはなに？', a: 0, options: ['さとう', 'やさい'], explain: 'ミュータンスきんは さとうをたべて はをとかす「さん」をつくるよ！' },
    { q: 'たべたあと おくちは さんせいに なる？', a: 0, options: ['なる！', 'ならない'], explain: 'たべるたびに おくちが さんせいになって はがとけはじめる！だからだらだらたべは ダメ！' },
    { q: 'だえき（つば）は むしばから まもってくれる？', a: 0, options: ['まもってくれる！', 'かんけいない'], explain: 'だえきは さんを やわらげて、とけた はを なおす すごいちから！' },
    // フッ素濃度
    { q: '6さいからの フッそのうどは？', a: 1, options: ['500ppm', '1000〜1500ppm'], explain: '6さいからは 1000〜1500ppm！はブラシの 2/3の りょうをつかおう！' },
    { q: 'フッそは はを かたくする？', a: 0, options: ['かたくする！', 'やわらかくする'], explain: 'フッそが エナメルしつを さんに とけにくい「フルオロアパタイト」にかえてくれる！' },
    // フロス
    { q: 'はブラシだけで よごれは なんパーセントとれる？', a: 0, options: ['やく60%', 'やく100%'], explain: 'はブラシだけだと 60%！のこり40%は はのあいだの よごれ！フロスが だいじ！' },
    { q: 'むしばが いちばんできやすい ばしょは？', a: 0, options: ['はとはの あいだ', 'はのおもて'], explain: 'はとはの あいだは はブラシが とどかない！フロスで おそうじしよう！' },
    // おやつの食べ方
    { q: 'スポーツドリンクは むしばになりやすい？', a: 0, options: ['なりやすい！', 'ならない'], explain: '500mlに さとうスティック 8ぽんぶん！のみすぎ ちゅうい！' },
    { q: 'おやつのあと はみがきできないとき いちばんいいのは？', a: 0, options: ['キシリトールガム', 'なにもしない'], explain: 'キシリトールガムは バイキンのエサにならない＋だえきがでる！おたすけアイテム！' },
    // 定期健診
    { q: 'はいしゃさんには なんかげつに 1かい いくのがいい？', a: 0, options: ['3〜4かげつに1かい', '3ねんに1かい'], explain: '3〜4かげつごとに けんしんすると ちいさいむしばも みつかるよ！' },
    { q: 'にゅうしの むしばは ほうっておいても いい？', a: 1, options: ['いい', 'ダメ！おとなの はに えいきょうする'], explain: 'にゅうしの むしばを ほうっておくと おとなのはにも えいきょう！にゅうしも だいじ！' },
    { q: 'シーラントって なに？', a: 0, options: ['おくばの みぞをうめる よぼう', 'はを しろくぬる'], explain: 'おくばの みぞに プラスチックを ながして むしばバイキンが はいれないようにするよ！' },
    // 姿勢・悪習癖
    { q: 'ほおづえは はならびに えいきょうする？', a: 0, options: ['する！', 'しない'], explain: 'ほおづえは あごに すごいちからが！はならびが がたがたになるよ！' },
    { q: 'ゆびしゃぶりを つづけると？', a: 0, options: ['でっぱになる', 'はが つよくなる'], explain: 'うえのまえばが まえに でてしまうよ！3さいまでに やめよう！' },
    { q: 'いい しせいは はならびに かんけいある？', a: 0, options: ['かんけいある！', 'ない'], explain: 'せすじを ピンとすると あごが ただしくなって はならびも きれいに そだつよ！' },
    { q: 'うつぶせねは あごに わるい？', a: 0, options: ['わるい', 'だいじょうぶ'], explain: 'うつぶせねは あごに ちからがかかる！あおむけで ねよう！' },
  ];

  let usedIndices = [];

  // ランダムに1問取得（重複回避）
  function getRandomQuestion() {
    const pool = BREAK_QUIZ_POOL;
    if (usedIndices.length >= pool.length) usedIndices = []; // リセット
    let idx;
    do { idx = Math.floor(Math.random() * pool.length); } while (usedIndices.includes(idx));
    usedIndices.push(idx);
    return pool[idx];
  }

  // 休憩画面にクイズを表示（onCorrect/onWrong後にcallbackを呼ぶ）
  function showBreakWithQuiz(headerText, callback) {
    const q = getRandomQuestion();
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="game-screen">
        <div class="break-quiz-container">
          <div class="break-quiz-header">
            <div class="break-icon">😊</div>
            <h2>${headerText}</h2>
            <p class="break-quiz-intro">きゅうけいクイズ！わかるかな？</p>
          </div>

          <div class="break-quiz-card">
            <p class="break-quiz-question">${q.q}</p>
            <div class="break-quiz-options">
              <button class="break-quiz-btn break-quiz-a" id="bq-btn-0" onclick="BreakQuiz._answer(0)">
                <span class="break-quiz-label">A</span> ${q.options[0]}
              </button>
              <button class="break-quiz-btn break-quiz-b" id="bq-btn-1" onclick="BreakQuiz._answer(1)">
                <span class="break-quiz-label">B</span> ${q.options[1]}
              </button>
            </div>
          </div>

          <div id="break-quiz-result" style="display:none"></div>
          <div id="break-quiz-actions" style="display:none">
            <button class="btn-game btn-game-retry" id="bq-continue">つづける →</button>
            <button class="btn-game btn-game-home" id="bq-finish">ここでおわる</button>
          </div>
        </div>
      </div>
    `;

    // 内部状態保存
    BreakQuiz._currentQ = q;
    BreakQuiz._callback = callback;
  }

  function _answer(idx) {
    const q = BreakQuiz._currentQ;
    const correct = idx === q.a;
    try { correct ? Sounds.correct() : Sounds.wrong(); } catch(e) {}
    const resultEl = document.getElementById('break-quiz-result');
    const actionsEl = document.getElementById('break-quiz-actions');

    // ボタン無効化
    document.getElementById('bq-btn-0').disabled = true;
    document.getElementById('bq-btn-1').disabled = true;

    // 正解/不正解表示
    const correctBtn = document.getElementById(`bq-btn-${q.a}`);
    correctBtn.classList.add('break-quiz-correct');
    if (!correct) {
      document.getElementById(`bq-btn-${idx}`).classList.add('break-quiz-wrong');
    }

    resultEl.style.display = 'block';
    resultEl.innerHTML = `
      <div class="break-quiz-explain ${correct ? 'break-quiz-explain-correct' : 'break-quiz-explain-wrong'}">
        <span>${correct ? '⭕ せいかい！' : '❌ ざんねん...'}</span>
        <p>💡 ${q.explain}</p>
      </div>
    `;

    actionsEl.style.display = 'flex';
    document.getElementById('bq-continue').onclick = () => {
      if (BreakQuiz._callback) BreakQuiz._callback('continue');
    };
    document.getElementById('bq-finish').onclick = () => {
      if (BreakQuiz._callback) BreakQuiz._callback('finish');
    };
  }

  return { showBreakWithQuiz, _answer, _currentQ: null, _callback: null };
})();
