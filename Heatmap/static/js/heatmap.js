var url = "https://leonidesguerra.github.io/mapa";
var st_url="https://leonidesguerra.github.io/mexican_states";


// Variables  that will pull data from the dropdown
var estado = 'Veracruz';
let crop = 'Naranja';
var estmod = 'Republica';


var heat_rad= 12;
var heat_blr= 15;


//Removing accents from city names
if (estado === 'Ciudad de México'){
  estmod = 'Distrito Federal';
  } else if(estado === 'Michoacán'){
    estmod = 	'Michoacan';
  } else if(estado == 'México'){
    estmod = 'Mexico';
  } else if (estado === 'Nuevo León'){
    estmod = 'Nuevo Leon';
  } else if (estado === 'Querétaro'){
    estmod = 'Queretaro';
  } else if ( estado === 'San Luis Potosí'){
    estmod = 'San Luis Potosi';
  } else if (estado === 'Yucatán'){
    estmod = 'Yucatan';
  } else {estmod = estado}



var cent_lat = 0;
var cent_lng = 0;

//locate thestate center in order to center the map
d3.json(st_url).then(function(response) {
  let data = response.features;
  let st_lat=0;
  let st_lng=0;
  var coord = [];
  let lngth = 0;
  
  data.forEach(a=>{
    if(a.properties.admin_name === estmod){
      let coord = a.geometry.coordinates[0][0];

      for (var i = 0; i < coord.length; i++) {
        st_lat += parseInt(coord[i][1]);
        st_lng += parseInt(coord[i][0]);
        console.log(coord[i][0]);
        lngth += 1;
      }
    }
  });

  cent_lat = st_lat/lngth;
  cent_lng = st_lng/lngth;
  

  // Starting Map with selected center and zoom, 
  // The if statement chooses between a selected state and the whole republic
  if(estmod === 'Republica'){
    ecent = [24, -100];
    ez  = 5;
    heat_rad= 12;
    heat_blr= 15;
    } else if(estmod === 'Tamaulipas'|| estmod ==='Coahuila'|| estmod ==='Chihuahua'|| estmod ==='Sonora'){
      ecent=[cent_lat,	cent_lng];
      ez=6;
      heat_rad= 20;
      heat_blr= 20;
      } else{
        ecent=[cent_lat,	cent_lng];
        ez=7;
        heat_rad= 20;
        heat_blr= 20; 
      }

  let myMap = L.map("map", {
    center: ecent,
    zoom: ez
  });


  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);



  //heatmap array
  d3.json(url).then(function(response) {
    let data= response;
    var heatArray = [];
  // console.log(data)
    data.forEach(d=>{
    
  // choosing from dropdown menu
    if(d.lat>0 && estado === 'Republica' && crop=== 'all'){
      heatArray.push([d.lat, d.lng, d.sum*.000001]);
    }else if(d.lat>0 && estado === 'Republica' && crop === d.cultivo){
      heatArray.push([d.lat, d.lng, d.sum*.0001]);
    } else if(d.lat>0 && d.estado === estado && crop === 'all'){
      heatArray.push([d.lat, d.lng, d.sum*.0001]);
    
    } else if(d.lat>0 && d.estado === estado && crop === d.cultivo){
      heatArray.push([d.lat, d.lng, d.sum*.0001]);
    }
  });
  

  var heat = L.heatLayer(heatArray, {
    radius: heat_rad,
    blur: heat_blr,
  }).addTo(myMap);

});

//drawing state boundary polygon
d3.json(st_url).then(function(response) {
  let data = response.features;
  var outline =[];
  var coord = [];

  data.forEach(a=>{
    if(a.properties.admin_name === estmod){
      let coord= a.geometry.coordinates[0][0];
      
      coord.forEach(c=>{
        outline.push([c[1], c[0]]);
      });
    }
  });

  L.polygon(outline, {
    color: "blue",
    fillColor: "yello",
    fillOpacity: 0.15
  }).addTo(myMap);
});





});



