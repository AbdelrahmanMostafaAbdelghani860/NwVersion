(function safeInit() {
  if (!document.getElementById("interaction")) {
    return setTimeout(safeInit, 50);
  }

  if (sessionStorage.getItem("settings") != "") {
    loadSettings();
  } else {
    resetSettings();
  }

  init();
  draw();
})();

// ~-_-~ INITIALIZE ~-_-~
function init() {
  initElements();
  initEventListeners();
}

function initElements() {
  instructionField = document.getElementById("instructionField");
  explanationLabel = document.getElementById("explanation");
  if (showExplanation == 0) {
    instructionField.textContent =
      languages[localStorage.getItem("lang")]["instructions"];
    explanationLabel.textContent =
      languages[localStorage.getItem("lang")]["explanationButton"];
  } else if (showExplanation == 1) {
    instructionField.textContent =
      languages[localStorage.getItem("lang")]["explanation"];
    explanationLabel.textContent =
      languages[localStorage.getItem("lang")]["instructionButton"];
  }
  canvas = document.getElementById("interaction");
  canvContext = canvas.getContext("2d");

  // otherwise canvas resolution scales too low
  canvas.width = window.innerWidth;
  canvas.height = canvas.width / 2; // alternatively: = window.innerHeight*/
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  rectangle = {
    rect: {
      x: 0.5 * canvas.width - 0.5 * 1.5 * shapeSize,
      y: 0.5 * canvas.height - 0.5 * 1 * shapeSize,
      width: 1.5 * shapeSize,
      height: 1 * shapeSize,
    },
    circle: {
      // quarter circle (bottom right corner)
      x: 0.5 * canvas.width - 0.5 * 1.5 * shapeSize + 1.5 * shapeSize,
      y: 0.5 * canvas.height - 0.5 * 1 * shapeSize + 1 * shapeSize,
      radius: 0.5 * shapeSize,
      startAngle: Math.PI,
      endAngle: 1.5 * Math.PI,
    },
  };

  circle = {
    c1: {
      //semicircle (bottom)
      x: rectangle.rect.x + rectangle.rect.width,
      y: rectangle.rect.y + rectangle.rect.height,
      radius: 0.5 * shapeSize,
      startAngle: 0,
      endAngle: Math.PI,
    },
    c2: {
      //quarter circle (top right)
      x: rectangle.rect.x + rectangle.rect.width,
      y: rectangle.rect.y + rectangle.rect.height,
      radius: 0.5 * shapeSize,
      startAngle: 1.5 * Math.PI,
      endAngle: 2 * Math.PI,
    },
  };

  circleRectangle = {
    r1: {
      //rectanlge for c1
      x: circle.c1.x,
      y: circle.c1.y - circle.c1.radius,
      width: circle.c1.radius,
      height: circle.c1.radius,
    },
    r2: {
      //rectanlge for c2
      x: circle.c2.x - circle.c2.radius,
      y: circle.c2.y,
      width: 2 * circle.c2.radius,
      height: circle.c2.radius,
    },
  };

  triangle = {
    //triangle (bottom left corner)
    p1: {
      //upper point
      x: rectangle.rect.x - 0.1 * rectangle.rect.width,
      y: rectangle.rect.y + 0.5 * rectangle.rect.height,
    },
    p2: {
      //bottom left point
      x: rectangle.rect.x - 0.1 * rectangle.rect.width - 1 * 0.75 * shapeSize,
      y: rectangle.rect.y + rectangle.rect.height + 0.5 * shapeSize,
    },
    p3: {
      //bottom right point
      x: rectangle.rect.x - 0.1 * rectangle.rect.width + 1 * 0.75 * shapeSize,
      y: rectangle.rect.y + rectangle.rect.height + 0.5 * shapeSize,
    },
  };

  incomplete_triangle = {
    p1: {
      //upper
      x: rectangle.rect.x - 0.1 * rectangle.rect.width,
      y: rectangle.rect.y + 0.5 * rectangle.rect.height,
    },
    p2: {
      //bottom left
      x: rectangle.rect.x - 0.1 * rectangle.rect.width - 1 * 0.75 * shapeSize,
      y: rectangle.rect.y + rectangle.rect.height + 0.5 * shapeSize,
    },
    p3: {
      //bottom right
      x: rectangle.rect.x - 0.1 * rectangle.rect.width + 1 * 0.75 * shapeSize,
      y: rectangle.rect.y + rectangle.rect.height + 0.5 * shapeSize,
    },
    p4: {
      //intersection1
      x: rectangle.rect.x + 0.225 * shapeSize, //points[0].x,
      y: rectangle.rect.y + rectangle.rect.height, // points[0].y
    },
    p5: {
      //bottom left of rectangle
      x: rectangle.rect.x,
      y: rectangle.rect.y + rectangle.rect.height,
    },
    p6: {
      //intersection2
      x: rectangle.rect.x,
      y: rectangle.rect.y + rectangle.rect.height - 0.3 * shapeSize,
    },
  };

  triangleRectangle = {
    r1: {
      //left rectangle
      x: incomplete_triangle.p2.x,
      y: incomplete_triangle.p1.y,
      width: incomplete_triangle.p5.x - incomplete_triangle.p2.x,
      height: incomplete_triangle.p2.y - incomplete_triangle.p1.y,
    },
    r2: {
      //right rectangle
      x: incomplete_triangle.p5.x,
      y: incomplete_triangle.p5.y,
      width: incomplete_triangle.p3.x - incomplete_triangle.p5.x,
      height: incomplete_triangle.p3.y - incomplete_triangle.p5.y,
    },
  };
}

