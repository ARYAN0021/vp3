var dog,dogimg,dogHappy,foodStock,foods;
var database;
var food1,readState;
var fedTime,lastFed,foodObj
var garden,washroom,bedroom
var GameState="Hungry"

function preload(){
dogimg = loadImage("Dog.png");
dogHappy = loadImage("happydog.png");
 garden = loadImage("virtual/Garden.png");
 bedroom= loadImage("virtual/Bed Room.png");
 washroom= loadImage("virtual/Wash Room.png");
 
}

function setup() {
  database = firebase.database();
  createCanvas(500,600);
  
  foodObj = new Food();

  dog = createSprite(270,500,20,60);
  dog.addImage(dogimg);
  dog.scale = 0.13;
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  readState=database.ref('GameState');
  readState.on("value",function(data){
    GameState=data.val();
  });
 
  feed=createButton("Feed the Dog")
  feed.position(550,95)
  feed.mousePressed(feedDog)

  addFood=createButton("Add Food")
  addFood.position(650,95)
  addFood.mousePressed(addFoods)

}


function draw() {
  background(46,139,87); 

 
 //foodObj.display();

fedTime=database.ref('FeedTime')
fedTime.on("value",function(data){
lastFed=data.val();
});


fill (255,255,254)
textSize(20);
if(lastFed>=12){
text("Last Feed :" + lastFed % 12 + "PM",180,35);
}else if(lastFed==0){
text("Last Feed : 12 AM",180,35)
}else
text("Last Feed :" + lastFed + "AM",180,35)

currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry")
  foodObj.display();
}


if(GameState!=="Hungry"){
feed.hide();
addFood.hide();
dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(dogimg)
}
  drawSprites();
 
}

function readStock(data){
  foods = data.val();
 // console.log(foods)
  foodObj.updateFoodStock(foods)
}
function update(state){
  database.ref('/').update({
    GameState:state
  });
}

function addFoods(){
  foods++;
database.ref('/').update({
Food:foods

});
}

function feedDog(){
dog.addImage(dogHappy);
foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
Food:foodObj.getFoodStock(),
FeedTime:hour()
});
}
