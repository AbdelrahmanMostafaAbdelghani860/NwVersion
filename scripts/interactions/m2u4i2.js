const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}


canvas.width = window.innerWidth;
canvas.height = canvas.width/2;


const horopterButtonContainer = document.getElementById('horopterButtonContainer');
const doneButtonContainer = document.getElementById('doneButtonContainer');
const cpPointsButtonContainer = document.getElementById('cpPointsButtonContainer');
const returnButtonContainer = document.getElementById('returnButtonContainer');



FPS = 30;
phase = 0;

let textfieldKeys = ['instructions', 'instruction2', 'instruction3', 'instruction4'];

init();

// Sliders
function nextPhase() {
    setPhase((phase + 1) % 4);
}

let isDragging = false;
let redPoint = { angle: Math.PI * 1.5, color: "red", label: "C"};

function setPhase(newPhase) {
    phase = newPhase;
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    textfield.style.color = 'inherit';

    // Parameterbereich nur in Phase 2 anzeigen
    const parameterArea = document.getElementById("parameterArea");

    switch(phase) {
        case 0:
            first_phase_clicked = [0, 0];
            parameterArea.style.display = "none";
            horopterButtonContainer.style.setProperty('display', 'inline');
            doneButtonContainer.style.setProperty('display', 'none');
            cpPointsButtonContainer.style.setProperty('display', 'none');
            returnButtonContainer.style.setProperty('display', 'none');
            removeCanvasEventListeners();
            draw_first_phase();
            break;
        case 1:
            parameterArea.style.display = "block";
            horopterButtonContainer.style.setProperty('display', 'none');
            doneButtonContainer.style.setProperty('display', 'inline');
            cpPointsButtonContainer.style.setProperty('display', 'none');
            returnButtonContainer.style.setProperty('display', 'none');
            removeCanvasEventListeners();
            draw_second_phase();
            showImage('red');
            break;
        case 2:
            parameterArea.style.display = "block";
            horopterButtonContainer.style.setProperty('display', 'none');
            doneButtonContainer.style.setProperty('display', 'none');
            cpPointsButtonContainer.style.setProperty('display', 'inline');
            returnButtonContainer.style.setProperty('display', 'none');
            removeCanvasEventListeners();
            draw_third_phase();
            break;
        case 3:
            parameterArea.style.display = "none";
            horopterButtonContainer.style.setProperty('display', 'none');
            doneButtonContainer.style.setProperty('display', 'none');
            cpPointsButtonContainer.style.setProperty('display', 'none');
            returnButtonContainer.style.setProperty('display', 'inline');
            addCanvasEventListeners();
            draw_fourth_phase();
            break;
        default:
            removeCanvasEventListeners();
            draw();
            break;
    }
    saveSettings();
}

function addCanvasEventListeners() {
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
}

function removeCanvasEventListeners() {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;   // Verhältnis der tatsächlichen Canvas-Breite zur angezeigten Breite
    const scaleY = canvas.height / rect.height; // Verhältnis der tatsächlichen Canvas-Höhe zur angezeigten Höhe

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    return { mouseX, mouseY };
}

function calculateAngle(mouseX, mouseY, arcCenterX, arcCenterY) {
    const dx = mouseX - arcCenterX;
    const dy = mouseY - arcCenterY;
    
    let angle = Math.atan2(dy, dx);
    if (angle < 0) {
        angle += 2 * Math.PI;
    }
    return angle;
}

function handleMouseDown(e) {
    if (phase !== 3) return;
    console.log("Mouse down detected in Phase 3");
    const { mouseX, mouseY } = getMousePos(e);
    
        const arcCenterX = canvas.width / 2;
        const arcCenterY = canvas.height * 0.7;
        const arcRadius = canvas.width * 0.3;
    
        const redX = arcCenterX + Math.cos(redPoint.angle) * arcRadius;
        const redY = arcCenterY + Math.sin(redPoint.angle) * arcRadius;
    
        // Überprüfen, ob die Maus den roten Punkt berührt
        const distance = Math.sqrt((mouseX - redX) ** 2 + (mouseY - redY) ** 2);
        console.log("Distance to red point:", distance);
    
        if (distance < 50) { 
            isDragging = true;
            console.log("Dragging started on red point");
        } 
}

