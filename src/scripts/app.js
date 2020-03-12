import '../styles/main.css';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');


const MAPBOX_TOKEN = 'pk.eyJ1IjoiZi1yb2dlcnMiLCJhIjoiY2p2MHFiem1iMTJhODN5bzRvenMwOWc0NSJ9.hAcN6R50XcaUwh0NI98Ifw';
const MAPBOX_CONFIG = {
  container: 'app',
  style: 'mapbox://styles/mapbox/streets-v11'
};

function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

const app = {
  init() {
    // init mapbox
    mapboxgl.accessToken = MAPBOX_TOKEN;
    this._map = new mapboxgl.Map(MAPBOX_CONFIG);

    // cache elements
    this.cacheDOMElements();

    // get current location
    this.getCurrentLocation()
      .then(coords => {
        this.addMarker(coords);
      });
  },
  async getCurrentLocation() {
        try {
          const { coords } = await getCurrentPosition();
          const { latitude, longitude } = coords;

          return([longitude, latitude]);
          // Handle coordinates
      } catch (error) {
          // Handle error
          console.error(error);
      }
  },
  addMarker(coordinates) {
    const marker = document.createElement('div');
    marker.className = 'marker';
    
    new mapboxgl.Marker(marker)
      .setLngLat(coordinates)
      .addTo(this._map);
  },
  cacheDOMElements() {
    this.$app = document.querySelector('app');
  }
};

app.init();






// https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=...';