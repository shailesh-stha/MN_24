var crs = new L.Proj.CRS(
  "EPSG:25832",
  "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs",
  {
    origin: [-1200000.0, 10000000.0],
    resolutions: [
      8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25,
    ],
    bounds: L.bounds([300000, 5200000], [1050000, 6100000]), // Approximate bounds for Germany in EPSG:25832
  }
);

const map = L.map("map", {
  crs: crs,
  zoomDelta: 0.2,
  zoomSnap: 0.2,
  wheelPxPerZoomLevel: 150,
  center: [48.10413, 11.6494],
  zoom: 11.4,
});

// Add a WMS layer that supports EPSG:25832
L.tileLayer
  .wms("https://ows.terrestris.de/osm/service?", {
    layers: "OSM-WMS",
    format: "image/png",
    transparent: true,
    crs: crs,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  })
  .addTo(map);

// var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
//   layers: 'TOPO-OSM-WMS'
// }).addTo(map);

// var topographyAndPlaces = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
//   layers: 'TOPO-WMS,OSM-Overlay-WMS'
// }).addTo(map);

// Create individual layer groups for each GeoJSON file
var childILayer = L.layerGroup();
var childIILayer = L.layerGroup();
var childIIILayer = L.layerGroup();
var childIVLayer = L.layerGroup();

// Function to load and add a GeoJSON file to a specific layer group with a specified color
function addGeoJSONToLayer(geojsonPath, layerGroup, color) {
  fetch(geojsonPath)
    .then((response) => response.json())
    .then((data) => {
      L.geoJSON(data, {
        style: function () {
          return { color: color };
        },
      }).addTo(layerGroup);
    })
    .catch((error) => console.error("Error loading the GeoJSON file:", error));
}

// Load and add the GeoJSON files to the respective layer groups with specified colors
addGeoJSONToLayer("./data/geojson/child_i.geojson", childILayer, "blue");
addGeoJSONToLayer("./data/geojson/child_ii.geojson", childIILayer, "green");
addGeoJSONToLayer("./data/geojson/child_iii.geojson", childIIILayer, "red");
addGeoJSONToLayer("./data/geojson/child_iv.geojson", childIVLayer, "yellow");

// Create an object to hold the layer groups with descriptive names
var overlayMaps = {
  "Child I": childILayer,
  "Child II": childIILayer,
  "Child III": childIIILayer,
  "Child IV": childIVLayer,
};

// Create an object to hold the base layers
var baseMaps = {
  OpenStreetMap: OpenStreetMap,
  OpenStreetMap_DE: OpenStreetMap_DE,
};

// Add layer control to the map with both base layers and overlay layers
L.control.layers(baseMaps, overlayMaps).addTo(map);
