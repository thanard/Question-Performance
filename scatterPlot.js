/*Assuming that we have
	dataAll = [
				{
	                row: rowNum,
	                col: colNum,
	                density: 0,
	                points: []
	            }, 
	            ...
			]

*/

var scatterPlot = (function(){
	var quizNum =1;//quiz number
	var numTps = 5;//number of time periods to see
	var maxG = 10;//maximum grade to see
	var minG = 5;//minimum grade to see
	var scaleYAxis=10;//approximately the number of lines on scatter plot
	var maxT,minT;
	var numRows = numTps,
	    numCols = maxG-minG+1,
	    data = null,//for scatterplot
	    cells = null,//for heatchart
	    color = d3.interpolateRgb("#fff", "#085e11");

//=============================================================================================================================================================================================================================================================

	/*helper function for setupData*/
	var getEmptyCells = function() {
	    var emptyCells = [];
	    for (var rowNum = 0; rowNum < numRows; rowNum++) {
	        emptyCells.push([]);
	        var row = emptyCells[emptyCells.length - 1];
	        for (var colNum = 0; colNum < numCols; colNum++) {
	            row.push({
	                row: rowNum,
	                col: colNum,
	                points: []
	            });
	        }
	    }
	    return emptyCells;
	};

	/*helper function for setupData*/
	var maxx =function(d){
		var ans=0;
		for(var i=0;i<d.length;i++){
			if (d[i].timespent>ans)
			{
				ans=d[i].timespent;
			}
		}
		return ans;
	}

	/*helper function for setupData*/
	var minn =function(d){
		var ans=1000000;
		for(var i=0;i<d.length;i++){
			if (d[i].timespent<ans)
			{
				ans=d[i].timespent;
			}
		}
		return ans;
	}

	var setupData = function(){
		maxT=maxx(dataAll[quizNum])+1;
		minT=minn(dataAll[quizNum])-1;

	    data = [];

        cells = getEmptyCells();

	    for (var i = 0; i < dataAll[quizNum].length; i++) {
	        x = dataAll[quizNum][i].grade;
	        y = dataAll[quizNum][i].timespent;
	        col = x-minG;
	        row = Math.floor((y-minT)*numTps/(maxT-minT));
	        //console.log(x,y,M,m,numTps,col,row)
		    if(col>=0){
		        data.push({
		            x: x,
		            y: y,
		            col: col,
		            row: row,
		            // cell: cells[row][col],
		            ind: i
		        });

		        cells[row][col].points.push(data[data.length - 1]);
		    }
	    }
	    console.log('data = ',data)
	    console.log('\ncells = ',cells)
	};

//=============================================================================================================================================================================================================================================================

	/*helper function for onPointOver onCellOver*/
	var selectPoints = function(points) {
	    d3.selectAll(points).attr("r", 4).attr("stroke", "#f00").attr("stroke-width", 3);

	    for (var i = 0; i < points.length; i++) {
	        points[i].parentNode.appendChild(points[i]);
	    }
	};

	/*helper function for onPointOut onCellOut*/
	var deselectPoints = function(points) {
	    d3.selectAll(points).attr("r", 2).attr("stroke", "none");
	};

	/*helper function for onPointOver onCellOver*/
	var selectCell = function(cell) {
	    d3.select(cell).attr("stroke", "#f00").attr("stroke-width", 3);

	    cell.parentNode.parentNode.appendChild(cell.parentNode);
	    cell.parentNode.appendChild(cell);
	};

	/*helper function for onPointOut onCellOut*/
	var deselectCell = function(cell) {
	    d3.select(cell).attr("stroke", "#fff").attr("stroke-width", 1);
	};

//=============================================================================================================================================================================================================================================================

	/*helper function for createScatterplot*/
	var onPointOver = function(point, data) {
	    selectPoints([point]);
	    var cell = d3.select(".heatchart").select('[cell="r' + data.row + 'c' + data.col + '"]');
	    selectCell(cell.node());
	};

	/*helper function for createScatterplot*/
	var onPointOut = function(point, data) {
	    deselectPoints([point]);
	    var cell = d3.select(".heatchart").select('[cell="r' + data.row + 'c' + data.col + '"]');
	    deselectCell(cell.node());
	};

	/*
	helper function for viewSVG
	*/
	var createScatterplot = function(){
		var outer_height=500;
		var outer_width=400;

		var margin={top:30, right:30,bottom:40,left:30};

		var plot_height=outer_height-margin.top-margin.bottom;
		var plot_width=outer_width-margin.left-margin.right;

		var scatterplot = d3.select(".plot1")
				.append("svg:svg")
				.attr("width",outer_width)
				.attr("height",outer_height)
				.attr("class","scatterplot")
				.append("g")
				.attr("transform","translate("+margin.left + "," + margin.top+")");

		var x_scale = d3.scale.ordinal().domain(d3.range(minG-1,maxG+1)).rangeBands([0,plot_width])
		var y_scale = d3.scale.linear().domain([maxT,minT]).range([0,plot_height])
console.log(JSON.stringify(y_scale.ticks(numTps)),minT,maxT)
		scatterplot.selectAll(".y-scale-label").data(y_scale.ticks(scaleYAxis))
			.enter().append("svg:text")
			.attr("class","y-scale-label")
			.attr("x",0)
			.attr("y",function(d){ return y_scale(d);})
			.attr("dx",-margin.left/8)
			.attr("dy","0.3em")
			.attr("text-anchor","end")
			.text(String);

		scatterplot.selectAll(".x-scale-label").data(d3.range(minG,maxG+1))
			.enter().append("svg:text")
			.attr("class","x-scale-label")
			.attr("x",function(d,i){return (i+.5)*x_scale.rangeBand();})
			.attr("y",plot_height)
			.attr("dx",margin.left)
			.attr("dy",margin.bottom/2)
			.attr("text-anchor","middle")
			.text(function(d){return d;});
		scatterplot.selectAll("line").data(y_scale.ticks(scaleYAxis))
			.enter().append("svg:line")
			.attr("x1",0)
			.attr("x2",plot_width)
			.attr("y1",function(d){return y_scale(d);})
			.attr("y2",function(d){return y_scale(d);});

		scatterplot.selectAll("circle").data(data)
			.enter().append("svg:circle")
			.attr("cx",function(d,i){return x_scale(d.x);})
			.attr("cy",function(d,i){return y_scale(d.y);})
			.attr("r",2)
			.attr("ind",function(d){return d.ind;})
			.on("mouseover",function(d){onPointOver(this,d);})
			.on("mouseout",function(d){onPointOut(this,d);});
		};


//=============================================================================================================================================================================================================================================================

	/*helper function for createHeatchart*/
	var onCellOver = function(cell, data) {
	    selectCell(cell);

        var pointEls = [];

        for (var i = 0; i < data.points.length; i++) {
            pointEls.push(d3.select(".scatterplot").select('[ind="' + data.points[i].ind + '"]').node());
        }

        selectPoints(pointEls);
    
	};

	/*helper function for createHeatchart*/
	var onCellOut = function(cell, data) {
	    deselectCell(cell);

    
        var pointEls = [];

        for (var i = 0; i < data.points.length; i++) {
            pointEls.push(d3.select(".scatterplot").select('[ind="' + data.points[i].ind + '"]').node());
        }

        deselectPoints(pointEls);
    
	};

	var createHeatchart = function() {
	    var min = 1000000;
	    var max = -1000000;
	    var l;

	    for (var rowNum = 0; rowNum < cells.length; rowNum++) {
	        for (var colNum = 0; colNum < numCols; colNum++) {
	            l = cells[rowNum][colNum].points.length;

	            if (l > max) {
	                max = l;
	            }
	            if (l < min) {
	                min = l;
	            }
	        }
	    }

		var outer_height=500;
		var outer_width=400;

		var margin={top:30, right:30,bottom:40,left:30};

		var chart_height=outer_height-margin.top-margin.bottom;
		var chart_width=outer_width-margin.left-margin.right;
	    var heatchart = d3.select(".plot2")
	    		.append("svg:svg")
	    		.attr("width", outer_width)
	    		.attr("height", outer_height)
	    		.attr("class","heatchart")
	    		.append("g")
				.attr("transform","translate("+margin.left + "," + margin.top+")");

	    heatchart.selectAll("g").data(cells).enter().append("svg:g").selectAll("rect").data(function(d) {
	        return d;
	    }).enter().append("svg:rect").attr("x", function(d, i) {
	        return d.col * (chart_width / numCols);
	    }).attr("y", function(d, i) {
	        return (numRows-1- d.row) * (chart_height / numRows);
	    })
	    .attr("width", chart_width / numCols)
	    .attr("height", chart_height / numRows).attr("fill", function(d, i) {
	        return color((d.points.length - min) / (max - min));
	    }).attr("stroke", "#fff").attr("cell", function(d) {
	        return "r" + d.row + "c" + d.col;
	    }).on("mouseover", function(d) {
	        onCellOver(this, d);
	    }).on("mouseout", function(d) {
	        onCellOut(this, d);
	    });

	    //Note numRows=numTps
	    yHeatChartLabel=[];
	    for(var i=0;i<=numTps;i++){
	    	yHeatChartLabel.push(Math.floor(minT+i*(maxT-minT)/numRows));
	    }
	    console.log(yHeatChartLabel)
	    heatchart.selectAll(".y-scale-label").data(yHeatChartLabel)
			.enter().append("svg:text")
			.attr("class","y-scale-label")
			.attr("x",0)
			.attr("y", function(d, i) { return (numRows- i) * (chart_height / numRows);})
			.attr("dx",-margin.left/8)
			.attr("dy","0.3em")
			.attr("text-anchor","end")
			.text(String);
	};

//=============================================================================================================================================================================================================================================================

	var removeSVG = function(){
		$('.plot1').html('');
		$('.plot2').html('');
	}
	var displayQuiznum = function(){
		$('#maxGrade').val(maxG)
		$('#minGrade').val(minG)
		$('#numTps').val(numTps)
		div=$('.navbar')
		if($('.a').length==0){
			div.append(
	         '<div class="a">'
	        +   '<div class = "assignment-row">'
	        +   '<div class = "btn-group">'
	        //+       '<button type = "button" class="btn btn-default btn-l"><span class="glyphicon glyphicon-chevron-left"></span></button>'
	        +       '<div class = "btn-group">'
	        +           '<button class="btn btn-default btn-lg dropdown-toggle" type="button" data-toggle="dropdown">Quiz '+(20+quizNum)+'<span class="caret"></span></button>'
	        +           '<ul id="dd" class="dropdown-menu">'
	        +				'<li class="quiz21"><a tabindex="-1" href="#">Quiz21</a></li>'
	        +				'<li class="quiz22"><a tabindex="-1" href="#">Quiz22</a></li>'
	    	+				'<li class="quiz23"><a tabindex="-1" href="#">Quiz23</a></li>'
	    	+				'<li class="quiz24"><a tabindex="-1" href="#">Quiz24</a></li>'
	    	+				'<li class="quiz25"><a tabindex="-1" href="#">Quiz25</a></li>'
	        +           '</ul>'
	        +       '</div>'
	        //+       '<button type = "button" class="btn btn-default btn-r"><span class="glyphicon glyphicon-chevron-right"></span></button>'
	        +   '</div>'
	        +'</div>'
	        );			
		}else{
			$('.a').replaceWith(
				'<div class="a">'
	        +   '<div class = "assignment-row">'
	        +   '<div class = "btn-group">'
	        //+       '<button type = "button" class="btn btn-default btn-l"><span class="glyphicon glyphicon-chevron-left"></span></button>'
	        +       '<div class = "btn-group">'
	        +           '<button class="btn btn-default btn-lg dropdown-toggle" type="button" data-toggle="dropdown">Quiz '+(20+quizNum)+'<span class="caret"></span></button>'
	        +           '<ul id="dd" class="dropdown-menu">'
	        +				'<li class="quiz21"><a tabindex="-1" href="#">Quiz21</a></li>'
	        +				'<li class="quiz22"><a tabindex="-1" href="#">Quiz22</a></li>'
	    	+				'<li class="quiz23"><a tabindex="-1" href="#">Quiz23</a></li>'
	    	+				'<li class="quiz24"><a tabindex="-1" href="#">Quiz24</a></li>'
	    	+				'<li class="quiz25"><a tabindex="-1" href="#">Quiz25</a></li>'
	        +           '</ul>'
	        +       '</div>'
	        //+       '<button type = "button" class="btn btn-default btn-r"><span class="glyphicon glyphicon-chevron-right"></span></button>'
	        +   '</div>'
	        +'</div>'
	        );
		}
		$('.quiz2'+quizNum).attr('class','disabled');
	}
	var setupOnclick = function(){
		$('#plot').click(function(){

			maxG=parseInt($('#maxGrade').val())
			minG=parseInt($('#minGrade').val())
			numTps=parseInt($('#numTps').val())
			numRows = numTps
		    numCols = maxG-minG+1
			setupData();
			removeSVG();
			viewSVG();
		})
		$('div.btn-group ul.dropdown-menu li a').click(function (e) {
			var quiz=$(this).text();
			quizNum=parseInt(quiz[5]);
			setupComponents();
			console.log(quizNum)
			setupData();
			removeSVG();
		    viewSVG();

		    e.preventDefault();
		});
	}
	var setupComponents = function(){
		displayQuiznum();
		setupOnclick();
	}
	var viewSVG = function(){
		createScatterplot();
		createHeatchart();
	}

//=============================================================================================================================================================================================================================================================


	return {setupData:setupData,
			setupComponents:setupComponents,
			viewSVG:viewSVG};

}())

$(document).ready(function() {
	scatterPlot.setupData();
	scatterPlot.setupComponents();
	scatterPlot.viewSVG();
	// createScatterplot();
	// createHeatchart();
});


