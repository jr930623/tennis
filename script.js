const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const player = {
    x: 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 0
};

const computer = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 2
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 3,
    dy: 3
};

let playerScore = 0;
let computerScore = 0;
let gameRunning = true;

const difficultySelect = document.getElementById('difficultySelect');
difficultySelect.addEventListener('change', setDifficulty);

function setDifficulty() {
    const difficulty = difficultySelect.value;
    switch(difficulty) {
        case 'easy':
            computer.dy = 2;
            ball.dx = 3;
            ball.dy = 3;
            break;
        case 'medium':
            computer.dy = 4;
            ball.dx = 4;
            ball.dy = 4;
            break;
        case 'hard':
            computer.dy = 6;
            ball.dx = 6;
            ball.dy = 6;
            break;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        player.dy = -4;
    } else if (e.key === 'ArrowDown') {
        player.dy = 4;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        player.dy = 0;
    }
});

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function update() {
    if (!gameRunning) return;

    // Mover jugador
    player.y += player.dy;

    // Limitar movimiento del jugador
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    // Mover computadora
    computer.y += computer.dy;
    if (computer.y < 0 || computer.y + computer.height > canvas.height) {
        computer.dy *= -1;
    }

    // Mover pelota
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisiones con paredes superiores e inferiores
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Colisiones con paletas
    if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) {
        ball.dx *= -1;
    } else if (ball.x + ball.radius > computer.x && ball.y > computer.y && ball.y < computer.y + computer.height) {
        ball.dx *= -1;
    }

    // Verificar si la pelota sale del canvas
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Actualizar marcador
    document.getElementById('playerScore').textContent = `Jugador: ${playerScore}`;
    document.getElementById('computerScore').textContent = `Computadora: ${computerScore}`;

    // Verificar si alguien ha ganado
    if (playerScore >= 5 || computerScore >= 5) {
        gameRunning = false;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('winnerMessage').textContent = playerScore >= 5 ? '¡Jugador gana!' : '¡Computadora gana!';
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player.x, player.y, player.width, player.height, '#fff');
    drawRect(computer.x, computer.y, computer.width, computer.height, '#fff');
    drawBall(ball.x, ball.y, ball.radius, '#fff');
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

setDifficulty(); // Establecer dificultad inicial
gameLoop();
