// ========================================
// じゃんけんグリコ
// ========================================


// ========================================
// ① ゲーム設定
// ========================================

const GOAL_STEP = 46;

const MAX_BOMBS = 3;


// ========================================
// それぞれの手で進む段数
// ========================================

const MOVE = {

    "グー": 3,

    "チョキ": 6,

    "パー": 6

};


// ========================================
// プレイヤーデータ
// ========================================

const players = [

    {

        position: 0,

        bombs: [],

        revealedBombs: [],

        arrivalTurn: null

    },

    {

        position: 0,

        bombs: [],

        revealedBombs: [],

        arrivalTurn: null

    }

];


// ========================================
// ゲーム状態
// ========================================

let setupPlayer = 0;

let currentPlayer = 0;

let bombCount = 0;

let gameStarted = false;

let gameFinished = false;


// ========================================
// ターン管理
// ========================================

let turnCount = 1;


// ========================================
// じゃんけん状態
// ========================================

let selectedHand = null;

let firstPlayer = null;

let secondPlayer = null;


// ========================================
// あいこ管理
// ========================================

let drawCount = 0;

let lastDrawHand = null;


// ========================================
// 結果保存
// ========================================

let resultWinner = null;

let resultPlayer1Hand = null;

let resultPlayer2Hand = null;

let resultProcessed = false;


// ========================================
// 現在表示しているプレイヤー
// ========================================

let viewPlayer = 0;


// ========================================
// HTML要素
// ========================================

const stairs =
    document.querySelector(".stairs");


const bombCountText =
    document.querySelector("#bombCount");


const doneButton =
    document.querySelector("#doneButton");


const restartSetupButton =
    document.querySelector("#restartSetupButton");


const startGameButton =
    document.querySelector("#startGameButton");


const setupMessage =
    document.querySelector("#setupMessage");


const phaseTitle =
    document.querySelector("#phaseTitle");


const instruction =
    document.querySelector("#instruction");


const setupScreen =
    document.querySelector("#setupScreen");


const gameScreen =
    document.querySelector("#gameScreen");


const resultScreen =
    document.querySelector("#resultScreen");


const resultScreenContent =
    document.querySelector("#resultScreenContent");


const showResultButton =
    document.querySelector("#showResultButton");


const nextButton =
    document.querySelector("#nextButton");


const switchToPlayer2Button =
    document.querySelector(
        "#switchToPlayer2Button"
    );


const turnTitle =
    document.querySelector("#turnTitle");


const turnCountDisplay =
    document.querySelector("#turnCountDisplay");


const result =
    document.querySelector("#result");


const player1Position =
    document.querySelector("#player1Position");


const player2Position =
    document.querySelector("#player2Position");


// ========================================
// トップ・ルール画面
// ========================================

const topScreen =
    document.querySelector("#topScreen");


const rulesScreen =
    document.querySelector("#rulesScreen");


const showRulesButton =
    document.querySelector("#showRulesButton");


const backToTopButton =
    document.querySelector("#backToTopButton");


const gameStartButton =
    document.querySelector("#gameStartButton");
    
const backToTopGameButton =
	document.querySelector("#backToTopGameButton");


// ========================================
// ② 階段を作る
// ========================================

for (
    let i = GOAL_STEP;
    i >= 0;
    i--
) {

    const step =
        document.createElement("div");


    step.className =
        "step";


    step.textContent =
        i;


    step.dataset.position =
        i;


    step.addEventListener(
        "click",
        function () {

            // ゲーム開始後は設置不可
            if (gameStarted) {

                return;

            }


            // 0段と46段には設置不可
            if (
                i === 0 ||
                i === GOAL_STEP
            ) {

                return;

            }


            // =================================
            // 自分の地雷をタップ
            // =================================

            if (
                players[setupPlayer]
                    .bombs
                    .includes(i)
            ) {

                removeBomb(
                    i,
                    step
                );

                return;
            }


            // =================================
            // 3個設置済み
            // =================================

            if (
                bombCount >= MAX_BOMBS
            ) {

                return;

            }


            addBomb(
                i,
                step
            );

        }
    );


    stairs.appendChild(
        step
    );

}


