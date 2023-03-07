let pad1HTML = document.getElementById("pad1")
let pad2HTML = document.getElementById("pad2")
let ballHTML = document.getElementById("ball");
let container = document.querySelector("div.container")
let score1 = document.getElementById("player1");
let score2 = document.getElementById("player2");
let intervalID;

let p1 = {
    scoreHTML: score1,
    padHTML: pad1HTML,
    padx: 0,
    pady: 0,
    score: 0,
}

let p2 = {
    scoreHTML: score1,
    padHTML: pad1HTML,
    padx: 0,
    pady: 0,
    score: 0,
}

const ball = {
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
    ballHTML.style.top = getComputedStyle(ballHTML).top;
    ballHTML.style.left = getComputedStyle(ballHTML).left;
    pad1HTML.style.top = getComputedStyle(pad1HTML).top;
    pad1HTML.style.left = getComputedStyle(pad1HTML).left;
    pad1HTML.style.width = getComputedStyle(pad1HTML).width;
    pad1HTML.style.height = getComputedStyle(pad1HTML).height;
    pad2HTML.style.top = getComputedStyle(pad2HTML).top;
    pad2HTML.style.right = getComputedStyle(pad2HTML).right;
    pad2HTML.style.width = getComputedStyle(pad2HTML).width;
    pad2HTML.style.height = getComputedStyle(pad2HTML).height;
}

function resetProperties() {
    ballHTML.style.top =  "177px";
    ballHTML.style.left = "309px";
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
    if (parseInt(pad.style.top) > 0) {
        pad.style.top = `${parseInt(pad.style.top) - 5}px`
    }
}

function movePadDown(pad) {
    if (parseInt(pad.style.top) + parseInt(pad.style.height) < 350) {
        pad.style.top = `${parseInt(pad.style.top) + 5}px`
    }
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
        console.log("Code run")
        intervalID = setInterval(moveBall, 10);
        console.log("Code run 2")
    }
}

function score(player) {
    player.score+=1;
    player.scoreHTML.textContent = player.score;
    resetGame();
}

function moveBall() {
    //Checks for pad n1 collision
    if (
        (parseInt(ballHTML.style.left)  <= parseInt(pad1HTML.style.left) + parseInt(pad1HTML.style.width) &&
        parseInt(ballHTML.style.top) + ball.speedY >= parseInt(pad1HTML.style.top)-5 && 
        parseInt(ballHTML.style.top) + ball.speedY <= parseInt(pad1HTML.style.top) + parseInt(pad1HTML.style.height)-5)) 
        {
        
        ball.speedX = -ball.speedX + (Math.random()/4);
        ball.speedY = -ball.speedY + (Math.random()/4);
    }
    //Checks for pad n2 collision 
    if (
        (parseInt(ballHTML.style.left) + ball.speedX >= 610 - parseInt(pad2HTML.style.right) &&
        (parseInt(ballHTML.style.top) + ball.speedY >= parseInt(pad2HTML.style.top)-5 && 
        parseInt(ballHTML.style.top) + ball.speedY <= parseInt(pad2HTML.style.top) + parseInt(pad2HTML.style.height)-5))) 
        {
        ball.speedX = -Math.abs(ball.speedX + (Math.random()/4));
        ball.speedY = -Math.abs(ball.speedY + (Math.random()/4));
    }
    if (
        //Check for lower bound vertical collision
        parseInt(ballHTML.style.top) + ball.speedY >= 343 || 
        //Check for upper bound vertical collision
        parseInt(ballHTML.style.top) + ball.speedY <= -2)  
        {
        ball.speedY = -ball.speedY;
    } else {
        ballHTML.style.top = `${parseInt(ballHTML.style.top) + ball.speedY}px`
    }
    if (
        //Check for right bound horizontal collision (Player 1 scored)
        parseInt(ballHTML.style.left) + ball.speedX >= 620) {
            score(p1);
            ball.speedX = -ball.speedX;
        }
        //Check for left bound horizontal collision (Player 2)
    else if (parseInt(ballHTML.style.left) + ball.speedX <= -2) {
            score(p2);
            ball.speedX = -ball.speedX;  
        } else {
        ballHTML.style.left = `${parseInt(ballHTML.style.left) + ball.speedX}px`
    }
}

//Assigns each key to its respective funcion, with no keypress repeat delay
KeyboardController({
    "KeyW": function() {movePadUp(pad1HTML)},
    "KeyS": function() {movePadDown(pad1HTML)},
    "ArrowUp": function() {movePadUp(pad2HTML)},
    "ArrowDown": function() {movePadDown(pad2HTML)},
}
, 10)

//Simpler key assignment, with key delay
document.addEventListener("keydown", function(event) {
    if (event.code == "Space") {
        console.log("Space")
        startGame();
    }
})
