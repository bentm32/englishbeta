// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqz7fjMJVd1lstR-sdTgd-sS1YUui3pN0",
    authDomain: "englishproject-810af.firebaseapp.com",
    databaseURL: "https://englishproject-810af-default-rtdb.firebaseio.com",
    projectId: "englishproject-810af",
    storageBucket: "englishproject-810af.firebasestorage.app",
    messagingSenderId: "958433136274",
    appId: "1:958433136274:web:f7574ec8e517451269204b",
    measurementId: "G-N1J6SFJV5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Visitor Counter
const visitorCounterRef = ref(db, "visitorCount");
get(visitorCounterRef).then((snapshot) => {
    let visitorCount = snapshot.exists() ? snapshot.val() : 0;
    visitorCount++;
    set(visitorCounterRef, visitorCount);
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
    const submissionsRef = ref(db, "submissions");
    const newSubmissionRef = push(submissionsRef);
    set(newSubmissionRef, { drawing: drawingData, message });

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
const submissionsRef = ref(db, "submissions");
onValue(submissionsRef, (snapshot) => {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // Clear existing gallery
    snapshot.forEach((childSnapshot) => {
        addToGallery(childSnapshot.val());
    });
});