function handleMouseMove(e) {
    if (!isDragging || phase !== 3) return; // Nur aktiv, wenn Dragging aktiv ist
   
            const { mouseX, mouseY } = getMousePos(e);
            const arcCenterX = canvas.width / 2;
            const arcCenterY = canvas.height * 0.7;

            // Winkel berechnen
            let angle = calculateAngle(mouseX, mouseY, arcCenterX, arcCenterY);
            console.log("Calculated angle:", angle);
    
            // Winkel auf den Bereich der Kurve beschränken
            const minAngle = Math.PI * 1.2;
            const maxAngle = Math.PI * 1.8;
            if (angle < minAngle) {angle = minAngle;}
            if (angle > maxAngle) {angle = maxAngle;}

            redPoint.angle = angle;
            console.log("Mouse moved, calculated angle:", angle);
            console.log("Red point updated angle:", angle);
            draw_fourth_phase(); // Neu zeichnen
}

function handleMouseUp(e) {
    if (phase !== 3) return;
    console.log("Mouse up detected, dragging stopped");
    isDragging = false;
}

function horopterButtonFuction() {
    switch(phase) {
        case 0:
            setPhase(1);
            break;
        case 1:
        case 1:
        case 2:
        case 3:
            break;
    }
    saveSettings();
}

