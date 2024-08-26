import { addFullscreenControl, addScaleBar, addCoordDisplay, addNorthArrowControl, addGeoJSONToLayer } from "./leafletFunctions.js";
import { geotiffUrlByRegion, geojsonBuildingUrlByRegion } from "./geotiffUrl.js";
import { plotGraph } from "./plotlyFunctions.js";

let initialViewState = [48.10413, 11.6494, 15.2]

const map = L.map("map", {
  zoomDelta: 0.2,
  zoomSnap: 0.2,
  wheelPxPerZoomLevel: 150,
  center: [initialViewState[0], initialViewState[1]],
  zoom: initialViewState[2],
});

const OpenStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const OpenStreetMap_DE = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

addFullscreenControl(map);
addNorthArrowControl(map);
addScaleBar(map);
addCoordDisplay(map);

// var baseLayers = {
//   "OSM": OpenStreetMap,
//   "OSM_DE": OpenStreetMap_DE
// };

// // Create the layer control with the autoZIndex option
// L.control.layers(baseLayers, null, {
//   autoZIndex: true // or false
// }).addTo(map);

// Define variables
let urlToGeoTiffFile, urlToGeojsonFile, currentLayer, currentLegend, currentBuildingLayer;
let timeSlider = document.getElementById('time-slider');
let sliderValue = document.querySelector('.slider-value');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateTimeValue(timeSlider.value);
  updateGeoTiffGeojsonUrl();
});
// Event listeners
document.getElementById('variableSelector').addEventListener('change', updateGeoTiffGeojsonUrl);
document.getElementById('locationSelector').addEventListener('change', updateGeoTiffGeojsonUrl);
// Event listener for time slider change
timeSlider.addEventListener('change', function() {
  updateTimeValue(timeSlider.value);
  updateGeoTiffLayer();
});
// Event listener for keydown events
document.addEventListener('keydown', function(event) {
  if (event.key === 'r' || event.key === 'R') {
    map.setView([initialViewState[0], initialViewState[1]], initialViewState[2]);
  }
  if (event.code === 'Space') {
    map.fitBounds(currentLayer.getBounds());
  }
});

// Update the displayed time value and slider background
function updateTimeValue(value) {
  const hours = value.padStart(2, '0');
  sliderValue.textContent = `${hours}:00`;
  const percentage = (value / 24) * 100;
  timeSlider.style.background = `linear-gradient(to right, #ff39b5 ${percentage}%, #ffeb3b ${percentage}%)`;
}

// Update the selected GeoTIFF URL based on the dropdown selection
function updateGeoTiffGeojsonUrl() {
  let selectedVariableValue = document.getElementById('variableSelector').value;
  let selectedLocationValue = document.getElementById('locationSelector').value;
  urlToGeoTiffFile = geotiffUrlByRegion[selectedLocationValue][selectedVariableValue];
  urlToGeojsonFile = geojsonBuildingUrlByRegion[selectedLocationValue];

  if (!urlToGeoTiffFile) {
      console.error('GeoTIFF URL is undefined.');
      return;
  }
  fetch(urlToGeoTiffFile).then((response) => {
      if (!response.ok) {
          throw new Error(`Failed to fetch GeoTIFF from ${urlToGeoTiffFile}`);
      }
      return response.arrayBuffer();
  })
  .then(arrayBuffer => parseGeoraster(arrayBuffer))
  .then(georaster => {
      const nodataValue = georaster.noDataValue;
      const meanValuesList = [];

      for (let band = 0; band <= 24; band++) {
          let bandSum = 0;
          let bandValidPixelCount = 0;

          for (let y = 0; y < georaster.height; y++) {
              for (let x = 0; x < georaster.width; x++) {
                  const pixelValue = georaster.values[band][y][x];
                  if (pixelValue !== nodataValue) {
                      bandSum += pixelValue;
                      bandValidPixelCount++;
                  }
              }
          }
          const bandMeanValue = bandValidPixelCount > 0 ? bandSum / bandValidPixelCount : null;
          meanValuesList.push(bandMeanValue);
      }
      // Call the plotGraph function and pass the necessary data
      plotGraph(meanValuesList, selectedVariableValue);
  });
  updateGeoTiffLayer();
}

