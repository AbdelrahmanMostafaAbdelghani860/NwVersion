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

const unitCount = 14; // Number of units on the x-axis
const unitWidth = (canvas.width - 100) / unitCount; // Calculate width of each unit
const subUnitCount = 5; // Number of sub-units between each main unit
const subUnitWidth = unitWidth / subUnitCount;

let offsetR = 0; //static offset red curve, it stays put in this interaction
let offsetY = 4; //static offset yellow curve, it stays put in this interaction

let mLine = false;

let distHeight = 0;

let posOfSensoryActivivation = 0;


// Get the distMeans button
const distMeansButton = document.getElementById('distMeans');
const activation1 = document.getElementById('activation1');
const activation2 = document.getElementById('activation2');
const activation3 = document.getElementById('activation3');
const activation4 = document.getElementById('activation4');
const activation5 = document.getElementById('activation5');
const activation6 = document.getElementById('activation6');
const activation7 = document.getElementById('activation7');
const activation8 = document.getElementById('activation8');
const activation9 = document.getElementById('activation9');
const activation10 = document.getElementById('activation10');

// Add an event listeners to the buttons

distMeansButton.addEventListener('click', function() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setMLine(); // Toggle the mLine variable
    drawCurves(offsetR, offsetY); // Redraw the curves
    drawCoordinateSystem(); // Redraw the coordinate system

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }

    if(posOfSensoryActivivation > 0){
        drawSensoryActivationLine(posOfSensoryActivivation, 'cyan');
    }
});

activation1.addEventListener('click', function(){
    posOfSensoryActivivation = 1;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(1, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }

    updateProbabilityVals();
});

