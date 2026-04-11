// ご褒美ゲーム（オセロ・簡易版）— トークンで遊べる
const GameReward = (() => {
  // === オセロ盤面 ===
  const SIZE = 6; // 6x6（子供向けに小さめ）
  let board = [];
  let currentPlayer = 1; // 1=黒（子供）, 2=白（コンピュータ）
  let gameOver = false;
  let startTime = 0;

  function start() {
    startTime = Date.now();
    gameOver = false;
    currentPlayer = 1;
    initBoard();
    render();
  }

  function initBoard() {
    board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
    const m = SIZE / 2;
    board[m - 1][m - 1] = 2;
    board[m - 1][m] = 1;
    board[m][m - 1] = 1;
    board[m][m] = 2;
  }

  // 方向ベクトル
  const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  function isValid(r, c, player) {
    if (board[r][c] !== 0) return false;
    const opp = player === 1 ? 2 : 1;
    for (const [dr, dc] of DIRS) {
      let nr = r + dr, nc = c + dc, count = 0;
      while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === opp) {
        nr += dr; nc += dc; count++;
      }
      if (count > 0 && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === player) {
        return true;
      }
    }
    return false;
  }

  function placePiece(r, c, player) {
    if (!isValid(r, c, player)) return false;
    board[r][c] = player;
    const opp = player === 1 ? 2 : 1;
    for (const [dr, dc] of DIRS) {
      let nr = r + dr, nc = c + dc;
      const toFlip = [];
      while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === opp) {
        toFlip.push([nr, nc]);
        nr += dr; nc += dc;
      }
      if (toFlip.length > 0 && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === player) {
        toFlip.forEach(([fr, fc]) => { board[fr][fc] = player; });
      }
    }
    return true;
  }

  function getValidMoves(player) {
    const moves = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (isValid(r, c, player)) moves.push([r, c]);
      }
    }
    return moves;
  }

  function countPieces() {
    let black = 0, white = 0;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 1) black++;
      else if (board[r][c] === 2) white++;
    }
    return { black, white };
  }

  // コンピュータの手（角優先→辺→ランダム）
  function computerMove() {
    const moves = getValidMoves(2);
    if (moves.length === 0) return false;

    // 角を優先
    const corners = moves.filter(([r, c]) => (r === 0 || r === SIZE - 1) && (c === 0 || c === SIZE - 1));
    if (corners.length > 0) {
      const [r, c] = corners[Math.floor(Math.random() * corners.length)];
      placePiece(r, c, 2);
      return true;
    }
    // 辺を優先
    const edges = moves.filter(([r, c]) => r === 0 || r === SIZE - 1 || c === 0 || c === SIZE - 1);
    if (edges.length > 0) {
      const [r, c] = edges[Math.floor(Math.random() * edges.length)];
      placePiece(r, c, 2);
      return true;
    }
    // ランダム
    const [r, c] = moves[Math.floor(Math.random() * moves.length)];
    placePiece(r, c, 2);
    return true;
  }

  function onCellClick(r, c) {
    if (gameOver || currentPlayer !== 1) return;
    if (!placePiece(r, c, 1)) return;

    // コンピュータのターン
    currentPlayer = 2;
    render();

    setTimeout(() => {
      const compMoves = getValidMoves(2);
      if (compMoves.length > 0) {
        computerMove();
      }
      currentPlayer = 1;

      // 両方パスならゲーム終了
      const myMoves = getValidMoves(1);
      if (myMoves.length === 0 && getValidMoves(2).length === 0) {
        gameOver = true;
        showResult();
        return;
      }
      // 自分がパスならもう一度コンピュータ
      if (myMoves.length === 0) {
        currentPlayer = 2;
        render();
        setTimeout(() => {
          computerMove();
          currentPlayer = 1;
          render();
        }, 500);
        return;
      }

      render();
    }, 600);
  }

  function render() {
    const app = document.getElementById('app');
    const { black, white } = countPieces();
    const validMoves = currentPlayer === 1 ? getValidMoves(1) : [];
    const validSet = new Set(validMoves.map(([r, c]) => `${r},${c}`));

    let boardHtml = '<div class="othello-board">';
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = board[r][c];
        const canPlace = validSet.has(`${r},${c}`);
        const cellClass = canPlace ? 'othello-cell othello-hint' : 'othello-cell';
        let piece = '';
        if (v === 1) piece = '<div class="othello-piece othello-black">●</div>';
        else if (v === 2) piece = '<div class="othello-piece othello-white">○</div>';

        boardHtml += `<div class="${cellClass}" onclick="GameReward.onCellClick(${r},${c})">${piece}</div>`;
      }
    }
    boardHtml += '</div>';

    app.innerHTML = `
      <div class="game-screen reward-screen">
        <div class="game-top-bar">
          <button class="btn-back-game" onclick="GameReward.quit()">◀ やめる</button>
          <span class="game-progress">🎁 ごほうびオセロ</span>
        </div>
        <div class="othello-score">
          <span class="othello-score-black ${currentPlayer === 1 ? 'othello-active' : ''}">● きみ: ${black}</span>
          <span class="othello-score-white ${currentPlayer === 2 ? 'othello-active' : ''}">○ コンピュータ: ${white}</span>
        </div>
        ${boardHtml}
        <p class="othello-hint-text">${currentPlayer === 1 ? 'きみのばんだよ！あかるいマスにおけるよ' : 'コンピュータがかんがえてるよ...'}</p>
      </div>
    `;
  }

  function showResult() {
    const { black, white } = countPieces();
    const app = document.getElementById('app');
    const won = black > white;
    const draw = black === white;

    app.innerHTML = `
      <div class="complete-screen">
        <div class="complete-stars">${won ? '🏆🎉🏆' : draw ? '🤝' : '😢'}</div>
        <h1 class="complete-title">${won ? 'かったね！すごい！' : draw ? 'ひきわけ！' : 'ざんねん…つぎはかとう！'}</h1>
        <div class="othello-final-score">
          <span>● きみ: ${black}</span> vs <span>○ コンピュータ: ${white}</span>
        </div>
        <div class="complete-actions">
          <button class="btn-game btn-game-home" onclick="OralApp.showHome()">ホームにもどる</button>
        </div>
      </div>
    `;
  }

  function quit() {
    OralApp.showHome();
  }

  return { start, onCellClick, quit };
})();
