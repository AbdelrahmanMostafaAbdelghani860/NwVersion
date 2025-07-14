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

cueButtonContainer = document.getElementById('cueButtonContainer');
overviewButtonContainer = document.getElementById('overviewButtonContainer');
resetButtonContainer = document.getElementById('resetButtonContainer');
dolphinButtonContainer = document.getElementById('dolphinButtonContainer');
seagullButtonContainer = document.getElementById('seagullButtonContainer');
phase4button1Container = document.getElementById('phase4button1Container');
phase4button2Container = document.getElementById('phase4button2Container');
phase4button3Container = document.getElementById('phase4button3Container');
phase4button4Container = document.getElementById('phase4button4Container');
phase4button5Container = document.getElementById('phase4button5Container');
phase4button6Container = document.getElementById('phase4button6Container');

FPS = 30;
phase = 0;
mousepos = {xpos: 0, ypos: 0};

let textfieldKeys = ['instructions', 'instructions2', 'instructions3', 'instructions4'];

first_phase_items = [
    function () {return {midX: 0.25*canvas.width, midY: 0.5*canvas.height, width: 0.2*canvas.width, height: 0.6*canvas.height};},
    function () {return {midX: 0.5*canvas.width, midY: 0.425*canvas.height, width: 0.15*canvas.width, height: 0.45*canvas.height};},
    function () {return {midX: 0.75*canvas.width, midY: 0.35*canvas.height, width: 0.1*canvas.width, height: 0.3*canvas.height};}
];

second_phase_items = [
    function () {return {midX: 0.75*canvas.width, midY: 0.65*canvas.height, rad: 0.1*canvas.height};},
    function () {return {midX: 0.2*canvas.width, midY: 0.55*canvas.height, rad: 0.08*canvas.height};},
    function () {return {midX: 0.5*canvas.width, midY: 0.25*canvas.height, width: 0.08*canvas.width, height: 0.04*canvas.height};},
    function () {return {midX: 0.75*canvas.width, midY: 0.1*canvas.height, width: 0.1*canvas.width, height: 0.05*canvas.height};}
];

init();

// SLIDERS

function nextPhase() {
    setPhase((phase + 1) % 4);
}

function setPhase(newPhase) {
    phase = newPhase;
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    textfield.style.color = "inherit";
    switch(phase) {
        case 0:
            first_phase_clicked = [0, 0];
            cueButtonContainer.style.setProperty('display', 'inline');
            overviewButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer.style.setProperty('display', 'none');
            dolphinButtonContainer.style.setProperty('display', 'none');
            seagullButtonContainer.style.setProperty('display', 'none');
            phase4button1Container.style.setProperty('display', 'none');
            phase4button2Container.style.setProperty('display', 'none');
            phase4button3Container.style.setProperty('display', 'none');
            phase4button4Container.style.setProperty('display', 'none');
            phase4button5Container.style.setProperty('display', 'none');
            phase4button6Container.style.setProperty('display', 'none');
            break;
        case 1:
            cueButtonContainer.style.setProperty('display', 'inline');
            overviewButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer.style.setProperty('display', 'none');
            dolphinButtonContainer.style.setProperty('display', 'inline');
            seagullButtonContainer.style.setProperty('display', 'inline');
            phase4button1Container.style.setProperty('display', 'none');
            phase4button2Container.style.setProperty('display', 'none');
            phase4button3Container.style.setProperty('display', 'none');
            phase4button4Container.style.setProperty('display', 'none');
            phase4button5Container.style.setProperty('display', 'none');
            phase4button6Container.style.setProperty('display', 'none');
            break;
        case 2:
            third_phase_toggled = false;
            cueButtonContainer.style.setProperty('display', 'none');
            overviewButtonContainer.style.setProperty('display', 'inline');
            resetButtonContainer.style.setProperty('display', 'none');
            dolphinButtonContainer.style.setProperty('display', 'none');
            seagullButtonContainer.style.setProperty('display', 'none');
            phase4button1Container.style.setProperty('display', 'none');
            phase4button2Container.style.setProperty('display', 'none');
            phase4button3Container.style.setProperty('display', 'none');
            phase4button4Container.style.setProperty('display', 'none');
            phase4button5Container.style.setProperty('display', 'none');
            phase4button6Container.style.setProperty('display', 'none');
            break;
        case 3:
            cueButtonContainer.style.setProperty('display', 'none');
            overviewButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer.style.setProperty('display', 'inline');
            dolphinButtonContainer.style.setProperty('display', 'none');
            seagullButtonContainer.style.setProperty('display', 'none');
            phase4button1Container.style.setProperty('display', 'inline');
            phase4button2Container.style.setProperty('display', 'inline');
            phase4button3Container.style.setProperty('display', 'inline');
            phase4button4Container.style.setProperty('display', 'inline');
            phase4button5Container.style.setProperty('display', 'inline');
            phase4button6Container.style.setProperty('display', 'inline');
            break;
    }
    saveSettings();
}

function cueButtonFunction() {
    switch(phase) {
        case 0:
            setPhase(1);
            break;
        case 1:
            setPhase(2);
            break;
        case 2:
        case 3:
            break;
    }
    saveSettings();
}

function overviewButtonFunction() {
    switch(phase) {
        case 0:
        case 1:
            break;
        case 2:
            setPhase(3);
            break;
        case 3:
            break;
    }
    saveSettings();
}

function resetButtonFunction() {
    switch(phase) {
        case 0:
        case 1:
        case 2:
            break;
        case 3:
            setPhase(0);
            break;
    }
    saveSettings();
}

cueButton = document.getElementById('cue');
cueButton.onclick = cueButtonFunction;

overviewButton = document.getElementById('overview');
overviewButton.onclick = overviewButtonFunction;

