const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

function getCurrentLanguage() {
    return document.documentElement.lang;
    
}
function setLanguage(language) {
    document.documentElement.lang = language; // Sprache des Dokuments setzen
    updateTextBasedOnLanguage(); // Texte basierend auf der Sprache aktualisieren
}

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

canvas.width = window.innerWidth * 0.5;
canvas.height = canvas.width / 1.5;

// Daten
const standardValues = [100, 200, 300, 400, 500, 600];
const comparisonValues = [102, 204, 306, 408, 510, 612];
const jndValues = [2, 4, 6, 8, 10, 12];
const deltaI_I = 0.02; // Konstantes Verhältnis ΔI/I
const yMax = 0.14; // Maximale Höhe für die y-Achse

let points = [];
let currentMaxIndex = -1;


// Variable zum Speichern des aktuellen aktiven Buttons
let activeButton = null;

// Event-Listener für Buttons
document.querySelectorAll('.buttoncontainer button').forEach((button, index) => {
    button.addEventListener('click', () => {
        // Entferne die Markierung vom vorherigen aktiven Button
        if (activeButton) {
            activeButton.classList.remove("active-button");
        }

        // Setze den aktuellen Button als aktiv und füge die Klasse hinzu
        activeButton = button;
        activeButton.classList.add("active-button");

        // Aktualisiere den Graphen und die Vergleichswerte
        currentMaxIndex = index;
        updateGraph();
        updateComparisonJNDValues(index);
    });
});

// Aktualisiere Graph bis zum aktuellen Button
function updateGraph() {
    points = [];
    for (let i = 0; i <= currentMaxIndex; i++) {
        const x = 50 + (standardValues[i] / 600) * (canvas.width - 100); // X-Werte skalieren
        const y = canvas.height - 50 - (deltaI_I / yMax) * (canvas.height - 100); // Y-Werte skalieren
        points.push({ x, y });
    }
    drawGraph();
}

// Graph zeichnen (Punkte, Achsen und Linien)
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();

    // Punkte zeichnen
    ctx.fillStyle = 'blue';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Linie nur beim letzten Punkt
    if (currentMaxIndex === standardValues.length - 1) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();
    }
}

// Achsen mit Ticks und Beschriftungen zeichnen
function drawAxes() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    // X-Achse
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(canvas.width - 50, canvas.height - 50);
    ctx.stroke();

    // Y-Achse
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, canvas.height - 50);
    ctx.stroke();

    // Ticks und Beschriftungen
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';

    // X-Achse Werte
    for (let i = 0; i < standardValues.length; i++) {
        const x = 50 + (standardValues[i] / 600) * (canvas.width - 100);
        ctx.fillText(standardValues[i], x - 10, canvas.height - 30);
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - 50);
        ctx.lineTo(x, canvas.height - 45);
        ctx.stroke();
    }
    ctx.fillText('Standard (I)', canvas.width / 2, canvas.height - 10);

    // Y-Achse Werte (0 bis 0.14)
    for (let i = 0; i <= yMax; i += 0.02) {
        const y = canvas.height - 50 - (i / yMax) * (canvas.height - 100);
        ctx.fillText(i.toFixed(2), 20, y + 5);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(45, y);
        ctx.stroke();
    }
    ctx.fillText('ΔI / I', 10, 30);
}

// Vergleichs- und JND-Werte aktualisieren
function updateComparisonJNDValues(index) {
    const comparisonValues = [102, 204, 306, 408, 510, 612];
    const jndValues = [2, 4, 6, 8, 10, 12];

    // Elemente für die Tabelle rechts auswählen
    const comparisonTable = document.querySelectorAll('[key^="button1.1"],[key^="button1.2"],[key^="button1.3"],[key^="button1.4"],[key^="button1.5"],[key^="button1.6"]');
    const jndTable = document.querySelectorAll('[key^="button2.1"],[key^="button2.2"],[key^="button2.3"],[key^="button2.4"],[key^="button2.5"],[key^="button2.6"]');

    // Update nur die Werte in der Tabelle auf der rechten Seite
    comparisonTable[index].textContent = comparisonValues[index];
    comparisonTable[index].style.display = 'block';
    comparisonTable[index].style.color = 'white'; // Farbe auf Weiß setzen

    jndTable[index].textContent = jndValues[index];
    jndTable[index].style.display = 'block';
    jndTable[index].style.color = 'white'; // Farbe auf Weiß setzen
}