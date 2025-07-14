const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// Funktion zur Abfrage von CSS-Werten
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}

// Canvas-Größe setzen
canvas.width = window.innerWidth;
canvas.height = canvas.width / 2;

const images = {
    one: new Image(),
    two: new Image(),
    three: new Image(),
    four: new Image()
};

images.one.src = '../resources/interactions/m2u4i3/img1.png';
images.two.src = '../resources/interactions/m2u4i3/img2.png';
images.three.src = '../resources/interactions/m2u4i3/img3.png';
images.four.src = '../resources/interactions/m2u4i3/img4.png';

// Funktion zum Zeichnen des Bildes
function drawImageOnCanvas(image) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const maxWidth = canvas.width * 0.9;
    const maxHeight = canvas.height * 0.9;
    const aspectRatio = image.width / image.height;

    let targetWidth = maxWidth;
    let targetHeight = maxWidth / aspectRatio;

    if (targetHeight > maxHeight) {
        targetHeight = maxHeight;
        targetWidth = maxHeight * aspectRatio;
    }

    const x = (canvas.width - targetWidth) / 2;
    const y = (canvas.height - targetHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, x, y, targetWidth, targetHeight);
}

// Variable für den aktiven Button
let activeButton = null;

// Event-Handler für Button-Klicks
function handleButtonClick(view, buttonId) {
    drawImageOnCanvas(images[view]);

    // Falls ein anderer Button aktiv war, entferne die Markierung
    if (activeButton) {
        activeButton.classList.remove("active-button");
    }

    // Neuen aktiven Button markieren
    activeButton = document.getElementById(buttonId);
    activeButton.classList.add("active-button");
}

// Event-Listener für die Buttons
document.getElementById('one').addEventListener('click', () => handleButtonClick('one', 'one'));
document.getElementById('two').addEventListener('click', () => handleButtonClick('two', 'two'));
document.getElementById('three').addEventListener('click', () => handleButtonClick('three', 'three'));
document.getElementById('four').addEventListener('click', () => handleButtonClick('four', 'four'));
