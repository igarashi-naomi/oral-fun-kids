// 音声ナレーション — VOICEVOX収録WAVファイル再生
const Voice = (() => {
  let enabled = true; // プロ音声なのでデフォルトON
  const cache = {};

  function isEnabled() {
    const saved = localStorage.getItem('oralFunVoice');
    if (saved !== null) enabled = saved === '1';
    return enabled;
  }

  function toggle() {
    enabled = !enabled;
    localStorage.setItem('oralFunVoice', enabled ? '1' : '0');
    return enabled;
  }

  function stop() {
    Object.values(cache).forEach(a => { try { a.pause(); a.currentTime = 0; } catch(e) {} });
  }

  // WAVファイル再生
  function play(filename) {
    if (!isEnabled()) return Promise.resolve();
    return new Promise(resolve => {
      if (!cache[filename]) {
        cache[filename] = new Audio(`audio/${filename}`);
      }
      const audio = cache[filename];
      audio.currentTime = 0;
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
  }

  // あいうべ体操
  function aiube(char) {
    const map = { 'あ': 'pose-a.wav', 'い': 'pose-i.wav', 'う': 'pose-u.wav', 'べ': 'pose-be.wav' };
    return play(map[char] || 'pose-a.wav');
  }

  // カウントダウン
  function countdown(num) {
    if (num === 3) return play('countdown-3.wav');
    if (num === 2) return play('countdown-2.wav');
    if (num === 1) return play('countdown-1.wav');
    return Promise.resolve();
  }

  function correct() { return play('correct.wav'); }
  function wrong() { return play('wrong.wav'); }
  function complete() { return play('complete.wav'); }
  function guide() { return play('start.wav'); }

  return { play, aiube, countdown, correct, wrong, complete, guide, stop, toggle, isEnabled };
})();
