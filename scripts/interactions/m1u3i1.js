document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('settings') != '') {
        loadSettings();
    } else {
        resetSettings(); // This will call the resetSettings function
    }
    init();
});

// -_- RESET SETTINGS -_-
function resetSettings() {
  // Reset any settings or values you need here
  console.log("Settings have been reset.");

  // Example: Clear session storage
  sessionStorage.clear();

  // Set default language or other initial settings
  sessionStorage.setItem("lang", "de"); // Default to German
}

// -_- SETTINGS -_-
function loadSettings() {
  var paramList = sessionStorage.getItem("settings").split("&"); //[canvasPadding=50, verticalSpacing=0, ...]
  console.log(paramList);
  if (paramList.length == 5) {
    canvasPadding = parseInt(paramList[0].split("=")[1]);
    verticalSpacing = parseInt(paramList[1].split("=")[1]);
    if (verticalSpacing < 0 || verticalSpacing > 1000) {
      console.log(
        'Invalid "verticalSpacing" URL-parameter! | verticalSpacing="' +
          verticalSpacing +
          '" [Valid value = between "0" and "1000"]'
      );
      verticalSpacing = 0;
    }
    borderWidth = parseInt(paramList[2].split("=")[1]);
    mode = parseInt(paramList[3].split("=")[1]);
    if (![0, 1, 2].includes(mode)) {
      console.log(
        'Invalid "mode" URL-parameter! | mode="' +
          mode +
          '" [Valid value = "0", "1" and "2"]'
      );
      mode = 0;
    }
    figure = parseInt(paramList[4].split("=")[1]);
    if (![0, 1, 2].includes(figure)) {
      console.log(
        'Invalid "figure" URL-parameter! | figure="' +
          figure +
          '" [Valid value = "0", "1" and "2"]'
      );
      mode = 0;
    }
  } else {
    resetSettings();
  }
}

// -_- INITIALIZE -_-
function init() {
  initElements();
  initEventListeners();

  loadImages(); // Load images
  // Call updateTranslations to set the initial language
  const lang = sessionStorage.getItem("lang") || "de"; // Default to German if not set
  updateTranslations(lang);
}

// Initialize elements
function initElements() {
  TLButton = document.getElementById("TLButton");
  RotationButton = document.getElementById("RotationButton"); // Ensure the key matches
  ResetButton = document.getElementById("ResetButton"); // Ensure the key matches
  canvas = document.getElementById("interaction");
  canvContext = canvas.getContext("2d");

  // Set canvas resolution
  canvas.width = window.innerWidth;
  canvas.height = canvas.width / 2; // Alternatively: = window.innerHeight
}

// Initialize event listeners for the buttons
function initEventListeners() {
  TLButton.addEventListener("click", handleTLButtonClick);
  RotationButton.addEventListener("click", handleRotationButtonClick);
  ResetButton.addEventListener("click", handleResetButtonClick);
  canvas.addEventListener("click", handleCanvasClick); // Add click event listener for the canvas
}

// Event handler for canvas click
function handleCanvasClick(event) {
  let currentLang = localStorage.getItem("lang"); //use localstorage.getItem('lang') to get current language
  const rect = canvas.getBoundingClientRect(); // Get the canvas position and size
  const x = event.clientX - rect.left; // Calculate the x position relative to the canvas

  const feedbackMessageElement = document.getElementById("feedbackMessage"); // Get the feedback message element

  // Check if the click was on the left or right half
  if (x < canvas.width / 2 - canvas.width * 0.17) {
    console.log("Left half clicked");
    feedbackMessageElement.textContent =
      languages[currentLang].feedbackIncorrect; // Set to feedbackIncorrect message
  } else {
    console.log("Right half clicked");
    feedbackMessageElement.textContent = languages[currentLang].feedbackCorrect; // Set to feedbackCorrect message
  }
}

// Counters for buttons, tells us what image to draw
let rotationCounter = 0; // Counter for Rotation button (0 to 7)
let tlCounter = 0; // Counter for T -> L button (0 to 15)

// Event handler for T -> L button
function handleTLButtonClick() {
  console.log("T -> L button clicked");
  tlCounter = (tlCounter + 1) % 17; // Increment and reset at 17
  loadImages(); //load new img
  drawImages(); //draw updated img
}

// Event handler for Rotation button
function handleRotationButtonClick() {
  console.log("Rotation button clicked");
  rotationCounter = (rotationCounter + 1) % 7;
  loadImages(); //load new img
  drawImages(); //draw updated img
}

// Event handler for Reset button - just reset counters
function handleResetButtonClick() {
  console.log("Reset button clicked");
  tlCounter = 0;
  rotationCounter = 0;
  loadImages(); //load new img
  drawImages(); //draw updated img
  // Reset the feedback message to the initial instructions
  const lang = sessionStorage.getItem("lang") || "de"; // Get the current language
  document.getElementById("feedbackMessage").textContent =
    languages[lang].instructions; // Set the instructions back
}

//Images
let leftImage = new Image();
let rightImage = new Image();

//Arrays with image src Paths in correct order so that the click counters correspond to the placement
// of the src paths in the array
const leftImages = [
  "/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/DefaultT.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/1L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/2L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/3L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/4L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/5L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/6L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/7L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/8L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/9L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/10L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/11L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/12L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/13L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/14L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/15L.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/AllLs.png", //17 images
];
const rightImages = [
  "/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/DefaultT.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/Rot1.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/Rot2.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/Rot3.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/Rot4.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/Rot5.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/Rot6.png",
"/InteractionsDone-main%20(1)/InteractionsDone-main/resources/interactions/m1u3i1/Rot1.png7",
];

// Load images based on the click counters
function loadImages() {
  leftImage.src = leftImages[tlCounter]; // Load left image based on tlCounter
  rightImage.src = rightImages[rotationCounter]; // Load right image based on rotationCounter

  // Ensure images are drawn only after they are loaded
  leftImage.onload = drawImages;
  rightImage.onload = drawImages;
}

function drawImages() {
  const padding = 20; // Padding between images and edges
  const imageWidth = canvas.width / 2 - padding; // Width of each image
  const imageHeight = canvas.height - 2 * padding; // Height of each image

  // Clear the canvas before drawing
  canvContext.clearRect(0, 0, canvas.width, canvas.height);

  // Draw left image
  canvContext.drawImage(leftImage, padding, padding, imageWidth, imageHeight);

  // Draw right image
  canvContext.drawImage(
    rightImage,
    canvas.width / 2 + padding,
    padding,
    imageWidth,
    imageHeight
  );
}

// Log current version
console.log("<m1u3i1> v1.0.1");
