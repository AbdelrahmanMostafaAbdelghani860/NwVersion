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


// Add event listeners to the sliders
document.getElementById('DSlider').addEventListener('input', displaySliderValues);
document.getElementById('SSlider').addEventListener('input', displaySliderValues);

function displaySliderValues() {
    let currentLang = localStorage.getItem('lang');
    // Get the value of the Sliders
    let DValue = document.getElementById('DSlider').value;
    let SValue = document.getElementById('SSlider').value;

    // Update the DVal element with the current value of DSlider
    document.getElementById('DVal').textContent = languages[currentLang]['DVal'] + DValue + 'cm';
    document.getElementById('SVal').textContent = languages[currentLang]['SVal'] + SValue + 'cm';

    calculateAlpha();

    // Clear the canvas and redraw the image and line
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerY = (canvas.height - EyeImage.height) / 2; // recalculate centerY
    ctx.drawImage(EyeImage, 0, centerY, EyeImage.width, EyeImage.height);

    drawDLine(centerY);
    drawSLine(centerY, EyeImage.width + (DValue / 300) * (canvas.width - EyeImage.width - (canvas.width * 0.1))); // Pass the end of the D line
   
    // Calculate the position for the equation text
    const equationX = canvas.width / 2; // Middle of the canvas
    const equationY = canvas.height*0.1; // Near the top

    // Specify the equation text
    const equationText = " tan(alpha/2) = S/2D";

    // Draw the equation text
    ctx.font = '24px Arial'; // Adjust font size and family as needed
    ctx.fillStyle = 'black'; // Set text color
    ctx.textAlign = 'center'; // Center the text horizontally
    ctx.fillText(equationText, equationX, equationY); // Draw the equation text
}

// this returns different values than original program
function calculateAlpha() {
    // Get the current values of the sliders
    let DValue = parseFloat(document.getElementById('DSlider').value);
    let SValue = parseFloat(document.getElementById('SSlider').value);

    // Calculate S / (2 * D)
    let ratio = SValue / (2 * DValue);

    // Calculate alpha/2 using the arctangent
    let alphaOver2 = Math.atan(ratio);

    // Convert alpha/2 from radians to degrees and multiply by 2 to get alpha
    let alpha = alphaOver2 * (180 / Math.PI) * 2;

    // Update the AlphaVal element with the calculated alpha value
    let currentLang = localStorage.getItem('lang');
    document.getElementById('AlphaVal').textContent = languages[currentLang]['AlphaVal'] + alpha.toFixed(2) + '°';
}


//Load Images
const EyeImage = new Image();
EyeImage.src = "../resources/interactions/m2u2i2/skinPlusEyeball.png";
const endOfImage = EyeImage.width; //The img ends this far into the canvas

EyeImage.onload = function() { 
    // Calculate vertical center position 
    const centerY = (canvas.height - EyeImage.height) / 2; // vertical center of Canvas
    // Draw the image starting at the left border of the canvas 
    ctx.drawImage(EyeImage, 0, centerY, EyeImage.width, EyeImage.height); 
    console.log('Img width :', EyeImage.width);

    let DValue = document.getElementById('DSlider').value;
    let SValue = document.getElementById('SSlider').value;
    drawDLine(centerY);
    drawSLine(centerY, EyeImage.width + (DValue / 300) * (canvas.width - EyeImage.width - (canvas.width * 0.1)));

    // Calculate the position for the equation text
    const equationX = canvas.width / 2; // Middle of the canvas
    const equationY = canvas.height*0.1; // Near the top

    // Specify the equation text
    const equationText = " tan(alpha/2) = S/2D";

    // Draw the equation text
    ctx.font = '24px Arial'; // Adjust font size and family as needed
    ctx.fillStyle = 'black'; // Set text color
    ctx.textAlign = 'center'; // Center the text horizontally
    ctx.fillText(equationText, equationX, equationY); // Draw the equation text
    
};  

function drawDLine(centerY) { 
    // Get the current value of the DSlider 
    let DValue = parseFloat(document.getElementById('DSlider').value); 

    // Define the maximum value for the DSlider
    const maxD = 300; // Replace this with the actual maximum value of your slider

    // Calculate the start position of the red line
    const startX = EyeImage.width; // Start at the right edge of the EyeImage

     // Define the padding from the right edge of the canvas
     const rightPadding = canvas.width*0.1;

   // Calculate the end position of the red line
   const endX = startX + (DValue / maxD) * (canvas.width - startX - rightPadding); 

    // Calculate the vertical position for the line to be below the image
    const lineY = centerY + EyeImage.height; // Position the line below the image

    // Draw the red line 
    ctx.beginPath(); 
    ctx.moveTo(startX, lineY); // Start at the calculated startX and lineY
    ctx.lineTo(endX, lineY); // End at the calculated endX and lineY
    ctx.strokeStyle = 'red'; 
    ctx.lineWidth = 3; 
    ctx.stroke(); 

    // Calculate the midpoint of the line for the text
    const midX = (startX + endX) / 2;

    // Set font properties
    ctx.font = '18px Arial'; // Adjust font size and family as needed
    ctx.fillStyle = 'black'; // Set text color

    // Draw the text "D" centered under the line
    ctx.fillText('D', midX, lineY + 20); // Adjust the vertical position as needed
}


