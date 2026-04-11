// 音声ナレーション — Web Speech Synthesis API
// iOS/Androidの高品質日本語音声を使用
const Voice = (() => {
  let enabled = false; // デフォルトOFF（機械音声が怖い子供もいるため）
  let currentUtterance = null;

  function isEnabled() {
    const saved = localStorage.getItem('oralFunVoice');
    if (saved !== null) enabled = saved === '1';
    return enabled && 'speechSynthesis' in window;
  }

  function toggle() {
    enabled = !enabled;
    localStorage.setItem('oralFunVoice', enabled ? '1' : '0');
    if (!enabled) stop();
    return enabled;
  }

  function stop() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  // 日本語音声を取得（高品質を優先）
  function getJaVoice() {
    const voices = speechSynthesis.getVoices();
    // 優先順: Enhanced > Premium > 標準の日本語女性音声
    const prefs = [
      v => v.lang.startsWith('ja') && /enhanced|premium/i.test(v.name),
      v => v.lang.startsWith('ja') && /female|女/i.test(v.name),
      v => v.lang.startsWith('ja') && v.localService,
      v => v.lang.startsWith('ja'),
    ];
    for (const pref of prefs) {
      const found = voices.find(pref);
      if (found) return found;
    }
    return null;
  }

  // テキストを読み上げ
  function speak(text, options = {}) {
    if (!isEnabled()) return Promise.resolve();
    if (!('speechSynthesis' in window)) return Promise.resolve();

    return new Promise(resolve => {
      // 前の発話をキャンセル
      speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = options.rate || 0.9;  // やや遅め（子供向け）
      u.pitch = options.pitch || 1.2; // やや高め（子供向けの明るい声）
      u.volume = options.volume || 0.8;

      const voice = getJaVoice();
      if (voice) u.voice = voice;

      u.onend = () => { currentUtterance = null; resolve(); };
      u.onerror = () => { currentUtterance = null; resolve(); };

      currentUtterance = u;
      speechSynthesis.speak(u);
    });
  }

  // あいうべ体操用の掛け声
  function aiube(char) {
    const phrases = {
      'あ': 'おおきく あー！',
      'い': 'よこに いー！',
      'う': 'まえに うー！',
      'べ': 'べろを べー！',
    };
    return speak(phrases[char] || char, { rate: 0.8, pitch: 1.3 });
  }

  // カウントダウン読み上げ
  function countdown(num) {
    if (num <= 3 && num > 0) {
      return speak(String(num), { rate: 1.0, pitch: 1.1 });
    }
    return Promise.resolve();
  }

  // 正解・不正解
  function correct() {
    const phrases = ['せいかい！', 'すごい！', 'やったね！', 'その通り！'];
    return speak(phrases[Math.floor(Math.random() * phrases.length)], { rate: 1.0, pitch: 1.4 });
  }

  function wrong() {
    const phrases = ['ざんねん', 'おしかったね', 'つぎはできるよ！'];
    return speak(phrases[Math.floor(Math.random() * phrases.length)], { rate: 0.9, pitch: 1.0 });
  }

  // 完了ファンファーレ
  function complete() {
    const phrases = ['やったー！すごいね！', 'クリア！がんばったね！', 'かんぺき！えらいよ！'];
    return speak(phrases[Math.floor(Math.random() * phrases.length)], { rate: 0.9, pitch: 1.3 });
  }

  // 案内・ガイダンス
  function guide(text) {
    return speak(text, { rate: 0.85, pitch: 1.2 });
  }

  // 音声リスト初期化（一部ブラウザで必要）
  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }

  return { speak, aiube, countdown, correct, wrong, complete, guide, stop, toggle, isEnabled };
})();
