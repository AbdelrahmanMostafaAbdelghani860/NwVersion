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

let star = new Image();
star.src = `../resources/interactions/m2u2i5/star.png`;
let square = new Image();
square.src = `../resources/interactions/m2u2i5/square.png`;

function drawImages() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the width and height of the images
    let starWidth = canvas.width / 2;
    let starHeight = starWidth * (star.height / star.width);
    let squareWidth = canvas.width / 2;
    let squareHeight = squareWidth * (square.height / square.width);

    // Draw the images
    ctx.drawImage(star, 0, (canvas.height - starHeight) / 2, starWidth, starHeight);
    ctx.drawImage(square, canvas.width / 2, (canvas.height - squareHeight) / 2, squareWidth, squareHeight);
}

setInterval(drawImages, 100);
