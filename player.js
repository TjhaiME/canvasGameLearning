export default class Player {
    constructor(x,y,tileSize,velocity,tileMap){
        this.x=x;
        this.y=y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;
        this.#loadImages();
        this.buttonPress = [0,0];
        //this.myImg = new Image();
        this.initialPos = [x,y]
        document.addEventListener("keydown", this.#keydown)
        //document.addEventListener("keydown", this.#keydown(event))
    }

    draw(ctx){
        //stay in place and let the map move
        const spriteSize = [this.tileSize, 2*this.tileSize]
        const spritePos = [this.initialPos[0]*this.tileSize, this.initialPos[1]*this.tileSize - 8]//shift 8 pixels up

        ctx.drawImage(this.myImg, spritePos[0], spritePos[1], spriteSize[0], spriteSize[1])
        //move around the map
        //ctx.drawImage(this.myImg, this.x*this.tileSize, this.y*this.tileSize, this.tileSize, this.tileSize)
    }

    #loadImages(){
        this.myImg = new Image();
        this.myImg.src = "./assets/entities/minotaur.png";
        

        //this.myImages = [];
        //this.myImgIndex = 0;
    }   

    #keydown = (event)=>{
        //=> function makes sure this. refers to player no the main dom element or something
        var buttonPress = [0,0];
        //up
        if(event.keyCode == 38){
            buttonPress[1] -= 1
        }
        //down
        if(event.keyCode == 40){
            buttonPress[1] += 1
        }
        //left
        if(event.keyCode == 37){
            buttonPress[0] -= 1
        }
        //right
        if(event.keyCode == 39){
            buttonPress[0] += 1
        }
      
        // if(buttonPress[0] == 0 && buttonPress[1] == 0){
        //   return
        // }
        this.x += buttonPress[0]
        this.y += buttonPress[1]
    }
    
    // #move(){
    //     this.x += buttonPress[0]
    //     this.y += buttonPress[1]
    // }
    
}

// const MovingDirection = {
//     //he made this elsewhere
//     up:0,
//     down:1,
//     left:2,
//     right:3
// }