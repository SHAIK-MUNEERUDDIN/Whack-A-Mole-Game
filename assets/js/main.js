let scoreH2 = document.getElementById("score");
let timeLeftH2 = document.getElementById("time-left");
let startBtn = document.getElementById("start");
let pauseResumeBtn = document.getElementById("pause");
let grid = document.getElementsByClassName("grid")[0];
let squares = document.querySelectorAll(".square");
let gameMusic = new Audio("../../assets/media/gameMusic.mp3");
let hitMusic = new Audio("../../assets/media/smash.mp3");

let score = 0;
let timeLeft = 60;
let randomMoleId = null;
let timerId = null;
let hitPosition = null;


//this function will place mole at random positions
function randomMole() {
    squares.forEach(square => {
        square.classList.remove("mole");
    })

    var randomSquare = squares[Math.floor(Math.random() * squares.length)];
    randomSquare.classList.add("mole");
    hitPosition = randomSquare.id;
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
        timerId = null;
    }
}
randomMole();



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
    randomMoleId = setInterval(randomMole, 900);

}

function pauseResume() {
    if (pauseResumeBtn.textContent === "Pause") {
        gameMusic.pause();
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
        randomMoleId = setInterval(randomMole, 900);
    }
}


squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if (timerId !== null) {
            if (square.id == hitPosition) {
                square.classList.remove("mole");
                square.classList.add("mole-stunned");
                hitMusic.play();
                setTimeout(() => { hitMusic.pause() }, 500);
                setTimeout(() => { square.classList.remove("mole-stunned"); }, 500);
                score++;
                scoreH2.innerHTML = `Your Score:${score}`;
                hitPosition = null;
            }
            else {
                square.classList.add("mole-laughing");
                setTimeout(() => { square.classList.remove("mole-laughing"); }, 200);
            }
        }
    })
})

startBtn.addEventListener('click', startGame);
pauseResumeBtn.addEventListener('click', pauseResume);