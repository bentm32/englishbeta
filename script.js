import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqz7fjMJVd1lstR-sdTgd-sS1YUui3pN0",
    authDomain: "englishproject-810af.firebaseapp.com",
    projectId: "englishproject-810af",
    storageBucket: "englishproject-810af.firebasestorage.app",
    messagingSenderId: "958433136274",
    appId: "1:958433136274:web:f7574ec8e517451269204b",
    measurementId: "G-N1J6SFJV5E"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const visitCountRef = database.ref('visitCount');

// Function to update stick figures
function updateStickFigures(count) {
    const container = document.getElementById('stick-figure-container');
    container.innerHTML = ''; // Clear previous stick figures

    for (let i = 0; i < count; i++) {
        const stickFigure = document.createElement('div');
        stickFigure.classList.add('stick-figure');
        container.appendChild(stickFigure);
    }
}

// Increment visit count on page load
visitCountRef.transaction(count => {
    if (count === null) {
        return 1;
    } else {
        return count + 1;
    }
}).then(result => {
    const newCount = result.snapshot.val();
    updateStickFigures(newCount);
}).catch(error => {
    console.error("Error updating visit count:", error);
});


// Example script.js file
function addStickFigure(count) {
    // Adding stick figure to Firebase database
    firebase.database().ref('stickFigures/' + count).set({
        name: "stick figure " + count
    });
}

// Example to trigger the addStickFigure function
let count = 0;
document.getElementById('stick-figure-container').innerHTML += `<div>Stick Figure ${count}</div>`;
count++;  // Increment count for the next figure
