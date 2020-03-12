import '../styles/main.css';
import * as CONFIG from './config';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

const OPENCAGE_API = `https://api.opencagedata.com/geocode/v1/json?pretty=1&key=${CONFIG.OPENCAGEAPIKEY}&q=`;

const MAPBOX_CONFIG = {
  container: 'app',
  center: [3.7174243,51.0543422],
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 10
};

function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

const app = {
  init() {
    // init mapbox
    mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;
    this._map = new mapboxgl.Map(MAPBOX_CONFIG);

    // cache elements
    this.cacheDOMElements();
    this.cacheDOMEvents();

    // get current location
    this.getCurrentLocation()
      .then(coords => {
        // add first marker
        this.addMarker(coords);
        this._map.flyTo({
          center: coords
        })
      });
  },
  async getCurrentLocation() {
        try {
          const { coords } = await getCurrentPosition();
          const { latitude, longitude } = coords;

          return([longitude, latitude]);
      } catch (error) {
          console.error(error);
      }
  },
  async fetchLocationCoordinates(address) {
    const fetch_url = OPENCAGE_API + encodeURI(address);
    console.log(fetch_url);
    const response = await fetch(fetch_url)
    const data = await response.json();
    if(data.status.code == 200 && data.results.length > 0) {
      const {lat, lng} = data.results[0].geometry;
      return([lng, lat]);
    }
    else {
      alert('Adres niet gevonden');
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
    this.$app = document.querySelector('#app');
    this.$inputAddress = document.querySelector('#address');
    this.$buttonMagic = document.querySelector('#magic');
  },
  cacheDOMEvents() {
      this.$buttonMagic.addEventListener('click', (e) => {
        e.preventDefault();
        const address = this.$inputAddress.value;
        this.fetchLocationCoordinates(address)
          .then((coords) => {
            this.addMarker(coords);
          })
        
    });
  }
};

app.init();