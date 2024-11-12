// Firebase Realtime Database interaction (using Firebase v8.x)

// Example function to update stick figures
function updateStickFigures(count) {
    const container = document.getElementById('stick-figure-container');
    container.innerHTML = ''; // Clear previous stick figures

    for (let i = 0; i < count; i++) {
        const stickFigure = document.createElement('div');
        stickFigure.classList.add('stick-figure');
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

// Example to add a stick figure to Firebase
let count = 0;
document.getElementById('stick-figure-container').innerHTML += `<div>Stick Figure ${count}</div>`;
count++;  // Increment count for the next figure
