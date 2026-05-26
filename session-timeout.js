// ============================================================
// 🔒 自動セッションタイムアウト（共通モジュール）
// 2026-05-25 作成
//
// 仕組み:
//   - 30分間ユーザー操作なし → 警告ダイアログ（5分カウントダウン）
//   - 35分操作なし → 自動ログアウト
//   - キー入力・マウス移動・クリック・タッチで活動と判定
//
// 使い方:
//   firebase 初期化後に以下1行で起動:
//     SessionTimeout.start();
//
//   オプション設定（任意）:
//     SessionTimeout.config({ idleMs: 30*60*1000, warnMs: 5*60*1000, onLogout: () => {...} });
// ============================================================
(function() {
  const STORAGE_KEY = '_session_last_activity';
  let config = {
    idleMs: 30 * 60 * 1000,    // 30分操作なしで警告
    warnMs: 5 * 60 * 1000,     // 警告後5分でログアウト
    checkInterval: 30 * 1000,  // 30秒ごとに監視
    onLogout: null,             // ログアウト時のコールバック
  };

  let lastActivity = Date.now();
  let warningShown = false;
  let warningModal = null;
  let countdownInterval = null;
  let monitorInterval = null;
  let started = false;

  function updateActivity() {
    lastActivity = Date.now();
    try { localStorage.setItem(STORAGE_KEY, String(lastActivity)); } catch (e) {}
    if (warningShown) {
      hideWarning();
    }
  }

  function showWarning(secondsLeft) {
    if (warningModal) return;
    warningModal = document.createElement('div');
    warningModal.id = '_session_timeout_warn';
    warningModal.innerHTML = `
      <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:'Hiragino Sans','Meiryo',sans-serif">
        <div style="background:white;padding:32px;border-radius:12px;max-width:480px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.3);text-align:center">
          <div style="font-size:48px;margin-bottom:8px">⏰</div>
          <h2 style="margin:0 0 12px;color:#DC2626;font-size:20px">セッション タイムアウト警告</h2>
          <p style="margin:0 0 8px;color:#374151;line-height:1.6">
            長時間操作がありません。<br>
            セキュリティのため自動ログアウトします。
          </p>
          <div id="_session_countdown" style="font-size:32px;font-weight:700;color:#DC2626;margin:16px 0">${secondsLeft}</div>
          <p style="margin:0 0 20px;color:#6B7280;font-size:13px">秒後にログアウト</p>
          <button onclick="window.SessionTimeout._extend()" style="background:#3B82F6;color:white;border:none;padding:12px 32px;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;width:100%">
            操作を続行する
          </button>
        </div>
      </div>`;
    document.body.appendChild(warningModal);
    warningShown = true;

    // カウントダウン更新
    let remaining = secondsLeft;
    countdownInterval = setInterval(() => {
      remaining--;
      const el = document.getElementById('_session_countdown');
      if (el) el.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        forceLogout();
      }
    }, 1000);
  }

  function hideWarning() {
    if (warningModal) {
      warningModal.remove();
      warningModal = null;
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    warningShown = false;
  }

  function forceLogout() {
    console.log('[SessionTimeout] 自動ログアウト実行');
    hideWarning();
    try {
      // カスタムログアウト処理
      if (typeof config.onLogout === 'function') {
        config.onLogout();
        return;
      }
      // デフォルト: localStorage クリア + Firebase Auth サインアウト + リロード
      try {
        if (typeof firebase !== 'undefined' && firebase.auth) {
          firebase.auth().signOut();
        }
      } catch (e) {}
      try {
        localStorage.removeItem('selectedUser');
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
      } catch (e) {}
      alert('セッションがタイムアウトしました。ログイン画面に戻ります。');
      location.reload();
    } catch (e) {
      console.warn('[SessionTimeout] ログアウトエラー:', e);
      location.reload();
    }
  }

  function checkIdle() {
    const idle = Date.now() - lastActivity;
    if (idle >= config.idleMs + config.warnMs) {
      forceLogout();
    } else if (idle >= config.idleMs && !warningShown) {
      const remainingMs = config.idleMs + config.warnMs - idle;
      showWarning(Math.ceil(remainingMs / 1000));
    }
  }

  window.SessionTimeout = {
    start: function() {
      if (started) return;
      started = true;
      // 活動イベント監視
      ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'].forEach(ev => {
        window.addEventListener(ev, updateActivity, { passive: true });
      });
      // 監視タイマー
      monitorInterval = setInterval(checkIdle, config.checkInterval);
      // 他タブ activity 同期
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          const t = parseInt(e.newValue);
          if (t > lastActivity) {
            lastActivity = t;
            if (warningShown) hideWarning();
          }
        }
      });
      console.log('[SessionTimeout] 起動 (idle=' + (config.idleMs/60000) + '分 / warn=' + (config.warnMs/60000) + '分)');
    },
    config: function(opts) {
      Object.assign(config, opts);
    },
    _extend: function() {
      updateActivity();
      hideWarning();
    },
    stop: function() {
      if (!started) return;
      if (monitorInterval) clearInterval(monitorInterval);
      hideWarning();
      started = false;
    }
  };
})();


// 2026-05-25 セッションタイムアウト自動起動
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { window.SessionTimeout && window.SessionTimeout.start(); });
} else {
  window.SessionTimeout && window.SessionTimeout.start();
}