var base;
var secondsbase;
var minutesbase;
var hoursbase;
var clockDiameter;
var cx, cy;
var hourTbase, minTbase;
var btnLearn;
var hourIsOn = true;
var m, h, mInit = 0, hNum = 0;
var aTang;
var mDirection;
var mouseTagHour = false, mouseTagMinute = false;
var roundValue = 30;
var xAxis, yAxis, offset;
var mAnswer, hAnswer;
var drawFlag = false;
var roundArray = [];
var len = 0, minDraw = 0, k, roundSuccess = 0;
var flagMouseDown = false;
var gameOver;

/**
 * Setup
 */
function setup() {
  // create canvas
    var c = createCanvas(475, 400);
    c.parent("#myCanvas");

    stroke(0);
    strokeCap(ROUND);

    // base = min(width, height) / 2;
    base = 240 / 2;
    secondsbase = base * 0.92;
    minutesbase = base * 0.55 + 10;
    hoursbase = base * 0.4 + 10;
    hourTbase = base * 0.77;
    minTbase = base * 0.62;
    clockDiameter = base * 2;

    m = -HALF_PI;
    h = 0;

    cx = width / 2 - 115;
    cy = (height / 2 + 100) - clockDiameter / 8 - 107;

    btnLearn = document.getElementById("learnBtn");
}

/**
 * AnswerDraw
 */
function answerDraw() {

    // console.log('mAnswer: ', mAnswer, '-> m=', m);
    // console.log('hAnswer: ', hAnswer, '-> h=', h);

    len += 1;
    // if ((Math.sin(Math.abs(m - mAnswer)) <= Math.sin(PI/roundValue)) && (Math.sin(Math.abs(h - hAnswer)) <= Math.sin(PI/roundValue)))
    if (((Math.abs(m - mAnswer) <= 0.0000000001) || (Math.abs((Math.abs(m - mAnswer) - TWO_PI)) <= 0.0000000001)) && ((Math.abs(h - hAnswer) <=  0.0000000001) || (Math.abs((Math.abs(h - hAnswer) - TWO_PI)) <= 0.0000000001)))
    {
        roundArray.push("0");
        roundSuccess += 1;
    } else {
        roundArray.push("1");
    }

    // console.log('array=', roundArray);

    let prevCss = $('.roundButton').css('background-image');
    const arr = prevCss.split(',');
    const length = arr.length;
    let roundDisplay;

    for (k = 1; k <= len; k ++)
    {
        if (roundArray[k - 1] === "0")
        {
            roundDisplay = $('.round' + (k).toString()).css('background-image');
        }
        else
        {
            roundDisplay = $('.round' + (k + 10).toString()).css('background-image');
        }

        arr.splice(length - 1, 0, roundDisplay);
    }

    $('.roundButton').css('background-image', arr.toString());

    stroke('#050c28');
    noStroke();
    fill('#050c28');
    ellipse(cx, cy, 170, 170);
    noStroke();
    fill('#4091c2');
    ellipse(cx, cy, 13, 13);

    m = mAnswer;
    h = hAnswer;

    stroke('#4091c2');
    strokeWeight(4.5);
    line(cx + Math.cos(mAnswer) * 20, cy + Math.sin(mAnswer) * 20, cx + Math.cos(mAnswer) * minutesbase, cy + Math.sin(mAnswer) * minutesbase);
    strokeWeight(5.5);
    line(cx+ Math.cos(hAnswer) * 20, cy+ Math.sin(hAnswer) * 20, cx + Math.cos(hAnswer) * hoursbase, cy + Math.sin(hAnswer) * hoursbase);
}

/**
 * CleanDraw
 */
function cleanDraw() {
    stroke('#050c28');
    noStroke();
    fill('#050c28');
    ellipse(cx, cy, 170, 170);
    noStroke();
    fill('#4091c2');
    ellipse(cx, cy, 13, 13);

    m = -HALF_PI;
    h = 0;
    hNum = 0;
    drawFlag = false;
    mDirection = 0;

    stroke('#4091c2');
    strokeWeight(4.5);
    line(cx + Math.cos(m) * 20, cy + Math.sin(m) * 20, cx + Math.cos(m) * minutesbase, cy + Math.sin(m) * minutesbase);
    strokeWeight(5.5);
    line(cx+ Math.cos(h) * 20, cy+ Math.sin(h) * 20, cx + Math.cos(h) * hoursbase, cy + Math.sin(h) * hoursbase);
}

