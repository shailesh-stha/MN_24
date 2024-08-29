// Define URL list object
export const geotiffUrlByRegion = {
  Parent: {
    airTemp: "./data/raster/Parent_BS_ta_2m_proj.tif",
  },
  N02: {
    airTemp: "./data/raster/N02_BS_ta_2m_proj.tif",
    tsurf: "./data/raster/N02_BS_tsurf_proj_degC.tif",
    bioPET: "./data/raster/N02_BS_bio_pet_proj.tif",
    bioUTCI: "./data/raster/N02_BS_bio_utci_proj.tif",
  },
  N03: {
    airTemp: "./data/raster/N03_BS_ta_2m_proj.tif",
    tsurf: "./data/raster/N03_BS_tsurf_proj_degC.tif",
    bioPET: "./data/raster/N03_BS_bio_pet_proj.tif",
    bioUTCI: "./data/raster/N03_BS_bio_utci_proj.tif",
  },
  N04: {
    airTemp: "./data/raster/N04_BS_ta_2m_proj.tif",
    tsurf: "./data/raster/N04_BS_tsurf_proj_degC.tif",
    bioPET: "./data/raster/N04_BS_bio_pet_proj.tif",
    bioUTCI: "./data/raster/N04_BS_bio_utci_proj.tif",
  },
};

export const geojsonBuildingUrlByRegion = {
  Parent: "./data/geojson/buildingParent.geojson",
  N02: "./data/geojson/buildingN02.geojson",
  N03: "./data/geojson/buildingN03.geojson",
  N04: "./data/geojson/buildingN04.geojson",
};

export const geojsonBoundaryUrl = {
  Parent: "./data/geojson/child_i.geojson",
  N02: "./data/geojson/child_iii.geojson",
  N03: "./data/geojson/child_ii.geojson",
  N04: "./data/geojson/child_iv_reduced.geojson",
};

// N00: Overall: Child I
// N02: International Montessorischule (top left): Child III
// N03: Neupesrlach Zentrum: (bottom right) Child II
// N04: Neuperlach Nord: (top right) Child IV


const baseUrl = "./data/images/raster";
const location = document.getElementById('locationSelector').value;
const scenario  = document.getElementById('scenarioSelector').value;
const variable = document.getElementById('variableSelector').value;

const fullUrl = `${baseUrl}/${location}_${scenario}_${variable}_proj.tif`;
// console.log(fullUrl);
