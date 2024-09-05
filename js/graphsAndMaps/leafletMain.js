import { addFullscreenControl, addScaleBar, addCoordDisplay, addNorthArrowControl, } from "./leafletFunctions.js";
import { geojsonBuildingUrlByRegion, geojsonBoundaryUrl, } from "./geodataUrl.js";
import { plotGraph, plotLineGraph } from "./plotlyFunctions.js";

// Initialize map
let initialViewState = [48.104777950273345, 11.649559334909327, 14.6];
const map = L.map("map", {
  zoomDelta: 0.2,
  zoomSnap: 0.2,
  boxZoom: false,
  wheelPxPerZoomLevel: 150,
  center: [initialViewState[0], initialViewState[1]],
  zoom: initialViewState[2],
});

const OpenStreetMap = L.tileLayer( "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);

const OpenStreetMap_DE = L.tileLayer( "https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

const Esri_WorldImagery = L.tileLayer( "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution:
  "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

addFullscreenControl(map);
addNorthArrowControl(map);
addCoordDisplay(map);
addScaleBar(map);

// Add layers to layerControl
var baseLayers = {
  OpenStreetMap: OpenStreetMap,
  "OpenStreetMap (DE)": OpenStreetMap_DE,
  "ESRI WorldImagery": Esri_WorldImagery,
};
var overlayLayers = {};

// Create the layer control with the autoZIndex option
let layerControl = L.control.layers(baseLayers, overlayLayers).addTo(map);

// Initializ all the required Variables
let currentGeotiffLayer,
  currentLegend,
  currentBuildingGeojsonLayer,
  currentBoundaryGeojsonLayer;
let parentLayer, childLayerN02, childLayerN03, childLayerN04;
let isLegendVisible = true;
let marker, popupContent;

// Initialize elements
document.addEventListener("DOMContentLoaded", function () {
  updateTimeSliderElement();
  updateTransparencySliderElement();
  updateGeotiffAndPlot();
  addGeojsonBuildingLayer("#ffffff", "#aaaaaa");
  parentLayer = addGeojsonBoundaryLayer(geojsonBoundaryUrl["N00"], "#197d1c");
  childLayerN02 = addGeojsonBoundaryLayer(geojsonBoundaryUrl["N02"], "#197d1c");
  childLayerN03 = addGeojsonBoundaryLayer(geojsonBoundaryUrl["N03"], "#197d1c");
  childLayerN04 = addGeojsonBoundaryLayer(geojsonBoundaryUrl["N04"], "#197d1c");
});
// Update geotiff, geojson and plot
document
  .getElementById("locationSelector")
  .addEventListener("change", function () {
    updateGeotiffAndPlot();
    addGeojsonBuildingLayer("#ffffff", "#aaaaaa");
    if (marker) {
      map.removeLayer(marker);
    }
  });

////////////////////////// Disable some functions ////////////////////////////////////
document.getElementById("scenarioSelector").addEventListener("change", function () {
  const locationSelector = document.getElementById("locationSelector");
  if (this.value !== "BS0") {
    locationSelector.querySelector('option[value="N02"]').disabled = true;
    locationSelector.querySelector('option[value="N04"]').disabled = true;
  } else {
    locationSelector.querySelector('option[value="N02"]').disabled = false;
    locationSelector.querySelector('option[value="N04"]').disabled = false;
  }
});

document.getElementById("locationSelector").addEventListener("change", function () {
  const scenarioSelector = document.getElementById("scenarioSelector");
  if (this.value !== "N00" && this.value !== "N03") {
    console.log("disable bs1 and s1");
    scenarioSelector.querySelector('option[value="BS1"]').disabled = true;
    scenarioSelector.querySelector('option[value="S1"]').disabled = true;
  } else {
    console.log("enable bs1 and s1");
    scenarioSelector.querySelector('option[value="BS1"]').disabled = false;
    scenarioSelector.querySelector('option[value="S1"]').disabled = false;
  }
});
//////////////////////////////////////////////////////////////////////////////////
document
  .getElementById("scenarioSelector")
  .addEventListener("change", function () {
    updateGeotiffAndPlot();
    if (marker) {
      map.removeLayer(marker);
    }
  });

document.getElementById("variableSelector").addEventListener("change", function () {
    updateGeotiffAndPlot();
    if (marker) {
      map.removeLayer(marker);
    }
  });
document.getElementById("time-slider").addEventListener("input", updateTimeSliderElement);
document.getElementById("time-slider").addEventListener("change", async function () {
  updateGeotiffAndPlot();
  const georaster = await fetchGeotiff();
  const bandNumber = document.getElementById("time-slider").value;
  const layerTransparency = document.getElementById("transparency-slider").value / 100;
  await updateGeotiff(georaster, bandNumber, layerTransparency);
  if (marker) {
    map.removeLayer(marker);
  }
});
document
  .getElementById("transparency-slider")
  .addEventListener("input", updateTransparencySliderElement);
document
  .getElementById("transparency-slider")
  .addEventListener("change", async function () {
    const georaster = await fetchGeotiff();
    const bandNumber = document.getElementById("time-slider").value;
    const layerTransparency =
      document.getElementById("transparency-slider").value / 100;
    await updateGeotiff(georaster, bandNumber, layerTransparency);
    if (marker) {
      map.removeLayer(marker);
    }
  });

// Event listener for keydown events
document.addEventListener("keydown", function (event) {
  if (event.key === "r" || event.key === "R") {
    map.setView(
      [initialViewState[0], initialViewState[1]],
      initialViewState[2]
    );
  }
  if (event.code === "Space") {
    let bounds = currentGeotiffLayer.getBounds();

    console.log(bounds);
    console.log(map.getCenter());

    let paddedBounds = bounds.pad(0.1);
    map.fitBounds(paddedBounds);
    // map.fitBounds(bounds);
  }
  if (
    event.key === "l" ||
    event.key === "L" ||
    event.key === "t" ||
    event.key === "T"
  ) {
    toggleLegendVisibility();
  }
});

function updateTimeSliderElement() {
  let timeSliderElement = document.getElementById("time-slider");
  let currentTime = timeSliderElement.value;
  document.querySelector(
    ".slider-time-value"
  ).textContent = `${currentTime.padStart(2, "0")}:00`;
  let percentage = (currentTime / 24) * 100;
  timeSliderElement.style.background = `linear-gradient(to right, #ff39b5 ${percentage}%, #ffeb3b ${percentage}%)`;
}
function updateTransparencySliderElement() {
  let transparencySliderElement = document.getElementById(
    "transparency-slider"
  );
  let currentTransparency = transparencySliderElement.value;
  document.querySelector(
    ".slider-transparency-value"
  ).textContent = `${currentTransparency}%`;
  let percentage = (currentTransparency / 100) * 100;
  transparencySliderElement.style.background = `linear-gradient(to right, #ff39b5 ${percentage}%, #ffeb3b ${percentage}%)`;
}

// Update the selected GeoTIFF URL based on the dropdown selection
async function updateGeotiffAndPlot() {
  try {
    let selectedVariableValue =
      document.getElementById("variableSelector").value;
    let bandNumber = document.getElementById("time-slider").value;

    let georaster = await fetchGeotiff();
    let meanValuesList = calculateMeanValues(georaster);

    plotGraph(meanValuesList, selectedVariableValue, bandNumber);

    let layerTransparency =
      document.getElementById("transparency-slider").value / 100;
    updateGeotiff(georaster, bandNumber, layerTransparency);
  } catch (error) {
    console.error.apply("Error processing Geotiff:", error);
  }
}

async function fetchGeotiff() {
  // Update Geodata urls and band number
  let selectedVariableValue = document.getElementById("variableSelector").value;
  let selectedLocationValue = document.getElementById("locationSelector").value;
  let selectedScenarioValue = document.getElementById("scenarioSelector").value;

  let urlToGeotiffFile = `./data/rasterUpdated/${selectedScenarioValue}/${selectedLocationValue}_${selectedVariableValue}_xy_proj.tif`;

  console.log(selectedVariableValue);
  console.log(urlToGeotiffFile);
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
    const bandMeanValue =
      bandValidPixelCount > 0 ? bandSum / bandValidPixelCount : null;
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
  const maxNthPercentile = Math.ceil(getPercentileValue(90));
  minValue = minNthPercentile;
  maxValue = maxNthPercentile;
  return [minValue, maxValue];
}

const legendToggleButton = L.control({ position: "topright" });
legendToggleButton.onAdd = function (map) {
  const button = L.DomUtil.create("button", "legend-toggle-button");
  // Use an image instead of text
  const img = L.DomUtil.create("img");
  img.src = "./data/logo/legend_128_with_shadow.png";
  // img.alt = 'Legend';
  img.style.width = "30px";
  img.style.height = "30px";
  // Clear any text and append the image to the button
  button.innerHTML = "";
  button.appendChild(img);
  button.style.backgroundColor = "white";
  button.style.padding = "7px";
  button.style.cursor = "pointer";
  button.style.border = "2px solid #bbbbbb";
  button.style.borderRadius = "7px";
  L.DomEvent.disableClickPropagation(button);
  button.onclick = function () {
    toggleLegendVisibility();
  };
  return button;
};
legendToggleButton.addTo(map);

// Function to toggle the legend's visibility
function toggleLegendVisibility() {
  if (isLegendVisible) {
    map.removeControl(currentLegend);
  } else {
    currentLegend.addTo(map);
  }
  isLegendVisible = !isLegendVisible;
}

// Function to load GeoTIFF and display it with the legend
async function updateGeotiff(georaster, bandNumber, opacity) {
  let [minValue, maxValue] = calculateExtremeValues(georaster, bandNumber);

  // minValue = 18;
  // maxValue = 33;

  const colors = ["#0000FF","#3333FF","#6666FF","#9999FF","#CCCCFF","#FFFF00","#FFCC00","#FF9900","#FF6600","#FF0000",];
  const legendGrades = [];
  const interval = (maxValue - minValue) / colors.length;

  for (let i = 0; i < colors.length; i++) {
    const currentMin = minValue + i * interval;
    legendGrades.push(currentMin);
  }
  if (currentLegend) {
    map.removeControl(currentLegend);
  }
  currentLegend = L.control({ position: "bottomright" });
  // Creating the legend
  currentLegend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend"),
      grades = legendGrades;
    div.innerHTML += "<h6>LEGEND</h6>";
    if (grades[0] > 273.15) {
      for (var i = 0; i < grades.length; i++) {
        grades[i] -= 273.15;
      }
    }
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        colors[i] +
        '"></i> ' +
        grades[i].toFixed(2) +
        (grades[i + 1]
          ? "&ndash;" + grades[i + 1].toFixed(2) + " °C<br>"
          : "+ °C");
    }
    return div;
  };
  if (isLegendVisible) {
    currentLegend.addTo(map);
  }

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

function addGeojsonBuildingLayer(fillColor, lineColor) {
  if (currentBuildingGeojsonLayer) {
    map.removeLayer(currentBuildingGeojsonLayer);
  }
  const urlToGeojsonFile =
    geojsonBuildingUrlByRegion[
      document.getElementById("locationSelector").value
    ];
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
      }, 600);
      // console.log("GeoJSON layer added");
    })
    .catch((error) => console.error("Error loading the GeoJSON file:", error));
}