// ========================================
// 最初はトップページなので階段を隠す
// ========================================

stairs.style.display =
    "none";
    
backToTopGameButton.style.display =
	"none";


// ========================================
// ③ トップページ
// ========================================


// ========================================
// ルール説明
// ========================================

showRulesButton.addEventListener(
    "click",
    function () {

        topScreen.style.display =
            "none";


        rulesScreen.style.display =
            "block";

    }
);


// ========================================
// トップページへ戻る
// ========================================

backToTopButton.addEventListener(
    "click",
    function () {

        rulesScreen.style.display =
            "none";


        topScreen.style.display =
            "block";

    }
);


// ========================================
// ゲーム開始
// ========================================

gameStartButton.addEventListener(
    "click",
    function () {

        topScreen.style.display =
            "none";


        rulesScreen.style.display =
            "none";


        setupScreen.style.display =
            "block";


        stairs.style.display =
            "block";
            
    	backToTopGameButton.style.display = 
        	"block";


        // =================================
        // ゲーム状態初期化
        // =================================

        setupPlayer = 0;

        bombCount = 0;

        gameStarted = false;

        gameFinished = false;

        currentPlayer = 0;

        turnCount = 1;

        selectedHand = null;

        firstPlayer = null;

        secondPlayer = null;


        // =================================
        // あいこ初期化
        // =================================

        drawCount = 0;

        lastDrawHand = null;


        // =================================
        // 結果初期化
        // =================================

        resultWinner = null;

        resultPlayer1Hand = null;

        resultPlayer2Hand = null;

        resultProcessed = false;


        viewPlayer = 0;


        // =================================
        // プレイヤー情報初期化
        // =================================

        players[0].position = 0;

        players[0].bombs = [];

        players[0].revealedBombs = [];

        players[0].arrivalTurn = null;


        players[1].position = 0;

        players[1].bombs = [];

        players[1].revealedBombs = [];

        players[1].arrivalTurn = null;


        // =================================
        // 階段初期化
        // =================================

        document.querySelectorAll(
            ".step"
        )
        .forEach(
            function (step) {

                const number =
                    getStepNumber(step);


                step.textContent =
                    number;


                step.classList.remove(
                    "bomb"
                );


                step.classList.remove(
                    "player1"
                );


                step.classList.remove(
                    "player2"
                );

            }
        );


        // =================================
        // P1設置画面
        // =================================

        phaseTitle.textContent =
            "プレイヤー1：地雷を3つ設置";


        instruction.textContent =
            "階段をタップして地雷を3か所設置してください。";


        setupMessage.textContent =
            "";


        doneButton.style.display =
            "block";


        doneButton.disabled =
            true;


        restartSetupButton.style.display =
            "none";


        startGameButton.style.display =
            "none";


        updateBombCount();

    }
);


// ========================================
// ④ 地雷設置
// ========================================


// ========================================
// 地雷を置く
// ========================================

function addBomb(
    position,
    step
) {

    players[setupPlayer]
        .bombs
        .push(position);


    step.textContent =
        "💣 " +
        position;


    step.classList.add(
        "bomb"
    );


    bombCount++;


    setupMessage.textContent =
        "";


    updateBombCount();

}


// ========================================
// 地雷を外す
// ========================================

function removeBomb(
    position,
    step
) {

    players[setupPlayer]
        .bombs =
        players[setupPlayer]
            .bombs
            .filter(
                function (number) {

                    return number !==
                        position;

                }
            );


    step.textContent =
        position;


    step.classList.remove(
        "bomb"
    );


    bombCount--;


    updateBombCount();

}


// ========================================
// 地雷数表示
// ========================================

function updateBombCount() {

    bombCountText.textContent =
        bombCount;


    doneButton.disabled =
        bombCount !== MAX_BOMBS;

}


// ========================================
// 設置完了
// ========================================

