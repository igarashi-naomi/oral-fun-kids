// Firebase Configuration — keiji-safety（子供用ゲームアプリ）
const firebaseConfig = {
  apiKey: "AIzaSyDBaRGOBokLtI5vmOQc-Xz3UFXcy61hAn4",
  authDomain: "keiji-safety.firebaseapp.com",
  projectId: "keiji-safety",
  storageBucket: "keiji-safety.firebasestorage.app",
  messagingSenderId: "401350726835",
  appId: "1:401350726835:web:def09f8653bd906c644cc6"
};

firebase.initializeApp(firebaseConfig);

// 2026-05-25 App Check 組込（reCAPTCHA Enterprise）
// 強制モードは Firebase Console > App Check で切替（最初は監視のみ推奨）
try {
  const appCheck = firebase.appCheck();
  appCheck.activate(
    new firebase.appCheck.ReCaptchaEnterpriseProvider('6Lf6V_ssAAAAAMREO-xd6ce7pHRpcVuZqNLZZW6G'),
    true  // isTokenAutoRefreshEnabled
  );
  console.log('[App Check] reCAPTCHA Enterprise 初期化完了');
} catch (e) {
  console.warn('[App Check] 初期化エラー:', e.message);
}
const db = firebase.firestore();
const auth = firebase.auth();

db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

// 匿名認証
function signInAnonymous() {
  return auth.signInAnonymously();
}
