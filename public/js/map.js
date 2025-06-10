mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  // center: listings.geometry.coordinates,
  center: [77.209, 28.6139], // starting position [lng, lat]. Note that lat m
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  // .setLngLat(listing.geometry.coordinates)
  // .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4> <p>Exect location provide after booking</p> `
    )
  )
  .addTo(map);
