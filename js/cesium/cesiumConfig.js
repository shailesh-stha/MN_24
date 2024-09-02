const myAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NjAyZTAwMi1mOTFkLTQ4ZGItYmM5My0xYmQ5YmVmNjhiMGYiLCJpZCI6ODY3OTgsImlhdCI6MTcyNTAxMDIzNn0.U8KR2vuBItTy4bIC0ZJF0JbxLXJof2r7pOWBS_eOl50';

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
  // creditContainer: document.createElement("div"),
  skyAtmosphere: new Cesium.SkyAtmosphere()
};

export { myAccessToken, cesiumViewerOptionsGoogle3dTiles };