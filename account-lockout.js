// ============================================================
// 🔒 アカウントロックアウト（共通モジュール）
// 2026-05-25 作成
//
// 仕組み:
//   - ログイン失敗を Firestore の loginAttempts コレクションに記録
//   - 同ユーザー/IPで5回連続失敗 → 30分ロック
//   - 成功すれば失敗カウンターをリセット
//
// 使い方:
//   1. ログイン試行前に: AccountLockout.checkLock(userId)
//      → ロック中なら false（ログイン処理を中止）
//   2. ログイン失敗時: AccountLockout.recordFailure(userId)
//   3. ログイン成功時: AccountLockout.recordSuccess(userId)
//
// 注: Firestore に loginAttempts コレクションが必要
//     セキュリティルール: 認証不要で create/update 可（誰でも記録できる必要がある）
// ============================================================
(function() {
  const COLLECTION = 'loginAttempts';
  const MAX_FAILURES = 5;
  const LOCK_DURATION_MS = 30 * 60 * 1000; // 30分

  async function getDoc(userId) {
    if (typeof firebase === 'undefined' || !firebase.firestore) return null;
    try {
      const snap = await firebase.firestore().collection(COLLECTION).doc(userId).get();
      return snap.exists ? snap.data() : null;
    } catch (e) {
      console.warn('[AccountLockout] 取得エラー:', e.message);
      return null;
    }
  }

  async function setDoc(userId, data) {
    if (typeof firebase === 'undefined' || !firebase.firestore) return;
    try {
      await firebase.firestore().collection(COLLECTION).doc(userId).set(data, { merge: true });
    } catch (e) {
      console.warn('[AccountLockout] 保存エラー:', e.message);
    }
  }

  window.AccountLockout = {
    /**
     * ロック状態確認
     * @returns {Promise<{locked:boolean, remainingMs?:number, failureCount?:number}>}
     */
    async checkLock(userId) {
      if (!userId) return { locked: false };
      const doc = await getDoc(userId);
      if (!doc) return { locked: false };

      const failureCount = doc.failureCount || 0;
      const lockedUntil = doc.lockedUntil?.toMillis?.() || 0;

      if (lockedUntil > Date.now()) {
        return {
          locked: true,
          remainingMs: lockedUntil - Date.now(),
          failureCount,
        };
      }
      return { locked: false, failureCount };
    },

    /**
     * ログイン失敗記録
     * @returns {Promise<{locked:boolean, attempt:number, max:number}>}
     */
    async recordFailure(userId) {
      if (!userId) return { locked: false, attempt: 0, max: MAX_FAILURES };
      const doc = await getDoc(userId);
      const currentCount = (doc?.failureCount || 0) + 1;
      const update = {
        failureCount: currentCount,
        lastFailureAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      if (currentCount >= MAX_FAILURES) {
        update.lockedUntil = firebase.firestore.Timestamp.fromMillis(Date.now() + LOCK_DURATION_MS);
        console.warn(`[AccountLockout] ${userId} を ${LOCK_DURATION_MS/60000}分ロック`);
      }
      await setDoc(userId, update);
      return {
        locked: currentCount >= MAX_FAILURES,
        attempt: currentCount,
        max: MAX_FAILURES,
      };
    },

    /**
     * ログイン成功記録（カウンターリセット）
     */
    async recordSuccess(userId) {
      if (!userId) return;
      await setDoc(userId, {
        failureCount: 0,
        lockedUntil: null,
        lastSuccessAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    },

    /**
     * ロック解除（管理者用）
     */
    async unlock(userId) {
      if (!userId) return;
      await setDoc(userId, {
        failureCount: 0,
        lockedUntil: null,
        unlockedAt: firebase.firestore.FieldValue.serverTimestamp(),
        unlockedBy: 'admin',
      });
    },

    /**
     * ロック状態を分かりやすい文字列に変換
     */
    formatLockMessage(checkResult) {
      if (!checkResult.locked) return null;
      const min = Math.ceil(checkResult.remainingMs / 60000);
      return `アカウントがロックされています。あと ${min} 分後に再試行できます。\n` +
             `（${checkResult.failureCount} 回連続でログインに失敗したため自動ロックされました）`;
    },
  };
})();