doneButton.addEventListener(
    "click",
    function () {

        if (
            bombCount !== MAX_BOMBS
        ) {

            return;

        }


        setupMessage.textContent =
            "";


        // =================================
        // P1 → P2
        // =================================

        if (
            setupPlayer === 0
        ) {

            hideCurrentPlayerBombs();


            setupPlayer = 1;


            bombCount = 0;


            updateBombCount();


            phaseTitle.textContent =
                "プレイヤー2：地雷を3つ設置";


            instruction.textContent =
                "階段をタップして地雷を3か所設置してください。";


            return;

        }


        // =================================
        // P2 → 重複チェック
        // =================================

        if (
            setupPlayer === 1
        ) {

            const player1Bombs =
                players[0].bombs;


            const player2Bombs =
                players[1].bombs;


            const hasDuplicate =
                player2Bombs.some(
                    function (position) {

                        return player1Bombs.includes(
                            position
                        );

                    }
                );


            // =================================
            // 重複あり
            // =================================

            if (
                hasDuplicate
            ) {

                setupPlayer = 0;

                bombCount = 0;


                players[0].bombs = [];

                players[0].revealedBombs = [];

                players[1].bombs = [];

                players[1].revealedBombs = [];


                document.querySelectorAll(
                    ".step"
                )
                .forEach(
                    function (step) {

                        const number =
                            getStepNumber(step);


                        step.textContent =
                            number;


                        step.classList.remove(
                            "bomb"
                        );

                    }
                );


                phaseTitle.textContent =
                    "プレイヤー1：地雷を3つ設置";


                instruction.textContent =
                    "地雷が重複したため、最初からやり直してください。";


                setupMessage.textContent =
                    "プレイヤー1とプレイヤー2の地雷が重複しています。";


                doneButton.style.display =
                    "block";


                doneButton.disabled =
                    true;


                restartSetupButton.style.display =
                    "none";


                startGameButton.style.display =
                    "none";


                updateBombCount();


                return;

            }


            // =================================
            // 重複なし
            // =================================

            hideCurrentPlayerBombs();


            setupMessage.textContent =
                "両プレイヤーの地雷設置が完了しました。";


            doneButton.style.display =
                "none";


            restartSetupButton.style.display =
                "block";


            startGameButton.style.display =
                "block";

        }

    }
);


// ========================================
// ゲーム開始ボタン
// ========================================

startGameButton.addEventListener(
    "click",
    function () {

        startGameButton.style.display =
            "none";


        restartSetupButton.style.display =
            "none";


        setupMessage.textContent =
            "";


        startGame();

    }
);


// ========================================
// 再設置
// ========================================

restartSetupButton.addEventListener(
    "click",
    function () {

        players[0].bombs = [];

        players[0].revealedBombs = [];

        players[1].bombs = [];

        players[1].revealedBombs = [];


        setupPlayer = 0;

        bombCount = 0;


        setupMessage.textContent =
            "";


        phaseTitle.textContent =
            "プレイヤー1：地雷を3つ設置";


        instruction.textContent =
            "階段をタップして地雷を3か所設置してください。";


        doneButton.style.display =
            "block";


        restartSetupButton.style.display =
            "none";


        startGameButton.style.display =
            "none";


        updateBombCount();


        document.querySelectorAll(
            ".step"
        )
        .forEach(
            function (step) {

                const number =
                    getStepNumber(step);


                step.textContent =
                    number;


                step.classList.remove(
                    "bomb"
                );

            }
        );

    }
);


// ========================================
// 現在のプレイヤーの地雷を隠す
// ========================================

function hideCurrentPlayerBombs() {

    const bombs =
        players[setupPlayer]
            .bombs;


    document.querySelectorAll(
        ".step"
    )
    .forEach(
        function (step) {

            const number =
                getStepNumber(step);


            if (
                bombs.includes(number)
            ) {

                step.textContent =
                    number;


                step.classList.remove(
                    "bomb"
                );

            }

        }
    );

}


// ========================================
// 段数取得
// ========================================

function getStepNumber(
    step
) {

    return Number(
        step.dataset.position
    );

}


// ========================================
// ⑤ ゲーム開始
// ========================================

function startGame() {

    gameStarted = true;


    setupScreen.style.display =
        "none";


    resultScreen.style.display =
        "none";


    gameScreen.style.display =
        "block";


    currentPlayer = 0;

    turnCount = 1;

    selectedHand = null;

    firstPlayer = null;

    secondPlayer = null;

    drawCount = 0;

    lastDrawHand = null;

    viewPlayer = 0;


    updatePositions();

    updateTurnDisplay();

    updateStairs();


    turnTitle.textContent =
        "プレイヤー1の番";


    result.innerHTML =
        "プレイヤー1からスタート！";

}


