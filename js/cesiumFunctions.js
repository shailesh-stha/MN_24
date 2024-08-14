// 3d Models to Cesium
const glbUrl = {
  structureNeb: "./data/3d_model/structureNeb2.glb"
};

// Geojson/Json to Cesium in WGS84
const geojsonUrl = {
  aoi_parent: "./data/geojson/child_i.geojson",
  aoi_child1: "./data/geojson/child_ii.geojson",
  aoi_child2: "./data/geojson/child_iii.geojson",
  aoi_child3: "./data/geojson/child_iv.geojson",
  neuperlachBoundary: "./data/geojson/neuperlach.geojson",
  neuperlachBoundaryReduced: "./data/geojson/neuperlach_reduced.geojson",
}

// Function to add 3d model into cesium
const addGlb = (viewer, glbName, longitude, latitude, height, heading, pitch, roll) => {
  const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
  const hpr = new Cesium.HeadingPitchRoll(
    Cesium.Math.toRadians(heading),
    Cesium.Math.toRadians(pitch),
    Cesium.Math.toRadians(roll)
  );
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
  );
  const entity = viewer.entities.add({
    name: glbUrl[glbName],
    position: position,
    orientation: orientation,
    model: {
      uri: glbUrl[glbName],
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      scale: 1,
    },
  });
  return entity;
};

// Function to add a GeoJSON file into Cesium
export function addGeoJsonDataSource(viewer, geojsonName, extrudedHeight, polygonColor, showEntities) {
  // Load the GeoJSON data source
  return Cesium.GeoJsonDataSource.load(geojsonUrl[geojsonName]).then(function(dataSource) {
    // Add the data source to the viewer
    viewer.dataSources.add(dataSource);

    // Access the entities in the data source
    const entities = dataSource.entities.values;
    entities.forEach(entity => {
      const polygon = entity.polygon;
      if (polygon) {
        // Set the height reference and extruded height
        polygon.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
        polygon.extrudedHeight = extrudedHeight;
        polygon.extrudedHeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;

        // Set the polygon material color with transparency
        polygon.material = Cesium.Color.fromCssColorString(polygonColor).withAlpha(0.2);
      }
      // Show or hide entities based on the passed parameter
      entity.show = showEntities;
    });
    // Return the added GeoJSON entities
    return entities;
  })
}

// Load GeoJSON data for target lot
export function loadGeoJsonData(viewer, geojsonName, showEntities) {
  return Cesium.GeoJsonDataSource.load(geojsonUrl[geojsonName], {
    stroke: Cesium.Color.YELLOW,
    fill: Cesium.Color.YELLOW.withAlpha(0.25),
    strokeWidth: 2,
    clampToGround: true,
  }).then(function(dataSource) {
    viewer.dataSources.add(dataSource);

    // Access the entities within the data source and set specific properties
    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      entity.polygon.classificationType = Cesium.ClassificationType.CESIUM_3D_TILE;
      // Set the visibility of the entity
      entity.show = showEntities;
    }
    
    // Return the entities
    return entities;
  }).catch(function(error) {
    console.error('An error occurred loading the GeoJSON file:', error);
  });
}

// Helper function to toggle GeoJSON entities visibility
function toggleGeoJsonEntities(geojsonEntity, shouldShow) {
  geojsonEntity.then((geoEntities) => {
    geoEntities.forEach(entity => {
      entity.show = shouldShow;
    });
  });
}

// Load entities into viewer
const longitudeOffset = 8.9831528412e-6;

export function initializeEntities(viewer) {
  const buildingEntity1 = addGlb(viewer, 'buildWithoutGround1', 9.211329, 48.489961, 5.5, 130, 0, 0);
  const buildingEntity2 = addGlb(viewer, 'buildWithoutGround2', 9.211329, 48.489961, 5.5, 130, 0, 0);
  const structureNebEntity = [];

  for (let i = 0; i < 5; i++) {
    structureNebEntity.push(
      addGlb(viewer, 'structureNeb', 11.6447185295 + longitudeOffset * 10 * i, 48.1069104418, 0, 90, 0, 0)
    );
  };
  // Load GeoJSON data
  const geojsonParent = addGeoJsonDataSource(viewer, 'aoi_parent', 128 * 8, '#ff00ff', false);
  const geojsonChild1 = addGeoJsonDataSource(viewer, 'aoi_child1', 128 * 2, '#ff0000', false);
  const geojsonChild2 = addGeoJsonDataSource(viewer, 'aoi_child2', 128 * 2, '#00ff00', false);
  const geojsonChild3 = addGeoJsonDataSource(viewer, 'aoi_child3', 128 * 2, '#0000ff', false);

  const neuperlachBound = loadGeoJsonData(viewer, 'neuperlachBoundary', true);
  const neuperlachBoundReduced = loadGeoJsonData(viewer, 'neuperlachBoundaryReduced', false);

  buildingEntity1.show = false;
  buildingEntity2.show = false;
  structureNebEntity.show = false;
  return { structureNebEntity, geojsonParent, geojsonChild1, geojsonChild2, geojsonChild3, neuperlachBound, neuperlachBoundReduced };
}

