var canvasX=0;
var canvasY=0;
var canvasWidth=640;
var canvasHeight=480;

//bat
var batWidth=60;
var batHeight=10;
var batX=0;
var batY=0;
var batSpeed=10;
//ball
var ballWidth=10;
var ballHeight=10;
var ballX=0;
var ballY=0;
var ballXSpeed=10;
var ballYSpeed=-10;

//blocks
var numBlocksX;
var numBlocksY=5;
var blockWidth=40;
var blockHeight=10;
var blockStartY=60;
var blockState=[];
var totalNumBlocks=0;
var blocksHit=0;
var blockColours=['pink','red','yellow','green','cyan','blue']

//score
var score=0;
var lives=3;

//game states
var beginState=0;
var playState=1;
var endState=2;
var pauseState=3

//Game State controls
var gameState=beginState;

//game start
var startText="Press any key to start";

var blockSound;
var batSound;

function preload() {
  blockSound=loadSound('resources/block.wav');
  batSound=loadSound('resources/bat.wav');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
  reset();
  numBlocksX=canvasWidth/blockWidth;
  blockState=[];
  for (y=0;y<numBlocksY;y++)
  {
    for (x=0;x<numBlocksX;x++)
    {
      blockState.push(1);
    }
  }
  totalNumBlocks=numBlocksX*numBlocksY;
  score=0;
  lives=3;
  gameState=beginState;

}

function reset()
{
  batX=((canvasWidth/2)-(batWidth/2));
  batY=canvasHeight-batHeight-10;
  ballX=batX+((batWidth/2)-(ballWidth/2));
  ballY=batY-ballHeight;

  ballXSpeed=10;
  ballYSpeed=-10;
}

function draw() {
  background(0);
  //draw things regardless of state

  switch (gameState)
  {
    case beginState:
    {
      drawBeginState();
      break;
    }
    case playState:
    {
      drawPlayState();
      break;
    }
  }

  drawGame();
}

function drawGame()
{
  textSize(16);
  fill(255,255,255);
  text("Score "+score.toString(),5,20);
  text("Lives "+lives.toString(),canvasWidth-60,20);
  drawBat(batX,batY);
  drawBall(ballX,ballY);
  drawBlocks(0,blockStartY);
}

function drawPlayState()
{
  //update ball and bat
  if (keyIsDown(LEFT_ARROW))
  {
    batX-=batSpeed;
  }
  else if (keyIsDown(RIGHT_ARROW))
  {
    batX+=batSpeed;
  }
  //update ball
  updateBall();
  //check lives
  if (lives==0)
  {
    //reset whole game
    setup();
  }
}

function updateBall()
{
  ballX+=ballXSpeed;
  ballY+=ballYSpeed;
  if ((ballX+ballWidth>canvasWidth) || (ballX<0))
  {
    ballXSpeed*=-1;
  }

  if ((ballY<0))
  {
    ballYSpeed*=-1;
  }

  if (ballY>canvasHeight)
  {
    lives--;
    gameState=beginState;
    reset();
  }

  //Check ball collision
  if (ballX<=batX+batWidth && batX<=ballX+ballWidth &&
  ballY<=batY+batHeight && batY<=ballY+ballHeight)
  {
    ballYSpeed*=-1;
    batSound.play();
  }
  blockX=0;
  blockY=blockStartY;
  for(i=0;i<blockState.length;i++)
  {
    if ((i%numBlocksX)==0)
    {
      blockY+=blockHeight;
      blockX=0;
    }
    if (blockState[i]){
      if (ballX<=blockX+blockWidth && blockX<=ballX+ballWidth &&
      ballY<=blockY+blockHeight && blockY<=ballY+ballHeight)
      {
        ballYSpeed*=-1;
        blockState[i]=0;
        blocksHit++;
        score++;
        blockSound.play();
      }
    }
    blockX+=blockWidth;
  }

}

//
function drawBeginState()
{
  textSize(16);
  fill(255,255,255);
  text(startText,(canvasWidth/2)-(textWidth(startText)/2),canvasHeight/2);
  text("Arrow keys move bat",(canvasWidth/2)-(textWidth("Arrow keys move bat")/2),canvasHeight/2+20);

  if (keyIsPressed)
  {
    gameState=playState;
  }
}

function drawBall(x,y)
{
  fill(255,0,0);
  rect(x,y,ballWidth,ballHeight);
}

function drawBat(x,y)
{
  fill(255,0,0);
  rect(x,y,batWidth,batHeight);
}

function drawBlocks(x,y)
{
  startX=x;
  startY=y;
  colourIndex=0;
  for(i=0;i<blockState.length;i++)
  {
    if ((i%numBlocksX)==0)
    {
      startY+=blockHeight;
      startX=x;
      colourIndex++;
    }
    if (blockState[i]==1){
      fill(blockColours[colourIndex]);
      rect(startX,startY,blockWidth,blockHeight);
    }
    startX+=blockWidth;
  }
}
