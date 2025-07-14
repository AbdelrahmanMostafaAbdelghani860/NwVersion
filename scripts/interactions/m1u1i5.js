// m1u1i5.js (Vanilla JS version)

// ~-_-~ GLOBAL VARIABLES ~-_-~
let canvas, canvContext;
let verticalSpacingSlider;
let canvasPadding, verticalSpacing, borderWidth, mode, figure;
let canWidth, figWidth;
console.log("✅ Script started");

console.log("✅ Script started");

function waitForCanvasAndStart() {
  canvas = document.getElementById("interaction"); // use global canvas variable
  if (canvas) {
    console.log("✅ Canvas found, calling onReady()");
    onReady();
  } else {
    console.log("⏳ Waiting for canvas...");
    setTimeout(waitForCanvasAndStart, 100);
  }
}
waitForCanvasAndStart();

console.log("✅ Script started");

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onReady);
} else {
  onReady(); // DOM already loaded
}

function onReady() {
  console.log("✅ DOM fully loaded, starting init()");
  if (sessionStorage.getItem("settings")) {
    console.log("🔁 Loading settings...");
    loadSettings();
  } else {
    console.log("🆕 Resetting settings...");
    resetSettings();
  }
  console.log("🚀 Calling init() and draw()");
  init();
  draw();
}

function init() {
  console.log("🎨 init() called");
  initElements();
  initEventListeners();
}

function initElements() {
  console.log("🎨 initElements() called");
  console.log("Canvas width:", canvas.width, "height:", canvas.height);
  console.log("Canvas context valid:", !!canvContext);
  verticalSpacingSlider = document.getElementById("verticalSpacing");
  canvas = document.getElementById("interaction");
  canvContext = canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  canWidth = canvas.width * (1 - (2 * canvasPadding) / 1000);
  figWidth = canWidth / 5;
}

function initEventListeners() {
  verticalSpacingSlider.addEventListener("input", () => {
    verticalSpacing = parseInt(verticalSpacingSlider.value);
    draw();
    saveSettings();
  });

  document.getElementById("continuation").addEventListener("click", switchMode);
  document
    .getElementById("switchFigure")
    .addEventListener("click", switchFigure);
  document.getElementById("reset").addEventListener("click", () => {
    resetSettings();
    draw();
  });

  window.addEventListener("keydown", (k) => {
    switch (k.keyCode) {
      case 82:
        resetSettings();
        draw();
        break; // R
      case 70:
        switchFigure();
        break; // F
      case 84:
        switchMode();
        break; // T
      case 87: // W
        verticalSpacing = Math.min(1000, verticalSpacing + 10);
        verticalSpacingSlider.value = verticalSpacing;
        draw();
        saveSettings();
        break;
      case 83: // S
        verticalSpacing = Math.max(1, verticalSpacing - 10);
        verticalSpacingSlider.value = verticalSpacing;
        draw();
        saveSettings();
        break;
    }
  });
}

function switchMode() {
  mode = (mode + 1) % 2;
  verticalSpacing = 0;
  verticalSpacingSlider.value = verticalSpacing;
  draw();
  saveSettings();
}

function switchFigure() {
  figure = (figure + 1) % 3;
  draw();
  saveSettings();
}

function loadSettings() {
  const paramList = sessionStorage.getItem("settings").split("&");
  if (paramList.length === 5) {
    canvasPadding = parseInt(paramList[0].split("=")[1]);
    verticalSpacing = parseInt(paramList[1].split("=")[1]);
    borderWidth = parseInt(paramList[2].split("=")[1]);
    mode = parseInt(paramList[3].split("=")[1]);
    figure = parseInt(paramList[4].split("=")[1]);
  } else {
    resetSettings();
  }
}

function resetSettings() {
  canvasPadding = 50;
  verticalSpacing = 0;
  borderWidth = 5;
  mode = 0;
  figure = 0;
  document.getElementById("verticalSpacing").value = verticalSpacing;
  saveSettings();
}

function saveSettings() {
  sessionStorage.setItem(
    "settings",
    `canvasPadding=${canvasPadding}&verticalSpacing=${verticalSpacing}&borderWidth=${borderWidth}&mode=${mode}&figure=${figure}`
  );
}

