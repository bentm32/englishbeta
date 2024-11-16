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
  
// Initialize canvas and context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Function to get the touch/mouse position on the canvas
function getPosition(e) {
    const canvasRect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - canvasRect.left;
    const y = (e.clientY || e.touches[0].clientY) - canvasRect.top;
    return { x, y }; // No scaling needed here
}

// Consolidate touch and mouse event listeners
function startDrawing(e) {
    e.preventDefault(); // Prevent default action (scroll, zoom, etc.)
    isDrawing = true;
    const { x, y } = getPosition(e);
    lastX = x;
    lastY = y;
}

function draw(e) {
    if (!isDrawing) return;
    const { x, y } = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
}

function stopDrawing() {
    isDrawing = false;
}

// Attach event listeners for both mouse and touch events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Adjust canvas size for high-DPI screens
function resizeCanvas() {
    const scaleFactor = window.devicePixelRatio || 1; // For high DPI screens
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set canvas CSS size to match the display size
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Set the canvas drawing buffer size (scaled for high-DPI)
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    // Apply the scaling factor to the context to maintain consistent drawing
    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
}

// Call resizeCanvas on load and window resize
window.onload = resizeCanvas;
window.onresize = resizeCanvas;




