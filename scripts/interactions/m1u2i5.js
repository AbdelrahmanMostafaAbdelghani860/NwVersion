const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}

// otherwise canvas resolution scales too low
canvas.width = window.innerWidth;
canvas.height = canvas.width/2; // alternatively: = window.innerHeight

let FPS = 30;

elements = [
  {x: 0, y: 1, width: 1, height: 4},
  {x: 3, y: 0, width: 1, height: 5},
  {x: 5, y: 0, width: 1, height: 5},
  {x: 8, y: 0, width: 1, height: 1},
  {x: 8, y: 3, width: 1, height: 2},
  {x: 11, y: 0, width: 1, height: 5},
  {x: 2, y: 1, width: 1, height: 4},
  {x: 7, y: 1, width: 1, height: 4},
  {x: 9, y: 1, width: 1, height: 4},
  {x: 13, y: 1, width: 2, height: 1},
  {x: 13, y: 3, width: 2, height: 1}
];

element_pointer = 0;

init();

// SLIDERS & BUTTONS

addButton = document.getElementById('add');
addButton.onclick = add_element;

function add_element() {
  if (element_pointer <= elements.length) {
    element_pointer += 1
  }
  saveSettings();
}

resetButton = document.getElementById('reset');
resetButton.onclick = reset_elements;

function reset_elements() {
    element_pointer = 0;
    saveSettings();
}

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 69: // e key
            add_element();
            break;
        case 82: // r key
            reset_elements();
            break;
    }
});

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    element_pointer = 0;
}

function reset() {
    element_pointer = 0;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 2) {
            FPS = parseInt(paramList[0].split('=')[1]);
            element_pointer = parseInt(paramList[1].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&element_pointer=' + element_pointer);
}

// logic helper functions

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.strokeStyle = getDefaultShapeColor();
    ctx.lineWidth = Math.ceil(0.01*canvas.height);
    
    area = {x: 1/17*canvas.width, y: 0.5*canvas.height-2.5/17*canvas.width, width: 15/17*canvas.width, height: 5/17*canvas.width};
    
    for (let i = 0; i < element_pointer && i < elements.length; i++) {
      ctx.fillRect(area.x+elements[i].x*1/17*canvas.width-1, area.y+elements[i].y*1/17*canvas.width-1, elements[i].width*1/17*canvas.width+2, elements[i].height*1/17*canvas.width+2);
    }
    
    if (element_pointer > elements.length) {
      ctx.beginPath();
      ctx.moveTo(area.x, area.y);
      ctx.lineTo(area.x+area.width, area.y);
      ctx.lineTo(area.x+area.width, area.y+area.height);
      ctx.lineTo(area.x, area.y+area.height);
      ctx.lineTo(area.x, area.y);
      ctx.stroke();
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