// Update the GeoTIFF layer dynamically
function updateGeoTiffLayer() {
  if (!urlToGeoTiffFile) {
    console.error('Cannot load GeoTIFF. The URL is undefined.');
    return;
  }
  const bandNumber = Number(timeSlider.value);
  loadGeoTiffToMap(urlToGeoTiffFile, bandNumber).then((layer) => {
    if (map.hasLayer(currentLayer)) {
      map.removeLayer(currentLayer);
    }
    currentLayer = layer;
    currentLayer.addTo(map);

    // Remove the existing building layer from the map if it exists
    if (currentBuildingLayer) {
      map.removeLayer(currentBuildingLayer);
    }
    // Add a new building geojson layer
    currentBuildingLayer = L.layerGroup();
    addGeoJSONToLayer(urlToGeojsonFile, currentBuildingLayer, "#ffffff", "#aaaaaa");
    currentBuildingLayer.addTo(map);
    // map.fitBounds(currentLayer.getBounds());
  }).catch(error => {
    console.error('Error loading GeoTIFF:', error);
  });
}

// Fetch and parse a GeoTIFF file, returning a GeoRasterLayer
function loadGeoTiffToMap(url, bandNumber) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch GeoTIFF from ${url}`);
      }
      return response.arrayBuffer();
    })
    .then(arrayBuffer => parseGeoraster(arrayBuffer))
    .then(georaster => {
      const nodataValue = georaster.noDataValue;
      let minValue = Infinity;
      let maxValue = -Infinity;
      let values = [];
      let sum = 0;
      let validPixelCount = 0;

      // Calculate min, max, and mean values for the specified bandNumber
      for (let y = 0; y < georaster.height; y++) {
        for (let x = 0; x < georaster.width; x++) {
          const pixelValue = georaster.values[bandNumber][y][x];
          if (pixelValue !== nodataValue) {
            minValue = Math.min(minValue, pixelValue);
            maxValue = Math.max(maxValue, pixelValue);
            sum += pixelValue;
            validPixelCount++;
            values.push(pixelValue);
          }
        }
      }
      // Sort the values to calculate percentiles
      values.sort((a, b) => a - b);
      // Calculate the 5th and 95th percentiles
      const getPercentileValue = (percentile) => {
        const index = Math.floor(percentile * values.length / 100);
        return values[index];
      };

      const meanValue = validPixelCount > 0 ? sum / validPixelCount : null;
      const min5thPercentile = Math.floor(getPercentileValue(10));
      const max95thPercentile = Math.ceil(getPercentileValue(85));
      minValue = min5thPercentile;
      maxValue = max95thPercentile;

      // minValue = 18;
      // maxValue = 36;
      console.log(minValue, maxValue)

      const colors = ['#0000FF','#3333FF','#6666FF','#9999FF','#CCCCFF','#FFFF00','#FFCC00','#FF9900','#FF6600','#FF0000'];

      const colorsOld = ["darkblue", "blue", "cyan", "lightgreen", "green", "yellowgreen", "yellow", "orange", "orangered", "red"];
      const colorsPET = ['#36b3d3', '#9bcdfe', '#afed00', '#ffff01', '#ffcb01', '#fe9900', '#fe0002']
      const colorMappingPET = [0, 13, 18, 23, 29, 35, 41]
      const colorsUTCI = ['#66ffff', '#93d150', '#ffc100', '#ff9932', '#ff3200', '#bf0000']
      const colorMappingUTCI = [0, 9, 26, 32, 38, 46]
      
      const colorMapping = [];
      const legendGrades = [];
      const interval = (maxValue - minValue) / colors.length;

      
      for (let i = 0; i < colors.length; i++) {
        const currentMin = minValue + i * interval;
        const currentMax = currentMin + interval;
        colorMapping.push({
          min: currentMin,
          max: i === (colors.length-1) ? Infinity : currentMax,
          color: colors[i % colors.length],
        });
        legendGrades.push(currentMin);
      }

      if (currentLegend) {
        map.removeControl(currentLegend);
      }
      currentLegend = L.control({ position: 'bottomright' });
      // Creating the legend
      currentLegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
          grades = legendGrades,
          labels = [];
        // Loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i].toFixed(2) + (grades[i + 1] ? '&ndash;' + grades[i + 1].toFixed(2) + ' °C<br>' : '+ °C');
        }
        return div;
      };
      currentLegend.addTo(map);

      return new GeoRasterLayer({
        georaster,
        opacity: 1,
        pixelValuesToColorFn: (values) => {
          const bandValue = values[bandNumber];
          if (bandValue === nodataValue) return null; // 'purple'; // Assign purple color to no data values
      
          if (bandValue < minValue) {
            return colors[0]; // Apply the lowest color if bandValue < minValue
          }
          if (bandValue > maxValue) {
            return colors[colors.length - 1]; // Apply the highest color if bandValue > maxValue
          }
      
          for (const range of colorMapping) {
            if (bandValue >= range.min && bandValue < range.max) {
              return range.color;
            }
          }
          return null;
        },
        resolution: 256,
      });
    })
    .catch(error => console.error("Error loading GeoTIFF:", error));
}