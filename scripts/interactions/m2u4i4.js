const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

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

canvas.width = window.innerWidth;
canvas.height = canvas.width/2;

const sliderContainer = document.getElementById('sliderContainer');
const realWordContainer = document.getElementById('realWorlContainer');

FPS = 30;
phase = 0;

let textfieldKeys = ['instructions', 'instruction2'];

init()


// Sliders
function nextPhase() {
    setPhase((phase + 1) % 2);
}

function setPhase(newPhase) {
    phase = newPhase;
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    textfield.style.color = 'inherit';

    // Parameterbereich nur in Phase 2 anzeigen
    const parameterArea = document.getElementById("parameterArea");

    switch(phase) {
        case 0:
            first_phase_clicked = [0, 0];
            parameterArea.style.display = "block";
            sliderContainer.style.setProperty('display', 'inline');
            realWordContainer.style.setProperty('display', 'none');
            break;
        case 1:
            parameterArea.style.display = "none";
            sliderContainer.style.setProperty('display', 'none');
            realWordContainer.style.setProperty('display', 'inline');
            showImage('imag1');
            break;
    }
    saveSettings();
}
function realWorldFunction() {
    switch(phase) {
        case 0:
            setPhase(1);
            break;
        case 1:
            break;
    }
    saveSettings();
}
function resetButtonFunction() {
    switch(phase) {
        case 0:
        case 1:
            setPhase(0);
            break;
    }
    saveSettings();
}

realWorldButton = document.getElementById('realWorld');
realWorldButton.onclick = realWorldFunction;

resetButton = document.getElementById('return')
resetButton.onclick = resetButtonFunction;

loadSettings();
let then = Date.now();
animate();

function init() {
    first_phase_clicked = [0, 0];
    second_phase_toggled = false;
}

