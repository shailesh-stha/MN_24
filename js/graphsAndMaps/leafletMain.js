import { addFullscreenControl, addNorthArrowControl } from "./leafletFunctions.js";
import { geotiffUrl } from "./geotiffUrl.js";
import { plotGraph } from "./plotlyFunctions.js";

// Initialize the map
const map = L.map("map", {
  zoomDelta: 0.2,
  zoomSnap: 0.2,
  wheelPxPerZoomLevel: 150}
).setView([48.10413, 11.6494], 15.2);

addFullscreenControl(map);
addNorthArrowControl(map);

// Add basemap
const OpenStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Event listeners
document.getElementById('variableSelector').addEventListener('change', updateGeoTiffUrl);
document.getElementById('locationSelector').addEventListener('change', updateGeoTiffUrl);
document.addEventListener('DOMContentLoaded', function() {
  updateTimeValue(timeSlider.value);
  updateGeoTiffUrl();
});
// Event listener for keydown events
document.addEventListener('keydown', function(event) {
  if (event.key === 'r' || event.key === 'R') {
    map.setView([48.10413, 11.6494], 15.2);
  }
  if (event.code === 'Space') {
    map.fitBounds(currentLayer.getBounds());
  }
});

// Define variables
let urlToGeoTiffFile, currentLayer, currentLegend;
let timeSlider = document.getElementById('time-slider');
let sliderValue = document.querySelector('.slider-value');

// Update the selected GeoTIFF URL based on the dropdown selection
function updateGeoTiffUrl() {
  let selectedVariableValue = document.getElementById('variableSelector').value;
  let selectedLocationvalue = document.getElementById('locationSelector').value;
  urlToGeoTiffFile = geotiffUrl[selectedLocationvalue][selectedVariableValue];

  if (selectedVariableValue == "airTempProjBS") {
      var yaxis_range = [18, 36];
  } else if (selectedVariableValue == "tsurfProjBS") {
      var yaxis_range = [288, 322];
  } else if (selectedVariableValue == 'bioPETProjBS') {
      var yaxis_range = [16, 40];
  } else if (selectedVariableValue == 'bioUTCIProjBS') {
      var yaxis_range = [18, 36];
  }
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
      plotGraph(meanValuesList, yaxis_range);
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
    // map.fitBounds(currentLayer.getBounds());
  }).catch(error => {
    console.error('Error loading GeoTIFF:', error);
  });
}

// Update the displayed time value and slider background
function updateTimeValue(value) {
  const hours = value.padStart(2, '0');
  sliderValue.textContent = `${hours}:00`;
  const percentage = (value / 24) * 100;
  timeSlider.style.background = `linear-gradient(to right, #ff39b5 ${percentage}%, #ffeb3b ${percentage}%)`;
}

// Event listener for time slider change
timeSlider.addEventListener('change', function() {
  updateTimeValue(timeSlider.value);
  updateGeoTiffLayer();
});

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
            values.push(pixelValue)
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
      // minValue = Math.floor(minValue);
      // maxValue = Math.ceil(maxValue);
      const min5thPercentile = Math.floor(getPercentileValue(5));
      const max95thPercentile = Math.ceil(getPercentileValue(95));
      minValue = min5thPercentile;
      maxValue = max95thPercentile;
      
      const colors = ["darkblue", "blue", "cyan", "lightgreen", "green", "yellowgreen", "yellow", "orange", "orangered", "red"];
      const colorMapping = [];
      const legendGrades = [];
      const interval = (maxValue - minValue) / 10;

      for (let i = 0; i < 10; i++) {
        const currentMin = minValue + i * interval;
        const currentMax = currentMin + interval;
        colorMapping.push({
          min: currentMin,
          max: i === 9 ? Infinity : currentMax,
          color: colors[i % colors.length],
        });
        legendGrades.push(currentMin)
      }

      if (currentLegend) {
        map.removeControl(currentLegend);
      };
      currentLegend = L.control({position: 'bottomright'});
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
        opacity: 0.8,
        pixelValuesToColorFn: (values) => {
          const bandValue = values[bandNumber];
          if (bandValue === nodataValue) return null;
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