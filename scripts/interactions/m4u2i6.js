const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}

FPS = 30;
phase = 0;

canvas.width = window.innerWidth;
canvas.height = canvas.width / 2;

const abcButtonContainer1 = document.getElementById('abcContainer1');
const abcButtonContainer2 = document.getElementById('abcContainer2');
const resetButtonContainer = document.getElementById('resetButtonContainer');
const nextButtonContainer = document.getElementById('nextButtonContainer');

let textfieldKeys = ['instructions', 'instruction2'];

init();
loadSettings();

function init() {
    first_phase_clicked = [0, 0];
    second_phase_toggled = false;
}

function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + ';phase=' + phase);
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
function nextPhase() {
    setPhase((phase + 1) % 2);
}

function setPhase(newPhase) {
    phase = newPhase;
    const textfield = document.getElementById('textfield');
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    textfield.style.color = 'inherit';

    switch (phase) {
        case 0:
            first_phase_clicked = [0, 0];
            abcButtonContainer1.style.setProperty('display', 'inline');
            abcButtonContainer2.style.setProperty('display', 'none');
            resetButtonContainer.style.setProperty('display', 'inline');
            nextButtonContainer.style.setProperty('display', 'inline');
            break;
        case 1:
            abcButtonContainer1.style.setProperty('display', 'none');
            abcButtonContainer2.style.setProperty('display', 'inline');
            resetButtonContainer.style.setProperty('display', 'inline');
            nextButtonContainer.style.setProperty('display', 'inline');
            break;
    }
    saveSettings();
}

/**function continueButtonFunction() {
    switch(phase) {
        case 0:
            setPhase(1);
            break;
        case 1:
        case 2:
        case 3:
            break;
    }
    saveSettings();
}**/

function nextButtonFunction() {
    if (currentPhase === 1) {
        currentPhase = 2; // Wechsel zu Phase 2
        d = 1.5; // Aktualisiere die Sensitivität für Phase 2
        criterion = criterionValues['A']; // Zurücksetzen auf das erste Kriterium in Phase 2
    }
    updateButtonVisibility();
    updateProbabilityDisplay();
    drawGraph(); // Neu zeichnen mit aktualisierten Werten
    setPhase(1);
    saveSettings();
}

function resetButtonFunction() {
    // Zurücksetzen auf Phase 1
    currentPhase = 1;
    d = 1.0; // Empfindlichkeit auf Standardwert setzen
    currentCriterion = 'A'; // Standardkriterium (z. B. A) setzen
    criterion = criterionValues[currentCriterion]; // Kriterium auf den Standardwert setzen

    // Sichtbarkeit der Buttons aktualisieren
    updateButtonVisibility();

    // Wahrscheinlichkeiten und Werte zurücksetzen
    updateProbabilityDisplay();

    // Canvas löschen und Graph zurücksetzen
    drawGraph();
}

nextButton = document.getElementById('nextButtonContainer');
nextButton.onclick = nextButtonFunction;

resetButton = document.getElementById('resetButtonContainer');
resetButton.onclick = resetButtonFunction;

// Globale Variablen
let currentPhase = 1;
let currentCriterion = 'A';

const criterionValues = {
    A: 3.0,
    B: 3.5,
    C: 3.8,
    D: 4.4,
    E: 5.1,
    F: 5.7
};
let criterion = criterionValues[currentCriterion]; // Verwende let statt const



// Funktionen zum Aktualisieren der Button-Container
function updateButtonVisibility() {
    // Phase 1 Button-Container
    document.getElementById('abcContainer1').style.display = currentPhase === 1 ? 'inline' : 'none';
    // Phase 2 Button-Container
    document.getElementById('abcContainer2').style.display = currentPhase === 2 ? 'inline' : 'none';

    // Update der Kriteriums- und Sensitivitäts-Container
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`c&sButtonContainer1.${i}`).style.display = (currentPhase === 1 && `ABCDEF`.charAt(i - 1) === currentCriterion) ? 'inline' : 'none';
        document.getElementById(`c&sButtonContainer2.${i}`).style.display = (currentPhase === 2 && `ABCDEF`.charAt(i - 1) === currentCriterion) ? 'inline' : 'none';
    }
}

