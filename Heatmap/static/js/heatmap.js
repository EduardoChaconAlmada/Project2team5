var myMap = L.map("map", {
  center: [24, -100],
  zoom: 6
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://leonidesguerra.github.io/maps.html";

d3.json(url).then(function(response) {
  let data= response.data;
  var heatArray = [];
  // console.log(data)
  data.forEach(d=>{
    heatArray.push([d.lat, d.lng, d.sum*.000001]);
   // console.log(`lat:${d.lat}, long: ${d.lng}`)
  })
  
 

  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 20,
  }).addTo(myMap);

});
