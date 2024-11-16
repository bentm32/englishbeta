// Initialize Particle.js background effect
particlesJS('particles-js', {
    particles: {
      number: {
        value: 100, // Number of particles
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff" // Particle color (white)
      },
      shape: {
        type: "circle", // Shape of particles
        stroke: {
          width: 0,
          color: "#000000"
        }
      },
      opacity: {
        value: 0.5, // Particle opacity
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1
        }
      },
      size: {
        value: 3, // Particle size
        anim: {
          enable: true,
          speed: 40,
          size_min: 0.1
        }
      },
      line_linked: {
        enable: true,
        distance: 150, // Line distance between particles
        color: "#ffffff", // Line color
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse" // Repulse on hover
        },
        onclick: {
          enable: true,
          mode: "push" // Add new particles on click
        }
      }
    },
    retina_detect: true
  });
  
 // Get canvas element and set up drawing context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Adjusted variables for drawing
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Calculate the position of the canvas within the document
const canvasOffset = canvas.getBoundingClientRect();

// Start drawing when mouse is pressed
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.clientX - canvasOffset.left; // Adjust for canvas position
    lastY = e.clientY - canvasOffset.top;  // Adjust for canvas position
});

// Draw while mouse is moving
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const currentX = e.clientX - canvasOffset.left; // Adjust for canvas position
    const currentY = e.clientY - canvasOffset.top;  // Adjust for canvas position
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
        // Clear the canvas after submitting
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});

// Resize canvas dynamically based on window size
function resizeCanvas() {
    const width = window.innerWidth * 0.9; // 90% of the window width
    const height = window.innerHeight * 0.4; // 40% of the window height
    canvas.width = width;
    canvas.height = height;
}

// Call resizeCanvas on load and window resize
window.onload = resizeCanvas;
window.onresize = resizeCanvas;
