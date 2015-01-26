"use strict"
window.onload = function(){
	var data = [
	{
	  "name": "Library University of Applied Sciences",
	  "object": "Parent",
	  "value": 85,
	  "total": 85000,
	  "children": [
	  {
	    "name":"KSH",
	    "full_name": "Kohnstammhuis",
	    "object": "Location",
	    "value": 50,
	    "total": 50000,
	    "location": "Wibautstraat 2-4, Amsterdam",
	    "children": [
	      {"name":"Math",
	  		"value": 4,
	  		"total": 400 },
	      {"name":"Philosophy",
	  		"value": 1,
	  		"total": 100}
	    ]
	  },
	  {
	    "name":"AMFI",
	    "full_name": "Amsterdam Fashion Institute",
	    "object": "Location",
	    "value": 6,
	    "total": 6000,
	    "location": "Mauritskade 11, Amsterdam",
	    "type": "grey",
	    "children":[
	    {
	      "name":"Research Methods",
	      "object": "Category",
	      "value": 0.5,
	      "total": 50,
	      "children": [
	        {"name":"Foundations of futures studies",
	        "object": "Book",
	        "copies": 1,
	        "value": 1}
		    ]
	    },
	    {"name":"Pop Culture",
	    "object": "Category",
		 "value": 0.3,
		 "total": 30}
	    ]
	  }
	  ]
	}];

	console.log(data);
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
	 		height = 600 - margin.top - margin.bottom;

	var i = 0,
		duration = 750,
		root;

	// make tree canvas
	var tree = d3.layout.tree()
		.size([height, width]);

	// create diagonals to draw links
	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.x, d.y]; });

	// make svg canvas
	var canvas = d3.select("#treemap").append("svg")
		.attr("id","svg1")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// define the top level of the tree/array
	root = data[0];
	root.x0 = height /2;
	root.y0 = width/2;

    // layout the tree initially and center on the root node.
    tree.nodes(root).forEach(function(d) { click(d); });

	// draw tree
	update(root);

	d3.select(self.frameElement).style("height", "500px");

	// draw tree function (source: http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html)
	function update(source){

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
				if (d.object == "Parent"){
					return "<strong> Total Books: </strong>" + d.total
							+"<br>" +"<strong> Locations: </strong>6"
							+"<br>" +"<strong> Members: </strong>54.000"

				}
				if(d.object == "Category") {
					return "<strong> Total Books: </strong>" + d.total;
				};
				if (d.object == "Location"){
					return "<strong>" + d.full_name +"</strong>" + "<br>"+ 
							"<strong>Address: </strong>" + d.location + "<br>" 
							+ "<strong>Total Books: </strong>" + d.total;
				}
				if (d.object =="Book"){
					return "<strong> Copies: </strong>" + d.copies + "<br>" +
							"<strong> Click to show circulation history! </strong>";
				}
			});

		// compute the new tree layout
		var nodes = tree.nodes(root);

		// get target and source, store in links
		var links = tree.links(nodes);

		// normalize for fixed-depth of nodes
		nodes.forEach(function(d) { d.y = d.depth * 150; });

			// update the nodes
			var node = canvas.selectAll("g.node")
				.data(nodes, function(d) { return d.id || (d.id = ++i); });

	  	// Enter any new nodes at the parents previous position.	
			var nodeEnter = node.enter().append("g")
				.attr("class", "node")
				//apply transform function to display correctly on screen
				.attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
				.on("click", click);

		// create circles for nodes
		nodeEnter.append("circle")
			.attr("r", function(d){return d.value})/*function(d) {
				if (d.value < 2){
					return 2;
				}
				else{
					return d.value; 
				}})*/
			.attr("stroke", "silver")
			.attr("fill", function(d){ return d._children ? "#b0c0de" : "#ebeff6"; })

		// append & enter node labels
		nodeEnter.append("text")
			.attr("y", function(d){ return d.children || d._children ?  -18 : 18 })
			.attr("dy",".35em")
			.attr("text-anchor", "middle")
			.style("font-family", "Courier")
			.text(function(d) { return d.name; })
			.style("fill-opacity", 1)
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
			.style("text-decoration", function(d){
				if (d.object =="Book"){
					return "underline";
				}
			})
			.attr("id", function(d){
				if(d.object=="Book"){
					return "clickBook";
				}
			})
			.on("click", function(d){
				var ids = d3.select(this).attr("id");
				if ( ids == "clickBook"){
					return showHide();
				}
			});

		// Transition nodes to their new position
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"});

		nodeUpdate.select("circle")
			.attr("r", function(d) {return d.value})
			.style("fill", function(d) {return d._children ? "#b0c0de" : "#ebeff6";})
			.style("border", "3px dotted");

		nodeUpdate.select("text")
			.style("fill-opacity", 1);

		// Transition existing nodes to the parent's new position.
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) {return "translate(" + source.x + "," + source.y + ")"; })
			.remove();

		nodeExit.select("circle")
			.attr("r", 1e-6);

		nodeExit.select("text")
			.style("fill-opacity", 1e-6);

		// Update the links
		var link = canvas.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

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

		canvas.call(tip);
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
	}

	//================ Draw graph =============================//
	drawGraph(dataBook);

	//================ Draw table ============================//
	tabBook(dataBook,["User", "Date", "Time", "Title", "Barcode","Action","DueDate","Location"]);

	Map();
}

function showHide(d){
	console.log("Show Hide!");

	var svg = d3.select("#svg2");

	var state = svg.style("visibility");
	console.log(state);

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
			.style("visibility", "hidden")
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

	data.forEach(function(d){
		for (var i = 0; i<LocList.length; i++){
			if (d.yAxis ==LocList[i]){
				d.LocID == i;
			}

		}
	})

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
    var colorlist = ["#66B866", "green", "yellow", "orange", "blue", "grey", "#E6B85C"];
    var ticklist = [195, 0, 0, 105, 0, 0, 15];

    // add lines for each datapoint
    var lines = svg.append("g").attr("class", "plot").selectAll("line");
	for (var h = 0; h < x_line.length-1; h=h+2){ 
    	console.log(h);

    	//append line
    	var line = lines.data([1])
			.enter().append("line");

	    line.each(function(d){
					
			d3.select(this)
				// set coordinates of line
				.attr("id", "line" + h)
				.attr({x1 : x_line[h],
					y1 : y_line[h],
					x2 : x_line[h+1],
					y2 : y_line[h+1]
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
	console.log("ShowHideTable!");

	var table = d3.select("#BookTable");

	var state = table.style("visibility");
	console.log(state);

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

}

