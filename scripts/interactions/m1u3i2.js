const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultSecondaryColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-secondary-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}

// otherwise canvas resolution scales too low
canvas.width = window.innerWidth;
canvas.height = canvas.width/2; // alternatively: = window.innerHeight

let FPS = 30;

//init();

//Images
let defaultImage = new Image();
defaultImage.src = "../resources/interactions/m1u3i2/Default.png"; // Corrected path
defaultImage.onload = function() {
    ctx.drawImage(defaultImage, 0, 0, canvas.width, canvas.height); // Draw default image on load
};

let randomImage = new Image();
randomImage.src = "../resources/interactions/m1u3i2/FillRandomly.png";
let squareImage = new Image();
squareImage.src = "../resources/interactions/m1u3i2/DefineTexturalSquare.png";
let triangleImage = new Image();
triangleImage.src = "../resources/interactions/m1u3i2/DefineTexturalTriangle.png";
let diamondImage = new Image();
diamondImage.src = "../resources/interactions/m1u3i2/DefineTexturalDiamond.png";
let multipleImage = new Image();
multipleImage.src = "../resources/interactions/m1u3i2/ConfoundShapeWithColor.png";


//Buttons
RandomButton = document.getElementById('Random');
RandomButton.onclick = function() {
    clearCanvas();
    ctx.drawImage(randomImage, 0, 0, canvas.width, canvas.height);
}

SquareButton = document.getElementById('Square');
SquareButton.onclick = function() {
    clearCanvas();
    ctx.drawImage(squareImage, 0, 0, canvas.width, canvas.height);
}

TriangleButton = document.getElementById('Triangle');
TriangleButton.onclick = function() {
    clearCanvas();
    ctx.drawImage(triangleImage, 0, 0, canvas.width, canvas.height);
}

DiamondButton = document.getElementById('Diamond');
DiamondButton.onclick = function() {
    clearCanvas();
    ctx.drawImage(diamondImage, 0, 0, canvas.width, canvas.height);
}

MultipleButton = document.getElementById('Multiple');
MultipleButton.onclick = function() {
    clearCanvas();
    ctx.drawImage(multipleImage, 0, 0, canvas.width, canvas.height);    
}

ResetButton = document.getElementById('Resetbutton');
ResetButton.onclick = function() {
    clearCanvas();
    ctx.drawImage(defaultImage, 0, 0, canvas.width, canvas.height);
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Initialize the canvas with the default image
defaultImage.onload(); // This will draw the default image if it is already loaded

