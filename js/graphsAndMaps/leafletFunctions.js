// Function to add fullscreen control to the map
export function addFullscreenControl(map) {
  L.control
    .fullscreen({
      position: "topleft",
      title: {
        false: "View Fullscreen",
        true: "Exit Fullscreen",
      },
    })
    .addTo(map);
}

// Add scale bar
export function addScaleBar(map) {
  L.control
    .scale({
      metric: true,
      imperial: false,
      maxWidth: 100,
      positon: "bottomleft",
    })
    .addTo(map);
}

// Display coordinate on the map
export function addCoordDisplay(map) {
  const coordDiv = L.control({ position: "bottomleft" });
  coordDiv.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "coordinate-info");
    this.update();
    return this._div;
  };
  coordDiv.update = function (coords) {
    this._div.innerHTML = coords
      ? `Lat: ${coords.lat.toFixed(4)}, Long: ${coords.lng.toFixed(4)}`
      : "Hover over the map";
  };
  coordDiv.addTo(map);
  map.on("mousemove", function (e) {
    coordDiv.update(e.latlng);
  });
}

// Function to add north arrow control to the map
export function addNorthArrowControl(map) {
  const NorthControl = L.Control.extend({
    options: {
      position: "topright",
    },
    onAdd: function (map) {
      const container = L.DomUtil.create("div", "north-arrow-control");
      const img = L.DomUtil.create("img", "", container);
      img.src = "./data/logo/northArrow_halo_thick.png";
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.pointerEvents = "none";
      return container;
    },
  });
  map.addControl(new NorthControl());
}

// Function to load and add a GeoJSON file to a specific layer group with a specified color
export function addGeoJSONToLayer(
  geojsonPath,
  layerGroup,
  fillColor,
  lineColor
) {
  fetch(geojsonPath)
    .then((response) => response.json())
    .then((data) => {
      L.geoJSON(data, {
        style: function () {
          return {
            color: lineColor,
            weight: 1,
            fillColor: fillColor,
            fillOpacity: 1,
          };
        },
      }).addTo(layerGroup);
    })
    .catch((error) => console.error("Error loading the GeoJSON file:", error));
}