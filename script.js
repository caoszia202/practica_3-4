const canvas = document.getElementById("gameCanvas");

canvas.width = window.innerWidth * 0.95;
canvas.height = 700;

const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

let gameStarted = false;
let gameOver = false;
let score = 0;

let pipeSpeed = 3;

const bird = {
    x: 90,
    y: 250,
    width: 35,
    height: 35,
    velocity: 0,
    gravity: 0.5,
    jump: -8
};

const pipes = [];

const pipeWidth = 70;
const pipeGap = 180;

function drawCloud(x,y){

    ctx.fillStyle="white";

    ctx.beginPath();
    ctx.arc(x,y,20,0,Math.PI*2);
    ctx.arc(x+20,y-10,25,0,Math.PI*2);
    ctx.arc(x+50,y,20,0,Math.PI*2);

    ctx.fill();
}

function drawBackground(){

    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );

    gradient.addColorStop(0,"#6ec6ff");
    gradient.addColorStop(1,"#ccefff");

    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="#FFD700";

    ctx.beginPath();
    ctx.arc(320,80,40,0,Math.PI*2);
    ctx.fill();

    drawCloud(50,80);
    drawCloud(220,140);
    drawCloud(130,220);

    ctx.fillStyle="#4CAF50";

    ctx.beginPath();
    ctx.moveTo(0,500);
    ctx.lineTo(100,320);
    ctx.lineTo(200,500);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(120,500);
    ctx.lineTo(250,260);
    ctx.lineTo(400,500);
    ctx.fill();

    ctx.fillStyle="#2ecc71";
    ctx.fillRect(0,560,canvas.width,40);
}

function drawBird(){

    ctx.fillStyle="#FFD700";

    ctx.beginPath();
    ctx.arc(
        bird.x+bird.width/2,
        bird.y+bird.height/2,
        bird.width/2,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle="#ffb703";

    ctx.beginPath();
    ctx.ellipse(
        bird.x+14,
        bird.y+20,
        10,
        7,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle="white";

    ctx.beginPath();
    ctx.arc(
        bird.x+24,
        bird.y+12,
        6,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle="black";

    ctx.beginPath();
    ctx.arc(
        bird.x+25,
        bird.y+12,
        2,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle="orange";

    ctx.beginPath();

    ctx.moveTo(bird.x+33,bird.y+18);
    ctx.lineTo(bird.x+45,bird.y+15);
    ctx.lineTo(bird.x+33,bird.y+10);

    ctx.fill();
}

function createPipe(){

    const topHeight =
    Math.floor(
        Math.random() *
        (canvas.height - pipeGap - 180)
    ) + 60;

    pipes.push({
        x:canvas.width,
        topHeight:topHeight,
        bottomY:topHeight + pipeGap,
        passed:false
    });
}

function drawPipes(){

    pipes.forEach(pipe=>{

        const gradient = ctx.createLinearGradient(
            pipe.x,
            0,
            pipe.x+pipeWidth,
            0
        );

        gradient.addColorStop(0,"#2ecc71");
        gradient.addColorStop(1,"#1e8449");

        ctx.fillStyle=gradient;

        ctx.fillRect(
            pipe.x,
            0,
            pipeWidth,
            pipe.topHeight
        );

        ctx.fillRect(
            pipe.x,
            pipe.bottomY,
            pipeWidth,
            canvas.height-pipe.bottomY
        );

        ctx.fillStyle="#145A32";

        ctx.fillRect(
            pipe.x-5,
            pipe.topHeight-20,
            pipeWidth+10,
            20
        );

        ctx.fillRect(
            pipe.x-5,
            pipe.bottomY,
            pipeWidth+10,
            20
        );
    });
}

function drawScore(){

    ctx.font="bold 32px Arial";

    ctx.lineWidth=4;

    ctx.strokeStyle="black";
    ctx.strokeText("SCORE: "+score,15,45);

    ctx.fillStyle="white";
    ctx.fillText("SCORE: "+score,15,45);
}

function updateBird(){

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}

function updatePipes(){

    pipes.forEach(pipe=>{

        pipe.x -= pipeSpeed;

        if(
            !pipe.passed &&
            pipe.x + pipeWidth < bird.x
        ){
            score++;
            pipe.passed=true;
        }

        if(
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (
                bird.y < pipe.topHeight ||
                bird.y + bird.height > pipe.bottomY
            )
        ){
            endGame();
        }
    });

    if(score > 5) pipeSpeed = 4;
    if(score > 10) pipeSpeed = 5;
    if(score > 20) pipeSpeed = 6;

    while(
        pipes.length &&
        pipes[0].x + pipeWidth < 0
    ){
        pipes.shift();
    }
}

function checkBounds(){

    if(
        bird.y < 0 ||
        bird.y + bird.height > canvas.height
    ){
        endGame();
    }
}

function gameLoop(){

    if(!gameStarted || gameOver) return;

    drawBackground();

    updateBird();
    updatePipes();
    checkBounds();

    drawPipes();
    drawBird();
    drawScore();

    requestAnimationFrame(gameLoop);
}

function flap(){

    if(!gameStarted){
        startGame();
    }

    if(!gameOver){
        bird.velocity = bird.jump;
    }
}

function startGame(){

    gameStarted=true;

    startScreen.classList.add("hidden");

    setInterval(()=>{

        if(!gameOver){
            createPipe();
        }

    },1800);

    gameLoop();
}

function endGame(){

    gameOver=true;

    finalScore.innerHTML =
    "Puntaje Final: <b>" + score + "</b>";

    gameOverScreen.classList.remove("hidden");
}

function restartGame(){
    location.reload();
}

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){
        flap();
    }

});

canvas.addEventListener("click",flap);
canvas.addEventListener("touchstart",flap);

restartBtn.addEventListener(
    "click",
    restartGame
);