function doneButtonFunction() {
    switch(phase) {
        case 0:
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

function cpPointsButtonFunction() {
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

horopterButton = document.getElementById('horopter');
horopterButton.onclick = horopterButtonFuction;

doneButton = document.getElementById('done');
doneButton.onclick = doneButtonFunction;

cpPointsButton = document.getElementById('cpPoints');
cpPointsButton.onclick = cpPointsButtonFunction;

resetButton = document.getElementById('reset');
resetButton.onclick = resetButtonFunction;

textfield = document.getElementById('textfield');

loadSettings();

let then = Date.now();
animate();

function init() {
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


let leftEyeImage = new Image();
let rightEyeImage = new Image();
leftEyeImage.src = '../resources/interactions/m2u4i2/AugeLinks.png';
rightEyeImage.src = '../resources/interactions/m2u4i2/AugeRechts.png';


const slider = document.getElementById('slider');

function draw_first_phase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Zentrum des Canvas
    const centerY = canvas.height / 2;

    // Linkes Auge: Fixierte Position (z. B. links im Canvas)
    const leftEyeX = canvas.width / 3;

    // Rechtes Auge: Dynamische Position basierend auf dem Slider
    const sliderValue = parseFloat(slider.value); // Slider-Wert (0 bis 100)
    const maxDistance = canvas.width / 3; // Maximale Verschiebung
    const rightEyeX = leftEyeX + (maxDistance * sliderValue) / 100;

    // Linkes Auge zeichnen
    ctx.drawImage(
        leftEyeImage,
        leftEyeX - leftEyeImage.width / 2,
        centerY - leftEyeImage.height / 2
    );

    // Rechtes Auge zeichnen
    ctx.drawImage(
        rightEyeImage,
        rightEyeX - rightEyeImage.width / 2,
        centerY - rightEyeImage.height / 2
    );
}

slider.addEventListener('input', () => {
    draw_first_phase();
});

leftEyeImage.onload = () => {
    rightEyeImage.onload = () => {
        draw_first_phase(); // Zeichne die Szene, wenn beide Bilder geladen sind
    };
};


function draw_second_phase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas zurücksetzen
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const images = {
        pink: {
            src: '../resources/interactions/m2u4i2/pinkP.png',
            angle: "8.93 deg",
            distance: "40,00 cm"
        },
        red: {
            src: '../resources/interactions/m2u4i2/redP.png',
            angle: "11,89 deg",
            distance: "30,00 cm"
        },
        green: {
            src: '../resources/interactions/m2u4i2/greenP.png',
            angle: "17,76 deg",
            distance: "20,00 cm"
        }
    };

    // Buttons abrufen
    const buttonPink = document.getElementById('pinkB');
    const buttonRed = document.getElementById('redB');
    const buttonGreen = document.getElementById('greenB');

    // Eventlistener für die Buttons
    buttonPink.addEventListener('click', () => showImage('pink'));
    buttonRed.addEventListener('click', () => showImage('red'));
    buttonGreen.addEventListener('click', () => showImage('green'));

    showImage('red');

    let clickedButtons = new Set();

    // Funktion, um Bild und Parameter auf dem Canvas anzuzeigen
    function showImage(color) {
        const img = new Image();
        img.src = images[color].src;

        img.onload = () => {
            currentImage = img;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas zurücksetzen
            ctx.fillStyle = getDefaultBGColor();
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Hintergrundfarbe

            const halfWidth = canvas.width / 2;
            const desiredHeight = canvas.height * 0.9;
            const aspectRatio = img.width / img.height;
            const desiredWidth = desiredHeight * aspectRatio;

            ctx.drawImage(
                img,
                (halfWidth- desiredWidth) / 2, // Zentrierung horizontal
                (canvas.height - desiredHeight) / 2, // Zentrierung vertikal
                desiredWidth,
                desiredHeight
            );
        };
        updateParameters(color);
        
        // Track clicked buttons
        clickedButtons.add(color);

        // Enable "done" button only if all buttons are clicked
        if (clickedButtons.size === 3) {
            document.getElementById('done').style.display = 'inline';
        }
    };
}

function updateParameters(color) {
    const currentLanguage = localStorage.getItem('lang') || 'de'; // Sprache setzen
    const langDict = languages[currentLanguage]; // Sprachdaten abrufen

    // Dynamische Keys basierend auf der Farbe
    const angleKey = `horopter_${color}_Angle`;
    const distanceKey = `horopter_${color}_Distance`;

    // Texte aus der Sprachdatei abrufen
    const angleText = langDict[angleKey] || `Key missing: ${angleKey}`;
    const distanceText = langDict[distanceKey] || `Key missing: ${distanceKey}`;

    // Inhalte der Parameter-Paragraphen aktualisieren
    const angleDOM = document.getElementById('angleText');
    const distanceDOM = document.getElementById('distanceText');

    if (angleDOM) angleDOM.textContent = angleText;
    if (distanceDOM) distanceDOM.textContent = distanceText;
}


let staticImage = new Image();
staticImage.src = '../resources/interactions/m2u4i2/static.png';
let staticImageLoaded = false;

staticImage.onload = () => {
    staticImageLoaded = true;
}

function draw_third_phase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (staticImageLoaded) {
        const halfWidth = canvas.width / 2;
        const desiredHeight = canvas.height * 0.9; // 90% der Canvas-Höhe
        const aspectRatio = staticImage.width / staticImage.height;
        const desiredWidth = desiredHeight * aspectRatio;

        ctx.drawImage(
            staticImage,
            (halfWidth - desiredWidth) / 2, // Zentrierung horizontal
            (canvas.height - desiredHeight) / 2, // Zentrierung vertikal
            desiredWidth,
            desiredHeight
        );
    };

    // Buttons abrufen
    const buttonPink = document.getElementById('pinkB_cp');
    const buttonRed = document.getElementById('redB_cp');
    const buttonGreen = document.getElementById('greenB_cp');
    const buttonYellow = document.getElementById('yellowB_cp');
    const buttonBlue = document.getElementById('blueB_cp');

    // Eventlistener für die Buttons
    buttonPink.addEventListener('click', () => setupColorButtons('pink'));
    buttonRed.addEventListener('click', () => setupColorButtons('red'));
    buttonGreen.addEventListener('click', () => setupColorButtons('green'));
    buttonYellow.addEventListener('click', () => setupColorButtons('yellow'));
    buttonBlue.addEventListener('click', () => setupColorButtons('blue'));

    setupColorButtons(color);
}

function setupColorButtons(color) {
    const currentLanguage = localStorage.getItem('lang') || 'de'; // Sprache setzen
    const langDict = languages[currentLanguage]; // Sprachdaten abrufen

    // Dynamische Keys basierend auf der Farbe
    const angleKey = `horopter_${color}_Angle`;
    const distanceKey = `horopter_${color}_Distance`;

    // Texte aus der Sprachdatei abrufen
    const angleText = langDict[angleKey] || `Key missing: ${angleKey}`;
    const distanceText = langDict[distanceKey] || `Key missing: ${distanceKey}`;

    // Inhalte der Parameter-Paragraphen aktualisieren
    const angleDOM = document.getElementById('angleText');
    const distanceDOM = document.getElementById('distanceText');

    if (angleDOM) angleDOM.textContent = angleText;
    if (distanceDOM) distanceDOM.textContent = distanceText;
}

function drawEye(position) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.closePath();
}

