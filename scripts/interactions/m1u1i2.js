// Declare globals
let canvas, canvContext;
let instructionField, modeLabel, saturationDiv;
let amountOfBallsSlider, saturationSlider;
let amountOfBalls = 9;
let ballSize = 30;
let distance = 1000;
let direction = 0;
let mode = 0;
let saturation = 0;

// Dynamic DOM-safe init
function waitForCanvasAndInit() {
  canvas = document.getElementById("interaction");
  if (canvas) {
    init();

    if (sessionStorage.getItem("settings") !== "") {
      loadSettings();
    } else {
      resetSettings();
    }

    setTimeout(() => {
      draw();
    }, 100); // Give DOM/layout time
  } else {
    setTimeout(waitForCanvasAndInit, 100);
  }
}

waitForCanvasAndInit();

// ~ INITIALIZATION ~
function init() {
  initElements();
  initEventListeners();
}

function initElements() {
  instructionField = document.getElementById("instructionField");
  modeLabel = document.getElementById("mode");
  saturationDiv = document.getElementById("saturationDiv");
  canvas = document.getElementById("interaction");
  canvContext = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = canvas.width / 2;

  amountOfBallsSlider = document.getElementById("amountOfBalls");
  amountOfBallsSlider.value = amountOfBalls;

  saturationSlider = document.getElementById("saturation");
  saturationSlider.value = saturation;
}

function initEventListeners() {
  amountOfBallsSlider.oninput = () => {
    amountOfBalls = parseInt(amountOfBallsSlider.value);
    draw();
    saveSettings();
  };

  saturationSlider.oninput = () => {
    saturation = parseInt(saturationSlider.value);
    draw();
    saveSettings();
  };

  document.getElementById("horizontal").onclick = activateHorizontalMode;
  document.getElementById("vertical").onclick = activateVerticalMode;
  document.getElementById("switchMode").onclick = switchMode;

  window.addEventListener("keydown", function (k) {
    switch (k.keyCode) {
      case 82: // R
        if (direction === 1 || direction === 2) switchMode();
        break;
      case 65: // A
        if (mode === 1) {
          saturation = Math.max(0, saturation - 10);
          saturationSlider.value = saturation;
          saveSettings();
          draw();
        }
        break;
      case 68: // D
        if (mode === 1) {
          saturation = Math.min(1000, saturation + 10);
          saturationSlider.value = saturation;
          saveSettings();
          draw();
        }
        break;
      case 87:
        activateHorizontalMode();
        break; // W
      case 83:
        activateVerticalMode();
        break; // S
      case 69: // E
        amountOfBalls = Math.min(20, amountOfBalls + 1);
        amountOfBallsSlider.value = amountOfBalls;
        saveSettings();
        draw();
        break;
      case 81: // Q
        amountOfBalls = Math.max(2, amountOfBalls - 1);
        amountOfBallsSlider.value = amountOfBalls;
        saveSettings();
        draw();
        break;
    }
  });
}

// ~ MODES ~
function activateHorizontalMode() {
  if (direction !== 1) {
    direction = 1;
    document.getElementById("vertical").disabled = false;
    document.getElementById("horizontal").disabled = true;
    document.getElementById("switchMode").disabled = false;
    saveSettings();
    draw();
  }
}

function activateVerticalMode() {
  if (direction !== 2) {
    direction = 2;
    document.getElementById("horizontal").disabled = false;
    document.getElementById("vertical").disabled = true;
    document.getElementById("switchMode").disabled = false;
    saveSettings();
    draw();
  }
}

function switchMode() {
  const lang = localStorage.getItem("lang") || "en";
  if (mode === 1) {
    instructionField.textContent = languages[lang]["instructions"];
    modeLabel.textContent = languages[lang]["switchToMonochromeButton"];
    saturationDiv.style.visibility = "hidden";
    mode = 0;
  } else {
    instructionField.textContent = languages[lang]["explanation"];
    modeLabel.textContent = languages[lang]["switchToNormalButton"];
    saturationDiv.style.visibility = "visible";
    mode = 1;
  }
  saveSettings();
  draw();
}

