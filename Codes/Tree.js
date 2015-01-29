"use strict"
window.onload = function(){
	queue()
		.defer(d3.json, "../Data/tree.json")
		.awaitAll(ready);

	function ready(error, results){

		var data = results;
		
		// book circulation data
		var dataBook = [
		  {
		    "User":"CIRCAMFI",
		    "Date":"08-01-2015",
		    "Time":"11:02",
		    "Title":"Foundations of futures studies",
		    "Barcode":"HV008698",
		    "Action":"IntIBL",
		    "DueDate":"none",
		    "Location":"AMFI",

		  },
		  {
		    "User":"CIRCKSH",
		    "Date":"07-01-2015",
		    "Time":"16:43",
		    "Title":"Foundations of futures studies",
		    "Barcode":"HV008698",
		    "Action":"IntIBL",
		    "DueDate":"none",
		    "Location":"KSH"
		  },
		  {
		    "User":"Student",
		    "Date":"07-01-2015",
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
		    "Date":"17-07-2014",
		    "Time":"13:11",
		    "Title":"Foundations of futures studies",
		    "Barcode":"HV008698",
		    "Action":"Regular return",
		    "DueDate":"3-8-2014",
		    "Location":"AMFI"
		  },
		  {
		    "User":"Student",
		    "Date":"05-07-2014",
		    "Time":"11:39",
		    "Title":"Foundations of futures studies",
		    "Barcode":"HV008698",
		    "Action":"Loan",
		    "DueDate":"3-8-2014",
		    "Location":"AMFI"
		  }
		];

		//=========== Generate the tree diagram =================//
		var margin = {top: 120, right: 200, bottom: 0, left: 200},
		 		width = 1000 - margin.right - margin.left,
		 		height = 450 - margin.top - margin.bottom;

		var i = 0,
			duration = 750,
			root;

		var viewerWidth = width;
		var viewerHeight = height;

		// define zoom variable
		var zoom  = d3.behavior.zoom()
			.scaleExtent([-10,10])
			.on("zoom", zoomed);

		// make tree canvas
		var tree = d3.layout.tree()
			.size([viewerHeight, viewerWidth]);

		// create diagonals to draw links
		var diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });

		// make svg canvas
		var svg1 = d3.select("#treemap").append("svg")
			.attr("id","svg1")
			.attr("width", viewerWidth + margin.right + margin.left)
			.attr("height", viewerHeight + margin.top + margin.bottom)
			.call(zoom)
			.append("g")
				.attr("transform","translate(" + margin.left + "," + margin.top + ")")			
		
		// append g element to store all nodes and links in
		var container = svg1.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

		var rect = container.append("rect")
			.attr("width", viewerWidth + margin.right + margin.left)
		    .attr("height", viewerHeight + margin.top + margin.bottom)
		    .attr("x", 0 - margin.left)
		    .attr("y", 0 - margin.bottom - margin.top)
		    .style("fill", "none")
		    .style("pointer-events", "all");

		// define the top level of the tree/array
		root = data[0];
		root.x0 = viewerHeight /2;
		root.y0 = viewerWidth/2;

	    // layout the tree initially and center on the root node.
	    tree.nodes(root).forEach(function(d) { click(d); });

		// draw tree
		update(root);
		centerNode(root);

		d3.select(self.frameElement).style("height", "500px");

		// Define the zoom function for the zoomable tree
		function zoomed() {
		    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}

		// Function that centers on node when clicked upon
		function centerNode(source){
			var scale = zoom.scale();
			var x = -source.y0;
			var y = -source.x0;
			x = x * scale + viewerWidth / 2;
			y = y * scale + viewerHeight / 2;
			d3.select("container").transition()
				.duration(duration)
				.attr("transform", "translate(" + x + "," + y + ")" + ")scale(" + scale + ")");
			zoom.scale(scale);
			zoom.translate([x,y]);
		}

		// draw tree function (source: http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html)
		function update(source){

			 // Compute the new height, function counts total children of root node and sets tree height accordingly.
	        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
	        // This makes the layout more consistent.
	        var levelWidth = [1];
	        var childCount = function(level, n) {

	            if (n.children && n.children.length > 0) {
	                if (levelWidth.length <= level + 1) levelWidth.push(0);

	                levelWidth[level + 1] += n.children.length;
	                n.children.forEach(function(d) {
	                    childCount(level + 1, d);
	                });
	            }
	        };
	        childCount(0, root);
	        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
	        tree = tree.size([newHeight, viewerWidth]);


			// define tooltip (source: http://bl.ocks.org/Caged/6476579)
			var tip = d3.tip()
				.attr("id","treetooltip")
				.attr("class", "tooltip")
				.direction(function(d){ 
					if (d.name == "AMFI"){
						return "e"
					}
					else{
						return "w"
					}})
				.offset(function(d){
					if(d.name == "AMFI"){
						return [0,50]
					}
					else{
						return[0,-30]
					}})
				.html(function(d){
					if (d.type == "parent"){
						return "<strong> Total Books: </strong>85.210" 
								+"<br>" +"<strong> Locations: </strong>6"
								+"<br>" +"<strong> Members: </strong>54.000"

					}
					if(d.type == "Category") {
						return "<strong> Total Books: </strong>" + d.value;
					};
					if (d.type == "Location"){
						return "<strong>" + d.name +"</strong>" + "<br>"+ 
								"<strong>Address: </strong>" + d.location + "<br>" 
								+ "<strong>Total Books: </strong>" + d.value;
					}
					if (d.type =="book"){
						return "<strong> Title: </strong>" + d.name + "<br>" +
								"<strong> Copies: </strong>" + d.copies + "<br>" +
								"<strong> Click to show circulation history! </strong>";
					}
				});

			// compute the new tree layout
			var nodes = tree.nodes(root);

			// get target and source, store in links
			var links = tree.links(nodes);

			// normalize for fixed-depth of nodes
			nodes.forEach(function(d) {
					//if(d.type == "book"){
					//	return d.y = (d.depth*1.5) * 80; 
					//}
					//else{
						return d.y = (d.depth*1.5) * 120; 	
					//}
				});

				// update the nodes with their(new) id's
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
				.attr("r", function(d){return d.value})
				.attr("stroke", "silver")
				.attr("fill", function(d){ return d._children ? "#b0c0de" : "#ebeff6"; })

			// append & enter node labels
			nodeEnter.append("text")
				.attr("class", "nodeLabels")
				.attr("y", function(d){ 
					if (d.type == "parent"){
						return -50;
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
/*				.attr("transform", function(d){
					if (d.type =="book"){
						return "rotate(-90)";
					}
				})*/
				.style("font-family", "Courier")
				.text(function(d) { return d.name; })
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
					}
				})
				.on("click", function(d){
					var ids = d3.select(this).attr("id");
					if ( ids == "clickBook"){
						return showHide();
					}
				})
				//.call(wrap, [0]);	
/*
			// apply wrap function only on category labels
			var nodeLabels = d3.selectAll(".nodeLabels")

			nodeLabels.each(function(d){
				if (nodeLabels.id != "clickBook"){
					d3.select(this)
						.call(wrap, [0]);	
				};
			})
*/
				

			// Transition nodes to their new position
			var nodeUpdate = node.transition()
				.duration(duration)
				.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"});

			nodeUpdate.select("circle")
				.attr("r", function(d) {return d.value})
				.style("fill", function(d) {return d._children ? "#b0c0de" : "#ebeff6";})
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

		// ================ toggle children on click function =======================//
		function click(d){
			if (d.children){
				d._children = d.children;
				d.children = null;
			}
			else{
				d.children = d._children;
				d._children = null;
			}

			update(d);
			centerNode(d);
		}

		Map();
		//================ Draw graph =============================//
		drawGraph(dataBook);

		//================ Draw table ============================//
		tabBook(dataBook,["User", "Date", "Time", "Title", "Barcode","Action","DueDate","Location"]);
	
		}
	}



