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

let reversed = false;
let figures_shown = false;

init();

// LOADING RESOURCES

const img = new Image();
img.src = "../resources/interactions/m1u2i4/m1u2i4.png";

const img_reversed = new Image();
img_reversed.src = "../resources/interactions/m1u2i4/m1u2i4_reversed.png";

const img_figures = new Image();
img_figures.src = "../resources/interactions/m1u2i4/m1u2i4_figures.png";

const img_reversed_figures = new Image();
img_reversed_figures.src = "../resources/interactions/m1u2i4/m1u2i4_reversed_figures.png";

// SLIDERS & BUTTONS

textfield = document.getElementById('textfield');

reverseButton = document.getElementById('reverse');
reverseButton.onclick = reverse;

function reverse() {
  reversed = !reversed;
  if (reversed) {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions2'];
  } else {
    textfield.textContent = languages[localStorage.getItem('lang')]['instructions'];
  }
  saveSettings();
}

figuresButton = document.getElementById('figures');
figuresButton.onclick = show_figures;

function show_figures() {
    figures_shown = !figures_shown;
    saveSettings();
}

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 69: // e key
            show_figures();
            break;
        case 81: // q key
            reverse();
            break;
    }
});

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    reversed = false;
    figures_shown = false;
}

function reset() {
    reversed = false;
    figures_shown = false;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 3) {
            FPS = parseInt(paramList[0].split('=')[1]);
            reversed = paramList[1].split('=')[1] === 'true';
            figures_shown = paramList[2].split('=')[1] === 'true';
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&reversed=' + reversed + '&figures_shown=' + figures_shown);
}

// logic helper functions

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (reversed) {
        if (figures_shown) {
            ctx.drawImage(img_reversed_figures, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(img_reversed, 0, 0, canvas.width, canvas.height);
        }
    } else {
        if (figures_shown) {
            ctx.drawImage(img_figures, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
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
