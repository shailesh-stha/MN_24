// Create individual layer groups for each GeoJSON file
var childILayer = L.layerGroup();
var childIILayer = L.layerGroup();
var childIIILayer = L.layerGroup();
var childIVLayer = L.layerGroup();

// Function to load and add a GeoJSON file to a specific layer group with a specified color
function addGeoJSONToLayer(geojsonPath, layerGroup, color) {
    fetch(geojsonPath)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function () {
                    return { color: color };
                }
            }).addTo(layerGroup);
        })
        .catch(error => console.error('Error loading the GeoJSON file:', error));
}

// Load and add the GeoJSON files to the respective layer groups with specified colors
addGeoJSONToLayer('./data/geojson/child_i.geojson', childILayer, 'blue');
addGeoJSONToLayer('./data/geojson/child_ii.geojson', childIILayer, 'green');
addGeoJSONToLayer('./data/geojson/child_iii.geojson', childIIILayer, 'red');
addGeoJSONToLayer('./data/geojson/child_iv.geojson', childIVLayer, 'yellow');

// Create an object to hold the layer groups with descriptive names
var overlayMaps = {
    "Child I": childILayer,
    "Child II": childIILayer,
    "Child III": childIIILayer,
    "Child IV": childIVLayer,
};

// Create an object to hold the base layers
var baseMaps = {
    "OpenStreetMap": OpenStreetMap,
    "OpenStreetMap_DE": OpenStreetMap_DE
};

// Add layer control to the map with both base layers and overlay layers
L.control.layers(baseMaps, overlayMaps).addTo(map);
