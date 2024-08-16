// Function to draw the selected shape
function drawShape() {
    const shapeSelector = document.getElementById('shapeSelector');
    const shapeContainer = document.getElementById('shapeContainer');

    // Clear previous shape
    shapeContainer.innerHTML = '';

    // Get the selected value
    const selectedValue = shapeSelector.value;

    // Create the appropriate shape based on the selected value
    let shapeElement;
    if (selectedValue === '1') {
        // Draw Circle
        shapeElement = document.createElement('div');
        shapeElement.className = 'circle';
    } else if (selectedValue === '2') {
        // Draw Rectangle
        shapeElement = document.createElement('div');
        shapeElement.className = 'rectangle';
    } else if (selectedValue === '3') {
        // Draw Triangle
        shapeElement = document.createElement('div');
        shapeElement.className = 'triangle';
    }

    // Append the shape to the container
    shapeContainer.appendChild(shapeElement);
}

// Ensure the shape is drawn when the page loads
document.addEventListener('DOMContentLoaded', drawShape);
