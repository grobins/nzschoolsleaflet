
var map = L.map('mymap').setView([-36.722090134845, 174.706185486179], 10); 
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(map);

var currLocationMarker = {
  radius: 10,
  fillColor: "#FF0000",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

//  Address search, center map, add marker
var initAF = function(){
  var widget = new AddressFinder.Widget(document.getElementById('search_field'), 'X6HTCFRWJ3BAKYN94PUQ','NZ');

  widget.on("result:select", function(value, item) {
    map.setView([item.y, item.x], 15);
    L.circleMarker([item.y, item.x], currLocationMarker).addTo(map);;
  });
};
(function(f){
  var script = document.createElement('script');
  script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
  script.async = true;
  script.onload = f;
  document.body.appendChild(script);
})(initAF);


getGeoJSON = function(object){
  $.ajax({
    type: "GET",
    url: 'data/schools.geojson',
    dataType: 'json',
    success: function (response) {
      createMap(response);
      console.log('got the data');
    },
    error: function (request, status, error) {
      console.log('There was an error');
    }
  });
} 


var createMap = function(geojsondata){

    var geojsonMarkerOptions = {
      radius: 6,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    var schoolsLayer = L.geoJson(geojsondata, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    }).addTo(map);

    schoolsLayer.eachLayer(function (layer) {
      layer.bindPopup('<strong>' + layer.feature.properties.Name + '</strong>', { closeButton: false });
    }).addTo(map);

    schoolsLayer.on('mouseover', function (e) {
      e.layer.openPopup();
    });

    map.on('click', function (e) {
      var clickedMarker = turf.point([e.latlng.lng, e.latlng.lat]);
      var nearestSchool = turf.nearest(clickedMarker, geojsondata);
      console.log(nearestSchool.properties.Name)
    });

}

getGeoJSON();
