// Define URL list object
export const geotiffUrlByRegion = {
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
    },
    N04: {
      airTempProjBS:  "./data/raster/BS_ta_2m_proj_N04.tif",
      tsurfProjBS:    "./data/raster/BS_tsurf_proj_N04.tif",
      bioPETProjBS:   "./data/raster/BS_bio_pet_proj_N04.tif",
      bioUTCIProjBS:  "./data/raster/BS_bio_utci_proj_N04.tif"
    }
  };

export const geojsonBuildingUrlByRegion = {
  N02: "./data/buildingN02.geojson",
  N03: "./data/buildingN03.geojson",
  N04: "./data/buildingN04.geojson",
}

export const geojsonBoundaryUrl = {
  Parent: "./data/geojson/child_i.geojson",
  N02: "./data/geojson/child_iii.geojson",
  N03: "./data/geojson/child_ii.geojson",
  N04: "./data/geojson/child_iv_reduced.geojson",
}

// N00: Overall: Child I
// N02: International Montessorischule (top left): Child III
// N03: Neupesrlach Zentrum: (bottom right) Child II
// N04: Neuperlach Nord: (top right) Child IV