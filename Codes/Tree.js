"use strict"

// Main function:
function ready(error, results){

	// This function initilizes the webpage when Tree.html 
	// and the data from the queue is loaded

	// store treemap data
	var data = results;

	// define the top level of the tree/array
	root = data[0];
	root.x0 = viewerHeight /2;
	root.y0 = viewerWidth/2;

    // layout the tree initially and center on the root node.
    tree.nodes(root).forEach(function(d) { click(d); });

	// update tree
	update(root);

	// draw map
	drawMap();
}

// Draw functions:
function update(source){

	// This function draws a treemap based upon a treemap json file.
	// this function is called at the beginning and after every click event
	// source: http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html

	// calculate new tree size
	updateTree();

	// define tooltip (source: http://bl.ocks.org/Caged/6476579)
	var tip = d3.tip()
		.attr("id","treetooltip")
		.attr("class", "tooltip")
		.direction(function(d){
			if (d.type == "parent") {
				return "n";
			}
			else{
				return "w";
			}
		})
		.offset(function(d){
			if(d.type == "parent"){
				return [-20, 0]
			}
			else {
				return [0, -30];
			}
		})
		.html(function(d){
			if (d.type == "parent"){
				return "<strong> Total Books: </strong>85.210" 
						+"<br>" +"<strong> Locations: </strong>6"
						+"<br>" +"<strong> Members: </strong>54.000";
			}
			if (d.type =="book"){
				return "<strong> Title: </strong>" + d.name + "<br>" +
						"<strong> Copies: </strong>" + d.copies + "<br>" +
						"<strong> Click to show circulation history! </strong>";
			}
			if (d.type =="domain"){
				return "<strong> Domain: </strong>" + d.name; 
			}
			if (d.type =="category"){
				return "<strong> Category: </strong>" + d.name;
			}
		});

	// compute the new tree layout
	var nodes = tree.nodes(root);

	// get target and source, store in links
	var links = tree.links(nodes);

	// normalize for fixed-depth of nodes
	nodes.forEach(function(d) {
		return d.y = (d.depth*1.5) * 120; 	
	});

	// update the nodes with their (new) id's
	var node = container.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

  	// Enter any new nodes at the parents previous position.	
	var nodeEnter = node.enter().append("g")
		.attr("class", "node")
		//apply transform function to display correctly on screen
		.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		.on("click", click);

	// create circles for nodes
	nodeEnter.append("circle")
		.attr("r", function(d) { return d.value})
		.attr("stroke", "silver")
		.attr("fill", function(d) { 
			if (d._children){ 
				return "#b0c0de"; 
			}
			else{ 
				return "#ebeff6";
			};
		});

	// append & enter node labels
	nodeEnter.append("text")
		.attr("class", "nodeLabels")
		.attr("y", function(d){
			if ((d.type == "domain")||(d.type == "category")){
				return -10;
			}
			else{
				return 0;
			}
		})
		.attr("dx", "0.7em")
		.attr("text-anchor", function(d){
			if (d.type == "book"){
				return "left";
			}
			else{
				return "middle";
			}
		})
		.style("font-family", "Courier")
		.text(function(d) { return d.name;})
		.style("fill-opacity", 1)
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.style("text-decoration", function(d){
			if (d.type =="book"){
				return "underline";
			}
		})
		.style("font-size", function(d){
			if (d.type =="book"){
				return "8px";
			}
		})
		.attr("id", function(d){
			if(d.type=="book"){
				return "clickBook";
			};
		})
		.on("click", function(d){
			var ids = d3.select(this).attr("id");
			callSVG(ids); })				

	// Transition nodes to their new position
	var nodeUpdate = node.transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"});

	nodeUpdate.select("circle")
		.attr("r", function(d) {return d.value})
		.style("fill", function(d) { 
			if (d._children){ 
				return "#b0c0de"; 
			}
			else{ 
				return "#ebeff6";
			};
		})
		.style("border", "3px dotted");

	nodeUpdate.select("text")
		.style("fill-opacity", 1);

	// Transition existing nodes to the parent's new position.
	var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function(d) {return "translate(" + source.y + "," + source.x + ")"; })
		.remove();

	nodeExit.select("circle")
		.attr("r", 1e-6);

	nodeExit.select("text")
		.style("fill-opacity", 1e-6);

	// Update the links
	var link = container.selectAll("path.link")
		.data(links, function(d){ return d.target.id;});
			
	// enter any new links at the parents previous position
	link.enter().insert("path","g")
		.attr("class","link")
		.attr("d", function(d){
			var o = {x:source.x0, y:source.y0};
			return diagonal({source: o, target: o});
		});

	// transition links to their new position
	link.transition()
		.duration(duration)
		.attr("d", diagonal);

	// transition existing node to the parent's new position.
	link.exit().transition()
		.duration(duration)
		.attr("d", function(d){
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
		})
		.remove();
	
	// stash the old positions for transition
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});

	svg1.call(tip);
}

