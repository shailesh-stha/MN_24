// Global variable to store the selected GeoTIFF file URL
let urlToGeoTiffFile;

// Mapping from dropdown values to GeoTIFF URLs
const geotiffUrl = {
  airTempProjBSN02: "./data/raster/BS_ta_2m_proj_N02.tif",
  tsurfProjBSN02: "./data/raster/BS_tsurf_proj_N02.tif",
  bioPETProjBSN02: "./data/raster/BS_bio_pet_proj_N02.tif",
  bioUTCIProjBSN02: "./data/raster/BS_bio_utci_proj_N02.tif",

  airTempProjBSN03: "./data/raster/BS_ta_2m_proj_N03.tif",
  tsurfProjBSN03: "./data/raster/BS_tsurf_proj_N03.tif",
  bioPETProjBSN03: "./data/raster/BS_bio_pet_proj_N03.tif",
  bioUTCIProjBSN03: "./data/raster/BS_bio_utci_proj_N03.tif"
};

const geotiffUrl2 = {
  N02: {
    airTempProjBS:  "./data/raster/BS_ta_2m_proj_N02.tif",
    tsurfProjBS:    "./data/raster/BS_tsurf_proj_N02.tif",
    bioPETProjBS:   "./data/raster/BS_bio_pet_proj_N02.tif",
    bioUTCIProjBS:  "./data/raster/BS_bio_utci_proj_N02.tif"
  },
  N03: {
    airTempProjBS:  "./data/raster/BS_ta_2m_proj_N03.tif",
    tsurfProjBS:    "./data/raster/BS_tsurf_proj_N03.tif",
    bioPETProjBS:   "./data/raster/BS_bio_pet_proj_N03.tif",
    bioUTCIProjBS:  "./data/raster/BS_bio_utci_proj_N03.tif"
  }
};

// Mapping from dropdown selection values to GeoTIFF keys
const valueToKeyMap = {
  1: 'airTempProjBSN02',
  2: 'tsurfProjBSN02',
  3: 'bioPETProjBSN02',
  4: 'bioUTCIProjBSN02'
};

// Get references to HTML elements
const timeSlider = document.getElementById('time-slider');
const sliderValue = document.querySelector('.slider-value');

