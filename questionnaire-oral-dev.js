// 口腔機能発達不全症 専用問診表（保護者記入）
const QuestionnaireOralDev = (() => {

  // ===== 問診項目（厚労省基準 + 臨床的に重要な項目） =====
  const SECTIONS = [
    {
      id: 'basic',
      title: '👶 おこさまの基本情報',
      icon: '👶',
      questions: [
        { id: 'age', label: 'おこさまの年齢', type: 'select', options: ['0〜1歳', '2歳', '3歳', '4歳', '5歳', '6歳', '7歳', '8歳', '9歳', '10歳', '11歳', '12歳', '13歳', '14歳'] },
        { id: 'gender', label: '性別', type: 'select', options: ['男の子', '女の子'] },
        { id: 'birth_weight', label: '出生時の体重', type: 'select', options: ['2500g未満（低体重）', '2500g〜3999g（正常）', '4000g以上', 'わからない'] },
        { id: 'birth_type', label: '出産方法', type: 'select', options: ['普通分娩', '帝王切開', 'その他', 'わからない'] },
      ]
    },
    {
      id: 'feeding',
      title: '🍼 哺乳・離乳の歴史',
      icon: '🍼',
      questions: [
        { id: 'breastfeed', label: '母乳育児をしましたか？', type: 'select', options: ['完全母乳', '混合（母乳+ミルク）', '完全ミルク'] },
        { id: 'breastfeed_duration', label: '母乳・哺乳瓶はいつまで？', type: 'select', options: ['6ヶ月未満', '6ヶ月〜1歳', '1歳〜1歳半', '1歳半〜2歳', '2歳以上', '該当なし'] },
        { id: 'weaning_start', label: '離乳食はいつ始めましたか？', type: 'select', options: ['5ヶ月頃', '6ヶ月頃', '7ヶ月以降', 'わからない'] },
        { id: 'weaning_trouble', label: '離乳食で困ったことは？', type: 'multi', options: ['特になし', '丸飲みが多かった', '偏食がひどかった', 'なかなか食べなかった', 'かたい物を嫌がった', 'むせることが多かった'] },
      ]
    },
    {
      id: 'eating',
      title: '🍚 食べる機能',
      icon: '🍚',
      questions: [
        { id: 'chewing_side', label: '片側ばかりで噛んでいませんか？', type: 'select', options: ['左右均等に噛める', '片側で噛むことが多い', 'わからない'] },
        { id: 'chewing_count', label: '食べ物をよく噛んでいますか？', type: 'select', options: ['よく噛んでいる', '少し噛んで飲み込む', 'ほとんど噛まず丸飲み'] },
        { id: 'eating_time', label: '食事にかかる時間は？', type: 'select', options: ['15分以内', '15〜30分', '30分以上かかる', '1時間以上かかる'] },
        { id: 'food_spill', label: '食べこぼしは多いですか？', type: 'select', options: ['ほとんどない', '時々こぼす', 'よくこぼす'] },
        { id: 'picky_eating', label: '偏食はありますか？', type: 'select', options: ['特になし', '少しある', 'かなり偏食', '極端な偏食（食べられるものが非常に少ない）'] },
        { id: 'food_texture', label: '年齢に合った硬さの食べ物を食べられますか？', type: 'select', options: ['食べられる', 'やわらかいものを好む', '硬いものは食べられない'] },
        { id: 'swallow_problem', label: '飲み込むとき、舌が前に出る癖がありますか？', type: 'select', options: ['ない', '時々ある', 'いつもある', 'わからない'] },
        { id: 'drool', label: 'よだれが多いですか？（3歳以上で）', type: 'select', options: ['該当しない（3歳未満）', 'ない', '少しある', '多い'] },
      ]
    },
    {
      id: 'speaking',
      title: '💬 話す機能',
      icon: '💬',
      questions: [
        { id: 'articulation', label: '発音で気になることはありますか？', type: 'multi', options: ['特になし', 'サ行が言えない（「さかな」→「たかな」等）', 'タ行が不明瞭', 'ラ行が言えない', 'カ行が不明瞭', '全体的に聞き取りにくい', 'ことばが遅い'] },
        { id: 'lip_close', label: '安静時に口が開いていますか？', type: 'select', options: ['いつも閉じている', '時々開いている', 'いつも開いている'] },
        { id: 'lip_dry', label: '唇が乾燥しやすいですか？', type: 'select', options: ['いいえ', 'はい、よく乾燥する'] },
        { id: 'tongue_position', label: 'べろの位置が低い、または前に出ていると指摘されたことは？', type: 'select', options: ['ない', 'ある', 'わからない'] },
        { id: 'tongue_tie', label: '舌小帯（べろの裏のすじ）が短いと言われたことは？', type: 'select', options: ['ない', 'ある', 'わからない'] },
      ]
    },
    {
      id: 'breathing',
      title: '👃 呼吸の状態',
      icon: '👃',
      questions: [
        { id: 'mouth_breathing', label: '口呼吸をしていますか？', type: 'select', options: ['いいえ（鼻呼吸）', '時々口で呼吸している', 'いつも口で呼吸している'] },
        { id: 'snoring', label: 'いびきをかきますか？', type: 'select', options: ['かかない', '時々かく', 'よくかく', '毎晩ひどいいびき'] },
        { id: 'sleep_apnea', label: '寝ている時に呼吸が止まることは？', type: 'select', options: ['ない', 'あるかもしれない', 'ある'] },
        { id: 'open_sleep', label: '寝ている時に口が開いていますか？', type: 'select', options: ['閉じている', '時々開いている', 'いつも開いている'] },
        { id: 'nasal_problem', label: '鼻の問題はありますか？', type: 'multi', options: ['特になし', 'アレルギー性鼻炎', '副鼻腔炎', '鼻づまりが多い', 'アデノイド肥大を指摘された'] },
      ]
    },
    {
      id: 'habits',
      title: '✋ お口の習癖（くせ）',
      icon: '✋',
      questions: [
        { id: 'finger_suck', label: '指しゃぶりの習慣は？', type: 'select', options: ['したことがない', '以前していたがやめた（__歳でやめた）', '現在もしている'] },
        { id: 'finger_suck_age', label: '指しゃぶりをやめた年齢（該当する場合）', type: 'select', options: ['該当しない', '1歳前', '1〜2歳', '2〜3歳', '3〜4歳', '4歳以降', 'まだやめていない'] },
        { id: 'pacifier', label: 'おしゃぶりの使用は？', type: 'select', options: ['使っていない', '2歳までに卒業', '2歳以降も使った'] },
        { id: 'tongue_thrust', label: '舌を突き出す癖はありますか？', type: 'select', options: ['ない', '飲み込む時に出る', '安静時にも出ている', 'わからない'] },
        { id: 'lip_biting', label: '唇を噛む癖は？', type: 'select', options: ['ない', '時々ある', 'よくある'] },
        { id: 'nail_biting', label: '爪を噛む癖は？', type: 'select', options: ['ない', '時々ある', 'よくある'] },
        { id: 'cheek_prop', label: 'ほおづえをつく癖は？', type: 'select', options: ['ない', '時々ある', 'よくある'] },
        { id: 'teeth_grinding', label: '歯ぎしりはしますか？', type: 'select', options: ['ない', '時々ある', 'よくある'] },
      ]
    },
    {
      id: 'dental',
      title: '🦷 歯とお口の状態',
      icon: '🦷',
      questions: [
        { id: 'cavity_history', label: 'むし歯の経験は？', type: 'select', options: ['むし歯になったことがない', '治療済みのむし歯がある', '現在むし歯がある'] },
        { id: 'teeth_alignment', label: '歯並びで気になることは？', type: 'multi', options: ['特になし', '出っ歯（上の前歯が出ている）', '受け口（下あごが出ている）', '開咬（奥歯で噛んでも前歯が開く）', 'ガタガタ（叢生）', 'すきっ歯', 'その他'] },
        { id: 'brush_freq', label: '歯みがきの回数は？', type: 'select', options: ['1日1回', '1日2回', '1日3回', '不定期'] },
        { id: 'brush_help', label: '仕上げ磨きはしていますか？', type: 'select', options: ['毎日している', '時々している', 'していない', '子供が嫌がるのでできない'] },
        { id: 'floss_use', label: 'フロスを使っていますか？', type: 'select', options: ['毎日使っている', '時々使っている', '使っていない'] },
        { id: 'fluoride', label: 'フッ素入り歯磨き粉を使っていますか？', type: 'select', options: ['使っている', '使っていない', 'わからない'] },
      ]
    },
    {
      id: 'lifestyle',
      title: '🍽️ 食生活・生活習慣',
      icon: '🍽️',
      questions: [
        { id: 'snack_freq', label: 'おやつの回数（1日）', type: 'select', options: ['1回（決まった時間）', '2回', '3回以上', '決まっていない（ダラダラ食べ）'] },
        { id: 'juice_freq', label: 'ジュース・スポーツドリンクを飲む頻度', type: 'select', options: ['ほとんど飲まない', '時々', '毎日飲む', '水代わりに飲む'] },
        { id: 'hard_food', label: '硬いもの（りんご・せんべい等）を食べますか？', type: 'select', options: ['よく食べる', '時々食べる', 'あまり食べない（やわらかいもの中心）'] },
        { id: 'meal_posture', label: '食事中の姿勢は？', type: 'select', options: ['足が床についた正しい姿勢', '足がぶらぶら（椅子が高い）', '寝転んで食べることがある'] },
      ]
    },
    {
      id: 'concerns',
      title: '📝 その他',
      icon: '📝',
      questions: [
        { id: 'medical_history', label: 'お子様の既往歴・アレルギー', type: 'textarea', placeholder: '気管支喘息、アレルギー性鼻炎、アトピー等あればご記入ください' },
        { id: 'other_treatment', label: '現在通院中の医療機関・治療', type: 'textarea', placeholder: '耳鼻科、小児科、矯正歯科等' },
        { id: 'parent_concerns', label: 'お口のことで気になること', type: 'textarea', placeholder: '歯並び、食べ方、発音、口呼吸など、何でもご記入ください' },
        { id: 'goals', label: 'お子様のお口について改善したいこと', type: 'textarea', placeholder: '口を閉じる習慣をつけたい、よく噛んで食べてほしい、等' },
      ]
    },
  ];

  // ===== 表示 =====
  function show() {
    const app = document.getElementById('app');
    const karteNo = OralApp.karteNo;

    app.innerHTML = `
      <div class="q-oral-screen">
        <div class="parent-header">
          <button class="btn-back-game" onclick="OralApp.showHome()">◀ もどる</button>
          <h2>📋 おくちのきのう もんしんひょう</h2>
        </div>

        <div class="q-oral-intro">
          <p>おこさまのお口の機能について、<br>ふだんの様子を教えてください。</p>
          <p class="q-oral-note">えいせいしが おこさまに合ったトレーニングを<br>計画するために使用します。</p>
        </div>

        <form id="q-oral-form" onsubmit="return false">
          ${SECTIONS.map(sec => renderSection(sec)).join('')}

          <div class="q-oral-submit">
            <button class="btn-game btn-game-next" onclick="QuestionnaireOralDev.save()" style="width:100%">
              💾 ほぞんして えいせいしさんに おくる
            </button>
          </div>
        </form>

        <p class="q-oral-privacy">🔒 ご記入いただいた内容は、担当歯科衛生士のみが<br>お口の機能改善のために使用します。</p>
      </div>
    `;

    // 保存済みデータがあれば復元
    loadSaved();
  }

  function renderSection(sec) {
    return `
      <div class="q-oral-section">
        <h3 class="q-oral-section-title">${sec.title}</h3>
        ${sec.questions.map(q => renderQuestion(q)).join('')}
      </div>
    `;
  }

  function renderQuestion(q) {
    if (q.type === 'select') {
      return `
        <div class="q-oral-item">
          <label class="q-oral-label">${q.label}</label>
          <select class="q-oral-select" data-qid="${q.id}">
            <option value="">選択してください</option>
            ${q.options.map(o => `<option value="${o}">${o}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (q.type === 'multi') {
      return `
        <div class="q-oral-item">
          <label class="q-oral-label">${q.label}</label>
          <div class="q-oral-multi">
            ${q.options.map(o => `
              <label class="q-oral-check">
                <input type="checkbox" data-qid="${q.id}" value="${o}">
                <span>${o}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.type === 'textarea') {
      return `
        <div class="q-oral-item">
          <label class="q-oral-label">${q.label}</label>
          <textarea class="q-oral-textarea" data-qid="${q.id}" rows="2" placeholder="${q.placeholder || ''}"></textarea>
        </div>
      `;
    }
    return '';
  }

  // ===== 保存 =====
  async function save() {
    const karteNo = OralApp.karteNo;
    const answers = {};

    // select・textarea
    document.querySelectorAll('.q-oral-select, .q-oral-textarea').forEach(el => {
      if (el.dataset.qid && el.value) answers[el.dataset.qid] = el.value;
    });

    // multi（チェックボックス）
    const multiIds = new Set();
    document.querySelectorAll('.q-oral-multi input[type="checkbox"]').forEach(cb => {
      multiIds.add(cb.dataset.qid);
    });
    multiIds.forEach(qid => {
      const checked = [];
      document.querySelectorAll(`.q-oral-multi input[data-qid="${qid}"]:checked`).forEach(cb => {
        checked.push(cb.value);
      });
      if (checked.length > 0) answers[qid] = checked;
    });

    // リスク判定
    const risk = assessRisk(answers);

    try {
      if (karteNo) {
        await db.collection('oralDevQuestionnaire').add({
          karteNo,
          clinicCode: OralApp.clinicCode,
          answers,
          risk,
          savedDate: new Date().toISOString().slice(0, 10),
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      // ローカルにも保存
      localStorage.setItem('oralDevQ_' + (karteNo || 'local'), JSON.stringify(answers));

      showComplete(risk);
    } catch (e) {
      console.error('問診保存エラー:', e);
      // ローカル保存はする
      localStorage.setItem('oralDevQ_' + (karteNo || 'local'), JSON.stringify(answers));
      showComplete(assessRisk(answers));
    }
  }

  // ===== 保存データ復元 =====
  function loadSaved() {
    const karteNo = OralApp.karteNo;
    const saved = localStorage.getItem('oralDevQ_' + (karteNo || 'local'));
    if (!saved) return;
    try {
      const answers = JSON.parse(saved);
      // select・textarea復元
      document.querySelectorAll('.q-oral-select, .q-oral-textarea').forEach(el => {
        if (el.dataset.qid && answers[el.dataset.qid]) {
          if (typeof answers[el.dataset.qid] === 'string') el.value = answers[el.dataset.qid];
        }
      });
      // multi復元
      document.querySelectorAll('.q-oral-multi input[type="checkbox"]').forEach(cb => {
        const vals = answers[cb.dataset.qid];
        if (Array.isArray(vals) && vals.includes(cb.value)) cb.checked = true;
      });
    } catch (e) {}
  }

  // ===== リスク判定（自動スクリーニング） =====
  function assessRisk(a) {
    let score = 0;
    const flags = [];

    // 食べる機能
    if (a.chewing_count === 'ほとんど噛まず丸飲み') { score += 2; flags.push('咀嚼不足'); }
    if (a.chewing_count === '少し噛んで飲み込む') { score += 1; }
    if (a.eating_time === '30分以上かかる' || a.eating_time === '1時間以上かかる') { score += 1; flags.push('食事時間過長'); }
    if (a.food_spill === 'よくこぼす') { score += 1; flags.push('食べこぼし'); }
    if (a.food_texture === '硬いものは食べられない') { score += 2; flags.push('食形態の問題'); }
    if (a.swallow_problem === 'いつもある') { score += 2; flags.push('嚥下時舌突出'); }
    if (a.picky_eating === '極端な偏食（食べられるものが非常に少ない）') { score += 2; flags.push('極端な偏食'); }

    // 話す機能
    if (Array.isArray(a.articulation) && a.articulation.some(v => v !== '特になし')) { score += 2; flags.push('構音の問題'); }
    if (a.lip_close === 'いつも開いている') { score += 2; flags.push('口唇閉鎖不全'); }
    if (a.lip_close === '時々開いている') { score += 1; }
    if (a.tongue_position === 'ある') { score += 1; flags.push('低位舌'); }
    if (a.tongue_tie === 'ある') { score += 1; flags.push('舌小帯短縮'); }

    // 呼吸
    if (a.mouth_breathing === 'いつも口で呼吸している') { score += 2; flags.push('口呼吸'); }
    if (a.mouth_breathing === '時々口で呼吸している') { score += 1; }
    if (a.snoring === 'よくかく' || a.snoring === '毎晩ひどいいびき') { score += 2; flags.push('いびき'); }
    if (a.sleep_apnea === 'ある') { score += 3; flags.push('睡眠時無呼吸の疑い'); }

    // 習癖
    if (a.finger_suck === '現在もしている') { score += 2; flags.push('指しゃぶり継続'); }
    if (a.tongue_thrust === '安静時にも出ている') { score += 2; flags.push('舌突出癖'); }
    if (a.tongue_thrust === '飲み込む時に出る') { score += 1; }
    if (a.lip_biting === 'よくある') { score += 1; flags.push('咬唇癖'); }

    let level;
    if (score >= 8) level = 'high';
    else if (score >= 4) level = 'medium';
    else level = 'low';

    return { score, level, flags };
  }

  // ===== 完了画面 =====
  function showComplete(risk) {
    const app = document.getElementById('app');
    const levelText = {
      high: { icon: '⚠️', title: 'いくつか気になる点があります', desc: '次回の検診で詳しく確認させていただきます', color: '#EF4444', bg: '#FEF2F2' },
      medium: { icon: '📋', title: '少し気になる点があります', desc: 'トレーニングで改善できることが多いです', color: '#F59E0B', bg: '#FFFBEB' },
      low: { icon: '✅', title: 'おおむね順調です', desc: '引き続き毎日のケアを続けましょう', color: '#10B981', bg: '#F0FDF4' },
    };
    const info = levelText[risk.level];

    app.innerHTML = `
      <div class="q-oral-screen">
        <div class="q-oral-complete" style="background:${info.bg}">
          <span style="font-size:64px">${info.icon}</span>
          <h2 style="color:${info.color}">${info.title}</h2>
          <p>${info.desc}</p>

          ${risk.flags.length > 0 ? `
            <div class="q-oral-flags">
              <p style="font-weight:700;margin-bottom:6px">気になる項目:</p>
              ${risk.flags.map(f => `<span class="q-oral-flag">${f}</span>`).join('')}
            </div>
          ` : ''}

          <p class="q-oral-complete-note">
            えいせいしさんが この問診表を見て、<br>
            おこさまに合ったトレーニングを考えます。
          </p>

          <div class="complete-actions">
            <button class="btn-game btn-game-home" onclick="OralApp.showHome()">ホームにもどる</button>
          </div>
        </div>
      </div>
    `;
  }

  return { show, save };
})();
