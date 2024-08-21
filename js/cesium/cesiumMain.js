import { myAccessToken, cesiumViewerOptionsGoogle3dTiles } from './cesiumConfig.js';
import { cesiumCameraViews } from "./cameraSettings.js";
import { initializeEntities, toggleEntities } from "./cesiumFunctions.js";

Cesium.Ion.defaultAccessToken = myAccessToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer("cesiumMapContainer", cesiumViewerOptionsGoogle3dTiles);

try {
  const tileset = await Cesium.createGooglePhotorealistic3DTileset();
  viewer.scene.primitives.add(tileset);
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.msaaSamples = 4;
} catch (error) {
  console.log(`Failed to load tileset: ${error}`);
}

async function getBoundingBoxFromGeoJSON(url) {
  const response = await fetch(url);
  const geojson = await response.json();

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  geojson.features.forEach(feature => {
    const coordinates = feature.geometry.coordinates;

    coordinates.forEach(polygon => {
      polygon.forEach(ring => {
        ring.forEach(coordinate => {
          const [lon, lat] = coordinate;
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
        });
      });
    });
  });
  return [minLon, minLat, maxLon, maxLat];
}

const boundingBox = await getBoundingBoxFromGeoJSON('./data/geojson/n03.geojson');
console.log(boundingBox);

// Define the rectangle's boundaries
const rectangle = Cesium.Rectangle.fromDegrees(boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3]);
// const rectangle = Cesium.Rectangle.fromDegrees(11.6415765593571479, 48.1038158007820087, 11.6486833081481915, 48.1085756077523996);

const polygonHierarchy = new Cesium.PolygonHierarchy(
  Cesium.Cartesian3.fromDegreesArray([
      11.64181253, 48.10857561,
      11.64868331, 48.10841735,
      11.64844673, 48.10381580,
      11.64157656, 48.10397404
  ])
);

// Set the desired height in meters (altitude above the 3D tiles)
const height = 600; // Adjust this value based on how high above the 3D tile you want the image

// Create a polygon entity and store it in a variable
const polygonEntity = viewer.entities.add({
  polygon: {
      hierarchy: polygonHierarchy,  // Correctly use the hierarchy property
      // height: height, 
      material: new Cesium.ImageMaterialProperty({
          image: "./data/images/temp150_re_all.png",
          transparent: true,
          color: new Cesium.Color(1.0, 1.0, 1.0, 0.3)
      }),
      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,  // Ensures it overlays on the terrain
  }
});

// Set the polygon's initial visibility to true
polygonEntity.show = false;

// Add an event listener to the toggle button
document.getElementById('togglePolygon').addEventListener('click', function() {
  // Toggle the visibility of the polygon entity
  polygonEntity.show = !polygonEntity.show;
});

// Initialize entities
const entities = await initializeEntities(viewer);

function setCameraView(view) {
  viewer.camera.flyTo(cesiumCameraViews[view]);
}

// Initialize camera view
viewer.camera.setView(cesiumCameraViews.view1);

window.setCameraView = setCameraView;
window.toggleEntities = (action) => toggleEntities(action, entities);


// Get camera info
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function() {
  var longitude = Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude);
  var latitude = Cesium.Math.toDegrees(viewer.camera.positionCartographic.latitude);
  var height = viewer.camera.positionCartographic.height;
  var heading = Cesium.Math.toDegrees(viewer.camera.heading);
  var pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
  var roll = Cesium.Math.toDegrees(viewer.camera.roll);
  var output = `destination: Cesium.Cartesian3.fromDegrees(${longitude}, ${latitude}, ${height}),
    orientation: {
      heading: Cesium.Math.toRadians(${heading}),
      pitch: Cesium.Math.toRadians(${pitch}),
      roll: 0,
    },`;
  console.log(output);
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);