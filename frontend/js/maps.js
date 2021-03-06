$(function(){
  Morris.Area({
      element: 'morris-area-chart',
      pointSize: 2,
      hideHover: 'auto',
      resize: true
  });
});
var hasAdded = false;
var clusterClicked = false;
var locations = [];
var names = [];
var totalConnections = [];
var marker;
var gotLocation = false;

jQuery.ajax({
  type: 'GET',
  url: 'http://74.208.84.27:4000/locations',
  contentType: 'application/json; charset=utf-8',
  success: function(json){
    console.log(json);
    for(i = 0; i < json.length; i++) {
      var latVal = json[i].latitude;
      var lngVal = json[i].longitude;
      totalConnections[i] = 0;
      locations[i] = {lat: latVal, lng: lngVal}
      names[i] = json[i].name;

      if(typeof json[i].connections != "undefined"){
        for(j = 0; j < json[i].connections.length; j++){
          totalConnections[i] += json[i].connections[j].new + json[i].connections[j].returning;
        }
      }

      updateTable(json[i]);
    }

    createDonut();
    initMap();
  }
});

var docName = document.getElementById("name");
var ssid = document.getElementById("ssid");
var password = document.getElementById("password"); //totally not unecrypted....
var lat = document.getElementById("lat");
var lon = document.getElementById("lon"); // we would NEVERRRR do that....
var pin = document.getElementById("pin");
var submit = document.getElementById("addLocation");
var remove = document.getElementById("removeLocation");
var update = document.getElementById("update");
remove.disabled = true;
update.disabled = true;
var x = 39.828149;
var y = -98.579544;

function createDonut(){

  var items = [];
  for(i = 0; i < names.length; i++){
    items[i] = {"label":names[i], "value":totalConnections[i]};
  }

  console.log(items);
  Morris.Donut({
      element: 'morris-donut-chart',
      data: items,
      resize: true
  });
}

function updateTable(data) {
  var tr = $(document.createElement('tr'));
  tr.append( $(document.createElement('td')).text(data.name) );
  tr.append( $(document.createElement('td')).text(data.ssid) );
  tr.append( $(document.createElement('td')).text(data.password) );
  tr.append( $(document.createElement('td')).text(data.latitude.toFixed(7)) );
  tr.append( $(document.createElement('td')).text(data.longitude.toFixed(7)) );
  tr.click(data, changeGraphs);
  $("#location-table").append(tr);
}

function changeGraphs(event){
  //clear areas
  $('#morris-area-chart').html('');
  $('#connect-info').find("tr:gt(0)").remove();

  //area chart
  Morris.Area({
      element: 'morris-area-chart',
      data: event.data.connections,
      xkey: 'date',
      ykeys: ['new', 'returning'],
      labels: ['New Connections', 'Returning Connections'],
      pointSize: 2,
      hideHover: 'auto',
      resize: true,
      parseTime: false,
      behaveLikeLine: true
  });

  //connection information
  $.ajax({
      url: "http://74.208.84.27:4000/location/devices",
      data:{
        "latitude": event.data.latitude,
        "longitude": event.data.longitude
      },
      type: 'POST',
      success: function (response){
          //update table data
          console.log("grabbing ip and mac");
          console.log(response);
          $.each(response, function(i, item){
              var tr = $(document.createElement('tr'));
              tr.append( $(document.createElement('td')).text(item.mac) );
              tr.append( $(document.createElement('td')).text(item.ip) );
              $("#connect-info").append(tr);
          });
      }
  });
}

function initMap() {
  var map;
if(!gotLocation){
  console.log("getting location");
  gotLocation = true;
  getLocation();
}
if (!hasAdded){
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: x, lng: y}
  });
} else{
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: locations[locations.length - 1]
  });
}

marker = new google.maps.Marker({
  map: map,
  position:  new google.maps.LatLng(0,0),
  draggable:true,
  visible:false
});

map.addListener('click', function(event) {
  lat.value = Number(event.latLng.lat()).toFixed(7);
  lon.value = Number(event.latLng.lng()).toFixed(7);
  marker.setPosition(event.latLng);
  if(!clusterClicked){
    marker.setVisible(true);
  }
  clusterClicked = false;
  resetFields();
  setButtons(true);

});
marker.addListener('drag', function(event){
  lat.value = Number(event.latLng.lat()).toFixed(7);
  lon.value = Number(event.latLng.lng()).toFixed(7);
  setButtons(true);
});


