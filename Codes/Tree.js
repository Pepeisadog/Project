"use strict"

/*// create diagonals
var diagonal = d3.svg.diagonal()
	.source()
	.target()

canvas.append("path")
	.attr("fill","none")
	.attr("stroke","black")
	.attr("d",diagonal);*/

queue()
	.defer(d3.json,"../Data/DummyTree.json")
	.awaitAll(ready);

function ready(error, results){
	var data = results

	// make svg canvas
	var canvas = d3.select("body").append("svg")
		.attr("width", 500)
		.attr("height", 500)
		.append("g")
			.attr("transform","translate(50,50)");

	var tree = d3.layout.tree()
		.size([400,400])

	// create nodes
	var nodes = tree.nodes(data);
	console.log(nodes)

	// create target and source, store in links
	var links = tree.links(nodes);
	console.log(links)

	// cretae circles for nodes
	var node = canvas.selectAll(".node")
		.data(nodes)
		.enter()
		.append("g")
			.attr("class","node")
			//apply transform function to display correctly on screen
			.attr("transform", function(d) { return "translate(" +d.x + "," + d.y + ")";});

	node.append("circle")
		.attr("r","5")
		.attr("fill","steelblue");

}