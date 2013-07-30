/*
Color the bar graph from green to less green
*/

var timePeriod = 20;//stack all data in every 20s
var maxDiff = 4;//maximum difference from the correct answer ex. A,B -> B,C has diff 2. A,B -> B has diff 1.

var outer_height=300;
var outer_width=300;

var margin={top:20, right:20,bottom:20,left:20};
var chart_height=outer_height-margin.top-margin.bottom
var chart_width=outer_width-margin.left-margin.right

var stack= d3.layout.stack();
var stacked_data=stacked(dataset)