function addGeojsonBoundaryLayer(geojsonPath, color) {
  fetch(geojsonPath)
    .then((response) => response.json())
    .then((data) => {
      currentBoundaryGeojsonLayer = L.geoJSON(data, {
        style: function () {
          return {
            color: color,
            weight: 2.5,
            opacity: 1,
            // fillColor: none,
            fillOpacity: 0,
          };
        },
      });
      currentBoundaryGeojsonLayer.addTo(map);
    })
    .catch((error) => console.error("Error loading the GeoJSON file:", error));
}

// Additional functionalities on map
map.on("click", async function (event) {
  const lat = event.latlng.lat;
  const lng = event.latlng.lng;

  const georaster = await fetchGeotiff();
  const bandIndex = document.getElementById("time-slider").value;

  try {
    let valuesList;
    let valuesList1, valuesList2;

    valuesList1 = geoblaze.identify(georaster, [lng, lat]);
    try {
      const [x, y] = proj4("EPSG:4326", "EPSG:3857", [lng, lat]);
      valuesList2 = geoblaze.identify(georaster, [x, y]);

      if (valuesList2) {
        valuesList = valuesList2;
      } else {
        valuesList = valuesList1;
      }
    } catch (error) {}

    let selectedVariableValue =
      document.getElementById("variableSelector").value;
    const currentValue = valuesList[bandIndex];
    

    marker = L.marker([lat, lng]).addTo(map);
    popupContent = `Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}<br>Value: ${currentValue.toFixed(2)}°C`;
    marker.bindPopup(popupContent).openPopup();

    // Plot graph from hourly data
    const container = document.getElementById("plotContainer");
    container.style.display = "block";

    const range = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24,
    ];
    plotLineGraph("plotContainer", range, valuesList, selectedVariableValue);

    marker.on("popupclose", function () {
      map.removeLayer(marker);
      const container = document.getElementById("plotContainer");
      container.style.display = "none";
    });
  } catch (error) {}
});

// Prevent right click
map.on("contextmenu", function (event) {
  event.originalEvent.preventDefault();
});
map.doubleClickZoom.disable();
