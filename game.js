import TileMap from "./TileMap.js";
import Player from "./player.js";
import SimplexNoise from "./lib/math/simplexNoise.js";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 16;//32;

const tileMap = new TileMap(tileSize);


///GET RHINO IMAGE
const rhinoImage = new Image(60, 45); // Using optional size for image
rhinoImage.onload = ctx.drawImage(rhinoImage, 0, 0);; // Draw when image has loaded

// Load an image of intrinsic size 300x227 in CSS pixels
rhinoImage.src = "./images/ghost.png";


/////////////////////////////////////////////////////////////////////////////////
//            DATA SETUP
/////////////////////////////////////////////////////////////////////////////////

var worldTiles = {};
var worldTilesDefault = {
  "pos":[0,0],
  "ID":0,
  "entityIDs":[],
  "structureIDs":[],
};
var worldInfo = {
  "width":14,//tiles
  "height":10,//tiles
}
var structures = {};
var entities = {};
var entityDefault = {
  //my unique ID is my key
  "pos":[0,0],
  "spriteID":0,
  "faction":0,

};
var focusGrid = [0,0];
var playerKey = String(0)
var screenGridWidthRad = 10;
var screenGridHeightRad = 8;

//focusGrid = [Math.floor((2*screenGridWidthRad+1)/2),Math.floor((2*screenGridHeightRad+1)/2)]
focusGrid = [screenGridWidthRad+1,screenGridHeightRad+1]

var playerVel = 2;
const player = new Player(focusGrid[0],focusGrid[1],tileSize,playerVel,tileMap)

const worldSeed = Math.floor(1000*Math.random())
const simplexNoise = new SimplexNoise(worldSeed);


/////////////////////////////////////////////////////////////////////////////////
//            MATH FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////


function tileKey_from_pos(tilePos){
  var key = String(tilePos[0]+","+tilePos[1]);
  return key
}

function init_rowOfColsMatrix(wSize,hSize,initElemnt){
  var newMat = []
  for(var i=0;i<wSize;i++){
    newMat.push([]);
    for(var j=0;j<hSize;j++){
    newMat[i].push(initElemnt);
    }
  }
  return newMat
}

function init_colOfRowsMatrix(wSize,hSize,initElemnt){
  //create a giant column vector of row vectors
  //like the initial map
  var newMat = []
  for(var j=0;j<hSize;j++){
    newMat.push([]);
    for(var i=0;i<wSize;i++){
    newMat[j].push(initElemnt);
    }
  }
  return newMat
}

function mod(a,b){//returns positive mod
  //a mod b = ((a % b) + b) % b
  return ((a % b) + b) % b
}

function torusSurface(param1,param2,bigRad,smallRad){
  var torusVec = [0,0,0];
  torusVec[0] = (bigRad+smallRad*Math.cos(param1))*Math.cos(param2)
  torusVec[1] = (bigRad+smallRad*Math.cos(param1))*Math.sin(param2)
  torusVec[2] = bigRad*Math.sin(param1)
  return torusVec
}
/////////////////////////////////////////////////////////////////////////////////
//            INIT DATA FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////

