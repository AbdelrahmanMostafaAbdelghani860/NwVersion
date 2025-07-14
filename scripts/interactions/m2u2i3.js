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

let growCounter = 0; //to know what height corn image to  display
//25, 50, 75, 100 ,125, 150, 175, 200cm -> 8 heights -> use mod 8
const cornHeights = [25, 50, 75, 100 ,125, 150, 175, 200]
const angles = [2.86 , 5.72, 8.58, 11.42, 14.25, 17.06, 19.85, 22.52]

//make array with images in correct order
const maxGrowthStages = 8; // 8 heights for corn images
let cornImages = []; // Array to hold corn images

// Load images
for (let i = 0; i < maxGrowthStages; i++) {
    let img = new Image();
    img.src = `../resources/interactions/m2u2i3/corn_stage_${i}.png`;
    cornImages[i] = img;
}


//Add Eventlisteners to the Buttons
document.getElementById('growCorn').addEventListener('click', updateGrowth);
document.getElementById('resetButton').addEventListener('click', () => {
    growCounter = 0;
    draw();
});

// Function to update the growCounter and redraw
function updateGrowth() {
    growCounter++;
    if (growCounter >= maxGrowthStages) {
        growCounter = 0; // Reset to 0 after reaching max stages
    }
    draw();
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background color
    ctx.fillStyle = getDefaultBGColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the current corn image
    const currentImage = cornImages[growCounter % maxGrowthStages];
    
    // Calculate the aspect ratio of the image
    const aspectRatio = currentImage.width / currentImage.height;
    
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
    ctx.drawImage(currentImage, imgX, imgY, imgWidth, imgHeight);

    // Set text properties for the text below the image
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center"; // Center the text
    
    // Draw the text below the image
    ctx.fillText("D = 5m", canvas.width / 2, imgY + imgHeight + 30); // Adjust Y position as needed
    
    // Draw the text above the image with the alpha symbol
    ctx.fillText("tan(α/2) = S/2D", canvas.width / 2, imgY - 10); // Adjust Y position as needed

    setText();
}

function setText(){
    let currentLang = localStorage.getItem('lang');
    document.getElementById('visualAngle').textContent = languages[currentLang]['visualAngle'] + angles[growCounter] + '°';
    document.getElementById('cornHeight').textContent = languages[currentLang]['cornHeight'] + cornHeights[growCounter] + 'cm';
}

setInterval(draw, 100);