resetButton = document.getElementById('reset');
resetButton.onclick = resetButtonFunction;

dolphinAButton = document.getElementById('dolphinA');
dolphinAButton.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions2-dolphin-wrong'];
    textfield.style.color = "red";
}

dolphinBButton = document.getElementById('dolphinB');
dolphinBButton.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions2-dolphin-correct'];
    textfield.style.color = "green";
}

seagullCButton = document.getElementById('seagullC');
seagullCButton.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions2-seagull-wrong'];
    textfield.style.color = "red";
}

seagullDButton = document.getElementById('seagullD');
seagullDButton.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions2-seagull-correct'];
    textfield.style.color = "green";
}

p4b1Button = document.getElementById('p4b1');
p4b1Button.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-1'];
}

p4b2Button = document.getElementById('p4b2');
p4b2Button.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-2'];
}

p4b3Button = document.getElementById('p4b3');
p4b3Button.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-3'];
}

p4b4Button = document.getElementById('p4b4');
p4b4Button.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-4'];
}

p4b5Button = document.getElementById('p4b5');
p4b5Button.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-5'];
}

p4b6Button = document.getElementById('p4b6');
p4b6Button.onclick = function () {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-6'];
}

textfield = document.getElementById('textfield');

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 49: // 1 key
            if (phase == 3) {
                textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-1'];
            }
            break;
        case 50: // 2 key
            if (phase == 3) {
                textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-2'];
            }
            break;
        case 51: // 3 key
            if (phase == 3) {
                textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-3'];
            }
            break;
        case 52: // 4 key
            if (phase == 3) {
                textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-4'];
            }
            break;
        case 53: // 5 key
            if (phase == 3) {
                textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-5'];
            }
            break;
        case 54: // 6 key
            if (phase == 3) {
                textfield.textContent = languages[localStorage.getItem('lang')]['instructions4-6'];
            }
            break;
        case 69: // e key
            switch (phase) {
                case 0:
                case 1:
                    cueButtonFunction();
                    break;
                case 2:
                    overviewButtonFunction();
                    break;
                case 3:
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
            for (let i = 0; i < first_phase_items.length; i++) {
                if (collides_with_middle_rect(cursor, first_phase_items[i]())) {
                    if (first_phase_clicked[0] == 0) {
                        first_phase_clicked[0] = i+1;
                    } else if (first_phase_clicked[1] == 0) {
                        first_phase_clicked[1] = i+1;
                        if (first_phase_clicked[0] == 1 && first_phase_clicked[1] == 3) {
                            // correct
                            textfield.textContent = languages[localStorage.getItem('lang')]['instructions-correct'];
                            textfield.style.color = "green";
                        } else {
                            // wrong
                            textfield.textContent = languages[localStorage.getItem('lang')]['instructions-wrong'];
                            textfield.style.color = "red";
                        }
                    }
                    return;
                }
            }
            break;
        case 1:
            break;
        case 2:
            if (collides_with_rect(cursor, {xpos: 0, ypos: 0, width: canvas.width, height: canvas.height})) {
                third_phase_toggled = !third_phase_toggled;
            }
            break;
        case 3:
            break;
    }
    saveSettings();
});

canvas.addEventListener('mouseup', (e) => {
    return;
});

canvas.addEventListener('mousemove', (e) => {
    mousepos = getCursorPosition(canvas, e);
});

// main
loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    phase = 0;
    first_phase_clicked = [0, 0];
    third_phase_toggled = false;
}

function reset() {
    phase = 0;
    first_phase_clicked = [0, 0];
    third_phase_toggled = false;
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

function draw_first_phase() {
    for (let i = 0; i < first_phase_items.length; i++) {
        let item = first_phase_items[i]();
        draw_rect_from_middle(item.midX, item.midY, item.width, item.height);
    }
}

function draw_second_phase() {
    ctx.lineWidth = Math.ceil(canvas.height/200);
    ctx.strokeStyle = getTertiaryColor();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
    for (let i = canvas.height/50; canvas.width/2 + i < canvas.width; i = i*2) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height/2 + i);
        ctx.lineTo(canvas.width, canvas.height/2 + i);
        ctx.stroke();
    }
    for (let i = canvas.width/40; i < canvas.width; i = i + canvas.width/20) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height/2);
        ctx.lineTo(canvas.width/2+canvas.height/200*(i-canvas.width/2), canvas.height);
        ctx.stroke();
    }
    let item = second_phase_items[0]();
    draw_circ(item.midX, item.midY, item.rad);
    item = second_phase_items[1]();
    draw_circ(item.midX, item.midY, item.rad);
    item = second_phase_items[2]();
    draw_rect_from_middle(item.midX, item.midY, item.width, item.height);
    item = second_phase_items[3]();
    draw_rect_from_middle(item.midX, item.midY, item.width, item.height);
}

function draw_third_phase() {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 3; i++) {
            if (third_phase_toggled) {
                draw_circ((
                    0.5-Math.pow(2, j)*0.05)*canvas.width+i*Math.pow(2, j)*0.05*canvas.width, 
                    0.125/3*canvas.height+Math.pow(2, j)*0.25/3*canvas.height, 
                    Math.pow(2, j)*0.025*canvas.height
                );
            } else {
                draw_circ(0.3*canvas.width+i*0.2*canvas.width, 0.125*canvas.height+j*0.25*canvas.height, 0.1*canvas.height);
            }
        }
    }
}

function draw_fourth_phase() {
    return;
}

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.strokeStyle = getDefaultShapeColor();
    
    switch(phase) {
        case 0:
            draw_first_phase();
            break;
        case 1:
            draw_second_phase();
            break;
        case 2:
            draw_third_phase();
            break;
        case 3:
            draw_fourth_phase();
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

