[[{"y":0,"y0":0},{"y":1,"y0":0},{"y":2,"y0":0},{"y":3,"y0":0},{"y":9,"y0":0}],
[{"y":0,"y0":0},{"y":1,"y0":1},{"y":2,"y0":2},{"y":5,"y0":3},{"y":13,"y0":9}],
[{"y":4,"y0":0},{"y":1,"y0":2},{"y":7,"y0":4},{"y":7,"y0":8},{"y":37,"y0":22}],
[{"y":0,"y0":4},{"y":1,"y0":3},{"y":1,"y0":11},{"y":6,"y0":15},{"y":28,"y0":59}],
[{"y":1,"y0":4},{"y":1,"y0":4},{"y":0,"y0":12},{"y":4,"y0":21},{"y":10,"y0":87}]] 

var data = []
for (i=0; i < 1000; i++) {
    data.push({"x": Math.random(), "y": Math.random()})
}

var h = 1000
var vis = d3.select("body")
    .append("svg:svg")
    .attr("width", screen.width)
    .attr("height", screen.innerHeight)

var x = d3.scale.linear().domain([0,1]).range([screen.width / 2 - 400,screen.width / 2 + 400]),
y = d3.scale.linear().domain([0,1]).range([0,h]),
r = d3.scale.linear().domain([0,1]).range([5,10]),
c = d3.scale.linear().domain([minG,maxG]).range(["hsl(250, 50%, 50%)", "hsl(350, 100%, 50%)"]).interpolate(d3.interpolateHsl)
 
vis.selectAll("circle")
    .data(data)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    .attr("visibility", "hidden")
    .attr("r", function() { return r(Math.random()) })

var y2 = d3.scale.linear().domain([0,1]).range([h/2 - 20, h/2 + 20])
var del = d3.scale.linear().domain([0,1]).range([0,1])

d3.selectAll("circle").transition()
	.attr("cx", function() { return x(Math.random()) })
	.attr("cy", function() { return y2(Math.random()) })
	.attr("visibility", "visible")
	.delay(function(d,i) { return i * del(Math.random()) })
	.duration(1000)
	.ease("elastic", 10, .45)

vis.selectAll("circle")
    .data(data)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    .attr("visibility", "hidden")
    .attr("r", function() { return r(Math.random()) })
    .on("mouseover", function() {
        d3.select(this).transition()
        .attr("cy", function() { return y2(Math.random()) })
        .delay(0)
        .duration(2000)
        .ease("elastic", 10, .3)
    })