// Toggle entities visibility based on action
export function toggleEntities(action, entities) {
  const { structureNebEntity, geojsonParent, geojsonChild1, geojsonChild2, geojsonChild3, neuperlachBound, neuperlachBoundReduced } = entities;
  
  switch (action) {
    // NEB summary
    case 'showBuild1':
      structureNebEntity.show = false;
      toggleGeoJsonEntities(geojsonParent, false);
      toggleGeoJsonEntities(geojsonChild1, false);
      toggleGeoJsonEntities(geojsonChild2, false);
      toggleGeoJsonEntities(geojsonChild3, false);
      toggleGeoJsonEntities(neuperlachBound, true);
      toggleGeoJsonEntities(neuperlachBoundReduced, false)
      break;
    // Neuperlach and Microklima
    case 'showBuild2':
      structureNebEntity.show = false;
      toggleGeoJsonEntities(geojsonParent, false);
      toggleGeoJsonEntities(geojsonChild1, false);
      toggleGeoJsonEntities(geojsonChild2, false);
      toggleGeoJsonEntities(geojsonChild3, false);
      toggleGeoJsonEntities(neuperlachBound, false);
      toggleGeoJsonEntities(neuperlachBoundReduced, true)
      break;
    case 'showBuild3':
      structureNebEntity.show = false;
      toggleGeoJsonEntities(geojsonParent, true);
      toggleGeoJsonEntities(geojsonChild1, false);
      toggleGeoJsonEntities(geojsonChild2, false);
      toggleGeoJsonEntities(geojsonChild3, false);
      toggleGeoJsonEntities(neuperlachBound, false);
      toggleGeoJsonEntities(neuperlachBoundReduced, false)
      break;
    case 'showBuild4':
      structureNebEntity.show = false;
      toggleGeoJsonEntities(geojsonParent, false);
      toggleGeoJsonEntities(geojsonChild1, true);
      toggleGeoJsonEntities(geojsonChild2, true);
      toggleGeoJsonEntities(geojsonChild3, true);
      toggleGeoJsonEntities(neuperlachBound, false);
      toggleGeoJsonEntities(neuperlachBoundReduced, false)
      break;
    case 'showBuild5':
      structureNebEntity.show = true;
      toggleGeoJsonEntities(geojsonParent, false);
      toggleGeoJsonEntities(geojsonChild1, false);
      toggleGeoJsonEntities(geojsonChild2, false);
      toggleGeoJsonEntities(geojsonChild3, false);
      toggleGeoJsonEntities(neuperlachBound, false);
      toggleGeoJsonEntities(neuperlachBoundReduced, false)
      break;
    case 'showBuild6':
      structureNebEntity.show = true;
      toggleGeoJsonEntities(geojsonParent, false);
      toggleGeoJsonEntities(geojsonChild1, false);
      toggleGeoJsonEntities(geojsonChild2, false);
      toggleGeoJsonEntities(geojsonChild3, false);
      toggleGeoJsonEntities(neuperlachBound, false);
      toggleGeoJsonEntities(neuperlachBoundReduced, false)
      break;
    // strauch
    case 'showBuild7': 
    structureNebEntity.show = true;
    toggleGeoJsonEntities(geojsonParent, false);
    toggleGeoJsonEntities(geojsonChild1, false);
    toggleGeoJsonEntities(geojsonChild2, false);
    toggleGeoJsonEntities(geojsonChild3, false);
    toggleGeoJsonEntities(neuperlachBound, false);
    toggleGeoJsonEntities(neuperlachBoundReduced, false)
      break;
    default:
      console.error('Invalid action: ' + action);
  }
}