const myAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MjU4YjRjZi0zNDYzLTQ5ZTUtOWYxZC01Yjk4MGU3NDg3YTgiLCJpZCI6ODY3OTgsImlhdCI6MTcyNDE0MTE2OH0.L6yejLHYwVyBjyMdvDJndsetI3_niNAn9ibPzc1JBWA';

const cesiumViewerOptionsGoogle3dTiles = {
  // terrain: Cesium.Terrain.fromWorldTerrain(),
  // globe: false,
  imageryProvider: false,
  animation: false,
  // shadows: false,
  timeline: false,
  geocoder: false, 
  homeButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  navigationHelpButton: false,
  infoBox: false,
  selectionIndicator: false,
  creditContainer: document.createElement("div"),
  skyAtmosphere: new Cesium.SkyAtmosphere()
};

export { myAccessToken, cesiumViewerOptionsGoogle3dTiles };