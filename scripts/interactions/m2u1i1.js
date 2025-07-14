const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}
function getSecondaryColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-secondary-color");
}
function getTertiaryColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-tertiary-color");
}

// otherwise canvas resolution scales too low
canvas.width = window.innerWidth;
canvas.height = canvas.width/2; // alternatively: = window.innerHeight

perceivedButtonContainer = document.getElementById('perceivedButtonContainer');
assumptionsButtonContainer = document.getElementById('assumptionsButtonContainer');
resetButtonContainer = document.getElementById('resetButtonContainer');
box1ButtonContainer = document.getElementById('box1ButtonContainer');
box2ButtonContainer = document.getElementById('box2ButtonContainer');
box3ButtonContainer = document.getElementById('box3ButtonContainer');

FPS = 30;
phase = 0;
grabbed = 0;
mousepos = {xpos: 0, ypos: 0};

let textfieldKeys = ['instructions', 'instructions2', 'instructions3'];
phase0_orders =  [0, 1, 2];
phase0_colors = [getDefaultShapeColor, getSecondaryColor, getTertiaryColor];
phase0_items = [
    function () {return {xpos: 0.25*canvas.width/3, ypos: canvas.height/3, width: canvas.width/3, height: canvas.height/3};}, 
    function () {return {xpos: canvas.width/3, ypos: 1.5*canvas.height/3, width: canvas.width/3, height: canvas.height/3};}, 
    function () {return {xpos: 1.75*canvas.width/3, ypos: canvas.height/3, width: canvas.width/3, height: canvas.height/3};}
];

function get_item_triangle() {
    return {midX: 0.5*canvas.width-0.2*canvas.height, midY: 0.3*canvas.height, edges: 0.5*canvas.height};
}
function get_item_rect() {
    return {midX: 2*canvas.width/3, midY: 0.5*canvas.height, width: 0.3*canvas.width, height: 0.5*canvas.height};
}
function get_item_circ() {
    return {midX: 0.5*canvas.width, midY: 0.5*canvas.height, rad: 0.2*canvas.height};
}

init();

// SLIDERS

function nextPhase() {
    setPhase((phase + 1) % 3);
}

function setPhase(newPhase) {
    phase = newPhase;
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    switch(phase) {
        case 0:
            perceivedButtonContainer.style.setProperty('display', 'inline');
            box1ButtonContainer.style.setProperty('display', 'inline');
            box2ButtonContainer.style.setProperty('display', 'inline');
            box3ButtonContainer.style.setProperty('display', 'inline');
            assumptionsButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer.style.setProperty('display', 'none');
            break;
        case 1:
        case 2:
            perceivedButtonContainer.style.setProperty('display', 'none');
            box1ButtonContainer.style.setProperty('display', 'none');
            box2ButtonContainer.style.setProperty('display', 'none');
            box3ButtonContainer.style.setProperty('display', 'none');
            assumptionsButtonContainer.style.setProperty('display', 'inline');
            resetButtonContainer.style.setProperty('display', 'inline');
            break;
    }
    saveSettings();
}

function perceivedButtonFunction() {
    switch(phase) {
        case 0:
            setPhase(1);
            break;
        case 1:
        case 2:
            break;
    }
    saveSettings();
}

function assumptionsButtonFunction() {
    switch(phase) {
        case 0:
            break;
        case 1:
            setPhase(2);
            break;
        case 2:
            break;
    }
    saveSettings();
}

function resetButtonFunction() {
    switch(phase) {
        case 0:
            break;
        case 1:
        case 2:
            setPhase(0);
            break;
    }
    saveSettings();
}

perceivedButton = document.getElementById('perceived');
perceivedButton.onclick = perceivedButtonFunction;

box1Button = document.getElementById('box1');
box1Button.onclick = function () {
    toggle_item_pos(0);
}

box2Button = document.getElementById('box2');
box2Button.onclick = function () {
    toggle_item_pos(1);
}

box3Button = document.getElementById('box3');
box3Button.onclick = function () {
    toggle_item_pos(2);
}

assumptionsButton = document.getElementById('assumptions');
assumptionsButton.onclick = assumptionsButtonFunction;

resetButton = document.getElementById('reset');
resetButton.onclick = resetButtonFunction;

textfield = document.getElementById('textfield');

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 49: // 1 key
            toggle_item_pos(0);
            break;
        case 50: // 2 key
            toggle_item_pos(1);
            break;
        case 51: // 3 key
            toggle_item_pos(2);
            break;
        case 69: // e key
            switch (phase) {
                case 0:
                    perceivedButtonFunction();
                    break;
                case 1:
                case 2:
                    assumptionsButtonFunction();
                    break;
            }
            break;
        case 82: // r key
            resetButtonFunction();
            break;
    }
});

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {xpos: (event.clientX - rect.left) * scaleX, ypos: (event.clientY - rect.top) * scaleY};
}

function collides_with_rect(cursor, item) {
    return (cursor.xpos > item.xpos && cursor.xpos < item.xpos+item.width && cursor.ypos >= item.ypos && cursor.ypos <= item.ypos+item.height);
}

function collides_with_middle_rect(cursor, item) {
    return (cursor.xpos > item.midX-item.width/2 && cursor.xpos < item.midX+item.width/2 && cursor.ypos >= item.midY-item.height/2 && cursor.ypos <= item.midY+item.height/2);
}

function collides_with_circ(cursor, item) {
    let distance = Math.sqrt((item.midX - cursor.xpos)*(item.midX - cursor.xpos) + (item.midY - cursor.ypos)*(item.midY - cursor.ypos));
    return (-item.rad < distance && distance < item.rad);
}

