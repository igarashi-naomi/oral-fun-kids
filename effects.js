// エフェクトシステム — パーティクル・紙吹雪・スコアポップ・振動・コンボ
const Effects = (() => {
  // ===== パーティクルCanvas =====
  let canvas = null;
  let ctx = null;
  let particles = [];
  let animId = null;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'fx-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animate() {
    if (!ctx || particles.length === 0) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => {
      p.life -= 0.016;
      if (p.life <= 0) return false;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0.15;
      p.rotation += p.rotSpeed || 0;
      const alpha = Math.min(1, p.life / 0.3);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      if (p.type === 'confetti') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else if (p.type === 'star') {
        drawStar(ctx, 0, 0, p.size, p.color);
      } else if (p.type === 'sparkle') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return true;
    });
    animId = requestAnimationFrame(animate);
  }

  function drawStar(c, x, y, size, color) {
    c.fillStyle = color;
    c.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const method = i === 0 ? 'moveTo' : 'lineTo';
      c[method](x + size * Math.cos(angle), y + size * Math.sin(angle));
    }
    c.closePath();
    c.fill();
  }

  // ===== 紙吹雪 =====
  function confetti(x, y, count = 30) {
    ensureCanvas();
    const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];
    for (let i = 0; i < count; i++) {
      particles.push({
        type: 'confetti', x, y,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 3,
        gravity: 0.2,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        life: 1.5 + Math.random() * 0.5
      });
    }
    if (!animId) animate();
  }

  // ===== キラキラ =====
  function sparkle(x, y, count = 15) {
    ensureCanvas();
    const colors = ['#FDE68A', '#FBBF24', '#FCD34D', '#FEF3C7', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.push({
        type: 'sparkle', x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: 0, rotSpeed: 0,
        life: 0.6 + Math.random() * 0.3
      });
    }
    if (!animId) animate();
  }

  // ===== 星が飛ぶ =====
  function stars(x, y, count = 8) {
    ensureCanvas();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles.push({
        type: 'star', x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        gravity: 0.1,
        size: 8 + Math.random() * 8,
        color: ['#FBBF24', '#F97316', '#EF4444'][Math.floor(Math.random() * 3)],
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        life: 1 + Math.random() * 0.5
      });
    }
    if (!animId) animate();
  }

  // ===== 画面全体の紙吹雪（完了時） =====
  function fullConfetti() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    confetti(w / 2, h * 0.3, 50);
    setTimeout(() => confetti(w * 0.3, h * 0.2, 30), 200);
    setTimeout(() => confetti(w * 0.7, h * 0.2, 30), 400);
  }

  // ===== スコアポップアップ =====
  function scorePopup(text, x, y, color = '#F97316') {
    const el = document.createElement('div');
    el.className = 'fx-score-popup';
    el.textContent = text;
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;color:${color};font-size:24px;font-weight:900;pointer-events:none;z-index:9998;text-shadow:0 2px 4px rgba(0,0,0,.2);`;
    document.body.appendChild(el);
    // アニメーション
    let frame = 0;
    const anim = () => {
      frame++;
      el.style.top = `${y - frame * 1.5}px`;
      el.style.opacity = String(Math.max(0, 1 - frame / 40));
      el.style.transform = `scale(${1 + frame * 0.01})`;
      if (frame < 40) requestAnimationFrame(anim);
      else el.remove();
    };
    requestAnimationFrame(anim);
  }

  // ===== 画面振動 =====
  function vibrate(pattern = [50]) {
    try { navigator.vibrate?.(pattern); } catch (e) {}
  }

  // ===== 画面シェイク =====
  function screenShake(intensity = 5, duration = 300) {
    const app = document.getElementById('app');
    if (!app) return;
    const start = Date.now();
    const shake = () => {
      const elapsed = Date.now() - start;
      if (elapsed > duration) { app.style.transform = ''; return; }
      const decay = 1 - elapsed / duration;
      const x = (Math.random() - 0.5) * intensity * decay;
      const y = (Math.random() - 0.5) * intensity * decay;
      app.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(shake);
    };
    shake();
  }

  // ===== コンボシステム =====
  let comboCount = 0;
  let comboTimer = null;

  function addCombo() {
    comboCount++;
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { comboCount = 0; }, 5000);
    return comboCount;
  }

  function getCombo() { return comboCount; }
  function resetCombo() { comboCount = 0; }

  function comboPopup(count) {
    if (count < 2) return;
    const x = window.innerWidth / 2;
    const y = window.innerHeight * 0.15;
    const colors = ['', '#22C55E', '#3B82F6', '#8B5CF6', '#F97316', '#EF4444'];
    const color = colors[Math.min(count, 5)];
    const texts = ['', '', 'ナイス!', 'すごい!', 'GREAT!', 'PERFECT!', 'AMAZING!'];
    const text = `${count}コンボ！${texts[Math.min(count, 6)]}`;
    scorePopup(text, x - 60, y, color);
    if (count >= 3) vibrate([30, 50, 30]);
    if (count >= 5) sparkle(x, y + 30, 20);
  }

  // ===== リップルエフェクト（ボタンタップ） =====
  function ripple(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const rippleEl = document.createElement('span');
    rippleEl.className = 'fx-ripple';
    const size = Math.max(rect.width, rect.height) * 2;
    rippleEl.style.width = rippleEl.style.height = `${size}px`;
    rippleEl.style.left = `${(e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left - size/2}px`;
    rippleEl.style.top = `${(e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top - size/2}px`;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(rippleEl);
    setTimeout(() => rippleEl.remove(), 600);
  }

  return {
    confetti, sparkle, stars, fullConfetti,
    scorePopup, vibrate, screenShake,
    addCombo, getCombo, resetCombo, comboPopup,
    ripple
  };
})();
