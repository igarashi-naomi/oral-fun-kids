// 効果音システム — プロ品質（和音・エンベロープ・BGM）
const Sounds = (() => {
  let ctx = null;
  let enabled = true;
  let bgmOsc = null;
  let bgmGain = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function toggle() {
    enabled = !enabled;
    localStorage.setItem('oralFunSound', enabled ? '1' : '0');
    if (!enabled) stopBgm();
    return enabled;
  }

  function isEnabled() {
    const saved = localStorage.getItem('oralFunSound');
    if (saved !== null) enabled = saved === '1';
    return enabled;
  }

  // 汎用: 音を鳴らすヘルパー
  function playNote(freq, type, vol, start, dur, fadeOut) {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, c.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
    osc.start(c.currentTime + start);
    osc.stop(c.currentTime + start + dur + 0.05);
  }

  // 和音を鳴らすヘルパー
  function playChord(freqs, type, vol, start, dur) {
    freqs.forEach(f => playNote(f, type, vol / freqs.length, start, dur));
  }

  // === 正解音（あたたかい和音アルペジオ） ===
  function correct() {
    if (!isEnabled()) return;
    // Cmaj → Emaj → G（明るいメジャーコード進行）
    playNote(523, 'sine', 0.2, 0, 0.3);    // ド
    playNote(659, 'sine', 0.2, 0.08, 0.3);  // ミ
    playNote(784, 'sine', 0.2, 0.16, 0.35); // ソ
    playNote(1047, 'triangle', 0.1, 0.24, 0.4); // 高ド（やさしく）
    // きらっとした高音
    playNote(2093, 'sine', 0.05, 0.3, 0.15);
  }

  // === 不正解音（やさしい低音・落胆しすぎない） ===
  function wrong() {
    if (!isEnabled()) return;
    playNote(392, 'sine', 0.15, 0, 0.2);   // ソ
    playNote(330, 'sine', 0.15, 0.12, 0.25); // ミ
    // ちょっと不協和だけど優しい
    playNote(311, 'triangle', 0.08, 0.2, 0.2);
  }

  // === ファンファーレ（豪華な和音進行） ===
  function fanfare() {
    if (!isEnabled()) return;
    // ドミソ → ファラド → ソシレ → 高ドミソ
    playChord([523, 659, 784], 'sine', 0.3, 0, 0.25);
    playChord([349, 440, 523], 'sine', 0.3, 0.2, 0.25);
    playChord([392, 494, 587], 'sine', 0.3, 0.4, 0.25);
    playChord([1047, 1319, 1568], 'sine', 0.25, 0.6, 0.5);
    // きらきら装飾音
    playNote(2093, 'sine', 0.06, 0.7, 0.15);
    playNote(2637, 'sine', 0.04, 0.8, 0.15);
    playNote(3136, 'sine', 0.03, 0.9, 0.2);
  }

  // === タップ音（軽やかな木琴風） ===
  function tap() {
    if (!isEnabled()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'triangle'; // 木琴っぽい
    osc.frequency.value = 880 + Math.random() * 200; // 少しランダム
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.12);
  }

  // === カウントダウン音（柔らかいベル） ===
  function tick() {
    if (!isEnabled()) return;
    playNote(1200, 'sine', 0.06, 0, 0.06);
    playNote(600, 'triangle', 0.03, 0, 0.08);
  }

  // === コインゲット音（キラリン！） ===
  function coin() {
    if (!isEnabled()) return;
    playNote(1319, 'sine', 0.15, 0, 0.12);  // 高ミ
    playNote(1568, 'sine', 0.15, 0.06, 0.12); // 高ソ
    playNote(2093, 'sine', 0.12, 0.12, 0.2);  // 超高ド
    // キラキラ装飾
    playNote(2637, 'sine', 0.04, 0.18, 0.1);
    playNote(3136, 'sine', 0.03, 0.22, 0.1);
  }

  // === スタンプ音（ドスッ+キラ） ===
  function stamp() {
    if (!isEnabled()) return;
    playNote(200, 'sine', 0.2, 0, 0.08);     // ドスッ
    playNote(150, 'triangle', 0.15, 0, 0.06);
    playNote(800, 'sine', 0.1, 0.08, 0.15);   // キラ
    playNote(1200, 'sine', 0.06, 0.12, 0.15);
  }

  // === ガチャ開封音（ドキドキ→パカッ！） ===
  function gachaOpen() {
    if (!isEnabled()) return;
    // ドラムロール風
    for (let i = 0; i < 8; i++) {
      playNote(200 + i * 50, 'triangle', 0.05, i * 0.05, 0.06);
    }
    // パカッ！
    playChord([523, 659, 784, 1047], 'sine', 0.3, 0.45, 0.4);
    playNote(2093, 'sine', 0.08, 0.55, 0.2);
  }

  // === レアカード出現音（神秘的） ===
  function rareReveal() {
    if (!isEnabled()) return;
    // 低音のうねり → 高音の輝き
    playNote(220, 'sine', 0.15, 0, 0.5);
    playNote(277, 'sine', 0.1, 0.1, 0.4);
    playNote(330, 'sine', 0.1, 0.2, 0.35);
    playChord([440, 554, 659, 880], 'sine', 0.25, 0.4, 0.6);
    playNote(1760, 'sine', 0.06, 0.6, 0.3);
    playNote(2217, 'sine', 0.04, 0.7, 0.3);
  }

  // === コンボ音（段階的に高く） ===
  function combo(count) {
    if (!isEnabled()) return;
    const baseFreq = 523 + (count - 1) * 100;
    playNote(baseFreq, 'sine', 0.12, 0, 0.12);
    playNote(baseFreq * 1.25, 'sine', 0.1, 0.05, 0.12);
  }

  // === BGM（ゲーム中の軽いループ） ===
  function startBgm() {
    if (!isEnabled()) return;
    stopBgm();
    const c = getCtx();
    bgmGain = c.createGain();
    bgmGain.gain.value = 0.03; // とても小さく
    bgmGain.connect(c.destination);

    // シンプルなアンビエントパッド
    bgmOsc = c.createOscillator();
    bgmOsc.type = 'sine';
    bgmOsc.frequency.value = 262; // ド
    bgmOsc.connect(bgmGain);

    const lfo = c.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // ゆっくりうねり
    const lfoGain = c.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(bgmOsc.frequency);

    bgmOsc.start();
    lfo.start();
  }

  function stopBgm() {
    try { bgmOsc?.stop(); } catch(e) {}
    bgmOsc = null;
    bgmGain = null;
  }

  return { correct, wrong, fanfare, tap, tick, coin, stamp, gachaOpen, rareReveal, combo, startBgm, stopBgm, toggle, isEnabled };
})();