function collides_with_triangle(cursor, item) {
    return collides_with_circ(cursor, {midX: item.midX, midY: item.midY, rad: item.edges/2});
}

canvas.addEventListener('mousedown', (e) => {
    let cursor = getCursorPosition(canvas, e);
    switch(phase) {
        case 0:
            for (let i = phase0_orders.length-1; i >= 0; i--) {
                let item = phase0_items[phase0_orders[i]]();
                if (collides_with_rect(cursor, item)) {
                    toggle_item_pos(phase0_orders[i]);
                    break;
                }
            }
            break;
        case 1:
        case 2:
            if (collides_with_circ(cursor, get_item_circ())) {
                grabbed = 3;
                break;
            }
            if (collides_with_middle_rect(cursor, get_item_rect())) {
                grabbed = 2;
                break;
            }
            if (collides_with_triangle(cursor, get_item_triangle())) {
                grabbed = 1;
                break;
            }
            break;
    }
    saveSettings();
});

canvas.addEventListener('mouseup', (e) => {
    grabbed = 0;
});

canvas.addEventListener('mousemove', (e) => {
    mousepos = getCursorPosition(canvas, e);
});

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    phase = 0;
    grabbed = 0;
}

function reset() {
    phase = 0;
    grabbed = 0;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 2) {
            FPS = parseInt(paramList[0].split('=')[1]);
            phase = parseInt(paramList[1].split('=')[1]);
            saveSettings();
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&phase=' + phase);
}

// logic helper functions

function toggle_item_pos(item) {
    if (phase != 0) {
        return;
    }
    let item_pos = phase0_orders.indexOf(item);
    if (item_pos > -1) {
        phase0_orders.splice(item_pos, 1);
        if (item_pos > phase0_orders.length/2-1) {
            phase0_orders = [item].concat(phase0_orders);
        } else {
            phase0_orders = phase0_orders.concat([item]);
        }
    }
    saveSettings();
    draw();
}

function draw_triangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.fill();
}

function draw_triangle_from_middle(midX, midY, line_length) {
    let x1 = midX - line_length/2;
    let y1 = midY + Math.sqrt(line_length*line_length - (line_length/2)*(line_length/2))/2;
    let y3 = y1 - Math.sqrt(line_length*line_length - (line_length/2)*(line_length/2));
    draw_triangle(x1, y1, x1+line_length, y1, midX, y3);
}

function draw_rect_from_middle(midX, midY, width, height) {
    ctx.fillRect(midX-width/2, midY-height/2, width, height);
}

function draw_circ(x, y, rad) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2*Math.PI);
    ctx.fill();
}

function draw_phase0() {
    for (let i = 0; i < phase0_orders.length; i++) {
        ctx.fillStyle = phase0_colors[phase0_orders[i]]();
        let item = phase0_items[phase0_orders[i]]();
        ctx.fillRect(item.xpos, item.ypos, item.width, item.height);
    }
}

function draw_second_phase() {
    let item_triangle = get_item_triangle();
    let item_rect = get_item_rect();
    let item_circ = get_item_circ();
    
    if (grabbed != 1) {
        ctx.fillStyle = getDefaultShapeColor();
        draw_triangle_from_middle(item_triangle.midX, item_triangle.midY, item_triangle.edges);
    }
    if (grabbed != 2) {
        ctx.fillStyle = getTertiaryColor();
        draw_rect_from_middle(item_rect.midX, item_rect.midY, item_rect.width, item_rect.height);
    }
    
    ctx.fillStyle = getDefaultBGColor();
    draw_circ(item_circ.midX, item_circ.midY, item_circ.rad);
    
    switch (grabbed) {
        case 0:
            break;
        case 1:
            ctx.fillStyle = getDefaultShapeColor();
            draw_triangle_from_middle(mousepos.xpos, mousepos.ypos, item_triangle.edges);
            ctx.fillStyle = getDefaultBGColor();
            draw_circ(mousepos.xpos-(item_triangle.midX-item_circ.midX), mousepos.ypos-(item_triangle.midY-item_circ.midY), item_circ.rad);
            ctx.fillStyle = getTertiaryColor();
            draw_rect_from_middle(item_rect.midX, item_rect.midY, item_rect.width, item_rect.height);
            break;
        case 2:
            ctx.fillStyle = getTertiaryColor();
            draw_rect_from_middle(mousepos.xpos, mousepos.ypos, item_rect.width, item_rect.height);
            ctx.fillStyle = getDefaultBGColor();
            draw_circ(mousepos.xpos-(item_rect.midX-item_circ.midX), mousepos.ypos-(item_rect.midY-item_circ.midY), item_circ.rad);
            ctx.fillStyle = getDefaultShapeColor();
            draw_triangle_from_middle(item_triangle.midX, item_triangle.midY, item_triangle.edges);
            break;
        case 3:
            ctx.fillStyle = getSecondaryColor();
            draw_circ(mousepos.xpos, mousepos.ypos, item_circ.rad);
            break;
    }
    
    if (grabbed != 3) {
        ctx.fillStyle = getSecondaryColor();
        draw_circ(item_circ.midX, item_circ.midY, item_circ.rad);
    }
}

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    
    switch(phase) {
        case 0:
            draw_phase0();
            break;
        case 1:
        case 2:
            draw_second_phase();
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    now = Date.now();
    elapsed = now - then;
        
    if (elapsed > (1000 / FPS)) {
        then = now;
        draw();
    }
}
