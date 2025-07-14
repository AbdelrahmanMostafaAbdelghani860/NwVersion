const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}

// otherwise canvas resolution scales too low
canvas.width = window.innerWidth;
canvas.height = canvas.width/2; // alternatively: = window.innerHeight

let FPS = 30;


//Buttons & their functions
FiveMetersButton = document.getElementById('FiveMeters');
// Add event listener for the FiveMetersButton
FiveMetersButton.addEventListener('click', () => {
    let currentLang = localStorage.getItem('lang');
    drawImage(fiveImage);
    document.getElementById('visualAngleValue').textContent = '22.62°';
    document.getElementById('visualDistanceValue').textContent = '5m'
});

TenMetersButton = document.getElementById('TenMeters');
TenMetersButton.addEventListener('click', () => {
    drawImage(tenImage);
    document.getElementById('visualAngleValue').textContent = '11.42°';
    document.getElementById('visualDistanceValue').textContent = '10m';  
});

FifteenMetersButton = document.getElementById('FifteenMeters');
FifteenMetersButton.addEventListener('click', () => {
    drawImage(fifteenImage);
    document.getElementById('visualAngleValue').textContent = '7.63°';
    document.getElementById('visualDistanceValue').textContent = '15m';
});

TwentyMetersButton = document.getElementById('TwentyMeters');
TwentyMetersButton.addEventListener('click', () => {
    drawImage(twentyImage);
    document.getElementById('visualAngleValue').textContent = '5.72°';
    document.getElementById('visualDistanceValue').textContent = '20m';
});


//Load Images
const fiveImage = new Image();
fiveImage.src = "/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m2u2i1/Scale5m.png";

const tenImage = new Image();
tenImage.src = "/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m2u2i1/Scale10m.png";

const fifteenImage = new Image();
fifteenImage.src = "/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m2u2i1/Scale15m.png";

const twentyImage = new Image();
twentyImage.src = "/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m2u2i1/Scale20m.png";

// draw Images
// Function to draw an image on the canvas, scaled to fit
function drawImage(image) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate new dimensions to maintain aspect ratio
    const aspectRatio = image.width / image.height;
    let newWidth, newHeight;

    if (canvas.width / canvas.height > aspectRatio) {
        // Canvas is wider than the image aspect ratio
        newWidth = canvas.height * aspectRatio;
        newHeight = canvas.height;
    } else {
        // Canvas is taller than the image aspect ratio
        newWidth = canvas.width;
        newHeight = canvas.width / aspectRatio;
    }

    // Calculate the position to center the image
    const x = (canvas.width - newWidth) / 2; // Center the image horizontally
    const y = (canvas.height - newHeight) / 2; // Center the image vertically
    
    // Draw the image with new dimensions
    ctx.drawImage(image, x, y, newWidth, newHeight);
}


