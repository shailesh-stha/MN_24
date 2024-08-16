// Initialize the map and set its view to Neuperlach, Munich
var map = L.map('map').setView([48.1048, 11.6463], 13);

// Add the OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Optional: Add a marker at the center point
L.marker([48.1048, 11.6463]).addTo(map)
    .bindPopup('Neuperlach, Munich')
    .openPopup();
