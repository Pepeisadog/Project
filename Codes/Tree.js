"use strict"
function onload(){
	var data = {
	  "name": "Bibliotheek HvA",
	  "children": [
	  {
	    "name":"KSH",
	    "children": [
	      {"name":"Math"},
	      {"name":"Philosophy"}
	    ]
	  },
	  {
	    "name":"AMFI",
	    "children":[
	    {
	      "name":"Research Methods",
	      "children": [
	        {"name":"Foundations of futures studies"}
		    ]
	    },
	    {"name":"Pop Culture"}
	    ]
	  }
	  ]
	};

	var margin = {top: 20, right: 120, bottom: 20, left: 120},
 		width = 960 - margin.right - margin.left,
 		height = 600 - margin.top - margin.bottom;

	var i = 0;

	// make svg canvas
	var canvas = d3.select("#treemap").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// make tree canvas
	var tree = d3.layout.tree()
		.size([height, width]);

	console.log("tree!") 

	// create diagonals to draw links
	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	// define the top level of the tree/array
	var root = data[0];

	// draw tree
	drawTree(root);

	// draw tree function
	function drawTree(){

		// create nodes
		var nodes = tree.nodes(root).reverse;

		// create target and source, store in links
		var links = tree.links(nodes);

		// Normalize for fixed-depth.
  		nodes.forEach(function(d) { d.y = d.depth * 180; })

  		 // create the nodes
  		var node = svg.selectAll("g.node")
   			.data(nodes, function(d) { return d.id || (d.id = ++i); });

		/*//create nodes
		var node = canvas.selectAll(".node")
			.data(nodes)
			.enter()
			.append("g")
				.attr("class","node")
				//apply transform function to display correctly on screen
				.attr("transform", function(d) { return "translate(" + margin.left + "," + margin.top + ")";});*/

	  	// enter the nodes.	
  		var nodeEnter = node.enter().append("g")
   			.attr("class", "node")
   			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		// create circles for nodes
		nodeEnter.append("circle")
			.attr("r","5")
			.attr("fill","steelblue");

		// create the links
		var link = svg.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

		// enter the links
		link.enter().insert("path","g")
			.attr("class","link")
			.attr("d", diagonal);
	}
}