// Drag and Zoom http://bl.ocks.org/mbostock/6123708
// From http://bl.ocks.org/mbostock/7555321
/*function wrap(text, width) {
	if (text.id != "clickBook"){

		text.each(function() {
		    var text = d3.select(this),
		        words = text.text().split(/\s+/).reverse(),
		        word,
		        line = [],
		        lineNumber = 0,
		        lineHeight = 0.9,
		        y = text.attr("y"),
		        dy = parseFloat(text.attr("dy")),
		        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		    while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
		    }
		});
  	};
}*/

function showHide(d){
	console.log("Show Hide!");

	var svg = d3.select("#svg2");

	var state = svg.style("visibility");

	var newVisibility;

	if ( state == "hidden"){
		newVisibility = "visible";
	}
	else {
		newVisibility = "hidden";
	}

	svg.style("visibility", newVisibility);

}

// Create table from data function (source: http://bl.ocks.org/d3noob/5d47df5374d210b6f651)
function tabBook(data, columns) {
    var table = d3.select("#treemap").append("table")
            .attr("id", "BookTable")
            .attr("class","table")
            .style("border-collapse", "collapse")
            .style("visibility", "hidden")
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

function drawGraph(data){

	// set dimensions of graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50}, 
		width = 600 - margin.left - margin.right, 
		height = 270 - margin.top - margin.bottom;

    // parse date
	var parseDate = d3.time.format("%d-%m-%Y");

	// define locations list
	var LocList = ["AMFI", "DML", "FB", "KSH", "LWB", "TBW", "Student"];

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
					return "<strong> Action: </strong>" + d.Action +"<br>"+ "<strong> Date: </strong>" + d.Date + "<br>" + "<strong> Time: </strong>" + d.Time;
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
		if ((d.Action == "IntIBL") || (d.Action == "Web renewal") || (d.Action == "Loan")){
			d.yAxis = d.User.replace("CIRC","");
		}
		if(d.Action == "Regular return"){	
			d.yAxis = d.Location;
		}
	});

