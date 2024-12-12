let racers = [];
let particles = [];
let gameStarted = false;
let song, gameFont;

function preload() {
  song = loadSound('bluespring.mp3');
  gameFont = loadFont('PressStart2P-Regular.ttf');
}

function setup() {
  createCanvas(1700, 400);

  for (let i = 0; i < 4; i++) {
    let shapeType = random(["circle", "square", "triangle"]); 
    let speed = random(1, 3); 
    racers.push(new Racer(50, i * 90 + 60, shapeType, speed)); 
  }

  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }
}

function draw() {
  if (!gameStarted) {
    showHomeScreen();
    return;
  }

  background(0);

  for (let particle of particles) {
    particle.move();
    particle.display();
  }

  for (let racer of racers) {
    racer.move();
    racer.display();

    for (let particle of particles) {
      if (racer.isTouchedBy(particle)) {
        racer.reset(); 
      }
    }
  }
}

function mousePressed() {
  if (!gameStarted) {
    gameStarted = true; 
    if (!song.isPlaying()) {
      song.play(); 
    }
    return;
  }

  for (let racer of racers) {
    if (racer.isClicked(mouseX, mouseY)) {
      racer.boost();
    }
  }
}

function showHomeScreen() {
  background(0); 
  fill(220,20,60);
  textAlign(CENTER, CENTER);
  textSize(40);
  textFont(gameFont); 
  text("Racing Hearts", width / 2, height / 4);

  textSize(9);
  fill(255);
  text(
    "How to Play: Move your racers to the other side without touching the heart particles.\n" +
    "If touched, you will have to restart. Click on your racer to boost its speed.\n" +
    "Help them all cross!",
    width / 2,
    height / 2
  );

  textSize(10);
  fill(255,255,0);
  text("Click anywhere to start", width / 2, (3 * height) / 4);
}

class Racer {
  constructor(x, y, shapeType, speed) {
    this.startX = x;
    this.startY = y; 
    this.x = x;
    this.y = y;
    this.shapeType = shapeType;
    this.speed = speed;
    this.color = color(random(255), random(255), random(255));
  }

  move() {
    this.x += this.speed;
  }

  display() {
    fill(this.color);
    noStroke();
    if (this.shapeType === "circle") {
      ellipse(this.x, this.y, 30, 30);
    } else if (this.shapeType === "square") {
      rect(this.x - 15, this.y - 15, 30, 30);
    } else if (this.shapeType === "triangle") {
      triangle(this.x, this.y - 15, this.x - 15, this.y + 15, this.x + 15, this.y + 15);
    }
  }

  isClicked(px, py) {
    return dist(px, py, this.x, this.y) < 15;
  }

  boost() {
    this.speed += 1.5;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
  }

  isTouchedBy(particle) {
    let d = dist(this.x, this.y, particle.x, particle.y);
    return d < 30; 
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 25); 
    this.xSpeed = random(-4, 4);
    this.ySpeed = random(-2, 2);
    this.color = color(random(0,255), random(100,255), random(200,255)); 
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
  }

  display() {
    noStroke();
    fill(this.color);
    drawHeart(this.x, this.y, this.size);
  }
}

function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