// Funktion zum Aktualisieren der Wahrscheinlichkeitsanzeigen
function updateProbabilityDisplay() {
    // Sichtbarkeit der Werte-Container
    for (const phase of [1, 2]) {
        for (const letter of 'ABCDEF') {
            const containerId = `pButtonContainer${phase}.${letter.toLowerCase()}`;
            document.getElementById(containerId).style.display = (currentPhase === phase && currentCriterion === letter) ? 'inline' : 'none';
        }
    }
}
    const leftWidth = canvas.width / 2 - 20; // Linker Bereich
    const unitCount = 10; // Anzahl der Einheiten pro Seite
    const unitWidth = (leftWidth - 100) / unitCount;
    const subUnitCount = 5;
    const subUnitWidth = unitWidth / subUnitCount;
    const halfwayY = (canvas.height - 50) / 2;

    let offsetR = 1; // offset red curve, it stays put in this interaction
    let offsetY = 1; //offset yellow curve, it stays put in this interaction
    let meansSignalNoise = 4;
    let meansNoise = 4;

    let mLine = false;
    let distHeight = 0;

    //const criterion = 3.0;
    let d = 1.0;

    let yOffsetR = halfwayY - (canvas.height - 50);
    let yOffsetY = 0;

    let color1 = "rgba(200, 0, 255, 0.4)";
    let color2 = "rgba(0, 255, 106, 0.59)";
    let color3 = "rgba(0, 98, 255, 0.51)";
    let color4 = "rgba(255, 94, 0, 0.56)";

    function drawCoordinateSystem() {

        ctx.font = "20px Arial";
        ctx.fillStyle = "blue"; // Set text color to blue
    
        ctx.lineWidth = 3; // Set line thickness
        ctx.strokeStyle = "blue"; // Set line color to blue 
    
        // Draw X-Axis
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 50); // Starting point of the x-axis
        ctx.lineTo(leftWidth- 50, canvas.height - 50); // Ending point of the x-axis
        ctx.stroke();
    
        // Draw Y-Axis
        ctx.beginPath();
        ctx.moveTo(50, 50); // Starting point of the y-axis
        ctx.lineTo(50, canvas.height - 50); // Ending point of the y-axis
        ctx.stroke();
    
        // Draw X-Axis Units
    
        for (let i = 0; i <= unitCount; i++) {
            const x = 50 + (i * unitWidth); // Calculate x position for each unit
            ctx.beginPath();
            ctx.moveTo(x, canvas.height - 60); // Line just above the x-axis
            ctx.lineTo(x, canvas.height - 40); // Line just below the x-axis
            ctx.stroke();
            
            // Add unit labels
            ctx.fillText(i, x - 5, canvas.height - 20); // Draw unit numbers below the x-axis
    
            // Draw sub-units
            for (let j = 1; j < subUnitCount; j++) {
                if(i != unitCount) {
                    const subX = x + (j * subUnitWidth); // Calculate x position for each sub-unit
                ctx.beginPath();
                ctx.moveTo(subX, canvas.height - 55); // Line just above the x-axis
                ctx.lineTo(subX, canvas.height - 45); // Line just below the x-axis
                ctx.stroke();
                }  
            }
        }
    
        // Draw the "second x axis"
        const halfwayY = (canvas.height - 50) / 2;
        ctx.beginPath();
        ctx.moveTo(50, halfwayY);
        ctx.lineTo(leftWidth - 50, halfwayY);
        ctx.strokeStyle = "rgb(22, 146, 255)"; 
        ctx.lineWidth = 4; 
        ctx.stroke(); 
    
        drawLabelsAndDots();
    }
    
    function drawProbabilityDistribution(offset, lineColor, yOffset, leftColor, rightColor) {
        const mean = 3 + offset; // Mean of the distribution
        const stdDev = 1; // Standard deviation
        const scalingFactor = 500; // Adjust this value to make the distribution taller
    
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;
    
        // Draw the probability distribution
        ctx.beginPath();
        const startX = 0; 
        const endX = unitCount; 
    
        let peakHeight = canvas.height; // Variable to track the peak height of the current distribution
    
        for (let x = startX; x <= endX; x += 0.1) {
            let probability = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)); // Use stdDev for the calculation
            let y = (canvas.height - 50) - (probability * scalingFactor) + yOffset; // Scale the y value for visibility and add yOffset
            if (y < peakHeight) {
                peakHeight = y; // Update peakHeight
            }
            if (x === startX) {
                ctx.moveTo(50 + ((x) * unitWidth), y);
            } else {
                ctx.lineTo(50 + ((x) * unitWidth), y);
            }
        }
    
        // Fill the area where x < criterion
        ctx.lineTo(50 + (criterion * unitWidth), canvas.height - 50 + yOffset); // Close the path for the area below the criterion
        ctx.lineTo(50 + (startX * unitWidth), canvas.height - 50 + yOffset); // Close the path
        ctx.fillStyle = leftColor; //color for x < criterion
        ctx.fill(); // Fill the area below the criterion
    
        // Draw the outline of the distribution
        ctx.stroke(); // Stroke the line with the specified color
    
        // Now fill the area where x > criterion
        ctx.beginPath(); // Start a new path for the area above the criterion
        ctx.moveTo(50 + (criterion * unitWidth), (canvas.height - 50) - (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((criterion - mean) / stdDev, 2)) * scalingFactor + yOffset); // Move to the criterion point
        for (let x = criterion; x <= endX; x += 0.1) {
            let probability = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)); // Use stdDev for the calculation
            let y = (canvas.height - 50) - (probability * scalingFactor) + yOffset; // Scale the y value for visibility and add yOffset
            ctx.lineTo(50 + ((x) * unitWidth), y);
        }
        ctx.lineTo(50 + (endX * unitWidth), canvas.height - 50 + yOffset); // Close the path
        ctx.lineTo(50 + (criterion * unitWidth), canvas.height - 50 + yOffset); // Close the path
        ctx.fillStyle = rightColor; // Green color
        ctx.fill(); // Fill the area above the criterion
    
        distHeight = peakHeight;
    }
    
    function drawSensoryActivationLine(x, lineColor) {
        const xPosition = 50 + (x * unitWidth); 
        const yStart = 50; //as tall as y axis
        const yEnd = canvas.height - 50; // End at the x-axis
    
        // Draw the main line
        ctx.beginPath();
        ctx.moveTo(xPosition, yStart); 
        ctx.lineTo(xPosition, yEnd); 
        ctx.strokeStyle = lineColor; 
        ctx.lineWidth = 5;
        ctx.stroke(); 
    
        // Draw the horizontal line at the top to form a "T"
        const horizontalLineLength = 15; // Length of the horizontal line
        const horizontalYPosition = yStart; // Y position for the horizontal line  
    
        ctx.beginPath();
        ctx.moveTo(xPosition - horizontalLineLength / 2, horizontalYPosition); 
        ctx.lineTo(xPosition + horizontalLineLength / 2, horizontalYPosition); 
        ctx.strokeStyle = lineColor; 
        ctx.lineWidth = 5; 
        ctx.stroke(); 
    
        // Draw the "No" label on the left side
        ctx.fillStyle = lineColor; 
        ctx.font = "30px Arial";
    
       ctx.fillText('X', xPosition - horizontalLineLength / 2 - 30, horizontalYPosition); // Draw "X" for No
    
       ctx.fillText('✓', xPosition + horizontalLineLength / 2 + 10, horizontalYPosition); // Draw check mark for Yes
    }
    
    function drawLabelsAndDots() {
        // Set the position for the labels and dots
        const dotRadius = 5; 
        const xPosition = leftWidth - 120; 
        const noiseYPosition = 50; 
        const signalNoiseYPosition = 100; 
    
        // Draw the red dot for "Noise"
        ctx.fillStyle = "red"; 
        ctx.beginPath();
        ctx.arc(xPosition, noiseYPosition, dotRadius, 0, Math.PI * 2); 
        ctx.fill(); 
    
        // Draw the label "Noise"
        ctx.fillStyle = "red"; 
        ctx.font = "15px Arial"; 
        ctx.fillText("Noise", xPosition - 20, noiseYPosition + 30); 
    
        // Draw the yellow dot for "Signal + Noise"
        ctx.fillStyle = "yellow"; 
        ctx.beginPath();
        ctx.arc(xPosition, signalNoiseYPosition, dotRadius, 0, Math.PI * 2); 
        ctx.fill(); 
    
        // Draw the label "Signal + Noise"
        ctx.fillStyle = "yellow"; 
        ctx.fillText("Signal + Noise", xPosition - 60, signalNoiseYPosition + 30); 
    }