function getDefaultColor(type) {
  const color = window
    .getComputedStyle(canvas)
    .getPropertyValue("--default-" + type + "-color");
  if (color && color.trim() !== "") {
    return color;
  } else {
    // Wait and try again, then call draw() again once it’s available
    setTimeout(() => {
      console.log(`⏳ Waiting for CSS color '--default-${type}-color'...`);
      draw(); // reattempt draw after color is available
    }, 100);
    return "transparent"; // avoid flashing black
  }
}

function draw() {
  console.log("🎨 draw() called");
  console.log("canvas width:", canvas.width, "height:", canvas.height);
  console.log("canvContext exists?", !!canvContext);
  console.log("mode:", mode, "figure:", figure);
  canvContext.fillStyle = "red";
  canvContext.fillRect(10, 10, 100, 100);
  canvContext.clearRect(0, 0, canvas.width, canvas.height);
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fillRect(0, 0, canvas.width, canvas.height);
  const newSpacing =
    -(
      canvas.height / 2 -
      0.5 * figWidth -
      canvas.height * (canvasPadding / 1000)
    ) *
    (verticalSpacing / 1000);
  switch (figure) {
    case 0:
      drawFigure1(newSpacing);
      break;
    case 1:
      drawFigure2(newSpacing);
      break;
    case 2:
      drawFigure3(newSpacing);
      break;
  }
}

function drawFigure1(newSpacing) {
  //console.log("Drawing Figure 1 with newSpacing:", newSpacing);
  drawLine1();
  switch (mode) {
    case 0:
      drawLine2(newSpacing);
      drawLine3();
      break;
    case 1:
      drawLine2();
      drawLine3(newSpacing);
      break;
  }
  drawLine4(newSpacing);
}

// used to draw fig1
function drawLine1(spacing = 0) {
  startX = canvas.width * (canvasPadding / 1000);
  startY = canvas.height / 2 + 0.5 * figWidth + spacing;
  for (i = 0; i < 5; i++) {
    if (i % 2 == 0) {
      canvContext.beginPath();
      canvContext.moveTo(startX, startY);
      startX = startX + figWidth;
      canvContext.lineTo(startX, startY);
      canvContext.closePath();
      canvContext.fillStyle = getDefaultColor("bg");
      canvContext.fill();
      canvContext.strokeStyle = getDefaultColor("shape");
      canvContext.lineWidth = borderWidth;
      canvContext.stroke();
    } else {
      canvContext.beginPath();
      canvContext.moveTo(startX, startY);
      canvContext.lineTo(startX, startY - 0.5 * figWidth);
      startX = startX + figWidth;
      canvContext.moveTo(startX, startY);
      canvContext.lineTo(startX, startY - 0.5 * figWidth);
      canvContext.closePath();
      canvContext.fillStyle = getDefaultColor("bg");
      canvContext.fill();
      canvContext.strokeStyle = getDefaultColor("shape");
      canvContext.lineWidth = borderWidth;
      canvContext.stroke();
    }
  }
}

function drawLine2(spacing = 0) {
  startX = canvas.width * (canvasPadding / 1000) + figWidth;
  startY = canvas.height / 2 - 0.5 * figWidth + spacing;
  for (i = 0; i < 2; i++) {
    canvContext.beginPath();
    canvContext.moveTo(startX, startY);
    canvContext.lineTo(startX, startY + 0.5 * figWidth);
    canvContext.moveTo(startX, startY);
    startX = startX + figWidth;
    canvContext.lineTo(startX, startY);
    canvContext.moveTo(startX, startY);
    canvContext.lineTo(startX, startY + 0.5 * figWidth);
    canvContext.fillStyle = getDefaultColor("bg");
    canvContext.fill();
    canvContext.strokeStyle = getDefaultColor("shape");
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    startX = startX + figWidth;
  }
}

function drawLine3(spacing = 0) {
  startX = canvas.width * (canvasPadding / 1000) + figWidth;
  startY = canvas.height / 2 + spacing;
  for (i = 0; i < 2; i++) {
    canvContext.beginPath();
    canvContext.moveTo(startX, startY);
    canvContext.lineTo(startX + 0.5 * figWidth, startY + 0.5 * figWidth);
    startX = startX + figWidth;
    canvContext.moveTo(startX, startY);
    canvContext.lineTo(startX - 0.5 * figWidth, startY + 0.5 * figWidth);
    canvContext.fillStyle = getDefaultColor("bg");
    canvContext.fill();
    canvContext.strokeStyle = getDefaultColor("shape");
    canvContext.lineWidth = borderWidth;
    canvContext.stroke();
    startX = startX + figWidth;
  }
}