/*	data.forEach(function(d){
		for (var i = 0; i<LocList.length; i++){
			if (d.yAxis ==LocList[i]){
				d.LocID == i;
			}

		}
	})*/

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

	cx_list = cx_list.reverse();
	cy_list = cy_list.reverse();

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

    // add color gradient
    var colorlist = ["#66B866", "#b866b8", "#66B8B8", "#b8b866", "#668fb8", "#b86666", "#E6B85C"];
    var ticklist = [195, 165, 135, 105, 75, 45, 15];

    // add lines for each datapoint
    var lines = svg.append("g").attr("class", "plot").selectAll("line");

	for (var h = 0; h < x_line.length-1; h=h+2){ 

    	//append line
    	var line = lines.data([1])
			.enter().append("line");

	    line.each(function(d){			

			d3.select(this)
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
				.style("stroke", function(d){
					for (var t = 0; t <colorlist.length; t++){
						var diff2 = d3.select(this).attr("y1")-d3.select(this).attr("y2");
						if (diff2== 0){
							if(d3.select(this).attr("y1") == ticklist[t]){
								return colorlist[t];
							}
						}
						else{
							return "DarkGrey";
						}
					}
				})
				.style("stroke-dasharray", function(d){
					for (var t = 0; t <colorlist.length; t++){
						var diff2 = d3.select(this).attr("y1")-d3.select(this).attr("y2");
						if (diff2== 0){
							if(d3.select(this).attr("y1") == ticklist[t]){
								return 0;
							}
						}
						else{
							return "3, 3";
						}
					};
				})
				.style("stroke-width", function(d){
					for (var t = 0; t <colorlist.length; t++){
						var diff2 = d3.select(this).attr("y1")-d3.select(this).attr("y2");
						if (diff2== 0){
							if(d3.select(this).attr("y1") == ticklist[t]){
								return 2;
							}
						}
						else{
							return 1;
						}
					};
				})
		});
	}

	// add another set of non visible lines that respond to mouse events
    var lines = svg.append("g").attr("class", "plot").selectAll("line");

	for (var h = 0; h < x_line.length-1; h=h+2){ 

    	//append line
    	var line = lines.data([1])
			.enter().append("line");

	    line.each(function(d){			

			d3.select(this)
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
		});
	}

	// again add dots on datapoints
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

    svg.append("text")
    	.attr("id", "showtext")
    	.attr("y", height/2)
    	.attr("x", 150)
    	.text("Show Table!")
    	.style("text-decoration", "underline")
    	.style("opacity", 0.5)
		.on("click", function(d){
			return ShowHideTable();
		});
}

function ShowHideTable(d){

	var table = d3.select("#BookTable");

	var state = table.style("visibility");

	var newVisibility;

	if ( state == "hidden"){
		newVisibility = "visible";
	}
	else {
		newVisibility = "hidden";
	}

	table.style("visibility", newVisibility);
}

