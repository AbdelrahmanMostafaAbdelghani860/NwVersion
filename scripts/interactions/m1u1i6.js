showHitboxes = 1;

function init() {
  initElements();
  initEventListeners();
}

function initElements() {
  canvas = document.getElementById("interaction");

  if (!canvas) {
    console.error("Canvas element not found.");
    return;
  }

  canvContext = canvas.getContext("2d");
  if (!canvContext) {
    console.error("Canvas context could not be initialized.");
    return;
  }

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  canWidth = canvas.width * (1 - (2 * canvasPadding) / 1000);
  figWidth = canWidth / 3;
  spacing = figWidth * (shapeDistance / 1000);
  figWidth = figWidth - 2 * spacing;

  // RECTANGLE (left)
  rectangle = {
    x: 0.5 * canvas.width - 0.5 * figWidth - spacing - 1.3 * figWidth,
    y: 0.5 * canvas.height - 0.5 * figWidth,
    width: 1.3 * figWidth,
    height: figWidth,
  };

  // CIRCLE (middle)
  circle = {
    x: 0.5 * canvas.width,
    y: 0.5 * canvas.height,
    radius: 0.5 * figWidth,
    startAngle: 0,
    endAngle: 2 * Math.PI,
  };

  // circleRectangle must match jQuery
  circleRectangle = {
    x: 0.5 * canvas.width - 0.5 * figWidth,
    y: 0.5 * canvas.height - 0.5 * figWidth,
    width: figWidth,
    height: figWidth,
  };

  // TRIANGLE (right)
  triangle = {
    p1: {
      x: 0.5 * canvas.width + 0.5 * figWidth + spacing + 0.65 * figWidth,
      y: 0.5 * canvas.height - 0.5 * figWidth,
    },
    p2: {
      x: 0.5 * canvas.width + 0.5 * figWidth + spacing + 1.3 * figWidth,
      y: 0.5 * canvas.height + 0.5 * figWidth,
    },
    p3: {
      x: 0.5 * canvas.width + 0.5 * figWidth + spacing,
      y: 0.5 * canvas.height + 0.5 * figWidth,
    },
  };

  // triangleRectangle must also match jQuery
  triangleRectangle = {
    x: 0.5 * canvas.width + 0.5 * figWidth + spacing,
    y: 0.5 * canvas.height - 0.5 * figWidth,
    width: 1.3 * figWidth,
    height: figWidth,
  };

  console.log("Elements initialized.");
}

function initEventListeners() {
  canvas.addEventListener(
    "click",
    function (event) {
      var canvasRect = canvas.getBoundingClientRect();
      posX = event.pageX - canvasRect.left - scrollX;
      posY = event.pageY - canvasRect.top - scrollY;

      // normalize mouse click coordinates
      posX /= canvasRect.width;
      posY /= canvasRect.height;

      // scale the normalized coordinates to canvas size
      posX *= canvasRect.width;
      posY *= canvasRect.height;

      mousePosition = {
        /**x: Math.abs(event.clientX - canvasRect.left),
            y: Math.abs(event.clientY - canvasRect.top)*/
        x: event.offsetX,
        y: event.offsetY,
        //x: posX,
        //y: posY
      };

      if (showClicks != 0 && showClicks != 1) {
        console.log(
          'Invalid "showClicks" URL-parameter! | showClicks="' +
            showClicks +
            '" [Valid value = "0" and "1"]'
        );
      } else if (showClicks == 1) {
        canvContext.beginPath();
        canvContext.strokeStyle = "red";
        canvContext.lineWidth = 5;
        canvContext.arc(mousePosition.x, mousePosition.y, 5, 0, 2 * Math.PI);
        canvContext.stroke();
      }
      if (isShape(mousePosition)) {
        //alert('mousePosition inside shape');
      } else {
        //alert('clicked outside shape');
      }
    },
    false
  );
}

