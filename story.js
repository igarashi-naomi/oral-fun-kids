// ストーリーシステム — 毎日少しずつ進むRPG風物語
const Story = (() => {
  // テーマ別ストーリー（各20チャプター）
  const STORIES = {
    kingdom: {
      title: 'ひかりの はブラシでんせつ',
      chapters: [
        { ch: 1, title: 'ぼうけんの はじまり', text: 'むかしむかし、ハミガキ王国に「ひかりの はブラシ」という でんせつの たからものが ありました。ある日、むしばキングが おしろに せめてきて、ひかりの はブラシを うばっていきました！', mascot: '🛡️', bg: '#1E3A5F' },
        { ch: 2, title: 'ゆうしゃの たんじょう', text: 'おうさまは こまりはてて いいました。「だれか ゆうしゃは おらぬか！」そのとき、ちいさな はのようせいが なのりでました。「ぼくが とりもどします！」', mascot: '🦷', bg: '#2D1B69' },
        { ch: 3, title: 'さいしょの しゅぎょう', text: 'ようせいのけんし は いいました。「まずは おくちの きんにくを きたえなければ。あいうべ たいそうから はじめよう！」ゆうしゃの しゅぎょうが はじまりました。', mascot: '⚔️', bg: '#1E3A5F' },
        { ch: 4, title: 'もりの いりぐち', text: 'しゅぎょうを おえた ゆうしゃは、くらい もりに はいりました。もりには ちいさな むしばモンスターが うようよ。「はブラシで やっつけろ！」', mascot: '🌲', bg: '#14532D' },
        { ch: 5, title: 'なかまとの であい', text: 'もりのなかで、フロスのようせい「フロッシー」に であいました。「わたしも いっしょに たたかう！はとはの あいだは まかせて！」たのもしい なかま！', mascot: '🧵', bg: '#1E3A5F' },
        { ch: 6, title: 'どうくつの ちょうせん', text: 'くらい どうくつには つよい むしばモンスターが。でも ゆうしゃは べろの ちからで てきを はじきとばしました！べろべろ チャレンジ だいせいこう！', mascot: '👅', bg: '#44403C' },
        { ch: 7, title: 'かわを わたる', text: 'つぎは おおきな かわ。ふーふーの ちからで いかだを すすめました。むこうぎしには フッそのまち が みえます。「あそこで ちからを つけよう！」', mascot: '🌊', bg: '#0C4A6E' },
        { ch: 8, title: 'フッそのまち', text: 'フッそのまちでは みんなの はが キラキラ。「フッそを ぬると はが つよくなるんだ！」まちのひとが フッそのよろいを くれました。ぼうぎょりょく アップ！', mascot: '✨', bg: '#059669' },
        { ch: 9, title: 'さばくの たいこ', text: 'あつい さばくを すすむ ゆうしゃ。リズムよく あるかないと たおれてしまう！もぐもぐリズムで テンポよく すすみました。', mascot: '🏜️', bg: '#92400E' },
        { ch: 10, title: 'ちゅうかん ボス', text: 'さばくの はてに プラークだいおうが！「おまえの はを よごしてやる！」でも ゆうしゃの はみがきスキルで プラークを ぜんぶ おとしました！', mascot: '⚔️', bg: '#7F1D1D' },
        { ch: 11, title: 'やまのぼり', text: 'たかい やまの うえに むしばキングの しろが。「まだまだ とおい…でも まいにち すこしずつ すすもう！」ゆうしゃは あきらめません。', mascot: '🏔️', bg: '#1E3A5F' },
        { ch: 12, title: 'こおりの くに', text: 'さむい こおりの くに。でも あいうべ たいそうで からだが ポカポカ！「おくちの きんにくは すごいなぁ！」', mascot: '❄️', bg: '#0C4A6E' },
        { ch: 13, title: 'キシリトールのもり', text: 'あまい かおりの もり。でも さとうの もりとは ちがう！「キシリトールは むしばきんの えさに ならないんだ！」あんしんして すすめます。', mascot: '🍬', bg: '#14532D' },
        { ch: 14, title: 'くものうえ', text: 'くもの うえの みちを すすむ ゆうしゃ。はなこきゅうで しずかに…おくちは とじて、はなから すー、はー。', mascot: '☁️', bg: '#3B82F6' },
        { ch: 15, title: 'よるの とう', text: 'くらい とうの なかで えいせいしさんの こえが きこえました。「がんばってるね！もうすこしだよ！」ゆうきが わいてきた！', mascot: '🌙', bg: '#1E1B4B' },
        { ch: 16, title: 'まほうの はぐるま', text: 'とうの てっぺんに まほうの はぐるまが。カチカチ うごくと、むしばキングの しろへの みちが ひらきました！', mascot: '⚙️', bg: '#44403C' },
        { ch: 17, title: 'さいごの しゅぎょう', text: 'しろの まえで さいごの しゅぎょう。すべての たいそうを かんぺきに！あいうべ、ふーふー、べろべろ、もぐもぐ、ぜんぶ！', mascot: '💪', bg: '#7F1D1D' },
        { ch: 18, title: 'むしばキングとの たいけつ', text: 'ついに むしばキングの まえに！「おまえに まけるものか！」でも ゆうしゃは まいにちの れんしゅうで つよくなっている！', mascot: '👑', bg: '#4C0519' },
        { ch: 19, title: 'ひかりの はブラシ', text: 'むしばキングを たおすと、ひかりの はブラシが！キラキラ かがやいて、王国ぜんたいを てらしました。みんなの はが ピカピカに！', mascot: '✨', bg: '#F59E0B' },
        { ch: 20, title: 'へいわな 王国', text: 'ひかりの はブラシの ちからで、王国に へいわが もどりました。でも ゆうしゃは しっています。「まいにちの たいそうと はみがきが いちばん だいじ！」おわり…？つづきは きみしだい！', mascot: '🏰', bg: '#059669' },
      ]
    },
    fairy: {
      title: 'キラキラの せかいを とりもどせ',
      chapters: [
        { ch: 1, title: 'キラキラが きえた', text: 'キラキラランドから ひかりが きえてしまいました。よごれおばけが キラキラを ぜんぶ すいとったの！ようせいの あなたが たすけて！', mascot: '🧚', bg: '#FDF2F8' },
        { ch: 2, title: 'まほうの れんしゅう', text: 'ようせいの せんせいが いいました。「まほうを つかうには おくちの ちからが ひつよう！あいうべの まほうから はじめましょう」', mascot: '✨', bg: '#FCE7F3' },
        { ch: 3, title: 'おはなの はたけ', text: 'まほうの かぜ（ふー！）で おはなを さかせました。ピンクの おはなが いっぱい！キラキラが すこし もどってきた！', mascot: '🌸', bg: '#FDF2F8' },
        { ch: 4, title: 'にじいろ ブリッジ', text: 'にじの はしを わたると ジュエルのもりが。キラキラジュエルを あつめて せかいに キラキラを とりもどそう！', mascot: '🌈', bg: '#EFF6FF' },
        { ch: 5, title: 'ほしの てんぼうだい', text: 'よぞらに キラキラぼしが。「まいにち がんばると ほしが ふえるのよ」ようせいのせんせいが にっこり。', mascot: '⭐', bg: '#1E1B4B' },
      ]
    },
    space: {
      title: 'プラネット・スマイル けいかく',
      chapters: [
        { ch: 1, title: 'きんきゅうしれい', text: '「エイリアンバイキンが うちゅうに ひろがっている！せんちょう、しゅつどうだ！」うちゅうの ぼうけんが はじまる！', mascot: '🚀', bg: '#0F172A' },
        { ch: 2, title: 'トレーニング きち', text: 'うちゅうで たたかうには たいりょくが ひつよう。「うちゅうトレーニング かいし！」あいうべ たいそうで パワーアップ！', mascot: '👨‍🚀', bg: '#1E1B4B' },
        { ch: 3, title: 'つきの きち', text: 'つきの きちに とうちゃく。エイリアンバイキンが きちを よごしている！はブラシ ウェポンで そうじだ！', mascot: '🌙', bg: '#0F172A' },
        { ch: 4, title: 'ワープ こうかい', text: 'ワープの リズムに あわせろ！もぐもぐリズムで ワープ せいこう！あたらしい ほしけいに とうちゃく！', mascot: '💫', bg: '#1E1B4B' },
        { ch: 5, title: 'スマイル ほし', text: 'ぜんいんが ニコニコの ほし。ここの ひみつは まいにちの たいそうと はみがき！「ぼくたちも まねしよう！」', mascot: '😊', bg: '#059669' },
      ]
    },
    animal: {
      title: 'どうぶつ はいしゃさん ものがたり',
      chapters: [
        { ch: 1, title: 'はいしゃさんに なろう', text: 'どうぶつたちの はいしゃさんに なることに！「まずは じぶんの おくちを けんこうに しよう！」たいそう かいし！', mascot: '🐻', bg: '#ECFDF5' },
        { ch: 2, title: 'パンダの しんさつ', text: 'パンダの パンちゃんが きました。「たけを たべすぎて おくばが いたい…」さっそく しんさつ！はみがきの しかたを おしえよう！', mascot: '🐼', bg: '#D1FAE5' },
        { ch: 3, title: 'ライオンの けんしん', text: 'ライオンの レオくんは けんしんが こわい。「だいじょうぶ！いたくないよ！」やさしく はを チェック。', mascot: '🦁', bg: '#ECFDF5' },
        { ch: 4, title: 'サメの なやみ', text: 'サメの シャークンは「はが なんまんかいも はえかわるから へいき」って。「でも はぐきは だいじ！フロスも しようね！」', mascot: '🦈', bg: '#DBEAFE' },
        { ch: 5, title: 'みんな けんこう', text: 'どうぶつたちが みんな ニコニコ。「ありがとう ドクター！」まいにちの ケアが いちばん だいじって わかったね！', mascot: '🎉', bg: '#D1FAE5' },
      ]
    },
    lab: {
      title: 'おくちの ひみつ けんきゅう',
      chapters: [
        { ch: 1, title: 'けんきゅうしょ はいぞく', text: 'おくちけんきゅうじょに はいぞく！「きみの にんむは おくちの ひみつを すべて かいめいすること！」', mascot: '🔬', bg: '#F8FAFC' },
        { ch: 2, title: 'きんにくの じっけん', text: 'さいしょの じっけんは おくちの きんにく。「あいうべ たいそうで きんにくが どう かわるか しらべよう！」', mascot: '💪', bg: '#E2E8F0' },
        { ch: 3, title: 'バイキンの かんさつ', text: 'けんびきょうで バイキンを はっけん！「ミュータンスきん…さとうを たべて さんを だす やつだ！」はみがきで たいじ！', mascot: '🦠', bg: '#F8FAFC' },
        { ch: 4, title: 'フッその けんきゅう', text: '「フッそを ぬると エナメルしつが フルオロアパタイトに！」はかせの だいはっけん！', mascot: '🧪', bg: '#EDE9FE' },
        { ch: 5, title: 'ろんぶん はっぴょう', text: 'けんきゅう せいかを はっぴょう！「まいにちの たいそうと はみがきが いちばん こうかてき！」だいせいこう！', mascot: '📄', bg: '#F8FAFC' },
      ]
    }
  };

  function getStory(themeId) {
    return STORIES[themeId] || STORIES.kingdom;
  }

  // 現在のチャプター（ストリークの累計日数ベース）
  function getCurrentChapter(streakData, themeId) {
    const story = getStory(themeId);
    const totalDays = Object.keys(streakData?.stamps || {}).length;
    const chIdx = Math.min(totalDays, story.chapters.length - 1);
    return story.chapters[chIdx];
  }

  // ストーリー画面を表示
  function showChapter(chapter, onDone) {
    const app = document.getElementById('app');
    try { Sounds.stamp(); } catch(e) {}

    app.innerHTML = `
      <div class="story-screen" style="background:${chapter.bg || '#1E293B'}">
        <div class="story-chapter-label">Chapter ${chapter.ch}</div>
        <h2 class="story-title">${chapter.title}</h2>
        <div class="story-mascot">${chapter.mascot}</div>
        <div class="story-text-box">
          <p class="story-text" id="story-text"></p>
        </div>
        <button class="btn-game btn-game-next story-next-btn" id="story-next" style="display:none" onclick="Story._onDone()">つぎへ →</button>
      </div>
    `;

    // タイプライター演出
    typeWriter(chapter.text, document.getElementById('story-text'), () => {
      document.getElementById('story-next').style.display = '';
    });

    Story._doneCb = onDone;
  }

  function _onDone() {
    if (Story._doneCb) Story._doneCb();
  }

  // タイプライター効果
  function typeWriter(text, el, onComplete, speed = 40) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    // タップでスキップ
    el.parentElement.onclick = () => {
      clearInterval(interval);
      el.textContent = text;
      el.parentElement.onclick = null;
      if (onComplete) onComplete();
    };
  }

  // 新しいチャプターかどうか
  function isNewChapter(streakData, themeId) {
    const story = getStory(themeId);
    const totalDays = Object.keys(streakData?.stamps || {}).length;
    const lastSeenCh = parseInt(localStorage.getItem('oralFunLastChapter') || '0');
    const currentCh = Math.min(totalDays, story.chapters.length - 1);
    return currentCh > lastSeenCh;
  }

  function markChapterSeen(streakData) {
    const totalDays = Object.keys(streakData?.stamps || {}).length;
    localStorage.setItem('oralFunLastChapter', String(totalDays));
  }

  return { getStory, getCurrentChapter, showChapter, isNewChapter, markChapterSeen, _onDone, _doneCb: null };
})();