function drawLine(from, to, color, extensionLength = 80) {
    // Berechnung der verlängerten Linie
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / lineLength;
    const unitY = dy / lineLength;

    // Erweiterte Endpunkte berechnen
    const extendedX = to.x + unitX * extensionLength;
    const extendedY = to.y + unitY * extensionLength;

    // Linie zeichnen
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(extendedX, extendedY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    return { x: extendedX, y: extendedY }; // Rückgabe der Endposition
}


function drawLabel(position, text, color) {
    ctx.fillStyle = color;
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, position.x, position.y);
}

function draw_fourth_phase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const arcCenterX = canvas.width / 2;
    const arcCenterY = canvas.height * 0.7;
    const arcRadius = canvas.width * 0.3;

    ctx.beginPath();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    ctx.arc(arcCenterX, arcCenterY, arcRadius, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();

    const points = [
    { color: "yellow", angle: Math.PI * 1.3, label: "B" },
    { color: "blue", angle: Math.PI * 1.7, label: "A" },
      redPoint ];

    
    const redX = arcCenterX + Math.cos(redPoint.angle) * arcRadius;
    const redY = arcCenterY + Math.sin(redPoint.angle) * arcRadius;

    ctx.beginPath();
    ctx.arc(redX, redY, 15, 0, Math.PI * 2); 
    ctx.fillStyle = redPoint.color;
    ctx.fill();
    ctx.closePath();

    console.log("Red point drawn at:", { x: redX, y: redY });

    // Augen-Positionen
    const eyeOffsetX = canvas.width * 0.05; // Abstand der Augen vom Zentrum
    const leftEye = { x: arcCenterX - eyeOffsetX, y: canvas.height / 1.2 };
    const rightEye = { x: arcCenterX + eyeOffsetX, y: canvas.height / 1.2 };
   
   drawEye(leftEye);
   drawEye(rightEye);


   

points.forEach((point) => {
    const pointX = arcCenterX + Math.cos(point.angle) * arcRadius; // X-Position
    const pointY = arcCenterY + Math.sin(point.angle) * arcRadius; // Y-Position

    // Punkt zeichnen
    ctx.beginPath();
    ctx.arc(pointX, pointY, 15, 0, Math.PI * 2); // Punktgröße: 10px Radius
    ctx.fillStyle = point.color;
    ctx.fill();

    const leftLineEnd = drawLine({ x: pointX, y: pointY }, leftEye, point.color, 55);
    const rightLineEnd = drawLine({ x: pointX, y: pointY }, rightEye, point.color, 55);

    ctx.closePath();
    // Labels an den Endpunkten der Linien zeichnen
    drawLabel({ x: leftLineEnd.x, y: leftLineEnd.y + 15 }, point.label, point.color); // Linkes Label
    drawLabel({ x: rightLineEnd.x, y: rightLineEnd.y + 15 }, `${point.label}'`, point.color); // Rechtes Label
});
}

// all drawing (and per frame logic) in here
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
                // Bild neu zeichnen
                const halfWidth = canvas.width / 2;
                const desiredHeight = canvas.height * 0.9; // 90% der Canvas-Höhe
                const aspectRatio = currentImage.width / currentImage.height;
                const desiredWidth = desiredHeight * aspectRatio;

                ctx.drawImage(
                    currentImage,
                    (halfWidth - desiredWidth) / 2, // Zentrierung innerhalb der linken Hälfte
                    (canvas.height - desiredHeight) / 2, // Vertikale Zentrierung
                    desiredWidth,
                    desiredHeight
                );

                updateParameters(color);
            }
            //draw_second_phase();
            break;
        case 2:
            draw_third_phase();
            setupColorButtons(color);
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
        if (phase === 3) {
            draw_fourth_phase();
        } else {
            draw();
        }
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2;
    draw(); // Neu zeichnen nach Größenänderung
});

