const glbUrl = {
  buildWithoutGround1: "./data/3d_model/buildWithoutGround1.glb",
  buildWithoutGround2: "./data/3d_model/buildWithoutGround2.glb",
  buildWithoutGround3: "./data/3d_model/buildWithoutGround3.glb",
  buildWithoutGround4: "./data/3d_model/buildWithoutGround4.glb",
  strauch: "./data/3d_model/strauch.glb",
  structureNeb: "./data/3d_model/structureNeb.glb"
};

const addGlb = (
  viewer,
  glbName,
  longitude = 9.211329,
  latitude = 48.489961,
  height = 5.5,
  heading = 130,
  pitch = 0,
  roll = 0
) => {
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

// load entities into viewer
export function initializeEntities(viewer) {
  const buildingEntity1 = addGlb(viewer, 'buildWithoutGround1', 9.211329, 48.489961, 5.5, 130, 0, 0);
  const buildingEntity2 = addGlb(viewer, 'buildWithoutGround2', 9.211329, 48.489961, 5.5, 130, 0, 0);
  const buildingEntity3 = addGlb(viewer, 'buildWithoutGround3', 9.211329, 48.489961, 5.5, 130, 0, 0);
  const buildingEntity4 = addGlb(viewer, 'buildWithoutGround4', 9.211329, 48.489961, 5.5, 130, 0, 0);
  const strauchEntity = addGlb(viewer, 'strauch', 9.158983, 48.777488, 16.70, 65, 0, 0);
  const structureNebEntity = addGlb(viewer, 'structureNeb', 11.6447185295, 48.1069104418, 0, 90, 0, 0);

  buildingEntity1.show = true;
  buildingEntity2.show = false;
  buildingEntity3.show = false;
  buildingEntity4.show = false;
  strauchEntity.show = false;
  structureNebEntity.show = true;

  return { buildingEntity1, buildingEntity2, buildingEntity3, buildingEntity4, strauchEntity, structureNebEntity};
}

export function toggleEntities(action, entities) {
  const { buildingEntity1, buildingEntity2, buildingEntity3, buildingEntity4, strauchEntity, structureNebEntity } = entities;
  switch (action) {
    case 'showBuild1':
      buildingEntity1.show = true;
      buildingEntity2.show = false;
      buildingEntity3.show = false;
      buildingEntity4.show = false;
      break;
    case 'showBuild2':
      buildingEntity1.show = false;
      buildingEntity2.show = true;
      buildingEntity3.show = false;
      buildingEntity4.show = false;
      break;
    case 'showBuild3':
      buildingEntity1.show = false;
      buildingEntity2.show = false;
      buildingEntity3.show = true;
      buildingEntity4.show = false;
      break;
    case 'showBuild4':
      buildingEntity1.show = false;
      buildingEntity2.show = false;
      buildingEntity3.show = true;
      buildingEntity4.show = false;
      break;
    case 'showBuild5':
      buildingEntity1.show = false;
      buildingEntity2.show = false;
      buildingEntity3.show = true;
      buildingEntity4.show = false;
      break;
    case 'showBuild6':
      buildingEntity1.show = false;
      buildingEntity2.show = false;
      buildingEntity3.show = true;
      buildingEntity4.show = false;
      break;
    // strauch
    case 'showBuild7': 
      buildingEntity1.show = false;
      buildingEntity2.show = false;
      buildingEntity3.show = false;
      buildingEntity4.show = false;
      strauchEntity.show = true;
      break;
    default:
      console.error('Invalid action: ' + action);
  }
}


// Load LOD2 buildings into viewer
export async function loadLod2Buildings(viewer) {
  const tileset = await Cesium.Cesium3DTileset.fromUrl(
    "https://web3d.basemap.de/cesium/buildings-floor/root.json"
  );
  // Define custom styles
  const cityStyle = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${surface} === 'wall'", "color('#f2f2f2')"],
        ["${surface} === 'roof'", "color('#ff5c4d')"],
        ["${surface} === 'bridge'", "color('#999999')"],
      ],
    },
  });
  tileset.style = cityStyle;
  // Add the tileset to the scene
  viewer.scene.primitives.add(tileset);
}