function isShape(mousePosition) {
  const { x, y } = mousePosition;

  // RECTANGLE
  if (
    x > rectangle.x &&
    x < rectangle.x + rectangle.width &&
    y > rectangle.y &&
    y < rectangle.y + rectangle.height
  ) {
    isRectangle = 1 - isRectangle;
    saveSettings();
    drawRectangle(isRectangle);
    return true;
  }

  // CIRCLE
  if (
    x > circleRectangle.x &&
    x < circleRectangle.x + circleRectangle.width &&
    y > circleRectangle.y &&
    y < circleRectangle.y + circleRectangle.height
  ) {
    isCircle = 1 - isCircle;
    saveSettings();
    drawCircle(isCircle);
    return true;
  }

  // TRIANGLE
  if (
    x > triangleRectangle.x &&
    x < triangleRectangle.x + triangleRectangle.width &&
    y > triangleRectangle.y &&
    y < triangleRectangle.y + triangleRectangle.height
  ) {
    isTriangle = 1 - isTriangle;
    saveSettings();
    drawTriangle(isTriangle);
    return true;
  }

  return false;
}

// -- SETTINGS --
function loadSettings() {
  var paramList = sessionStorage.getItem("settings").split("&"); //[canvasPadding=50, shapeDistance=100, ...]
  console.log(paramList);
  if (paramList.length == 9) {
    canvasPadding = parseInt(paramList[0].split("=")[1]);
    shapeDistance = parseInt(paramList[1].split("=")[1]);
    borderWidth = parseInt(paramList[2].split("=")[1]);
    dotFactor = parseInt(paramList[3].split("=")[1]);
    isRectangle = parseInt(paramList[4].split("=")[1]);
    isCircle = parseInt(paramList[5].split("=")[1]);
    isTriangle = parseInt(paramList[6].split("=")[1]);
    showHitboxes = parseInt(paramList[7].split("=")[1]);
    showClicks = parseInt(paramList[8].split("=")[1]);
  } else {
    resetSettings();
  }
}

function resetSettings() {
  borderWidth = 10; // increase thickness to match old version
  canvasPadding = 50; // 50 = 5%
  shapeDistance = 100; //100 = 10%
  borderWidth = 5;
  dotFactor = 4; // 4 = .4%
  isRectangle = 1;
  isCircle = 1;
  isTriangle = 1;
  showHitboxes = 0;
  showClicks = 0;
  saveSettings();
}

function saveSettings() {
  sessionStorage.setItem(
    "settings",
    "canvasPadding=" +
      canvasPadding +
      "&shapeDistance=" +
      shapeDistance +
      "&borderWidth=" +
      borderWidth +
      "&dotFactor=" +
      dotFactor +
      "&isRectangle=" +
      isRectangle +
      "&isCircle=" +
      isCircle +
      "&isTriangle=" +
      isTriangle +
      "&showHitboxes=" +
      showHitboxes +
      "&showClicks=" +
      showClicks
  );
}

// -- VISUALIZATION --
function draw() {
  // Clear canvas
  canvContext.clearRect(0, 0, canvas.width, canvas.height);

  // Fill background
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fillRect(0, 0, canvas.width, canvas.height);

  // Draw shapes based on current visibility settings
  drawRectangle(isRectangle);
  drawCircle(isCircle);
  drawTriangle(isTriangle);

  // Optionally draw hitboxes if enabled
  if (showHitboxes !== 0 && showHitboxes !== 1) {
    console.log(
      `Invalid "showHitboxes" value: ${showHitboxes} [Expected 0 or 1]`
    );
  } else if (showHitboxes === 1) {
    drawHitboxes();
  }
}

function getDefaultColor(type) {
  const style = window.getComputedStyle(canvas);
  const color = style.getPropertyValue(`--default-${type}-color`).trim();

  if (color && color !== "") {
    return color;
  } else {
    console.warn(`Missing CSS variable: --default-${type}-color`);
    return type === "bg" ? "#bbbbbb" : "#000000"; // fallback
  }
}

function drawRectangle(isRectangle) {
  if (isRectangle != 0 && isRectangle != 1) {
    console.log(
      'Invalid "isRectangle" URL-parameter! | isRectangle=' + isRectangle
    );
    isRectangle = 1;
  }
  canvContext.beginPath();
  canvContext.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fill();
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();

  if (isRectangle == 0) {
    drawDot(rectangle.x, rectangle.y + 0.5 * rectangle.height);
    drawDot(
      rectangle.x + 0.1 * rectangle.width,
      rectangle.y + rectangle.height
    );
    drawDot(
      rectangle.x + rectangle.width,
      rectangle.y + 0.4 * rectangle.height
    );
    drawDot(rectangle.x + 0.8 * rectangle.width, rectangle.y);
  }
}

