/**
 * Script to generate a canvas and other components to play an easy and bugged snake game.
 * @author: Mario Sessa
 * @version: 1.1
 * @license: MIT License
 */



const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

 const modal = document.getElementById("modal");
 modal.style.display = "none";
// create the unit of the box
const box = 32;

// load images 

const ground = new Image();
ground.src = "img/ground.png"; //thanks CodeExample for the image

const foodImg = new Image();
foodImg.src = "img/food.png";
foodImg.style.width = "32px";
foodImg.style.height = "32px";
const goldImg = new Image();
goldImg.style.width = "40px";
goldImg.style.height= "40px";
goldImg.src = "img/gold.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

let gold = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;

//control the snake

let d;

//Moving the snake with sound from audio objects
document.addEventListener("keydown",direction); 

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

// check collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw(){
    
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);
   
    //golden apple will appear in the canvas if...
    if(score % 10 == 0 && score != 0){ 
        ctx.drawImage(goldImg, gold.x, gold.y);
    }

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    let type = 0;
    
    if(snakeX == food.x && snakeY == food.y){
        type = 1;
        score++;
        eat.play();
    }

    else if (score%10 == 0 && score != 0 && snakeX == gold.x && snakeY == gold.y){
        type = 2;
        score+=4;
        eat.play();
    }

    // if the snake eats the food
    if((snakeX == food.x && snakeY == food.y) || (snakeX == gold.x && snakeY == gold.y)){
        
        if(type == 1){
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        } else if (type == 2){
            gold = {
                x : Math.floor(Math.random()*17+1) * box,
                y : Math.floor(Math.random()*15+3) * box
            }
        }

        type = 0; //reset 

        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        dead.play();
        
        const content = document.getElementById("modal-body");
        content.innerHTML="Game over - Score: " + score;
        modal.style.display = "block";
    }
    
    snake.unshift(newHead);
    
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// call draw function every 100 ms

let game = setInterval(draw,100);

