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
  
// Initialize canvas drawing logic
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function getPosition(e) {
    const canvasRect = canvas.getBoundingClientRect();
    const scaleFactor = window.devicePixelRatio;

    // For touch events, use touches[0]
    const x = (e.touches[0].clientX - canvasRect.left) * scaleFactor;
    const y = (e.touches[0].clientY - canvasRect.top) * scaleFactor;

    return { x, y };
}


// Modify the event listeners to track touch positions correctly
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const { x, y } = getPosition(e);
    isDrawing = true;
    lastX = x;
    lastY = y;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getPosition(e);
    draw(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
});


// Start drawing when mouse or touch starts
function startDrawing(e) {
    e.preventDefault(); // Prevent default action (scroll, zoom, etc.)
    isDrawing = true;
    const { x, y } = getPosition(e);
    lastX = x;
    lastY = y;
}

// Draw while mouse or touch moves
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

// Stop drawing when mouse or touch ends
function stopDrawing(e) {
    isDrawing = false;
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

// Touch events (for mobile)
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Clear canvas
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

  
function resizeImageForMobile(imageUrl, maxWidth, maxHeight) {
    const img = new Image();
    img.src = imageUrl;

    return new Promise((resolve) => {
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Maintain aspect ratio while scaling
            const aspectRatio = img.width / img.height;
            let width = maxWidth;
            let height = maxHeight;

            if (img.width > img.height) {
                height = width / aspectRatio;
            } else {
                width = height * aspectRatio;
            }

            // Increase max size for mobile for a better display
            width = Math.min(width, maxWidth * 1.5);
            height = Math.min(height, maxHeight * 1.5);

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL()); // Return the resized image as a data URL
        };
    });
}




// Use resizeImageForMobile when adding images to the UI
function updateStickFigures() {
    const stickFigureContainer = document.getElementById('stick-figure-container');
    
    const stickFiguresRef = firebase.database().ref('stickFigures');
    stickFiguresRef.on('child_added', async (snapshot) => {
        const stickFigureData = snapshot.val();
        if (stickFigureData && stickFigureData.imageUrl) {
            const imgElement = document.createElement('img');

            // Resize the image for mobile display
            const resizedImageUrl = await resizeImageForMobile(stickFigureData.imageUrl, window.innerWidth * 0.8, window.innerHeight * 0.3);
            imgElement.src = resizedImageUrl;
            imgElement.classList.add('stick-figure');
            stickFigureContainer.appendChild(imgElement);
        }
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

// Adjust canvas size and high-DPI scaling
// Resize canvas to adapt to screen size
function resizeCanvas() {
    const scaleFactor = window.devicePixelRatio; // For high DPI screens
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set canvas CSS size to the actual width and height
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set the canvas drawing buffer size (scaled for high-DPI)
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    // Get the 2d context and scale for high DPI
    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
}


// Call resizeCanvas on load and window resize
window.onload = resizeCanvas;
window.onresize = resizeCanvas;



