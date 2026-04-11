// キャラクターSVGイラスト — テーマ別マスコット
const Characters = (() => {

  // 共通の歯キャラ（ベース）
  const toothBase = (expression, accessories) => `
    <svg viewBox="0 0 200 260" class="char-svg">
      <!-- 歯の形 -->
      <path d="M100 20 C60 20 30 60 30 110 C30 150 40 185 55 210 C65 235 75 250 85 255 C92 258 108 258 115 255 C125 250 135 235 145 210 C160 185 170 150 170 110 C170 60 140 20 100 20Z"
        fill="white" stroke="#E2E8F0" stroke-width="3"/>
      ${expression}
      ${accessories || ''}
    </svg>
  `;

  // 表情パーツ
  const happyFace = `
    <ellipse cx="72" cy="95" rx="10" ry="13" fill="#1E293B"/>
    <ellipse cx="128" cy="95" rx="10" ry="13" fill="#1E293B"/>
    <circle cx="76" cy="89" r="4" fill="white"/>
    <circle cx="132" cy="89" r="4" fill="white"/>
    <path d="M72 125 Q100 155 128 125" fill="none" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="50" cy="115" rx="14" ry="9" fill="#FDBA74" opacity="0.5"/>
    <ellipse cx="150" cy="115" rx="14" ry="9" fill="#FDBA74" opacity="0.5"/>
  `;

  const surprisedFace = `
    <ellipse cx="72" cy="95" rx="12" ry="15" fill="#1E293B"/>
    <ellipse cx="128" cy="95" rx="12" ry="15" fill="#1E293B"/>
    <circle cx="76" cy="89" r="4" fill="white"/>
    <circle cx="132" cy="89" r="4" fill="white"/>
    <ellipse cx="100" cy="135" rx="15" ry="18" fill="#FDBA74" stroke="#F97316" stroke-width="2"/>
  `;

  const determinedFace = `
    <path d="M60 85 L84 92" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
    <path d="M140 85 L116 92" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="72" cy="100" rx="10" ry="12" fill="#1E293B"/>
    <ellipse cx="128" cy="100" rx="10" ry="12" fill="#1E293B"/>
    <circle cx="76" cy="95" r="3" fill="white"/>
    <circle cx="132" cy="95" r="3" fill="white"/>
    <path d="M78 130 Q100 145 122 130" fill="none" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>
  `;

  // テーマ別アクセサリ
  const kingdom = {
    hero: toothBase(determinedFace, `
      <!-- 王冠 -->
      <polygon points="65,25 75,5 85,20 100,0 115,20 125,5 135,25" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
      <circle cx="100" cy="15" r="4" fill="#EF4444"/>
      <!-- 剣 -->
      <rect x="165" y="100" width="6" height="50" rx="2" fill="#94A3B8"/>
      <rect x="158" y="95" width="20" height="8" rx="3" fill="#F59E0B"/>
      <polygon points="168,60 162,95 174,95" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1"/>
    `),
    enemy: `<svg viewBox="0 0 200 200" class="char-svg">
      <circle cx="100" cy="100" r="70" fill="#4B0082" opacity="0.8"/>
      <ellipse cx="75" cy="85" rx="12" ry="8" fill="#EF4444"/>
      <ellipse cx="125" cy="85" rx="12" ry="8" fill="#EF4444"/>
      <path d="M70 120 Q100 140 130 120" fill="none" stroke="#EF4444" stroke-width="4"/>
      <text x="100" y="160" text-anchor="middle" font-size="24">🦠</text>
    </svg>`
  };

  const fairy = {
    hero: toothBase(happyFace, `
      <!-- ティアラ -->
      <path d="M60 30 Q80 10 100 25 Q120 10 140 30" fill="none" stroke="#EC4899" stroke-width="3"/>
      <circle cx="100" cy="18" r="6" fill="#EC4899"/>
      <circle cx="80" cy="22" r="4" fill="#F9A8D4"/>
      <circle cx="120" cy="22" r="4" fill="#F9A8D4"/>
      <!-- 羽 -->
      <ellipse cx="20" cy="100" rx="20" ry="40" fill="#FBCFE8" opacity="0.6" transform="rotate(-20 20 100)"/>
      <ellipse cx="180" cy="100" rx="20" ry="40" fill="#FBCFE8" opacity="0.6" transform="rotate(20 180 100)"/>
      <!-- キラキラ -->
      <text x="25" y="70" font-size="16">✨</text>
      <text x="165" y="70" font-size="16">✨</text>
    `)
  };

  const space = {
    hero: toothBase(surprisedFace, `
      <!-- ヘルメット -->
      <ellipse cx="100" cy="80" rx="78" ry="70" fill="none" stroke="#06B6D4" stroke-width="4"/>
      <ellipse cx="100" cy="25" rx="30" ry="10" fill="#06B6D4"/>
      <!-- アンテナ -->
      <line x1="100" y1="15" x2="100" y2="-5" stroke="#06B6D4" stroke-width="3"/>
      <circle cx="100" cy="-8" r="5" fill="#EF4444"/>
    `)
  };

  const animal = {
    hero: toothBase(happyFace, `
      <!-- 聴診器 -->
      <path d="M60 140 Q40 160 50 180 Q60 200 80 190" fill="none" stroke="#059669" stroke-width="4"/>
      <circle cx="82" cy="188" r="8" fill="#059669"/>
      <circle cx="82" cy="188" r="4" fill="#D1FAE5"/>
      <!-- 頭鏡 -->
      <circle cx="100" cy="10" r="15" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
      <circle cx="100" cy="10" r="8" fill="white"/>
    `)
  };

  const lab = {
    hero: toothBase(determinedFace, `
      <!-- メガネ -->
      <circle cx="72" cy="95" r="18" fill="none" stroke="#7C3AED" stroke-width="3"/>
      <circle cx="128" cy="95" r="18" fill="none" stroke="#7C3AED" stroke-width="3"/>
      <line x1="90" y1="95" x2="110" y2="95" stroke="#7C3AED" stroke-width="2"/>
      <!-- 試験管 -->
      <rect x="160" y="120" width="12" height="40" rx="4" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2"/>
      <rect x="157" y="115" width="18" height="6" rx="2" fill="#3B82F6"/>
      <rect x="163" y="140" width="6" height="15" rx="2" fill="#86EFAC"/>
    `)
  };

  function getChar(themeId, type) {
    const map = { kingdom, fairy, space, animal, lab };
    const theme = map[themeId];
    if (!theme) return toothBase(happyFace);
    return theme[type || 'hero'] || toothBase(happyFace);
  }

  return { getChar, toothBase, happyFace, surprisedFace, determinedFace };
})();
