var url = "https://evening-mesa-81552.herokuapp.com/mapa";
var st_url = "https://evening-mesa-81552.herokuapp.com/mexican_states";
let cropurl = "https://evening-mesa-81552.herokuapp.com/estadocrop"



let estado = 'republica';
let crop = 'all';
let ecent = [24, -100];
let ez  = 5;

//initializing the map to show a map before filers ar used
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

//activating filters when clicking the button
d3.select("button").on("click",(d)=>{

  //removing the map and generating a new one
  map.remove();
  let mapdiv = d3.select(".mapbox").append("div").classed("row-fluid", true).attr("id", "map");
  mapdiv.append("img").attr("src", "//placehold.it/800x900")
    
  let estado = d3.select("#region").node().value;
  let crop = d3.select("#crop").node().value;
  let estmod = 'republica';
 

  let heat_rad= 12;
  let heat_blr= 15;

  

  //Removing accents from city names
  if (estado === 'Ciudad de México / DF'){
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

  //Generating the map
  d3.json(st_url).then(function(response) {
    let data = response.features;
    let st_lat=0;
    let st_lng=0;
    let lngth = 0;
    let statesize=0;

    //generating a center point on the state when selected
    data.forEach(a=>{
      if(a.properties.admin_name === estmod){
        statesize=a.properties.sqkm;
        let coord = a.geometry.coordinates[0][0];
        
        for (var i = 0; i < coord.length; i++) {
          st_lat += parseInt(coord[i][1]);
          st_lng += parseInt(coord[i][0]);
          lngth += 1;
        }
        
        
      }
    });
    console.log(statesize);
   
    cent_lat = st_lat/lngth;
    cent_lng = st_lng/lngth;
  

    // Starting Map with selected center and zoom, 
    // The if statement chooses between a selected state and the whole republic
    if(estmod === 'republica'){
      ecent = [24, -100];
      ez  = 5;
      heat_rad= 12;
      heat_blr= 15;
    }else if(parseInt(statesize)>50000){
      ecent=[cent_lat,	cent_lng];
      ez=7;
      heat_rad= 20;
      heat_blr= 20;
    } else if(parseInt(statesize)<50000&& parseInt(statesize)>6000){
      ecent=[cent_lat,	cent_lng];
      ez=8;
      heat_rad= 20;
      heat_blr= 20; 
    }else{
      ecent=[cent_lat,	cent_lng];
      ez=9;
      heat_rad= 20;
      heat_blr= 20;
    }

    // starting the map
    let myMap = L.map("map", {
      center: ecent,
      zoom: ez
    });
      

    //adding mapbox street lyer
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

        // generating arrays of data depending on the selection
        if(d.lat>0 && estado === 'republica' && crop=== 'all'){
          heatArray.push([d.lat, d.lng, d.sum*.000001]);
        }else if(d.lat>0 && estado === 'republica' && crop === d.cultivo){
          heatArray.push([d.lat, d.lng, d.sum*.005]);
        }else if(d.lat>0 && d.estado === estado && crop === 'all'){
          heatArray.push([d.lat, d.lng, d.sum*.005]);
        }else if(d.lat>0 && d.estado === estado && crop === d.cultivo){
          heatArray.push([d.lat, d.lng, d.sum*.005]);
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

  //Plots

    // plot 1
    d3.json(cropurl).then(function(response) {
      let resp= response;
      
      let topest=[];
      let topestado=[];
      let cropestado=[];
      let estadox=[];
      let estadoy=[];

      if (crop === 'all'){ 
        d3.select("#topProducer").text("Top producers of all crops");
          var result = [];
          resp.reduce(function(res, value) {
            if (!res[value.estado]) {
              res[value.estado] = { estado: value.estado, sum: 0 };
              result.push(res[value.estado]);
            }
            res[value.estado].sum += parseInt(value.sum);
            return res;
          }, {});

          result.forEach(d=>{
            topestado.push([d.estado, d.sum]);
          })

          topestado.sort(function compareFunction(first, second) {
            return second[1] - first[1];
          });

          topest = topestado.slice(0, 10);
          estadox = topest.map(topest =>  topest[0]);
          estadoy = topest.map(topest =>  topest[1])
        
      }else{
        d3.select("#topProducer").text(`Top states producers of ${crop}`);
        cropest=resp.forEach(v=>{
          if (crop===v.cultivo){
            cropestado.push(v)
          }
        });

        cropestado.forEach(d=>{
          topestado.push([d.estado, d.sum]);
        });

        topestado.sort(function compareFunction(first, second) {
          return second[1] - first[1];
        });

        topest = topestado.slice(0, 10);
        estadox = topest.map(topest =>  topest[0]);
        estadoy = topest.map(topest =>  topest[1]);
      }
     
    
      var trace1 = {
        x: estadox,
        y: estadoy,
        type: "bar"
      };
    
      var gdata = [trace1];
    
      var layout = {
        title: "",
        xaxis: { title: ""},
        yaxis: { title: "Production in MXP"}
       
      };
    
      Plotly.newPlot("plot1", gdata, layout);
    });

    // plot 2
    d3.json(cropurl).then(function(response) {
      let resp= response;
      var cult = [];
      

     if (estado === 'republica'){
      d3.select("#topCrop").text("Top crops in Mexico");
      var result1 = [];
      resp.reduce(function(res, value) {
        if (!res[value.cultivo]) {
          res[value.cultivo] = { cultivo: value.cultivo, sum: 0 };
          result1.push(res[value.cultivo])
        }
        res[value.cultivo].sum += value.sum;
        return res;
      }, {});
      
     } else{
      d3.select("#topCrop").text(`Top crops in tha state of ${estado} `);
       result1 = resp
      }
     
      // Selecting crop and crop value and puting them into an array
      result1.forEach(d=>{
        if(estado === 'republica'){
          cult.push([d.cultivo, d.sum]);
        } else if (d.estado === estado) {
          cult.push([d.cultivo, d.sum]);
        }
      });
    
      // Sort the array in descending order
      cult.sort(function compareFunction(first, second) {
        return second[1] - first[1];
      });
     

      //get tthe top 10
      let topcult=cult.slice(0, 10);
      let topcultivo = topcult.map(topcult =>  topcult[0]);
      let prodvalue= topcult.map(topcult =>  topcult[1]);

      //gernerate the plot with the data
      var trace1 = {
        x: topcultivo,
        y: prodvalue,
        type: "bar",
        prodvalue
      };
  
      var gdata = [trace1];
      var layout = {
        title: "",
        xaxis: { title: ""},
        yaxis: { title: "Production Value in MXP"}
      };
  
      Plotly.newPlot("plot2", gdata, layout);

    });
    
    if(estado ==='republica' && crop === 'all'){
      d3.select("#mapTt").text("Mexico heatmap of all crops");
    }else if(estado === 'republica'){
      d3.select("#mapTt").text(`Mexico heatmap of ${crop} crops`);
    }else if (crop === 'all'){
      d3.select("#mapTt").text(`Crops of the state of ${estado}`);
    }else{
      d3.select("#mapTt").text(`${crop} crop in the state of ${estado}`);
    }

});

//initial plot 1 
d3.json(cropurl).then(function(response) {
  let resp= response;
  let topest=[];
  let topestado=[];
  let estadox=[];
  let estadoy=[];

  var result = [];
  resp.reduce(function(res, value) {
    if (!res[value.estado]) {
      res[value.estado] = { estado: value.estado, sum: 0 };
      result.push(res[value.estado]);
    }
    res[value.estado].sum += parseInt(value.sum);
    return res;
  }, {});

  result.forEach(d=>{
    topestado.push([d.estado, d.sum]);
  });

  topestado.sort(function compareFunction(first, second) {
    return second[1] - first[1];
  });

  topest = topestado.slice(0, 10);
  estadox = topest.map(topest =>  topest[0]);
  estadoy = topest.map(topest =>  topest[1])
      
  var trace1 = {
    x: estadox,
    y: estadoy,
    type: "bar"
  };
    
  var gdata = [trace1];
    
  var layout = {
    title: "",
    xaxis: { title: ""},
    yaxis: { title: "Production in MXP"}
       
  };
    
  Plotly.newPlot("plot1", gdata, layout);   
});

// inital plot 2
d3.json(cropurl).then(function(response) {
  let resp= response;
  var cult = [];
  var result1 = [];

  resp.reduce(function(res, value) {
    if (!res[value.cultivo]) {
      res[value.cultivo] = { cultivo: value.cultivo, sum: 0 };
      result1.push(res[value.cultivo])
    }
    res[value.cultivo].sum += value.sum;
    return res;
  }, {}); 
      
  //generating an array in order to sort values
  result1.forEach(d=>{
    cult.push([d.cultivo, d.sum]); 
  });
    
  // Sort the array in descending order
  cult.sort(function compareFunction(first, second) {
    return second[1] - first[1];
  });
     

  //get tthe top 10
  let topcult=cult.slice(0, 10);
  let topcultivo = topcult.map(topcult =>  topcult[0]);
  let prodvalue= topcult.map(topcult =>  topcult[1]);

  //gernerate the plot with the data
  var trace1 = {
    x: topcultivo,
    y: prodvalue,
    type: "bar",
    prodvalue
  };
  
  var gdata = [trace1];
  var layout = {
    title: "",
    xaxis: { title: ""},
    yaxis: { title: "Production Value in MXP"}
    };
  
  Plotly.newPlot("plot2", gdata, layout);
});