function make_initial_worldTiles(){
  // var map = [
  //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  //   [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  //   [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  //   [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  //   [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // ];
  worldInfo["width"] = 640//map[0].length; 
  worldInfo["height"] = 640//map.length;
  //for torus version world must be big enough to show the resolution of the torus, because the parametres must always go from 0 to 2*PI the amount of sqaurees determines the resolution (could change radius) 
  var map = init_colOfRowsMatrix(worldInfo["width"],worldInfo["height"],0)
  for(var i=0;i<worldInfo["width"];i++){
    for(var j=0;j<worldInfo["height"];j++){
      //map[j][i] = Math.floor(15*0.5*(simplexNoise.noise2D(i,j)+1));
      
      //2D, no edge wrapping
      //const scale = 0.05
      //const noiseVal=simplexNoise.noise2D(scale*i,scale*j)
      //3D with edge wrapping
      const params = [2*Math.PI*(i/worldInfo["width"]),2*Math.PI*(j/worldInfo["height"])]
      const torusVec = torusSurface(params[0],params[1],5,1)
      //const heightWorldNoise = simplexNoise.noise3D(torusVec[2],torusVec[0],torusVec[1])
      
      const mainNoiseVal=simplexNoise.noise3D(torusVec[0],torusVec[1],torusVec[2])
      var noiseVal = mainNoiseVal
      // if(heightWorldNoise > 0.8){
      //   noiseVal = Math.abs(mainNoiseVal)//Math.min(1,mainNoiseVal+heightWorldNoise)
      // }
      // else if(heightWorldNoise < -0.2){
      //   noiseVal = -1*Math.abs(mainNoiseVal)//Math.max(-1,mainNoiseVal+heightWorldNoise)
      // }
      var ID=getIDfromNoiseVal(noiseVal, j/worldInfo["height"])
      map[j][i] = ID
  }
}
  //[2][1]
  //So my flipping issue comes from being constrained in code
  //to write maps in this form, I want [x][y] but I have to do [y][x]
  //the first element in this map given above will
  // always refer to the row that the matrix element is in
  //which is not the way I like to think of it
  //I like the first element to be the column it is in
  //, as it refers to how far across the x axis do you go
  
  //basically to use map[i][j] as a matrix we need
  //to get map[j][i]
  //as j is index for the column vector of row vectors
  //i is index in row vector
  //

  worldInfo["width"] = map[0].length; 
  worldInfo["height"] = map.length; 
  for(var i=0;i<worldInfo["width"];i++){
    for(var j=0;j<worldInfo["height"];j++){
      var tilePos = [i,j]
      var key = String(i+","+j);
      var key = tileKey_from_pos(tilePos);
      worldTiles[key] = structuredClone(worldTilesDefault);
      worldTiles[key]["pos"] = tilePos;
      //console.log("key = "+key)
      //console.log("i = "+i+", j = "+j)
      worldTiles[key]["ID"] = map[j][i];//SEE EXPLANATION ABOVE FOR WHY IT IS SWITCHED
      //console.log("EarlytileDic = "+worldTiles[key])
    }
  }
}

function make_initial_entities(){
  var amount = 6;
  playerKey = String(0);
  entities[playerKey] = structuredClone(entityDefault);
  entities[playerKey]["pos"] = [3,3]
  entities[playerKey]["spriteID"] = 0;
  for(var i=1;i<amount;i++){
    var key = String(i);
    entities[key] = structuredClone(entityDefault);
    entities[key]["pos"] = [i,1];
    entities[key]["spriteID"] = 1;
  }
}

function getIDfromNoiseVal(noiseVal, latitude){
  var ID=0
  if(noiseVal < -0.65){
    ID=14
  }
  else if(noiseVal < -0.5){
    ID=13
  }
  else if(noiseVal < -0.4){
    ID=12
  }//going to greater than so have to go backwards now
  else if(noiseVal > 0.9){
    ID=17
  }
  else if(noiseVal > 0.8){
    ID=16
  }
  else if(noiseVal > 0.6){
    ID=15
  }
  else{
    //choose an ID between 0 and 11 based on the remaining values
    //ID = Math.floor(11*latitude)
    const subLat = (4*latitude + 2*(noiseVal+0.4))
    var hot = Math.floor(subLat%3)
    if(subLat >= 3){
      hot = Math.floor(subLat+0.001 - (subLat%3))
    }
    
    //we want to go from hot to cold to hot or vice versa
    //so 
    const dry = Math.floor(3.0*(noiseVal+0.4))//linked to 0.7 above
    //0 dry is wet, 0 hot is cold
    //these are for spriteSheetIDs
    ID = 3*dry + hot
  }
  return ID
}


make_initial_worldTiles()
make_initial_entities()

/////////////////////////////////////////////////////////////////////////////////
//            GAME LOOP FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////





function gameLoopStructure(){
    tileMap.draw(canvas,ctx);
    ctx.drawImage(rhinoImage, 0, 0);
}

