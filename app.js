// おくちのぼうけん — メインアプリ（ミッション進行型 + 公文式ステージ制）
// 優先順位: ①体操の継続 ②歯みがき習慣 ③知育クイズの楽しさ
const OralApp = (() => {
  let karteNo = null;
  let clinicCode = null;
  let currentScreen = 'home';
  let streakData = null;

  // ===== スタッフ→子供向けニックネーム変換 =====
  // 子供が親しみやすい愛称（ニックネーム）
  const STAFF_NICKNAMES = {
    // 衛生��（本院）
    '山田いくみ': 'いくみん', '増子貴子': 'たかちゃん', '菊池亜矢子': 'あやちゃん',
    '手塚千夏': 'ちなっちゃん', '野崎亜弓': 'あゆちゃん', '松山恵': 'めぐちゃん',
    '篠原祐香': 'ゆうちゃん', '岡美里': 'みさちゃん', '緑川愛璃菜': 'ありちゃん',
    '降矢明子': 'あきちゃん', '石川陽菜': 'ひなちゃん', '梁島祐巳': 'ゆみちゃん',
    '吉成ミサト': 'みさちゃん',
    // 衛生士（イースト）
    '瓦井佐友里': 'さゆちゃん', '早乙女亜紗子': 'あさちゃん', '大根田苑美': 'そのちゃん',
    '岡千穂彌': 'ちほちゃん', '金井鞠奈': 'まりちゃん',
    // 歯科医師
    '五十嵐尚美': 'なおみ', '五十嵐三彦': 'みつひこ',
    '糸井友加里': 'ゆかりん', '鈴木千夏': 'ちなっちゃん', '土沢太輝': 'たいきくん',
    '山田淳': 'じゅんくん', '遠藤千愛': 'ちあちゃん', '田中祐樹': 'ゆうきくん',
    '渡邉杏子': 'きょうちゃん', '山田明日美': 'あすみん', '奈良清加': 'きよちゃん',
  };

  function toNickname(fullName) {
    if (!fullName) return 'せんせい';
    const nick = STAFF_NICKNAMES[fullName.replace(/（.*）/, '')];
    return nick || fullName.replace(/^.+?([^\s]+)$/, '$1'); // 姓を除去してフォールバック
  }

  // ===== 公文式ステージ定義（体操ゲーム） =====
  const EXERCISE_STAGES = [
    { stage: 1, gameId: 'aiube',    name: 'あいうべ<br>たいそう', icon: '😮', color: '#EF4444' },
    { stage: 2, gameId: 'brushing', name: 'ピカピカ<br>はみがき', icon: '🪥', color: '#3B82F6' },
    { stage: 3, gameId: 'blowing',  name: 'ふーふー<br>チャレンジ', icon: '🌀', color: '#10B981' },
    { stage: 4, gameId: 'tongue',   name: 'べろべろ<br>チャレンジ', icon: '👅', color: '#F97316' },
    { stage: 5, gameId: 'chewing',  name: 'もぐもぐ<br>リズム',    icon: '🎵', color: '#8B5CF6' },
  ];

  // ご褒美ゲーム（体操完了後に解放）
  const REWARD_GAMES = [
    { gameId: 'quiz',   name: 'おくちクイズ', icon: '🧠', color: '#0EA5E9' },
    { gameId: 'reward', name: 'ごほうびオセロ', icon: '🎁', color: '#7C3AED' },
  ];

  const STREAK_NOTIFY_DAYS = 3;
  const REWARD_COST = 3;

  // 歯みがきチェック
  const BRUSH_CHECKS = [
    { id: 'brush_morning', label: 'あさ はみがきした？', icon: '🌅' },
    { id: 'brush_night',   label: 'よる はみがきした？', icon: '🌙' },
  ];
  // 食育チェック
  const FOOD_CHECKS = [
    { id: 'chew_well',        label: 'よくかんでたべた？', icon: '🍚' },
    { id: 'no_sweets',        label: 'おやつをだらだらたべなかった？', icon: '🍭' },
    { id: 'drink_water',      label: 'おちゃやおみずをのんだ？', icon: '💧' },
    { id: 'no_mouth_breath',  label: 'おくちをとじてすごせた？', icon: '👃' },
  ];
  const ALL_CHECKS = [...BRUSH_CHECKS, ...FOOD_CHECKS];

  function getParams() {
    const p = new URLSearchParams(location.search);
    karteNo = p.get('k') || null;
    clinicCode = p.get('c') || 'A';
  }

  async function start() {
    getParams();
    try { await signInAnonymous(); } catch (e) {}
    await loadStreakData();
    // 初回: オンボーディング → テーマ選択 → ホーム
    if (typeof Onboarding !== 'undefined' && Onboarding.shouldShow()) {
      Onboarding.show(() => {
        Themes.showSelector('OralApp.showHome()');
      });
      return;
    }
    if (!Themes.getTheme()) {
      Themes.showSelector('OralApp.showHome()');
      return;
    }
    Themes.applyTheme();
    showHome();
  }

  async function loadStreakData() {
    if (!karteNo) return;
    try {
      const doc = await db.collection('oralFunctionStreaks').doc(karteNo).get();
      streakData = doc.exists ? doc.data() : null;
    } catch (e) { streakData = null; }
  }

  function getUnlockedStage() {
    return streakData?.unlockedStage || 1;
  }

  // 今日すでに体操を完了しているか
  function didExerciseToday() {
    if (!streakData) return false;
    const today = new Date().toISOString().slice(0, 10);
    const stamps = streakData.stamps || {};
    const todayStamps = stamps[today] || [];
    // 体操系ゲームのいずれかを完了していればOK
    return todayStamps.some(g => EXERCISE_STAGES.some(s => s.gameId === g));
  }

  // 今日の歯みがきチェック状態
  function getBrushStatus() {
    const today = new Date().toISOString().slice(0, 10);
    const checks = streakData?.dailyChecks?.[today] || {};
    return BRUSH_CHECKS.every(c => checks[c.id]);
  }

  // ===== ミッション進行型ホーム画面 =====
  function showHome() {
    stopAllGames();
    currentScreen = 'home';
    Themes.applyTheme();
    const theme = Themes.getTheme() || {};
    const app = document.getElementById('app');
    const unlockedStage = getUnlockedStage();
    const exerciseDone = didExerciseToday();
    const brushDone = getBrushStatus();

    // === ミッション進捗を計算 ===
    const missionStep = exerciseDone ? (brushDone ? 3 : 2) : 1;

    app.innerHTML = `
      <div class="home-screen">
        <div class="home-header">
          <div class="mascot">${theme.mascot || '🦷'}</div>
          <h1 class="home-title">${theme.name || 'おくちの<br>ぼうけん'}</h1>
          <button class="btn-theme-change" onclick="Themes.showSelector('OralApp.showHome()')">🎨</button>
        </div>
        <div class="home-level-bar" id="home-level-bar"></div>
        <div id="checkup-countdown"></div>

        <!-- ===== ミッション進捗バー ===== -->
        <div class="mission-progress">
          <div class="mission-step ${missionStep >= 1 ? (exerciseDone ? 'mission-done' : 'mission-current') : ''}">
            <span class="mission-num">${exerciseDone ? '✅' : '①'}</span>
            <span>たいそう</span>
          </div>
          <div class="mission-arrow">→</div>
          <div class="mission-step ${missionStep >= 2 ? (brushDone ? 'mission-done' : 'mission-current') : 'mission-locked'}">
            <span class="mission-num">${brushDone ? '✅' : '②'}</span>
            <span>はみがき</span>
          </div>
          <div class="mission-arrow">→</div>
          <div class="mission-step ${missionStep >= 3 ? 'mission-done' : 'mission-locked'}">
            <span class="mission-num">${missionStep >= 3 ? '🎉' : '③'}</span>
            <span>ごほうび</span>
          </div>
        </div>

        <!-- ===== ステップ1: 体操（最優先） ===== -->
        <div class="mission-section ${missionStep === 1 ? 'mission-active' : 'mission-completed-section'}">
          <h3 class="mission-title">
            ${exerciseDone
              ? '✅ きょうのたいそう クリア！'
              : '💪 ステップ①　まず たいそうをしよう！'}
          </h3>
          ${!exerciseDone ? '<p class="mission-subtitle">おくちのきんにくをきたえよう！</p>' : ''}
          <div class="game-grid">
            ${renderExerciseCards(unlockedStage, theme)}
          </div>
          ${!exerciseDone && unlockedStage < 5 ? renderStageProgress(unlockedStage) : ''}
        </div>

        <!-- ===== ステップ2: はみがきチェック ===== -->
        <div class="mission-section ${missionStep === 2 ? 'mission-active' : missionStep < 2 ? 'mission-section-locked' : 'mission-completed-section'}">
          <h3 class="mission-title">
            ${brushDone
              ? '✅ はみがきチェック クリア！'
              : missionStep >= 2
                ? '🪥 ステップ②　はみがきチェック！'
                : '🔒 たいそうをしたら はみがきチェック！'}
          </h3>
          ${renderBrushChecks(missionStep >= 2)}
          ${missionStep >= 2 ? renderFoodChecks() : ''}
        </div>

        <!-- ===== ステップ3: ごほうび（体操+歯みがき完了後） ===== -->
        <div class="mission-section ${missionStep >= 3 ? 'mission-active' : 'mission-section-locked'}">
          <h3 class="mission-title">
            ${missionStep >= 3
              ? '🎁 ステップ③　ごほうびタイム！'
              : '🔒 たいそうとはみがきがおわったら あそべるよ！'}
          </h3>
          ${renderRewardSection(missionStep >= 3, theme)}
        </div>

        <!-- 衛生士からのメッセージ -->
        <div id="dh-messages"></div>

        <div class="home-footer">
          <button class="btn-calendar" onclick="Collection.showAlbum()">📖 ずかん</button>
          <button class="btn-calendar" onclick="Achievements.showAll(null)">🏆 バッジ</button>
          <button class="btn-calendar" onclick="StampCalendar.show()">📅 カレンダー</button>
          <button class="btn-sound" onclick="Sounds.toggle(); this.textContent=Sounds.isEnabled()?'🔊':'🔇'">${typeof Sounds !== 'undefined' && Sounds.isEnabled() ? '🔊' : '🔇'}</button>
          <button class="btn-parent" onclick="ParentMode.show()">🔒 ほごしゃ</button>
        </div>
      </div>
    `;
    loadLevelBar();
    loadCheckupCountdown();
    if (typeof Messages !== 'undefined') Messages.loadMessages();
  }

  // === けんしんカウントダウン ===
  async function loadCheckupCountdown() {
    const el = document.getElementById('checkup-countdown');
    if (!el || !karteNo) return;
    try {
      // 最新の評価記録からnextAppointmentと担当者を取得
      const snap = await db.collection('oralFunctionEvals')
        .where('karteNo', '==', karteNo)
        .orderBy('evalDate', 'desc')
        .limit(1)
        .get();
      if (snap.empty) return;
      const rec = snap.docs[0].data();
      const nextDate = rec.nextAppointment;
      const evaluator = rec.evaluator; // 担当衛生士名
      if (!nextDate) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next = new Date(nextDate + 'T00:00:00');
      const diffDays = Math.ceil((next - today) / 86400000);

      if (diffDays < 0) return; // 過ぎた予約は表示しない
      if (diffDays > 60) return; // 遠すぎる予約も非表示

      const theme = Themes.getTheme() || {};
      const dhName = evaluator ? toNickname(evaluator) : 'えいせいしさん';

      let message, emoji, bgClass;
      if (diffDays === 0) {
        message = `きょうは けんしんの ひ！${dhName}せんせいに あえるよ！`;
        emoji = '🎉';
        bgClass = 'checkup-today';
      } else if (diffDays <= 3) {
        message = `あと ${diffDays}にちで けんしん！${dhName}せんせいに がんばったこと おはなししよう！`;
        emoji = '🤩';
        bgClass = 'checkup-soon';
      } else if (diffDays <= 7) {
        message = `あと ${diffDays}にちで けんしん！${dhName}せんせいが まってるよ！`;
        emoji = '😊';
        bgClass = 'checkup-week';
      } else {
        message = `つぎのけんしんまで あと ${diffDays}にち！まいにちたいそう つづけよう！`;
        emoji = '📅';
        bgClass = 'checkup-far';
      }

      el.innerHTML = `
        <div class="checkup-banner ${bgClass}">
          <span class="checkup-emoji">${emoji}</span>
          <div class="checkup-text">
            <span class="checkup-message">${message}</span>
            <span class="checkup-date">${nextDate.replace(/-/g, '/')}${rec.nextContent ? ' — ' + rec.nextContent : ''}</span>
          </div>
        </div>
      `;
    } catch (e) {
      // インデックス未作成等のエラーは無視
    }
  }

  // === 体操カード描画 ===
  function renderExerciseCards(unlockedStage, theme) {
    return EXERCISE_STAGES.map(s => {
      const locked = s.stage > unlockedStage;
      const lockClass = locked ? 'game-card-locked' : '';
      const onclick = locked
        ? `OralApp.showLockedMessage(${s.stage})`
        : `OralApp.openGame('${s.gameId}')`;
      const themeName = theme.games?.[s.gameId]?.name || s.name.replace('<br>', '');
      const themeDesc = locked
        ? `ステージ${s.stage}でかいほう`
        : (theme.games?.[s.gameId]?.desc || '');
      return `
        <button class="game-card game-card-${s.gameId} ${lockClass}" onclick="${onclick}">
          ${locked ? '<span class="game-lock">🔒</span>' : ''}
          <span class="game-icon">${s.icon}</span>
          <span class="game-name">${themeName}</span>
          <span class="game-desc">${themeDesc}</span>
        </button>
      `;
    }).join('');
  }

  // === ステージ進捗 ===
  function renderStageProgress(unlockedStage) {
    const next = EXERCISE_STAGES.find(s => s.stage === unlockedStage + 1);
    if (!next) return '';
    return `
      <div class="stage-next-info">
        <p>🎯 つぎ: <strong>${next.icon} ${next.name.replace('<br>', '')}</strong></p>
        <p class="stage-next-hint">まいにちつづけると えいせいしさんが かいほうしてくれるよ！</p>
      </div>`;
  }

  // === 歯みがきチェック描画 ===
  function renderBrushChecks(enabled) {
    const today = new Date().toISOString().slice(0, 10);
    const checks = streakData?.dailyChecks?.[today] || {};
    return `
      <div class="daily-check-list">
        ${BRUSH_CHECKS.map(c => {
          const done = checks[c.id] || false;
          return `
            <label class="daily-check-item ${done ? 'daily-check-done' : ''} ${!enabled ? 'daily-check-disabled' : ''}">
              <input type="checkbox" ${done ? 'checked' : ''} ${!enabled ? 'disabled' : ''}
                onchange="OralApp.toggleDailyCheck('${c.id}', this.checked)">
              <span class="daily-check-icon">${c.icon}</span>
              <span class="daily-check-label">${c.label}</span>
              ${done ? '<span class="daily-check-ok">✅</span>' : ''}
            </label>
          `;
        }).join('')}
      </div>
    `;
  }

  // === 食育チェック描画 ===
  function renderFoodChecks() {
    const today = new Date().toISOString().slice(0, 10);
    const checks = streakData?.dailyChecks?.[today] || {};
    const allDone = ALL_CHECKS.every(c => checks[c.id]);
    return `
      <div class="food-check-section">
        <h4 class="food-check-title">🍽️ しょくいくチェック</h4>
        <div class="daily-check-list">
          ${FOOD_CHECKS.map(c => {
            const done = checks[c.id] || false;
            return `
              <label class="daily-check-item ${done ? 'daily-check-done' : ''}">
                <input type="checkbox" ${done ? 'checked' : ''}
                  onchange="OralApp.toggleDailyCheck('${c.id}', this.checked)">
                <span class="daily-check-icon">${c.icon}</span>
                <span class="daily-check-label">${c.label}</span>
                ${done ? '<span class="daily-check-ok">✅</span>' : ''}
              </label>
            `;
          }).join('')}
        </div>
        ${allDone ? '<div class="daily-check-complete">🌟 ぜんぶクリア！ +1コイン</div>' : ''}
      </div>
    `;
  }

  // === ごほうびセクション描画 ===
  function renderRewardSection(enabled, theme) {
    if (!enabled) return '<p class="reward-locked-msg">たいそうと はみがきをして ごほうびをもらおう！</p>';
    const coins = streakData?.coins || 0;
    const coinIcon = theme.coinIcon || '🪙';
    const coinName = theme.coinName || 'コイン';
    const canPlayOsero = coins >= REWARD_COST;
    const quizThemeName = theme.games?.quiz?.name || 'おくちクイズ';
    const quizThemeDesc = theme.games?.quiz?.desc || 'はのひみつをしろう！';

    return `
      <div class="reward-section-inner">
        <div class="token-bar">
          <div class="token-display">
            <span class="token-icon">${coinIcon}</span>
            <span class="token-count">${coins} ${coinName}</span>
          </div>
        </div>
        <div class="reward-grid">
          <button class="game-card game-card-quiz" onclick="OralApp.openGame('quiz')">
            <span class="game-icon">🧠</span>
            <span class="game-name">${quizThemeName}</span>
            <span class="game-desc">${quizThemeDesc}</span>
          </button>
          <button class="game-card game-card-reward ${canPlayOsero ? '' : 'game-card-locked'}"
            onclick="${canPlayOsero ? 'OralApp.playReward()' : ''}">
            ${!canPlayOsero ? '<span class="game-lock">🔒</span>' : ''}
            <span class="game-icon">🎁</span>
            <span class="game-name">${theme.rewardName || 'オセロ'}</span>
            <span class="game-desc">${canPlayOsero ? 'あそべるよ！' : `${REWARD_COST}${coinName}ひつよう`}</span>
          </button>
        </div>
      </div>
    `;
  }

  function showLockedMessage(stage) {
    const nextStage = EXERCISE_STAGES.find(s => s.stage === stage);
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="game-screen">
        <div class="break-content">
          <div class="break-icon">🔒</div>
          <h2>まだロックされているよ</h2>
          <p style="max-width:300px;margin:12px auto">
            <strong>${nextStage.icon} ${nextStage.name.replace('<br>', '')}</strong>は<br>
            ステージ${stage}でかいほうされるよ！<br><br>
            いまのゲームをまいにちつづけよう！
          </p>
          <button class="btn-game btn-game-home" onclick="OralApp.showHome()">もどる</button>
        </div>
      </div>
    `;
  }

  async function loadLevelBar() {
    const el = document.getElementById('home-level-bar');
    if (!el) return;
    if (!streakData) {
      el.innerHTML = '<p class="level-info">🌟 はじめてのぼうけん！</p>';
      return;
    }
    const s = streakData;
    const level = s.level || 1;
    const streak = s.currentStreak || 0;
    const total = s.totalSessions || 0;
    const progress = Math.min((total % 10) / 10 * 100, 100);
    el.innerHTML = `
      <div class="level-display">
        <span class="level-badge">⭐ Lv.${level}</span>
        <span class="streak-badge">🔥 ${streak}日れんぞく</span>
      </div>
      <div class="level-progress-bar">
        <div class="level-progress-fill" style="width:${progress}%"></div>
      </div>
    `;
  }

  async function playReward() {
    if (!karteNo) { GameReward.start(); return; }
    const coins = streakData?.coins || 0;
    if (coins < REWARD_COST) return;
    try {
      await db.collection('oralFunctionStreaks').doc(karteNo).update({
        coins: firebase.firestore.FieldValue.increment(-REWARD_COST)
      });
      if (streakData) streakData.coins = (streakData.coins || 0) - REWARD_COST;
    } catch (e) {}
    GameReward.start();
  }

  async function toggleDailyCheck(checkId, checked) {
    if (!karteNo) return;
    const today = new Date().toISOString().slice(0, 10);
    const streakRef = db.collection('oralFunctionStreaks').doc(karteNo);
    try {
      const doc = await streakRef.get();
      if (!doc.exists) {
        await streakRef.set({
          currentStreak: 0, longestStreak: 0, totalSessions: 0,
          level: 1, unlockedStage: 1, lastPlayedDate: '', stamps: {},
          coins: 0, dailyChecks: { [today]: { [checkId]: checked } }
        });
      } else {
        const dailyChecks = doc.data().dailyChecks || {};
        if (!dailyChecks[today]) dailyChecks[today] = {};
        dailyChecks[today][checkId] = checked;
        const updateData = { dailyChecks };
        const allDone = ALL_CHECKS.every(c => dailyChecks[today][c.id]);
        const wasAllDone = doc.data().lastDailyCheckComplete === today;
        if (allDone && !wasAllDone) {
          updateData.coins = firebase.firestore.FieldValue.increment(1);
          updateData.lastDailyCheckComplete = today;
        }
        await streakRef.update(updateData);
      }
      await loadStreakData();
      showHome(); // ミッション進捗を再描画
    } catch (e) {
      console.error('チェック保存エラー:', e);
    }
  }

  function stopAllGames() {
    try { if (typeof GameAiube !== 'undefined') GameAiube.cleanup?.(); } catch {}
    try { if (typeof GameBrushing !== 'undefined') GameBrushing.cleanup?.(); } catch {}
    try { if (typeof GameBlowing !== 'undefined') GameBlowing.cleanup?.(); } catch {}
    try { if (typeof GameChewing !== 'undefined') GameChewing.cleanup?.(); } catch {}
  }

  function isGameUnlocked(gameId) {
    const stage = EXERCISE_STAGES.find(s => s.gameId === gameId);
    if (!stage) return true; // クイズ・ご褒美は別制御
    return stage.stage <= getUnlockedStage();
  }

  function openGame(gameId) {
    if (!isGameUnlocked(gameId)) {
      const stage = EXERCISE_STAGES.find(s => s.gameId === gameId);
      showLockedMessage(stage?.stage || 1);
      return;
    }
    stopAllGames();
    currentScreen = gameId;
    switch (gameId) {
      case 'aiube': GameAiube.start(); break;
      case 'brushing': GameBrushing.start(); break;
      case 'blowing': GameBlowing.start(); break;
      case 'tongue': GameTongue.start(); break;
      case 'chewing': GameChewing.start(); break;
      case 'quiz': GameQuiz.start(); break;
    }
  }

  // ===== ゲーム完了時のログ保存 + 連続達成通知 =====
  async function logGameComplete(gameType, score, duration) {
    if (!karteNo) return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      await db.collection('oralFunctionGameLogs').add({
        karteNo, clinicCode,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        dateStr: today, gameType,
        score: score || 0, duration: duration || 0, completed: true,
        // 学会発表用: デバイス・環境データ
        deviceType: /iPad|iPhone/.test(navigator.userAgent) ? 'iOS' : /Android/.test(navigator.userAgent) ? 'Android' : 'PC',
        themeId: Themes.getTheme()?.id || 'none',
        unlockedStage: getUnlockedStage(),
        sessionStreak: streakData?.currentStreak || 0,
      });

      const streakRef = db.collection('oralFunctionStreaks').doc(karteNo);
      const streakDoc = await streakRef.get();

      if (!streakDoc.exists) {
        await streakRef.set({
          currentStreak: 1, longestStreak: 1, totalSessions: 1,
          level: 1, unlockedStage: 1, lastPlayedDate: today,
          stamps: { [today]: [gameType] }, coins: 1
        });
        streakData = (await streakRef.get()).data();
      } else {
        const s = streakDoc.data();
        const lastDate = s.lastPlayedDate || '';
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let newStreak = s.currentStreak || 0;
        if (lastDate === today) { /* same day */ }
        else if (lastDate === yesterday) { newStreak += 1; }
        else { newStreak = 1; }

        const newTotal = (s.totalSessions || 0) + 1;
        const newLevel = Math.floor(newTotal / 10) + 1;
        const stamps = s.stamps || {};
        if (!stamps[today]) stamps[today] = [];
        if (!stamps[today].includes(gameType)) stamps[today].push(gameType);

        const updateData = {
          currentStreak: newStreak,
          longestStreak: Math.max(s.longestStreak || 0, newStreak),
          totalSessions: newTotal, level: newLevel,
          lastPlayedDate: today, stamps,
          coins: firebase.firestore.FieldValue.increment(1)
        };
        await streakRef.update(updateData);
        streakData = { ...s, ...updateData };

        if (newStreak >= STREAK_NOTIFY_DAYS && newStreak !== (s.currentStreak || 0)) {
          await sendStreakAlert(newStreak, s.lastNotifiedStreak || 0);
        }
      }
    } catch (err) {
      console.error('ログ保存エラー:', err);
    }
  }

  async function sendStreakAlert(streak, lastNotified) {
    const notifyAt = Math.floor(streak / STREAK_NOTIFY_DAYS) * STREAK_NOTIFY_DAYS;
    if (notifyAt <= lastNotified) return;
    try {
      await db.collection('patientAlerts').add({
        karteNo, clinicCode, type: 'oral_game_streak', severity: 'info',
        message: `口腔トレーニング ${streak}日連続達成！ステージ解放を検討してください`,
        detail: `現在ステージ${getUnlockedStage()} / 全5ステージ`,
        source: 'oral-fun-kids', resolved: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection('oralFunctionStreaks').doc(karteNo).update({ lastNotifiedStreak: notifyAt });
    } catch (err) {}
  }

  // 完了画面 — 体操完了後は「つぎは はみがきチェック！」へ誘導
  function showComplete(gameType, score) {
    try { Sounds.fanfare(); Voice.complete(); } catch(e) {}
    try { Effects.fullConfetti(); } catch(e) {}
    const app = document.getElementById('app');
    const theme = Themes.getTheme() || {};
    const messages = theme.completeMsg || ['すごい！', 'がんばったね！', 'やったー！', 'かんぺき！'];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const streak = streakData?.currentStreak || 1;
    const isExercise = EXERCISE_STAGES.some(s => s.gameId === gameType);
    const coinIcon = theme.coinIcon || '🪙';

    const streakMsg = streak > 1
      ? `<div class="complete-streak">🔥 ${streak}日れんぞく！</div>`
      : '';

    // Phase 1: 完了演出（2秒後にガチャへ）
    app.innerHTML = `
      <div class="complete-screen">
        <div class="complete-stars">⭐🌟⭐</div>
        <h1 class="complete-title">${msg}</h1>
        <div class="complete-mascot">${theme.mascot || '🦷'}✨</div>
        ${score ? `<p class="complete-score">${score}てん</p>` : ''}
        <div class="complete-stamp">📌 スタンプ + ${coinIcon}</div>
        ${streakMsg}
        <p class="gacha-teaser">カードを ゲットしよう！</p>
      </div>
    `;

    // 2秒後にガチャ演出
    setTimeout(() => {
      const card = Collection.drawCard();
      Collection.showGacha(card, () => {
        // ガチャ後: 次のアクションへ
        showPostComplete(gameType, isExercise);
      });
    }, 2000);
  }

  // ガチャ後の画面
  function showPostComplete(gameType, isExercise) {
    const app = document.getElementById('app');
    const collected = Collection.getCollectedCount();
    const total = CARD_DATA.length;

    let nextAction = '';
    if (isExercise && !getBrushStatus()) {
      nextAction = `<button class="btn-game btn-game-next" onclick="OralApp.showHome()">🪥 つぎは はみがきチェック！</button>`;
    } else if (isExercise) {
      nextAction = `<button class="btn-game btn-game-next" onclick="OralApp.showHome()">🎁 ごほうびタイムへ！</button>`;
    }

    app.innerHTML = `
      <div class="complete-screen">
        <p class="album-teaser">📖 ずかん: ${collected}/${total}まい</p>
        <div class="complete-actions">
          ${nextAction}
          <button class="btn-game btn-game-retry" onclick="OralApp.openGame('${gameType}')">もういっかい（カードもう1まい！）</button>
          <button class="btn-game btn-game-home" onclick="Collection.showAlbum()">📖 ずかんをみる</button>
          <button class="btn-game btn-game-home" onclick="OralApp.showHome()">ホーム</button>
        </div>
      </div>
    `;
  }

  return {
    start, showHome, openGame, logGameComplete, showComplete, showLockedMessage,
    playReward, toggleDailyCheck, toNickname,
    get karteNo() { return karteNo; },
    get clinicCode() { return clinicCode; }
  };
})();

document.addEventListener('DOMContentLoaded', () => OralApp.start());
