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

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Get the canvas's offset relative to the page
const canvasRect = canvas.getBoundingClientRect();

// Start drawing when mouse is pressed
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.clientX - canvasRect.left; // Correct offset calculation
    lastY = e.clientY - canvasRect.top;
});

// Draw while mouse is moving
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const currentX = e.clientX - canvasRect.left; // Correct offset calculation
    const currentY = e.clientY - canvasRect.top;
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

  
  // Function to update and display all stick figures from Firebase
  function updateStickFigures() {
      const stickFigureContainer = document.getElementById('stick-figure-container');
  
      // Get all stick figures from Firebase
      const stickFiguresRef = firebase.database().ref('stickFigures');
      stickFiguresRef.on('child_added', (snapshot) => {
          const stickFigureData = snapshot.val();
          if (stickFigureData && stickFigureData.imageUrl) {
              const imgElement = document.createElement('img');
              imgElement.src = stickFigureData.imageUrl;
              imgElement.classList.add('stick-figure');
              stickFigureContainer.appendChild(imgElement);
          }
      });
  
      // Optional: Listen for changes if you want to update dynamically
      stickFiguresRef.on('child_changed', (snapshot) => {
          const stickFigureData = snapshot.val();
          // Handle updated data if needed
      });
  }
  
  // Initial call to load existing stick figures
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
  
// Dynamically set the canvas size based on window width
function resizeCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    const width = window.innerWidth * 0.9; // 90% of the window width
    const height = window.innerHeight * 0.4; // 40% of the window height

    canvas.width = width;
    canvas.height = height;
}

// Call resizeCanvas on load and window resize
window.onload = resizeCanvas;
window.onresize = resizeCanvas;


