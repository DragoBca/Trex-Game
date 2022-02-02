//declarando as variáveis
var trex,trex_running,trex_collide;
var edges;
var ground,ground_img;
var invisible_ground;
var cloud,cloud_img,cloud_gp;
var cacto,cacto_img1,cacto_img2,cacto_img3,cacto_img4,cacto_img5,cacto_img6,cacto_gp;
var score = 0;
var play = 1;
var end = 0;
var gameState = play;
var record = 0;

var checkpoint;
var die;
var jump;

var gameOver,gameOver_img;
var restart,restart_img;


//preload carrega as mídias do jogo
function preload(){
  trex_running = loadAnimation("trex3.png","trex4.png")
  trex_collide = loadAnimation("trex_collided.png");

  ground_img = loadImage("ground2.png");

  cloud_img = loadImage("cloud.png");

  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");

  cacto_img1 = loadImage("obstacle1.png");
  cacto_img2 = loadImage("obstacle2.png");
  cacto_img3 = loadImage("obstacle3.png");
  cacto_img4 = loadImage("obstacle4.png");
  cacto_img5 = loadImage("obstacle5.png");
  cacto_img6 = loadImage("obstacle6.png");

  gameOver_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
}

//setup faz a configuração
function setup(){
  createCanvas(windowWidth,windowHeight);

  //sprite trex
  trex = createSprite(50,height-50,20,40);
  trex.addAnimation("run",trex_running);
  trex.addAnimation("die",trex_collide);
  trex.scale = 0.5;
  trex.debug = false;
  //trex.setCollider("rectangle",0,0,50,50,50);
  trex.setCollider("circle",0,0,30);

  //criando bordas
  edges = createEdgeSprites();
  
  ground = createSprite(width/2,height-20,width,10);  
  ground.addImage(ground_img);

  invisible_ground = createSprite(width/2,height-15,width,10);
  invisible_ground.visible=false;

  cacto_gp = new Group();
  cloud_gp = new Group();

  gameOver = createSprite(width/2,height-105,100,70);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 0.7;
  gameOver.visible = false;

  restart = createSprite(width/2,height-65,40,40);
  restart.addImage(restart_img);
  restart.scale = 0.6;
  restart.visible = false;
}

//draw faz o movimento, a ação do jogo
function draw(){
  background("white");

  if (trex.isTouching(cacto_gp)) {
    gameState = end;
    trex.changeAnimation("die",trex_collide);
    //die.play();
  }
  
  if (gameState == play) {
    score += Math.round(getFrameRate()/60);

     //pulo do trex
    if (touches.length>0 || keyDown("space") && trex.y > height-40) {
      trex.velocityY = -10;
      touches = [];
      jump.play(); 
    }
      // && = todas as afirmações são verdadeiras(todas devem ser atendidas)
      // || = pelo menos uma das condições precisa ser atendida ou verdadeira
    
    //velocidade do solo
    ground.velocityX = -(2.5+score/100);

    //reiniciando solo
    if (ground.x<200){
      ground.x = ground.width/2;
    }

    if (score%100==0 && score>0) {
      checkpoint.play();
    }
 
    spawnClouds();
    spawnCacts();
  }

  if (gameState == end) {
    ground.velocityX = 0;
    cacto_gp.setVelocityXEach(0);
    cloud_gp.setVelocityXEach(0);
    cacto_gp.setLifetimeEach(-1);
    cloud_gp.setLifetimeEach(-1);

    if (record < score) {
      record = score;
    }

    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      gameState = play;
      gameOver.visible = false;
      restart.visible = false;
      cacto_gp.destroyEach();
      cloud_gp.destroyEach();
      trex.changeAnimation("run",trex_running);
      score = 0;
    }
  }


  text("Score: "+score,width-100,height-180);
  text("Record: "+record,width-180,height-180);
 
  //gravidade
  trex.velocityY += 0.5;

  //colisão do trex
  trex.collide(invisible_ground);
 
  //coordenadas do mouse na tela
  //text("X: "+mouseX+" / Y: "+mouseY,mouseX,mouseY)
  drawSprites();
}

function spawnClouds() {
  if (frameCount%50==0) {
    cloud = createSprite(width,random(height-190,height-80),20,30);
    cloud.velocityX = -(2.5+score/100);
    cloud.addImage(cloud_img)
    cloud.scale = random(0.5,1.5);
    cloud.depth = -1;
    cloud.lifetime = width/cloud.velocityX;
    cloud_gp.add(cloud);
  }
}

function spawnCacts() {
  if (frameCount%100==0) {
    cacto = createSprite(width,height-30);
    cacto.velocityX = -(2.5+score/100);
    var sortCacto = Math.round(random(1,6));
    switch (sortCacto) {
      case 1: cacto.addImage(cacto_img1);
        break;
      case 2: cacto.addImage(cacto_img2);
        break;
      case 3: cacto.addImage(cacto_img3);
        break;
      case 4: cacto.addImage(cacto_img4);
        break;
      case 5: cacto.addImage(cacto_img5);
        break;
      case 6: cacto.addImage(cacto_img6);
        break;
    }
    cacto.scale = 0.4;
    cacto.depth = trex.depth;
    cacto.lifetime = width/cacto.velocityX;
    cacto_gp.add(cacto);
  }
}