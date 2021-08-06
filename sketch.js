var dog,happyDogImg, hungryDog, foodStockRef, database;
var foodS,foodStock;
var foodObj;
var feed, addFood;
var frameCountNow=0;
var fedTime, lastFed, currentTime;
var bedroomImg, gardenImg, washroomImg, sleepImg, runImg;
var input, button;

function preload(){

happyDogImg=loadImage("images/happydog.png");
hungryDog = loadImage("images/Dog.png");
bedroomImg = loadImage("images/Bed Room.png");
gardenImg = loadImage("images/Garden.png");
washroomImg = loadImage("images/Wash Room.png");
sleepImg = loadImage("images/Lazy.png");
runImg = loadImage("images/running.png");
}

function setup() {
  createCanvas(1200,500);

  foodObj = new Food();
  database=firebase.database();
    
  dog=createSprite(width/2+250, height/2, 10, 10);
  dog.addAnimation("hungry", hungryDog);
  dog.addAnimation("happy", happyDogImg);
  dog.addAnimation("sleeping", sleepImg);
  dog.addAnimation("run", runImg);
  dog.scale=0.3;

  getGameState();
  
  feed=createButton("Feed the dog");
  feed.position(950,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(1050,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  

  currentTime = hour();
  if(currentTime === lastFed +1){
   gameState = "playing";
   updateGameState();
   foodObj.gardenImg();
  }
  else if(currentTime === lastFed +2){
    gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime > lastFed +2 && currentTime <= lastFed +4){
    gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }
  else{
    gameState = "hungry";
    updateGameState();
    foodObj.display();
  }

  //console.log(gameState);

  foodObj.getFoodStock();
  //console.log(foodStock);
  getGameState();

  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  if(gameState === "hungry"){
    feed.show();
    addFood.show();
    dog.addAnimation("hungry", hungryDog);
  }
  else{
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  drawSprites();

  textSize(32);
  fill("red");
  //text("Amoount of Food:" + foodStock,width/2-150, 50);
  textSize(20);
  text("Last fed: "+lastFed+":00", 300, 95);
  //text("Press the up arrow key to feed the dog!",width/2"-200, 100);
  text("Time since last fed:" +(currentTime - lastFed), 300, 125);
} 




function feedDog(){
 foodObj.deductFood();
  foodObj.updateFoodStock();
  dog.changeAnimation("happy", happyDog);
  gameState = "happy";
  updateGameState();
}

function addFoods(){
 foodObj.addFood();
 foodObj.updateFoodStock();
}

async function hour(){
  var site = await fetch("http://worldtimeapi.org/api/timezone/Asia/kolkata");
  var siteJSON = await site.json();
  var datetime = siteJSON.datetime;
  var hourTime = datetime.slice(11,13);
  return hourTime;
}

function createName(){
  input.hide();
  button.hide();

  name = input.value();
  var greeting = createElement('h3');
  greeting.html("Pet's name: "+name);
  greeting.position(width/2+850,height/2+200);
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState = data.val();
    //console.log(gameState);
  });
};

function updateGameState(){
  database.ref('/').update({
    gameState: gameState
  })
}