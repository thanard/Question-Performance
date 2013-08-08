/*
Color the bar graph from green to less green
*/

var timePeriod = 20;//stack all data in every 20s
var maxDiff = 4;//maximum difference from the correct answer ex. A,B -> B,C has diff 2. A,B -> B has diff 1.

var outer_height=500;
var outer_width=600;

var margin={top:40, right:140,bottom:40,left:40};
var chart_height=outer_height-margin.top-margin.bottom
var chart_width=outer_width-margin.left-margin.right

var stack= d3.layout.stack();
var stacked_data=stack(dataset1);

console.log(JSON.stringify(stacked_data))


var y_stack_max= d3.max(stacked_data,function(layer){ 
	return d3.max(layer,function(d){
		return d.y + d.y0;
	});
});

// functions maping data to position on the screen
var y_scale=d3.scale.linear()
	.domain([0,y_stack_max]).range([0,chart_height]);

var x_scale=d3.scale.ordinal()
	.domain(d3.range(dataset1[0].length)).rangeBands([0,chart_height]);

//  add an SVG element to the chart-container div
var chart= d3.select(".chart-container").append("svg")
	.attr("class","chart")
	.attr("height",outer_height)
	.attr("width",outer_width)
	.append("g")
	.attr("transform","translate("+ margin.left + "," +margin.top + ")");//g-group element

chart.selectAll(".x-scale-label").data(xLabels)
	.enter().append("svg:text")
	.attr("class","x-scale-label")
	.attr("x",function(d,i){return (i+.5)*x_scale.rangeBand();})
	.attr("y",chart_height)
	.attr("dx",0)
	.attr("dy",margin.top/4)
	.attr("text-anchor","middle")
	.text(function(d){return parseInt(d.starting)+"-"+parseInt(d.ending);});

chart.selectAll(".y-scale-label").data(y_scale.ticks(10))
	.enter().append("svg:text")
	.attr("class","y-scale-label")
	.attr("x",0)
	.attr("y",function(d){return chart_height-y_scale(d);})
	.attr("dx",-margin.left/8)
	.attr("dy","0.3em")
	.attr("text-anchor","end")
	.text(String);

chart.selectAll(".x-name-label").data(['time periods(s)'])
	.enter().append("svg:text")
	.attr("class","x-name-label")
	.attr("x",chart_width/2)
	.attr("y",chart_height)
	.attr("dx",0)
	.attr("dy",3*margin.top/4)
	.attr("text-anchor","middle")
	.text(String);

chart.selectAll(".y-name-label").data(['number of students'])
	.enter().append("svg:text")
	.attr("class","y-name-label")
	.attr("x",0)
	.attr("y",chart_height/2)
	.attr("dx",-3*margin.left/4)
	.attr("dy","0.3em")
	.attr("text-anchor","middle")
	.attr("transform","rotate(-90,"+(-3*margin.left/4)+","+(chart_height/2)+")")
	.text(String);


chart.selectAll("line").data(y_scale.ticks(10))
	.enter().append("svg:line")
	.attr("x1",0)
	.attr("x2",chart_width)
	.attr("y1",function(d){return chart_height-y_scale(d);})
	.attr("y2",function(d){return chart_height-y_scale(d);});

var layer_groups = chart.selectAll(".layer").data(stacked_data)
	.enter().append("g")
		.attr("class","layer");

//Coloring rects
var c = d3.scale.linear().domain([0,maxG-minG]).range(["hsl(149, 100%, 43%)", "hsl(149, 100%, 20%)"]).interpolate(d3.interpolateHsl);

var rects =layer_groups.selectAll("rect").data(function(d){return d;})
	.enter().append("svg:rect")
		.attr("x",function(d,i){return x_scale(i)})
		.attr("y",function(d){return chart_height-y_scale(d.y0+d.y);})
		.attr("fill", function(d,i,j){return c(j);})
		.attr("width",x_scale.rangeBand())
		.attr("height",function(d){return y_scale(d.y0+d.y)-y_scale(d.y0)});

chart.selectAll(".color-label").data(d3.range(maxG-minG+1))
	.enter().append("svg:text")
	.attr("x",chart_width)
	.attr("y",function(d){return 25*d;})
	.attr("dx",margin.right/4+x_scale.rangeBand()/6)
	.attr("dy",margin.top/8+x_scale.rangeBand()/6)
	.attr("text-anchor","start")
	.text(function(d){return "grade = "+(d+minG);})

chart.selectAll(".small-colored-rect").data(d3.range(maxG-minG+1))
	.enter().append("svg:rect")
	.attr("width",x_scale.rangeBand()/3)
	.attr("height",x_scale.rangeBand()/3)
	.attr("x",chart_width+margin.right/8)
	.attr("y",function(d){return 25*d+margin.top/8;})
	.attr("rx",3)
	.attr("ry",3)
	.attr("fill",function(d){return c(d);});

//Time average
chart.selectAll(".timeAverage").data(['Time Average = '+parseInt(timeAverage*100)/100.0])
	.enter().append("svg:text")
	.attr("class","x-name-label")
	.attr("x",chart_width+margin.right/8)
	.attr("y",25*(maxG-minG+2)+margin.top/8)
	.attr("dx",0)
	.attr("dy",0)
	.attr("text-anchor","start")
	.text(String);

//Time average
chart.selectAll(".gradeAverage").data(['Grade Average = '+parseInt(gradeAverage*100)/100.0])
	.enter().append("svg:text")
	.attr("class","x-name-label")
	.attr("x",chart_width+margin.right/8)
	.attr("y",25*(maxG-minG+3)+margin.top/8)
	.attr("dx",0)
	.attr("dy",0)
	.attr("text-anchor","start")
	.text(String);

function unstack_bar(){
	rects.transition()
		.duration(1000)
		.delay(function(d,i){return i*10})
		.attr("x",function(d,i,j){
			return x_scale(i)+x_scale.rangeBand()/stacked_data.length*j;
		})
		.attr("width",x_scale.rangeBand()/stacked_data.length)
		.transition()
		.attr("y",function(d){
			return   chart_height-y_scale(d.y);
		});
}

function stack_bar(){
	rects.transition()
	.duration(1000)
	.delay(function(d,i){return i*10;})
		.attr("y",function(d){
			console.log(chart_height-y_scale(d.y+d.y0))
			return   chart_height-y_scale(d.y+d.y0);
		})
		.transition()
		.attr("x",function(d,i){
			return x_scale(i);
		})
		.attr("width",x_scale.rangeBand());
}