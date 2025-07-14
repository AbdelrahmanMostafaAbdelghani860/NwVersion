const canvas = document.getElementById('interaction');
const ctx = canvas.getContext('2d');

function getCurrentLanguage() {
    return document.documentElement.lang;
    
}
function setLanguage(language) {
    document.documentElement.lang = language; // Sprache des Dokuments setzen
    //updateTextBasedOnLanguage(); // Texte basierend auf der Sprache aktualisieren
}

// functions for accessing css values
function getDefaultShapeColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-shape-color");
}
function getDefaultBGColor() {
    return window.getComputedStyle(canvas).getPropertyValue("--default-bg-color");
}



const imagePaths = {
    view1: ["../resources/interactions/m2u4i1/Le_v1.png", "../resources/interactions/m2u4i1/Cv_v1.png", "../resources/interactions/m2u4i1/Re_v1.png"],
    view2: ["../resources/interactions/m2u4i1/Le_v2.png", "../resources/interactions/m2u4i1/Cv_v2.png", "../resources/interactions/m2u4i1/Re_v2.png"],
    view3: ["../resources/interactions/m2u4i1/Le_v3.png", "../resources/interactions/m2u4i1/Cv_v3.png", "../resources/interactions/m2u4i1/Re_v3.png"],
    view4: ["../resources/interactions/m2u4i1/Le_v4.png", "../resources/interactions/m2u4i1/Cv_v4.png", "../resources/interactions/m2u4i1/Re_v4.png"],
    view5: ["../resources/interactions/m2u4i1/Le_v5.png", "../resources/interactions/m2u4i1/Cv_v5.png", "../resources/interactions/m2u4i1/Re_v5.png"]
};

function loadImages(view) {
     const paths = imagePaths[view];
     const images = [];

 
     paths.forEach((path, index) => {
         const img = new Image();
         img.src = path;
 
         img.onload = () => {
             // Position der Bilder im Canvas
             const x = index * (canvas.width / 3); // Links, Mitte, Rechts
             const y = 0;
             const width = canvas.width / 3;
             const height = canvas.height - 3;
 
             ctx.drawImage(img, x, y, width, height);
         };
 
         images.push(img);
     });

     updateTextBasedOnLanguage();
            
}

function updateTextBasedOnLanguage() {
    const currentLanguage = document.documentElement.lang; // Vermeide Rekursion
    const langDict = languages[currentLanguage];

    if (!langDict) {
        console.error("Fehler: Sprachwörterbuch nicht gefunden für Sprache:", currentLanguage);
        return;
    }

    document.getElementById('leftEyeText').textContent = langDict['leftEye'];
    document.getElementById('centralViewText').textContent = langDict['centralView'];
    document.getElementById('rightEyeText').textContent = langDict['rightEye'];
}

// Variable zum Speichern des aktuell aktiven Buttons
let activeButton = null;

// Funktion zum Laden von Bildern und Setzen der Button-Markierung
function handleButtonClick(view, buttonId) {
    console.log("Button geklickt:", buttonId); // DEBUG: Prüfen, ob Klick erkannt wird

    loadImages(view);
    updateTextBasedOnLanguage();

    // Falls ein anderer Button aktiv war, entferne die Markierung
    if (activeButton) {
        console.log("Vorheriger aktiver Button:", activeButton.id); // DEBUG
        activeButton.style.backgroundColor = ""; // Standard-Hintergrundfarbe zurücksetzen
        activeButton.style.color = ""; // Standard-Schriftfarbe zurücksetzen
        activeButton.style.border = ""; // Standard-Rand zurücksetzen
    }

    // Neuen aktiven Button markieren
    activeButton = document.getElementById(buttonId);

    if (!activeButton) {
        console.error("Fehler: Button nicht gefunden", buttonId); // DEBUG: Falls das Element nicht existiert
        return;
    }

    console.log("Neuer aktiver Button:", activeButton.id); // DEBUG

    activeButton.style.backgroundColor = "blue"; // Hintergrund auf Blau setzen
    activeButton.style.color = "white"; // Schriftfarbe auf Weiß setzen
    activeButton.style.border = "2px solid darkblue"; // Rand anpassen
}

// Event-Listener für die Buttons hinzufügen
document.getElementById('one').addEventListener('click', () => handleButtonClick('view1', 'one'));
document.getElementById('two').addEventListener('click', () => handleButtonClick('view2', 'two'));
document.getElementById('three').addEventListener('click', () => handleButtonClick('view3', 'three'));
document.getElementById('four').addEventListener('click', () => handleButtonClick('view4', 'four'));
document.getElementById('five').addEventListener('click', () => handleButtonClick('view5', 'five'));