function drawGaussianDistributions() {
    drawProbabilityDistribution(offsetR, "rgb(255, 0, 0)", yOffsetR, color1, color2);
    drawProbabilityDistribution(offsetY + d, "rgb(255, 255, 0)", yOffsetY, color3, color4);
    drawCoordinateSystem();
    drawSensoryActivationLine(criterion, "rgb(119, 0, 137)");
}

function normalCDF(x) {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x);
    return sign * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
}

// Hilfsfunktion zur Berechnung der inversen CDF (Probit)
function inverseCDF(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const plow = 0.02425;
    const phigh = 1 - plow;
    let q, r;
    if (p < plow) {
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
            ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    } else if (phigh < p) {
        q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
            ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    } else {
        q = p - 0.5;
        r = q * q;
        return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q /
            (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
    }
}

let currentPoint = null; // Initialisiere currentPoint global
let drawnROCPoints = []; // Liste der ROC-Punkte für die Kurve

const manualPoints = {
    phase1: {
    A: { fpr: 0.84, tpr: 0.98 },
    B: { fpr: 0.69, tpr: 0.93},
    C: { fpr: 0.58, tpr: 0.88 },
    D: { fpr: 0.34, tpr: 0.73 },
    E: { fpr: 0.14, tpr: 0.46 },
    F: { fpr: 0.04, tpr: 0.24 },
    },
    phase2: {
    A: { fpr: 0.84, tpr: 0.99 },
    B: { fpr: 0.69, tpr: 0.98 },
    C: { fpr: 0.58, tpr: 0.95 },
    D: { fpr: 0.34, tpr: 0.86 },
    E: { fpr: 0.14, tpr: 0.65 },
    F: { fpr: 0.095, tpr: 0.58 },
    }
};

function drawManualPoint(phase, button) {
    const point = manualPoints[phase][button];
    const rightStartX = canvas.width / 2 + 50; // Start der ROC-Kurve
    const rightWidth = canvas.width / 2 - 100; // Breite der ROC-Kurve
    const bottomY = canvas.height - 50; // Unterkante der ROC-Kurve
    const topY = 50; // Oberkante der ROC-Kurve

    // Berechnung der Canvas-Koordinaten
    const canvasX = rightStartX + (point.fpr * rightWidth); // X-Koordinate
    const canvasY = bottomY - (point.tpr * (bottomY - topY)); // Y-Koordinate

    console.log(`Zeichne Punkt manuell: FPR=${point.fpr}, TPR=${point.tpr}, canvasX=${canvasX}, canvasY=${canvasY}`);

    // Zeichne den Punkt
    ctx.fillStyle = 'purple';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
    ctx.fill();
}
// Funktion zur Berechnung der ROC-Punkte
function generateROCPoints(dPrime) {
    const scaleFactor = 0.99; // Maßstab
    let points = [];
    for (let x = 0; x <= 1; x += 0.01) {
        const z = inverseCDF(x); // False-Positive Rate als z-Wert
        const y = normalCDF(z + dPrime * scaleFactor); // True-Positive Rate
        points.push({ fpr: x, tpr: y });
    }
    return points;
}
function calculateProbabilities(criterion, dPrime) {
    const scaleFactor = 0.5; // Maßstab für kleinere Schritte
    const scaledCriterion = criterion * scaleFactor;
    const scaledDPrime = dPrime * scaleFactor;

    const fpr = 1 - normalCDF(scaledCriterion); // False Alarm Rate (FPR)
    const tpr = 1 - normalCDF(scaledCriterion - scaledDPrime); // True Positive Rate (TPR)

    console.log(`Berechnete Werte: Criterion=${scaledCriterion}, dPrime=${scaledDPrime}, FPR=${fpr}, TPR=${tpr}`);
    return { fpr, tpr };
}

// Funktion zur Zeichnung der ROC-Kurve
function drawROCCurve(points) {
    const rightStartX = canvas.width / 2 + 50; // Start der X-Achse
    const rightWidth = canvas.width / 2 - 100; // Breite des ROC-Bereichs
    const bottomY = canvas.height - 50; // Unterkante der Y-Achse
    const topY = 50; // Oberkante der Y-Achse

    // Zeichne Koordinatensystem
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;

    // X-Achse
    ctx.beginPath();
    ctx.moveTo(rightStartX, bottomY);
    ctx.lineTo(rightStartX + rightWidth, bottomY);
    ctx.stroke();

    // Y-Achse
    ctx.beginPath();
    ctx.moveTo(rightStartX, bottomY);
    ctx.lineTo(rightStartX, topY);
    ctx.stroke();

    // Beschriftung der X- und Y-Achsen
    ctx.fillStyle = "blue";
    ctx.font = "14px Arial";

    // X-Achsenbeschriftung
    ctx.fillText("Proportion of false alarms", rightStartX + rightWidth / 2 - 50, bottomY + 30);

    // Y-Achsenbeschriftung (gedreht)
    ctx.save();
    ctx.translate(rightStartX - 30, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Proportion of hits", 0, 0);
    ctx.restore();

    // Skalierung der Achsen
    ctx.font = "12px Arial";

    // X-Achse
    for (let i = 0; i <= 10; i++) {
        const xPos = rightStartX + (i / 10) * rightWidth;
        ctx.fillText((i / 10).toFixed(1), xPos - 10, bottomY + 20);

        // Tick-Marks
        ctx.beginPath();
        ctx.moveTo(xPos, bottomY);
        ctx.lineTo(xPos, bottomY - 5);
        ctx.stroke();
    }

    // Y-Achse
    for (let i = 0; i <= 10; i++) {
        const yPos = bottomY - (i / 10) * (bottomY - topY);
        ctx.fillText((i / 10).toFixed(1), rightStartX - 25, yPos + 5);

        // Tick-Marks
        ctx.beginPath();
        ctx.moveTo(rightStartX, yPos);
        ctx.lineTo(rightStartX + 5, yPos);
        ctx.stroke();
    }

    // Diagonale Linie (Chance)
    ctx.setLineDash([5, 5]); // Gepunktete Linie
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(rightStartX, bottomY);
    ctx.lineTo(rightStartX + rightWidth, topY);
    ctx.stroke();
    ctx.setLineDash([]); // Linie zurücksetzen

    // ROC-Kurve zeichnen
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach(({ fpr, tpr }, index) => {
        const canvasX = rightStartX + fpr * rightWidth;
        const canvasY = bottomY - tpr * (bottomY - topY);
        if (index === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    });
    ctx.stroke();
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas löschen
    drawGaussianDistributions(); // Linke Gauß-Kurven zeichnen

    // ROC-Punkte generieren
    const rocPoints = generateROCPoints(d); 
    drawROCCurve(rocPoints); // ROC-Kurve zeichnen

    // Punkte manuell zeichnen
    if (currentCriterion) {
        const phase = currentPhase === 1 ? 'phase1' : 'phase2';
        const manualPoint = manualPoints[phase][currentCriterion];

        // Verifiziere, ob der Punkt auf der Kurve liegt
        const matchingPoint = rocPoints.find(
            (p) => Math.abs(p.fpr - manualPoint.fpr) < 0.01 && Math.abs(p.tpr - manualPoint.tpr) < 0.01
        );
        if (!matchingPoint) {
            console.warn('Der manuelle Punkt stimmt nicht mit der ROC-Kurve überein.');
        }
        drawManualPoint(phase, currentCriterion); // Manuell den Punkt zeichnen
    }
}

document.querySelectorAll('#abcContainer1 button, #abcContainer2 button').forEach(button => {
    button.addEventListener('click', () => {
        currentCriterion = button.textContent.trim(); // Button-Label als Kriterium
        criterion = criterionValues[currentCriterion]; // Aktualisiere Criterion
        updateButtonVisibility();
        updateProbabilityDisplay();
        
        // Berechne den Punkt für die Gauß-Kurve
        currentPoint = calculateProbabilities(criterion, d);
        const phase = currentPhase === 1 ? 'phase1' : 'phase2';
        drawManualPoint(phase, currentCriterion); // Manuell den Punkt zeichnen
        drawGraph(); // Zeichne die gesamte Grafik neu
    });
});

// Variable für den aktuell aktiven Button
let activeButton = null;

// Funktion zum Setzen des aktiven Buttons
function setActiveButton(button) {
    if (activeButton) {
        activeButton.classList.remove("active-button"); // Entferne vorherige Markierung
    }
    activeButton = button;
    activeButton.classList.add("active-button"); // Markiere neuen Button
}

// Funktion zum Entfernen der Markierung (bei "Zurücksetzen" oder "d' Erhöhen")
function removeActiveButton() {
    if (activeButton) {
        activeButton.classList.remove("active-button");
        activeButton = null;
    }
}

// Event-Listener für die ABCDEF-Buttons (Kriterien)
document.querySelectorAll('#abcContainer1 button, #abcContainer2 button').forEach((button) => {
    button.addEventListener('click', () => {
        setActiveButton(button); // Setze aktiven Button
    });
});

// Event-Listener für "Zurücksetzen" und "d' Erhöhen"
document.querySelectorAll('#resetButtonContainer button, #nextButtonContainer button').forEach((button) => {
    button.addEventListener('click', () => {
        removeActiveButton(); // Entferne aktive Markierung
    });
});

// Funktion zum Aktualisieren des Kriteriums
function updateCriterion() {
    // Überprüfen, ob das aktuelle Criterion gültig ist
    if (criterionValues[currentCriterion]) {
        criterion = criterionValues[currentCriterion]; // Neues Criterion basierend auf dem Button-Label
    } 
}

// Event-Handler für den Reset-Button
resetButtonContainer.addEventListener('click', () => {
    currentPhase = 1;
    currentCriterion = 'A';
    criterion = criterionValues[currentCriterion];
    currentPoint = null; // Aktuellen Punkt zurücksetzen
    const textfield = document.getElementById('textfield');
    if (textfield) {
        textfield.textContent = languages[localStorage.getItem('lang')]['instructions']; // Standardaufgabe
    }
    console.log('Reset: currentPoint zurückgesetzt.');
    drawGraph(); // Alles neu zeichnen
});

// Event-Handler für den "Increase d'"-Button
nextButtonContainer.addEventListener('click', () => {
    if (currentPhase === 1) {
        nextPhase(); // Wechsel zur nächsten Phase und aktualisiere die Kurven
    }
    currentCriterion = 'A';
    criterion = criterionValues[currentCriterion];
    currentPoint = null; // Aktuellen Punkt zurücksetzen
    console.log('Reset: currentPoint zurückgesetzt.');
    drawGraph(); // Alles neu zeichnen
});


// Initiales Setup
updateButtonVisibility();
updateProbabilityDisplay();
drawGraph();




