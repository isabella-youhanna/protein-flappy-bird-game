//board
let board;
let boardWidth=863;
let boardHeight=856;
let context;

//protein
let proteinWidth=85;
let proteinHeight=85;
let proteinX=boardWidth/8;
let proteinY=boardHeight/2;
let proteinCartoon;

let protein=
{
    x: proteinX, y: proteinY, width: proteinWidth, height: proteinHeight
    
}

//red blood cell pipes
let pipeArray=[];
let redX=boardWidth;
let redY=0;


//pipe images
let topRedImg;
let bottomRedImg;
let topWhiteImg;
let bottomWhiteImg;
let topFatImg;
let bottomFatImg;
let topGreenImg;
let bottomGreenImg;

//physics
let velX=-2; //moving left
let velY=0; //jump
let gravity=0.4;
let gameOver=false;
let score=0;

window.onload=function()
{
    //board 
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d"); 

    //load protein cartoon
    proteinCartoon=new Image();
    proteinCartoon.src= "./protein\ cartoon.png";
    proteinCartoon.onload=function()
    {
        context.drawImage(proteinCartoon, protein.x, protein.y, proteinWidth, proteinHeight);
    }

    //load red blood cell pipes
    topRedImg=new Image();
    topRedImg.src= "./redbloodcell.png";

    bottomRedImg=new Image();
    bottomRedImg.src="./redbloodcell.png";

    //load white blood cell pipes
    topWhiteImg=new Image();
    topWhiteImg.src="./whitebloodcell.png";

    bottomWhiteImg=new Image();
    bottomWhiteImg.src="./whitebloodcell.png";

    //load fat pipes
    topFatImg=new Image();
    topFatImg.src="./phospholipidUpsideDown.png";

    bottomFatImg=new Image();
    bottomFatImg.src="./phospholipid.png";

    //load bacteria pipes
    topGreenImg=new Image();
    topGreenImg.src="./bacteria.png";

    bottomGreenImg=new Image();
    bottomGreenImg.src="./bacteria.png";


    requestAnimationFrame(update);
    setInterval(placePipes, 1800);
    document.addEventListener("keydown", moveProtein)
}

//moving and clearing frames
function update()
{
    requestAnimationFrame(update);
    if(gameOver==true)
    {
        return;
    }
    context.clearRect(0,0, board.width, board.height);

    //protein
    velY+=gravity; //adding gravity to protein
    protein.y=Math.max(protein.y+velY,0); //limit
    context.drawImage(proteinCartoon, protein.x, protein.y, protein.width, protein.height);

    if (protein.y>board.height)
    {
        gameOver=true;
    }

    //red blood cell pipes
    for (let i=0; i<pipeArray.length; i++)
    {
        let redPipe=pipeArray[i];
        redPipe.x+= velX;
        context.drawImage(redPipe.img, redPipe.x, redPipe.y, redPipe.width, redPipe.height);

        if(!redPipe.passed && protein.x>redPipe.x+redPipe.width)
        {
            score+=0.5;
            redPipe.passed=true;
        }

        if(detectCollision(protein, redPipe))
        {
            gameOver=true;
        }
    }

    while(pipeArray.length>0 && pipeArray[0].x<pipeArray[0].width-200)
    {
        pipeArray.shift();
    }

    //score
    context.fillStyle="white";
    context.font="45px Arial";
    context.fillText(score, 5, 45);

    if(gameOver)
    {
        context.fillText("Game Over",310,420);
    }
}


function placePipes()
{
    if (gameOver)
    {   
        return;
    } 

    let obstacleType= 
    [
            { top: topRedImg, bottom: bottomRedImg, width: 100, height: 600},
            {top: topWhiteImg, bottom: bottomWhiteImg, width:100, height:600},
            { top: topFatImg, bottom: bottomFatImg, width: 100, height: 600},
            { top: topGreenImg, bottom: bottomGreenImg, width: 150, height: 600 },
    ];

    //randomly generates pipe type
    let chosen=obstacleType[Math.floor(Math.random()*obstacleType.length)];

    //randomizing position
    let randomPipeY=redY-chosen.height/4-Math.random()*(chosen.height/2);
    let gapSpace=board.height/4;


    //top pipe position + sizing
    let topPipe = 
    {   img: chosen.top, 
        x: redX, 
        y: randomPipeY, 
        width: chosen.width, 
        height: chosen.height, 
        passed: false
    }
    pipeArray.push(topPipe);

    //bottom pipe position + sizing
    let bottomPipe =
    {   img: chosen.bottom, 
        x: redX, 
        y:randomPipeY+chosen.height+gapSpace,
        width: chosen.width,
        height: chosen.height,
        passed: false
    }
    pipeArray.push(bottomPipe);
    
}
//protein jump
function moveProtein(e)
{
    if(e.code=="Space" || e.code=="ArrowUp")
    {
        velY=-8;

        //reset
        if(gameOver)
        {
            protein.y=proteinY;
            pipeArray=[];
            score=0;
            gameOver=false;
        }
    }
}


function detectCollision(protein, redPipe) 
{
    //protein 
    let proteinCenterX=protein.x + protein.width/2;
    let proteinCenterY=protein.y + protein.height/2;
    let proteinRadius=protein.width/2;

    //pipe center
    let pipeCenterX=redPipe.x + redPipe.width/2;
    let pipeCenterY=redPipe.y + redPipe.height/2;
    let pipeRadiusX=redPipe.width/2; 
    let pipeRadiusY=redPipe.height/2; 

    //accounting for ellipse shape
    let dx=proteinCenterX-pipeCenterX;
    let dy=proteinCenterY-pipeCenterY;

    let normalizedDistance=(dx*dx)/((pipeRadiusX+proteinRadius) * (pipeRadiusX+proteinRadius)) +
        (dy*dy) / ((pipeRadiusY+proteinRadius) * (pipeRadiusY+proteinRadius));

    return normalizedDistance<1;
}