// ========================================
// ターン表示
// ========================================

function updateTurnDisplay() {

    turnCountDisplay.textContent =
        turnCount +
        "ターン目";

}


// ========================================
// じゃんけんボタン
// ========================================

document.querySelectorAll(
    ".handButton"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const hand =
                    button.dataset.hand;


                playJanken(hand);

            }
        );

    }
);


// ========================================
// じゃんけん
// ========================================

function playJanken(
    myHand
) {

    if (
        gameFinished
    ) {

        return;

    }


    // =================================
    // 1人目
    // =================================

    if (
        selectedHand === null
    ) {

        selectedHand =
            myHand;


        firstPlayer =
            currentPlayer;


        // =================================
        // P1が選択した場合
        // =================================

        if (
            firstPlayer === 0
        ) {

            resultScreen.style.display =
                "block";


            gameScreen.style.display =
                "none";
            
            stairs.style.display =
            	"none";


            resultScreenContent.innerHTML =
                `
                <h3>
                    プレイヤー1の選択完了
                </h3>

                <p>
                    プレイヤー2に画面を渡してください。
                </p>
                `;


            showResultButton.style.display =
                "none";


            nextButton.style.display =
                "none";


            switchToPlayer2Button.style.display =
                "block";


            return;

        }


        // =================================
        // P2が先の場合
        // =================================

        currentPlayer =
            currentPlayer === 0
                ? 1
                : 0;


        secondPlayer =
            currentPlayer;


        result.innerHTML =
            `
            <strong>
            手を選択しました。
            </strong>
            <br><br>
            プレイヤー${secondPlayer + 1}は
            手を選んでください。
            `;


        turnTitle.textContent =
            `プレイヤー${secondPlayer + 1}の番`;


        return;

    }


    // =================================
    // 2人目
    // =================================

    const secondHand =
        myHand;


    let player1Hand;

    let player2Hand;


    if (
        firstPlayer === 0
    ) {

        player1Hand =
            selectedHand;


        player2Hand =
            secondHand;

    } else {

        player1Hand =
            secondHand;


        player2Hand =
            selectedHand;

    }


    // =================================
    // 勝敗判定
    // =================================

    let winner =
        judgeWinner(
            player1Hand,
            player2Hand
        );


    // =================================
    // あいこ
    // =================================

    if (
        winner === -1
    ) {

        // =================================
        // 同じ手のあいこ
        // =================================

        if (
            lastDrawHand === player1Hand
        ) {

            drawCount++;

        } else {

            drawCount = 1;

            lastDrawHand =
                player1Hand;

        }


        // =================================
        // 共通画面へ
        // =================================

        resultScreen.style.display =
            "block";


        gameScreen.style.display =
            "none";


        resultScreenContent.innerHTML =
            `
            <h3>
                🤝 あいこ！
            </h3>

            <p>
                どちらも進みません。
            </p>

            <p>
                同じ手のあいこ：
                <strong>
                    ${drawCount}回
                </strong>
            </p>
            `;


        // =================================
        // 5回目
        // =================================

        if (
            drawCount >= 5
        ) {

            const drawWinner =
                getDrawWinner();


            resultWinner =
                drawWinner;


            resultPlayer1Hand =
                player1Hand;


            resultPlayer2Hand =
                player2Hand;


            resultProcessed =
                false;


            resultScreenContent.innerHTML +=
                `
                <br>

                <h3>
                    ⚡ 同じ手のあいこ5回！
                </h3>

                <p>
                    より上の段にいる
                    プレイヤーが
                    「${player1Hand}」で勝利します。
                </p>

                <h2>
                    プレイヤー${drawWinner + 1}の勝利！
                </h2>
                `;


            // ここではゲーム終了にしない
            gameFinished = false;


            showResultButton.style.display =
                "block";


            nextButton.style.display =
                "none";


            switchToPlayer2Button.style.display =
                "none";


            // あいこ5回で決まった
            // 勝者の手で実際に進む
            // 結果表示ボタンを押した後に処理する

            return;

        }


        // =================================
        // 通常のあいこ
        // =================================

        selectedHand = null;

        firstPlayer = null;

        secondPlayer = null;


        currentPlayer =
            currentPlayer === 0
                ? 1
                : 0;


        resultProcessed = false;


        showResultButton.style.display =
            "block";


        nextButton.style.display =
            "none";


        switchToPlayer2Button.style.display =
            "none";


        return;

    }


    // =================================
    // あいこではない
    // =================================

    drawCount = 0;

    lastDrawHand = null;


    resultWinner =
        winner;


    resultPlayer1Hand =
        player1Hand;


    resultPlayer2Hand =
        player2Hand;


    resultProcessed =
        false;


    showResultScreen();

}