function drawLine4(spacing = 0) {
  startX = canvas.width * (canvasPadding / 1000) + figWidth;
  startY = canvas.height / 2 + spacing;
  canvContext.beginPath();
  canvContext.moveTo(startX, startY);
  canvContext.lineTo(startX - 0.5 * figWidth, startY - 0.5 * figWidth);
  canvContext.moveTo(startX - figWidth, startY);
  canvContext.lineTo(startX - 0.5 * figWidth, startY - 0.5 * figWidth);
  canvContext.moveTo(startX + figWidth, startY);
  canvContext.lineTo(startX + 1.5 * figWidth, startY - 0.5 * figWidth);
  canvContext.moveTo(startX + 2 * figWidth, startY);
  canvContext.lineTo(startX + 1.5 * figWidth, startY - 0.5 * figWidth);
  canvContext.moveTo(startX + 3 * figWidth, startY);
  canvContext.lineTo(startX + 3.5 * figWidth, startY - 0.5 * figWidth);
  canvContext.moveTo(startX + 4 * figWidth, startY);
  canvContext.lineTo(startX + 3.5 * figWidth, startY - 0.5 * figWidth);
  canvContext.closePath();
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fill();
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
}

//the following functions are used to draw figure2

function drawFigure2(newSpacing) {
  console.log("Drawing Figure 2");
  switch (mode) {
    case 0:
      drawZigzagLine2(newSpacing);
      drawZigzagLine3(newSpacing);
      break;
    case 1:
      drawZigzagLine1();
      drawHalfCircle(newSpacing);
      break;
  }
}

function drawZigzagLine1(spacing = 0) {
  console.log("drawZigzagLine1 called");

  // Use relative measurements based on the canvas size
  const startY = canvas.height / 2 + spacing; // Starting Y position
  const zigzagHeight = canvas.height * 0.05; // Height of each zigzag peak as a percentage of canvas height
  const segmentLength = canvas.width * 0.1; // Length of each zigzag segment as a percentage of canvas width

  // Calculate the starting X position to center the zigzag line
  const totalZigzagWidth =
    Math.floor(canvas.width / 2 / segmentLength) * segmentLength; // Total width of the zigzag pattern
  const startX = canvas.width / 2 - totalZigzagWidth / 2; // Center the zigzag line

  canvContext.beginPath();
  canvContext.moveTo(startX, startY); // Move to the starting point

  // Create a series of "V" shapes
  const numberOfZigzags = Math.floor(totalZigzagWidth / segmentLength); // Calculate how many zigzags fit
  for (let i = 0; i < numberOfZigzags; i++) {
    // Loop to create the zigzag shapes
    const newStartX = startX + i * segmentLength; // Calculate new X position

    // Draw down to create the left side of the "V"
    canvContext.lineTo(newStartX + segmentLength / 2, startY + zigzagHeight);

    // Draw up to create the right side of the "V"
    canvContext.lineTo(newStartX + segmentLength, startY);
  }

  canvContext.strokeStyle = getDefaultColor("shape"); // Set the stroke color
  canvContext.lineWidth = borderWidth; // Set the line width
  canvContext.stroke(); // Draw the zigzag line
}

function drawZigzagLine2(spacing = 0) {
  console.log("drawZigzagLine2 called");

  // Use relative measurements based on the canvas size
  const startY = canvas.height / 2 + spacing; // Starting Y position
  const zigzagHeight = canvas.height * 0.05; // Height of each zigzag peak as a percentage of canvas height
  const segmentLength = canvas.width * 0.1; // Length of each zigzag segment as a percentage of canvas width

  // Calculate the starting X position to center the zigzag line
  const totalZigzagWidth =
    (Math.floor(canvas.width / 2 / segmentLength) * segmentLength) / 2; // Total width of the zigzag pattern (halved)
  const startX = canvas.width / 2 - totalZigzagWidth + spacing; // Center the zigzag line

  canvContext.beginPath();
  canvContext.moveTo(startX, startY); // Move to the starting point

  // Create a series of "V" shapes
  const numberOfZigzags = Math.floor(totalZigzagWidth / segmentLength); // Calculate how many zigzags fit
  for (let i = 0; i < numberOfZigzags; i++) {
    // Loop to create the zigzag shapes
    const newStartX = startX + i * segmentLength; // Calculate new X position

    // Draw down to create the left side of the "V"
    canvContext.lineTo(newStartX + segmentLength / 2, startY + zigzagHeight);

    // Draw up to create the right side of the "V"
    canvContext.lineTo(newStartX + segmentLength, startY);
  }

  canvContext.strokeStyle = getDefaultColor("shape"); // Set the stroke color
  canvContext.lineWidth = borderWidth; // Set the line width
  canvContext.stroke(); // Draw the zigzag line

  // Draw quarter circle at the end of the zigzag line
  drawUpperQuarterCircle(spacing);
}

