class Background {
    constructor() {}
    draw() {}
  }
  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 110;
      this.height = 110;
    }
    draw() {
      image(playerJon, this.x, this.y, this.width, this.height);
    }
  }
  class Collect {
    constructor() {
      this.x = Math.floor(Math.random() * 25) * 20;
      this.y = Math.floor(Math.random() * 25) * 20;
      this.width = 100;
      this.height = 100;
      this.item = random(item);
    }
  
    draw() {
      if (this.x > 0 && this.x < window.innerWidth && this.y < 500) {
        image(this.item, this.x, this.y, this.width, this.height);
      }
    }
  
    move() {
      this.x = this.x + random(-1, 1);
      this.y = this.y + random(-1, 1);
    }
  }
  
  class Enemies {
    constructor() {
      this.x = Math.floor(Math.random() * 25) * 10;
      this.y = Math.floor(Math.random() * 25) * 10;
      this.width = 100;
      this.height = 100;
      this.adv = random(adv);
    }
  
    draw() {
      if (this.x > 0 && this.x < window.innerWidth && this.y < 500) {
        image(this.adv, this.x, this.y, this.width, this.height);
      }
    }
  
    move() {
      this.x = this.x + random(-1, 1);
      this.y = this.y + random(-1, 1);
    }
  }
  class Game {
    constructor() {
      this.player = new Player(670, 200);
      this.background = new Background();
      this.collectibles = [];
      this.adversaries = [];
      this.itemCounter = 0;
      this.level = 4;
      this.isRunning = false;
      this.goodEnd = new GoodEnd();
      this.gameOver = new GameOver();
      this.endGame = false;
      this.gameMusic = gameMusic;
      this.time = time;
      this.score = 0;
    }
  
    draw() {
      clear();
      if (this.level === 4) {
         background(background1);
      }  if (this.level === 3) {
        background(background2);
      } if (this.level === 2) {
        background(background3);
      } if (this.level === 1) {
        background(background1)
      }
     
      this.player.draw();
  
      if (frameCount % 60 === 0) {
        this.collectibles.push(new Collect());
        this.adversaries.push(new Enemies());
      }
      
  
      
      this.collectibles.forEach((element, index) => {
        element.draw();
        element.move();
        
        if (this.collisionCheck(this.player, element) || this.collectibles.length > 10) {
          this.collectibles.splice(index, 1);
          if (this.collisionCheck(this.player, element)) {
            document.getElementById("collect").innerHTML = this.itemCounter;
            this.score += 1;
            this.itemCounter += 1;
          }
          }
        })
      
        
      this.adversaries.forEach((element, index) => {
        element.draw();
        element.move();
       
        if (this.collisionCheck(this.player, element) || this.adversaries.length > 10) {
          this.adversaries.splice(index, 1);
          if (this.collisionCheck(this.player, element)) {
            return this.goJail()
          }
          }
        })
      
      
      if (this.level === 4 && this.itemCounter === 5) {
        this.endGame = "win";
      } if (this.level === 3 && this.itemCounter === 9) {
        this.endGame = "win";
        
      } if (this.level === 2 && this.itemCounter === 13) {
        this.endGame = "win";
      }  
      
       if (this.level === 1) {
        this.endGame = "pro";
      } if (this.time === 0 && this.level > 1) {
        this.endGame = "out";
      }
      
      if (this.endGame === "win") {
        return this.toTheNextLevel();
      }
      if (this.endGame === "pro") {
        return this.hallOfFame();
      }
      if (this.endGame === "out") {
        return this.goJail();
      }
    }
    
    keyisPressed() {
      if (keyCode === RIGHT_ARROW) {
        this.player.x += 100;
      if (this.player.x + this.player.width > width) {
        this.player.x = width - 100;
      }
      }
      if (keyCode === LEFT_ARROW) {
        this.player.x -= 100;
      if (this.player.x < 0) {
        this.player.x = 0;
      }
      }
      if (keyCode === UP_ARROW) {
        this.player.y -= 100;
      if (this.player.y < 0) {
        this.player.y = 0;
      }
      }
      if (keyCode === DOWN_ARROW) {
        this.player.y += 100;
      if (this.player.y + this.player.height > height) {
        this.player.y = height - 100;
      }
      }
  }
    collisionCheck(player, unit) {
      const playerTop = player.y;
      const playerLeft = player.x;
      const playerRight = player.x + player.width;
      const playerBottom = player.y + player.height;
      const obsTop = unit.y;
      const obsLeft = unit.x;
      const obsRight = unit.x + unit.width;
      const obsBottom = unit.y + unit.height;
      const TouchLeft = obsRight > playerLeft;
      const TouchBottom = obsTop < playerBottom;
      const TouchRight = obsLeft < playerRight;
      const TouchTop = obsBottom > playerTop;
  
      return TouchRight && TouchTop && TouchBottom && TouchLeft;
    }
    resetVariables() {
  
      this.time += 5;
    }
  
    startGame() {
      this.timer = setInterval(() => {
        if (this.time > 0) {
          document.getElementById("time").innerHTML = this.time;
        } else if (this.time < 0) {
          clearInterval(this.timer);
          document.getElementById("time").innerHTML =
            "0";
        }
  
        this.time--;
      }, 1000);
    }
   
    toTheNextLevel() {
      this.level--;
      document.getElementById("level").innerHTML = this.level;
      this.resetVariables();
      this.endGame = "";
    }
   
    hallOfFame() {
      this.goodEnd.draw();
      noLoop();
      gameMusic.stop();
      this.time = 0;
      const button = document.createElement("button");
      button.innerText = "RESTART!";
      button.style.background = "black";
      button.style.color = "red";
      button.classList.add("restart");
      document.body.appendChild(button);
      button.onclick = () => {
        location.reload();
        button.parentNode.removeChild(button);
      };
    }
    goJail() {
      this.gameOver.draw();
      noLoop();
      gameMusic.stop();
      this.time = 0;
      const button = document.createElement("button");
      button.innerText = "FIGHT AGAIN!!";
      button.style.background = "red";
      button.style.color = "black";
      button.classList.add("restart");
      document.body.appendChild(button);
      button.onclick = () => {
        location.reload();
        button.parentNode.removeChild(button);
      };
    }
  }
  class GoodEnd {
    constructor() {
      this.goodEndMusic = goodEndMusic;
    }
    draw() {
      clear();
      background(0);
      textSize(20);
      fill(255, 255, 255);
      text(`You did it! you got ${game.score - 1} belts, number${game.level} P#P fighter in the world!`, width / 2, 80);
      textSize(20);
      fill(255, 255, 255);
      text(`You got inducted in the UFC Hall Of Fame!`, width / 2, 45);
      image(winImage, 0, 90, width, 600);
      goodEndMusic.play();
      goodEndMusic.setVolume(0.4);
    }
  }
  
  class GameOver {
    constructor() {
      this.badEndMusic = badEndMusic;
      
    }
    draw() {
      clear();
      background(0);
      textSize(30);
      fill(255, 255, 255);
      text("You'd better improve that wrestling son!", width / 2, 80);
      image(loseImage, 0, 90, width, 600)
       badEndMusic.play();
      badEndMusic.setVolume(0.4);
      
    }
  }
  
  const width = window.innerWidth;
  const height = 600;
  const score = document.getElementById(".score");
  let background1;
  let background2;
  let background3;
  let playerJon;
  let time = 60;
  let item = [];
  let adv = [];
  let gameMusic;
  let goodEndMusic;
  let badEndMusic;
  let winImage;
  let loseImage;
  
  const game = new Game();
  const startingPage = document.querySelector(".startingPage");
  const startButton = document.querySelector(".startButton");
  
  function preload() {
    
    for (i = 0; i < 3; i++) {
      item[i] = loadImage(`/JonJonesGame/Belts/B-${i}.png`);
      
    }
    for (i= 0; i < 15; i++) {
      adv[i] = loadImage(`/JonJonesGame/Adversaries /Adv-${i}.png`);
    }
    playerJon = loadImage("/JonJonesGame/images /jon.png")
    winImage = loadImage("/JonJonesGame/images /jonHallofFame.png")
    loseImage = loadImage("/JonJonesGame/images /jonJonesArrested.jpg");
    gameMusic = loadSound("music/efectoEstadio.mp3");
    goodEndMusic = loadSound("music/GonnaFly.mp3");
    badEndMusic = loadSound("music/Loser.mp3");
    background1 = loadImage("/JonJonesGame/images /octufc.png");
    background2 = loadImage("/JonJonesGame/images /police.control.jpg");
    background3 = loadImage("/JonJonesGame/images /penitentiary.jpg");
  }
  startButton.addEventListener("click", function (event) {
    startingPage.style.display = "none";
    game.isRunning = true;
    game.startGame();
    
    let musicInterval = setInterval(() => {
      try {
        gameMusic.play();
        gameMusic.setVolume(0.5);
        clearInterval(musicInterval);
      } finally  {
        return;
      }
    }, 500);
  });
  
  
  function setup() {
    createCanvas(width, height);
    }
  
  function draw() {
    if (game.isRunning === false) {
      return;
    } 
    clear();
     game.draw();  
  }
  
  function keyPressed() {
    game.keyisPressed();
  }
  