// ========================================
// P1 → P2
// ========================================

switchToPlayer2Button.addEventListener(
    "click",
    function () {

        switchToPlayer2Button.style.display =
            "none";
            
        stairs.style.display = 
        	"block";


        currentPlayer = 1;


        turnTitle.textContent =
            "プレイヤー2の番";


        result.innerHTML =
            "プレイヤー2の番です。";


        viewPlayer = 1;


        updatePositions();

        updateTurnDisplay();

        updateStairs();


        resultScreen.style.display =
            "none";


        gameScreen.style.display =
            "block";

    }
);


// ========================================
// 勝敗判定
// ========================================

function judgeWinner(
    player1Hand,
    player2Hand
) {

    if (
        player1Hand === player2Hand
    ) {

        return -1;

    }


    if (
        (
            player1Hand === "グー" &&
            player2Hand === "チョキ"
        )
        ||
        (
            player1Hand === "チョキ" &&
            player2Hand === "パー"
        )
        ||
        (
            player1Hand === "パー" &&
            player2Hand === "グー"
        )
    ) {

        return 0;

    }


    return 1;

}


// ========================================
// あいこ5回の勝者
// ========================================

function getDrawWinner() {

    // P1の方が上
    if (
        players[0].position >
        players[1].position
    ) {

        return 0;

    }


    // P2の方が上
    if (
        players[1].position >
        players[0].position
    ) {

        return 1;

    }


    // =================================
    // 同じ段
    // =================================

    if (
        players[0].arrivalTurn !== null &&
        players[1].arrivalTurn !== null
    ) {

        return (
            players[0].arrivalTurn <=
            players[1].arrivalTurn
        )
            ? 0
            : 1;

    }


    if (
        players[0].arrivalTurn !== null
    ) {

        return 0;

    }


    if (
        players[1].arrivalTurn !== null
    ) {

        return 1;

    }


    // =================================
    // まだ到達記録がない場合
    // =================================

    // 両者が同じ段で、
    // まだどちらもその段への到達履歴がない場合。
    // 例：ゲーム開始直後の0段であいこ5連。
    // この場合はP1固定にならないよう公平に決定する。

    return Math.random() < 0.5
        ? 0
        : 1;

}


// ========================================
// ⑥ 結果・移動・爆発
// ========================================


// ========================================
// 結果画面
// ========================================

function showResultScreen() {

    gameScreen.style.display =
        "none";
        
    stairs.style.display = 
    	"none";


    resultScreen.style.display =
        "block";


    // =================================
    // 手はここでは表示しない
    // =================================

    resultScreenContent.innerHTML =
        `
        <p>
            両者の手が決まりました。
        </p>

        <p>
            「結果を表示」を押してください。
        </p>
        `;


    showResultButton.style.display =
        "block";


    nextButton.style.display =
        "none";


    switchToPlayer2Button.style.display =
        "none";


    nextButton.disabled =
        true;


    // =================================
    // 結果画面では地雷を完全に隠す
    // =================================

    document.querySelectorAll(
        ".step"
    )
    .forEach(
        function (step) {

            const number =
                getStepNumber(step);


            step.classList.remove(
                "bomb"
            );


            step.textContent =
                number;

        }
    );

}


// ========================================
// 結果を表示
// ========================================

