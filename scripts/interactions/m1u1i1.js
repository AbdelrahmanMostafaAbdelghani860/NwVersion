let canvas, canvContext;
let amountOfBalls = 9;
let ballSize = 30;
let horizontalDistance = 1000;
let verticalDistance = 1000;

let amountOfBallsSlider, horDistanceSlider, vertDistanceSlider;

function waitForCanvasAndInit() {
  const canvas = document.getElementById("interaction");

  if (canvas) {
    // Declare fallback globals
    window.amountOfBalls ??= 9;
    window.ballSize ??= 30;
    window.horizontalDistance ??= 1000;
    window.verticalDistance ??= 1000;

    init();

    if (sessionStorage.getItem("settings") !== "") {
      loadSettings();
    } else {
      resetSettings();
    }

    // 🔥 Add this to draw once after everything is initialized
    setTimeout(() => {
      draw();
    }, 100); // slight delay to let layout stabilize
  } else {
    // Wait until canvas is injected
    setTimeout(waitForCanvasAndInit, 100);
  }
}

waitForCanvasAndInit();

// TODO : mobile input
{
  window.addEventListener("touchstart", function (event) {
    // Use event.pageX and event.pageY here
  });

  window.addEventListener("touchmove", function (event) {
    // Use event.pageX and event.pageY here
  });

  window.addEventListener("touchend", function (event) {
    // Use event.pageX and event.pageY here
  });
}

// INITIALIZE
function init() {
  initElements();
  initEventListeners();
}

function initElements() {
  canvas = document.getElementById("interaction");
  canvContext = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = canvas.width / 2;

  amountOfBallsSlider = document.getElementById("amountOfBalls");
  amountOfBallsSlider.value = amountOfBalls;

  horDistanceSlider = document.getElementById("horizontalDistance");
  horDistanceSlider.value = horizontalDistance;

  vertDistanceSlider = document.getElementById("verticalDistance");
  vertDistanceSlider.value = verticalDistance;
}

function initEventListeners() {
  amountOfBallsSlider.oninput = function () {
    amountOfBalls = parseInt(this.value);
    draw();
    saveSettings();
  };

  horDistanceSlider.oninput = function () {
    horizontalDistance = parseInt(this.value);
    draw();
    saveSettings();
  };

  vertDistanceSlider.oninput = function () {
    verticalDistance = parseInt(this.value);
    draw();
    saveSettings();
  };

  document.getElementById("reset").onclick = function () {
    resetSettings();
  };

  window.addEventListener("keydown", function (k) {
    switch (k.keyCode) {
      case 82:
        resetSettings();
        break; // R
      case 65: // A
        horizontalDistance = Math.max(300, horizontalDistance - 1);
        horDistanceSlider.value = horizontalDistance;
        draw();
        saveSettings();
        break;
      case 68: // D
        horizontalDistance = Math.min(1000, horizontalDistance + 1);
        horDistanceSlider.value = horizontalDistance;
        draw();
        saveSettings();
        break;
      case 87: // W
        verticalDistance = Math.min(1000, verticalDistance + 1);
        vertDistanceSlider.value = verticalDistance;
        draw();
        saveSettings();
        break;
      case 83: // S
        verticalDistance = Math.max(300, verticalDistance - 1);
        vertDistanceSlider.value = verticalDistance;
        draw();
        saveSettings();
        break;
      case 69: // E
        amountOfBalls = Math.min(20, amountOfBalls + 1);
        amountOfBallsSlider.value = amountOfBalls;
        draw();
        saveSettings();
        break;
      case 81: // Q
        amountOfBalls = Math.max(2, amountOfBalls - 1);
        amountOfBallsSlider.value = amountOfBalls;
        draw();
        saveSettings();
        break;
    }
  });
}

// SETTINGS
function loadSettings() {
  const paramList = sessionStorage.getItem("settings").split("&");
  if (paramList.length === 4) {
    amountOfBalls = parseInt(paramList[0].split("=")[1]);
    amountOfBallsSlider.value = amountOfBalls;

    ballSize = parseInt(paramList[1].split("=")[1]);

    horizontalDistance = parseInt(paramList[2].split("=")[1]);
    horDistanceSlider.value = horizontalDistance;

    verticalDistance = parseInt(paramList[3].split("=")[1]);
    vertDistanceSlider.value = verticalDistance;

    draw();
  } else {
    resetSettings();
  }
}

function resetSettings() {
  amountOfBalls = 9;
  document.getElementById("amountOfBalls").value = amountOfBalls;

  ballSize = 30;

  horizontalDistance = 1000;
  document.getElementById("horizontalDistance").value = horizontalDistance;

  verticalDistance = 1000;
  document.getElementById("verticalDistance").value = verticalDistance;

  draw();
  saveSettings();
  console.log("resetted!");
}

function saveSettings() {
  sessionStorage.setItem(
    "settings",
    "amountOfBalls=" +
      amountOfBalls +
      "&ballSize=" +
      ballSize +
      "&horizontalDistance=" +
      horizontalDistance +
      "&verticalDistance=" +
      verticalDistance
  );
}

// DRAW
function draw() {
  console.log("Drawing...");
  canvContext.clearRect(0, 0, canvas.width, canvas.height);
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fillRect(0, 0, canvas.width, canvas.height);
  canvContext.fillStyle = getDefaultColor("shape");

  const leftBorder = 0.5 * canvas.width - 0.5 * canvas.height;
  let currentHeight, currentWidth;

  console.log("amountOfBalls:", amountOfBalls);
  console.log("canvas size:", canvas.width, canvas.height);
  console.log("hDist:", horizontalDistance, "vDist:", verticalDistance);

  for (let i = 1; i <= amountOfBalls; i++) {
    if (i === 1) {
      currentHeight =
        canvas.height / amountOfBalls - canvas.height / amountOfBalls / 2;
    } else {
      currentHeight +=
        (verticalDistance / 1000) * (canvas.height / amountOfBalls);
    }

    for (let j = 0; j < amountOfBalls; j++) {
      if (j === 0) {
        currentWidth = leftBorder;
      } else {
        currentWidth +=
          (horizontalDistance / 1000) * (canvas.height / amountOfBalls);
      }

      const radius = (0.005 * ballSize * canvas.height) / amountOfBalls;

      if (isNaN(currentHeight) || isNaN(currentWidth) || isNaN(radius)) {
        console.error("NaN detected", { currentWidth, currentHeight, radius });
        continue;
      }

      canvContext.beginPath();
      canvContext.arc(currentWidth, currentHeight, radius, 0, 2 * Math.PI);
      canvContext.fill();
    }
  }
}

function getDefaultColor(type) {
  const defaultColor = window
    .getComputedStyle(canvas)
    .getPropertyValue("--default-" + type + "-color");
  return defaultColor || "#000"; // fallback if not found
}

console.log("<m1u1i1> v1.0.4");