/**
 * Redraw
 */
function draw() {
    $(document).ready(function() {
        $('#myCanvas').mousedown(function(e){
            offset = $(this).offset();
            xAxis = e.pageX - offset.left;
            yAxis = e.pageY - offset.top;

            flagMouseDown = true;

            if (Math.sqrt(Math.pow(xAxis - cx, 2) + Math.pow(yAxis - cy, 2)) < clockDiameter/2)
                if (Math.abs(Math.cos(m) * yAxis - Math.sin(m) * xAxis - Math.cos(m) * cy + Math.sin(m) * cx) < 20)
                {
                    if ((Math.sin(m) * (yAxis - cy)) >= 0)
                        mouseTagMinute = true;
                }
                else if (Math.abs(Math.cos(h) * yAxis - Math.sin(h) * xAxis - Math.cos(h) * cy + Math.sin(h) * cx) < 20)
                    if ((Math.sin(h) * (yAxis - cy)) >= 0)
                        mouseTagHour = true;
        });

         $('#myCanvas').mousemove(function(e) {
              if ((mouseTagMinute === true) && (flagMouseDown === true)) {

                  let mFirst = m;
                  offset = $(this).offset();
                  xAxis = e.pageX - offset.left;
                  yAxis = e.pageY - offset.top;

                  aTang = (yAxis - cy)/(xAxis - cx);
                  m = Math.atan(aTang);

                  if ((xAxis - cx) < 0)
                      m = m + PI;

                  let t = PI/roundValue;

                  m = Math.floor((roundValue * m)/PI) * t;

                  if (((xAxis - cx === 0) && (yAxis < cy) && (mDirection < 0)) || (((xAxis - cx) > 0 && (yAxis < cy)) && mDirection < 0))
                  {
                      m = - HALF_PI;
                      if ((h !== 0) || (mDirection !== 0) || (m !== -PI/2))
                      {
                          hNum += PI/6;
                      }

                      h = hNum;
                  }
                  else if(((xAxis - cx) < 0) && (yAxis < cy) && (mDirection > 0))
                  {
                      m = - HALF_PI;
                      hNum -= PI/6;
                      h = hNum;

                  }
                  else if ((xAxis - cx === 0) && (yAxis < cy) && (mDirection > 0))
                  {
                      h = hNum;
                      hNum -= PI/6;
                  }
                  else if (mDirection === 0)
                  {
                      if ((mFirst === -HALF_PI) && (xAxis < cx)) hNum -= PI/6;
                  }
                  else {
                      if ((drawFlag === false) && (xAxis < cx))
                          hNum -= PI/6;
                      h = hNum + (m + PI/2)/12;
                  }
                  mDirection = xAxis - cx;

                  if (hNum > PI) hNum -= TWO_PI;
                  if (hNum < -PI) hNum += TWO_PI;

                  if (hNum < 0) hNum += 2 * PI;
                  else if (hNum > 2 * PI) hNum -= 2 * PI;

                  // if ((m >= mInit) && (m < mInit + PI/30))
                  if (Math.abs(mInit - m) >= PI/roundValue)
                  {
                      drawFlag = true;

                      noStroke();
                      fill('#050c28');
                      ellipse(cx, cy, 170, 170);
                      noStroke();
                      fill('#4091c2');
                      ellipse(cx, cy, 13, 13);

                      stroke('#4091c2');
                      strokeWeight(4.5);
                      line(cx + Math.cos(m) * 20, cy + Math.sin(m) * 20, cx + Math.cos(m) * minutesbase, cy + Math.sin(m) * minutesbase);
                      strokeWeight(5.5);
                      line(cx+ Math.cos(h) * 20, cy+ Math.sin(h) * 20, cx + Math.cos(h) * hoursbase, cy + Math.sin(h) * hoursbase);
                      mInit += PI/roundValue;
                  }
              }
              else if ((mouseTagHour === true) && (flagMouseDown === true)) {


                  offset = $(this).offset();
                  xAxis = e.pageX - offset.left;
                  yAxis = e.pageY - offset.top;

                  aTang = (yAxis - cy)/(xAxis - cx);
                  h = Math.atan(aTang);

                  var t = PI/6;

                  if (xAxis === cx)
                  {
                      if (yAxis > cy)
                      {
                          hNum = HALF_PI;
                          minDraw = 0;
                      }
                      else
                      {
                          hNum = -HALF_PI;
                          minDraw = 0;
                      }
                  }
                  else
                  {
                      hNum = Math.floor((6 * h)/PI) * t;

                      if (xAxis < cx)
                      {
                          hNum += PI;
                          minDraw = 0;
                      }
                  }

                  if ((xAxis - cx) < 0)
                  {
                      h = h + PI;
                      minDraw = 0;
                  }

                  if ((h >= hNum) && (h < hNum + PI/6))
                  {
                      minDraw = 1;
                      drawFlag = true;
                      mDirection = 0;

                      stroke('#050c28');
                      noStroke();
                      fill('#050c28');
                      ellipse(cx, cy, 170, 170);
                      noStroke();
                      fill('#4091c2');
                      ellipse(cx, cy, 13, 13);

                      stroke('#4091c2');
                      strokeWeight(4.5);
                      line(cx + Math.cos(m) * 20, cy + Math.sin(m) * 20, cx + Math.cos(m) * minutesbase, cy + Math.sin(m) * minutesbase);
                      strokeWeight(5.5);

                      if (m !== 0)
                      {
                          line(cx+ Math.cos(hNum + (m + HALF_PI/2)/12) * 20, cy+ Math.sin(hNum + (m + HALF_PI/2)/12) * 20, cx + Math.cos(hNum + (m + HALF_PI/2)/12) * hoursbase, cy + Math.sin(hNum + (m + HALF_PI/2)/12) * hoursbase);

                          h = hNum + (m + HALF_PI/2)/12;
                      }
                      else
                      {
                          line(cx+ Math.cos(hNum + PI/6) * 20, cy+ Math.sin(hNum + PI/6) * 20, cx + Math.cos(hNum + PI/6) * hoursbase, cy + Math.sin(hNum + PI/6) * hoursbase);

                          h = hNum + PI/6;
                      }
                      mInit = m;
                  }
             }
        });

        $('#myCanvas').mouseup(function(e) {
            mouseTagMinute = false;
            mouseTagHour = false;
            flagMouseDown = false;
            mDirection = 0;
        });
    });
    preDraw();
}

