mapboxgl.accessToken = mapToken;
mapboxgl.accessToken =
  "pk.eyJ1IjoiY29kZXItdmlrYXNoIiwiYSI6ImNtYnBid3FuMTAycTQyaXFzcm42dzl1Y28ifQ.sIGmPpwmCJLjOBKn_Ig1AA";
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${listing.location}</h3> <p>Exect location provide after booking</p> `
    )
  )
  .addTo(map);