//draw a vertical line whose midpoint is always at centerY
//It should be as tall as the eyeImage at the maximan S slider value
//it needs to start at X value where the D line ends

function drawSLine(centerY, endDLine) {
    // Get the current value of the SSlider
    let SValue = parseFloat(document.getElementById('SSlider').value);

    // Calculate the start position of the S line
    const startX = endDLine; // Start at the end of the D line

    // Calculate the total height of the S line based on the SValue
    const totalHeight = (SValue / 130) * EyeImage.height; // Scale to EyeImage height

    // Calculate the vertical position for the line
    const lineYStart = (canvas.height - EyeImage.height) / 2 + (EyeImage.height / 2); // Midpoint of the EyeImage
    const lineYEndUp = lineYStart - (totalHeight / 2); // End position upwards
    const lineYEndDown = lineYStart + (totalHeight / 2); // End position downwards
    console.log(lineYEndDown)

    // Draw the vertical line
    ctx.beginPath();
    ctx.moveTo(startX, lineYEndUp); // Start at the calculated endY upwards
    ctx.lineTo(startX, lineYEndDown); // End at the calculated endY downwards
    ctx.strokeStyle = 'blue'; // Change color for distinction
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '18px Arial'; // Adjust font size and family as needed
    ctx.fillStyle = 'black'; // Set text color

    // Draw the text "S" next to the line
    ctx.fillText('S', startX + 5, lineYStart); // Adjust the position as needed

    // Where the dotted lines should cross
    const middleLeftX = EyeImage.width - 100;
    const middleRightY = canvas.height / 2; // Middle of the canvas height

    // Draw the alpha symbol at the calculated position
    ctx.fillText('α', middleLeftX + canvas.width*0.1, middleRightY); // Draw alpha symbol

    let extensionLength = EyeImage.width*0.5;

    // Get the new endpoint after extending the line for the upper endpoint
    const { newX, newY } = extendLineUp(startX, lineYEndUp, middleLeftX, middleRightY, extensionLength);
    
    // Get the new endpoint after extending the line for the lower endpoint
    const { newXD, newYD } = extendLineDown(startX, lineYEndDown, middleLeftX, middleRightY, extensionLength);  

    console.log('Upper Dotted Line:', newX, newY);
    console.log('Lower Dotted Line:', newXD, newYD);

    // Draw dotted lines from the S line to the crossing point
    drawDottedLine(startX, lineYEndUp, newX, newY); // Upper dotted line
    drawDottedLine(startX, lineYEndDown, newXD, newYD); // Lower dotted line

    // Draw the vertical line
    ctx.beginPath();
    ctx.moveTo(newX, newY); // Start at the calculated endY upwards
    ctx.lineTo(newXD, newYD); // End at the calculated endY downwards
    ctx.strokeStyle = 'blue'; // Change color for distinction
    ctx.lineWidth = 3;
    ctx.stroke();
}

function extendLineUp(startX, lineYEndUp, middleLeftX, middleRightY, extensionLength) {
    // Calculate the differences in x and y
    const deltaX = middleLeftX - startX;
    const deltaY = middleRightY - lineYEndUp;

    // Calculate the distance between the two points
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calculate the unit vector components
    const unitX = deltaX / distance;
    const unitY = deltaY / distance;

    // Calculate the new endpoint coordinates
    const newX = middleLeftX + extensionLength * unitX;
    const newY = middleRightY + extensionLength * unitY;

    return { newX, newY }; // Return the new coordinates as an object
}

function extendLineDown(startX, lineYEndDown, middleLeftX, middleRightY, extensionLength) {
    // Calculate the differences in x and y
    const deltaXD = middleLeftX - startX;
    const deltaYD = middleRightY - lineYEndDown;

    // Calculate the distance between the two points
    const distanceD = Math.sqrt(deltaXD * deltaXD + deltaYD * deltaYD);

    // Calculate the unit vector components
    const unitXD = deltaXD / distanceD;
    const unitYD = deltaYD / distanceD;

    // Calculate the new endpoint coordinates
    const newXD = middleLeftX + extensionLength * unitXD;
    const newYD = middleRightY + extensionLength * unitYD;

    return { newXD, newYD }; // Return the new coordinates as an object
}

// Function to draw a dotted line
function drawDottedLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.setLineDash([2, 2]); // Set the dash pattern (5 pixels on, 5 pixels off)
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'black'; // Change color for distinction
    ctx.lineWidth = 1; // Set line width
    ctx.stroke();
    ctx.setLineDash([]); // Reset to solid line
}


 

