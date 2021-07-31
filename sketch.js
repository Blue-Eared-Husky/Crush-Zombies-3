const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var zombieImg,zombiedead,bgImg;
var ground,wall1,wall2,bridge,joinPoint1,joinPoint2,link,stones;
var collided = false;

function preload(){
  zombieImg = loadAnimation('./assets/zombies/zombie1.png.png','./assets/zombies/zombie2.png.png','./assets/zombies/zombie3.png.png','./assets/zombies/zombie4.png.png','./assets/zombies/zombie5.png.png','./assets/zombies/zombie6.png.png','./assets/zombies/zombie7.png.png','./assets/zombies/zombie8.png.png','./assets/zombies/zombie9.png.png','./assets/zombies/zombie10.png.png','./assets/zombies/zombie11.png.png','./assets/zombies/zombie12.png.png');
  zombiedead = loadAnimation('./assets/zombies/zombie9.png.png');
  bgImg = loadImage("./assets/background.png");
}

function setup() {
  rectMode(CENTER);
  ellipseMode(CENTER);

  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  zombie = createSprite(width/2,height-110);
  zombie.addAnimation("alive",zombieImg);
  zombie.addAnimation("dead",zombiedead);
  zombie.scale = 0.3;
  zombie.velocityX = 10;

  breakButton = createButton("");
  breakButton.position(width-200,height/2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);

  ground = new Base(width/2,height,width,20);
  wall1 = new Base(0,height/2,20,height);
  wall2 = new Base(width,height/2,20,height);
  bridge = new Bridge(21,{x: 10, y: height-450});

  //Matter.Composite.add(bridge.body,joinPoint1);
  joinPoint1 = new Base(25,height-450,200,200);
  joinPoint2 = new Base(width-25,height-450,200,200);
  link = new Link(bridge,joinPoint2);

  stones = [];

  for (var i = 0; i < 8; i++){
    var x = random(width/2 - 180, width/2 + 180);
    var y = random(0, 50);
    var stone = new Stone(x,y,80,80);
    stones.push(stone);
  }
}

function draw() {
  background(bgImg);
  Engine.update(engine);

  if (collided === false){
    zombie.changeAnimation("alive");
  }

  bridge.show();

  if (zombie.position.x < 230){
    zombie.velocityX = 10;
    zombie.mirrorX(1);
  }
  if (zombie.position.x > width-230){
    zombie.velocityX = -10;
    zombie.mirrorX(-1);
  }

  for (var stone of stones){
    stone.show();
    var pos = stone.body.position;
    var distance = dist(zombie.position.x,zombie.position.y,pos.x,pos.y);
    if (distance <= 50){
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, {x : 10, y : -10});
      zombie.changeAnimation("dead");
      collided = true;
    }
  }

  drawSprites();
}

function handleButtonPress(){
  link.dettach();
  setTimeout(() => {
    bridge.break();
  },1500);
}