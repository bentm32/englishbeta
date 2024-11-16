// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// Visitor Counter
const visitorCounterRef = db.ref("visitorCount");
visitorCounterRef.once('value').then((snapshot) => {
    let visitorCount = snapshot.exists() ? snapshot.val() : 0;
    visitorCount++;
    visitorCounterRef.set(visitorCount);
    document.getElementById("visitor-count").textContent = visitorCount;
});

// Canvas Drawing Logic
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

// Support for both mouse and touch events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);

canvas.addEventListener("touchstart", startDrawing, { passive: true });
canvas.addEventListener("touchmove", draw, { passive: true });
canvas.addEventListener("touchend", stopDrawing);

function startDrawing(event) {
    isDrawing = true;
    const { x, y } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(event) {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(event);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}

function getCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
    const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
    return { x, y };
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Submit Content
function submitContent() {
    const message = document.getElementById("message").value;
    const gallery = document.getElementById("gallery");

    // Save canvas as image
    const drawingData = canvas.toDataURL();

    // Save to Firebase
    const submissionsRef = db.ref("submissions");
    const newSubmissionRef = submissionsRef.push();
    newSubmissionRef.set({ drawing: drawingData, message });

    // Display new submission in the gallery
    addToGallery({ drawing: drawingData, message });

    // Clear inputs
    clearCanvas();
    document.getElementById("message").value = "";
}

// Display a submission in the gallery
function addToGallery({ drawing, message }) {
    const gallery = document.getElementById("gallery");

    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";

    if (drawing) {
        const img = document.createElement("img");
        img.src = drawing;
        galleryItem.appendChild(img);
    }

    if (message) {
        const text = document.createElement("p");
        text.textContent = message;
        galleryItem.appendChild(text);
    }

    gallery.appendChild(galleryItem);
}

// Fetch submissions from Firebase and display them
const submissionsRef = db.ref("submissions");
submissionsRef.on("child_added", (snapshot) => {
    const data = snapshot.val();
    addToGallery(data);
});
