// おくちの健康ノート（保護者向け — 検査推移・問診・心配ごと・DHアドバイス）
const HealthNote = (() => {

  async function show() {
    const app = document.getElementById('app');
    const karteNo = OralApp.karteNo;

    if (!karteNo) {
      app.innerHTML = `<div class="parent-screen"><div class="parent-header">
        <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
        <h2>📋 おくちの健康ノート</h2></div>
        <p style="text-align:center;padding:40px;color:#94A3B8">QRコードからアクセスしてください</p></div>`;
      return;
    }

    // Firestoreからデータ取得
    let evals = [];
    let advice = null;
    let questionnaire = null;

    try {
      // 検査履歴（直近5回）
      const evalSnap = await db.collection('oralFunctionEvals')
        .where('karteNo', '==', karteNo)
        .orderBy('evalDate', 'desc')
        .limit(5)
        .get();
      evals = evalSnap.docs.map(d => d.data());

      // DHアドバイス（最新1件）
      const advSnap = await db.collection('dhHealthAdvice')
        .where('karteNo', '==', karteNo)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
      if (!advSnap.empty) advice = advSnap.docs[0].data();

      // 問診表（最新）
      const qSnap = await db.collection('oralQuestionnaire')
        .where('karteNo', '==', karteNo)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
      if (!qSnap.empty) questionnaire = qSnap.docs[0].data();
    } catch (e) {
      console.error('健康ノートデータ取得エラー:', e);
    }

    app.innerHTML = `
      <div class="health-note-screen">
        <div class="parent-header">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <h2>📋 おくちの健康ノート</h2>
        </div>

        <!-- 検査推移 -->
        <div class="hn-section">
          <h3 class="hn-section-title">📊 けんさのきろく</h3>
          ${renderEvalHistory(evals)}
        </div>

        <!-- DHからのアドバイス -->
        <div class="hn-section">
          <h3 class="hn-section-title">💬 えいせいしさんからのアドバイス</h3>
          ${renderAdvice(advice)}
        </div>

        <!-- おすすめケアグッズ -->
        <div class="hn-section">
          <h3 class="hn-section-title">🪥 おすすめケアグッズ</h3>
          ${renderProducts(advice)}
        </div>

        <!-- お口の心配ごと -->
        <div class="hn-section">
          <h3 class="hn-section-title">😟 おくちのしんぱいごと</h3>
          ${renderConcerns(advice)}
        </div>

        <!-- 問診表 -->
        <div class="hn-section">
          <h3 class="hn-section-title">📝 もんしんひょう</h3>
          ${renderQuestionnaire(questionnaire, karteNo)}
        </div>
      </div>
    `;
  }

  // ===== 検査推移 =====
  function renderEvalHistory(evals) {
    if (evals.length === 0) return '<p class="hn-empty">まだけんさきろくがありません</p>';

    const latest = evals[0];
    const items = latest.items || {};
    const positiveCount = Object.values(items).filter(v => v === true).length;
    const isDiagnosed = positiveCount >= 2;

    // 推移（棒グラフ風）
    const chartHtml = evals.reverse().map(e => {
      const score = e.score || 0;
      const max = 13;
      const pct = Math.round(score / max * 100);
      const color = score >= 5 ? '#EF4444' : score >= 2 ? '#F59E0B' : '#10B981';
      return `
        <div class="hn-chart-bar">
          <div class="hn-chart-fill" style="height:${pct}%;background:${color}"></div>
          <span class="hn-chart-label">${(e.evalDate || '').slice(5)}</span>
          <span class="hn-chart-value">${score}</span>
        </div>
      `;
    }).join('');

    // 該当項目
    const ITEM_LABELS = {
      chewing: '🍚 かむこと', eating_behavior: '🍽️ たべかた', swallowing: '😮 のみこみ',
      food_form: '🥄 たべもののかたち', articulation: '💬 はつおん', lip_closure: '👄 くちびる',
      tongue_position: '👅 べろのいち', mouth_breathing: '👃 くちこきゅう', snoring: '😴 いびき',
      nasal_obstruction: '🤧 はなづまり', finger_sucking: '✋ ゆびしゃぶり',
      tongue_thrust: '👅 べろつきだし', nail_biting: '💅 つめかみ'
    };

    const positiveItems = Object.entries(items)
      .filter(([k, v]) => v === true)
      .map(([k]) => ITEM_LABELS[k] || k);

    return `
      <div class="hn-eval-summary ${isDiagnosed ? 'hn-eval-alert' : 'hn-eval-ok'}">
        <span class="hn-eval-icon">${isDiagnosed ? '⚠️' : '✅'}</span>
        <div>
          <strong>${isDiagnosed ? 'きになるところがあります' : 'じゅんちょうです！'}</strong>
          <span>（${positiveCount}/13こうもく）</span>
          <small>さいしんけんさ: ${latest.evalDate || '—'}</small>
        </div>
      </div>
      <div class="hn-chart">${chartHtml}</div>
      ${positiveItems.length > 0 ? `
        <div class="hn-items-list">
          <p class="hn-items-title">きになるところ:</p>
          ${positiveItems.map(i => `<span class="hn-item-tag">${i}</span>`).join('')}
        </div>
      ` : ''}
    `;
  }

  // ===== DHアドバイス =====
  function renderAdvice(advice) {
    if (!advice || !advice.message) return '<p class="hn-empty">まだアドバイスがとどいていません<br><small>つぎのけんしんのとき えいせいしさんが かいてくれます</small></p>';
    const nick = typeof OralApp !== 'undefined' ? OralApp.toNickname(advice.dhName) : advice.dhName;
    return `
      <div class="hn-advice-card">
        <div class="hn-advice-from">${esc(nick)}せんせいより（${advice.date || ''}）</div>
        <div class="hn-advice-body">${esc(advice.message).replace(/\n/g, '<br>')}</div>
      </div>
    `;
  }

  // ===== おすすめケアグッズ =====
  function renderProducts(advice) {
    if (!advice || !advice.products || advice.products.length === 0) {
      return '<p class="hn-empty">つぎのけんしんで おすすめを おしえてもらおう！</p>';
    }
    return `
      <div class="hn-products-grid">
        ${advice.products.map(p => `
          <div class="hn-product-card">
            <span class="hn-product-icon">${p.icon || '🪥'}</span>
            <div class="hn-product-info">
              <strong>${esc(p.name)}</strong>
              <small>${esc(p.reason || '')}</small>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ===== お口の心配ごと =====
  function renderConcerns(advice) {
    if (!advice || !advice.concerns || advice.concerns.length === 0) {
      return '<p class="hn-empty">とくにしんぱいなことは ありません 😊</p>';
    }
    return `
      <div class="hn-concerns-list">
        ${advice.concerns.map(c => `
          <div class="hn-concern-card">
            <span class="hn-concern-icon">${c.icon || '🦷'}</span>
            <div>
              <strong>${esc(c.title)}</strong>
              <p>${esc(c.detail || '')}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ===== 問診表（保護者が入力） =====
  function renderQuestionnaire(q, karteNo) {
    const QUESTIONS = [
      { id: 'brushFreq', label: 'はみがきの かいすう', type: 'select', options: ['1にち1かい', '1にち2かい', '1にち3かい', 'あまりしない'] },
      { id: 'brushHelp', label: 'おうちのひとの しあげみがき', type: 'select', options: ['まいにちしている', 'ときどきしている', 'していない'] },
      { id: 'flossUse', label: 'フロスをつかっている？', type: 'select', options: ['まいにち', 'ときどき', 'つかっていない'] },
      { id: 'snackFreq', label: 'おやつの かいすう（1にち）', type: 'select', options: ['1かい', '2かい', '3かいいじょう', 'きまっていない'] },
      { id: 'juiceDrink', label: 'ジュース・スポーツドリンクをのむ？', type: 'select', options: ['ほとんどのまない', 'ときどき', 'まいにち'] },
      { id: 'mouthBreath', label: 'くちを あけていることがおおい？', type: 'select', options: ['ない', 'ときどき', 'よくある'] },
      { id: 'fingerSuck', label: 'ゆびしゃぶりの くせがある？', type: 'select', options: ['ない', 'あったがやめた', 'まだしている'] },
      { id: 'snoring', label: 'いびきを かく？', type: 'select', options: ['ない', 'ときどき', 'よくある'] },
      { id: 'concerns', label: 'きになること（じゆうきじゅつ）', type: 'textarea' },
    ];

    const answers = q?.answers || {};

    return `
      <div class="hn-questionnaire">
        <p class="hn-q-intro">おうちでのようすを おしえてください。<br>けんしんのとき えいせいしさんが さんこうにします。</p>
        <form id="hn-q-form" onsubmit="return false">
          ${QUESTIONS.map(q => {
            if (q.type === 'select') {
              return `
                <div class="hn-q-item">
                  <label>${q.label}</label>
                  <select class="hn-q-select" data-qid="${q.id}">
                    <option value="">えらんでください</option>
                    ${q.options.map(o => `<option value="${o}" ${answers[q.id] === o ? 'selected' : ''}>${o}</option>`).join('')}
                  </select>
                </div>
              `;
            } else {
              return `
                <div class="hn-q-item">
                  <label>${q.label}</label>
                  <textarea class="hn-q-textarea" data-qid="${q.id}" rows="2" placeholder="きになることがあれば かいてください">${esc(answers[q.id] || '')}</textarea>
                </div>
              `;
            }
          }).join('')}
          <button class="btn-game btn-game-next" onclick="HealthNote.saveQuestionnaire()" style="width:100%;margin-top:12px">💾 ほぞんする</button>
        </form>
        ${q?.createdAt ? `<p class="hn-q-saved">さいしゅうほぞん: ${q.savedDate || '—'}</p>` : ''}
      </div>
    `;
  }

  // 問診表保存
  async function saveQuestionnaire() {
    const karteNo = OralApp.karteNo;
    if (!karteNo) return;

    const answers = {};
    document.querySelectorAll('[data-qid]').forEach(el => {
      const qid = el.dataset.qid;
      answers[qid] = el.value || '';
    });

    try {
      await db.collection('oralQuestionnaire').add({
        karteNo,
        clinicCode: OralApp.clinicCode,
        answers,
        savedDate: new Date().toISOString().slice(0, 10),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('ほぞんしました！えいせいしさんに とどきます。');
    } catch (e) {
      console.error('問診保存エラー:', e);
      alert('ほぞんに しっぱいしました');
    }
  }

  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  return { show, saveQuestionnaire };
})();
