// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas boyutları
canvas.width = 320;
canvas.height = 480;

// Game variables
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlapStrength = -6;
let gravity = 0.25;
let birdWidth = 50;
let birdHeight = 50;
let birdX = 50;
let isGameOver = false;
let pipes = [];
let pipeWidth = 50;
let pipeGap = 200; // Boru boşluğunu artırdık (200)
let pipeSpeed = 2;
let score = 0;
let passedPipes = 0; // Geçilen boru sayısını takip et

// Arka plan müziği
const backgroundMusic = document.getElementById('backgroundMusic');

// Load the bird image
let birdImage = new Image();
birdImage.src = 'görsel/bird.png'; // Kuş görseli (bird.png)

// Event listeners for click events
canvas.addEventListener('click', flap); // Masaüstü için click

// Flap function (kuşu zıplatma)
function flap(event) {
    if (isGameOver) return;
    birdVelocity = birdFlapStrength;
}

// Game loop
function gameLoop() {
    if (isGameOver) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update bird position
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Draw bird (use the image instead of the rectangle)
    ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

    // Check for bird collision with ground
    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight;
        birdVelocity = 0;
        isGameOver = true;
        gameOver();
    }

    // Update and draw pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // Boru geçişi kontrolü ve puan ekleme
        if (pipe.x + pipeWidth < birdX && !pipe.passed) {
            score++; // Borudan geçince skoru arttır
            pipe.passed = true; // Bu boruyu geçtiğimizi işaretle
        }

        // Draw top and bottom pipes
        ctx.fillStyle = "#008000";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);

        // Check for collisions
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth &&
            (birdY < pipe.topHeight || birdY + birdHeight > pipe.topHeight + pipeGap)) {
            isGameOver = true;
            gameOver();
        }

        // Boruların ekranın dışına çıkması
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }

    // Skoru çiz
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Skor: " + score, 10, 30);

    // Bir sonraki frame için tekrar çağır
    requestAnimationFrame(gameLoop);
}

// Create a new pipe
function createPipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({ x: canvas.width, topHeight: topHeight, passed: false }); // passed: false olarak başlatıyoruz
}

// Game Over
function gameOver() {
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("OYUN BİTTİ", canvas.width / 2 - 90, canvas.height / 2);
    ctx.fillText("Skor: " + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
    document.getElementById('restartButton').style.display = 'block'; // Restart button visible
    backgroundMusic.pause();  // Müziği durdur
    backgroundMusic.currentTime = 0;  // Müziği başa al
}

// Restart the game
function restartGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    score = 0;
    pipes = [];
    isGameOver = false;
    passedPipes = 0; // Geçilen boru sayısını sıfırla
    document.getElementById('restartButton').style.display = 'none'; // Hide restart button
    backgroundMusic.play();  // Müziği tekrar başlat
    gameLoop();  // Oyun döngüsünü tekrar başlat
}

// Sayfa yüklendiğinde oyun başlasın
window.onload = function() {
    document.getElementById('game-container').style.display = 'block';
    backgroundMusic.play();  // Başlangıçta müziği başlat
    backgroundMusic.loop = true;  // Müziği döngüye al
    backgroundMusic.volume = 0.3;  // 0.0 ile 1.0 arasında bir değer
    gameLoop();  // Oyun döngüsünü başlat
};


// Ses dosyalarını alıyoruz
const pipePassSound = document.getElementById('pipePassSound');
const gameOverSound = document.getElementById('gameOverSound');

// Game loop fonksiyonundaki güncellenmiş bölümler
function gameLoop() {
    if (isGameOver) return;

    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Kuşun pozisyonunu güncelle
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Kuşu çiz (dikdörtgen yerine görseli kullanıyoruz)
    ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

    // Kuşun yere çarpıp çarpmadığını kontrol et
    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight;
        birdVelocity = 0;
        isGameOver = true;
        gameOver();
        gameOverSound.play(); // Çarpma sesini çal
    }

    // Boruları güncelle ve çiz
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // Boruların üst ve alt kısmını çiz
        ctx.fillStyle = "#008000";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);

        // Boru geçişini kontrol et
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth &&
            (birdY < pipe.topHeight || birdY + birdHeight > pipe.topHeight + pipeGap)) {
            // Çarpma durumunda oyun bitir
            isGameOver = true;
            gameOver();
            gameOverSound.play(); // Çarpma sesini çal
        }

        // Borulardan geçtiğimizde
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
            score++;  // Borudan geçince skoru arttır

            // Boru geçişi sesini her defasında çal
            pipePassSound.currentTime = 0;  // Sesin başlangıcına dön
            pipePassSound.play(); // Boru geçişi sesini çal
        }
    }

    // Skoru çiz
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Skor: " + score, 10, 30);

    // Bir sonraki frame için tekrar çağır
    requestAnimationFrame(gameLoop);
}
