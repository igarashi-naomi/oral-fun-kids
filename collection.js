// カード収集＆ガチャシステム
const Collection = (() => {

  // ===== ガチャ: ランダムにカード1枚を引く =====
  function drawCard() {
    const rand = Math.random();
    let rarity;
    if (rand < RARITY_RATES[3]) rarity = 3;      // 5%
    else if (rand < RARITY_RATES[3] + RARITY_RATES[2]) rarity = 2; // 25%
    else rarity = 1; // 70%

    const pool = CARD_DATA.filter(c => c.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ===== ガチャ演出 =====
  function showGacha(card, onDone) {
    const app = document.getElementById('app');
    const rarityName = RARITY_NAMES[card.rarity];
    const rarityColor = RARITY_COLORS[card.rarity];
    const rarityBg = RARITY_BG[card.rarity];
    const isRare = card.rarity >= 2;
    const isSuperRare = card.rarity >= 3;

    // Phase 1: ドキドキ演出
    app.innerHTML = `
      <div class="gacha-screen">
        <div class="gacha-orb" id="gacha-orb">
          <div class="gacha-glow ${isSuperRare ? 'gacha-glow-gold' : isRare ? 'gacha-glow-blue' : 'gacha-glow-normal'}"></div>
          <span class="gacha-orb-icon"><dotlottie-wc src="${LOTTIE_URLS.anim5}" style="width:80px;height:80px" loop autoplay></dotlottie-wc></span>
        </div>
        <p class="gacha-tap-text">タップして あける！</p>
      </div>
    `;

    // タップで開封
    const orb = document.getElementById('gacha-orb');
    const handler = () => {
      orb.removeEventListener('click', handler);
      orb.removeEventListener('touchstart', handler);
      revealCard(card, onDone);
    };
    orb.addEventListener('click', handler);
    orb.addEventListener('touchstart', handler, { passive: true });
  }

  function revealCard(card, onDone) {
    const app = document.getElementById('app');
    const rarityName = RARITY_NAMES[card.rarity];
    const rarityColor = RARITY_COLORS[card.rarity];
    const isSuperRare = card.rarity >= 3;
    const isRare = card.rarity >= 2;

    // エフェクト
    if (isSuperRare) {
      Effects.fullConfetti();
      Effects.screenShake(8, 500);
      try { Sounds.fanfare(); } catch(e) {}
    } else if (isRare) {
      Effects.stars(window.innerWidth / 2, window.innerHeight * 0.3, 12);
      try { Sounds.coin(); } catch(e) {}
    } else {
      Effects.sparkle(window.innerWidth / 2, window.innerHeight * 0.3, 10);
      try { Sounds.tap(); } catch(e) {}
    }
    Effects.vibrate(isRare ? [50, 100, 50] : [30]);

    app.innerHTML = `
      <div class="gacha-screen gacha-reveal">
        <div class="gacha-card ${isSuperRare ? 'gacha-card-super' : isRare ? 'gacha-card-rare' : 'gacha-card-common'}">
          <div class="gacha-card-rarity" style="color:${rarityColor}">${rarityName}</div>
          <div class="gacha-card-icon">${card.icon}</div>
          <div class="gacha-card-name">${card.name}</div>
          <div class="gacha-card-fact">${card.fact}</div>
          <div class="gacha-card-category">${getCategoryLabel(card.category)}</div>
        </div>
        ${isNew(card) ? '<div class="gacha-new-badge">NEW!</div>' : '<div class="gacha-dup-badge">もってる！+ボーナス</div>'}
        <div class="gacha-actions">
          <button class="btn-game btn-game-home" onclick="Collection._onGachaDone()">つぎへ</button>
        </div>
      </div>
    `;

    // コレクションに保存
    addToCollection(card);
    Collection._gachaDoneCallback = onDone;
  }

  function _onGachaDone() {
    if (Collection._gachaDoneCallback) Collection._gachaDoneCallback();
  }

  function getCategoryLabel(cat) {
    const map = { animal: '🦁 どうぶつのは', trivia: '📚 まめちしき', exercise: '💪 たいそう', special: '👑 でんせつ' };
    return map[cat] || cat;
  }

  // ===== コレクション管理（localStorage） =====
  function getCollection() {
    try { return JSON.parse(localStorage.getItem('oralFunCards') || '{}'); } catch { return {}; }
  }

  function addToCollection(card) {
    const col = getCollection();
    if (!col[card.id]) col[card.id] = { count: 0, firstGot: new Date().toISOString() };
    col[card.id].count++;
    localStorage.setItem('oralFunCards', JSON.stringify(col));
  }

  function isNew(card) {
    const col = getCollection();
    return !col[card.id];
  }

  function getCollectedCount() {
    return Object.keys(getCollection()).length;
  }

  // ===== 図鑑表示 =====
  function showAlbum() {
    const app = document.getElementById('app');
    const col = getCollection();
    const totalCards = CARD_DATA.length;
    const collected = Object.keys(col).length;
    const pct = Math.round(collected / totalCards * 100);

    // カテゴリ別にグループ化
    const categories = [
      { id: 'animal', name: '🦁 どうぶつのは' },
      { id: 'trivia', name: '📚 まめちしき' },
      { id: 'exercise', name: '💪 たいそう' },
      { id: 'special', name: '👑 でんせつ' },
    ];

    const cardsHtml = categories.map(cat => {
      const catCards = CARD_DATA.filter(c => c.category === cat.id);
      return `
        <div class="album-category">
          <h3 class="album-cat-title">${cat.name}</h3>
          <div class="album-grid">
            ${catCards.map(c => {
              const owned = col[c.id];
              return `
                <div class="album-card ${owned ? 'album-owned' : 'album-locked'} album-rarity-${c.rarity}"
                  ${owned ? `onclick="Collection.showCardDetail('${c.id}')"` : ''}>
                  <span class="album-card-icon">${owned ? c.icon : '❓'}</span>
                  <span class="album-card-name">${owned ? c.name : '？？？'}</span>
                  <span class="album-card-rarity" style="color:${RARITY_COLORS[c.rarity]}">${RARITY_NAMES[c.rarity]}</span>
                  ${owned && owned.count > 1 ? `<span class="album-card-count">×${owned.count}</span>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    app.innerHTML = `
      <div class="album-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <span class="game-progress">📖 ずかん ${collected}/${totalCards}</span>
        </div>
        <div class="album-progress">
          <div class="album-progress-bar">
            <div class="album-progress-fill" style="width:${pct}%"></div>
          </div>
          <span class="album-progress-text">${pct}% コンプリート</span>
        </div>
        ${cardsHtml}
      </div>
    `;
  }

  function showCardDetail(cardId) {
    const card = CARD_DATA.find(c => c.id === cardId);
    if (!card) return;
    const col = getCollection();
    const owned = col[cardId];

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen">
        <div class="break-content">
          <div class="gacha-card gacha-card-detail album-rarity-${card.rarity}">
            <div class="gacha-card-rarity" style="color:${RARITY_COLORS[card.rarity]}">${RARITY_NAMES[card.rarity]}</div>
            <div class="gacha-card-icon" style="font-size:80px">${card.icon}</div>
            <div class="gacha-card-name" style="font-size:24px">${card.name}</div>
            <div class="gacha-card-fact" style="font-size:16px">${card.fact}</div>
            <div class="gacha-card-category">${getCategoryLabel(card.category)}</div>
            ${owned ? `<p style="font-size:12px;color:#94A3B8;margin-top:8px">×${owned.count}枚 もっているよ</p>` : ''}
          </div>
          <button class="btn-game btn-game-home" onclick="Collection.showAlbum()" style="margin-top:16px">ずかんにもどる</button>
        </div>
      </div>
    `;
  }

  return { drawCard, showGacha, showAlbum, showCardDetail, getCollectedCount, _onGachaDone, _gachaDoneCallback: null };
})();