function drawZigzagLine3(spacing = 0) {
  console.log("drawZigzagLine3 called");

  // Use relative measurements based on the canvas size
  const startY = canvas.height / 2 + spacing; // Starting Y position
  const zigzagHeight = canvas.height * 0.05; // Height of each zigzag peak as a percentage of canvas height
  const segmentLength = canvas.width * 0.1; // Length of each zigzag segment as a percentage of canvas width

  // Calculate the starting X position to center the zigzag line
  const totalZigzagWidth =
    (Math.floor(canvas.width / 2 / segmentLength) * segmentLength) / 2; // Total width of the zigzag pattern (halved)
  let startX = canvas.width / 2 - totalZigzagWidth; // Center the zigzag line
  // Create a series of "V" shapes
  const numberOfZigzags = Math.floor(totalZigzagWidth / segmentLength); // Calculate how many zigzags fit
  startX = startX + segmentLength * numberOfZigzags - spacing;

  // Draw quarter circle at the start of the zigzag line
  drawLowerQuarterCircle(spacing);

  canvContext.beginPath();
  canvContext.moveTo(startX, startY); // Move to the starting point

  for (let i = 0; i < numberOfZigzags; i++) {
    // Loop to create the zigzag shapes
    const newStartX = startX + i * segmentLength; // Calculate new X position

    // Draw down to create the left side of the "V"
    canvContext.lineTo(newStartX + segmentLength / 2, startY + zigzagHeight);

    // Draw up to create the right side of the "V"
    canvContext.lineTo(newStartX + segmentLength, startY);
  }

  canvContext.strokeStyle = getDefaultColor("shape"); // Set the stroke color
  canvContext.lineWidth = borderWidth; // Set the line width
  canvContext.stroke(); // Draw the zigzag line
}

function drawHalfCircle(spacing = 0) {
  const radius = canvas.height * 0.1;
  const centerX = canvas.width / 2 - radius - spacing; //it can be moved right with spacing
  const zigY = canvas.height / 2;
  const zigzagHeight = canvas.height * 0.05;
  const centerY = zigY + zigzagHeight;

  canvContext.beginPath();
  canvContext.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI / 2, false); // Draw half-circle opening to the left
  canvContext.strokeStyle = "black"; // Set stroke color
  canvContext.lineWidth = borderWidth; // Set line width
  canvContext.stroke(); // Render the half-circle
}

function drawUpperQuarterCircle(spacing = 0) {
  const radius = canvas.height * 0.1;
  const centerX = canvas.width / 2 - 1.6 * radius + spacing;
  const zigY = canvas.height / 2;
  const zigzagHeight = canvas.height * 0.05;
  const centerY = zigY + zigzagHeight - 0.5 * radius + spacing;

  canvContext.beginPath();
  canvContext.arc(centerX, centerY, radius, -Math.PI / 2, 0, false); // Draw upper half-circle
  canvContext.strokeStyle = "black";
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
}

function drawLowerQuarterCircle(spacing = 0) {
  const radius = canvas.height * 0.1;
  const centerX = canvas.width / 2 - 1.6 * radius - spacing;
  const zigY = canvas.height / 2;
  const zigzagHeight = canvas.height * 0.05;
  const centerY = zigY + zigzagHeight - 0.5 * radius + spacing;

  canvContext.beginPath();
  canvContext.arc(centerX, centerY, radius, 0, Math.PI / 2, false); // Draw lower half-circle
  canvContext.strokeStyle = "black";
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
}

//Functions for figure3

