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
canvas.height = canvas.width/2;

const continueButtonContainer = document.getElementById('continueContainer');
const resetButtonContainer1 = document.getElementById('resetContainer1');
const resetButtonContainer2 = document.getElementById('resetContainer2');
const resetButtonContainer3 = document.getElementById('resetContainer3');

let textfieldKeys = ['instructions', 'instruction2', 'instruction3', 'instruction4'];

init();
loadSettings();

function init() {
    first_phase_clicked = [0, 0];
    third_phase_toggled = false;
}
function saveSettings() {
    sessionStorage.setItem('settings', 'fps=' + FPS + '&phase=' + phase);
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
    setPhase((phase + 1) % 4);
}

function setPhase(newPhase) {
    phase = newPhase;
    textfield.textContent = languages[localStorage.getItem('lang')][textfieldKeys[phase]];
    textfield.style.color = 'inherit';
    
    switch(phase) {
        case 0:
            first_phase_clicked = [0, 0];
            continueButtonContainer.style.setProperty('display', 'inline');
            resetButtonContainer1.style.setProperty('display', 'inline');
            resetButtonContainer2.style.setProperty('display', 'none');
            resetButtonContainer3.style.setProperty('display', 'none');
            resetCanvas();
            break;
        case 1:
            continueButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer1.style.setProperty('display', 'inline');
            resetButtonContainer2.style.setProperty('display', 'none');
            resetButtonContainer3.style.setProperty('display', 'none');
            //resetCanvas();
            break;
        case 2:
            continueButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer1.style.setProperty('display', 'none');
            resetButtonContainer2.style.setProperty('display', 'inline');
            resetButtonContainer3.style.setProperty('display', 'none');
            resetCanvas();
            break;
        case 3:
            continueButtonContainer.style.setProperty('display', 'none');
            resetButtonContainer1.style.setProperty('display', 'none');
            resetButtonContainer2.style.setProperty('display', 'none');
            resetButtonContainer3.style.setProperty('display', 'inline');
            resetCanvas();
            break;
    }
    saveSettings();
}

function continueButtonFunction() {
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
}

