"use strict"
  
  //Initialize map
  function initialize() {
    var mapOptions = {
      center: { lat: 52.3747158, lng: 4.8986231},
      zoom: 12
    };
    
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    addMarkers(map, Libraries);

    $(document).ready( function () {
        $('#table_id').DataTable();
    } );
  }

  var Libraries = [
    ["AMFI", 52.36018, 4.911421],
    ["DML", 52.3679411, 4.8057676],
    ["FB", 52.3157118, 4.9476349],
    ["KSH", 52.3590415, 4.908334],
    ["LWB", 52.3460498, 4.9161887],
    ["TBW", 52.2923388, 4.9627197]
  ];

  function addMarkers(map, locations){
    
    /*//Initialize marker symbol https://developers.google.com/maps/documentation/javascript/examples/icon-complex
    var image = {
      url: 'book1.jpg',
      // This marker is 20 pixels wide by 17 pixels tall.
      size: new google.maps.Size(20, 17),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,17.
      anchor: new google.maps.Point(0, 17)
    }

    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
    };*/

    for (var i = 0; i < locations.length; i++) {
      var library = locations[i];
      var myLatLng = new google.maps.LatLng(library[1], library[2]);
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: library[0],
        zIndex: library[3]
        });
    }  
  }

  google.maps.event.addDomListener(window, 'load', initialize);