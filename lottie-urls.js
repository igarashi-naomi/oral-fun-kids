// Lottieアニメーション URL集（無料・商用利用可能なもの）
// 先生がLottieFilesで見つけた素材のURLをここに追加していく
const LOTTIE_URLS = {
  anim1: 'https://lottie.host/2b92afec-4621-4572-8801-5575d481fd2f/08xrzyS2MG.lottie',
  anim2: 'https://lottie.host/034149c7-5b8a-4b7c-bba2-711efd3bebbd/8j2DzxIuKL.lottie',
  anim3: 'https://lottie.host/39ce6368-75fd-4f7c-805d-6a40f5a4b0c8/UqWaFjT07s.lottie',
  anim4: 'https://lottie.host/5e1cf5a1-ab3f-4f4c-85d1-eb66861d6363/OfHc0BSsWG.lottie',
  anim5: 'https://lottie.host/fd3568fd-3b6e-4ec5-adb9-1c4eb82b5cd4/dt2WtNXwKf.lottie',
  anim6: 'https://lottie.host/90deb97c-6b1f-4a01-b16e-8198176bea29/kDaaQ9EfFA.lottie',
  anim7: 'https://lottie.host/55284571-0dcd-4f70-9636-4e9e462eeeff/wbCMkYIlbT.lottie',
  anim8: 'https://lottie.host/fdde1878-bb54-4d57-9f2d-880f46067153/s7UMjfdTHh.lottie',
  anim9: 'https://lottie.host/6ff693a0-05ec-4577-ba73-1c622a1df7b1/QRuhRoohyV.lottie',
  confetti: 'https://assets2.lottiefiles.com/packages/lf20_u4yrau.json',
};

// Lottieプレイヤーを表示するヘルパー
function showLottie(containerId, url, options = {}) {
  const el = document.getElementById(containerId);
  if (!el || !url) return;
  const width = options.width || 200;
  const height = options.height || 200;
  const loop = options.loop !== false;
  const autoplay = options.autoplay !== false;

  el.innerHTML = `<dotlottie-wc
    src="${url}"
    style="width:${width}px;height:${height}px;margin:0 auto;display:block"
    ${loop ? 'loop' : ''}
    ${autoplay ? 'autoplay' : ''}
  ></dotlottie-wc>`;
}