function drawGraph(error, results){

	// This function draws a circulation history graph
	// the input is a random json circulation history file

	// Load random data
	var data = results[0]["Circulation History"];

	// set dimensions of graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50}, 
		width = 600 - margin.left - margin.right, 
		height = 270 - margin.top - margin.bottom;

    // parse date
	var parseDate = d3.time.format("%d-%m-%Y");

	// set range x and y axes
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.ordinal()
				.rangePoints([height,0], 1)
				.domain(LocList);

	// define the axes
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");

	// define tooltip (source: http://bl.ocks.org/Caged/6476579)
	var tip = d3.tip()
		.attr("id", "tooltip")
		.offset([-15, 5])
		.html(function(d){
			return "<strong> Action: </strong>" + d.Action +"<br>"+ "<strong> Date: </strong>" + d.Date;
		});
	
	// Add svg canvas
	var svg = d3.select("#treemap").append("svg")
		.attr("id","svg2")
		.attr("width", width + margin.left + margin.right )
		.attr("height", height + margin.top + margin.bottom)
		.style("visibility", "visible")
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	// parse date
	data.forEach(function(d){
		d.xAxis = parseDate.parse(d.Date);
		d.yAxis = d.Location
	});

	// set the domain of x
	x.domain(d3.extent(data, function(d) { return d.xAxis}));
	
	// add dots on datapoints
    svg.selectAll("dot")
        .data(data)
    	.enter().append("circle")
    	.attr("class","circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.xAxis); })
        .attr("cy", function(d) { return y(d.yAxis); });

	// get cx cy coordinates
	var circles = d3.select("#svg2").selectAll(".circle")
	var cx_list = [],
		cy_list =[];

	circles.each(function(){
		cx_list.push(d3.select(this).attr("cx"));
		cy_list.push(d3.select(this).attr("cy"));
	});

	// calculate line coordinates
	var x_line = [];
	var y_line = [];

	for (var i =0; i < cx_list.length-1; i++){
		var diff = cy_list[i] - cy_list[i+1];

		if( (diff != 0) || (diff == NaN)){
			y_line.push(cy_list[i]);
			y_line.push(cy_list[i]);
			y_line.push(cy_list[i]);
			y_line.push(cy_list[i+1]);

			x_line.push(cx_list[i]);
			x_line.push(cx_list[i+1]);
			x_line.push(cx_list[i+1]);
			x_line.push(cx_list[i+1]);
		}
		else{
			y_line.push(cy_list[i]);
			y_line.push(cy_list[i+1]);

			x_line.push(cx_list[i]);
			x_line.push(cx_list[i+1]);
		}
	}

    // add lines for each datapoint
    var lines = svg.append("g").attr("class", "plot").selectAll("line");

	for (var h = 0; h < x_line.length-1; h=h+2){ 

    	//append line
    	var line = lines.data([1])
			.enter().append("line");

	    line.each(function(d){styleLine(this, h, x_line, y_line)});
	}

	// add another set of transparent lines that respond to mouse events
    var lines = svg.append("g").attr("class", "plot").selectAll("line");

	for (var h = 0; h < x_line.length-1; h=h+2){ 

    	//append line
    	var line = lines.data([1])
			.enter().append("line");

	    line.each(function(d){styleLine2(this, h, x_line, y_line)});			
	}

	// add dots again
    svg.selectAll("dot")
        .data(data)
    	.enter().append("circle")
    	.attr("class","circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.xAxis); })
        .attr("cy", function(d) { return y(d.yAxis); })
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);

	// add the x axis
	svg.append("g")
		.attr("class","x axis")
		.attr("transform", "translate(0,"+ height +")")
		.call(xAxis);
	
	// add x label
    svg.append("text")
    	.attr("id","xlabel")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .text("Date");

    // add the y axis
	svg.append("g")
		.attr("class","y axis")
		.call(yAxis);

	// add y label
    svg.append("text")
    	.attr("id", "ylabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .text("User");
}

function drawMap(d){

	// This function draws the map that displays the locations

	var width = 400;
	var height = 400;
	
	// Add svg canvas
	var svg = d3.select("#treemap").append("svg")
			.attr("id","svg3")
			.attr("width", width )
			.attr("height", height)
			.style("visibility", "visible");

	// set up pattern
	var pattern = svg.append("pattern")
			.attr("id","pattern")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", height)
			.attr("width", width);

	// add image of Amsterdam as background
	// source image: ESRI ArcMap 2012
	var imgs = svg.selectAll("image").data([0]);
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href", "../Images/Amsterdam.jpg")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height);

    var loc_x = [220, 100, 265, 212, 225, 265, 200];
    var loc_y = [165, 150, 280, 168, 188, 300, 60];

    // draw lines that connect locations
	for (var i = 0; i < loc_x.length; i++){
	    for (var j = 0; j < loc_x.length; j++){
		    var line_loc = svg.append("line")
		    	.attr("class", "locationLines")
		    	.attr("x1", loc_x[i])
		    	.attr("y1", loc_y[i])
		    	.attr("x2", loc_x[j])
		    	.attr("y2", loc_y[j])
		    	.attr("id", function(d) { return LocList[i] + "-" + LocList[j];})
		    	.style("stroke", "black")
		    	.style("stroke-width", "1px")
		    	.style("visibility", "hidden");
    	}
	}

	// define tooltip (source: http://bl.ocks.org/Caged/6476579)
	var tip = d3.tip()
		.attr("id","maptooltip")
		.attr("class", "tooltip")
		.direction("n")
		.offset([-10,0])
		.html(function(d){
		if (d == "AMFI"){
			return "<strong> Koetsier-Montaignehuis<br>" + 
					"(Amsterdam Fashion Institute)<br>Address: </strong>Mauritskade 11 <br>"
					+ "1091 GC Amsterdam <br><strong> Tel: </strong> 020-595 4560" 
		}
		if (d == "DML"){
			return "<strong> Dr. Meurenhuis<br>Address: </strong>Dokter Meurenlaan 8<br>"
					+ "1067 SM Amsterdam <br><strong> Tel: </strong> 020-595 3422" 
		}
		if (d == "FB"){
			return "<strong> Fraijlemaborg<br>Address: </strong>Fraijlemaborg 133<br>"
					+ "1102 CV Amsterdam <br><strong> Tel: </strong> 020-523 6046" 
		}
		if (d == "KSH"){
			return "<strong> Köhnstammhuis <br>Address: </strong>Wibautstraat 2-4<br>"
					+ "1091 GM Amsterdam <br><strong> Tel: </strong> 020-599 5530" 
		}
		if (d == "LWB"){
			return "<strong> Leeuwenburg <br>Address: </strong>Weesperzijde 190<br>"
					+ "1097 DZ Amsterdam <br><strong> Tel: </strong> 020-595 1133" 
		}
		if (d == "TBW"){
			return "<strong> Nicolaes Tulphuis <br>Address: </strong>Tafelbergweg 51<br>"
					+ "1000 CN Amsterdam <br><strong> Tel: </strong> 020-595 4237" 
		}
		if (d == "Student"){
			return "<strong> Student </strong>"
		}
		});

	// draw circles on locations
    var circle_loc = svg.selectAll("circle")
        .data(LocList)
    	.enter().append("circle")
    	.attr("class","locationCircles")
        .attr("r", 3.5)
        .attr("cx", function(d, i) { return loc_x[i]; })
        .attr("cy", function(d, i) { return loc_y[i]; })
    	.attr("id", function(d,i) { return LocList[i] + "-" + LocList[i];})
        .attr("fill", function(d, i){ return colorlist[i]; })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    svg.call(tip);
}

function styleLine(d, x, list1, list2){
	
	// This function styles the graphlines

	var h = x;
	var x_line = list1;
	var y_line = list2;

	d3.select(d)
		// set coordinates of line
		.attr({x1 : x_line[h],
			y1 : y_line[h],
			x2 : x_line[h+1],
			y2 : y_line[h+1]
		})
		// append class attributes
		.attr("class", function(d){
			for (var h = 0; h < ticklist.length; h++){
				if (d3.select(this).attr("y1") == ticklist[h]){
					var class1 = LocList[h];
				};
				if (d3.select(this).attr("y2") == ticklist[h]){
					var class2 = LocList[h];
				};						
			};
			return "'" + class1 + "-" + class2 + "'";
		})
		// set styles for line segment
		.style("stroke", function(d){
			for (var t = 0; t <colorlist.length; t++){
				var diff2 = d3.select(this).attr("y1")-d3.select(this).attr("y2");
				if (diff2== 0){
					if(d3.select(this).attr("y1") == ticklist[t]){
						return colorlist[t];
					};
				}
				else{
					return "DarkGrey";
				};
			};
		})
		.style("stroke-dasharray", function(d){
			for (var t = 0; t <colorlist.length; t++){
				var diff2 = d3.select(this).attr("y1")-d3.select(this).attr("y2");
				if (diff2== 0){
					if(d3.select(this).attr("y1") == ticklist[t]){
						return 0;
					};
				}
				else{
					return "3, 3";
				};
			};
		})
		.style("stroke-width", function(d){
			for (var t = 0; t <colorlist.length; t++){
				var diff2 = d3.select(this).attr("y1")-d3.select(this).attr("y2");
				if (diff2== 0){
					if(d3.select(this).attr("y1") == ticklist[t]){
						return 2;
					};
				}
				else{
					return 1;
				};
			};
		})
}

function styleLine2(d, x, list1, list2){

	// This function styles the transparent graphlines

	var h  = x;
	var x_line = list1;
	var y_line = list2;

	d3.select(d)
		// set coordinates of line
		.attr({x1 : x_line[h],
			y1 : y_line[h],
			x2 : x_line[h+1],
			y2 : y_line[h+1]
		})
		// append class attributes
		.attr("class", function(d){
			for (var h = 0; h < ticklist.length; h++){
				if (d3.select(this).attr("y1") == ticklist[h]){
					var class1 = LocList[h];
				}
				if (d3.select(this).attr("y2") == ticklist[h]){
					var class2 = LocList[h];
				}						
			}
			return "'" + class1 + "-" + class2 + "'";
		})
		// set styles for line segment
		.style("stroke", "transparent")
		.style("stroke-width", 9)
		.on("mouseover", mapLines)
		.on("mouseout", back2Normal)
}

// Interactivity functions:

function click(d){

	// This function toggles children on click-node event
	// source: http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html

	if (d.children){
		d._children = d.children;
		d.children = null;
	}
	else{
		d.children = d._children;
		d._children = null;
	}

	// update treemap
	update(d);
}

function updateTree(d){

	// This function calculate a new tree size to evely space the nodes.
	// source: http://bl.ocks.org/robschmuecker/7880033

    var levelWidth = [1];

    var childCount = function(level, n) {

 	// count total children of root node

        if (n.children && n.children.length > 0) {
            if (levelWidth.length <= level + 1) levelWidth.push(0);

            levelWidth[level + 1] += n.children.length;
            n.children.forEach(function(d) {
                childCount(level + 1, d);
            });
        }
    };

    var pixelline = 30;
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * pixelline;
    tree = tree.size([newHeight, viewerWidth]);
}

function callSVG(d){

	// This function calls a new svg and a new circulation history file 
	// after clicking on a book in the treemap.

	if ( d == "clickBook"){

		// if svg is already present remove it
		if (d3.select("#svg2")){
			d3.select("#svg2").remove();
		};

		// open random circulation history file
		var random_num = Math.floor((Math.random() * 199) + 0);
		var filename = "../Histories/hist" + String(random_num) + ".json";
		
		queue()
		.defer(d3.json, filename)
		.awaitAll(drawGraph);
	}
}

function zoomed() {

	// This function transforms the container containing the tree map 
	// to a larger or smaller scale on a zoom mousevent

    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function mapLines(d){	

	// This function checks if a graphline corresponds to a mapline

	// store clicked line in var
	var line_class = d3.select(this).attr("class");
	// remove string 
	line_class = line_class.replace("'", "");
	line_class = line_class.replace("'", "");

	// collect map circles and lines and put id's in list
	var locationCircles = d3.selectAll(".locationCircles");
	var locationLines = d3.selectAll(".locationLines");

	var locationLinesId = [],
		locationCirclesId = [];

	for (var t = 0; t < locationLines[0].length; t++){
		locationLinesId.push(d3.select(locationLines[0][t]).attr("id"));
	}

	for (var t = 0; t < locationCircles[0].length; t++){
		locationCirclesId.push(d3.select(locationCircles[0][t]).attr("id"));
	}

	// check if id and classes correspond
	for (var t = 0; t < locationCirclesId.length; t++){
		if (line_class == locationCirclesId[t]){
			var circle_select = locationCircles[0][t];
			d3.select(circle_select).attr("r", 7);
		}
		else{
			for( var h = 0; h <locationLinesId.length; h++){
				if(line_class == locationLinesId[h]){
					var line_select = locationLines[0][h];
					showHideLine(line_select);
				}
			}
		}
	}
}

function showHideLine(d){

	// This function shows or hides the maplines

	var line = d3.select(d);
	var state = line.style("visibility");
	var newVisibility;

	// change visibility state
	if ( state == "hidden"){
		newVisibility = "visible";
	}
	else {
		newVisibility = "hidden";
	}

	// apply new visibility state
	line.style("visibility", newVisibility);
}

function back2Normal(d){

	// This function puts the map back into its original state

	// radius of circles back to normal
	var locationCircles = d3.selectAll(".locationCircles");
	for (var t = 0; t < locationCircles[0].length; t++){
		var radius = d3.select(locationCircles[0][t]).attr("r");
		if (radius != 2.5){
			d3.select(locationCircles[0][t]).attr("r", 2.5);
		}
	}

	// locationlines back to hidden
	var locationLines = d3.selectAll(".locationLines");
	for (var t = 0; t < locationLines[0].length; t++){
		var visible = d3.select(locationLines[0][t]).style("visibility");
		if (visible == "visible"){
			d3.select(locationLines[0][t]).style("visibility", "hidden");
		}
	}
}