function initEventListeners() {
  // <-~-> PC CONTROL START <-~->
  canvas.addEventListener("mousedown", function (event) {
    mousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
    isDragging = getShape(mousePosition);
  });

  canvas.addEventListener("mousemove", function (event) {
    mousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
    if (isDragging) {
      switch (shape) {
        case 1:
          modifiedPos = [mousePosition, null, null];
          break;
        case 2:
          modifiedPos = [null, mousePosition, null];
          break;
        case 3:
          modifiedPos = [null, null, mousePosition];
          break;
      }
      draw(modifiedPos);
    }
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
    draw(); //reset plot to standard
  });
  // <-~-> PC CONTROL END <-~->

  // <-~-> MOBILE CONTROL START <-~->
  window.addEventListener(
    "touchstart",
    function (event) {
      const rect = canvas.getBoundingClientRect();
      touchPosition = {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
      isDragging = getShape(touchPosition);
    },
    { passive: false }
  );

  window.addEventListener(
    "touchmove",
    function (event) {
      const rect = canvas.getBoundingClientRect();
      touchPosition = {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
      if (isDragging) {
        event.preventDefault(); //only active in this scope
        switch (shape) {
          case 1:
            modifiedPos = [touchPosition, null, null];
            break;
          case 2:
            modifiedPos = [null, touchPosition, null];
            break;
          case 3:
            modifiedPos = [null, null, touchPosition];
            break;
        }
        draw(modifiedPos);
      }
    },
    { passive: false }
  );

  window.addEventListener("touchend", () => {
    isDragging = false;
    draw(); //reset plot to standard
  });
  // <-~-> MOBILE CONTROL END <-~->

  document.getElementById("explanationButton").onclick = function () {
    switchExplanationInstruction();
  };
  window.addEventListener("keydown", function (k) {
    switch (k.keyCode) {
      case 82: // r key
        switchExplanationInstruction();
        break;
    }
  });
}

//check if the user clcked on a valid shape and specify the clicked shape in 'shape'
function getShape(mousePosition) {
  if (
    mousePosition.x > rectangle.rect.x &&
    mousePosition.x < rectangle.rect.x + rectangle.rect.width &&
    mousePosition.y > rectangle.rect.y &&
    mousePosition.y < rectangle.rect.y + rectangle.rect.height
  ) {
    //console.log('mousePosition inside rectangle!');
    shape = 1;
    return true;
  }
  if (
    (mousePosition.x > circleRectangle.r1.x &&
      mousePosition.x < circleRectangle.r1.x + circleRectangle.r1.width &&
      mousePosition.y > circleRectangle.r1.y &&
      mousePosition.y < circleRectangle.r1.y + circleRectangle.r1.height) ||
    (mousePosition.x > circleRectangle.r2.x &&
      mousePosition.x < circleRectangle.r2.x + circleRectangle.r2.width &&
      mousePosition.y > circleRectangle.r2.y &&
      mousePosition.y < circleRectangle.r2.y + circleRectangle.r2.height)
  ) {
    //console.log('mousePosition inside circle!');
    shape = 2;
    return true;
  }
  if (
    (mousePosition.x > triangleRectangle.r1.x &&
      mousePosition.x < triangleRectangle.r1.x + triangleRectangle.r1.width &&
      mousePosition.y > triangleRectangle.r1.y &&
      mousePosition.y < triangleRectangle.r1.y + triangleRectangle.r1.height) ||
    (mousePosition.x > triangleRectangle.r2.x &&
      mousePosition.x < triangleRectangle.r2.x + triangleRectangle.r2.width &&
      mousePosition.y > triangleRectangle.r2.y &&
      mousePosition.y < triangleRectangle.r2.y + triangleRectangle.r2.height)
  ) {
    //console.log('mousePosition inside triangle!');
    shape = 3;
    return true;
  }
  return false;
}

function switchExplanationInstruction() {
  if (showExplanation == 1) {
    instructionField.textContent =
      languages[localStorage.getItem("lang")]["instructions"];
    explanationLabel.textContent =
      languages[localStorage.getItem("lang")]["explanationButton"];
    showExplanation = 0;
  } else if (showExplanation == 0) {
    instructionField.textContent =
      languages[localStorage.getItem("lang")]["explanation"];
    explanationLabel.textContent =
      languages[localStorage.getItem("lang")]["instructionButton"];
    showExplanation = 1;
  }
}

// ~-_-~ SETTINGS ~-_-~
function loadSettings() {
  var paramList = sessionStorage.getItem("settings").split("&"); //[shapeSize=200, borderWidth=5, ...]
  console.log(paramList);
  if (paramList.length == 3) {
    showExplanation = parseInt(paramList[0].split("=")[1]);
    shapeSize = parseInt(paramList[1].split("=")[1]);
    showHitboxes = parseInt(paramList[2].split("=")[1]);
    isDragging = false;
    if (![0, 1].includes(showExplanation)) {
      console.log(
        'Invalid "showExplanation" URL-parameter! | showExplanation="' +
          showExplanation +
          '" [Valid value = "0" and "1"]'
      );
      showExplanation = 0;
    }
  } else {
    resetSettings();
  }
}

function resetSettings() {
  showExplanation = 0;
  shapeSize = 200;
  showHitboxes = 0;
  isDragging = false;
  shape = null;
  saveSettings();
}

function saveSettings() {
  sessionStorage.setItem(
    "settings",
    "showExplanation=" +
      showExplanation +
      "&shapeSize=" +
      shapeSize +
      "&showHitboxes=" +
      showHitboxes
  );
}

// ~-_-~ VISUALIZATION ~-_-~
function draw(modifiedPos = [null, null, null]) {
  canvContext.clearRect(0, 0, canvas.width, canvas.height);
  canvContext.fillStyle = getDefaultColor("bg");
  canvContext.fillRect(0, 0, canvas.width, canvas.height);

  drawTriangle(modifiedPos[2]);
  drawCircle(modifiedPos[1]);
  drawRectangle(modifiedPos[0]);

  if (showHitboxes != 0 && showHitboxes != 1) {
    console.log(
      'Invalid "showHitboxes" URL-parameter! | showHitboxes="' +
        showHitboxes +
        '" [Valid value = "0" and "1"]'
    );
  } else if (showHitboxes == 1) {
    drawHitboxes();
  }
}

function getDefaultColor(type) {
  const color = getComputedStyle(canvas)
    .getPropertyValue("--default-" + type + "-color")
    .trim();
  if (color && color !== "") {
    return color;
  }

  // fallback only if variable is missing
  const fallback = {
    bg: "#ffffff",
    shape: "#000000",
    secondary: "#888888",
    tertiary: "#444444",
  };
  console.warn(
    `Missing CSS variable '--default-${type}-color'. Using fallback: ${fallback[type]}`
  );
  return fallback[type] || "#cccccc";
}

function drawRectangle(modifiedPos) {
  if (!modifiedPos) {
    canvContext.beginPath();
    canvContext.rect(
      rectangle.rect.x,
      rectangle.rect.y,
      rectangle.rect.width,
      rectangle.rect.height
    );
    canvContext.fillStyle = getDefaultColor("shape");
    canvContext.fill();

    canvContext.beginPath();
    canvContext.arc(
      rectangle.circle.x,
      rectangle.circle.y,
      rectangle.circle.radius,
      rectangle.circle.startAngle,
      rectangle.circle.endAngle
    );
    canvContext.lineTo(rectangle.circle.x, rectangle.circle.y);
    canvContext.fillStyle = getDefaultColor("secondary");
    canvContext.fill();

    canvContext.beginPath();
    canvContext.lineTo(incomplete_triangle.p5.x, incomplete_triangle.p5.y); //bottom left of rectangle
    canvContext.lineTo(incomplete_triangle.p4.x, incomplete_triangle.p4.y); //intersection1
    canvContext.lineTo(incomplete_triangle.p6.x, incomplete_triangle.p6.y); //intersection2
    canvContext.closePath();
    canvContext.fillStyle = getDefaultColor("tertiary");
    canvContext.fill();
  } else {
    canvContext.beginPath();
    canvContext.rect(
      modifiedPos.x - 0.5 * rectangle.rect.width,
      modifiedPos.y - 0.5 * rectangle.rect.height,
      rectangle.rect.width,
      rectangle.rect.height
    );
    canvContext.fillStyle = getDefaultColor("shape");
    canvContext.fill();

    canvContext.beginPath();
    canvContext.arc(
      modifiedPos.x + 0.5 * rectangle.rect.width,
      modifiedPos.y + 0.5 * rectangle.rect.height,
      rectangle.circle.radius,
      rectangle.circle.startAngle,
      rectangle.circle.endAngle
    );
    canvContext.lineTo(
      modifiedPos.x + 0.5 * rectangle.rect.width,
      modifiedPos.y + 0.5 * rectangle.rect.height
    );
    canvContext.fillStyle = getDefaultColor("secondary");
    canvContext.fill();

    canvContext.beginPath();
    canvContext.lineTo(
      modifiedPos.x - 0.5 * rectangle.rect.width,
      modifiedPos.y + 0.5 * rectangle.rect.height
    ); //bottom left of rectangle
    canvContext.lineTo(
      modifiedPos.x - 0.5 * rectangle.rect.width + 0.225 * shapeSize,
      modifiedPos.y + 0.5 * rectangle.rect.height
    ); //intersection1
    canvContext.lineTo(
      modifiedPos.x - 0.5 * rectangle.rect.width,
      modifiedPos.y + 0.5 * rectangle.rect.height - 0.3 * shapeSize
    ); //intersection2
    canvContext.closePath();
    canvContext.fillStyle = getDefaultColor("tertiary");
    canvContext.fill();
  }
}

function drawCircle(modifiedPos) {
  if (!modifiedPos) {
    canvContext.beginPath();
    canvContext.arc(
      circle.c1.x,
      circle.c1.y,
      circle.c1.radius,
      circle.c1.startAngle,
      circle.c1.endAngle
    );
    canvContext.fillStyle = getDefaultColor("secondary");
    canvContext.fill();

    canvContext.beginPath();
    canvContext.arc(
      circle.c2.x,
      circle.c2.y,
      circle.c2.radius,
      circle.c2.startAngle,
      circle.c2.endAngle
    );
    canvContext.lineTo(circle.c2.x, circle.c2.y);
    canvContext.fillStyle = getDefaultColor("secondary");
    canvContext.fill();
  } else {
    canvContext.beginPath();
    canvContext.arc(
      modifiedPos.x,
      modifiedPos.y,
      circle.c1.radius,
      circle.c1.startAngle,
      circle.c1.endAngle
    );
    canvContext.fillStyle = getDefaultColor("secondary");
    canvContext.fill();

    canvContext.beginPath();
    canvContext.arc(
      modifiedPos.x,
      modifiedPos.y,
      circle.c2.radius,
      circle.c2.startAngle,
      circle.c2.endAngle
    );
    canvContext.lineTo(modifiedPos.x, modifiedPos.y);
    canvContext.fillStyle = getDefaultColor("secondary");
    canvContext.fill();
  }
}

function drawTriangle(modifiedPos) {
  if (!modifiedPos) {
    canvContext.beginPath();
    canvContext.moveTo(incomplete_triangle.p1.x, incomplete_triangle.p1.y); //upper point
    canvContext.lineTo(incomplete_triangle.p2.x, incomplete_triangle.p2.y); //bottom left point
    canvContext.lineTo(incomplete_triangle.p3.x, incomplete_triangle.p3.y); //bottom right point
    canvContext.lineTo(incomplete_triangle.p4.x, incomplete_triangle.p4.y); //intersection1
    canvContext.lineTo(incomplete_triangle.p5.x, incomplete_triangle.p5.y); //bottom left of rectangle
    canvContext.lineTo(incomplete_triangle.p6.x, incomplete_triangle.p6.y); //intersection2
    canvContext.closePath();
    canvContext.fillStyle = getDefaultColor("tertiary");
    canvContext.fill();
  } else {
    canvContext.beginPath();
    canvContext.moveTo(
      modifiedPos.x,
      modifiedPos.y - 0.25 * shapeSize - 0.25 * rectangle.rect.height
    ); //upper point
    canvContext.lineTo(
      modifiedPos.x - 0.75 * shapeSize,
      modifiedPos.y + 0.25 * shapeSize + 0.25 * rectangle.rect.height
    ); //bottom left point
    canvContext.lineTo(
      modifiedPos.x + 0.75 * shapeSize,
      modifiedPos.y + 0.25 * shapeSize + 0.25 * rectangle.rect.height
    ); //bottom right point
    canvContext.lineTo(
      modifiedPos.x +
        0.75 * shapeSize -
        incomplete_triangle.p3.x +
        incomplete_triangle.p4.x,
      modifiedPos.y +
        0.25 * shapeSize +
        0.25 * rectangle.rect.height -
        incomplete_triangle.p3.y +
        incomplete_triangle.p4.y
    ); //intersection1

    canvContext.lineTo(
      modifiedPos.x -
        0.75 * shapeSize +
        incomplete_triangle.p5.x -
        incomplete_triangle.p2.x,
      modifiedPos.y +
        0.25 * shapeSize +
        0.25 * rectangle.rect.height -
        incomplete_triangle.p2.y +
        incomplete_triangle.p5.y
    ); //bottom left of rectangle
    canvContext.lineTo(
      modifiedPos.x + incomplete_triangle.p6.x - incomplete_triangle.p1.x,
      modifiedPos.y -
        0.25 * shapeSize -
        0.25 * rectangle.rect.height +
        incomplete_triangle.p6.y -
        incomplete_triangle.p1.y
    ); //intersection2
    canvContext.closePath();
    canvContext.fillStyle = getDefaultColor("tertiary");
    canvContext.fill();
  }
}

function drawHitboxes() {
  canvContext.lineWidth = 3;
  // RECTANGLE
  canvContext.beginPath();
  canvContext.rect(
    rectangle.rect.x,
    rectangle.rect.y,
    rectangle.rect.width,
    rectangle.rect.height
  );
  canvContext.strokeStyle = "aquamarine";
  canvContext.stroke();

  // TRIANGLE
  canvContext.beginPath();
  canvContext.rect(
    triangleRectangle.r1.x,
    triangleRectangle.r1.y,
    triangleRectangle.r1.width,
    triangleRectangle.r1.height
  );
  canvContext.strokeStyle = "red";
  canvContext.stroke();
  canvContext.beginPath();
  canvContext.rect(
    triangleRectangle.r2.x,
    triangleRectangle.r2.y,
    triangleRectangle.r2.width,
    triangleRectangle.r2.height
  );
  canvContext.strokeStyle = "red";
  canvContext.stroke();

  // CIRCLE
  canvContext.beginPath();
  canvContext.rect(
    circleRectangle.r1.x,
    circleRectangle.r1.y,
    circleRectangle.r1.width,
    circleRectangle.r1.height
  );
  canvContext.strokeStyle = "green";
  canvContext.stroke();
  canvContext.beginPath();
  canvContext.rect(
    circleRectangle.r2.x,
    circleRectangle.r2.y,
    circleRectangle.r2.width,
    circleRectangle.r2.height
  );
  canvContext.strokeStyle = "green";
  canvContext.stroke();

  canvContext.lineWidth = 1; //reset to standard (1px)
}

// ~-_-~ CURRENT VERSION ~-_-~
console.log("<m1u1i3> v1.0.1");