function drawFigure3(newSpacing) {
  //console.log("Drawing Figure 3 with newSpacing:", newSpacing);
  switch (mode) {
    case 0: //not "good" continuation
      drawRightFacingPart(newSpacing);
      drawLeftFacingPart(newSpacing);
      break;
    case 1: //good continuation toggled on
      drawCosineWave(newSpacing);
      drawFlippedCosineWave(newSpacing);
      break;
  }
}

function drawCosineWave(spacing = 0) {
  const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
  const frequency = 1; // Frequency of the cosine wave
  const startY = canvas.height / 2 + spacing; // Starting Y position

  // Calculate the padding from the canvas edges
  const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
  const rightPadding = leftPadding; // Equal distance from the right edge
  const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

  canvContext.beginPath();

  // Start at the peak
  const initialX = leftPadding; // Starting X position
  const initialY = startY - amplitude; // Start at the peak (y = startY - amplitude)

  // Draw the cosine wave from the peak to the first valley
  const step = 0.1; // Increment by small steps for smoothness

  // Draw from x = 0 to x = π (first valley)
  for (let x = 0; x <= Math.PI; x += step) {
    const y = startY - amplitude * Math.cos(x); // Normal cosine wave calculation
    // Scale x to fit the usable width
    const scaledX = leftPadding + x * (usableWidth / Math.PI);
    // Only move to the first point, then draw from there
    if (x === 0) {
      canvContext.moveTo(scaledX, y); // Move to the initial point
    } else {
      canvContext.lineTo(scaledX, y);
    }
  }

  // Set the dotted line style
  canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
  canvContext.setLineDash([]); // Reset to solid line
}

function drawFlippedCosineWave(spacing = 0) {
  const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
  const frequency = 1; // Frequency of the cosine wave
  const startY = canvas.height / 2 - spacing; // Starting Y position

  // Calculate the padding from the canvas edges
  const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
  const rightPadding = leftPadding; // Equal distance from the right edge
  const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

  canvContext.beginPath();

  // Start at the valley
  const initialY = startY + amplitude; // Start at the valley (y = startY + amplitude)

  // Draw the flipped cosine wave from the valley to the first peak
  const step = 0.1; // Increment by small steps for smoothness

  // Draw from x = 0 to x = π (first peak)
  for (let x = 0; x <= Math.PI; x += step) {
    const y = startY + amplitude * Math.cos(x); // Flipped cosine wave calculation
    // Scale x to fit the usable width
    const scaledX = leftPadding + x * (usableWidth / Math.PI);
    // Only move to the first point, then draw from there
    if (x === 0) {
      canvContext.moveTo(scaledX, y); // Move to the initial point
    } else {
      canvContext.lineTo(scaledX, y);
    }
  }

  // Set the dotted line style
  canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
  canvContext.setLineDash([]); // Reset to solid line
}

function drawHalfCosineWave(spacing = 0) {
  const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
  const frequency = 1; // Frequency of the cosine wave
  const startY = canvas.height / 2 + spacing; // Starting Y position

  // Calculate the padding from the canvas edges
  const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
  const rightPadding = leftPadding; // Equal distance from the right edge
  const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

  canvContext.beginPath();

  // Start at the peak
  const initialX = leftPadding; // Starting X position
  const initialY = startY - amplitude; // Start at the peak (y = startY - amplitude)

  // Draw the cosine wave only up to the midpoint
  const step = 0.1; // Increment by small steps for smoothness
  const halfPi = Math.PI / 2 + 0.03; // Halfway point in the cosine wave (to the first valley)

  // Draw from x = 0 to x = π/2 (midpoint)
  for (let x = 0; x <= halfPi; x += step) {
    const y = startY - amplitude * Math.cos(x); // Normal cosine wave calculation
    // Scale x to fit the usable width
    const scaledX = leftPadding + x * (usableWidth / Math.PI);
    // Only move to the first point, then draw from there
    if (x === 0) {
      canvContext.moveTo(scaledX, y); // Move to the initial point
    } else {
      canvContext.lineTo(scaledX, y);
    }
  }

  // Set the dotted line style
  canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
  canvContext.setLineDash([]); // Reset to solid line
}

