
var hasAdded = false;
var locations = [];

jQuery.ajax({
  type: 'GET',
  url: 'http://74.208.84.27:4000/locations',
  contentType: 'application/json; charset=utf-8',
  success: function(json){
    console.log(json);
    for(i = 0; i < json.length; i++) {
      var latVal = json[i].latitude;
      var lngVal = json[i].longitude;
      locations[i] = {lat: latVal, lng: lngVal}
    }
    initMap();
  }
});

var lat = document.getElementById("lat");
var lon = document.getElementById("lon");

function initMap() {
  var map;
  //if (!hasAdded){
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: {lat: 28.7868114, lng: -103.8977777}
    });
  /*} else{
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: locations[locations.length - 1]
    });
  }*/

  var marker = new google.maps.Marker({
    map: map,
    position:  new google.maps.LatLng(0,0),
    draggable:true,
    visible:false
  });

  map.addListener('click', function(event) {
    lat.value = event.latLng.lat();
    lon.value = event.latLng.lng();
    marker.setPosition(event.latLng);
    marker.setVisible(true);
  });
  marker.addListener('drag', function(event){
    lat.value = event.latLng.lat();
    lon.value = event.latLng.lng();
  });


  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "locations" array.
  // The map() method here has nothing to do with the Google Maps API.
  var markers = locations.map(function(location, name) {
    console.log(location);
    return new google.maps.Marker({
      position: location,
      label: "" // TODO add label?
    });
  });

  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  }

  $('#addLocation').click(function(e){
    e.preventDefault();
    var latitude = parseFloat(lat.value);
    var longitude = parseFloat(lon.value);
    locations[locations.length] = {lat: latitude, lng: longitude};
    hasAdded = true;
    initMap();
  });