function reset() {
    phase = 0;
    first_phase_clicked = [0, 0];
    second_phase_toggled = false;
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

const slider = document.getElementById('slider');



function draw_first_phase() {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width/2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sliderValue = parseFloat(slider.value);
    const yBase = canvas.height / 2; // Mittelpunkt für Zylinder
    const xLeftView = canvas.width / 4; // Linke Augenansicht
    const xRightView = (canvas.width * 3) / 4; // Rechte Augenansicht

    console.log("Drawing Left Eye View...");
    drawLeftEyeView(ctx, xLeftView, yBase, sliderValue);

    console.log("Drawing Middle Scene...");
    drawMiddleScene(ctx, sliderValue);

    console.log("Drawing Right Eye View...");
    drawRightEyeView(ctx, xRightView, yBase, sliderValue);
}

function drawLeftEyeView(ctx, xCenter, yBase, sliderValue) {
    // Basiswerte für Zylinder
    const cylinderWidth = 40;
    const baseHeight = 100; // Grundhöhe
    const dynamicHeight = sliderValue * 0.3; // Dynamische Verlängerung
    const blueCylinderHeight = baseHeight + dynamicHeight; // Blauer Zylinder verlängert
    const yellowCylinderHeight = blueCylinderHeight * 0.85; // Gelber Zylinder etwas kürzer
    const baseSpacing = 95; // Basisabstand der Zylinder
    const dynamicSpacing = baseSpacing - sliderValue * 0.3; // Abstand verringert sich mit Slider

    const cylinderSpacing = Math.max(20, dynamicSpacing); // Mindestabstand von 20px

    // Gelber Zylinder (links)
    drawCylinder(
        ctx,
        xCenter - cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - yellowCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        yellowCylinderHeight, // Höhe
        "yellow"
    );

    // Blauer Zylinder (rechts)
    drawCylinder(
        ctx,
        xCenter + cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - blueCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        blueCylinderHeight, // Höhe
        "blue"
    );
}

function drawRightEyeView(ctx, xCenter, yBase, sliderValue) {
    console.log("Right Eye View Base X:", xCenter); // Debugging
    // Basiswerte für Zylinder
    const cylinderWidth = 40;
    const baseHeight = 100; // Grundhöhe
    const dynamicHeight = sliderValue * 0.3; // Dynamische Verlängerung
    const blueCylinderHeight = baseHeight + dynamicHeight; // Blauer Zylinder verlängert
    const yellowCylinderHeight = blueCylinderHeight * 0.85; // Gelber Zylinder etwas kürzer
    const baseSpacing = 53; // Basisabstand für den rechten Bereich (etwas näher als links)
    const dynamicSpacing = baseSpacing - sliderValue * 0.3; // Abstand verringert sich mit Slider

    const cylinderSpacing = Math.max(15, dynamicSpacing); // Mindestabstand von 15px

    // Gelber Zylinder (links)
    drawCylinder(
        ctx,
        xCenter - cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - yellowCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        yellowCylinderHeight, // Höhe
        "yellow"
    );

    console.log("Yellow Cylinder at X:", xCenter - cylinderSpacing / 2 - cylinderWidth); // Debugging

    // Blauer Zylinder (rechts)
    drawCylinder(
        ctx,
        xCenter + cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - blueCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        blueCylinderHeight, // Höhe
        "blue"
    );

    console.log("Blue Cylinder at X:", xCenter + cylinderSpacing / 2 - cylinderWidth); // Debugging
}


function drawMiddleScene(ctx, sliderValue) {
    // Mittelpunkte und Abstände
    const centerX = canvas.width / 2;
    const yBase = canvas.height * 0.8; // Basislinie
    const eyeDistance = 130;
    const eyeRadius = 30; // Augenradius

    // Punkte zeichnen
    const yellowPointX = centerX - 50;
    const bluePointX = centerX + 10;
    const yellowPointY = yBase - 350; // Gelber Punkt höher positionieren
    const bluePointY = yBase - 280; // Blauer Punkt etwas tiefer als Gelber Punkt
    const pointRadius = 10;
    
    drawPoint(ctx, yellowPointX, yellowPointY, pointRadius, "yellow"); // Gelber Punkt
    drawPoint(ctx, bluePointX, bluePointY, pointRadius, "blue"); // Blauer Punkt
    // Augenposition abhängig vom Sliderwert
    const eyeYOffset = sliderValue * 1.5; // Dynamischer Offset nach oben
    const eyeY = yBase - eyeYOffset; // Augen bewegen sich nach oben
    

    // Augen zeichnen
    const leftEyeX = centerX - eyeDistance / 2;
    const rightEyeX = centerX + eyeDistance / 2;

    drawEye(ctx, leftEyeX, eyeY, eyeRadius, "white"); // Linkes Auge
    drawEye(ctx, rightEyeX, eyeY, eyeRadius, "white"); // Rechtes Auge

    // Schnittpunkt oberhalb der Augen berechnen
    const intersectionY = eyeY - eyeRadius * 0.45; // Schnittpunkt leicht oberhalb der Augen
    const extensionLength = 45; // Verlängerungslänge der Linien nach unten

    // Gelbe Linien
    drawExtendedLine(
        ctx,
        yellowPointX,
        yellowPointY,
        leftEyeX,
        intersectionY,
        "yellow",
        extensionLength
    ); // Gelbe Linie links
    drawExtendedLine(
        ctx,
        yellowPointX,
        yellowPointY,
        rightEyeX,
        intersectionY,
        "yellow",
        extensionLength
    ); // Gelbe Linie rechts

    // Blaue Linien
    drawExtendedLine(
        ctx,
        bluePointX,
        bluePointY,
        leftEyeX,
        intersectionY,
        "blue",
        extensionLength
    ); // Blaue Linie links
    drawExtendedLine(
        ctx,
        bluePointX,
        bluePointY,
        rightEyeX,
        intersectionY,
        "blue",
        extensionLength
    ); // Blaue Linie rechts

    const blackLineY = yBase - 200;
    drawStaticBlackLine(ctx, centerX, blackLineY);

    // Rote Linien auf der schwarzen Linie zeichnen
   const leftYellowX = leftEyeX - (leftEyeX - yellowPointX) / 2; // Linke gelbe Linie
   const leftBlueX = leftEyeX - (leftEyeX - 25 - bluePointX) / 2; // Linke blaue Linie
   const rightYellowX = rightEyeX + (yellowPointX - 8 - rightEyeX) / 2; // Rechte gelbe Linie
   const rightBlueX = rightEyeX + (bluePointX - 20 - rightEyeX) / 2; // Rechte blaue Linie

   drawRedLinesDynamic(ctx, leftYellowX, leftBlueX, rightYellowX, rightBlueX, blackLineY, sliderValue);
}
// Funktion zum Zeichnen der statischen schwarzen Linie
function drawStaticBlackLine(ctx, centerX, y) {
    const lineLength = 185; // Gesamtlänge der Linie
    const startX = centerX - lineLength / 2;
    const endX = centerX + lineLength / 2;

    ctx.beginPath();
    ctx.moveTo(startX, y); // Startpunkt
    ctx.lineTo(endX, y); // Endpunkt
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function calculateRedLinePosition(yellowX, blueX) {
    const startX = Math.min(yellowX, blueX); 
    const endX = Math.max(yellowX, blueX);  
    return { startX, endX };
}

function drawRedLinesDynamic(ctx, leftYellowX, leftBlueX, rightYellowX, rightBlueX, blackLineY, sliderValue) {
    const scale = Math.max(0.5, 1- sliderValue * 0.003); 
    const leftRedCenter = (leftYellowX + leftBlueX) / 2; 
    const leftRedLength = Math.abs(leftYellowX - leftBlueX) * scale; 

    const leftRedStartX = leftRedCenter - leftRedLength / 2; 
    const leftRedEndX = leftRedCenter + leftRedLength / 2;   

    ctx.beginPath();
    ctx.moveTo(leftRedStartX, blackLineY);
    ctx.lineTo(leftRedEndX, blackLineY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    const rightRedCenter = (rightYellowX + rightBlueX) / 2; 
    const rightRedLength = Math.abs(rightYellowX - rightBlueX) * scale; 

    const rightRedStartX = rightRedCenter - rightRedLength / 2;
    const rightRedEndX = rightRedCenter + rightRedLength / 2;

    ctx.beginPath();
    ctx.moveTo(rightRedStartX, blackLineY);
    ctx.lineTo(rightRedEndX, blackLineY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}
// Funktion zum Zeichnen der Zylinder
function drawCylinder(ctx, x, y, width, height, color) {
    // Zylinder-Basis zeichnen
    const gradient = ctx.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, "white");

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    // Obere Kante (Ellipse)
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y, width / 2, width / 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

    // Untere Kante (Ellipse)
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height, width / 2, width / 4, 0, 0, Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawExtendedLine(ctx, x1, y1, x2, y2, color, extensionLength) {
    // Berechnung der Richtung
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    // Erweiterte Endpunkte berechnen
    const extendedX = x2 + unitX * extensionLength;
    const extendedY = y2 + unitY * extensionLength;

    // Linie zeichnen
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(extendedX, extendedY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawPoint(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawEye(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function draw_first_phase() {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width/2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sliderValue = parseFloat(slider.value);
    const yBase = canvas.height / 2; // Mittelpunkt für Zylinder
    const xLeftView = canvas.width / 4; // Linke Augenansicht
    const xRightView = (canvas.width * 3) / 4; // Rechte Augenansicht

    console.log("Drawing Left Eye View...");
    drawLeftEyeView(ctx, xLeftView, yBase, sliderValue);

    console.log("Drawing Middle Scene...");
    drawMiddleScene(ctx, sliderValue);

    console.log("Drawing Right Eye View...");
    drawRightEyeView(ctx, xRightView, yBase, sliderValue);
}

function drawLeftEyeView(ctx, xCenter, yBase, sliderValue) {
    // Basiswerte für Zylinder
    const cylinderWidth = 40;
    const baseHeight = 100; // Grundhöhe
    const dynamicHeight = sliderValue * 0.3; // Dynamische Verlängerung
    const blueCylinderHeight = baseHeight + dynamicHeight; // Blauer Zylinder verlängert
    const yellowCylinderHeight = blueCylinderHeight * 0.85; // Gelber Zylinder etwas kürzer
    const baseSpacing = 95; // Basisabstand der Zylinder
    const dynamicSpacing = baseSpacing - sliderValue * 0.3; // Abstand verringert sich mit Slider

    const cylinderSpacing = Math.max(20, dynamicSpacing); // Mindestabstand von 20px

    // Gelber Zylinder (links)
    drawCylinder(
        ctx,
        xCenter - cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - yellowCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        yellowCylinderHeight, // Höhe
        "yellow"
    );

    // Blauer Zylinder (rechts)
    drawCylinder(
        ctx,
        xCenter + cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - blueCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        blueCylinderHeight, // Höhe
        "blue"
    );
}

function drawRightEyeView(ctx, xCenter, yBase, sliderValue) {
    console.log("Right Eye View Base X:", xCenter); // Debugging
    // Basiswerte für Zylinder
    const cylinderWidth = 40;
    const baseHeight = 100; // Grundhöhe
    const dynamicHeight = sliderValue * 0.3; // Dynamische Verlängerung
    const blueCylinderHeight = baseHeight + dynamicHeight; // Blauer Zylinder verlängert
    const yellowCylinderHeight = blueCylinderHeight * 0.85; // Gelber Zylinder etwas kürzer
    const baseSpacing = 53; // Basisabstand für den rechten Bereich (etwas näher als links)
    const dynamicSpacing = baseSpacing - sliderValue * 0.3; // Abstand verringert sich mit Slider

    const cylinderSpacing = Math.max(15, dynamicSpacing); // Mindestabstand von 15px

    // Gelber Zylinder (links)
    drawCylinder(
        ctx,
        xCenter - cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - yellowCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        yellowCylinderHeight, // Höhe
        "yellow"
    );

    console.log("Yellow Cylinder at X:", xCenter - cylinderSpacing / 2 - cylinderWidth); // Debugging

    // Blauer Zylinder (rechts)
    drawCylinder(
        ctx,
        xCenter + cylinderSpacing / 2 - cylinderWidth, // Position
        yBase - blueCylinderHeight / 2, // Mittelpunkt anpassen
        cylinderWidth,
        blueCylinderHeight, // Höhe
        "blue"
    );

    console.log("Blue Cylinder at X:", xCenter + cylinderSpacing / 2 - cylinderWidth); // Debugging
}


function drawMiddleScene(ctx, sliderValue) {
    // Mittelpunkte und Abstände
    const centerX = canvas.width / 2;
    const yBase = canvas.height * 0.8; // Basislinie
    const eyeDistance = 130;
    const eyeRadius = 30; // Augenradius

    // Punkte zeichnen
    const yellowPointX = centerX - 50;
    const bluePointX = centerX + 10;
    const yellowPointY = yBase - 350; // Gelber Punkt höher positionieren
    const bluePointY = yBase - 280; // Blauer Punkt etwas tiefer als Gelber Punkt
    const pointRadius = 10;
    
    drawPoint(ctx, yellowPointX, yellowPointY, pointRadius, "yellow"); // Gelber Punkt
    drawPoint(ctx, bluePointX, bluePointY, pointRadius, "blue"); // Blauer Punkt
    // Augenposition abhängig vom Sliderwert
    const eyeYOffset = sliderValue * 1.5; // Dynamischer Offset nach oben
    const eyeY = yBase - eyeYOffset; // Augen bewegen sich nach oben
    

    // Augen zeichnen
    const leftEyeX = centerX - eyeDistance / 2;
    const rightEyeX = centerX + eyeDistance / 2;

    drawEye(ctx, leftEyeX, eyeY, eyeRadius, "white"); // Linkes Auge
    drawEye(ctx, rightEyeX, eyeY, eyeRadius, "white"); // Rechtes Auge

    // Schnittpunkt oberhalb der Augen berechnen
    const intersectionY = eyeY - eyeRadius * 0.45; // Schnittpunkt leicht oberhalb der Augen
    const extensionLength = 45; // Verlängerungslänge der Linien nach unten

    // Gelbe Linien
    drawExtendedLine(
        ctx,
        yellowPointX,
        yellowPointY,
        leftEyeX,
        intersectionY,
        "yellow",
        extensionLength
    ); // Gelbe Linie links
    drawExtendedLine(
        ctx,
        yellowPointX,
        yellowPointY,
        rightEyeX,
        intersectionY,
        "yellow",
        extensionLength
    ); // Gelbe Linie rechts

    // Blaue Linien
    drawExtendedLine(
        ctx,
        bluePointX,
        bluePointY,
        leftEyeX,
        intersectionY,
        "blue",
        extensionLength
    ); // Blaue Linie links
    drawExtendedLine(
        ctx,
        bluePointX,
        bluePointY,
        rightEyeX,
        intersectionY,
        "blue",
        extensionLength
    ); // Blaue Linie rechts

    const blackLineY = yBase - 200;
    drawStaticBlackLine(ctx, centerX, blackLineY);

    // Rote Linien auf der schwarzen Linie zeichnen
   const leftYellowX = leftEyeX - (leftEyeX - yellowPointX) / 2; // Linke gelbe Linie
   const leftBlueX = leftEyeX - (leftEyeX - 25 - bluePointX) / 2; // Linke blaue Linie
   const rightYellowX = rightEyeX + (yellowPointX - 8 - rightEyeX) / 2; // Rechte gelbe Linie
   const rightBlueX = rightEyeX + (bluePointX - 20 - rightEyeX) / 2; // Rechte blaue Linie

   drawRedLinesDynamic(ctx, leftYellowX, leftBlueX, rightYellowX, rightBlueX, blackLineY, sliderValue);
}
// Funktion zum Zeichnen der statischen schwarzen Linie
function drawStaticBlackLine(ctx, centerX, y) {
    const lineLength = 185; // Gesamtlänge der Linie
    const startX = centerX - lineLength / 2;
    const endX = centerX + lineLength / 2;

    ctx.beginPath();
    ctx.moveTo(startX, y); // Startpunkt
    ctx.lineTo(endX, y); // Endpunkt
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function calculateRedLinePosition(yellowX, blueX) {
    const startX = Math.min(yellowX, blueX); 
    const endX = Math.max(yellowX, blueX);  
    return { startX, endX };
}

function drawRedLinesDynamic(ctx, leftYellowX, leftBlueX, rightYellowX, rightBlueX, blackLineY, sliderValue) {
    const scale = Math.max(0.5, 1- sliderValue * 0.003); 
    const leftRedCenter = (leftYellowX + leftBlueX) / 2; 
    const leftRedLength = Math.abs(leftYellowX - leftBlueX) * scale; 

    const leftRedStartX = leftRedCenter - leftRedLength / 2; 
    const leftRedEndX = leftRedCenter + leftRedLength / 2;   

    ctx.beginPath();
    ctx.moveTo(leftRedStartX, blackLineY);
    ctx.lineTo(leftRedEndX, blackLineY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    const rightRedCenter = (rightYellowX + rightBlueX) / 2; 
    const rightRedLength = Math.abs(rightYellowX - rightBlueX) * scale; 

    const rightRedStartX = rightRedCenter - rightRedLength / 2;
    const rightRedEndX = rightRedCenter + rightRedLength / 2;

    ctx.beginPath();
    ctx.moveTo(rightRedStartX, blackLineY);
    ctx.lineTo(rightRedEndX, blackLineY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}
// Funktion zum Zeichnen der Zylinder
function drawCylinder(ctx, x, y, width, height, color) {
    // Zylinder-Basis zeichnen
    const gradient = ctx.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, "white");

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    // Obere Kante (Ellipse)
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y, width / 2, width / 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

    // Untere Kante (Ellipse)
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height, width / 2, width / 4, 0, 0, Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawExtendedLine(ctx, x1, y1, x2, y2, color, extensionLength) {
    // Berechnung der Richtung
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    // Erweiterte Endpunkte berechnen
    const extendedX = x2 + unitX * extensionLength;
    const extendedY = y2 + unitY * extensionLength;

    // Linie zeichnen
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(extendedX, extendedY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawPoint(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawEye(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}


const images = {
    imag1: '../resources/interactions/m2u4i4/rightEyeView.png',
    imag2: '../resources/interactions/m2u4i4/leftEyeView.png',
};
let currentImage = null;
const buttonRight = document.getElementById('rEV2');
const buttonLeft = document.getElementById('lEV2');

buttonRight.addEventListener('click', (e) => {showImage('imag1'); activateButton(e.target);});
buttonLeft.addEventListener('click', (e) => {showImage('imag2'); activateButton(e.target);});

function activateButton(clickedButton) {
    // Entferne die aktive Klasse von allen Buttons
    document.querySelectorAll('.button-item input').forEach(button => {
        button.classList.remove('active-button');
    });

    // Füge die aktive Klasse zum geklickten Button hinzu
    clickedButton.classList.add('active-button');
}

function showImage(imageKey) {
    const img = new Image();
    img.src = images[imageKey];
    img.onload = () => {
        currentImage = img;
        draw_second_phase(img);
    }
}

function draw_second_phase(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas zurücksetzen
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const aspectRatio = img.width / img.height;
    const desiredHeight = canvas.height * 0.8; // 80% der Canvas-Höhe
    const desiredWidth = desiredHeight * aspectRatio;

    // Bild zeichnen (zentriert)
    const x = (canvas.width - desiredWidth) / 2;
    const y = (canvas.height - desiredHeight) / 2;
    ctx.drawImage(img, x, y, desiredWidth, desiredHeight);
    
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    switch(phase) {
        case 0:
            draw_first_phase();
            break;
        case 1:
            if (currentImage) {
                draw_second_phase(currentImage);
            }
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

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2;
    draw(); // Neu zeichnen nach Größenänderung
});


