// デイリーサプライズ — 毎日違うボーナスで飽きさせない
const DailySurprise = (() => {
  const SURPRISES = [
    { type: 'bonus_coin', label: 'ボーナスコイン！', icon: '🪙', desc: 'きょうは とくべつ！コイン 2ばい！', effect: () => {} },
    { type: 'rare_boost', label: 'レアアップ！', icon: '🌟', desc: 'きょうは レアカードが でやすいよ！', effect: () => {} },
    { type: 'trivia', label: 'きょうの まめちしき', icon: '💡', desc: '', effect: () => {} },
    { type: 'challenge', label: 'チャレンジ！', icon: '🎯', desc: '', effect: () => {} },
    { type: 'sticker', label: 'とくべつスタンプ', icon: '🎁', desc: 'きょうだけの とくべつスタンプ！', effect: () => {} },
  ];

  const DAILY_TRIVIA = [
    'にんげんは いっしょうで やく38にちかん はみがきに つかうよ！',
    'いちばんふるい はブラシは 5000ねんまえの エジプトで つくられたよ！',
    'チョコレートには むしばを ふせぐ せいぶんも はいっているんだ！（でも さとうも おおいから ちゅうい！）',
    'うちゅうひこうしも ISSで まいにち はみがきするよ！みずは のみこむんだ！',
    'さめは はが ぬけても 24じかんで あたらしいのが はえてくる！',
    'ぞうの おくばは 1ほんで 3キログラムも あるよ！',
    'にんげんの はの エナメルしつは からだで いちばんかたい ぶぶん！',
    'だえきには ばいきんを やっつける ちからが あるよ！',
    'やさいを たべると だえきが たくさんでて おくちが きれいになるよ！',
    'わらうと めんえきりょくが あがって からだが げんきになるよ！',
    'よくかんで たべると のうの けっりゅうが よくなって あたまが よくなるよ！',
    'はは からだの なかで ゆいいつ じぶんで なおせない ぶぶん。だから よぼうが だいじ！',
    'ねこの はは にんげんより するどいけど むしばに なりにくいよ。だえきが アルカリせいだから！',
    'にゅうしが ぬけたら まくらの したに おくと はのようせいが コインに かえてくれる…って いうでんせつがあるよ！（アメリカの おはなし）',
  ];

  const DAILY_CHALLENGES = [
    'きょうの チャレンジ: たいそうを 2かい やろう！（ごほうび: コイン +3）',
    'きょうの チャレンジ: クイズで 5もん れんぞく せいかいしよう！',
    'きょうの チャレンジ: はみがきチェック ぜんぶに チェックしよう！',
    'きょうの チャレンジ: べろべろチャレンジで 80てん いじょう！',
    'きょうの チャレンジ: もぐもぐリズムで コンボ 5れんぞく！',
  ];

  function getTodaySurprise() {
    const today = new Date().toISOString().slice(0, 10);
    // 日付をシードにして擬似ランダム
    const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
    const idx = seed % SURPRISES.length;
    const surprise = { ...SURPRISES[idx] };

    if (surprise.type === 'trivia') {
      surprise.desc = DAILY_TRIVIA[seed % DAILY_TRIVIA.length];
    } else if (surprise.type === 'challenge') {
      surprise.desc = DAILY_CHALLENGES[seed % DAILY_CHALLENGES.length];
    }

    return surprise;
  }

  function shouldShow() {
    const today = new Date().toISOString().slice(0, 10);
    return localStorage.getItem('oralFunSurpriseShown') !== today;
  }

  function markShown() {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('oralFunSurpriseShown', today);
  }

  function show(onDone) {
    if (!shouldShow()) { if (onDone) onDone(); return; }

    const surprise = getTodaySurprise();
    const app = document.getElementById('app');
    try { Effects.sparkle(window.innerWidth / 2, window.innerHeight * 0.3, 20); Sounds.coin(); } catch(e) {}

    app.innerHTML = `
      <div class="surprise-screen">
        <div class="surprise-card anim-scale-in">
          <div class="surprise-icon">${surprise.icon}</div>
          <h2 class="surprise-label">${surprise.label}</h2>
          <p class="surprise-desc">${surprise.desc}</p>
        </div>
        <button class="btn-game btn-game-next" onclick="DailySurprise._done()" style="margin-top:24px">やったー！</button>
      </div>
    `;

    DailySurprise._onDone = onDone;
  }

  function _done() {
    markShown();
    if (DailySurprise._onDone) DailySurprise._onDone();
  }

  return { show, shouldShow, getTodaySurprise, _done, _onDone: null };
})();
