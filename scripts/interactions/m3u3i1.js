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

// KEY INPUT

window.addEventListener('keydown', function(k) {
    switch (k.keyCode) {
        case 69: // e key
            toggleStarted();
            break;
        case 81: // q key
            toggleReverse();
            break;
    }
});

loadSettings();

let then = Date.now();
animate();

// initializes all necessary global variables to default values
function init() {
    started = false;
    reverse = false;
    circsize = 10;
    distance = 100;
    offset = 0;
    speed = 300;
}

function reset() {
    reverse = false;
    circsize = 10;
    distance = 100;
    offset = 0;
    speed = 300;
    saveSettings();
}

function loadSettings() {
    // loaded from Session Storage if available
    if (sessionStorage.getItem('settings') != '') {
        var paramList = sessionStorage.getItem('settings').split('&');
        if (paramList.length == 6) {
            FPS = parseInt(paramList[0].split('=')[1]);
            reverse = parseInt(paramList[1].split('=')[1]) == 1;
            circsize = parseInt(paramList[2].split('=')[1]);
            distance = parseInt(paramList[3].split('=')[1]);
            offset = parseInt(paramList[4].split('=')[1]);
            speed = parseInt(paramList[5].split('=')[1]);
        }
    }
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&reverse=' + (0 + reverse) + '&circsize=' + circsize + '&distance=' + distance + '&offset=' + offset + '&speed=' + speed);
}

const airplaneImage = new Image();
airplaneImage.src = '../resources/icon/satellite.png';

const skyImage = new Image();
skyImage.src = '../resources/icon/sky.jpg';

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hintergrundbild zeichnen (zyklisch)
    if (skyImage.complete) {
        const bgWidth = canvas.width; // Hintergrundbreite entspricht Canvas-Breite
        const bgHeight = canvas.height; // Hintergrundhöhe entspricht Canvas-Höhe

        // Hintergrundbewegung
        if (started) {
            if (reverse) {
                offset += speed / FPS; // Bewegung nach rechts
                if (offset >= bgWidth) offset = 0; // Zyklus zurücksetzen
            } else {
                offset -= speed / FPS; // Bewegung nach links
                if (offset <= -bgWidth) offset = 0; // Zyklus zurücksetzen
            }
        }

        // Hintergrundbilder zeichnen
        ctx.drawImage(skyImage, offset, 0, bgWidth, bgHeight); // Hauptbild
        ctx.drawImage(skyImage, offset - bgWidth, 0, bgWidth, bgHeight); // Linkes Bild
        ctx.drawImage(skyImage, offset + bgWidth, 0, bgWidth, bgHeight); // Rechtes Bild
    }

    // Flugzeug in der Mitte des Bildschirms zeichnen
    if (airplaneImage.complete) {
        const airplaneWidth = 0.25 * canvas.width; // Flugzeugbreite
        const airplaneHeight = 0.4 * canvas.height; // Flugzeughöhe

        ctx.save(); // Speichert den aktuellen Canvas-Zustand

        // Spiegeln, wenn `reverse` aktiv ist
        if (reverse) {
            ctx.scale(-1, 1); // Horizontal spiegeln
            ctx.drawImage(
                airplaneImage,
                -(canvas.width / 2 + airplaneWidth / 2), // Invers für gespiegelte Position
                canvas.height / 2 - airplaneHeight / 2,
                airplaneWidth,
                airplaneHeight
            );
        } else {
            // Normales Zeichnen, wenn nicht umgekehrt
            ctx.drawImage(
                airplaneImage,
                canvas.width / 2 - airplaneWidth / 2, // Horizontal zentrieren
                canvas.height / 2 - airplaneHeight / 2, // Vertikal zentrieren
                airplaneWidth,
                airplaneHeight
            );
        }

        ctx.restore(); // Canvas-Zustand wiederherstellen
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

