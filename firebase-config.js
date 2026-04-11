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
const db = firebase.firestore();
const auth = firebase.auth();

db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

// 匿名認証
function signInAnonymous() {
  return auth.signInAnonymously();
}
