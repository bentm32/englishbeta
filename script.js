// Firebase Realtime Database interaction (using Firebase v8.x)

// Example function to update stick figures
function updateStickFigures(count) {
    const container = document.getElementById('stick-figure-container');
    container.innerHTML = ''; // Clear previous stick figures

    // Loop to create and append images
    for (let i = 0; i < count; i++) {
        const stickFigure = document.createElement('img');
        stickFigure.classList.add('stick-figure');
        stickFigure.src = 'stick-figure.jpg'; // Path to your image

        // Append the image to the container
        container.appendChild(stickFigure);
    }
}

// Reference to the 'visitCount' in Firebase database
var visitCountRef = firebase.database().ref('visitCount');

// Increment the visit count every time the page loads
visitCountRef.transaction(count => {
    if (count === null) {
        return 1; // If no visits, set to 1
    } else {
        return count + 1; // Otherwise, increment the count
    }
}).then(result => {
    const newCount = result.snapshot.val();
    updateStickFigures(newCount);
}).catch(error => {
    console.error("Error updating visit count:", error);
});

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
