// Wait until languages and DOM are ready
function safeInit(callback) {
  if (typeof languages === "undefined" || !document.body) {
    setTimeout(() => safeInit(callback), 50);
  } else {
    callback();
  }
}

safeInit(() => {
  let canvas = document.getElementById("interaction");
  let ctx = canvas.getContext("2d");

  let amountOfBallsSlider = document.getElementById("amountOfBalls");
  let speedSlider = document.getElementById("speed");
  let startBtn = document.getElementById("start");
  let newMoveBtn = document.getElementById("generateNewMovement");
  let resetBtn = document.getElementById("reset");

  let fps = 30,
    speed = 200,
    canvasPadding = 50,
    amountOfBalls = 9,
    ballDistance = 100,
    offset = 200,
    ballStates = [],
    lastBallPos = [],
    started = false,
    then = Date.now(),
    delay = 1;

  canvas.width = window.innerWidth;
  canvas.height = canvas.width / 2;

  amountOfBallsSlider.addEventListener("input", () => {
    amountOfBalls = +amountOfBallsSlider.value;
    ballStates = generateRandomBallStates();
    started = false;
    startBtn.value = "⏵";
    draw();
    saveSettings();
  });

  speedSlider.addEventListener("input", () => {
    speed = +speedSlider.value;
    saveSettings();
  });

  startBtn.addEventListener("click", () => {
    started = !started;
    startBtn.value = started ? "⏸" : "⏵";
  });

  newMoveBtn.addEventListener("click", () => {
    ballStates = generateRandomBallStates();
    started = false;
    saveSettings();
    draw();
  });

  resetBtn.addEventListener("click", resetSettings);

  function generateRandomBallStates() {
    let result = [];
    let valid = false;
    while (!valid) {
      result = Array.from({ length: amountOfBalls }, () =>
        Math.round(Math.random())
      );
      valid = result.includes(0) && result.includes(1);
    }
    return result;
  }

  function saveSettings() {
    sessionStorage.setItem(
      "settings",
      `fps=${fps}&speed=${speed}&canvasPadding=${canvasPadding}&amountOfBalls=${amountOfBalls}&ballDistance=${ballDistance}&offset=${offset}&ballStates=${ballStates}`
    );
  }

  function resetSettings() {
    fps = 30;
    speed = 200;
    canvasPadding = 50;
    amountOfBalls = 9;
    ballDistance = 100;
    offset = 200;
    ballStates = generateRandomBallStates();
    lastBallPos = Array(amountOfBalls).fill(canvas.height / 2);
    started = false;
    then = Date.now();
    amountOfBallsSlider.value = amountOfBalls;
    speedSlider.value = speed;
    saveSettings();
    draw();
  }

  function getDefaultColor(type) {
    const color = getComputedStyle(canvas).getPropertyValue(
      `--default-${type}-color`
    );
    return color ? color.trim() : "#ddd";
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getDefaultColor("bg");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getDefaultColor("shape");

    const canWidth = canvas.width * (1 - (2 * canvasPadding) / 1000);
    const leftBorder =
      (canvas.width - canWidth) / 2 + canWidth / amountOfBalls / 2;
    const ballRadius = canWidth / amountOfBalls / 2;

    let currentX = leftBorder;

    for (let i = 0; i < amountOfBalls; i++) {
      let ballY;
      if (started) {
        const minY = canvas.height / 2 - ((offset / 1000) * canvas.height) / 2;
        const maxY = minY + (offset / 1000) * canvas.height;
        const direction = ballStates[i];

        if (direction === 0) {
          ballY = (lastBallPos[i] || minY) + 1;
          if (ballY >= maxY) {
            ballStates[i] = 1;
          }
        } else {
          ballY = (lastBallPos[i] || maxY) - 1;
          if (ballY <= minY) {
            ballStates[i] = 0;
          }
        }
        lastBallPos[i] = ballY;
      } else {
        ballY =
          canvas.height / 2 -
          ((offset / 1000) * canvas.height) / 2 +
          ((ballStates[i] * offset) / 1000) * canvas.height;
        lastBallPos[i] = ballY;
      }

      ctx.beginPath();
      ctx.arc(currentX, ballY, ballRadius, 0, 2 * Math.PI);
      ctx.fill();

      currentX += 2 * ballRadius;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    const now = Date.now();
    const elapsed = now - then;
    if (elapsed > (speed / fps) * delay) {
      then = now;
      draw();
    }
  }

  if (sessionStorage.getItem("settings")) {
    try {
      const paramList = sessionStorage.getItem("settings").split("&");
      if (paramList.length === 7) {
        fps = +paramList[0].split("=")[1];
        speed = +paramList[1].split("=")[1];
        canvasPadding = +paramList[2].split("=")[1];
        amountOfBalls = +paramList[3].split("=")[1];
        ballDistance = +paramList[4].split("=")[1];
        offset = +paramList[5].split("=")[1];
        ballStates = paramList[6].split("=")[1].split(",").map(Number);
        amountOfBallsSlider.value = amountOfBalls;
        speedSlider.value = speed;
      }
    } catch {
      resetSettings();
    }
  } else {
    resetSettings();
  }

  animate();
});
