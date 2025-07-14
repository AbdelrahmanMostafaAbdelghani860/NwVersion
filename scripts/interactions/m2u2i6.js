// G =k * w * e  G die wahrgenommene Größe, 
//k ein Proportionalitätsfaktor, w der Winkel, unter dem das betrachtete Objekt erscheint und e die Objektentfernung
//Der Proportionalitätsfaktor k ist ein unbestimmter Wert, der für diese Betrachtung auch fortgelassen werden kann;
// die menschliche Größenwahrnehmung ist ja nicht absolut
// also : G ~ w * e
// G1/G2 = w1/w2
//in dieser Interaktion nehmen wir einen konstanten Winkel an un verändern e, um die Auswirkung aud G zu sehen

const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// Functions for accessing CSS values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}

// Set canvas resolution
canvas.width = window.innerWidth;
canvas.height = canvas.width / 2; // Alternatively: = window.innerHeight
let middleOfCanvas = canvas.width/2;

//load image
let eye = new Image();
eye.src = `../resources/interactions/m2u2i6/eye.png`;

// Bildgröße auf die Canvas-Größe anpassen
let scaleFactor = 0;
let width = 0;
let height = 0;

let eyeX = 0;
let offset = 0;
let eyeY = 0;
let currentEyeX = 0; 
let eyeMaxPosDiff = 0; //the difference of pos between slider=0 and 100 for eye

eye.onload = function() {
    // Calculate image size after it has loaded
    scaleFactor = Math.min(canvas.width / eye.width, canvas.height / eye.height);
    width = eye.width * scaleFactor;
    height = eye.height * scaleFactor;

    eyeX = canvas.width / 2 - eye.width;
    offset = -width / 1.5;
    eyeY = (canvas.height - height) / 2;
    currentEyeX = eyeX; // Initially the same

    currentScreenX = canvas.width * 0.5; 

    eyeMaxPosDiff = middleOfCanvas - eyeX;

    // Now it's safe to call updatePositions
    updatePositions();
};


let screenX = canvas.width * 0.5;
let currentScreenX = screenX; //initially the same
let screenMaxPosDiff = canvas.width - screenX; //the difference of pos between slider=0 and 100 for screen

// Event Listener zu slider hinzufügen
document.getElementById('sliderEye').addEventListener('input', function() {
    updateEyeX();
    updatePositions();
});

document.getElementById('sliderScreen').addEventListener('input', function() {
    updateScreenX();
    updatePositions();
});


function updateEyeX(){
    if (!eye.complete) return;
    let eyeValue = document.getElementById('sliderEye').value;
    let eyeMaxPos = canvas.width / 2 - (width / 2); // Position, wenn das rechte Ende des Auges die Mitte der Canvas berührt
    currentEyeX = offset + (eyeMaxPos - offset) * (eyeValue / 100)*0.25;
    moveEye();
    console.log(currentEyeX);
}

function updateScreenX(){
    let screenValue = document.getElementById('sliderScreen').value;
    currentScreenX = canvas.width * 0.5 + (canvas.width * 0.45) * (screenValue / 100);
    console.log(currentScreenX);
}

function moveEye() {
    if (!eye.complete) return;
    // Bild auf die Canvas
    ctx.drawImage(eye, currentEyeX, eyeY, width, height);

    // Zeichnen Sie eine graue Linie auf der Canvas
    ctx.fillStyle = "#333"; // graue Farbe
    ctx.fillRect(currentScreenX, 0, canvas.width * 0.1, canvas.height);
}

function moveScreen() {
    // Bild auf die Canvas
    ctx.drawImage(eye, currentEyeX, eyeY, width, height);

    // Zeichnen Sie eine graue Linie auf der Canvas
    ctx.fillStyle = "#333"; // graue Farbe
    ctx.fillRect(currentScreenX, 0, canvas.width * 0.1, canvas.height);
}

function updatePositions() {
    if (!eye.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bild auf die Canvas
    ctx.drawImage(eye, currentEyeX, eyeY, width, height);

    // Zeichnen Sie eine graue Linie auf der Canvas
    ctx.fillStyle = "#333"; // graue Farbe
    ctx.fillRect(currentScreenX, 0, canvas.width * 0.1, canvas.height);

    drawLines();
}

function drawLines() {
    // Berechnen Sie die Positionen der Linien
    let eyeRightEdge = currentEyeX + width;
    let eyeMiddleY = eyeY + height / 2;
    let screenLeftEdge = currentScreenX;

    // Berechnen Sie die Steigung der Linien
    let angle1 = Math.PI / 9; // 20° in Radiant
    let angle2 = -Math.PI / 9; // -20° in Radiant

    // Berechnen Sie die Y-Positionen, wo die Linien den Bildschirm treffen
    let line1Y = eyeMiddleY + (screenLeftEdge - eyeRightEdge) * Math.tan(angle1);
    let line2Y = eyeMiddleY + (screenLeftEdge - eyeRightEdge) * Math.tan(angle2);

    // Zeichnen Sie die erste Linie
    ctx.beginPath();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // gepunktete Linie
    ctx.moveTo(eyeRightEdge, eyeMiddleY);
    ctx.lineTo(screenLeftEdge, line1Y);
    ctx.stroke();

    // Zeichnen Sie die zweite Linie
    ctx.beginPath();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // gepunktete Linie
    ctx.moveTo(eyeRightEdge, eyeMiddleY);
    ctx.lineTo(screenLeftEdge, line2Y);
    ctx.stroke();

    // Zeichnen Sie ein rotes vertikales Rechteck zwischen den beiden Linien
    let rectX = screenLeftEdge;
    let rectY = Math.min(line1Y, line2Y);
    let rectHeight = Math.abs(line1Y - line2Y);
    let rectWidth = canvas.width * 0.05; // Anpassen der Breite des Rechtecks
    
    ctx.fillStyle = "#FF0000"; // rote Farbe
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Zurücksetzen der Linienstil-Eigenschaften
    ctx.setLineDash([]);
}


