const myAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzhhZmYxMy00YmU0LTRlYmQtYjQ3OC0xMTQyZmZkMGRkYTIiLCJpZCI6ODY3OTgsImlhdCI6MTcwODY5OTUzN30.ZB4aGsttOsZVWvPH1oiOMp2tuxP4G4QYAISb6lG7zs0';

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