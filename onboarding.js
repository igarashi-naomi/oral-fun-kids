// 保護者向け説明ページ（初回アクセス時に表示）
const Onboarding = (() => {

  function shouldShow() {
    return !localStorage.getItem('oralFunOnboarded');
  }

  function markDone() {
    localStorage.setItem('oralFunOnboarded', '1');
  }

  function show(onComplete) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="onboard-screen">
        <div class="onboard-page" id="onboard-page">

          <!-- ページ1: ようこそ -->
          <div class="onboard-slide onboard-active" data-page="1">
            <div class="onboard-icon">🦷✨</div>
            <h1 class="onboard-title">ようこそ！<br>「おくちのぼうけん」へ</h1>
            <p class="onboard-text">
              このアプリは、おくちの きんにくを きたえる<br>
              トレーニングゲームです。
            </p>
            <div class="onboard-badge">🏥 いがらし歯科 おすすめ</div>
          </div>

          <!-- ページ2: 保護者の方へ -->
          <div class="onboard-slide" data-page="2" style="display:none">
            <div class="onboard-icon">👨‍👩‍👧</div>
            <h2 class="onboard-title">保護者の方へ</h2>
            <div class="onboard-info-card">
              <h3>🎯 このアプリの目的</h3>
              <ul>
                <li><strong>口腔機能発達不全症</strong>の改善・予防のための<br>MFTトレーニング（口腔筋機能療法）</li>
                <li>毎日の<strong>歯みがき習慣</strong>の定着</li>
                <li>歯や口の<strong>知識</strong>を楽しく学ぶ</li>
              </ul>
            </div>
            <div class="onboard-info-card">
              <h3>📋 使い方</h3>
              <ul>
                <li>毎日 <strong>① 体操 → ② 歯みがきチェック → ③ ごほうび</strong> の順にすすめます</li>
                <li>体操を続けると担当衛生士に連絡がいき、<strong>新しいゲームが解放</strong>されます</li>
                <li>定期健診のカウントダウンも表示されます</li>
              </ul>
            </div>
          </div>

          <!-- ページ3: 安心・安全 -->
          <div class="onboard-slide" data-page="3" style="display:none">
            <div class="onboard-icon">🔒</div>
            <h2 class="onboard-title">安心してお使いください</h2>
            <div class="onboard-info-card">
              <ul>
                <li>🔒 <strong>個人情報</strong>はカルテ番号のみで管理。氏名はアプリに保存されません</li>
                <li>📱 <strong>広告なし</strong>・課金なし・完全無料</li>
                <li>🎤 ふーふーゲームでマイクを使いますが、<strong>録音・保存はしません</strong></li>
                <li>📊 トレーニング記録は<strong>担当衛生士が確認</strong>して次回の指導に活かします</li>
                <li>🔐 保護者モードは暗証番号（初期: 1234）で切替できます</li>
              </ul>
            </div>
          </div>

          <!-- ページ4: はじめよう -->
          <div class="onboard-slide" data-page="4" style="display:none">
            <div class="onboard-icon">🚀</div>
            <h2 class="onboard-title">さあ、はじめよう！</h2>
            <p class="onboard-text">
              まず、すきな<strong>テーマ</strong>をえらんでね！<br>
              まいにちの たいそうで おくちを つよくしよう！
            </p>
            <div class="onboard-mascot">🦷💪</div>
          </div>

        </div>

        <!-- ナビゲーション -->
        <div class="onboard-nav">
          <div class="onboard-dots" id="onboard-dots">
            <span class="onboard-dot active"></span>
            <span class="onboard-dot"></span>
            <span class="onboard-dot"></span>
            <span class="onboard-dot"></span>
          </div>
          <div class="onboard-buttons">
            <button class="btn-game btn-game-home" id="onboard-skip" onclick="Onboarding.finish()">スキップ</button>
            <button class="btn-game btn-game-next" id="onboard-next" onclick="Onboarding.next()">つぎへ →</button>
          </div>
        </div>
      </div>
    `;
    Onboarding._page = 1;
    Onboarding._onComplete = onComplete;
  }

  function next() {
    const current = Onboarding._page;
    if (current >= 4) {
      finish();
      return;
    }
    // 現在ページを非表示
    const currentSlide = document.querySelector(`.onboard-slide[data-page="${current}"]`);
    const nextSlide = document.querySelector(`.onboard-slide[data-page="${current + 1}"]`);
    if (currentSlide) currentSlide.style.display = 'none';
    if (nextSlide) { nextSlide.style.display = ''; nextSlide.classList.add('onboard-active'); }

    Onboarding._page = current + 1;

    // ドット更新
    document.querySelectorAll('.onboard-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current); // 0-indexed
    });

    // 最終ページでボタン変更
    if (Onboarding._page >= 4) {
      document.getElementById('onboard-next').textContent = 'はじめる！🎉';
      document.getElementById('onboard-skip').style.display = 'none';
    }
  }

  function finish() {
    markDone();
    if (Onboarding._onComplete) Onboarding._onComplete();
  }

  return { shouldShow, show, next, finish, _page: 1, _onComplete: null };
})();
