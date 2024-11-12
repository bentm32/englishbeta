// Firebase Realtime Database interaction (using Firebase v8.x)

// Example function to update stick figures
function updateStickFigures(count) {
    const container = document.getElementById('stick-figure-container');
    container.innerHTML = ''; // Clear previous stick figures

    for (let i = 0; i < count; i++) {
        const stickFigure = document.createElement('div');
        stickFigure.classList.add('stick-figure');

        // Create a head (circle)
        const head = document.createElement('div');
        head.classList.add('head');
        stickFigure.appendChild(head);

        // Create the body (line)
        const body = document.createElement('div');
        body.classList.add('body');
        stickFigure.appendChild(body);

        // Create arms (lines)
        const leftArm = document.createElement('div');
        leftArm.classList.add('left-arm');
        stickFigure.appendChild(leftArm);
        const rightArm = document.createElement('div');
        rightArm.classList.add('right-arm');
        stickFigure.appendChild(rightArm);

        // Create legs (lines)
        const leftLeg = document.createElement('div');
        leftLeg.classList.add('left-leg');
        stickFigure.appendChild(leftLeg);
        const rightLeg = document.createElement('div');
        rightLeg.classList.add('right-leg');
        stickFigure.appendChild(rightLeg);

        // Append the figure to the container
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
