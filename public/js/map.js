
  mapboxgl.accessToken = mapToken;
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY29kZXItdmlrYXNoIiwiYSI6ImNtYnBid3FuMTAycTQyaXFzcm42dzl1Y28ifQ.sIGmPpwmCJLjOBKn_Ig1AA";
  const map = new mapboxgl.Map({
    container: "map", // container ID
    center: [77.2088, 28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9, // starting zoom
  });
