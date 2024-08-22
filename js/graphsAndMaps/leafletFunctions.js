// Function to add fullscreen control to the map
export function addFullscreenControl(map) {
    L.control.fullscreen({
      position: 'topleft',
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      }
    }).addTo(map);
  }

// Function to add north arrow control to the map
export function addNorthArrowControl(map) {
    const NorthControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      onAdd: function (map) {
        const container = L.DomUtil.create('div', 'north-arrow-control');
        const img = L.DomUtil.create('img', '', container);
        img.src = './data/logo/northArrow.png';
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.pointerEvents = 'none';
        return container;
      }
    });
    map.addControl(new NorthControl());
  }