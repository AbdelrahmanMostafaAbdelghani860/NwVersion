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

let FPS = 30;

let images = []; // Array to hold corn images
let currentImage = 0;
let intervalId; // Variable to hold the interval ID

// Load images
for (let i = 0; i < 5; i++) {
    let img = new Image();
    img.src = `../resources/interactions/m2u2i4/img_${i}.png`;
    images[i] = img;
}

// Add event listeners
document.getElementById('ButtonOne').addEventListener('click', () => updateCurrentImage(0));
document.getElementById('ButtonTwo').addEventListener('click', () => updateCurrentImage(1));
document.getElementById('ButtonThree').addEventListener('click', () => updateCurrentImage(2));
document.getElementById('ButtonFour').addEventListener('click', imageAlternation); // Pass the function reference

function updateCurrentImage(buttonNum) {
    currentImage = buttonNum;
    clearInterval(intervalId); // Clear any existing interval
    draw();
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background color
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the current corn image
    const drawImage = images[currentImage];
    
    // Calculate the aspect ratio of the image
    const aspectRatio = drawImage.width / drawImage.height;
    
    // Determine the new dimensions to fit the canvas
    let imgWidth, imgHeight;
    if (canvas.width / canvas.height > aspectRatio) {
        // Canvas is wider than the image
        imgWidth = canvas.height * aspectRatio;
        imgHeight = canvas.height;
    } else {
        // Canvas is taller than the image
        imgWidth = canvas.width;
        imgHeight = canvas.width / aspectRatio;
    }
    
    // Calculate position to center the image
    const imgX = (canvas.width - imgWidth) / 2; // Center the image horizontally
    const imgY = (canvas.height - imgHeight) / 2; // Center the image vertically
    
    // Draw the scaled image
    ctx.drawImage(drawImage, imgX, imgY, imgWidth, imgHeight);


}

function imageAlternation() {
    clearInterval(intervalId); // Clear any existing interval
    let toggle = 0; // Variable to toggle between images 3 and 4
    currentImage = 3; // Start with image 3

    intervalId = setInterval(() => {
        currentImage = toggle % 2 === 0 ? 3 : 4; // Alternate between images 3 and 4
        draw();
        toggle++;
    }, 500); // Change image every 0.5 seconds
}

// Initial draw call to display the first image
draw();