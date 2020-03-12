import '../styles/main.css';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiZi1yb2dlcnMiLCJhIjoiY2p2MHFiem1iMTJhODN5bzRvenMwOWc0NSJ9.hAcN6R50XcaUwh0NI98Ifw';
var map = new mapboxgl.Map({
  container: 'app',
  style: 'mapbox://styles/mapbox/streets-v11'
});


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const long = position.coords.longitude;
    const lat = position.coords.latitude;

    const marker = document.createElement('div');
    marker.className = 'marker';

    new mapboxgl.Marker(marker)
      .setLngLat([long, lat])
      .addTo(map);
  });
} else {
  console.log('Je browser is waarschijnlijk te oud');
}