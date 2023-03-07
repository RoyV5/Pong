let container = document.querySelector("div.container")
let intervalID;

let p1 = {
    scoreHTML: document.getElementById("player2"),
    padHTML: document.getElementById("pad1"),
    score: 0,
    padx: 0,
    pady: 0,
    padHeight: 0,
    padWidth : 0,
}

let p2 = {
    scoreHTML: document.getElementById("player1"),
    padHTML: document.getElementById("pad2"),
    score: 0,
    padx: 0,
    pady: 0,
    padHeight: 0,
    padWidth: 0,
}

let ball = {
    ballHTML: document.getElementById("ball"),
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
}

//Bringing CSS properties into the JS file
function setProperties() {
    ball.speedX = (Math.random() + 4)
    if (Math.random() > 0.5) {
        ball.speedX*=-1;
    }
    ball.speedY = (Math.random() + 4)
    if (Math.random() > 0.5) {
        ball.speedY*=-1;
    }
    ball.y = parseInt(getComputedStyle(ball.ballHTML).top);
    ball.x = parseInt(getComputedStyle(ball.ballHTML).left);
    p1.pady = parseInt(getComputedStyle(p1.padHTML).top);
    p1.padx = parseInt(getComputedStyle(p1.padHTML).left);
    p1.padWidth = parseInt(getComputedStyle(p1.padHTML).width);
    p1.padHeight = parseInt(getComputedStyle(p1.padHTML).height);
    p2.pady = parseInt(getComputedStyle(p2.padHTML).top);
    p2.padx = parseInt(getComputedStyle(p2.padHTML).left);
    p2.padWidth = parseInt(getComputedStyle(p2.padHTML).width);
    p2.padHeight = parseInt(getComputedStyle(p2.padHTML).height);
}

function resetProperties() {
    ball.ballHTML.style.top =  "177px";
    ball.ballHTML.style.left = "307px";
    p1.padHTML.style.top = "160px";
    p2.padHTML.style.top = "160px";
    ball.speedX = (Math.random() + 4)
    if (Math.random() > 0.5) {
    ball.speedX*=-1;
    }
    ball.speedY = (Math.random() + 4)
    if (Math.random() > 0.5) {
    ball.speedY*=-1;
    }
}

//Manages key bindings, avoids keypress repeat delay
function KeyboardController(keys, repeat) {
    var timers= {};
    document.onkeydown= function(event) {
        var key= event.code;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    document.onkeyup= function(event) {
        var key = event.code;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    };
};

function movePadUp(pad) {
    if (pad.pady > 0) {
        pad.pady = pad.pady - 5;
    }
}

function movePadDown(pad) {
    if (pad.pady + pad.padHeight < 350) {
        pad.pady = pad.pady + 5;
    }
}

function score(player) {
    player.score+=1;
    player.scoreHTML.textContent = player.score;
    resetGame();
}

function moveBall() {
    if (
        //Check for lower bound vertical collision
        ball.y + ball.speedY >= 343 || 
        //Check for upper bound vertical collision
        ball.y + ball.speedY <= -2)  
        {
        ball.speedY = -ball.speedY;
    } else {
        ball.y = ball.y + ball.speedY;
    }
    
    if (
        //Check for right bound horizontal collision (Player 1 scored)
        ball.x + ball.speedX >= 618) {
            score(p1);
        } 
        //Check for left bound horizontal collision (Player 2 scored)
    else if (ball.x + ball.speedX <= -6) {
            score(p2);
        } else {
        ball.x = ball.x + ball.speedX;
    }

    //Checks for pad n1 collision
    if (
        (ball.x <= p1.padx + p1.padWidth && ball.x >= p1.padx) &&
        (ball.y >= p1.pady && ball.y <= p1.pady + p1.padHeight)
        ) 
        {
        ball.speedX = (-ball.speedX) + (Math.random()/4);
        ball.speedY = (-ball.speedY) + (Math.random()/4 -1);
    }

    //Checks for pad n2 collision 
    if (
        (ball.x >= p2.padx - 12 && ball.x <= p2.padx + p2.padWidth) &&
        (ball.y  >= p2.pady && ball.y <= p2.pady + p2.padHeight)) 
        {
        ball.speedX = -Math.abs(ball.speedX + (Math.random()/4));
        ball.speedY = -Math.abs(ball.speedY + (Math.random()/4)-1);
    }
}

function update() {
    ball.ballHTML.style.top = `${ball.y}px`
    ball.ballHTML.style.left = `${ball.x}px`
    p1.padHTML.style.top = `${p1.pady}px`
    p2.padHTML.style.top = `${p2.pady}px`
}

function gameRun() {
    update();
    moveBall();
}

function resetGame() {
    start = false;
    clearInterval(intervalID)
    intervalID = null;
    resetProperties();
}

function startGame() {
    setProperties();
    if (!intervalID) {
        intervalID = setInterval(gameRun, 10);
    }
}

//Assigns each key to its respective funcion, with no keypress repeat delay
KeyboardController({
    "KeyW": function() {movePadUp(p1)},
    "KeyS": function() {movePadDown(p1)},
    "ArrowUp": function() {movePadUp(p2)},
    "ArrowDown": function() {movePadDown(p2)},
}
, 10)

//Simpler key assignment, with key delay
document.addEventListener("keydown", function(event) {
    if (event.code == "Space") {
        startGame();
    }
})
