// 効果音システム — Web Audio APIで合成（ファイル不要）
const Sounds = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function toggle() {
    enabled = !enabled;
    localStorage.setItem('oralFunSound', enabled ? '1' : '0');
    return enabled;
  }

  function isEnabled() {
    const saved = localStorage.getItem('oralFunSound');
    if (saved !== null) enabled = saved === '1';
    return enabled;
  }

  // === 正解音 ===
  function correct() {
    if (!isEnabled()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    // ド→ミ→ソ（明るいアルペジオ）
    osc.frequency.setValueAtTime(523, c.currentTime);       // ド
    osc.frequency.setValueAtTime(659, c.currentTime + 0.1); // ミ
    osc.frequency.setValueAtTime(784, c.currentTime + 0.2); // ソ
    gain.gain.setValueAtTime(0.3, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.4);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.4);
  }

  // === 不正解音 ===
  function wrong() {
    if (!isEnabled()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, c.currentTime);
    osc.frequency.setValueAtTime(262, c.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.3);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.3);
  }

  // === レベルアップ・完了ファンファーレ ===
  function fanfare() {
    if (!isEnabled()) return;
    const c = getCtx();
    const notes = [523, 659, 784, 1047]; // ド ミ ソ 高ド
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, c.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + i * 0.15 + 0.3);
      osc.start(c.currentTime + i * 0.15);
      osc.stop(c.currentTime + i * 0.15 + 0.3);
    });
  }

  // === タップ音 ===
  function tap() {
    if (!isEnabled()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.08);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.08);
  }

  // === カウントダウン音（ピッ） ===
  function tick() {
    if (!isEnabled()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.1, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.05);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.05);
  }

  // === コインゲット音 ===
  function coin() {
    if (!isEnabled()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(988, c.currentTime);
    osc.frequency.setValueAtTime(1319, c.currentTime + 0.1);
    gain.gain.setValueAtTime(0.25, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.25);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.25);
  }

  // === スタンプ音 ===
  function stamp() {
    if (!isEnabled()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, c.currentTime);
    osc.frequency.setValueAtTime(880, c.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.2);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.2);
  }

  return { correct, wrong, fanfare, tap, tick, coin, stamp, toggle, isEnabled };
})();
