// はっけん！おくちクイズ — 2択クイズ（歯ブラシ・フッ素・動物の歯・歯科豆知識）
const GameQuiz = (() => {
  // ===== クイズデータベース =====
  const QUIZ_CATEGORIES = [
    {
      id: 'toothbrush',
      name: '🪥 はブラシのえらびかた',
      color: '#3B82F6',
      questions: [
        { q: 'こどものはブラシは、おおきいヘッドとちいさいヘッド、どっちがいい？', a: 1, options: ['おおきい', 'ちいさい'], explain: 'ちいさいヘッドのほうが おくのはまでとどくよ！' },
        { q: 'はブラシのかたさは？こどもは「やわらかめ」と「かため」どっち？', a: 0, options: ['やわらかめ', 'かため'], explain: 'こどもの はぐきはデリケート。やわらかめがおすすめ！' },
        { q: 'はブラシは どのくらいでかえるのがいい？', a: 0, options: ['1かげつ', '1ねん'], explain: '1かげつでまがってきたら こうかんしよう！' },
        { q: 'はブラシの もちかたは？', a: 1, options: ['グーでにぎる', 'えんぴつもち'], explain: 'えんぴつもちのほうが やさしくみがけるよ！' },
        { q: 'ねるまえの はみがきと あさの はみがき、もっとだいじなのは？', a: 0, options: ['ねるまえ', 'あさ'], explain: 'ねているあいだは だえきがへるから、ねるまえが いちばんだいじ！' },
        { q: 'はブラシのけさきが ひらいてきたら どうする？', a: 1, options: ['もうすこし つかう', 'あたらしいのに かえる'], explain: 'ひらいた はブラシは よごれが 50%しかとれないよ！' },
        { q: 'でんどうはブラシは こどもにも つかっていい？', a: 0, options: ['つかっていい', 'つかっちゃダメ'], explain: 'こどもようの でんどうはブラシもあるよ。しあげみがきにも べんり！' },
      ]
    },
    {
      id: 'fluoride',
      name: '✨ フッそのひみつ',
      color: '#10B981',
      questions: [
        { q: 'フッそって なにを まもってくれるの？', a: 0, options: ['はのエナメルしつ', 'はぐき'], explain: 'フッそは はのエナメルしつをつよくして むしばからまもるよ！' },
        { q: 'こどもの はみがきこのフッそのうどは？', a: 0, options: ['1000ppm', '100ppm'], explain: '6さいいじょうは1000ppm（いっせんぴーぴーえむ）がおすすめ！' },
        { q: 'フッそは しぜんにある もの？それとも にんこうてきに つくったもの？', a: 0, options: ['しぜんにある', 'にんこうてき'], explain: 'フッそは おちゃや かいすいにも はいっている しぜんの ミネラルだよ！' },
        { q: 'はみがきのあと、おくちを なんかい ゆすぐのがいい？', a: 0, options: ['1かいだけ', 'たくさん'], explain: 'すこしだけゆすぐと フッそが はにのこって むしばよぼうになるよ！' },
        { q: 'はいしゃさんで ぬるフッそと はみがきこのフッそ、つよいのは？', a: 0, options: ['はいしゃさんのフッそ', 'はみがきこ'], explain: 'はいしゃさんのフッそは 9000ppm。はみがきこの やく9ばい つよいよ！' },
        { q: 'フッそいりの はみがきこは あかちゃんにも つかえる？', a: 0, options: ['つかえる', 'つかえない'], explain: 'うまれてさいしょの はが はえたら フッそはみがきを はじめよう！500ppmのを すこしだけね！' },
      ]
    },
    {
      id: 'animal',
      name: '🦁 どうぶつの はクイズ',
      color: '#F97316',
      questions: [
        { q: 'サメの はは いっしょうで なんかい はえかわる？', a: 1, options: ['1かい', 'なんまんかい'], explain: 'サメは はがぬけても どんどん はえてくるよ！うらやましいね！' },
        { q: 'ゾウの はは ぜんぶで なんほん？', a: 0, options: ['4ほん', '40ほん'], explain: 'ゾウは おおきなおくばが うえした2ほんずつ、ぜんぶで4ほんだけ！' },
        { q: 'ウサギの まえばは ずっとのびつづける。ホント？ウソ？', a: 0, options: ['ホント', 'ウソ'], explain: 'ウサギの はは いっしょう のびつづけるよ。かたいものを かじって けずっているんだ！' },
        { q: 'いちばん はが おおい どうぶつは？', a: 1, options: ['ワニ', 'カタツムリ'], explain: 'カタツムリには やく2まんほんの ちいさな はがあるよ！「しぜつ（歯舌）」っていうんだ！' },
        { q: 'イルカの はは なにを するためにある？', a: 1, options: ['かむため', 'さかなをつかまえるため'], explain: 'イルカは さかなを かまずに まるのみするよ。はは つかまえるだけ！' },
        { q: 'にんげんの はは ぜんぶで なんほん？（おとな）', a: 1, options: ['20ほん', '28〜32ほん'], explain: 'おとなは 28ほん（おやしらずをいれると32ほん）。こどもの にゅうしは 20ほんだよ！' },
        { q: 'ライオンの きばは なんセンチくらい？', a: 1, options: ['2センチ', '7センチ'], explain: 'ライオンの きばは やく7センチ！えんぴつくらいの ながさだよ！' },
        { q: 'パンダは なにを たべるために おくばが おおきい？', a: 0, options: ['ささ（竹）', 'にく'], explain: 'パンダは いちにち 15キロも ささをたべるよ。そのために おくばがとっても ひらたくておおきいんだ！' },
      ]
    },
    {
      id: 'xylitol',
      name: '🍬 キシリトールのひみつ',
      color: '#8B5CF6',
      questions: [
        { q: 'キシリトールは なんの きから とれる？', a: 0, options: ['しらかば（白樺）の木', 'さくらの木'], explain: 'キシリトールは フィンランドの しらかばの きから とれるよ！' },
        { q: 'キシリトールは むしばきんに たべられる？', a: 1, options: ['たべられる', 'たべられない'], explain: 'むしばきんは キシリトールを たべられない！だから さんを つくれなくて はを まもれるんだ！' },
        { q: 'キシリトールガムを かむと だえきが でる。ホント？', a: 0, options: ['ホント', 'ウソ'], explain: 'ガムをかむと だえきがたくさん でて、おくちを きれいにしてくれるよ！' },
        { q: 'キシリトールは さとうより カロリーが ひくい？', a: 0, options: ['ひくい', 'たかい'], explain: 'キシリトールは さとうの 75%のカロリー！からだにも やさしいね！' },
        { q: 'キシリトールガムは はみがきの かわりになる？', a: 1, options: ['なる', 'ならない'], explain: 'キシリトールは べんりだけど、はみがきの かわりにはならないよ！はみがきがいちばん だいじ！' },
      ]
    },
    {
      id: 'dental_trivia',
      name: '🏥 はいしゃさんの ひみつ',
      color: '#EF4444',
      questions: [
        { q: 'はを けずるバーには ダイヤモンドが ついている。ホント？', a: 0, options: ['ホント', 'ウソ'], explain: 'ダイヤモンドは せかいで いちばんかたい もの。だから かたいはも けずれるんだ！' },
        { q: 'むしばの はいしゃさんことばは？', a: 0, options: ['C（シー）', 'M（エム）'], explain: 'Cは カリエス（むしば）の Cだよ。C1、C2、C3... と ひどさが かわるよ！' },
        { q: 'はの レントゲンを とるとき、からだに わるい？', a: 1, options: ['とてもわるい', 'ほんのすこし（ひこうきのるより すくない）'], explain: 'はの レントゲンの ほうしゃせんは とてもすくなくて、ひこうきに のるより すくないんだよ！' },
        { q: 'むしばに なりやすい おやつは？', a: 0, options: ['キャラメル', 'おせんべい'], explain: 'ネバネバして はにくっつく おやつは むしばに なりやすいよ！' },
        { q: 'はを ぶつけて おれたら、どうする？', a: 0, options: ['ぎゅうにゅうに いれて はいしゃへ', 'すてる'], explain: 'おれた はは ぎゅうにゅうか しょくえんすいに いれると くっつくかも！すぐ はいしゃさんへ！' },
        { q: 'はいしゃさんの イスが たおれるのは なぜ？', a: 1, options: ['らくだから', 'おくちの なかが みやすいから'], explain: 'たおすと はいしゃさんが おくちの なかを よくみえるんだ。ライトも あたりやすくなるよ！' },
        { q: 'にゅうし（こどもの は）は ぜんぶで なんほん？', a: 0, options: ['20ほん', '28ほん'], explain: 'こどもの にゅうしは 20ほん！おとなの はは 28〜32ほんだよ！' },
        { q: 'はの いちばん かたいぶぶんは？', a: 0, options: ['エナメルしつ', 'しんけい'], explain: 'エナメルしつは からだの なかで いちばんかたい ぶぶん！でも さんには よわいよ！' },
      ]
    },
    {
      id: 'cavity',
      name: '🦠 むしばのなりたち',
      color: '#DC2626',
      questions: [
        { q: 'むしばをつくる バイキンの なまえは？', a: 0, options: ['ミュータンスきん', 'ビフィズスきん'], explain: 'ミュータンスきんが さとうをたべて「さん」をだして はをとかすんだ！' },
        { q: 'むしばは どうやって できる？', a: 0, options: ['バイキンが はをとかす', 'はが じぶんでくさる'], explain: 'バイキンが さとうをたべて「さん」をだす → その さんが はを とかす → むしばになるよ！' },
        { q: 'むしばバイキンの エサは なに？', a: 0, options: ['さとう', 'やさい'], explain: 'ミュータンスきんは さとうが だいすき！さとうをたべて はをとかす「さん」をつくるよ！' },
        { q: 'たべたあと おくちの なかは どうなる？', a: 0, options: ['さんせいになる', 'アルカリせいになる'], explain: 'たべると おくちが さんせいになって はがとけはじめる！だから たべたらはみがき！' },
        { q: 'だえき（つば）は むしばから まもってくれる？', a: 0, options: ['まもってくれる', 'かんけいない'], explain: 'だえきには さんを やわらげたり、とけたはを なおすちからがあるよ！すごいでしょ！' },
        { q: 'はがとけても もとにもどることがある。ホント？', a: 0, options: ['ホント', 'ウソ'], explain: '「さいせっかいか」といって、すこし とけたはは だえきの ちからで もとにもどるよ！でも おおきく とけるともどらない！' },
        { q: 'ねるまえの はみがきが だいじなのは なぜ？', a: 0, options: ['ねてるあいだ だえきが へるから', 'あさは いそがしいから'], explain: 'ねてるあいだは だえきが ほとんどでない → バイキンが ふえほうだい！だから ねるまえが いちばんだいじ！' },
        { q: 'むしばは ひとから うつる？', a: 0, options: ['うつる', 'うつらない'], explain: 'ミュータンスきんは おうちのひとの スプーンや コップから うつることがあるよ！' },
        { q: 'むしばは いたくなるまえに はいしゃさんに いくべき？', a: 0, options: ['いたくなるまえに！', 'いたくなってから'], explain: 'いたくなったときは もう むしばが すすんでるよ！はやめに みつければ ちいさくなおせる！' },
      ]
    },
    {
      id: 'fluoride_detail',
      name: '🧪 フッそのうどと効果',
      color: '#059669',
      questions: [
        { q: 'あかちゃん（はえたて）の はみがきこの フッそのうどは？', a: 0, options: ['500ppm', '1500ppm'], explain: '0〜2さいは 500ppm（ぴーぴーえむ）を ごはんつぶくらいの りょうで！' },
        { q: '3〜5さいの フッそのうどは？', a: 0, options: ['500〜1000ppm', '50ppm'], explain: '3〜5さいは 500〜1000ppmを グリーンピースくらいの りょう！' },
        { q: '6さいいじょうの フッそのうどは？', a: 1, options: ['500ppm', '1000〜1500ppm'], explain: '6さいからは おとなとおなじ 1000〜1500ppm！はブラシの 2/3くらいの りょうをつかおう！' },
        { q: 'フッそは はに なにをしてくれる？', a: 0, options: ['はを かたくする', 'はを しろくする'], explain: 'フッそは エナメルしつを かたい「フルオロアパタイト」に かえて、さんに とけにくくしてくれる！' },
        { q: 'はみがきのあと おくちをゆすぎすぎると？', a: 0, options: ['フッそが ながれちゃう', 'もんだいない'], explain: 'たくさんゆすぐと せっかくの フッそが ながれちゃう！ペッとするのは 1かいだけ、すこしのおみずで！' },
        { q: 'はいしゃさんでぬる フッそは はみがきこの なんばい つよい？', a: 1, options: ['2ばい', 'やく9ばい'], explain: 'はいしゃさんの フッそは 9000ppm！はみがきこの やく9ばい つよいよ！3〜6かげつに 1かい ぬってもらおう！' },
        { q: 'フッそは いつぬるのが いちばん こうかてき？', a: 0, options: ['はが はえたばかりのとき', 'おとなになってから'], explain: 'はえたての はは まだやわらかくて フッそを よくすいこむ！だから こどものときが いちばん こうかてき！' },
        { q: 'フッそいりの はみがきこは まいにちつかっていい？', a: 0, options: ['まいにちOK', '1しゅうかんに 1かい'], explain: 'まいにち つかうのが いちばん こうかてき！あさとよる、フッそいりで みがこう！' },
      ]
    },
    {
      id: 'floss',
      name: '🧵 フロスのだいじさ',
      color: '#7C3AED',
      questions: [
        { q: 'はブラシだけで よごれは なんパーセント とれる？', a: 0, options: ['やく60%', 'やく100%'], explain: 'はブラシだけだと やく60%！のこり40%は はとはの あいだの よごれだよ！' },
        { q: 'フロスをつかうと よごれは どのくらいとれる？', a: 1, options: ['やく60%', 'やく80〜90%'], explain: 'はブラシ＋フロスで やく80〜90%の よごれが とれるよ！' },
        { q: 'むしばが できやすい ばしょ ナンバーワンは？', a: 0, options: ['はとはの あいだ', 'はの おもて'], explain: 'はとはの あいだは はブラシが とどかない！ここが むしばナンバーワン！だからフロスが だいじ！' },
        { q: 'フロスは なんさいから つかえる？', a: 0, options: ['はが はえそろったら', 'おとなになってから'], explain: 'にゅうしが はえそろう 2〜3さいごろから、おうちのひとに やってもらおう！' },
        { q: 'フロスを つかうとき ちが でたら どうする？', a: 1, options: ['すぐやめる', 'やさしくつづける'], explain: 'さいしょは ちがでることもあるけど、つづけると はぐきがけんこうになって ちがでなくなるよ！' },
        { q: 'フロスと はブラシ、さきにやるのは？', a: 0, options: ['フロスがさき', 'はブラシがさき'], explain: 'フロスで はのあいだの よごれをとってから はブラシすると、フッそが はのあいだにも とどくよ！' },
        { q: 'しかんブラシ（はのあいだブラシ）は なにに つかう？', a: 0, options: ['おおきな すきまの そうじ', 'はの おもてを みがく'], explain: 'はとはの あいだの すきまが おおきいところに！おとなの はには とくに だいじだよ！' },
      ]
    },
    {
      id: 'snacking',
      name: '🍭 おやつのたべかた',
      color: '#EA580C',
      questions: [
        { q: 'むしばに なりやすい たべかたは？', a: 0, options: ['ダラダラたべ', 'いっきにたべる'], explain: 'ダラダラたべると おくちが ずっとさんせい！じかんをきめて たべよう！' },
        { q: 'おやつは 1にち なんかいが いい？', a: 0, options: ['1〜2かい、じかんをきめて', 'すきなとき なんかいでも'], explain: 'おやつは じかんをきめて 1〜2かい！たべるたびに おくちが さんせいに なるから、かいすうが すくないほうが いいよ！' },
        { q: 'むしばに なりにくい おやつは？', a: 1, options: ['あめ・キャラメル', 'チーズ・ナッツ'], explain: 'チーズは はをまもるカルシウムたっぷり！ナッツも さとうがすくなくて むしばになりにくいよ！' },
        { q: 'ジュースを のみつづけると はは どうなる？', a: 0, options: ['とけてしまう', 'つよくなる'], explain: 'ジュースの さんで はが とけてしまう「さんしょくしょう」になるよ！とくに スポーツドリンクに ちゅうい！' },
        { q: 'おやつのあと すぐに できる むしばよぼうは？', a: 0, options: ['おみずか おちゃを のむ', 'ガムを なげる'], explain: 'おみずや おちゃで おくちを すすぐだけでも さんせいが やわらぐよ！はみがきできないときの おたすけワザ！' },
        { q: 'スポーツドリンクは むしばに なりやすい？', a: 0, options: ['なりやすい！', 'ならない'], explain: 'スポーツドリンクには おさとうがいっぱい！500mlに さとうスティック 8ぽんぶん！のみすぎ ちゅうい！' },
        { q: 'くだものは むしばに なりやすい？', a: 1, options: ['とてもなりやすい', 'さとうより なりにくい'], explain: 'くだものの あまさ（かとう）は さとう（しょとう）より むしばに なりにくい！でも たべすぎには ちゅうい！' },
        { q: 'おやつのあと はみがきできないとき、いちばんいいのは？', a: 0, options: ['キシリトールガムをかむ', 'なにもしない'], explain: 'キシリトールガムは バイキンの エサにならない＋だえきがでる＋さんせいを やわらげる！さいきょうの おたすけアイテム！' },
        { q: 'チョコレートと あめ、むしばになりやすいのは？', a: 1, options: ['チョコレート', 'あめ'], explain: 'あめは ながいあいだ おくちに いるから、むしばバイキンに ずっと エサを あげてるようなもの！' },
      ]
    },
    {
      id: 'checkup',
      name: '🏥 ていきけんしんのひみつ',
      color: '#0891B2',
      questions: [
        { q: 'はいしゃさんには なんかげつに 1かい いくのがいい？', a: 0, options: ['3〜4かげつに1かい', '3ねんに1かい'], explain: '3〜4かげつごとに けんしんすると、むしばを ちいさいうちに みつけられるよ！' },
        { q: 'けんしんで むしばが みつかったら すぐなおしたほうがいい？', a: 0, options: ['すぐなおす！', 'いたくなってから'], explain: 'ちいさい むしばは いたくないけど、ほうっておくと どんどんおおきくなるよ！ちいさいうちなら すぐなおる！' },
        { q: 'けんしんでは むしば以外にも みてくれる？', a: 0, options: ['はぐきや かみあわせも！', 'むしばだけ'], explain: 'はぐきの けんこう、かみあわせ、はならび、おくちの そうじ、ぜんぶ みてくれるよ！' },
        { q: 'はいしゃさんで おそうじしてもらうと なにがいい？', a: 0, options: ['じぶんでは とれない よごれが とれる', 'とくにいみはない'], explain: '「しせき（歯石）」は はブラシでは とれないカチカチの よごれ！はいしゃさんの きかいで きれいに とってもらおう！' },
        { q: 'シーラントって なに？', a: 0, options: ['おくばの みぞを うめる むしばよぼう', 'はを しろくぬる'], explain: 'おくばの ふかい みぞに プラスチックを ながして うめるよ！むしばバイキンが はいれなくなる！' },
        { q: 'けんしんに いくと はみがきの しかたも おしえてもらえる？', a: 0, options: ['おしえてもらえる！', 'じぶんで しらべる'], explain: 'えいせいしさんが きみにぴったりの はみがきの しかたを おしえてくれるよ！にがてなところも わかる！' },
        { q: 'にゅうし（こどもの は）は むしばになっても ぬけるから だいじょうぶ？', a: 1, options: ['だいじょうぶ', 'だいじょうぶじゃない！'], explain: 'にゅうしの むしばを ほうっておくと、したから はえてくる おとなのはにも えいきょうする！にゅうしも だいじ！' },
        { q: 'はいしゃさんに いくのは いたいときだけ？', a: 1, options: ['いたいときだけ', 'げんきなときにも いく！'], explain: 'げんきなときに いくのが 「よぼう」！いたくなってから いくと、ちりょうが おおきくなるよ！' },
        { q: 'フッそは はいしゃさんでぬっ���もらうのと いえでぬるの���どっちもだいじ？', a: 0, options: ['どっちもだいじ！', 'はいしゃさんだけでOK'], explain: 'まいにちの はみがきこ（フッそ��＋ 3〜4かげつごとの はいしゃさんの フッそ、ダブルで むしばよぼう��' },
      ]
    },
    {
      id: 'posture_habit',
      name: '🧍 しせいとくせ',
      color: '#B45309',
      questions: [
        { q: 'ほおづえをつく くせがあると はならびに えいきょうする？', a: 0, options: ['えいきょうする！', 'しない'], explain: 'ほおづえは あごに すごいちからが かかる！まいにちつづけると あごがゆがんで はならびも がたがたに！' },
        { q: 'ゆびしゃぶりを つづけると はに どんな えいきょうがある？', a: 0, options: ['でっぱ（しゃへき）になる', 'はが つよくなる'], explain: 'ゆびしゃぶりを つづけると うえのまえばが まえに でてしまう「かいこう」や「じょうがくぜんとつ」に なるよ！' },
        { q: 'ゆびしゃぶりは なんさいまでに やめるのがいい？', a: 0, options: ['3さいまで', '10さいまで'], explain: '3さいすぎても つづけると えいきゅうし（おとなのは）の はならびに えいきょうするよ！' },
        { q: 'くちびるを かむ くせは はならびに わるい？', a: 0, options: ['わるい', 'もんだいない'], explain: 'したくちびるを かむと うえのまえばが まえに でて、したのまえばが うちがわに はいってしまうよ！' },
        { q: 'テレビをみるとき いつも おなじむきだと？', a: 0, options: ['かおが ゆがむ', 'もんだいない'], explain: 'いつも おなじほうこうを むいていると くび・あご・かみあわせが ゆがんでしまうことが あるよ！' },
        { q: 'ねるとき うつぶせで ねると あごに わるい？', a: 0, options: ['わるい', 'だいじょうぶ'], explain: 'うつぶせねは あごに ずっと ちからがかかる！よこむきや あおむけで ねよう！' },
        { q: 'いい しせいは はならびにも かんけいある？', a: 0, options: ['かんけいある！', 'かんけいない'], explain: 'せすじを ピンとすると あごの いちが ただしくなって、はならびも きれいに そだつよ！' },
        { q: 'つめを かむ くせは はに わるい？', a: 0, options: ['わるい！', 'もんだいない'], explain: 'つめかみは はが かけたり、はならびが ガタガタになる げんいんに！ つめに バイキンも いっぱい！' },
        { q: 'えんぴつや ペンを かむ くせは？', a: 0, options: ['はに よくない', 'もんだいない'], explain: 'かたいものを かみつづけると はが すりへったり、はならびが ずれたりするよ！' },
        { q: 'べろで はを おす くせ（ぜつへき）が あると？', a: 0, options: ['はならびが わるくなる', 'はが つよくなる'], explain: 'べろで はを おしつづけると まえばが ひらいてしまう「かいこう」に なるよ！スポットに べろを おこう！' },
      ]
    },
  ];

  let currentCategory = null;
  let currentQuestionIdx = 0;
  let correctCount = 0;
  let questions = [];
  let startTime = 0;

  function start() {
    showCategorySelect();
  }

  function showCategorySelect() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen quiz-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <span class="game-progress">🧠 おくちクイズ</span>
        </div>
        <h2 class="quiz-select-title">カテゴリをえらんでね！</h2>
        <div class="quiz-category-grid">
          ${QUIZ_CATEGORIES.map(cat => `
            <button class="quiz-category-btn" style="border-color:${cat.color};color:${cat.color}"
              onclick="GameQuiz.selectCategory('${cat.id}')">
              <span class="quiz-cat-name">${cat.name}</span>
              <span class="quiz-cat-count">${cat.questions.length}もん</span>
            </button>
          `).join('')}
          <button class="quiz-category-btn quiz-cat-random" style="border-color:#64748B;color:#64748B"
            onclick="GameQuiz.selectCategory('random')">
            <span class="quiz-cat-name">🎲 ランダム</span>
            <span class="quiz-cat-count">ぜんぶからしゅつだい</span>
          </button>
        </div>
      </div>
    `;
  }

  function selectCategory(catId) {
    if (catId === 'random') {
      const all = QUIZ_CATEGORIES.flatMap(c => c.questions.map(q => ({ ...q, color: c.color })));
      questions = shuffle(all).slice(0, 10);
      currentCategory = { name: '🎲 ランダム', color: '#64748B' };
    } else {
      const cat = QUIZ_CATEGORIES.find(c => c.id === catId);
      questions = shuffle([...cat.questions]).map(q => ({ ...q, color: cat.color }));
      currentCategory = cat;
    }
    currentQuestionIdx = 0;
    correctCount = 0;
    startTime = Date.now();
    showQuestion();
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function showQuestion() {
    if (currentQuestionIdx >= questions.length) {
      showResults();
      return;
    }
    const q = questions[currentQuestionIdx];
    const app = document.getElementById('app');
    const color = q.color || currentCategory.color;

    app.innerHTML = `
      <div class="game-screen quiz-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ やめる</button>
          <span class="game-progress">${currentQuestionIdx + 1}/${questions.length}　⭐${correctCount}</span>
        </div>

        <div class="quiz-question-card" style="border-color:${color}">
          <div class="quiz-q-number" style="background:${color}">Q${currentQuestionIdx + 1}</div>
          <p class="quiz-q-text">${q.q}</p>
        </div>

        <div class="quiz-options">
          <button class="quiz-option-btn quiz-option-a" onclick="GameQuiz.answer(0)">
            <span class="quiz-option-label">A</span>
            <span class="quiz-option-text">${q.options[0]}</span>
          </button>
          <button class="quiz-option-btn quiz-option-b" onclick="GameQuiz.answer(1)">
            <span class="quiz-option-label">B</span>
            <span class="quiz-option-text">${q.options[1]}</span>
          </button>
        </div>
      </div>
    `;
  }

  function answer(idx) {
    const q = questions[currentQuestionIdx];
    const correct = idx === q.a;
    if (correct) { correctCount++; try { Sounds.correct(); Voice.correct(); } catch(e) {} }
    else { try { Sounds.wrong(); Voice.wrong(); } catch(e) {} }

    const app = document.getElementById('app');
    const color = q.color || currentCategory.color;

    app.innerHTML = `
      <div class="game-screen quiz-screen">
        <div class="game-top-bar">
          <span class="game-progress">${currentQuestionIdx + 1}/${questions.length}　⭐${correctCount}</span>
        </div>

        <div class="quiz-result-card ${correct ? 'quiz-correct' : 'quiz-wrong'}">
          <div class="quiz-result-icon">${correct ? '⭕ せいかい！' : '❌ ざんねん...'}</div>
          <div class="quiz-result-answer">
            こたえ: <strong>${q.options[q.a]}</strong>
          </div>
          <div class="quiz-explain">
            💡 ${q.explain}
          </div>
        </div>

        <button class="btn-game btn-game-retry" onclick="GameQuiz.next()" style="margin-top:20px">
          ${currentQuestionIdx + 1 < questions.length ? 'つぎのもんだい →' : 'けっかをみる →'}
        </button>
      </div>
    `;
  }

  function next() {
    currentQuestionIdx++;
    showQuestion();
  }

  function showResults() {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const pct = Math.round(correctCount / questions.length * 100);
    const grade = pct >= 80 ? '🏆 はかせレベル！' : pct >= 60 ? '⭐ すごいね！' : pct >= 40 ? '👍 がんばったね！' : '📚 もういちど チャレンジ！';

    // ログ保存
    OralApp.logGameComplete('quiz', correctCount * 10, duration);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="complete-screen">
        <div class="complete-stars">${pct >= 80 ? '🏆🎉🏆' : '⭐🌟⭐'}</div>
        <h1 class="complete-title">${grade}</h1>
        <div class="quiz-final-score">
          <span class="quiz-final-correct">${correctCount}</span> / ${questions.length} もん せいかい
        </div>
        <p class="complete-score">${pct}てん</p>
        <div class="complete-stamp">📌 きょうのスタンプゲット！</div>
        <div class="complete-coin">🪙 +1コイン！</div>
        <div class="complete-actions">
          <button class="btn-game btn-game-retry" onclick="GameQuiz.start()">べつのカテゴリ</button>
          <button class="btn-game btn-game-home" onclick="OralApp.showHome()">ホームにもどる</button>
        </div>
      </div>
    `;
  }

  return { start, selectCategory, answer, next };
})();
