// Firebase Realtime Database interaction (using Firebase v8.x)

// Example function to display stick figures stored in Firebase
function updateStickFigures() {
    const container = document.getElementById('stick-figure-container');
    container.innerHTML = ''; // Clear previous stick figures

    // Reference to the 'stickFigures' in Firebase database
    const stickFigureRef = firebase.database().ref('stickFigures');
    
    stickFigureRef.once('value', (snapshot) => {
        const drawings = snapshot.val();
        if (drawings) {
            for (let key in drawings) {
                const stickFigureData = drawings[key];
                const stickFigure = document.createElement('img');
                stickFigure.src = stickFigureData.imageUrl;
                stickFigure.classList.add('stick-figure');
                container.appendChild(stickFigure);
            }
        }
    });
}

// Get canvas element and set up drawing context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Start drawing when mouse is pressed
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

// Draw while mouse is moving
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    lastX = currentX;
    lastY = currentY;
});

// Stop drawing when mouse is released
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Optionally, clear the canvas
document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Handle submit button click
const submitButton = document.getElementById('submitDrawing');
submitButton.addEventListener('click', () => {
    const drawingDataUrl = canvas.toDataURL(); // Convert canvas to image

    // Save to Firebase
    const stickFigureRef = firebase.database().ref('stickFigures');
    stickFigureRef.push({ imageUrl: drawingDataUrl }).then(() => {
        // Create an image element for the new drawing
        const stickFigure = document.createElement('img');
        stickFigure.src = drawingDataUrl;
        stickFigure.classList.add('stick-figure');

        // Append the new image to the container
        document.getElementById('stick-figure-container').appendChild(stickFigure);

        // Clear the canvas after submitting
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});

// Load and display all stored drawings from Firebase
updateStickFigures();

// Firebase configuration and initialization
var firebaseConfig = {
    apiKey: "AIzaSyBqz7fjMJVd1lstR-sdTgd-sS1YUui3pN0",
    authDomain: "englishproject-810af.firebaseapp.com",
    databaseURL: "https://englishproject-810af-default-rtdb.firebaseio.com",
    projectId: "englishproject-810af",
    storageBucket: "englishproject-810af.firebasestorage.app",
    messagingSenderId: "958433136274",
    appId: "1:958433136274:web:f7574ec8e517451269204b",
    measurementId: "G-N1J6SFJV5E"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
