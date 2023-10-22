export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.wall = this.#image("wall.png");
    this.pacman = this.#image("pacman.png");
    this.dot = this.#image("yellowDot.png");
    this.ghost = this.#image("ghost.png");
    this.biomeTiles = this.#get_image("./assets/world/biomeTiles.png");
  }

  #image(fileName) {
    const img = new Image();
    img.src = `images/${fileName}`;
    return img;
  }
  #get_image(fileName){
    const img = new Image();
    img.src = fileName;
    return img;
  }

  //1 - wall
  //0 - dots
  //2 - pacman
  //3 enemies
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  draw(canvas, ctx, tileMatrix) {
    this.map = tileMatrix
    this.#setCanvasSize(canvas);
    this.#clearCanvas(canvas, ctx);
    //this.#drawMap(ctx);
    this.#drawBiomeMap(ctx)
  }

  #drawMap(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        let image = null;
        switch (tile) {
          case 1:
            image = this.wall;
            break;
          case 0:
            image = this.dot;
            break;
          case 2:
            image = this.pacman;
            break;
          case 3:
            image = this.ghost;
            break;
        }

        if (image != null)
          ctx.drawImage(
            image,
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
          );
      }
    }
  }

  #clearCanvas(canvas, ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  #setCanvasSize(canvas) {
    canvas.height = this.map.length * this.tileSize;
    canvas.width = this.map[0].length * this.tileSize;
  }

  #drawBiomeMap(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        let image = this.biomeTiles;

        this.#drawSubTile(tile,row,column,ctx, image);
      }
    }

  }

  #IDtoSubSprite(ID){
    const W = 3
    const H = 6
    const x = ID%3
    const y = Math.floor(ID/3)
    return [x,y]
  }
  #drawSubTile(ID,x,y,ctx, sourceImg){
    const subSpriteVec = this.#IDtoSubSprite(ID)
    console.log("subSpriteVec = ")
    console.log(subSpriteVec)
    ctx.drawImage(
      sourceImg,
      subSpriteVec[0] * this.tileSize,
      subSpriteVec[1] * this.tileSize,
      this.tileSize,
      this.tileSize,
      y * this.tileSize,//these are swapped to mnake the map writable
      x * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }



}





/*

  #drawMap(ctx, tileMap) {
    for (let row = 0; row < tileMap.length; row++) {
      for (let column = 0; column < tileMap[row].length; column++) {
        const tile = tileMap[row][column];
        let image = null;
        switch (tile) {
          case 1:
            image = this.wall;
            break;
          case 0:
            image = this.dot;
            break;
          case 2:
            image = this.pacman;
            break;
          case 3:
            image = this.ghost;
            break;
        }

        if (image != null)
          ctx.drawImage(
            image,
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
          );
      }
    }
  }

  #clearCanvas(canvas, ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  #setCanvasSize(canvas, tileMap) {
    canvas.height = tileMap.length * this.tileSize;
    canvas.width = tileMap[0].length * this.tileSize;
  }
}


*/

