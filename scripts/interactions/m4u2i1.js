//probability distribution interaction

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

let offsetR = 2; //starting offset red curve
let offsetY = 5; //starting offset yellow curve

let mLine = false;

let distHeight = 0;

let instructionsCounter = 0;

// Get the distMeans button
const distMeansButton = document.getElementById('distMeans');

// Add an event listener to the button
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
});

const incSigIntButton = document.getElementById('incSigInt');

// Add an event listener to the button
//moves yellow dist to the right -> no problem
incSigIntButton.addEventListener('click', function() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offsetY += 0.25; // Increase offsetY by 1 (you can adjust this value as needed)
    drawCurves(offsetR, offsetY); // Redraw the curves
    drawCoordinateSystem(); // Redraw the coordinate system

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateMeansDisplay();
});

const decSigIntButton = document.getElementById('decSigInt');

// Add an event listener to the button
//moves yellow dist left -> make sure it doesnt pass red red dist
decSigIntButton.addEventListener('click', function() {
    if(offsetR < offsetY){
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        offsetY -= 0.25; // Increase offsetY by 1 (you can adjust this value as needed)
        drawCurves(offsetR, offsetY); // Redraw the curves
        drawCoordinateSystem(); // Redraw the coordinate system
    
        // Draw the mean lines if mLine is true
        if (mLine) {
            drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
            drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
        }
    }
    updateMeansDisplay();
   
});

// Get the incNoiseInt button
const incNoiseIntButton = document.getElementById('incNoiseInt');

// Add an event listener to the button
//red moves right -> should not pass yellow
incNoiseIntButton.addEventListener('click', function() {
    if(offsetR < offsetY){
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        offsetR += 0.25; // Increase offsetR by 0.2 (you can adjust this value as needed)
        drawCurves(offsetR, offsetY); // Redraw the curves
        drawCoordinateSystem(); // Redraw the coordinate system

        // Draw the mean lines if mLine is true
        if (mLine) {
            drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
            drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
        }
    }
    updateMeansDisplay();
    
});

// Get the decNoiseInt button
const decNoiseIntButton = document.getElementById('decNoiseInt');

// Add an event listener to the button
decNoiseIntButton.addEventListener('click', function() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offsetR -= 0.25; // Decrease offsetR by 0.2 (you can adjust this value as needed)
    drawCurves(offsetR, offsetY); // Redraw the curves
    drawCoordinateSystem(); // Redraw the coordinate system

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateMeansDisplay();
});


// Get the incObSen button
const incObSenButton = document.getElementById('incObSen');

// Add an event listener to the button
incObSenButton.addEventListener('click', function() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offsetY += 0.25; // Increase offsetY by 0.2 (you can adjust this value as needed)
    drawCurves(offsetR, offsetY); // Redraw the curves
    drawCoordinateSystem(); // Redraw the coordinate system

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateMeansDisplay();
});

// Get the decObSen button
const decObSenButton = document.getElementById('decObSen');

// Add an event listener to the button
decObSenButton.addEventListener('click', function() {
    if(offsetR < offsetY){
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        offsetY -= 0.25; // Decrease offsetY by 0.2 (you can adjust this value as needed)
        drawCurves(offsetR, offsetY); // Redraw the curves
        drawCoordinateSystem(); // Redraw the coordinate system
    
        // Draw the mean lines if mLine is true
        if (mLine) {
            drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
            drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
        }
    }
    updateMeansDisplay();
   
});

// Get the reset button
const resetButton = document.getElementById('reset');

// Add an event listener to the button
resetButton.addEventListener('click', function() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Reset offsets to their initial values
    offsetR = 2; // Reset to starting offset for red curve
    offsetY = 5; // Reset to starting offset for yellow curve

    // Redraw the coordinate system and curves
    drawCurves(offsetR, offsetY); // Redraw the curves
    drawCoordinateSystem(); // Redraw the coordinate system

    // Draw the mean lines if mLine is true
    if (mLine) {
        drawMeanLine(3 + offsetR, "rgb(0, 255, 0)"); // Draw the mean line for red curve
        drawMeanLine(3 + offsetY, "rgb(0, 255, 0)"); // Draw the mean line for yellow curve
    }
    updateMeansDisplay();
});

const instructionsButton = document.getElementById('instructionsButton');

// Add event listener to the instructions button
instructionsButton.addEventListener('click', updateInstruction);

function updateInstruction(){
    instructionsCounter = (instructionsCounter + 1)%8; //8 instructions
    let currentLang = localStorage.getItem('lang');

    if(instructionsCounter == 0){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions'];
    }
    if(instructionsCounter == 1){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions2'];
    }
    if(instructionsCounter == 2){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions3'];
    }
    if(instructionsCounter == 3){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions4'];
    }
    if(instructionsCounter == 4){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions5'];
    }
    if(instructionsCounter == 5){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions6'];
    }
    if(instructionsCounter == 6){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions7'];
    }
    if(instructionsCounter == 7){
        document.getElementById('instructions').textContent = languages[currentLang]['instructions8'];
    }
}


function drawCoordinateSystem() {

    ctx.font = "20px Arial";
    ctx.fillStyle = "blue"; // Set text color to blue

    ctx.lineWidth = 3; // Set line thickness
    ctx.strokeStyle = "blue"; // Set line color to blue 
    
    // Clear the canvas
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    ctx.fillStyle = "blue"; // Set text color
    ctx.fillText(label, 0, 0); // Draw the label
    ctx.restore(); // Restore the context to its original state
}