activation2.addEventListener('click', function(){
    posOfSensoryActivivation = 2;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(2, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation3.addEventListener('click', function(){
    posOfSensoryActivivation = 3;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(3, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation4.addEventListener('click', function(){
    posOfSensoryActivivation = 4;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(4, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation5.addEventListener('click', function(){
    posOfSensoryActivivation = 5;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(5, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation6.addEventListener('click', function(){
    posOfSensoryActivivation = 6;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(6, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation7.addEventListener('click', function(){
    posOfSensoryActivivation = 7;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(7, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation8.addEventListener('click', function(){
    posOfSensoryActivivation = 8;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(8, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation9.addEventListener('click', function(){
    posOfSensoryActivivation = 9;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(9, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

activation10.addEventListener('click', function(){
    posOfSensoryActivivation = 10;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawCurves(offsetR, offsetY);
    drawCoordinateSystem();
    drawSensoryActivationLine(10, 'cyan');

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateProbabilityVals();
});

function drawCoordinateSystem() {

    ctx.font = "20px Arial";
    ctx.fillStyle = "blue";

    ctx.lineWidth = 3; 
    ctx.strokeStyle = "blue";

    // Draw X-Axis
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50); // Starting point of the x-axis
    ctx.lineTo(canvas.width - 50, canvas.height - 50); // Ending point of the x-axis
    ctx.stroke();

    // Draw Y-Axis
    ctx.beginPath();
    ctx.moveTo(50, 50); // Starting point of the y-axis
    ctx.lineTo(50, canvas.height - 50); // Ending point of the y-axis
    ctx.stroke();

    // Draw X-Axis Units

    for (let i = 0; i <= unitCount; i++) {
        const x = 50 + (i * unitWidth); // Calculate x position for each unit
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - 60); // Line just above the x-axis
        ctx.lineTo(x, canvas.height - 40); // Line just below the x-axis
        ctx.stroke();
        
        // Add unit labels
        ctx.fillText(i, x - 5, canvas.height - 20); // Draw unit numbers below the x-axis

        // Draw sub-units
        for (let j = 1; j < subUnitCount; j++) {
            if(i != 14) {
                const subX = x + (j * subUnitWidth); // Calculate x position for each sub-unit
            ctx.beginPath();
            ctx.moveTo(subX, canvas.height - 55); // Line just above the x-axis
            ctx.lineTo(subX, canvas.height - 45); // Line just below the x-axis
            ctx.stroke();
            }  
        }
    }

    // Draw the labels for the axes
    drawYAxisLabel("Probability Density");
    drawXAxisLabel("Level of Activation of Sensory System");

    drawLabelsAndDots();
}

function drawYAxisLabel(label) {
    ctx.save(); // Save the current state
    ctx.translate(20, canvas.height / 2); // Move to the position for the label
    ctx.rotate(-Math.PI / 2); // Rotate the context 90 degrees counter-clockwise
    ctx.fillStyle = "blue"; 
    ctx.fillText(label, 0, 0);
    ctx.restore(); // Restore the context to its original state
}

function drawXAxisLabel(label) {
    ctx.fillStyle = "blue"; 
    ctx.fillText(label, canvas.width / 2 - 100, canvas.height - 5); 
}

function drawProbabilityDistribution(offset, lineColor) {
    const mean = 3 + offset; // Mean of the distribution
    const stdDev = 1; // Standard deviation (smaller value = taller peak)
    const scalingFactor = canvas.height/1.5; // Adjust this value to make the distribution taller

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // Set fill color for the distribution
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;

    // Draw the probability distribution
    ctx.beginPath();
    const startX = 0; // Start 3 units before the mean
    const endX = 14; // End 3 units after the mean

    let peakHeight = canvas.height; // Variable to track the peak height of the current distribution

    for (let x = startX; x <= endX; x += 0.1) {
        let probability = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)); // Use stdDev for the calculation
        let y = canvas.height - 50 - (probability * scalingFactor); // Scale the y value for visibility
        if (y < peakHeight) {
            peakHeight = y; // Update peakHeight
        }
        if (x === startX) {
            ctx.moveTo(50 + ((x) * unitWidth), y);
        } else {
            ctx.lineTo(50 + ((x) * unitWidth), y);
        }
    }
    ctx.lineTo(50 + (endX * unitWidth), canvas.height - 50); // Close the path
    ctx.lineTo(50 + (startX * unitWidth), canvas.height - 50); // Close the path
    ctx.fill(); // Fill the area under the curve

    // Draw the outline of the distribution
    ctx.stroke(); // Stroke the line with the specified color

    distHeight = peakHeight;
}

function drawCurves(offsetR, offsetY){
    offsetR = offsetR;
    offsetY = offsetY;
    drawProbabilityDistribution(offsetR, "rgb(255, 0, 0)");
    drawProbabilityDistribution(offsetY, "rgb(255, 255, 0)");
}


function setMLine(){
    mLine = !mLine; //toggle mline
}

function drawMeanLine(mean, lineColor) {
    const xPosition = 50 + (mean * unitWidth); // Calculate the x position for the mean
    const yStart = distHeight; 
    const yEnd = canvas.height - 50; 

    ctx.beginPath();
    ctx.moveTo(xPosition, yStart); 
    ctx.lineTo(xPosition, yEnd);
    ctx.strokeStyle = lineColor; 
    ctx.lineWidth = 3; 
    ctx.stroke(); 
}

function drawSensoryActivationLine(x, lineColor) {
    const xPosition = 50 + (x * unitWidth);
    const yStart = distHeight - canvas.height / 10; // A bit taller than the distributions
    const yEnd = canvas.height - 50; // End at the x-axis

    // Draw the main line
    ctx.beginPath();
    ctx.moveTo(xPosition, yStart);
    ctx.lineTo(xPosition, yEnd); 
    ctx.strokeStyle = lineColor; 
    ctx.lineWidth = 5;
    ctx.stroke(); 

    // Draw the horizontal line at the top to form a "T"
    const horizontalLineLength = 15; // Length of the horizontal line
    const horizontalYPosition = yStart; 

    ctx.beginPath();
    ctx.moveTo(xPosition - horizontalLineLength / 2, horizontalYPosition); 
    ctx.lineTo(xPosition + horizontalLineLength / 2, horizontalYPosition); 
    ctx.strokeStyle = lineColor; // Use the same color
    ctx.lineWidth = 5; // Keep the same line width
    ctx.stroke(); 
}

function drawLabelsAndDots() {
    // Set the position for the labels and dots
    const dotRadius = 10;
    const xPosition = canvas.width - 80; // X position for the dots and labels
    const noiseYPosition = 100; // Y position for the "Noise" label
    const signalNoiseYPosition = 150; // Y position for the "Signal + Noise" label

    // Draw the red dot for "Noise"
    ctx.fillStyle = "red"; 
    ctx.beginPath();
    ctx.arc(xPosition, noiseYPosition, dotRadius, 0, Math.PI * 2); 
    ctx.fill(); // Fill the dot

    // Draw the label "Noise"
    ctx.fillStyle = "red"; 
    ctx.font = "20px Arial"; 
    ctx.fillText("Noise", xPosition - 20, noiseYPosition + 30); 

    // Draw the yellow dot for "Signal + Noise"
    ctx.fillStyle = "yellow"; 
    ctx.beginPath();
    ctx.arc(xPosition, signalNoiseYPosition, dotRadius, 0, Math.PI * 2); 
    ctx.fill();

    // Draw the label "Signal + Noise"
    ctx.fillStyle = "yellow"; 
    ctx.fillText("Signal + Noise", xPosition - 60, signalNoiseYPosition + 30); 
}

//Display current values for probabilities.
function updateProbabilityVals(){

    if(posOfSensoryActivivation == 0){
        document.getElementById('probNoiseVal').textContent = '0.0000';
        document.getElementById('probSignalNoiseVal').textContent = '0.0000';
    }
    if(posOfSensoryActivivation == 1){
        document.getElementById('probNoiseVal').textContent = '0.0215';
        document.getElementById('probSignalNoiseVal').textContent = '0.0000';
    }
    if(posOfSensoryActivivation == 2){
        document.getElementById('probNoiseVal').textContent = '0.0965';
        document.getElementById('probSignalNoiseVal').textContent = '0.0000';
    }
    if(posOfSensoryActivivation == 3){
        document.getElementById('probNoiseVal').textContent = '0.1592';
        document.getElementById('probSignalNoiseVal').textContent = '0.0000';
    }
    if(posOfSensoryActivivation == 4){
        document.getElementById('probNoiseVal').textContent = '0.0965';
        document.getElementById('probSignalNoiseVal').textContent = '0.0017';
    }
    if(posOfSensoryActivivation == 5){
        document.getElementById('probNoiseVal').textContent = '0.0215';
        document.getElementById('probSignalNoiseVal').textContent = '0.0215';
    }
    if(posOfSensoryActivivation == 6){
        document.getElementById('probNoiseVal').textContent = '0.0017';
        document.getElementById('probSignalNoiseVal').textContent = '0.0965';
    }
    if(posOfSensoryActivivation == 7){
        document.getElementById('probNoiseVal').textContent = '0.0000';
        document.getElementById('probSignalNoiseVal').textContent = '0.1592';
    }
    if(posOfSensoryActivivation == 8){
        document.getElementById('probNoiseVal').textContent = '0.0000';
        document.getElementById('probSignalNoiseVal').textContent = '0.0965';
    }
    if(posOfSensoryActivivation == 9){
        document.getElementById('probNoiseVal').textContent = '0.0000';
        document.getElementById('probSignalNoiseVal').textContent = '0.0215';
    }
    if(posOfSensoryActivivation == 10){
        document.getElementById('probNoiseVal').textContent = '0.0000';
        document.getElementById('probSignalNoiseVal').textContent = '0.0017';
    }
    
}

// Call the function to draw the coordinate system
updateProbabilityVals();
drawCurves(offsetR, offsetY);
drawCoordinateSystem();


