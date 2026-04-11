// テーマシステム — 5つの世界観
const Themes = (() => {
  const THEME_LIST = [
    {
      id: 'kingdom',
      name: 'まもれ！ハミガキ王国',
      icon: '⚔️',
      desc: 'むしば軍団から王国をまもる勇者になろう！',
      bg: 'linear-gradient(180deg, #1E3A5F, #2D1B69)',
      accent: '#F59E0B',
      mascot: '🛡️',
      player: 'ゆうしゃ',
      enemy: 'むしばキング',
      missionWord: 'クエスト',
      coinName: 'ゴールド',
      coinIcon: '🪙',
      rewardName: 'ひみつのたからばこ',
      exerciseIntro: 'しゅぎょうだ！パワーアップ！',
      quizIntro: 'ちしきの まほうを てにいれろ！',
      completeMsg: ['ゆうしゃレベルアップ！', 'まおうがふるえてるぞ！', 'つよくなったな！', '王国がまもられた！'],
      games: {
        aiube: { name: '必殺わざ修行', desc: 'あいうべの必殺わざをおぼえよう' },
        brushing: { name: 'むしばたいじ', desc: 'むしばモンスターをやっつけろ' },
        blowing: { name: 'ドラゴンブレス', desc: 'りゅうのブレスでてきをふっとばせ' },
        tongue: { name: 'けんのれんしゅう', desc: 'けんをすばやくふれ！' },
        chewing: { name: 'たいこのしゅぎょう', desc: 'リズムで攻撃パワーアップ' },
        quiz: { name: 'ちしきの魔法書', desc: '魔法をおぼえてつよくなろう' },
      }
    },
    {
      id: 'fairy',
      name: 'はの妖精キラキラランド',
      icon: '🧚',
      desc: 'はの妖精といっしょにキラキラの世界をつくろう！',
      bg: 'linear-gradient(180deg, #FDF2F8, #FCE7F3)',
      accent: '#EC4899',
      mascot: '🧚‍♀️',
      player: 'ようせいし',
      enemy: 'よごれおばけ',
      missionWord: 'おねがい',
      coinName: 'キラキラジュエル',
      coinIcon: '💎',
      rewardName: 'ひみつのおへや',
      exerciseIntro: 'まほうのれんしゅうよ！',
      quizIntro: 'ようせいのちえをあつめよう！',
      completeMsg: ['キラキラ〜！すてき！', 'ようせいパワーアップ！', 'まほうがつよくなった！', 'せかいがかがやいてる！'],
      games: {
        aiube: { name: 'まほうのうた', desc: 'まほうの呪文をとなえよう' },
        brushing: { name: 'キラキラクリーン', desc: 'よごれおばけをきれいにしよう' },
        blowing: { name: 'はなのまほう', desc: 'まほうのかぜでおはなをさかせよう' },
        tongue: { name: 'ようせいダンス', desc: 'リズムにあわせておどろう' },
        chewing: { name: 'ジュエルリズム', desc: 'ジュエルをあつめよう' },
        quiz: { name: 'ようせいずかん', desc: 'ふしぎなちしきをあつめよう' },
      }
    },
    {
      id: 'space',
      name: 'うちゅうの歯みがきたい',
      icon: '🚀',
      desc: 'うちゅうせんにのって ほしをめぐるぼうけん！',
      bg: 'linear-gradient(180deg, #0F172A, #1E1B4B)',
      accent: '#06B6D4',
      mascot: '👨‍🚀',
      player: 'うちゅうひこうし',
      enemy: 'エイリアンバイキン',
      missionWord: 'ミッション',
      coinName: 'スターコイン',
      coinIcon: '⭐',
      rewardName: 'ひみつの惑星',
      exerciseIntro: 'うちゅうトレーニング開始！',
      quizIntro: 'うちゅうのちしきをゲット！',
      completeMsg: ['ミッションクリア！', 'あたらしい星をはっけん！', 'うちゅうのヒーローだ！', 'すごいぞ、船長！'],
      games: {
        aiube: { name: 'うちゅう通信', desc: 'うちゅうじんにメッセージをおくろう' },
        brushing: { name: 'エイリアンそうじ', desc: 'うちゅうせんをピカピカにしよう' },
        blowing: { name: 'ロケットはっしゃ', desc: 'ロケットをふーっとはっしゃ！' },
        tongue: { name: 'そうじゅうくんれん', desc: 'うちゅうせんをそうじゅうしよう' },
        chewing: { name: 'リズムワープ', desc: 'ワープのリズムにあわせろ' },
        quiz: { name: 'うちゅうずかん', desc: 'うちゅうのひみつをしらべよう' },
      }
    },
    {
      id: 'animal',
      name: 'どうぶつの はいしゃさん',
      icon: '🦁',
      desc: 'どうぶつたちの はいしゃさんになろう！',
      bg: 'linear-gradient(180deg, #ECFDF5, #D1FAE5)',
      accent: '#059669',
      mascot: '🐻‍❄️',
      player: 'どうぶつドクター',
      enemy: 'むしばバイキン',
      missionWord: 'しんさつ',
      coinName: 'どうぶつコイン',
      coinIcon: '🐾',
      rewardName: 'どうぶつえん',
      exerciseIntro: 'どうぶつたちといっしょにれんしゅう！',
      quizIntro: 'どうぶつのはについてまなぼう！',
      completeMsg: ['どうぶつたちがよろこんでる！', 'めいいだ！', 'だいせいこう！', 'ありがとう、ドクター！'],
      games: {
        aiube: { name: 'どうぶつたいそう', desc: 'どうぶつといっしょにたいそうだ' },
        brushing: { name: 'はみがきしんさつ', desc: 'どうぶつのはをきれいにしよう' },
        blowing: { name: 'しゃぼんだまあそび', desc: 'どうぶつとしゃぼんだまをつくろう' },
        tongue: { name: 'ベロまねっこ', desc: 'どうぶつのベロをまねしよう' },
        chewing: { name: 'もぐもぐタイム', desc: 'どうぶつといっしょにもぐもぐ' },
        quiz: { name: 'どうぶつはかせ', desc: 'どうぶつのはのひみつをしろう' },
      }
    },
    {
      id: 'lab',
      name: 'おくちけんきゅうじょ',
      icon: '🧪',
      desc: 'はかせになって おくちのひみつを けんきゅうしよう！',
      bg: 'linear-gradient(180deg, #F8FAFC, #E2E8F0)',
      accent: '#7C3AED',
      mascot: '🔬',
      player: 'はかせ',
      enemy: 'ばいきん',
      missionWord: 'じっけん',
      coinName: 'けんきゅうポイント',
      coinIcon: '🔬',
      rewardName: 'ひみつのじっけんしつ',
      exerciseIntro: 'じっけんかいし！データをあつめよう！',
      quizIntro: 'けんきゅうクイズにちょうせん！',
      completeMsg: ['だいはっけん！', 'データしゅうしゅう完了！', 'ノーベル賞もゆめじゃない！', 'すばらしい研究だ！'],
      games: {
        aiube: { name: 'きんにくじっけん', desc: 'おくちの筋肉をけんきゅうしよう' },
        brushing: { name: 'ばいきんたいじ', desc: 'けんびきょうでばいきんをみつけてたおせ' },
        blowing: { name: 'くうきのじっけん', desc: 'いきのちからをそくていしよう' },
        tongue: { name: 'ベロけんきゅう', desc: 'ベロのうごきをけんきゅうしよう' },
        chewing: { name: 'そしゃくけんきゅう', desc: 'かむリズムをそくていしよう' },
        quiz: { name: 'けんきゅうしけん', desc: 'はかせになるためのしけんだ！' },
      }
    },
  ];

  let currentTheme = null;

  function getTheme() {
    if (currentTheme) return currentTheme;
    // ローカルストレージから復元
    const saved = localStorage.getItem('oralFunTheme');
    if (saved) {
      currentTheme = THEME_LIST.find(t => t.id === saved) || null;
    }
    return currentTheme;
  }

  function setTheme(themeId) {
    currentTheme = THEME_LIST.find(t => t.id === themeId) || THEME_LIST[0];
    localStorage.setItem('oralFunTheme', currentTheme.id);
    applyTheme();
  }

  function applyTheme() {
    const t = getTheme();
    if (!t) return;
    document.body.style.background = t.bg;
    document.documentElement.style.setProperty('--accent', t.accent);
  }

  function showSelector(onComplete) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="theme-select-screen">
        <h1 class="theme-select-title">ぼうけんのせかいをえらぼう！</h1>
        <p class="theme-select-subtitle">すきなせかいをタップしてね</p>
        <div class="theme-grid">
          ${THEME_LIST.map(t => `
            <button class="theme-card" onclick="Themes.setTheme('${t.id}'); ${onComplete || 'OralApp.showHome()'}" style="border-color:${t.accent}">
              <span class="theme-icon">${t.icon}</span>
              <span class="theme-name" style="color:${t.accent}">${t.name}</span>
              <span class="theme-desc">${t.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // テーマに応じたゲーム名取得
  function gameName(gameId) {
    const t = getTheme();
    if (!t || !t.games[gameId]) return gameId;
    return t.games[gameId].name;
  }

  function gameDesc(gameId) {
    const t = getTheme();
    if (!t || !t.games[gameId]) return '';
    return t.games[gameId].desc;
  }

  return { getTheme, setTheme, applyTheme, showSelector, gameName, gameDesc, THEME_LIST };
})();