function drawXAxisLabel(label) {
    ctx.fillStyle = "blue"; // Set text color
    ctx.fillText(label, canvas.width / 2 - 100, canvas.height - 5); // Draw the label centered below the x-axis
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

function reset(){
    offsetR = 2;
    offsetY = 5;
    drawCoordinateSystem();
    
}

function setMLine(){
    mLine = !mLine; //toggle mline
}

function drawMeanLine(mean, lineColor) {
    const xPosition = 50 + (mean * unitWidth); // Calculate the x position for the mean
    const yStart = distHeight; // Start from the top of the canvas
    const yEnd = canvas.height - 50; // End at the x-axis

    ctx.beginPath();
    ctx.moveTo(xPosition, yStart); // Start from the top of the canvas
    ctx.lineTo(xPosition, yEnd); // Draw down to the x-axis
    ctx.strokeStyle = lineColor; // Set the color for the mean line
    ctx.lineWidth = 3; // Set the line width
    ctx.stroke(); // Draw the line
}

function drawLabelsAndDots() {
    // Set the position for the labels and dots
    const dotRadius = 10; // Radius of the dots
    const xPosition = canvas.width - 80; // X position for the dots and labels
    const noiseYPosition = 100; // Y position for the "Noise" label
    const signalNoiseYPosition = 150; // Y position for the "Signal + Noise" label

    // Draw the red dot for "Noise"
    ctx.fillStyle = "red"; // Set fill color to red
    ctx.beginPath();
    ctx.arc(xPosition, noiseYPosition, dotRadius, 0, Math.PI * 2); // Draw the red dot
    ctx.fill(); // Fill the dot

    // Draw the label "Noise"
    ctx.fillStyle = "red"; // Set text color to black
    ctx.font = "20px Arial"; // Set font size and family
    ctx.fillText("Noise", xPosition - 20, noiseYPosition + 30); // Draw the label

    // Draw the yellow dot for "Signal + Noise"
    ctx.fillStyle = "yellow"; // Set fill color to yellow
    ctx.beginPath();
    ctx.arc(xPosition, signalNoiseYPosition, dotRadius, 0, Math.PI * 2); // Draw the yellow dot
    ctx.fill(); // Fill the dot

    // Draw the label "Signal + Noise"
    ctx.fillStyle = "yellow"; // Set text color to black
    ctx.fillText("Signal + Noise", xPosition - 60, signalNoiseYPosition + 30); // Draw the label
}

function calculateOverlap() {
    const meanR = 3 + offsetR; // Mean for red distribution
    const meanY = 3 + offsetY; // Mean for yellow distribution
    const stdDev = 1; // Standard deviation for both distributions

    let overlapArea = 0; // Variable to accumulate the overlap area
    const startX = 0; // Start of the range
    const endX = 14; // End of the range

    for (let x = startX; x <= endX; x += 0.1) {
        // Calculate the probability for both distributions
        let probR = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - meanR) / stdDev, 2));
        let probY = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - meanY) / stdDev, 2));

        // Add the minimum of the two probabilities to the overlap area
        overlapArea += Math.min(probR, probY) * 0.1; // Multiply by the width of the interval (0.1)
    }

    return overlapArea; // Return the raw overlap area without scaling
}

function calculateOverlapPercentage() {
    const meanR = 3 + offsetR; // Mean for red distribution
    const meanY = 3 + offsetY; // Mean for yellow distribution
    const stdDev = 1; // Standard deviation for both distributions

    let overlapArea = 0; // Variable to accumulate the overlap area
    const startX = 0; // Start of the range
    const endX = 14; // End of the range

    // Calculate the overlap area
    for (let x = startX; x <= endX; x += 0.1) {
        // Calculate the probability for both distributions
        let probR = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - meanR) / stdDev, 2));
        let probY = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - meanY) / stdDev, 2));

        // Add the minimum of the two probabilities to the overlap area
        overlapArea += Math.min(probR, probY) * 0.1; // Multiply by the width of the interval (0.1)
    }

    // Calculate the total area under one of the distributions (using red distribution as an example)
    let totalArea = 0;
    for (let x = startX; x <= endX; x += 0.1) {
        let probR = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - meanR) / stdDev, 2));
        totalArea += probR * 0.1; // Total area under the red distribution
    }

    // Calculate the overlap percentage
    const overlapPercentage = (overlapArea / totalArea) * 100;

    return overlapPercentage; // Return the overlap percentage
}

function updateMeansDisplay() {
    // Calculate the means
    const meanN = (3 + offsetR).toFixed(2); // Mean for red distribution
    const meanS_N = (3 + offsetY).toFixed(2); // Mean for yellow distribution

    // Calculate the difference
    const differenceInMeans = (meanS_N - meanN).toFixed(2); // Difference in means

    const overlapPercentage = calculateOverlapPercentage(); // Calculate the overlap percentage
    document.getElementById('overlapVal').innerText = overlapPercentage.toFixed(2) + '%'; // Update overlap display

    // Update the HTML elements with the calculated means
    document.getElementById('meanNVal').innerText = meanN; // Update meanNVal
    document.getElementById('meanS+NVal').innerText = meanS_N; // Update meanS+NVal
    document.getElementById('differenceInMeansVal').innerText = differenceInMeans; // Update difference in means
}


// Call the function to draw the coordinate system
drawCurves(offsetR, offsetY);
drawCoordinateSystem();
updateMeansDisplay();
// Draw the mean lines
//drawMeanLine(3+offsetR, "rgb(0, 255, 0)"); // Draw the mean line in green
//drawMeanLine(3+offsetY, "rgb(0, 255, 0)")
