"use strict"
console.log("load");

var data = [
{
  "name": "Bibliotheek HvA",
  "value": 85,
  "children": [
  {
    "name":"KSH",
    "value": 50,
    "children": [
      {"name":"Math",
  		"value": 4 },
      {"name":"Philosophy",
  		"value": 1}
    ]
  },
  {
    "name":"AMFI",
    "value": 6,
    "children":[
    {
      "name":"Research Methods",
      "value": 0.5,
      "children": [
        {"name":"Foundations of futures studies"}
	    ]
    },
    {"name":"Pop Culture",
	 "value": 0.3}
    ]
  }
  ]
}];
console.log(data);

// book circulation data
var dataBook = [
  {
    "User":"CIRCAMFI",
    "Date":"8-1-2015",
    "Time":"11:02",
    "Title":"Foundations of futures studies",
    "Barcode":"HV008698",
    "Action":"IntIBL",
    "DueDate":"none",
    "Location":"AMFI"
  },
  {
    "User":"CIRCKSH",
    "Date":"7-1-2015",
    "Time":"16:43",
    "Title":"Foundations of futures studies",
    "Barcode":"HV008698",
    "Action":"IntIBL",
    "DueDate":"none",
    "Location":"KSH"
  },
  {
    "User":"Student",
    "Date":"7-1-2015",
    "Time":"16:43",
    "Title":"Foundations of futures studies",
    "Barcode":"HV008698",
    "Action":"Regular return",
    "DueDate":"12-1-2015",
    "Location":"KSH"
  },
  {
    "User":"Student",
    "Date":"17-12-2014",
    "Time":"14:32",
    "Title":"Foundations of futures studies",
    "Barcode":"HV008698",
    "Action":"Web renewal",
    "DueDate":"12-1-2015",
    "Location":"AMFI"
  },
  {
    "User":"Student",
    "Date":"16-11-2014",
    "Time":"09:38",
    "Title":"Foundations of futures studies",
    "Barcode":"HV008698",
    "Action":"Loan",
    "DueDate":"18-12-2014",
    "Location":"AMFI"
  },
  {
    "User":"Student",
    "Date":"17-7-2014",
    "Time":"13:11",
    "Title":"Foundations of futures studies",
    "Barcode":"HV008698",
    "Action":"Regular return",
    "DueDate":"3-8-2014",
    "Location":"AMFI"
  },
  {
    "User":"Student",
    "Date":"5-7-2014",
    "Time":"11:39",
    "Title":"Foundations of futures studies",
    "Barcode":"HV008698",
    "Action":"Loan",
    "DueDate":"3-8-2014",
    "Location":"AMFI"
  }
];

function onload(){

	// create tree diagram
	var info = treeDiagram();
	var margin = info[0];
	var tree = info[1];
	var i = info[2];
	var diagonal = info[3]
	var canvas = info[4] 
	var root = info[5]

	// draw tree
	drawTree(tree, root, canvas, i, diagonal);

	// draw table
	tabBook(dataBook,["User", "Date", "Time", "Title", "Barcode","Action","DueDate","Location"]);

	//draw graph

}

function treeDiagram(){
	// source: http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
	var margin = {top: 120, right: 200, bottom: 0, left: 200},
 		width = 1200 - margin.right - margin.left,
 		height = 800 - margin.top - margin.bottom;

	var i = 0;	

	// make tree canvas
	var tree = d3.layout.tree()
		.size([height, width]);

	// create diagonals to draw links
	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.x, d.y]; });

	// make svg canvas
	var canvas = d3.select("#treemap").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// define the top level of the tree/array
	var root = data[0];

	return [margin, tree, i, diagonal, canvas, root];
}

// draw tree function
function drawTree(tree, root, canvas, i, diagonal){

	// create nodes
	var nodes = tree.nodes(root);

	// get target and source, store in links
	var links = tree.links(nodes);

	// normalize for fixed-depth of nodes
	nodes.forEach(function(d) { d.y = d.depth * 100; });

		// initiate the nodes
		var node = canvas.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });

  	// enter the nodes.	
		var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			//apply transform function to display correctly on screen
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	// create circles for nodes
	nodeEnter.append("circle")
		.attr("r", function(d) { return d.value; })
		.attr("fill","steelblue");

	// create the links
	var link = canvas.selectAll("path.link")
		.data(links, function(d) { return d.target.id; });

	// enter the links
	link.enter().insert("path","g")
		.attr("class","link")
		.attr("d", diagonal);

	// append & enter node labels
	nodeEnter.append("text")
		.attr("y", function(d){ return d.children || d._children ?  -18 : 18 })
		.attr("dy",".35em")
		.attr("text-anchor", "middle")
		.text(function(d) { return d.name; })
		.style("fill-opacity", 1);
}

//Create table from data function (source: http://bl.ocks.org/d3noob/5d47df5374d210b6f651)
function tabBook(data, columns) {
    var table = d3.select("#treemap").append("table")
            .attr("id", "BookTable")
            .attr("class","table")
            .style("border-collapse", "collapse")
            .style("border", "2px black solid"), 
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; })
            .attr("style", "font-family: Courier")
            .style("border", "1px black solid");

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
        .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; })
            .style("border", "1px black solid");
   
    return table;
}

function drawGraph(){

}