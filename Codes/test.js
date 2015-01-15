"use strict"

// make svg canvas
var canvas = d3.select("#div").append("svg")
	.attr("width", 500)
	.attr("height", 500)
	.append("g")
		.attr("transform","translate(50,50)");
console.log("svg")