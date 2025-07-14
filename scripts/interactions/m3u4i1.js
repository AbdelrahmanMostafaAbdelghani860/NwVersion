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
contrast = 220;

init();

// SLIDERS & BUTTONS

startButton = document.getElementById('start');
startButton.onclick = toggleStarted;

function toggleStarted() {
    started = !started;
    if (started) {
        startButton.value = '⏸';
    } else {
        startButton.value = '⏵';
    }
}

reverseButton = document.getElementById('reverse');
reverseButton.onclick = toggleReverse;

function toggleReverse() {
    reverse = !reverse;
    if (reverse) {
        reverseButton.value = '->';
    } else {
        reverseButton.value = '<-';
    }
    saveSettings();
}

/**contrastSlider = document.getElementById('contrast');
contrastSlider.oninput = function() {
    contrast = parseInt(this.value);
    saveSettings();
}
contrastSlider.value = contrast;**/

// KEY INPUT

/**window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 65: // a key
            contrast = contrast - 10;
            if (contrast < 64) {
                contrast = 64;
            }
            contrastSlider.value = contrast;
            saveSettings();
            break;
        case 68: // d key
            contrast = contrast + 20;
            if (contrast > 255) {
                contrast = 255;
            }
            contrastSlider.value = contrast;
            saveSettings();
            break;
        case 69: // e key
            toggleStarted();
            break;
        case 81: // q key
            toggleReverse();
            break;
    }
});**/

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    started = false;
    reverse = false;
    barsize = 30;
    distance = 50;
    offset = 0;
    speed = 210;
    contrast = 220;
}

function reset() {
    reverse = false;
    barsize = 30;
    distance = 50;
    offset = 0;
    speed = 210;
    contrast = 220;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 7) {
            FPS = parseInt(paramList[0].split('=')[1]);
            reverse = parseInt(paramList[1].split('=')[1]) == 1;
            barsize = parseInt(paramList[2].split('=')[1]);
            distance = parseInt(paramList[3].split('=')[1]);
            offset = parseInt(paramList[4].split('=')[1]);
            speed = parseInt(paramList[5].split('=')[1]);
            contrast = parseInt(paramList[6].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&reverse=' + (0 + reverse) + '&barsize=' + barsize + '&distance=' + distance + '&offset=' + offset + '&speed=' + speed + '&contrast=' + contrast);
}

// logic helper functions

// all drawing (and per frame logic) in here
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultShapeColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bereich für animierte Streifen (80% der Breite)
    const stripesWidth = canvas.width * 0.8; // 80% der Canvas-Breite
    const stripesStartX = (canvas.width - stripesWidth) / 2; // Zentriert
    const stripesHeight = canvas.height * 0.8; // 80% der Höhe
    const stripesStartY = (canvas.height - stripesHeight) / 2; // Zentriert

    ctx.fillStyle = "rgb(" + contrast + ", " + contrast + ", " + contrast + ")";
    ctx.strokeStyle = "rgb(" + contrast + ", " + contrast + ", " + contrast + ")";

    if (started) {
        if (!reverse) {
            if (offset >= distance / 1000 * stripesWidth) {
                offset = 0;
            }
            offset += speed / FPS;
        } else {
            if (offset <= -distance / 1000 * stripesWidth) {
                offset = 0;
            }
            offset -= speed / FPS;
        }
    }

    // Zeichne animierte vertikale Streifen im begrenzten Bereich
    ctx.save();
    ctx.beginPath();
    ctx.rect(stripesStartX, stripesStartY, stripesWidth, stripesHeight); // Begrenzung des Zeichnungsbereichs
    ctx.clip();

    for (let i = -distance; i <= 1000 + distance; i += distance) {
        ctx.fillRect(
            stripesStartX + i / 1000 * stripesWidth + offset,
            stripesStartY,
            (distance / 1000 * stripesWidth) / 2,
            stripesHeight
        );
    }
    ctx.restore();

    // Zeichne die statische mittlere schwarze horizontale Linie
    const middleHeight = canvas.height * 0.3; // Höhe des mittleren schwarzen Bereichs (30% der Höhe)
    const middleStartY = (canvas.height - middleHeight) / 2;

    ctx.fillStyle = "Black";
    ctx.fillRect(0, middleStartY, canvas.width, middleHeight);
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