// ~ SETTINGS ~
function loadSettings() {
  const paramList = sessionStorage.getItem("settings").split("&");
  if (paramList.length === 6) {
    amountOfBalls = parseInt(paramList[0].split("=")[1]);
    ballSize = parseInt(paramList[1].split("=")[1]);
    distance = parseInt(paramList[2].split("=")[1]);
    direction = parseInt(paramList[3].split("=")[1]);
    mode = parseInt(paramList[4].split("=")[1]);
    saturation = parseInt(paramList[5].split("=")[1]);

    amountOfBallsSlider.value = amountOfBalls;
    saturationSlider.value = saturation;

    // Handle button states
    if (![0, 1, 2].includes(direction)) direction = 0;
    if (direction === 0) document.getElementById("switchMode").disabled = true;
    if (direction === 1) document.getElementById("horizontal").disabled = true;
    if (direction === 2) document.getElementById("vertical").disabled = true;

    if (![0, 1].includes(mode)) mode = 0;
    if (mode === 1 && direction === 0) mode = 0;

    const lang = localStorage.getItem("lang") || "en";
    if (mode === 1) {
      instructionField.textContent = languages[lang]["explanation"];
      modeLabel.textContent = languages[lang]["switchToNormalButton"];
      saturationDiv.style.visibility = "visible";
    } else {
      instructionField.textContent = languages[lang]["instructions"];
      modeLabel.textContent = languages[lang]["switchToMonochromeButton"];
    }

    saveSettings();
    draw();
  } else {
    resetSettings();
  }
}

function resetSettings() {
  amountOfBalls = 9;
  ballSize = 30;
  distance = 1000;
  direction = 0;
  mode = 0;
  saturation = 0;

  amountOfBallsSlider.value = amountOfBalls;
  saturationSlider.value = saturation;

  document.getElementById("switchMode").disabled = true;
  draw();
  saveSettings();
  console.log("resetted!");
}

function saveSettings() {
  sessionStorage.setItem(
    "settings",
    `amountOfBalls=${amountOfBalls}&ballSize=${ballSize}&distance=${distance}&direction=${direction}&mode=${mode}&saturation=${saturation}`
  );
}

// ~ DRAW ~
function draw() {
  canvContext.clearRect(0, 0, canvas.width, canvas.height);
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fillRect(0, 0, canvas.width, canvas.height);

  let leftBorder = 0.5 * canvas.width - 0.5 * canvas.height;
  let currentHeight, currentWidth;

  for (let i = 1; i <= amountOfBalls; i++) {
    currentHeight =
      i === 1
        ? canvas.height / amountOfBalls - canvas.height / amountOfBalls / 2
        : currentHeight + (distance / 1000) * (canvas.height / amountOfBalls);

    for (let j = 0; j < amountOfBalls; j++) {
      if (
        (j % 2 !== 0 && direction === 2) ||
        (i % 2 === 0 && direction === 1)
      ) {
        canvContext.fillStyle =
          mode === 1
            ? `rgb(${256 - saturation * 0.256}, ${256 - saturation * 0.256}, ${
                256 - saturation * 0.256
              })`
            : getDefaultColor("secondary");
      } else {
        canvContext.fillStyle =
          mode === 1 ? getDefaultColor("secondary") : getDefaultColor("shape");
      }

      currentWidth =
        j === 0
          ? leftBorder
          : currentWidth + (distance / 1000) * (canvas.height / amountOfBalls);

      canvContext.beginPath();
      canvContext.arc(
        currentWidth,
        currentHeight,
        (0.005 * ballSize * canvas.height) / amountOfBalls,
        0,
        2 * Math.PI
      );
      canvContext.fill();
    }
  }
}

function getDefaultColor(type) {
  const defaultColor = window
    .getComputedStyle(canvas)
    .getPropertyValue(`--default-${type}-color`);
  return defaultColor || "#000"; // fallback
}

console.log("<m1u1i2> v1.0.0 (Vanilla JS)");
