// Firebase reference for storing and retrieving stick figures
const stickFigureRef = firebase.database().ref('stickFigures');
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const submitButton = document.getElementById('submitDrawing');
const stickFigureContainer = document.getElementById('stick-figure-container');

// Initialize the drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Start drawing on mouse down
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

// Draw on mouse move
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

// Stop drawing on mouse up
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Clear the canvas
document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Handle submit button click
submitButton.addEventListener('click', () => {
    // Convert canvas drawing to an image (data URL)
    const drawingDataUrl = canvas.toDataURL();

    // Save the drawing to Firebase
    stickFigureRef.push({
        imageUrl: drawingDataUrl
    }).then(() => {
        // Create an image element for the new drawing
        const stickFigure = document.createElement('img');
        stickFigure.src = drawingDataUrl;
        stickFigure.classList.add('stick-figure'); // Add styling class

        // Append the new image to the container
        stickFigureContainer.appendChild(stickFigure);

        // Clear the canvas after submitting
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});

// Function to display all stick figures from Firebase when the page loads
function loadStickFigures() {
    stickFigureRef.once('value', (snapshot) => {
        const drawings = snapshot.val();
        if (drawings) {
            for (let key in drawings) {
                const stickFigureData = drawings[key];
                const stickFigure = document.createElement('img');
                stickFigure.src = stickFigureData.imageUrl;
                stickFigure.classList.add('stick-figure');
                stickFigureContainer.appendChild(stickFigure);
            }
        }
    });
}

// Call the function to load stick figures on page load
loadStickFigures();