function resetButtonFunction1() {
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

function resetButtonFunction2() {
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

function resetButtonFunction3() {
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

continueButton = document.getElementById('continueContainer');
continueButton.onclick = continueButtonFunction;

resetButton1 = document.getElementById('resetContainer1');
resetButton1.onclick = resetButtonFunction1;

resetButton2 = document.getElementById('resetContainer2');
resetButton2.onclick = resetButtonFunction2;

resetButton3 = document.getElementById('resetContainer3');
resetButton3.onclick = resetButtonFunction3;

function generateROCPoints(dPrime) {
    const scaleFactor = 0.5;
    let points = [];
    for (let x = 0; x <= 1; x += 0.01) {
        let z = inverseCDF(x); // False-Positive Rate als z-Wert
        console.log(`inverseCDF(${x}) = ${z}`);
        let y = normalCDF(z + dPrime * scaleFactor); // True-Positive Rate
        console.log(`normalCDF(${dPrime - z}) = ${y}`);
        points.push([x, y]);
    }
    return points;
}

// Hilfsfunktionen: Normalverteilung
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

console.log(erf(0)); // Sollte 0 sein
console.log(erf(1)); // Sollte etwa 0.8427 sein
console.log(erf(-1)); // Sollte etwa -0.8427 sein

function inverseCDF(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;

    // Näherung nach Wichura
    const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

    // Grenze für Nähe zu 0 und 1
    const plow = 0.02425;
    const phigh = 1 - plow;

    let q, r;
    if (p < plow) {
        // Rational approximation for lower region
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
            ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    } else if (phigh < p) {
        // Rational approximation for upper region
        q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
            ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    } else {
        // Rational approximation for central region
        q = p - 0.5;
        r = q * q;
        return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q /
            (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
    }
}

function drawPointOnCurve(points, probability) {
    const canvas = document.getElementById('interaction');
    const ctx = canvas.getContext('2d');

    // Punkt auf der Kurve berechnen
    const x = probability; // X-Wert ist die Wahrscheinlichkeit
    const closestPoint = points.find(point => Math.abs(point[0] - x) < 0.01);

    if (closestPoint) {
        const canvasX = 50 + closestPoint[0] * (canvas.width - 100);
        const canvasY = canvas.height - 50 - closestPoint[1] * (canvas.height - 100);

        // Punkt zeichnen
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function draw_first_phase(points) {
    const canvas = document.getElementById('interaction');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Achsen
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(canvas.width - 50, canvas.height - 50);
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(50, 50);
    ctx.stroke();

    // Titel und Diagonale
    ctx.fillStyle = 'cyan';
    ctx.font = '14px Arial';
    ctx.fillText('Proportion of False Alarms', canvas.width / 2 - 50, canvas.height - 10);
    ctx.save();
    ctx.translate(30, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Proportion of Hits', 0, 0);
    ctx.restore();

    ctx.strokeStyle = 'gray';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(canvas.width - 50, 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // ROC-Kurve
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    points.forEach(([x, y], index) => {
        const canvasX = 50 + x * (canvas.width - 100);
        const canvasY = canvas.height - 50 - y * (canvas.height - 100);
        if (index === 0) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    });
    ctx.stroke();
}

// Buttons für Standard- und Signal-Container
document.querySelectorAll('#standardContainer button, #signalContainer1 button').forEach((button, index) => {
    button.addEventListener('click', () => {
        currentDPrime = index + 1; // dPrime aktualisieren
        currentCurvePoints = generateROCPoints(currentDPrime);
        draw_first_phase(currentCurvePoints); // Kurve neu zeichnen
    });
});

document.querySelectorAll('#signalContainer1 button').forEach((button, index) => {
    button.addEventListener('click', () => {
        currentDPrime = index + 1; // dPrime aktualisieren
        currentCurvePoints = generateROCPoints(currentDPrime);
        draw_first_phase(currentCurvePoints); // Kurve neu zeichnen
    });
});
// Signalwahrscheinlichkeit-Buttons
document.querySelectorAll('#signalContainer2 button').forEach((button, index) => {
    button.addEventListener('click', () => {
        const probability = (index + 1) / 10;
        draw_first_phase(currentCurvePoints); // Kurve erneut zeichnen
        drawPointOnCurve(currentCurvePoints, probability); // Punkt zeichnen
    });
});

// Variable für den aktuell aktiven Button
let activeButton = null;

// Funktion für das Setzen des aktiven Buttons
function setActiveButton(button) {
    if (activeButton) {
        activeButton.classList.remove("active-button"); // Entferne vorherige Markierung
    }
    activeButton = button;
    activeButton.classList.add("active-button"); // Markiere neuen Button
}

// Funktion zum Entfernen der Markierung (z.B. bei "Weiter" oder "Zurücksetzen")
function removeActiveButton() {
    if (activeButton) {
        activeButton.classList.remove("active-button");
        activeButton = null;
    }
}

// Event-Listener für Standard-, Signal- und Wahrscheinlichkeits-Buttons
document.querySelectorAll('#standardContainer button, #signalContainer1 button, #signalContainer2 button').forEach((button) => {
    button.addEventListener('click', () => {
        setActiveButton(button); // Setze aktiven Button
    });
});

// Event-Listener für "Weiter" und "Zurücksetzen"-Buttons → Markierung entfernen
document.querySelectorAll('#continueContainer button, #resetContainer1 button, #resetContainer2 button, #resetContainer3 button').forEach((button) => {
    button.addEventListener('click', () => {
        removeActiveButton(); // Entferne aktive Markierung
    });
});

// Initiale Darstellung
window.onload = () => {
    currentCurvePoints = generateROCPoints(currentDPrime);
    draw_first_phase(currentCurvePoints);
};

function resetCanvas() {
    // Canvas leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hintergrund neu zeichnen
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Achsen zeichnen
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50); // X-Achse
    ctx.lineTo(canvas.width - 50, canvas.height - 50);
    ctx.moveTo(50, canvas.height - 50); // Y-Achse
    ctx.lineTo(50, 50);
    ctx.stroke();

    // Titel und Beschriftungen neu hinzufügen
    ctx.fillStyle = 'cyan';
    ctx.font = '14px Arial';
    ctx.fillText('Proportion of False Alarms', canvas.width / 2 - 50, canvas.height - 10);
    ctx.save();
    ctx.translate(30, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Proportion of Hits', 0, 0);
    ctx.restore();
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

/**window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 2;
});**/