function gameLoop(){
  focus()
  //Clear

  //check for input
  //change focusGrid when we move up and down
  focusGrid[0] = player.x
  focusGrid[1] = player.y
  console.log("focusGrid = "+focusGrid)

  //do ai stuff
  //this.keydown();

  //Draw background around a focus point a certain range of tiles
  var x=focusGrid[0]
  var y=focusGrid[1]
  var tilePosOnScreen = {}; //0:{"screenPos":[i,j] ;"gridPos":[newX,newY]}
  var keyCount = 0
  for(var i=-screenGridWidthRad;i<=screenGridWidthRad;i++){
    for(var j=-screenGridHeightRad;j<=screenGridHeightRad;j++){
  // for(var j=-screenGridHeightRad+1;j<screenGridHeightRad;j++){
  //   for(var i=-screenGridWidthRad+1;i<screenGridWidthRad;i++){//made no difference
      // var newX = (x+i)%worldInfo["width"];
      // var newY = (y+j)%worldInfo["height"];
      //% does not wrap negative numbers it seems
      var newX = mod((x+i),worldInfo["width"]);
      var newY = mod((y+j),worldInfo["height"]);
      // var newKeyNumber = (2*screenGridHeightRad+1)*(i+screenGridWidthRad-1) + (j+screenGridHeightRad-1);
      // var newKey = String(newKeyNumber);
      var newKey = String(keyCount)
      tilePosOnScreen[newKey] = {
        "negScreenPos": [i,j],//includes negative, "independent of wrapping and focus point"
        "posScreenPos":[i+screenGridWidthRad,j+screenGridHeightRad], //positive version of screen pos
        "gridPos" : [newX,newY]//actual positions of the tiles that correspond to that point (we get key from var key = tileKey_from_pos(tilePos);)
      }
      keyCount++
    }
  }
  //now we have the tiles that should be on screen
  //they should be in order from left to right then up and down
  //we want tileMatrix to be a column vector of row vectors
  var tileMatrix = init_colOfRowsMatrix((2*screenGridWidthRad)+1,(2*screenGridHeightRad)+1,0)
  //console.log("worldTiles.keys() = "+Object.keys(worldTiles))
  console.log("worldTiles = ")
  console.log(worldTiles)
  for(var indx=0; indx<Object.keys(tilePosOnScreen).length;indx++){
    var screenTileKey = String(indx);
    var posScreenPos = tilePosOnScreen[screenTileKey]["posScreenPos"];
    //console.log("index = "+indx+" \n posScreenPos = "+posScreenPos)
    var key = tileKey_from_pos(tilePosOnScreen[screenTileKey]["gridPos"]);
    //console.log("index = "+indx+" \n posScreenPos = "+posScreenPos+" \n gridPos = "+key)
    //console.log("gridPos = "+tilePosOnScreen[screenTileKey]["gridPos"])
    //console.log("key = "+key)
    //console.log("tileDic = "+worldTiles[key])

    //tileMatrix[posScreenPos[0]][posScreenPos[1]] = worldTiles[key]["ID"]//normal = leftright/updown are swapped

    tileMatrix[posScreenPos[1]][posScreenPos[0]] = worldTiles[key]["ID"]//swapping x and y seems to work
    //we want tileMatrix to be a column vector of row vectors

    // const invertX = (2*screenGridWidthRad+1) - posScreenPos[0] - 1
    // const invertY = (2*screenGridHeightRad+1) - posScreenPos[1] - 1
    // tileMatrix[invertX][invertY] = worldTiles[key]["ID"]
  }
  //now we should pass this tileMatrix functrion into the draw fucntion for the tileMap
  console.log("tileMatrix = ")
  console.log(tileMatrix)
  tileMap.draw(canvas,ctx,tileMatrix);

  //Draw Buildings (background addons)

  //draw player(s)
  player.draw(ctx);

  //Draw entities

  
  //Draw effects

  

  
}

setInterval(gameLoop, 1000 / 60);