// Update the selected GeoTIFF URL based on the dropdown selection
function updateGeoTiffUrl() {
  const selectedValue = document.getElementById('variableSelector').value;
  const selectedKey = valueToKeyMap[selectedValue];
  urlToGeoTiffFile = geotiffUrl[selectedKey];

  if (!urlToGeoTiffFile) {
    console.error('GeoTIFF URL is undefined. Please check your dropdown value mapping.');
    return;
  }
  // console.log('Selected GeoTIFF URL:', urlToGeoTiffFile);

  fetch(urlToGeoTiffFile).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoTIFF from ${urlToGeoTiffFile}`);
    }
    return response.arrayBuffer();
  })
  .then(arrayBuffer => parseGeoraster(arrayBuffer))
  .then(georaster => {
    const nodataValue = georaster.noDataValue;
    // List to store mean values for bands 4 to 10
    const meanValuesList = [];

    // Calculate mean values for bands 4 to 10
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
    console.log(`Mean values for bands:`, meanValuesList);
    console.log(`Length of bands:`, meanValuesList.length);

    var trace1 = {
      x: [],
      y: [],
      type: "scatter",
      mode: "lines+markers",
      line: {
        color: "rgb(251,62,181)",
        width: 3,
        dash: "solid",
      },
      marker: {
        color: "rgb(251,62,181)",
        size: 10,
        symbol: "circle",
        line: {
          color: "white",
          width: 2,
        },
      },
    };
    
    var layout = {
      title: {
        text: "Temperature Over Time",
        font: {
          size: 20,
        },
        xref: "paper",
        x: 0.5,
      },
      xaxis: {
        title: {
          text: "Time (Hour)",
          font: {
            size: 18,
          },
        },
        range: [-1, 25],
        dtick: 2,
        showgrid: true,
        gridcolor: "rgba(200, 200, 200, 0.5)",
        zeroline: false,
        showline: true,
        linewidth: 2,
        linecolor: "black",
        mirror: true,
        tickfont: {
          size: 16,
        },
      },
      yaxis: {
        title: {
          text: "Temperature (°C)",
          font: {
            size: 18,
          },
        },
        range: [15, 40],
        dtick: 2,
        showgrid: true,
        gridcolor: "rgba(200, 200, 200, 0.5)",
        zeroline: false,
        showline: true,
        linewidth: 2,
        linecolor: "black",
        mirror: true,
        tickfont: {
          size: 16,
        },
      },
      plot_bgcolor: "rgba(255, 255, 255, 1)",
      paper_bgcolor: "white",
      showlegend: false,
      margin: {
        l: 60,
        r: 30,
        b: 60,
        t: 60,
        pad: 10,
      },
    };
    
    Plotly.newPlot('plotlyLineGraph', [trace1], layout);
    var fullX = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    var fullY = meanValuesList;

    var i = 0;

    function addPoint() {
      if (i < fullX.length) {
        Plotly.extendTraces('plotlyLineGraph', {
          x: [[fullX[i]]],
          y: [[fullY[i]]]
        }, [0]);
        i++;
        setTimeout(addPoint, 10);
      }
    }
    setTimeout(addPoint, 10);    
  });
  updateGeoTiffLayer();
}

// Update the GeoTIFF layer dynamically
function updateGeoTiffLayer() {
  if (!urlToGeoTiffFile) {
    console.error('Cannot load GeoTIFF. The URL is undefined.');
    return;
  }

  const selectedValue = document.getElementById('variableSelector').value;
  const bandNumber = Number(timeSlider.value);

  console.log('Current GeoTIFF Key:', valueToKeyMap[selectedValue]);
  console.log('Current Band Number:', bandNumber);

  loadGeoTiffToMap(urlToGeoTiffFile, bandNumber).then((layer) => {
    if (map.hasLayer(currentLayer)) {
      map.removeLayer(currentLayer);
    }
    currentLayer = layer;
    currentLayer.addTo(map);
    map.fitBounds(currentLayer.getBounds());
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

// Event listener for dropdown value change
document.getElementById('variableSelector').addEventListener('change', updateGeoTiffUrl);

// Event listener for time slider change
timeSlider.addEventListener('change', function() {
  updateTimeValue(timeSlider.value);
  updateGeoTiffLayer();
});

// Initialize the map
const map = L.map("map", {
  zoomDelta: 0.2,
  zoomSnap: 0.2,
  wheelPxPerZoomLevel: 150,
}).setView([48.106, 11.645], 16.4);

L.control.fullscreen({
  position: 'topleft', // You can change the position to 'topright', 'bottomleft', or 'bottomright'
  title: {
    'false': 'View Fullscreen',
    'true': 'Exit Fullscreen'
  }
}).addTo(map);

// Define a custom control for the north arrow
const NorthControl = L.Control.extend({
  options: {
    position: 'topright'
  },
  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'north-arrow-control');
    const img = L.DomUtil.create('img', '', container);
    img.src = './data/logo/northArrow.png';
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.pointerEvents = 'none';
    return container;
  }
});
// Add the north arrow to the map
map.addControl(new NorthControl());

// Add OpenStreetMap tiles to the map
const OpenStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let currentLayer;

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
          }
        }
      }
      const meanValue = validPixelCount > 0 ? sum / validPixelCount : null;
      minValue = Math.floor(minValue);
      maxValue = Math.ceil(maxValue);

      console.log(`Band ${bandNumber} - Rounded Min Value: ${minValue}, Rounded Max Value: ${maxValue}, Mean Value: ${meanValue}`);

      const colors = ["darkblue", "blue", "cyan", "lightgreen", "green", "yellowgreen", "yellow", "orange", "orangered", "red"];
      const colorMapping = [];
      const interval = (maxValue - minValue) / 10;

      for (let i = 0; i < 10; i++) {
        const currentMin = minValue + i * interval;
        const currentMax = currentMin + interval;
        colorMapping.push({
          min: currentMin,
          max: i === 9 ? Infinity : currentMax,
          color: colors[i % colors.length],
        });
      }
      return new GeoRasterLayer({
        georaster,
        opacity: 1,
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

// Initialize the time slider and map layer on page load
document.addEventListener('DOMContentLoaded', function() {
  updateTimeValue(timeSlider.value);
  updateGeoTiffUrl();
});