showResultButton.addEventListener(
    "click",
    function () {

        if (
            resultProcessed
        ) {

            return;

        }


        resultProcessed =
            true;


        processResult();

    }
);


// ========================================
// 結果処理
// ========================================

async function processResult() {

    showResultButton.style.display =
        "none";


    nextButton.disabled =
        true;


    const winner =
        resultWinner;


    const winnerName =
        winner === 0
            ? "プレイヤー1"
            : "プレイヤー2";


    const winnerHand =
        winner === 0
            ? resultPlayer1Hand
            : resultPlayer2Hand;


    const move =
        MOVE[winnerHand];


    const oldPosition =
        players[winner]
            .position;


    // =================================
    // 通常移動
    // =================================

    players[winner]
        .position =
        Math.min(
            GOAL_STEP,
            oldPosition + move
        );


    const landedPosition =
        players[winner]
            .position;


    const enemyPlayer =
        winner === 0
            ? 1
            : 0;


    // =================================
    // 結果表示
    // =================================

    resultScreenContent.innerHTML =
        `
        <p>
            プレイヤー1：
            ${resultPlayer1Hand}
        </p>

        <p>
            プレイヤー2：
            ${resultPlayer2Hand}
        </p>

        <br>

        <h3>
            🎉 ${winnerName}の勝ち！
        </h3>

        <p>
            ${winnerName}が
            ${move}段進みました。
        </p>

        <h2>
            ${oldPosition}段
            →
            ${landedPosition}段
        </h2>
        `;


    updatePositions();

    updateStairs();


    // =================================
    // 自分の地雷
    // =================================

    const ownBomb =
        players[winner]
            .bombs
            .includes(
                landedPosition
            );


    if (
        ownBomb
    ) {

        if (
            !players[winner]
                .revealedBombs
                .includes(
                    landedPosition
                )
        ) {

            players[winner]
                .revealedBombs
                .push(
                    landedPosition
                );

        }


        resultScreenContent.innerHTML +=
            `
            <br>

            💣 ${landedPosition}段の地雷を踏みました！

            <br>

            自分の地雷なので爆発しません。
            `;

    }


    // =================================
    // 相手の地雷
    // =================================

    let currentBombPosition =
        players[winner]
            .position;


    while (
        players[enemyPlayer]
            .bombs
            .includes(
                currentBombPosition
            )
    ) {

        const bombPosition =
            currentBombPosition;


        await wait(3000);


        showExplosion();


        await wait(2000);


        hideExplosion();


        // =================================
        // 地雷を公開
        // =================================

        if (
            !players[enemyPlayer]
                .revealedBombs
                .includes(
                    bombPosition
                )
        ) {

            players[enemyPlayer]
                .revealedBombs
                .push(
                    bombPosition
                );

        }


        // =================================
        // 地雷消滅
        // =================================

        players[enemyPlayer]
            .bombs =
            players[enemyPlayer]
                .bombs
                .filter(
                    function (number) {

                        return number !==
                            bombPosition;

                    }
                );


        // =================================
        // 爆発前
        // =================================

        const bombOldPosition =
            players[winner]
                .position;


        // =================================
        // 10段下がる
        // =================================

        players[winner]
            .position =
            Math.max(
                0,
                players[winner]
                    .position - 10
            );


        // =================================
        // 爆発後
        // =================================

        const bombNewPosition =
            players[winner]
                .position;


        updatePositions();

        updateStairs();


        resultScreenContent.innerHTML +=
            `
            <br>

            💣 ${bombPosition}段の地雷が爆発！

            <br>

            10段下がります。

            <br>

            <strong>
            ${bombOldPosition}段
            →
            ${bombNewPosition}段
            </strong>
            `;


        currentBombPosition =
            players[winner]
                .position;

    }


    // =================================
    // ゴール判定
    // =================================

    if (
        players[winner]
            .position >=
        GOAL_STEP
    ) {

        if (
            players[winner]
                .arrivalTurn === null
        ) {

            players[winner]
                .arrivalTurn =
                turnCount;

        }


        nextButton.style.display =
            "none";


        nextButton.disabled =
            true;


        await wait(1000);


        finishGame(winner);


        return;

    }


    // =================================
    // あいこ5回の場合
    // =================================

    if (
        drawCount >= 5
    ) {

        // あいこ5回の決着は終了ではなく、
        // その手で1回進んだ後に通常ゲームへ戻る

        drawCount = 0;

        lastDrawHand = null;


        selectedHand = null;

        firstPlayer = null;

        secondPlayer = null;


        // 勝者を記録
        currentPlayer =
            winner;


        // 次のターンへ
        nextButton.style.display =
            "block";


        nextButton.disabled =
            false;


        resultScreenContent.innerHTML +=
            `
            <br>

            <p>
                あいこ5回の決着処理が完了しました。
            </p>

            <p>
                次のターンへ進みます。
            </p>
            `;


        return;

    }


    // =================================
    // 通常終了
    // =================================

    nextButton.style.display =
        "block";


    nextButton.disabled =
        false;

}


