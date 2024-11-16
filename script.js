// Visitor Counter (simulated with localStorage)
const visitorCount = localStorage.getItem("visitorCount") || 1;
document.getElementById("visitor-count").textContent = visitorCount;
localStorage.setItem("visitorCount", parseInt(visitorCount) + 1);

// Canvas Drawing Logic
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

canvas.addEventListener("mousedown", () => (isDrawing = true));
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
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

    // Create gallery item
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";

    if (drawingData) {
        const img = document.createElement("img");
        img.src = drawingData;
        galleryItem.appendChild(img);
    }

    if (message) {
        const text = document.createElement("p");
        text.textContent = message;
        galleryItem.appendChild(text);
    }

    gallery.appendChild(galleryItem);

    // Clear inputs
    clearCanvas();
    document.getElementById("message").value = "";
}
