// おくちドリル — 「くすっ」と笑える一言 + 歯をみがこう！
// 構成: イラスト（SVG） + 短い一言 + 「歯をみがこう！」

const DRILL_DATA = {
  // ===== くすっドリル =====
  kusutto: [
    // 🤝 ともだち編
    { id: 'k01', category: 'ともだち', illustration: 'test100', text: '100点とっても、', punchline: '歯をみがこう！' },
    { id: 'k02', category: 'ともだち', illustration: 'handshake', text: '仲直りしたら、', punchline: '歯をみがこう！' },
    { id: 'k03', category: 'ともだち', illustration: 'ironbar', text: 'さかあがりできたら、', punchline: '歯をみがこう！' },
    { id: 'k04', category: 'ともだち', illustration: 'relay', text: 'リレーで1位になっても、', punchline: '歯をみがこう！' },
    { id: 'k05', category: 'ともだち', illustration: 'friend_laugh', text: '友だちと大笑いしたあとは、', punchline: '歯をみがこう！' },

    // 😢 なやみ編
    { id: 'k06', category: 'なやみ', illustration: 'heartbreak', text: '失恋しても、', punchline: '歯をみがこう！' },
    { id: 'k07', category: 'なやみ', illustration: 'forgot', text: 'わすれものしても、', punchline: '歯をみがこう！' },
    { id: 'k08', category: 'なやみ', illustration: 'crying', text: '泣いちゃっても、', punchline: '歯をみがこう！' },
    { id: 'k09', category: 'なやみ', illustration: 'lost_game', text: '試合に負けても、', punchline: '歯をみがこう！' },
    { id: 'k10', category: 'なやみ', illustration: 'rainy', text: '遠足が雨でも、', punchline: '歯をみがこう！' },

    // 🍚 せいかつ編
    { id: 'k11', category: 'せいかつ', illustration: 'curry', text: 'カレーおかわりしても、', punchline: '歯をみがこう！' },
    { id: 'k12', category: 'せいかつ', illustration: 'homework', text: '宿題おわったら、', punchline: '歯みがきだ！' },
    { id: 'k13', category: 'せいかつ', illustration: 'pajama', text: 'パジャマ着たら、あとひとつ！', punchline: '歯をみがこう！' },
    { id: 'k14', category: 'せいかつ', illustration: 'morning', text: '朝ごはん食べたら、', punchline: '歯みがきだ！' },
    { id: 'k15', category: 'せいかつ', illustration: 'game_over', text: 'ゲームオーバーになっても、', punchline: '歯をみがこう！' },

    // 🤣 ばかばかしい編
    { id: 'k16', category: 'ばかばかしい', illustration: 'principal', text: 'つまらなくても、', punchline: '歯をみがこう！' },
    { id: 'k17', category: 'ばかばかしい', illustration: 'papa_ramen', text: 'ダイエット中のパパがラーメン食べてても、', punchline: '歯をみがこう！' },
    { id: 'k18', category: 'ばかばかしい', illustration: 'papa_joke', text: 'パパのダジャレがさむくても、', punchline: '歯をみがこう！' },
    { id: 'k19', category: 'ばかばかしい', illustration: 'ufo', text: 'UFO見ちゃっても、', punchline: '歯をみがこう！' },
    { id: 'k20', category: 'ばかばかしい', illustration: 'fart', text: 'おならが出ても、', punchline: '歯をみがこう！' },
    { id: 'k21', category: 'ばかばかしい', illustration: 'ghost', text: 'おばけが出ても、', punchline: '歯をみがこう！' },
    { id: 'k22', category: 'ばかばかしい', illustration: 'sleeping_class', text: '授業中ねむくても、', punchline: '歯をみがこう！' },
    { id: 'k23', category: 'ばかばかしい', illustration: 'dog_homework', text: '犬に宿題を食べられても、', punchline: '歯をみがこう！' },

    // 🌍 よのなかへん？編
    { id: 'k24', category: 'よのなかへん', illustration: 'politician', text: '「おぼえてません」って言われても、きみは忘れないで！', punchline: '歯をみがこう！' },
    { id: 'k25', category: 'よのなかへん', illustration: 'mama_5min', text: 'ママの「あと5分」が30分でも、きみは3分でできる！', punchline: '歯みがきだ！' },
    { id: 'k26', category: 'よのなかへん', illustration: 'meeting', text: '会議2時間、なにも決まらなくても、きみは今すぐできる！', punchline: '歯をみがこう！' },
    { id: 'k27', category: 'よのなかへん', illustration: 'ai_robot', text: 'AIがなんでもやってくれる時代。でもこれだけは自分で！', punchline: '歯をみがこう！' },
    { id: 'k28', category: 'よのなかへん', illustration: 'influencer', text: 'フォロワー100万人いても、', punchline: '歯をみがこう！' },
  ],

  // ===== 学習クイズ（7〜10歳版） =====
  math: [
    { q: '乳歯は20本。永久歯は28本。何本ふえる？', a: 0, options: ['8本', '12本'], explain: '28 − 20 = 8本ふえるよ！' },
    { q: 'フッ素1000ppmの歯みがき粉。2回みがくと合計何ppm使った？', a: 1, options: ['1000ppm', '2000ppm'], explain: '1000 × 2 = 2000ppmだね！' },
    { q: '3分間歯みがき。1日2回。1週間で合計何分？', a: 1, options: ['21分', '42分'], explain: '3分 × 2回 × 7日 = 42分！' },
    { q: '歯ブラシを1ヶ月で交換。1年間で何本使う？', a: 1, options: ['6本', '12本'], explain: '12ヶ月 ÷ 1ヶ月 = 12本！' },
    { q: 'カタツムリの歯は約20,000本。人間の歯の何倍？', a: 1, options: ['100倍', '約700倍'], explain: '20,000 ÷ 28 ≒ 714倍！すごい！' },
    { q: '歯医者さんのフッ素は9,000ppm。歯みがき粉の1,000ppmの何倍？', a: 0, options: ['9倍', '90倍'], explain: '9,000 ÷ 1,000 = 9倍！' },
    { q: 'だ液は1日1.5リットル出る。1週間では？', a: 1, options: ['7.5リットル', '10.5リットル'], explain: '1.5 × 7 = 10.5リットル！ペットボトル21本分！' },
    { q: 'サメは一生で約30,000本の歯が生える。人間の約28本の何倍？', a: 1, options: ['100倍', '約1,000倍'], explain: '30,000 ÷ 28 ≒ 1,071倍！' },
  ],

  science: [
    { q: 'エナメル質の主な成分は「リン酸カルシウム」。カルシウムが多い食べ物は？', a: 0, options: ['牛乳・チーズ', 'チョコレート'], explain: '牛乳やチーズにはカルシウムがたっぷり！歯を強くするよ！' },
    { q: '虫歯菌が出す「酸」は、pH何くらい？', a: 0, options: ['pH 4〜5（酸性）', 'pH 8〜9（アルカリ性）'], explain: '虫歯菌は酸を出して歯を溶かす。だ液が中性に戻してくれるよ！' },
    { q: 'フッ素が歯を守るしくみは？', a: 0, options: ['エナメル質を強い結晶に変える', '歯を白くぬる'], explain: 'フッ素はエナメル質を「フルオロアパタイト」という強い結晶に変えるんだ！' },
    { q: '歯の中の神経は何を感じる？', a: 1, options: ['味', '痛みと温度'], explain: '歯の神経は痛みと温度を感じるよ。虫歯が神経に届くと痛い！' },
    { q: 'だ液に含まれている虫歯を防ぐ成分は？', a: 0, options: ['カルシウムとリン', 'ビタミンC'], explain: 'だ液のカルシウムとリンが、溶けかけた歯を修復（再石灰化）するよ！' },
    { q: '歯垢（プラーク）の正体は？', a: 1, options: ['食べカス', '細菌のかたまり'], explain: 'プラークは細菌が何億個も集まったもの。食べカスとは違うよ！' },
    { q: '酸性の飲み物で歯が溶ける現象を何という？', a: 0, options: ['酸蝕症（さんしょくしょう）', '虫歯'], explain: '虫歯は細菌が原因。酸蝕症はジュースなどの酸が直接歯を溶かすこと！' },
    { q: 'キシリトールは白樺の木から取れる。これは何の仲間？', a: 0, options: ['糖アルコール', 'ビタミン'], explain: 'キシリトールは糖アルコール。甘いけど虫歯菌のエサにならない！' },
  ],

  tochigi: [
    { q: '栃木県で一番高い山は？', a: 0, options: ['日光白根山', '男体山'], explain: '日光白根山は2,578m！関東で一番高い山だよ！' },
    { q: '日光東照宮をつくらせた人は？', a: 0, options: ['徳川家康', '豊臣秀吉'], explain: '徳川家康をまつるために建てられたよ！世界遺産だね！' },
    { q: '栃木県が生産量日本一のくだものは？', a: 0, options: ['いちご', 'りんご'], explain: '栃木といえばいちご！「とちおとめ」「スカイベリー」が有名！' },
    { q: '日光東照宮の「三猿」が教えていることは？', a: 0, options: ['見ざる・聞かざる・言わざる', '走る・泳ぐ・飛ぶ'], explain: '「悪いことを見ない・聞かない・言わない」という教えだよ！' },
    { q: '栃木県の県庁所在地は？', a: 0, options: ['宇都宮市', '小山市'], explain: '宇都宮市！「ぎょうざの街」としても有名だね！' },
    { q: '宇都宮市で有名な食べ物は？', a: 1, options: ['ラーメン', 'ぎょうざ'], explain: '宇都宮ぎょうざ！毎年ぎょうざの消費量日本一を争っているよ！' },
    { q: '日光の「華厳の滝」の高さは約何メートル？', a: 1, options: ['約50m', '約97m'], explain: '華厳の滝は約97m！日本三名瀑のひとつだよ！' },
    { q: '栃木県の有名な温泉地は？', a: 0, options: ['鬼怒川温泉', '草津温泉'], explain: '鬼怒川温泉！草津は群馬県だよ！' },
    { q: '栃木県のゆるキャラ「とちまるくん」のモチーフは？', a: 0, options: ['いちご', 'ぎょうざ'], explain: 'とちまるくんは栃木の「とち」の木の実がモチーフだよ！' },
    { q: '那須高原にいる動物で有名なのは？', a: 0, options: ['アルパカ', 'ペンギン'], explain: '那須アルパカ牧場！もふもふのアルパカに会えるよ！' },
    { q: '足利市にある「あしかがフラワーパーク」で有名な花は？', a: 1, options: ['さくら', '藤（ふじ）の花'], explain: '大藤棚は圧巻！CNNの「世界の夢の旅行先10選」にも選ばれたよ！' },
    { q: '益子町で有名な伝統工芸は？', a: 0, options: ['益子焼（ましこやき）', '日光彫り'], explain: '益子焼は江戸時代から続く焼き物。益子陶器市は年2回開催！' },
  ],

  english: [
    { q: '「tooth」の複数形は？', a: 1, options: ['tooths', 'teeth'], explain: 'tooth → teeth！不規則変化だよ！' },
    { q: '「歯ブラシ」は英語で？', a: 0, options: ['toothbrush', 'teethbrush'], explain: 'toothbrush！tooth + brush だね！' },
    { q: '「mouth」の意味は？', a: 0, options: ['口', '歯'], explain: 'mouth = 口。tooth = 歯 だよ！' },
    { q: '「dentist」の意味は？', a: 0, options: ['歯医者さん', '先生'], explain: 'dentist = 歯医者さん。teacher = 先生だよ！' },
    { q: '「Brush your teeth!」の意味は？', a: 0, options: ['歯をみがこう！', '歯をみせて！'], explain: 'brush = みがく。Brush your teeth! = 歯をみがこう！' },
    { q: '「smile」の意味は？', a: 1, options: ['泣く', '笑顔'], explain: 'smile = 笑顔！きれいな歯で smile しよう！' },
    { q: '「cavity」の意味は？', a: 0, options: ['虫歯', '歯ぐき'], explain: 'cavity = 虫歯。I have no cavities! = 虫歯ゼロ！' },
    { q: '「tongue」の意味は？', a: 0, options: ['舌（した）', '唇（くちびる）'], explain: 'tongue = 舌。lip = 唇だよ！' },
    { q: '「floss」の意味は？', a: 1, options: ['歯みがき粉', '糸ようじ・フロス'], explain: 'floss = フロス。歯と歯の間をきれいにする糸だよ！' },
    { q: '「strawberry」を日本語にすると？栃木の名産！', a: 0, options: ['いちご', 'ぶどう'], explain: 'strawberry = いちご！栃木はstrawberryの生産量日本一！' },
  ],
};