function drawCircle(isCircle) {
  if (isCircle != 0 && isCircle != 1) {
    console.log('Invalid "isCircle" URL-parameter! | isCircle=' + isCircle);
    isCircle = 1;
  }
  canvContext.beginPath();
  canvContext.arc(
    circle.x,
    circle.y,
    circle.radius,
    circle.startAngle,
    circle.endAngle
  );
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fill();
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();

  if (isCircle == 0) {
    drawDot(circle.x, circle.y + circle.radius); // 180°
    drawDot(circle.x + circle.radius, circle.y); // 90°
    drawDot(circle.x + 0.7 * circle.radius, circle.y - 0.72 * circle.radius);
    drawDot(circle.x - 0.7 * circle.radius, circle.y - 0.72 * circle.radius);
  }
}

function drawTriangle(isTriangle) {
  if (isTriangle != 0 && isTriangle != 1) {
    console.log(
      'Invalid "isTriangle" URL-parameter! | isTriangle=' + isTriangle
    );
    isTriangle = 1;
  }
  canvContext.beginPath();
  canvContext.moveTo(triangle.p1.x, triangle.p1.y); //upper point
  canvContext.lineTo(triangle.p2.x, triangle.p2.y); //bottom right point
  canvContext.lineTo(triangle.p3.x, triangle.p3.y); //bottom left point
  canvContext.closePath();
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fill();
  canvContext.strokeStyle = getDefaultColor("shape");
  canvContext.lineWidth = borderWidth;
  canvContext.stroke();

  if (isTriangle == 0) {
    drawDot(
      triangle.p3.x + 0.15 * (triangle.p2.x - triangle.p3.x),
      triangle.p1.y + 0.7 * (triangle.p3.y - triangle.p1.y)
    );
    drawDot(
      triangle.p2.x - 0.15 * (triangle.p2.x - triangle.p3.x),
      triangle.p2.y
    );
    drawDot(
      triangle.p1.x + 0.2 * (triangle.p2.x - triangle.p3.x),
      triangle.p1.y + 0.4 * (triangle.p2.y - triangle.p1.y)
    );
  }
}

function drawHitboxes() {
  canvContext.lineWidth = 3;
  // RECTANGLE
  canvContext.beginPath();
  canvContext.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  canvContext.strokeStyle = "aquamarine";
  canvContext.stroke();

  // CIRCLE
  canvContext.beginPath();
  canvContext.rect(
    circleRectangle.x,
    circleRectangle.y,
    circleRectangle.width,
    circleRectangle.height
  );
  canvContext.strokeStyle = "green";
  canvContext.stroke();

  // TRIANGLE
  canvContext.beginPath();
  canvContext.rect(
    triangleRectangle.x,
    triangleRectangle.y,
    triangleRectangle.width,
    triangleRectangle.height
  );
  canvContext.strokeStyle = "red";
  canvContext.stroke();

  canvContext.lineWidth = 1; //reset to standard (1px)
}

function drawDot(posX, posY) {
  canvContext.beginPath();
  canvContext.strokeStyle = getDefaultColor("bg");
  canvContext.arc(
    posX,
    posY,
    borderWidth * (dotFactor / 1000) * canWidth,
    0,
    2 * Math.PI
  );
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fill();
  canvContext.stroke();
}

// -- CURRENT VERSION --
console.log("<m1u1i6> v1.0.2");
function waitForCanvas(retries = 20) {
  const testCanvas = document.getElementById("interaction");
  if (testCanvas) {
    console.log("Canvas found. Starting init...");
    if (sessionStorage.getItem("settings") !== "") {
      loadSettings();
    } else {
      resetSettings();
    }
    init();
    draw();
  } else if (retries > 0) {
    console.log("Waiting for canvas...");
    setTimeout(() => waitForCanvas(retries - 1), 200);
  } else {
    console.error("Canvas not found after waiting.");
  }
}

waitForCanvas();
