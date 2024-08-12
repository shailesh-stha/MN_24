import { myAccessToken, cesiumViewerOptionsGoogle3dTiles } from "./cesiumConfig.js";
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

// Initialize entities
const entities = initializeEntities(viewer);


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