function preDraw() {
// Draw the minutes ticks
    strokeWeight(3);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 6) {
        if (a % 30 === 0) continue;
        let angle = radians(a);
        let x = cx + Math.cos(angle) * secondsbase;
        let y = cy + Math.sin(angle) * secondsbase;
        vertex(x, y);
    }
    endShape();

// Display the hour numbers
    strokeWeight(17);
    if (hourIsOn) {
        textSize(16);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        noStroke();
        fill('#4091c2');
        for (var b = 1; b <= 12; b++) {
            var angleHN = radians(30 * b) - HALF_PI;
            var tx = cx + Math.cos(angleHN) * hourTbase;
            var ty = cy + Math.sin(angleHN) * hourTbase;
            text(b, tx, ty);
        }
    }

//centre dot
    noStroke();
    fill('#4091c2');

    //Digit Time
    var rectTimeWidth = 200;
    var rectTimeHeight = 50;
    var rectTimeYPos = cy + clockDiameter / 1.7 - 130;
    rectMode(CENTER);

    fill('#050c28');
    rect(cx + 250, rectTimeYPos, rectTimeWidth, rectTimeHeight, 5);
    textSize(35);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(255);

    if (len <= 9)
    {
        if (num2 < 10)
            text(num1 + " h  0" + num2 + " min", cx + 250, cy + clockDiameter / 1.7 - 130);
        else
            text(num1 + " h  " + num2 + " min", cx + 250, cy + clockDiameter / 1.7 - 130);
    }
    else
    {
        textSize(23);
        textStyle(BOLD);
        gameOver = "Game Over";
        text(gameOver + ' ' + roundSuccess + '/10', cx + 255, cy + clockDiameter / 1.7 - 130);
    }

    mAnswer = (PI/30) * (num2 - 15);
    hAnswer = (PI/6) * (num1 - 3) + (PI/2 + mAnswer)/12;
}


let num1 = 0;
let num2 = 0;

function MathGame(){
}

MathGame.prototype.randomNumber = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

MathGame.prototype.createAddition = function(){
    num1 = MathGame.prototype.randomNumber(12);
    num2 = MathGame.prototype.randomNumber(60);
};