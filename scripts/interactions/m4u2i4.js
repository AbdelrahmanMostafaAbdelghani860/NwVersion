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

const unitCount = 10; // Number of units on the x-axis
const unitWidth = (canvas.width - 100) / unitCount; // Calculate width of each unit
const subUnitCount = 5; // Number of sub-units between each main unit
const subUnitWidth = unitWidth / subUnitCount;
const halfwayY = (canvas.height - 50) / 2;

const decreaseButton =  document.getElementById('decrease');
const increaseButton =  document.getElementById('increase');

//offset 0 means the means will be at 3. You can put negative offsets to move the distributions further left.
let offsetR = 1; // offset red curve, it stays put in this interaction
let offsetY = 1; //offset yellow curve, it stays put in this interaction
let meansSignalNoise = 4;
let meansNoise = 4;

const criterion = 5;
let d = 0.5;

let yOffsetR = halfwayY - (canvas.height - 50);
let yOffsetY = 0;

let color1 = "rgba(200, 0, 255, 0.4)";
let color2 = "rgba(0, 255, 106, 0.59)";
let color3 = "rgba(0, 98, 255, 0.51)";
let color4 = "rgba(255, 94, 0, 0.56)";

function drawCoordinateSystem() {

    ctx.font = "20px Arial";
    ctx.fillStyle = "blue"; // Set text color to blue

    ctx.lineWidth = 3; // Set line thickness
    ctx.strokeStyle = "blue"; // Set line color to blue 

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
            if(i != unitCount) {
                const subX = x + (j * subUnitWidth); // Calculate x position for each sub-unit
            ctx.beginPath();
            ctx.moveTo(subX, canvas.height - 55); // Line just above the x-axis
            ctx.lineTo(subX, canvas.height - 45); // Line just below the x-axis
            ctx.stroke();
            }  
        }
    }

    // Draw the "second x axis"
    const halfwayY = (canvas.height - 50) / 2;
    ctx.beginPath();
    ctx.moveTo(50, halfwayY);
    ctx.lineTo(canvas.width - 50, halfwayY);
    ctx.strokeStyle = "rgb(22, 146, 255)"; 
    ctx.lineWidth = 4; 
    ctx.stroke(); 

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

function drawProbabilityDistribution(offset, lineColor, yOffset, leftColor, rightColor) {
    const mean = 3 + offset; // Mean of the distribution
    const stdDev = 1; // Standard deviation
    const scalingFactor = canvas.height/1.5; // Adjust this value to make the distribution taller

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;

    // Draw the probability distribution
    ctx.beginPath();
    const startX = 0; 
    const endX = unitCount; 

    let peakHeight = canvas.height; // Variable to track the peak height of the current distribution

    for (let x = startX; x <= endX; x += 0.1) {
        let probability = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)); // Use stdDev for the calculation
        let y = (canvas.height - 50) - (probability * scalingFactor) + yOffset; // Scale the y value for visibility and add yOffset
        if (y < peakHeight) {
            peakHeight = y; // Update peakHeight
        }
        if (x === startX) {
            ctx.moveTo(50 + ((x) * unitWidth), y);
        } else {
            ctx.lineTo(50 + ((x) * unitWidth), y);
        }
    }

    // Fill the area where x < criterion
    ctx.lineTo(50 + (criterion * unitWidth), canvas.height - 50 + yOffset); // Close the path for the area below the criterion
    ctx.lineTo(50 + (startX * unitWidth), canvas.height - 50 + yOffset); // Close the path
    ctx.fillStyle = leftColor; //color for x < criterion
    ctx.fill(); // Fill the area below the criterion

    // Draw the outline of the distribution
    ctx.stroke(); // Stroke the line with the specified color

    // Now fill the area where x > criterion
    ctx.beginPath(); // Start a new path for the area above the criterion
    ctx.moveTo(50 + (criterion * unitWidth), (canvas.height - 50) - (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((criterion - mean) / stdDev, 2)) * scalingFactor + yOffset); // Move to the criterion point
    for (let x = criterion; x <= endX; x += 0.1) {
        let probability = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)); // Use stdDev for the calculation
        let y = (canvas.height - 50) - (probability * scalingFactor) + yOffset; // Scale the y value for visibility and add yOffset
        ctx.lineTo(50 + ((x) * unitWidth), y);
    }
    ctx.lineTo(50 + (endX * unitWidth), canvas.height - 50 + yOffset); // Close the path
    ctx.lineTo(50 + (criterion * unitWidth), canvas.height - 50 + yOffset); // Close the path
    ctx.fillStyle = rightColor; // Green color
    ctx.fill(); // Fill the area above the criterion

    distHeight = peakHeight;
}

