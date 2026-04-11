// おくちカード — 収集カードデータ（60枚以上）
const CARD_DATA = [
  // ===== ★1 コモン（70%） =====
  // 動物の歯シリーズ
  { id: 'c01', name: 'サメのは', icon: '🦈', rarity: 1, category: 'animal', fact: 'サメは いっしょうで なんまんかいも はがはえかわるよ！' },
  { id: 'c02', name: 'ゾウのは', icon: '🐘', rarity: 1, category: 'animal', fact: 'ゾウの おくばは にんげんの こぶしくらい おおきい！' },
  { id: 'c03', name: 'ウサギのは', icon: '🐰', rarity: 1, category: 'animal', fact: 'ウサギの はは いっしょう のびつづけるよ！' },
  { id: 'c04', name: 'カバのは', icon: '🦛', rarity: 1, category: 'animal', fact: 'カバの きばは 50センチ！バナナみたい！' },
  { id: 'c05', name: 'ワニのは', icon: '🐊', rarity: 1, category: 'animal', fact: 'ワニは はが80ほんもあるよ！' },
  { id: 'c06', name: 'ライオンのは', icon: '🦁', rarity: 1, category: 'animal', fact: 'ライオンの きばは 7センチ！えんぴつくらい！' },
  { id: 'c07', name: 'パンダのは', icon: '🐼', rarity: 1, category: 'animal', fact: 'パンダは たけをかむために おくばが すごく つよい！' },
  { id: 'c08', name: 'イルカのは', icon: '🐬', rarity: 1, category: 'animal', fact: 'イルカは はで さかなをつかまえて まるのみ！' },

  // まめちしきシリーズ
  { id: 'c09', name: 'エナメルしつ', icon: '💎', rarity: 1, category: 'trivia', fact: 'エナメルしつは からだで いちばんかたい！ダイヤモンドのつぎ！' },
  { id: 'c10', name: 'だえきのちから', icon: '💧', rarity: 1, category: 'trivia', fact: 'だえきは 1にちに 1〜1.5リットルもでるよ！' },
  { id: 'c11', name: 'にゅうし20ほん', icon: '👶', rarity: 1, category: 'trivia', fact: 'こどもの はは 20ほん。おとなは 28〜32ほん！' },
  { id: 'c12', name: 'フッそパワー', icon: '✨', rarity: 1, category: 'trivia', fact: 'フッそは はを さんに とけにくく してくれる！' },
  { id: 'c13', name: 'キシリトール', icon: '🍬', rarity: 1, category: 'trivia', fact: 'キシリトールは しらかばの きから とれるよ！' },
  { id: 'c14', name: 'カルシウム', icon: '🦴', rarity: 1, category: 'trivia', fact: 'はや ほねを つくるには カルシウムが だいじ！' },
  { id: 'c15', name: 'ビタミンC', icon: '🍊', rarity: 1, category: 'trivia', fact: 'ビタミンCは はぐきを けんこうに してくれる！' },

  // たいそうシリーズ
  { id: 'c16', name: 'あ のポーズ', icon: '😮', rarity: 1, category: 'exercise', fact: 'おくちを たてに おおきくあけると きんにくが きたえられる！' },
  { id: 'c17', name: 'い のポーズ', icon: '😬', rarity: 1, category: 'exercise', fact: 'よこに ひっぱると ほっぺの きんにくが つよくなる！' },
  { id: 'c18', name: 'う のポーズ', icon: '😗', rarity: 1, category: 'exercise', fact: 'くちびるを まえに だすと くちびるの ちからが つよくなる！' },
  { id: 'c19', name: 'べ のポーズ', icon: '😛', rarity: 1, category: 'exercise', fact: 'べろを だすと べろの きんにくが きたえられる！' },
  { id: 'c20', name: 'スポットポジション', icon: '👅', rarity: 1, category: 'exercise', fact: 'べろの さきは うわあごの まえにおくのが せいかい！' },

  // ===== ★2 レア（25%） =====
  { id: 'r01', name: 'カタツムリの2まんぽん', icon: '🐌', rarity: 2, category: 'animal', fact: 'カタツムリには やく2まんほんの ちいさなはが！せかいいち！' },
  { id: 'r02', name: 'ティラノサウルスのは', icon: '🦖', rarity: 2, category: 'animal', fact: 'ティラノの はは 15センチ！バナナより おおきい！' },
  { id: 'r03', name: 'ビーバーのオレンジのは', icon: '🦫', rarity: 2, category: 'animal', fact: 'ビーバーの はは オレンジいろ！てつぶんで かたいんだ！' },
  { id: 'r04', name: 'クジラのヒゲ', icon: '🐋', rarity: 2, category: 'animal', fact: 'クジラには はのかわりに「ヒゲ」がある！プランクトンをこす フィルター！' },
  { id: 'r05', name: 'ダイヤモンドバー', icon: '💎', rarity: 2, category: 'trivia', fact: 'はいしゃさんの はを けずる バーには ほんものの ダイヤモンド！' },
  { id: 'r06', name: 'レントゲンのひみつ', icon: '📸', rarity: 2, category: 'trivia', fact: 'はの レントゲンの ほうしゃせんは ひこうきに のるより すくない！' },
  { id: 'r07', name: 'さいせっかいか', icon: '🔄', rarity: 2, category: 'trivia', fact: 'すこし とけた はは だえきの ちからで もとにもどる！すごい！' },
  { id: 'r08', name: 'シーラント', icon: '🛡️', rarity: 2, category: 'trivia', fact: 'おくばの みぞを うめて むしばをふせぐ ひみつへいき！' },
  { id: 'r09', name: 'フロスマスター', icon: '🧵', rarity: 2, category: 'trivia', fact: 'はブラシ + フロスで よごれ 90%すっきり！' },
  { id: 'r10', name: 'ぜつあつ30kPa', icon: '💪', rarity: 2, category: 'exercise', fact: 'べろの ちからは 30キロパスカル いじょうが りそう！' },

  // ===== ★3 スーパーレア（5%） =====
  { id: 's01', name: 'きんのはブラシ', icon: '🏆', rarity: 3, category: 'special', fact: 'でんせつの はブラシ！これで みがけば むしば ゼロ！…かも？' },
  { id: 's02', name: 'にじいろのは', icon: '🌈', rarity: 3, category: 'special', fact: 'すべての いろが かがやく ふしぎな は！きれいにみがくと にじいろにひかる！' },
  { id: 's03', name: 'はのようせいおう', icon: '👑', rarity: 3, category: 'special', fact: 'はの ようせいの おうさま！すべての はを まもる でんせつの そんざい！' },
  { id: 's04', name: 'タイムマシンのは', icon: '⏰', rarity: 3, category: 'special', fact: 'むかしの ひとは はみがきに きの えだを つかっていた！5000ねんまえから！' },
  { id: 's05', name: 'うちゅうのは', icon: '🚀', rarity: 3, category: 'special', fact: 'うちゅうひこうしも ISS（うちゅうステーション）で はみがきするよ！' },
];

// レアリティ別の出現確率
const RARITY_RATES = { 1: 0.70, 2: 0.25, 3: 0.05 };
const RARITY_NAMES = { 1: '★', 2: '★★', 3: '★★★' };
const RARITY_COLORS = { 1: '#94A3B8', 2: '#3B82F6', 3: '#F59E0B' };
const RARITY_BG = { 1: '#F8FAFC', 2: '#EFF6FF', 3: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)' };
