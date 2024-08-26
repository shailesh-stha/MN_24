import { addFullscreenControl, addScaleBar, addCoordDisplay, addNorthArrowControl } from "./leafletFunctions.js";
import { geotiffUrlByRegion, geojsonBuildingUrlByRegion } from "./geotiffUrl.js";
import { plotGraph } from "./plotlyFunctions.js";

// Initialize map
let initialViewState = [48.10413, 11.6494, 15.2];
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

var baseLayers = {
  "OpenStreetMap": OpenStreetMap,
  "OpenStreetMap (DE)": OpenStreetMap_DE
};
var overlayLayers = {
};

// Create the layer control with the autoZIndex option
let layerControl = L.control.layers(baseLayers, overlayLayers, {
  autoZIndex: true // or false
}).addTo(map);

// Additonal Layers
let currentGeotiffLayer, currentBuildingGeojsonLayer;

// Initialize elements
document.addEventListener('DOMContentLoaded', function() {
  updateTimeSliderElement();
  updateGeotiffAndPlot();
  addGeoJSONToLayer("#ffffff", "#aaaaaa");
});
// Update geotiff, geojson and plot
document.getElementById('locationSelector').addEventListener('change', function () {
  updateGeotiffAndPlot();
  addGeoJSONToLayer("#ffffff", "#aaaaaa");
});
document.getElementById('variableSelector').addEventListener('change', updateGeotiffAndPlot);
document.getElementById('time-slider').addEventListener('input', updateTimeSliderElement);
document.getElementById("time-slider").addEventListener("change", async function () {
  const georaster = await fetchGeotiff();
  const bandNumber = document.getElementById("time-slider").value;
  await updateGeotiff(georaster, bandNumber, 0.8);
});


// Event listener for keydown events
document.addEventListener('keydown', function(event) {
  if (event.key === 'r' || event.key === 'R') {
    map.setView([initialViewState[0], initialViewState[1]], initialViewState[2]);
  }
  if (event.code === 'Space') {
    map.fitBounds(currentGeotiffLayer.getBounds());
  }
});

function updateTimeSliderElement() {
  let timeSliderElement = document.getElementById('time-slider');
  let currentTime = timeSliderElement.value;
  document.querySelector('.slider-value').textContent = `${currentTime.padStart(2, '0')}:00`;
  let percentage = (currentTime / 24) * 100;
  timeSliderElement.style.background = `linear-gradient(to right, #ff39b5 ${percentage}%, #ffeb3b ${percentage}%)`;
}

// Update the selected GeoTIFF URL based on the dropdown selection
async function updateGeotiffAndPlot() {
  try {
    let selectedVariableValue = document.getElementById('variableSelector').value;
    let bandNumber = document.getElementById('time-slider').value;
    
    let georaster = await fetchGeotiff();
    let meanValuesList = calculateMeanValues(georaster);
    
    plotGraph(meanValuesList, selectedVariableValue);
    console.log('Plot updated');

    updateGeotiff(georaster, bandNumber, 0.8);
    console.log("Geotiff and legend updated");

    // addGeoJSONToLayer("#ffffff", "#aaaaaa");
    // console.log("Building Geosjon updated");
  } catch (error) {
    console.error.apply('Error processing Geotiff:', error);
  }
}

async function fetchGeotiff() {
  // Update Geodata urls and band number
  let selectedVariableValue = document.getElementById('variableSelector').value;
  let selectedLocationValue = document.getElementById('locationSelector').value;
  let urlToGeotiffFile = geotiffUrlByRegion[selectedLocationValue][selectedVariableValue];
  try {
      const response = await fetch(urlToGeotiffFile);
      if (!response.ok) {
          throw new Error(`Failed to fetch GeoTIFF from ${urlToGeotiffFile}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);
      return georaster;
  } catch (error) {
      console.error(error);
      throw error;
  }
}

function calculateMeanValues(georaster) {
  // Compute statistics
  const nodataValue = georaster.noDataValue;
  const numberOfBands = georaster.values.length;
  const meanValuesList = [];
  for (let band = 0; band < numberOfBands; band++) {
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
  return meanValuesList;
}

function calculateExtremeValues(georaster, bandNumber) {
  const nodataValue = georaster.noDataValue;
  let minValue = Infinity;
  let maxValue = -Infinity;
  let values = [];
  let sum = 0;
  let validPixelCount = 0;

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
  values.sort((a, b) => a - b);
  const getPercentileValue = (percentile) => {
    const index = Math.floor((percentile * values.length) / 100);
    return values[index];
  };
  const minNthPercentile = Math.floor(getPercentileValue(10));
  const maxNthPercentile = Math.ceil(getPercentileValue(85));
  minValue = minNthPercentile;
  maxValue = maxNthPercentile;
  return [minValue, maxValue];
}


async function updateGeotiff(georaster, bandNumber, opacity) {
  let [minValue, maxValue] = calculateExtremeValues(georaster, bandNumber);
  const colors = ["#0000FF","#3333FF","#6666FF","#9999FF","#CCCCFF","#FFFF00","#FFCC00","#FF9900","#FF6600","#FF0000",];
  const layer = new GeoRasterLayer({
    georaster,
    opacity: opacity,
    pixelValuesToColorFn: (values) => {
      const bandValue = values[bandNumber];
      if (bandValue === georaster.noDataValue) return null;

      if (bandValue < minValue) return colors[0];
      if (bandValue > maxValue) return colors[colors.length - 1];

      const interval = (maxValue - minValue) / colors.length;
      for (let i = 0; i < colors.length; i++) {
        const currentMin = minValue + i * interval;
        const currentMax = currentMin + interval;
        if (bandValue >= currentMin && bandValue < currentMax) return colors[i];
      }
      return null;
    },
    resolution: 256,
  });
  if (map.hasLayer(currentGeotiffLayer)) {
    map.removeLayer(currentGeotiffLayer);
  }

  if (overlayLayers["Variable Layer"]) {
    layerControl.removeLayer(overlayLayers["Variable Layer"]);
  }
  currentGeotiffLayer = layer;
  currentGeotiffLayer.addTo(map);
  currentGeotiffLayer.setZIndex(1000);

  overlayLayers["Variable Layer"] = currentGeotiffLayer;
  layerControl.addOverlay(currentGeotiffLayer, "Variable Layer");
}

function addGeoJSONToLayer(fillColor, lineColor) {
  if (currentBuildingGeojsonLayer) {
    map.removeLayer(currentBuildingGeojsonLayer);
  }

  const urlToGeojsonFile = geojsonBuildingUrlByRegion[document.getElementById('locationSelector').value];
  
  fetch(urlToGeojsonFile)
    .then((response) => response.json())
    .then((data) => {
      currentBuildingGeojsonLayer = L.geoJSON(data, {
        style: function () {
          return {
            color: lineColor,
            weight: 1,
            fillColor: fillColor,
            fillOpacity: 1,
          };
        },
      });
      setTimeout(() => {
        currentBuildingGeojsonLayer.addTo(map);
      },600);
      console.log("GeoJSON layer added");
    })
    .catch((error) => console.error("Error loading the GeoJSON file:", error));
}