function drawFlippedFirstHalfCosineWave(spacing = 0) {
  const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
  const startY = canvas.height / 2 - spacing; // Starting Y position

  // Calculate the padding from the canvas edges
  const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
  const rightPadding = leftPadding; // Equal distance from the right edge
  const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

  canvContext.beginPath();

  // Start at the valley
  const initialY = startY + amplitude; // Start at the valley (y = startY + amplitude)

  // Draw the flipped cosine wave from the valley to the midpoint (π/2)
  const step = 0.1; // Increment by small steps for smoothness
  const halfPi = Math.PI / 2 + 0.03; // Midpoint

  // Draw from x = 0 to x = π/2 (first half)
  for (let x = 0; x <= halfPi; x += step) {
    const y = startY + amplitude * Math.cos(x); // Flipped cosine wave calculation
    // Scale x to fit the usable width
    const scaledX = leftPadding + x * (usableWidth / Math.PI);
    // Only move to the first point, then draw from there
    if (x === 0) {
      canvContext.moveTo(scaledX, y); // Move to the initial point
    } else {
      canvContext.lineTo(scaledX, y);
    }
  }

  // Set the dotted line style
  canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
  canvContext.setLineDash([]); // Reset to solid line
}

function drawSecondHalfCosineWave(spacing = 0) {
  const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
  const frequency = 1; // Frequency of the cosine wave
  const startY = canvas.height / 2 + spacing; // Starting Y position

  // Calculate the padding from the canvas edges
  const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
  const rightPadding = leftPadding; // Equal distance from the right edge
  const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

  canvContext.beginPath();

  // Draw the cosine wave only from the midpoint to the first valley
  const step = 0.1; // Increment by small steps for smoothness
  const halfPi = Math.PI / 2; // Midpoint
  const fullPi = Math.PI; // First valley

  // Draw from x = π/2 to x = π (second half)
  for (let x = halfPi; x <= fullPi; x += step) {
    const y = startY - amplitude * Math.cos(x); // Normal cosine wave calculation
    // Scale x to fit the usable width
    const scaledX = leftPadding + x * (usableWidth / Math.PI);
    // Only move to the first point, then draw from there
    if (x === halfPi) {
      canvContext.moveTo(scaledX, y); // Move to the initial point
    } else {
      canvContext.lineTo(scaledX, y);
    }
  }

  // Set the dotted line style
  canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
  canvContext.setLineDash([]); // Reset to solid line
}

function drawFlippedSecondHalfCosineWave(spacing = 0) {
  const amplitude = canvas.height * 0.2; // Amplitude of the cosine wave (20% of canvas height)
  const startY = canvas.height / 2 - spacing; // Starting Y position

  // Calculate the padding from the canvas edges
  const leftPadding = canvas.width * (canvasPadding / 1000); // Distance from the left edge
  const rightPadding = leftPadding; // Equal distance from the right edge
  const usableWidth = canvas.width - leftPadding - rightPadding; // Usable width for the cosine wave

  canvContext.beginPath();

  // Draw the flipped cosine wave from the first peak to the valley (π/2 to π)
  const step = 0.1; // Increment by small steps for smoothness
  const halfPi = Math.PI / 2; // First peak
  const fullPi = Math.PI; // Valley

  // Draw from x = π/2 to x = π (second half)
  for (let x = halfPi; x <= fullPi; x += step) {
    const y = startY + amplitude * Math.cos(x); // Flipped cosine wave calculation
    // Scale x to fit the usable width
    const scaledX = leftPadding + x * (usableWidth / Math.PI);
    // Only move to the first point, then draw from there (no straight lines to starting point of wave!)
    if (x === halfPi) {
      canvContext.moveTo(scaledX, y); // Move to the initial point
    } else {
      canvContext.lineTo(scaledX, y);
    }
  }

  // Set the dotted line style
  canvContext.setLineDash([5, 5]); // 5px dash, 5px gap
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();
  canvContext.setLineDash([]); // Reset to solid line
}

function drawRightFacingPart(spacing = 0) {
  drawHalfCosineWave(spacing);
  drawFlippedFirstHalfCosineWave(-spacing);
}

function drawLeftFacingPart(spacing = 0) {
  drawSecondHalfCosineWave(-spacing);
  drawFlippedSecondHalfCosineWave(spacing);
}

// ~-_-~ VERSION ~-_-~
console.log("<m1u1i5> v1.0.0 (Vanilla JS)");
