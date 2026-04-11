// 衛生士からの応援メッセージ表示 + LINE通知準備
const Messages = (() => {
  let unreadMessages = [];

  // ホーム画面に未読メッセージ表示
  async function loadMessages() {
    const el = document.getElementById('dh-messages');
    if (!el || !OralApp.karteNo) return;

    try {
      const snap = await db.collection('dhMessages')
        .where('karteNo', '==', OralApp.karteNo)
        .where('read', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();

      unreadMessages = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (unreadMessages.length === 0) {
        el.innerHTML = '';
        return;
      }

      el.innerHTML = `
        <div class="dh-message-section">
          <h3 class="dh-message-title">💌 えいせいしさんから おてがみ！</h3>
          ${unreadMessages.map(m => `
            <div class="dh-message-card" onclick="Messages.readMessage('${m.id}')">
              <div class="dh-message-from">${escHtml(m.senderName || 'えいせいし')}せんせいより</div>
              <div class="dh-message-body">${escHtml(m.message)}</div>
              ${m.sticker ? `<div class="dh-message-sticker">${m.sticker}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } catch (e) {
      // インデックス未作成時は無視
      el.innerHTML = '';
    }
  }

  async function readMessage(id) {
    try {
      await db.collection('dhMessages').doc(id).update({ read: true });
      try { Sounds.coin(); } catch(e) {}
    } catch (e) {}
    // 再描画
    const msg = unreadMessages.find(m => m.id === id);
    if (msg) {
      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="game-screen">
          <div class="break-content">
            <div class="break-icon">💌</div>
            <h2>${escHtml(msg.senderName || 'えいせいし')}せんせいから</h2>
            <div class="dh-message-full">${escHtml(msg.message)}</div>
            ${msg.sticker ? `<div class="dh-message-sticker-big">${msg.sticker}</div>` : ''}
            <button class="btn-game btn-game-home" onclick="OralApp.showHome()" style="margin-top:20px">もどる</button>
          </div>
        </div>
      `;
    }
  }

  function escHtml(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  return { loadMessages, readMessage };
})();