// ========================================
// 待機
// ========================================

function wait(
    milliseconds
) {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


// ========================================
// 爆発演出
// ========================================

function showExplosion() {

    let explosion =
        document.querySelector(
            "#explosionEffect"
        );


    if (
        !explosion
    ) {

        explosion =
            document.createElement(
                "div"
            );


        explosion.id =
            "explosionEffect";


        explosion.innerHTML =
            `
            <div class="explosionEmoji">
                💥
            </div>

            <div class="explosionText">
                💣 地雷爆発！
            </div>
            `;


        document.body.appendChild(
            explosion
        );

    }


    explosion.style.display =
        "flex";

}


// ========================================
// 爆発演出を消す
// ========================================

function hideExplosion() {

    const explosion =
        document.querySelector(
            "#explosionEffect"
        );


    if (
        explosion
    ) {

        explosion.style.display =
            "none";

    }

}


// ========================================
// ⑦ 次へ・階段・ゲーム終了
// ========================================


// ========================================
// 次に進む
// ========================================

nextButton.addEventListener(
    "click",
    function () {

        if (
            nextButton.disabled
        ) {

            return;

        }


        // =================================
        // ゴール済み
        // =================================

        if (
            resultWinner !== null &&
            players[resultWinner]
                .position >=
            GOAL_STEP
        ) {

            finishGame(
                resultWinner
            );

            return;

        }


        // =================================
        // 次のプレイヤー
        // =================================

        currentPlayer =
            currentPlayer === 0
                ? 1
                : 0;


        // =================================
        // ターン更新
        // =================================

        if (
            currentPlayer === 0
        ) {

            turnCount++;

        }


        updateTurnDisplay();


        // =================================
        // じゃんけん状態リセット
        // =================================

        selectedHand = null;

        firstPlayer = null;

        secondPlayer = null;

        resultProcessed = false;


        resultWinner = null;

        resultPlayer1Hand = null;

        resultPlayer2Hand = null;


        nextButton.disabled =
            true;


        resultScreen.style.display =
            "none";


        gameScreen.style.display =
            "block";
            
        stairs.style.display = 
        	"block";


        turnTitle.textContent =
            `プレイヤー${currentPlayer + 1}の番`;


        result.innerHTML =
            `
            プレイヤー${currentPlayer + 1}の番です。
            `;


        viewPlayer =
            currentPlayer;


        updatePositions();

        updateStairs();

    }
);


// ========================================
// プレイヤー位置
// ========================================

function updatePositions() {

    player1Position.textContent =
        players[0]
            .position;


    player2Position.textContent =
        players[1]
            .position;

}


// ========================================
// 階段表示
// ========================================

function updateStairs() {

    document.querySelectorAll(
        ".step"
    )
    .forEach(
        function (step) {

            const number =
                getStepNumber(step);


            step.classList.remove(
                "player1"
            );


            step.classList.remove(
                "player2"
            );


            step.classList.remove(
                "bomb"
            );


            // =================================
            // 自分の地雷
            // =================================

            const ownBomb =
                players[viewPlayer]
                    .bombs
                    .includes(
                        number
                    );


            // =================================
            // 相手
            // =================================

            const enemyPlayer =
                viewPlayer === 0
                    ? 1
                    : 0;


            // =================================
            // 公開済み相手地雷
            // =================================

            const revealedBomb =
                players[enemyPlayer]
                    .revealedBombs
                    .includes(
                        number
                    );


            // =================================
            // 地雷表示
            // =================================

            if (
                ownBomb ||
                revealedBomb
            ) {

                step.textContent =
                    "💣 " +
                    number;


                step.classList.add(
                    "bomb"
                );

            } else {

                step.textContent =
                    number

            }


            // =================================
            // P1
            // =================================

            if (
                players[0]
                    .position ===
                number
            ) {

                step.classList.add(
                    "player1"
                );

            }


            // =================================
            // P2
            // =================================

            if (
                players[1]
                    .position ===
                number
            ) {

                step.classList.add(
                    "player2"
                );

            }

        }
    );

}


// ========================================
// プレイヤー視点
// ========================================

function showPlayerView(
    player
) {

    viewPlayer =
        player;


    updateStairs();

}


// ========================================
// P1視点
// ========================================

function showPlayer1View() {

    viewPlayer = 0;


    updateStairs();

}


// ========================================
// P2視点
// ========================================

function showPlayer2View() {

    viewPlayer = 1;


    updateStairs();

}


// ========================================
// 現在プレイヤー視点
// ========================================

function showCurrentPlayerView() {

    viewPlayer =
        currentPlayer;


    updateStairs();

}


// ========================================
// ゲーム終了
// ========================================

function finishGame(
    winner
) {

    gameFinished = true;


    const winnerName =
        winner === 0
            ? "プレイヤー1"
            : "プレイヤー2";


    resultScreenContent.innerHTML =
        `
        <h2>
            🏆 ゲーム終了
        </h2>

        <br>

        <h3>
            🎉 ${winnerName}の勝利！
        </h3>

        <br>

        ${winnerName}が
        46段目（ゴール）に到達しました！
        `;


    showResultButton.style.display =
        "none";


    nextButton.style.display =
        "none";


    switchToPlayer2Button.style.display =
        "none";


    nextButton.disabled =
        true;


    gameScreen.style.display =
        "none";


    resultScreen.style.display =
        "block";


    document.querySelectorAll(
        ".handButton"
    )
    .forEach(
        function (button) {

            button.disabled =
                true;

        }
    );
    
    // ========================================
// タイトルへ戻る
// ========================================

backToTopGameButton.addEventListener(
    "click",
    function () {

        // ゲーム状態を終了
        gameStarted = false;

        gameFinished = true;


        // タイトル画面を表示
        topScreen.style.display =
            "block";


        // その他の画面を非表示
        rulesScreen.style.display =
            "none";

        setupScreen.style.display =
            "none";

        gameScreen.style.display =
            "none";

        resultScreen.style.display =
            "none";


        // 階段を非表示
        stairs.style.display =
            "none";


        // タイトルへ戻るボタンを非表示
        backToTopGameButton.style.display =
            "none";


        // =================================
        // ゲーム状態リセット
        // =================================

        setupPlayer = 0;

        currentPlayer = 0;

        bombCount = 0;

        turnCount = 1;

        selectedHand = null;

        firstPlayer = null;

        secondPlayer = null;

        drawCount = 0;

        lastDrawHand = null;

        resultWinner = null;

        resultPlayer1Hand = null;

        resultPlayer2Hand = null;

        resultProcessed = false;

        viewPlayer = 0;


        // =================================
        // プレイヤー情報リセット
        // =================================

        players[0].position = 0;
        players[0].bombs = [];
        players[0].revealedBombs = [];
        players[0].arrivalTurn = null;


        players[1].position = 0;
        players[1].bombs = [];
        players[1].revealedBombs = [];
        players[1].arrivalTurn = null;


        // =================================
        // 階段を初期状態に戻す
        // =================================

        document.querySelectorAll(
            ".step"
        )
        .forEach(
            function (step) {

                const number =
                    getStepNumber(step);


                step.textContent =
                    number;


                step.classList.remove(
                    "bomb"
                );

                step.classList.remove(
                    "player1"
                );

                step.classList.remove(
                    "player2"
                );

            }
        );


        updateBombCount();

    }
);

}