// ===== ドリルイラストSVG =====
const DRILL_ILLUSTRATIONS = {
  // 校長先生（スピーチ中）
  principal: `<svg viewBox="0 0 200 200" class="drill-illust">
    <circle cx="100" cy="80" r="45" fill="#FDDCB5"/>
    <ellipse cx="100" cy="55" rx="48" ry="25" fill="#FDDCB5"/>
    <path d="M55,70 Q48,50 60,42" fill="none" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
    <path d="M145,70 Q152,50 140,42" fill="none" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
    <circle cx="82" cy="78" r="14" fill="none" stroke="#475569" stroke-width="3"/>
    <circle cx="118" cy="78" r="14" fill="none" stroke="#475569" stroke-width="3"/>
    <circle cx="82" cy="80" r="3" fill="#1E293B"/><circle cx="118" cy="80" r="3" fill="#1E293B"/>
    <ellipse cx="100" cy="102" rx="10" ry="7" fill="#7C2D12"/>
    <rect x="70" y="120" width="60" height="60" rx="10" fill="#1E293B"/>
    <polygon points="100,125 94,160 100,165 106,160" fill="#DC2626"/>
    <text x="165" y="45" font-size="14" fill="#94A3B8">Z</text>
    <text x="172" y="35" font-size="10" fill="#CBD5E1">z</text>
  </svg>`,

  // パパ（ラーメン食べてる）
  papa_ramen: `<svg viewBox="0 0 200 200" class="drill-illust">
    <circle cx="100" cy="65" r="40" fill="#FDDCB5"/>
    <rect x="70" y="100" width="60" height="50" rx="8" fill="#3B82F6"/>
    <circle cx="85" cy="60" r="4" fill="#1E293B"/><circle cx="115" cy="60" r="4" fill="#1E293B"/>
    <path d="M88,78 Q100,88 112,78" fill="none" stroke="#1E293B" stroke-width="2"/>
    <ellipse cx="100" cy="160" rx="35" ry="20" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
    <path d="M80,155 Q90,145 100,155 Q110,145 120,155" fill="none" stroke="#F97316" stroke-width="2"/>
    <text x="100" y="165" text-anchor="middle" font-size="10" fill="#92400E">ラーメン</text>
    <rect x="55" y="22" width="30" height="3" rx="1" fill="#475569"/>
    <text x="60" y="18" font-size="8" fill="#64748B">ダイエット中</text>
  </svg>`,

  // UFO
  ufo: `<svg viewBox="0 0 200 200" class="drill-illust">
    <ellipse cx="100" cy="100" rx="70" ry="20" fill="#94A3B8"/>
    <ellipse cx="100" cy="90" rx="40" ry="30" fill="#CBD5E1"/>
    <ellipse cx="100" cy="85" rx="30" ry="18" fill="#E2E8F0"/>
    <circle cx="85" cy="85" r="3" fill="#22C55E"/><circle cx="100" cy="82" r="3" fill="#22C55E"/><circle cx="115" cy="85" r="3" fill="#22C55E"/>
    <circle cx="60" cy="100" r="5" fill="#FDE68A"/><circle cx="100" cy="105" r="5" fill="#FDE68A"/><circle cx="140" cy="100" r="5" fill="#FDE68A"/>
    <line x1="100" y1="120" x2="100" y2="170" stroke="#FDE68A" stroke-width="3" opacity=".4"/>
    <text x="100" y="190" text-anchor="middle" font-size="14" fill="#94A3B8">!?</text>
  </svg>`,

  // 💔 失恋
  heartbreak: `<svg viewBox="0 0 200 200" class="drill-illust">
    <path d="M100,170 C30,120 10,70 50,40 C70,25 95,35 100,60 C105,35 130,25 150,40 C190,70 170,120 100,170Z" fill="#FECACA" stroke="#EF4444" stroke-width="2"/>
    <line x1="100" y1="50" x2="100" y2="160" stroke="#EF4444" stroke-width="3" stroke-dasharray="8"/>
    <path d="M100,50 L95,80 L105,70 L100,100" fill="none" stroke="#EF4444" stroke-width="2"/>
    <text x="60" y="100" font-size="20">💧</text>
  </svg>`,

  // おなら
  fart: `<svg viewBox="0 0 200 200" class="drill-illust">
    <circle cx="100" cy="80" r="35" fill="#FDDCB5"/>
    <circle cx="88" cy="75" r="3" fill="#1E293B"/><circle cx="112" cy="75" r="3" fill="#1E293B"/>
    <path d="M90,92 Q100,100 110,92" fill="none" stroke="#1E293B" stroke-width="2"/>
    <ellipse cx="130" cy="150" rx="30" ry="20" fill="#D9F99D" opacity=".6"/>
    <ellipse cx="145" cy="140" rx="20" ry="14" fill="#BEF264" opacity=".5"/>
    <text x="135" y="155" font-size="12" fill="#65A30D">💨</text>
    <text x="80" y="65" font-size="10" fill="#EF4444">！</text>
  </svg>`,

  // 100点
  test100: `<svg viewBox="0 0 200 200" class="drill-illust">
    <rect x="40" y="30" width="120" height="150" rx="5" fill="#fff" stroke="#CBD5E1" stroke-width="2"/>
    <text x="100" y="70" text-anchor="middle" font-size="12" fill="#64748B">テスト</text>
    <text x="100" y="130" text-anchor="middle" font-size="48" font-weight="900" fill="#EF4444">100</text>
    <text x="100" y="155" text-anchor="middle" font-size="14" fill="#EF4444">点</text>
    <circle cx="155" cy="40" r="15" fill="none" stroke="#EF4444" stroke-width="3"/>
    <text x="155" y="45" text-anchor="middle" font-size="12" font-weight="900" fill="#EF4444">花</text>
  </svg>`,

  // 握手（仲直り）
  handshake: `<svg viewBox="0 0 200 200" class="drill-illust">
    <path d="M50,120 Q50,100 70,95 L110,95 Q130,95 130,110" fill="none" stroke="#FDDCB5" stroke-width="16" stroke-linecap="round"/>
    <path d="M150,120 Q150,100 130,95 L90,95 Q70,95 70,110" fill="none" stroke="#FDDCB5" stroke-width="16" stroke-linecap="round"/>
    <text x="100" y="70" text-anchor="middle" font-size="30">🤝</text>
    <text x="100" y="170" text-anchor="middle" font-size="14" fill="#10B981">ごめんね！</text>
  </svg>`,

  // カレー
  curry: `<svg viewBox="0 0 200 200" class="drill-illust">
    <ellipse cx="100" cy="130" rx="60" ry="35" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
    <ellipse cx="100" cy="120" rx="50" ry="25" fill="#F97316"/>
    <ellipse cx="80" cy="115" rx="20" ry="15" fill="#FEFCE8"/>
    <circle cx="110" cy="112" r="5" fill="#92400E"/>
    <circle cx="120" cy="118" r="4" fill="#92400E"/>
    <path d="M80,80 Q80,60 100,60 Q120,60 120,80" fill="none" stroke="#94A3B8" stroke-width="3" opacity=".3"/>
    <path d="M90,75 Q90,55 100,55" fill="none" stroke="#94A3B8" stroke-width="2" opacity=".3"/>
  </svg>`,

  // 宿題
  homework: `<svg viewBox="0 0 200 200" class="drill-illust">
    <rect x="50" y="40" width="100" height="130" rx="3" fill="#fff" stroke="#CBD5E1" stroke-width="2"/>
    <line x1="70" y1="70" x2="130" y2="70" stroke="#DBEAFE" stroke-width="1"/>
    <line x1="70" y1="90" x2="130" y2="90" stroke="#DBEAFE" stroke-width="1"/>
    <line x1="70" y1="110" x2="130" y2="110" stroke="#DBEAFE" stroke-width="1"/>
    <line x1="70" y1="130" x2="130" y2="130" stroke="#DBEAFE" stroke-width="1"/>
    <text x="75" y="85" font-size="10" fill="#3B82F6">あいうえお</text>
    <text x="75" y="105" font-size="10" fill="#3B82F6">かきくけこ</text>
    <rect x="130" y="100" width="5" height="60" fill="#F59E0B"/>
    <polygon points="135,100 128,115 142,115" fill="#F59E0B"/>
    <text x="100" y="55" text-anchor="middle" font-size="10" fill="#64748B">しゅくだい</text>
  </svg>`,

  // パジャマ
  pajama: `<svg viewBox="0 0 200 200" class="drill-illust">
    <circle cx="100" cy="65" r="30" fill="#FDDCB5"/>
    <circle cx="90" cy="60" r="2" fill="#1E293B"/><circle cx="110" cy="60" r="2" fill="#1E293B"/>
    <path d="M93,73 Q100,78 107,73" fill="none" stroke="#1E293B" stroke-width="1.5"/>
    <rect x="72" y="90" width="56" height="70" rx="8" fill="#BFDBFE" stroke="#93C5FD" stroke-width="2"/>
    <circle cx="100" cy="105" r="3" fill="#3B82F6"/>
    <circle cx="100" cy="120" r="3" fill="#3B82F6"/>
    <circle cx="100" cy="135" r="3" fill="#3B82F6"/>
    <text x="100" y="185" text-anchor="middle" font-size="10" fill="#64748B">おやすみ…</text>
  </svg>`,

  // おばけ
  ghost: `<svg viewBox="0 0 200 200" class="drill-illust">
    <path d="M60,80 Q60,30 100,30 Q140,30 140,80 L140,160 Q130,145 120,160 Q110,145 100,160 Q90,145 80,160 Q70,145 60,160Z" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
    <circle cx="82" cy="75" r="8" fill="#1E293B"/><circle cx="118" cy="75" r="8" fill="#1E293B"/>
    <circle cx="85" cy="72" r="3" fill="#fff"/><circle cx="121" cy="72" r="3" fill="#fff"/>
    <ellipse cx="100" cy="105" rx="8" ry="10" fill="#475569"/>
    <text x="50" y="60" font-size="10" fill="#94A3B8">ひゅ〜</text>
  </svg>`,

  // ママ「あと5分」
  mama_5min: `<svg viewBox="0 0 200 200" class="drill-illust">
    <circle cx="100" cy="65" r="35" fill="#FDDCB5"/>
    <path d="M70,45 Q80,25 100,30 Q120,25 130,45" fill="#4B2512"/>
    <circle cx="88" cy="62" r="3" fill="#1E293B"/><circle cx="112" cy="62" r="3" fill="#1E293B"/>
    <path d="M92,78 Q100,84 108,78" fill="none" stroke="#1E293B" stroke-width="2"/>
    <rect x="135" y="50" width="40" height="30" rx="6" fill="#fff" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="155" y="70" text-anchor="middle" font-size="10" font-weight="700" fill="#1E293B">あと</text>
    <text x="155" y="80" text-anchor="middle" font-size="8" fill="#EF4444">5分…</text>
    <text x="100" y="180" text-anchor="middle" font-size="10" fill="#94A3B8">→ 30分後</text>
  </svg>`,

  // AI ロボット
  ai_robot: `<svg viewBox="0 0 200 200" class="drill-illust">
    <rect x="65" y="50" width="70" height="60" rx="10" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
    <rect x="55" y="120" width="90" height="50" rx="8" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2"/>
    <circle cx="88" cy="75" r="8" fill="#3B82F6"/><circle cx="112" cy="75" r="8" fill="#3B82F6"/>
    <circle cx="88" cy="75" r="3" fill="#fff"/><circle cx="112" cy="75" r="3" fill="#fff"/>
    <rect x="85" y="95" width="30" height="5" rx="2" fill="#94A3B8"/>
    <line x1="100" y1="45" x2="100" y2="30" stroke="#94A3B8" stroke-width="2"/>
    <circle cx="100" cy="27" r="5" fill="#F59E0B"/>
    <text x="100" y="145" text-anchor="middle" font-size="10" fill="#475569">AI</text>
  </svg>`,
};
