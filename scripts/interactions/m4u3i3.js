const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

function getCurrentLanguage() {
    return document.documentElement.lang;
    
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

// Dynamische Canvas-Größe
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.6;
    canvas.height = canvas.width / 1.5;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const xMax = 100;
const yMax = 80;

function animateGraph(m, a) {
    let t = 0; // Fortschritt der X-Achse
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes(); // Zeichne Achsen vor Beginn der Animation

    // Berechne das maximale S für xMax
    const dynamicYMax = a * Math.pow(xMax, m); // Y-Max dynamisch berechnen

    function drawFrame() {
        if (t > xMax) return; // Animation stoppen, wenn xMax erreicht ist

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAxes(dynamicYMax); // Achsen mit neuer Y-Skalierung zeichnen

        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;

        for (let x = 0; x <= t; x++) {
            const y = a * Math.pow(x, m); // Berechne Y-Wert
            if (y > dynamicYMax) break;

            const xPos = 50 + (x / xMax) * (canvas.width - 100);
            const yPos = canvas.height - 50 - (y / dynamicYMax) * (canvas.height - 100);

            if (x === 0) ctx.moveTo(xPos, yPos);
            else ctx.lineTo(xPos, yPos);
        }
        ctx.stroke();

        t += 1; // Geschwindigkeit der Animation
        requestAnimationFrame(drawFrame);
    }
    drawFrame();
}

function drawAxes(dynamicYMax = 80) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 50;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';

    // X- und Y-Achse
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // X-Achse Ticks
    for (let i = 0; i <= xMax; i += 20) {
        const x = padding + (i / xMax) * (canvas.width - 2 * padding);
        ctx.moveTo(x, canvas.height - padding);
        ctx.lineTo(x, canvas.height - padding + 5);
        ctx.fillText(i, x - 5, canvas.height - padding + 20);
    }

    // Y-Achse Ticks
    for (let i = 0; i <= dynamicYMax; i += Math.ceil(dynamicYMax / 4)) {
        const y = canvas.height - padding - (i / dynamicYMax) * (canvas.height - 2 * padding);
        ctx.moveTo(padding, y);
        ctx.lineTo(padding - 5, y);
        ctx.fillText(Math.round(i), padding - 30, y + 5);
    }

    // Achsentitel
    ctx.fillText("Stimulus magnitude (I)", canvas.width / 2 - 50, canvas.height - 10);
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Psychological magnitude (S)", 0, 0);
    ctx.restore();
}

// Test: Einen Graphen zeichnen (z.B. Temperatur)
drawAxes();
//animateGraph(1.6, 0.1); // Beispielwerte für m und a

const graphsData = [
    { key: 'button1', m: 1.6, a: 0.1 },
    { key: 'button2', m: 1.5, a: 0.1 },
    { key: 'button3', m: 1.3, a: 0.1 },
    { key: 'button4', m: 3.5, a: 0.02 },
    { key: 'button5', m: 1.45, a: 0.1 },
    { key: 'button6', m: 1.7, a: 0.1 },
    { key: 'button7', m: 1.0, a: 0.5 },
    { key: 'button8', m: 1.41, a: 0.1 },
    { key: 'button9', m: 0.6, a: 9.0 }
];

// Variable zum Speichern des aktuellen aktiven Buttons
let activeButton = null;

// Event-Listener für Buttons
document.querySelectorAll('#sensoryContainer input').forEach((button, index) => {
    button.addEventListener('click', () => {
        const { m, a } = graphsData[index];
        animateGraph(m, a);
        updateTableValues(index);

        // Entferne die Markierung vom vorherigen aktiven Button
        if (activeButton) {
            activeButton.classList.remove("active-button");
        }

        // Setze den aktuellen Button als aktiv und füge die Klasse hinzu
        activeButton = button;
        activeButton.classList.add("active-button");
    });
});

function updateTableValues(index) {
    // Alle vorherigen Werte ausblenden
    const mValues = document.querySelectorAll('[key^="button1."]');
    const aValues = document.querySelectorAll('[key^="button2."]');
    mValues.forEach(el => {
        el.style.display = 'none';
        el.textContent = ''; // Werte zurücksetzen
    });
    aValues.forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });

    // Neue Werte anzeigen
    const currentM = document.querySelector(`[key="button1.${index + 1}"]`);
    const currentA = document.querySelector(`[key="button2.${index + 1}"]`);
    if (currentM && currentA) {
        currentM.textContent = graphsData[index].m;
        currentA.textContent = graphsData[index].a;
        currentM.style.display = 'block';
        currentA.style.display = 'block';
        currentM.style.color = 'white';
        currentA.style.color = 'white';
        currentM.style.textAlign = 'center';
        currentA.style.textAlign = 'center';
    }
}