function Map(d){
	// define tooltip
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

	// Add image
	var imgs = svg.selectAll("image").data([0]);
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href", "../Images/Amsterdam.jpg")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height);

    var colorlist = ["#66B866", "#b866b8", "#66B8B8", "#b8b866", "#668fb8", "#b86666", "#E6B85C"];
    var LocList = ["AMFI", "DML", "FB", "KSH", "LWB", "TBW", "Student"];
    var loc_x = [220, 100, 265, 212, 225, 265, 200];
    var loc_y = [165, 150, 280, 168, 188, 300, 60];

    // draw line conenction the locations
	for (var i = 0; i < loc_x.length; i++){
	    for (var j = 0; j < loc_x.length; j++){
		    var line_loc = svg.append("line")
		    	.attr("class", "locationLines")
		    	.attr("x1", loc_x[i])
		    	.attr("y1", loc_y[i])
		    	.attr("x2", loc_x[j])
		    	.attr("y2", loc_y[j])
		    	.attr("id", function(d){
		    			return LocList[i] + "-" + LocList[j]; 
		    	})
		    	.style("stroke", "black")
		    	.style("stroke-width", "1px")
		    	.style("visibility", "hidden")
    	}
	}

	// draw circles on locations
    var circle_loc = svg.selectAll("circle")
        .data(LocList)
    	.enter().append("circle")
    	.attr("class","locationCircles")
        .attr("r", 3.5)
        .attr("cx", function(d, i) { return loc_x[i]; })
        .attr("cy", function(d, i) { return loc_y[i]; })
    	.attr("id", function(d,i){
			return LocList[i] + "-" + LocList[i]; 
		})
        .attr("fill", function(d, i){ return colorlist[i]; })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    svg.call(tip);
}

function mapLines(d){
	
	var line_class = d3.select(this).attr("class");
	line_class = line_class.replace("'", "");
	line_class = line_class.replace("'", "");

	var locationCircles = d3.selectAll(".locationCircles");
	var locationLines = d3.selectAll(".locationLines");

	console.log(locationCircles);

	// put id's in list
	var locationLinesId = []
	for (var t = 0; t < locationLines[0].length; t++){
		locationLinesId.push(d3.select(locationLines[0][t]).attr("id"));
	}

	var locationCirclesId = []
	for (var t = 0; t < locationCircles[0].length; t++){
		locationCirclesId.push(d3.select(locationCircles[0][t]).attr("id"));
	}

	// check if equal
	for (var t = 0; t < locationCirclesId.length; t++){
	
		if (line_class == locationCirclesId[t]){
			console.log("yes circle")
			var circle_select = locationCircles[0][t];
			adjustCircle(circle_select);
		}
		else{
			for( var h = 0; h <locationLinesId.length; h++){
				if(line_class == locationLinesId[h]){
					console.log("yes line")
					var line_select = locationLines[0][h];
					adjustLine(line_select);
				}
			}
		}
	}
}

function adjustLine(d){
	console.log("adjust line!")
	var line = d3.select(d);
	console.log(line)
	var state = line.style("visibility");
	var newVisibility;

	if ( state == "hidden"){
		newVisibility = "visible";
	}
	else {
		newVisibility = "hidden";
	}

	line.style("visibility", newVisibility);

}

function adjustCircle(d){
	console.log("Show Hide Circle!");
	var circle = d3.select(d);
	console.log(circle);

	circle.attr("r", 7);
}
	
function back2Normal(d){
	var locationCircles = d3.selectAll(".locationCircles");
	for (var t = 0; t < locationCircles[0].length; t++){
		var radius = d3.select(locationCircles[0][t]).attr("r");
		if (radius != 2.5){
			d3.select(locationCircles[0][t]).attr("r", 2.5);
		}
	}

	var locationLines = d3.selectAll(".locationLines");
	for (var t = 0; t < locationLines[0].length; t++){
		var visible = d3.select(locationLines[0][t]).style("visibility");
		if (visible == "visible"){
			d3.select(locationLines[0][t]).style("visibility", "hidden");
		}
	}

}

/*		(function repeat(){
			circle.transition()
				.duration(150)
				.attr("r", 5)
				.transition()
				.duration(150)
				.attr("r", 2.5)
				.each("end", repeat)			
		})()*/

/*
	var state = circle.style("visibility");
	var newVisibility;

	if ( state == "hidden"){
		newVisibility = "visible";
	}
	else {
		newVisibility = "hidden";
	}

	circle.style("visibility", newVisibility);*/

//}