function drawSensoryActivationLine(x, lineColor) {
    const xPosition = 50 + (x * unitWidth); 
    const yStart = 50; //as tall as y axis
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
    const horizontalYPosition = yStart; // Y position for the horizontal line
    const decreaseButton =  document.getElementById('decrease');
    const increaseButton =  document.getElementById('increase');    

    ctx.beginPath();
    ctx.moveTo(xPosition - horizontalLineLength / 2, horizontalYPosition); 
    ctx.lineTo(xPosition + horizontalLineLength / 2, horizontalYPosition); 
    ctx.strokeStyle = lineColor; 
    ctx.lineWidth = 5; 
    ctx.stroke(); 

    // Draw the "No" label on the left side
    ctx.fillStyle = lineColor; 
    ctx.font = "30px Arial";

   ctx.fillText('X', xPosition - horizontalLineLength / 2 - 30, horizontalYPosition); // Draw "X" for No

   ctx.fillText('✓', xPosition + horizontalLineLength / 2 + 10, horizontalYPosition); // Draw check mark for Yes
}

function drawLabelsAndDots() {
    // Set the position for the labels and dots
    const dotRadius = 10; 
    const xPosition = canvas.width - 80; 
    const noiseYPosition = 100; 
    const signalNoiseYPosition = 150; 

    // Draw the red dot for "Noise"
    ctx.fillStyle = "red"; 
    ctx.beginPath();
    ctx.arc(xPosition, noiseYPosition, dotRadius, 0, Math.PI * 2); 
    ctx.fill(); 

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

function updateTableVals() {
    if (d == 0.5) {
        document.getElementById('hitsVal').textContent = '0.31';
        document.getElementById('missesVal').textContent = '0.69';
        document.getElementById('falseAlarmsVal').textContent = '0.17';
        document.getElementById('correctRejectionsVal').textContent = '0.83';
    }
    if (d == 1.0) {
        document.getElementById('hitsVal').textContent = '0.50';
        document.getElementById('missesVal').textContent = '0.50';
        document.getElementById('falseAlarmsVal').textContent = '0.17';
        document.getElementById('correctRejectionsVal').textContent = '0.83';
    }
    if (d == 1.5) {
        document.getElementById('hitsVal').textContent = '0.69';
        document.getElementById('missesVal').textContent = '0.31';
        document.getElementById('falseAlarmsVal').textContent = '0.17';
        document.getElementById('correctRejectionsVal').textContent = '0.83';
    }
    if (d == 2.0) {
        document.getElementById('hitsVal').textContent = '0.83';
        document.getElementById('missesVal').textContent = '0.17';
        document.getElementById('falseAlarmsVal').textContent = '0.17';
        document.getElementById('correctRejectionsVal').textContent = '0.83';
    }
    if (d == 2.5) {
        document.getElementById('hitsVal').textContent = '0.93';
        document.getElementById('missesVal').textContent = '0.07';
        document.getElementById('falseAlarmsVal').textContent = '0.17';
        document.getElementById('correctRejectionsVal').textContent = '0.83';
    }
    if (d == 3.0) {
        document.getElementById('hitsVal').textContent = '0.98';
        document.getElementById('missesVal').textContent = '0.02';
        document.getElementById('falseAlarmsVal').textContent = '0.17';
        document.getElementById('correctRejectionsVal').textContent = '0.83';
    }
   
}

function decreaseD() {
   
    if(d > 0.5){
    d -= 0.5;
    document.getElementById('dVal').textContent = d;
    document.getElementById('meansSNVal').textContent = 4 + d;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawProbabilityDistribution(offsetR, "rgb(255, 0, 0)", yOffsetR, color1, color2);
    drawProbabilityDistribution(offsetY + d, "rgb(255, 255, 0)", yOffsetY, color3, color4);
    drawSensoryActivationLine(criterion, "rgb(119, 0, 137)");
    drawCoordinateSystem();
    }

}

function increaseD() {

    if(d < 3.0){
        d += 0.5;
        document.getElementById('dVal').textContent = d;
        document.getElementById('meansSNVal').textContent = 4 + d;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawProbabilityDistribution(offsetR, "rgb(255, 0, 0)", yOffsetR, color1, color2);
        drawProbabilityDistribution(offsetY + d, "rgb(255, 255, 0)", yOffsetY, color3, color4);
        drawSensoryActivationLine(criterion, "rgb(119, 0, 137)");
        drawCoordinateSystem();
    }
   
}

decreaseButton.addEventListener('click', function() {
    decreaseD();
    updateTableVals();
 });
 
 increaseButton.addEventListener('click', function() {
     increaseD();
     updateTableVals();
 });

drawProbabilityDistribution(offsetR, "rgb(255, 0, 0)", yOffsetR, color1, color2);
drawProbabilityDistribution(offsetY + d, "rgb(255, 255, 0)", yOffsetY, color3, color4);
drawCoordinateSystem();
drawSensoryActivationLine(criterion, "rgb(119, 0, 137)");