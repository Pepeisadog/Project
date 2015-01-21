"use strict"
window.onload = function(){
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
	root.y0 = 0;

	// draw tree
	update(root);

	d3.select(self.frameElement).style("height", "500px");

	// draw tree function (source: http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html)
	function update(source){

		// compute the new tree layout
		var nodes = tree.nodes(root);

		// get target and source, store in links
		var links = tree.links(nodes);

		// normalize for fixed-depth of nodes
		nodes.forEach(function(d) { d.y = d.depth * 100; });

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
			.attr("r", function(d) { return d.value; })
			.attr("fill", function(d){ return d._children ? "lightsteelblue" : "#fff"; });

		// append & enter node labels
		nodeEnter.append("text")
			.attr("y", function(d){ return d.children || d._children ?  -18 : 18 })
			.attr("dy",".35em")
			.attr("text-anchor", "middle")
			.style("font-family", "Courier")
			.text(function(d) { return d.name; })
			.style("fill-opacity", 1);

		// Transition nodes to their new position
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"});

		nodeUpdate.select("circle")
			.attr("r", function(d) {return d.value})
			.style("fill", function(d) {return d._children ? "lightsteelblue" : "#fff";});

		nodeUpdate.select("text")
			.style("fill-opacity", 1);

		// Transition existing nodes to the parent's new position.
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) {return "translate{" + source.x + "," + source.y + ")"; })
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
		})
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
}


// Create table from data function (source: http://bl.ocks.org/d3noob/5d47df5374d210b6f651)
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

function drawGraph(data){
/*
	// add attr to object data
	data.forEach(function(d){
		if ((d.Action == "IntIBL") || (d.Action == "Web renewal") || (d.Action == "Loan")){
			d.User2 = d.User;
		}
		if(d.Action == "Regular return"){
			d.User2 = "CIRC" + d.Location;
		}
	});*/
/*
	data.forEach(function(d){
		if (d.User2 == "CIRCAMFI"){
			d.Location2 = 1;
		}
		else if (d.User2 == "CIRCDML"){
			d.Location2 = 2;
		}
		else if (d.User2 == "CIRCFB"){
			d.Location2 = 3;
		}
		else if (d.User2 == "CIRCKSH"){
			d.Location2 = 4;
		}
		else if (d.User2 == "CIRCLWB"){
			d.Location2 = 5;
		}
		else if (d.User2 == "CIRCTBW"){
			d.Location2 = 6;
		}
		else if (d.User2 == "Student"){
			d.Location2 = 7;
		}
	});*/

	// set dimensions of graph
	var margin = {top: 30, right: 20, bottom: 30, left: 50}, width = 600 - margin.left - margin.right, height = 270 - margin.top - margin.bottom;

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
				.attr("class", "tooltip")
				.offset([-15, 5])
				.html(function(d){
					return "<strong> Action: </strong>" + d.Action +"<br>"+ "<strong> Date: </strong>" + d.Date + "<br>" + "<strong> Time: </strong>" + d.Time;
				});
	
	// Add svg canvas
	var svg = d3.select("#treemap").append("svg")
			.attr("id","svg2")
			.attr("width", width + margin.left + margin.right )
			.attr("height", height + margin.top + margin.bottom)
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

    // add color gradient
    var colorlist = ["red", "green", "yellow", "orange", "blue", "grey", "pink"];
		
    /*// generate line data
	var lineData = [ { "x": 0, "y": 15}, { "x": 34, "y": 195}, { "x": 380, "y": 15}, { "x": 468, "y": 15}, { "x": 527, "y": 105}, { "x": 530, "y": 195}];    
	*/
	// generate new line data
	var newData = [{ "x": 0, "y": 15}, { "x": 34, "y": 15}, { "x": 34, "y": 195}, { "x": 380, "y": 195}, { "x": 380, "y": 15}, { "x": 468, "y": 15}, { "x": 527, "y": 15}, { "x": 527, "y": 105}, { "x": 530, "y": 105}, { "x": 530, "y": 195}];
	/*var h = 0;


	while (h < lineData.length-1){
		if (h % 2 == 0){
			newData.push({"x": lineData[h].x, "y": lineData[h].y})
			newData.push({"x": lineData[h+1].x, "y": lineData[h].y})
		}
		else{
			newData.push({"x": newData[newData.length-1].x, "y": newData[newData.length-1].y}, 
				{"x": lineData[h+1].x, "y": newData[newData.length-1].y});	
		}

		h = h+1;
	}*/

    // add lines for each datapoint
    var lines = svg.append("g").attr("class", "plot").selectAll("line")
    			.data(data)
    			.enter().append("line");

	console.log(newData);

    lines.each(function(d,i){

    	for (var h = 0; h < newData.length-1; h++){
			d3.select(this)
				// set coordinates of line
				.attr("id", "line" + i)
				.attr({x1 : newData[i].x,
					y1 : newData[i].y,
					x2 : newData[i+1].x,
					y2 : newData[i+1].y
				})
				
				// set styles for line segment
				.style("stroke", function(d){
					if (d.yAxis == "Student"){
					return "blue"; }
					else{
						return "green";
					}
				console.log(y1)
				if ((y1- y2) > 0){
					d3.select(this)
						.style("stroke-dasharray", ("3,3"))
						.style("stroke", "black")
						.style("stroke-wdith", 1)
				}
				});
		}

	});

/* 	//Working
	// define line
    var valueline = d3.svg.line()
    	.x(function(d) {return x(d.xAxis); })
    	.y(function(d) {return y(d.yAxis); })
    	.interpolate("step-before");

	var lineGraph = svg.append("path")
						.data(data)
						.attr("class", "line")
						.attr("d", valueline(data))
						.attr("stroke", "blue") 
						.attr("stroke-width", 2)
						.attr("fill", "none");*/

/*    svg.append("path")
    	.datum(data)
    	.attr("class","line")
		.attr("d", valueline)
		.attr("stroke", "blue");function(d){
			if (d.yAxis == "Student"){
				return blue;
			}

		});
		/*data.forEach(function(d){ 
			for (var i = 0; i < LocList.length; i++){
				if (LocList[i] == d.yAxis){
					return colorlist[i];
				}	
			}
			}));*/
	
	// add dots on datapoints
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
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-weight","bold")
        .text("Date");

    // add the y axis
	svg.append("g")
		.attr("class","y axis")
		.call(yAxis);

	// add y label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-weight","bold")
        .text("User");
}