"use strict"

  //Initialize google map
  function initialize() {
    var mapOptions = {
      center: { lat: 52.3747158, lng: 4.8986231},
      zoom: 12
    };
    
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    addMarkers(map, Libraries);
  }

  var Libraries = [
    ["AMFI", 52.36018, 4.911421],
    ["DML", 52.3679411, 4.8057676],
    ["FB", 52.3157118, 4.9476349],
    ["KSH", 52.3590415, 4.908334],
    ["LWB", 52.3460498, 4.9161887],
    ["TBW", 52.2923388, 4.9627197]
  ];

  // Add markers to map
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

  function getData(filename){
    var data;
   
    d3.json("filename", function(error, json) {
      if (error) return console.warn(error);
      data = json;
      console.log(data);
      });

    return data;
  }

  //Create table from data (source: http://bl.ocks.org/d3noob/5d47df5374d210b6f651)
  function tabulate(data, columns) {
    var table = d3.select("body").append("table")
            .attr("style", "margin-left: 200px")
            .style("border-collapse", "collapse")// <= Add this line in
            .style("border", "2px black solid"), // <= Add this line in
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
            .html(function(d) { return d.value; });
    
    return table;
}

  
  //Create google map
  google.maps.event.addDomListener(window, 'load', initialize);
  // getData
  data_student = getData("teststudent.json");
  data_book = getData("testbook.json");
  // render the table
  var studentTable = tabulate(data, ["StudentID", "Date", "Time", "Title", "Barcode","Action","DueDate","Location"]);
  var bookTable = tabulate(data, ["User", "Date", "Time", "Title", "Barcode","Action","DueDate","Location"])