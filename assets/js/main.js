let scoreH2 = document.getElementById("score");
let timeLeftH2 = document.getElementById("time-left");
let startBtn = document.getElementById("start");
let pauseResumeBtn = document.getElementById("pause");
let grid = document.getElementsByClassName("grid")[0];
let squares = document.querySelectorAll(".square");
let gameMusic = new Audio("../../assets/media/gameMusic.mp3");
let hitMusic = new Audio("../../assets/media/smash.mp3");
let pauseMusic = new Audio("../../assets/media/pause.wav");
let mockMusic = new Audio("../../assets/media/mock.wav");
let inputBtn = document.querySelectorAll("input");
let highScore = document.getElementById("high-score");


let score = 0;
let timeLeft = 60;
let randomMoleId = null;
let timerId = null;
let hitPosition = null;
let hitPosition2 = null;


let easy = document.getElementById("easy");
let medium = document.getElementById("medium");
let hard = document.getElementById("hard");
easy.checked = true;

function displayEasyHighScore() {
    let storedScore = localStorage.getItem("Easy-High_Score");
    highScore.innerHTML = storedScore !== null ? storedScore : "0";
    highScore.style.color = "#5de011"
}
displayEasyHighScore();


//this function will place mole at random positions
function randomMole() {
    squares.forEach(square => {
        square.classList.remove("mole");
    })

    var randomSquare = squares[Math.floor(Math.random() * squares.length)];
    randomSquare.classList.add("mole");
    var randomSquare2 = squares[Math.floor(Math.random() * squares.length)];
    randomSquare2.classList.add("mole");
    hitPosition = randomSquare.id;
    hitPosition2 = randomSquare2.id;
}

function countDown() {
    timeLeft--;
    timeLeftH2.innerHTML = `Time Left: ${timeLeft}`;
    if (timeLeft === 0) {
        clearInterval(randomMoleId);
        clearInterval(timerId);
        pauseResumeBtn.style.display = "none"
        grid.style.display = "none";
        gameMusic.pause();
        hitPosition = null;
        hitPosition2 = null;
        timerId = null;


        randomMoleId = easy.checked ? easyScore(score) :
            medium.checked ? mediumScore(score) :
                hard.checked ? hardScore(score) :
                    null;



        // enabling back the difficulty options to chose when game finishes
        inputBtn.forEach(input => {
            input.disabled = false;
        });
    }

}



function startGame() {
    score = 0;
    timeLeft = 60;

    // resetting the time intervals
    clearInterval(timerId);
    clearInterval(randomMoleId);

    scoreH2.innerHTML = "Your Score:0";
    timeLeftH2.innerHTML = "Time Left:60";
    pauseResumeBtn.style.display = "block";
    grid.style.display = "flex";
    pauseResumeBtn.innerHTML = "Pause";
    gameMusic.currentTime = 0;
    gameMusic.play();
    // call back functtion occurs at specified interval
    timerId = setInterval(countDown, 1000);
    randomMoleId = easy.checked ? setInterval(randomMole, 1000) :
        medium.checked ? setInterval(randomMole, 800) :
            hard.checked ? setInterval(randomMole, 500) :
                null;
    inputBtn.forEach(input => {
        input.disabled = true;
    });

}

function pauseResume() {
    if (pauseResumeBtn.textContent === "Pause") {
        gameMusic.pause();
        pauseMusic.play();
        setTimeout(() => {
            pauseMusic.pause();
            pauseMusic.currentTime = 0;
        }, 500);
        clearInterval(timerId);
        clearInterval(randomMoleId);
        timerId = null;
        randomMoleId = null;
        pauseResumeBtn.innerHTML = "Resume";
    }
    else {
        pauseResumeBtn.innerHTML = "Pause";
        gameMusic.play();
        timerId = setInterval(countDown, 1000);
        randomMoleId = easy.checked ? setInterval(randomMole, 1000) :
            medium.checked ? setInterval(randomMole, 800) :
                hard.checked ? setInterval(randomMole, 500) :
                    null;
    }
}


squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if (timerId !== null) {
            if (square.id == hitPosition || square.id == hitPosition2) {
                square.classList.remove("mole");
                square.classList.add("mole-stunned");
                hitMusic.play();

                setTimeout(() => { hitMusic.pause(); hitMusic.currentTime = 0; }, 400);
                setTimeout(() => { square.classList.remove("mole-stunned"); }, 400);
                score++;
                scoreH2.innerHTML = `Your Score:${score}`;
                if (square.id == hitPosition) {
                    hitPosition = null;
                } else if (square.id == hitPosition2) {
                    hitPosition2 = null;
                }
            }
            else {
                square.classList.add("mole-laughing");
                setTimeout(() => { square.classList.remove("mole-laughing"); }, 200);
                mockMusic.play();
                setTimeout(() => {
                    mockMusic.pause();
                    mockMusic.currentTime = 0;
                }, 500);
            }
        }
    })
})


// function scoreStorage() {


// }

function updateScore(score, difficulty) {
    console.log("hello");
    var storedScore = localStorage.getItem(`${difficulty}-High_Score`);
    if (storedScore == null || score > parseInt(storedScore)) {
        highScore.innerHTML = score;
        localStorage.setItem(`${difficulty}-High_Score`, score);
    }
}

function easyScore(score) {
    updateScore(score, "Easy");
}

function mediumScore(score) {
    updateScore(score, "Medium");
}

function hardScore(score) {
    updateScore(score, "Hard");
}


easy.addEventListener("click", displayEasyHighScore);

medium.addEventListener("click", function () {
    let storedScore = localStorage.getItem("Medium-High_Score");
    highScore.innerHTML = storedScore !== null ? storedScore : "0";
    highScore.style.color = "yellow"
});

hard.addEventListener("click", function () {
    let storedScore = localStorage.getItem("Hard-High_Score");
    highScore.innerHTML = storedScore !== null ? storedScore : "0";
    highScore.style.color = "red"
});

startBtn.addEventListener('click', startGame);
pauseResumeBtn.addEventListener('click', pauseResume);

