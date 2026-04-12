// プロ品質アニメーションシステム
const Anim = (() => {

  // ===== 画面遷移 =====
  function transition(onMid) {
    const overlay = document.createElement('div');
    overlay.className = 'anim-transition-overlay';
    document.body.appendChild(overlay);
    // フェードイン
    requestAnimationFrame(() => overlay.classList.add('anim-transition-active'));
    setTimeout(() => {
      if (onMid) onMid();
      // フェードアウト
      overlay.classList.remove('anim-transition-active');
      overlay.classList.add('anim-transition-out');
      setTimeout(() => overlay.remove(), 400);
    }, 350);
  }

  // ===== SVGキャラクター（あいうべ用・口が動く） =====
  function mouthChar(char, size = 160) {
    const mouths = {
      'あ': { rx: 20, ry: 28, color: '#EF4444' },
      'い': { rx: 28, ry: 5, color: '#F97316', teeth: true },
      'う': { rx: 10, ry: 14, color: '#3B82F6' },
      'べ': { rx: 15, ry: 20, color: '#10B981', tongue: true },
    };
    const m = mouths[char] || mouths['あ'];
    const s = size;
    const cx = s/2, cy = s/2;

    return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" class="anim-mouth-char">
      <!-- 顔 -->
      <circle cx="${cx}" cy="${cy}" r="${s*0.4}" fill="#FDDCB5" class="anim-face"/>
      <!-- ほっぺ -->
      <ellipse cx="${cx-s*0.25}" cy="${cy+s*0.05}" rx="${s*0.08}" ry="${s*0.05}" fill="#FDBA74" opacity=".5">
        <animate attributeName="opacity" values=".3;.6;.3" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="${cx+s*0.25}" cy="${cy+s*0.05}" rx="${s*0.08}" ry="${s*0.05}" fill="#FDBA74" opacity=".5">
        <animate attributeName="opacity" values=".3;.6;.3" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- 目 -->
      <g class="anim-eyes">
        <ellipse cx="${cx-s*0.12}" cy="${cy-s*0.08}" rx="${s*0.04}" ry="${s*0.055}" fill="#1E293B">
          <animate attributeName="ry" values="${s*0.055};${s*0.005};${s*0.055}" dur="4s" repeatCount="indefinite" begin="2s"/>
        </ellipse>
        <ellipse cx="${cx+s*0.12}" cy="${cy-s*0.08}" rx="${s*0.04}" ry="${s*0.055}" fill="#1E293B">
          <animate attributeName="ry" values="${s*0.055};${s*0.005};${s*0.055}" dur="4s" repeatCount="indefinite" begin="2s"/>
        </ellipse>
        <!-- ハイライト -->
        <circle cx="${cx-s*0.1}" cy="${cy-s*0.1}" r="${s*0.015}" fill="#fff"/>
        <circle cx="${cx+s*0.14}" cy="${cy-s*0.1}" r="${s*0.015}" fill="#fff"/>
      </g>
      <!-- 口 -->
      <ellipse cx="${cx}" cy="${cy+s*0.15}" rx="${m.rx}" ry="${m.ry}" fill="${m.color}" class="anim-mouth">
        <animate attributeName="ry" values="${m.ry};${m.ry*1.2};${m.ry}" dur="1s" repeatCount="indefinite"/>
      </ellipse>
      ${m.tongue ? `
        <ellipse cx="${cx}" cy="${cy+s*0.22}" rx="${s*0.06}" ry="${s*0.1}" fill="#F87171">
          <animate attributeName="ry" values="${s*0.1};${s*0.14};${s*0.1}" dur="1.5s" repeatCount="indefinite"/>
        </ellipse>
      ` : ''}
      <!-- 歯 -->
      ${char === 'あ' ? `
        <rect x="${cx-m.rx*0.6}" y="${cy+s*0.15-m.ry+2}" width="${m.rx*1.2}" height="${m.ry*0.25}" rx="2" fill="white" opacity=".8"/>
      ` : ''}
      ${m.teeth ? `
        <!-- い：横に開いた口＋上下の歯が見える -->
        <rect x="${cx-m.rx*0.8}" y="${cy+s*0.13}" width="${m.rx*1.6}" height="3" rx="1" fill="white"/>
        <rect x="${cx-m.rx*0.8}" y="${cy+s*0.17}" width="${m.rx*1.6}" height="3" rx="1" fill="white"/>
      ` : ''}
    </svg>`;
  }

  // ===== パタカラキャラ（バウンスアニメ付き） =====
  function patakaraChar(icon, size = 120) {
    return `<div class="anim-patakara-char" style="font-size:${size}px;display:inline-block">
      <span class="anim-bounce-char">${icon}</span>
    </div>`;
  }

  // ===== 完了演出（花火＋星） =====
  function celebrationBurst() {
    const canvas = document.createElement('canvas');
    canvas.className = 'anim-celebration-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const fireworks = [];
    const colors = ['#EF4444','#F97316','#EAB308','#22C55E','#3B82F6','#8B5CF6','#EC4899'];

    // 花火を3つ打ち上げ
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const x = canvas.width * (0.2 + Math.random() * 0.6);
        const y = canvas.height * (0.15 + Math.random() * 0.3);
        for (let j = 0; j < 30; j++) {
          const angle = (j / 30) * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          fireworks.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1.0 + Math.random() * 0.5,
            size: 2 + Math.random() * 3,
          });
        }
      }, i * 400);
    }

    let frame = 0;
    function animate() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.05; // gravity
        f.life -= 0.02;

        if (f.life <= 0) { fireworks.splice(i, 1); continue; }

        ctx.globalAlpha = f.life;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * f.life, 0, Math.PI * 2);
        ctx.fill();

        // 尾
        ctx.globalAlpha = f.life * 0.3;
        ctx.beginPath();
        ctx.arc(f.x - f.vx, f.y - f.vy, f.size * f.life * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (frame < 120 && fireworks.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(animate);
  }

  // ===== スコアカウントアップ（数字がくるくる回る） =====
  function countUp(element, target, duration = 1000) {
    const start = Date.now();
    const initial = 0;
    function update() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(initial + (target - initial) * eased);
      if (element) element.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
    }
    update();
  }

  // ===== ボタンの波紋エフェクト（全ボタンに自動適用） =====
  function initRipples() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-game, .game-card, .drill-mode-btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'anim-ripple';
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRipples);
  } else {
    initRipples();
  }

  return { transition, mouthChar, patakaraChar, celebrationBurst, countUp };
})();