// Add some markers to the map.
// Note: The code uses the JavaScript Array.prototype.map() method to
// create an array of markers based on a given "locations" array.
// The map() method here has nothing to do with the Google Maps API.
var markers = locations.map(function(location, i) {
  //console.log(location);
  var newMarker = new google.maps.Marker({
    position: location,
    label: names[i]
  });
  newMarker.addListener('click', function(event){
    $.ajax({
      type: 'POST',
      url: 'http://74.208.84.27:4000/location',
      data: { latitude: Number(newMarker.getPosition().lat()).toFixed(7),
        longitude: Number(newMarker.getPosition().lng()).toFixed(7),
      },
      success: function(json){
        console.log("new" + json);
        console.log(json.latitude);
        lat.value = json.latitude;
        lon.value = json.longitude;
        ssid.value = json.ssid;
        docName.value = json.name;
        password.value = json.password;
        setButtons(false);
        marker.setVisible(false);
      }
    });
  });
  return newMarker;
});

// Add a marker clusterer to manage the markers.
var markerCluster = new MarkerClusterer(map, markers,
  {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

  markerCluster.addListener('clusterclick', function(cluster) {
    clusterClicked = true;
    marker.setVisible(false);
  });
}

$('#addLocation').click(function(){
  //var encrypted = CryptoJS.AES.encrypt(password.value.toString(), pin.value.toString());
  $.ajax({
    type: 'POST',
    url: 'http://74.208.84.27:4000/location/create',
    data: { name: $('#name')[0].value,
    ssid: $('#ssid')[0].value,
    password: $('#password')[0].value,
    latitude: Number($('#lat')[0].value).toFixed(7),
    longitude: Number($('#lon')[0].value).toFixed(7),
  },
  success: function(result){
    //e.preventDefault();
    console.log(this.data);
    console.log(result);
    if (result['errors'] == null) {
      var latitude = parseFloat(lat.value);
      var longitude = parseFloat(lon.value);
      locations[locations.length] = {lat: parseFloat(Number(latitude).toFixed(7)), lng: parseFloat(Number(longitude).toFixed(7))};
      names[names.length] = docName.value;
      hasAdded = true;
      resetFields();
      initMap();
      updateTable(result);
    }
    else {
      var text = "Error Adding to Map! \nThe following fields were empty:\n"
      for (var key in result['errors']) {
        text = text + key + "\n";
      }
      alert(text);
    }
  }
});
});

$('#update').click(function(){
  $.ajax({
    type: 'PUT',
    url: 'http://74.208.84.27:4000/location/update',
    data: { name: $('#name')[0].value,
    ssid: $('#ssid')[0].value,
    password: $('#password')[0].value,
    latitude: Number($('#lat')[0].value).toFixed(7),
    longitude: Number($('#lon')[0].value).toFixed(7),
  },
  success: function(result){
    var latitude = parseFloat(lat.value);
    var longitude = parseFloat(lon.value);
    var loc = {lat: latitude, lng: longitude};
    var index = checkLocation(loc);
    if(index > -1){
      names[index] = docName.value;
    } else {
      console.log("you dun messed up");
    }
    initMap();
  }
});
});

$('#removeLocation').click(function(){
  $.ajax({
    type: 'DELETE',
    url: 'http://74.208.84.27:4000/location/delete',
    data: { latitude: Number($('#lat')[0].value).toFixed(7),
    longitude: Number($('#lon')[0].value).toFixed(7),
  },
  success: function(result){
    var latitude = parseFloat(lat.value);
    var longitude = parseFloat(lon.value);
    var loc = {lat: latitude, lng: longitude};
    index = checkLocation(loc);
    console.log({lat: latitude, lng: longitude});
    console.log(locations);
    if(index > -1){
      locations.splice(index,1);
      names.splice(index,1);
      initMap();
    } else {
      console.log("remove not found");
    }
  }
});
});

$('#lat').on('input', function(){
  setMarkerLocation();
});
$('#lon').on('input', function(){
  setMarkerLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    x = position.coords.latitude;
    y = position.coords.longitude;
    initMap();
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

function setMarkerLocation(){
  var latitude = parseFloat(lat.value);
  var longitude = parseFloat(lon.value);
  marker.setPosition({lat: parseFloat(Number(latitude).toFixed(7)), lng: parseFloat(Number(longitude).toFixed(7))})
}

function checkLocation(location) {
  for(i = 0; i < locations.length; i++){
    if(locations[i].lat == location.lat && locations[i].lng == location.lng){
      return i;
    }
  }
  return -1;
}

function resetFields(){
  docName.value = "";
  ssid.value = "";
  password.value = "";
}

function setButtons(bool){
  remove.disabled = bool;
  update.disabled = bool;
  submit.disabled = !bool;
  lat.disabled = !bool;
  lon.disabled = !bool;
}
