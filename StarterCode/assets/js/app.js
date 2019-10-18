var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(stateData) {

    stateData.forEach(function(data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    //Create Scales
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(stateData, d=> d.smokes)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.age)])
        .range([height,0]);

    //create axis functions + append to chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform",`translate(0, ${height})`)
        .call(bottomAxis);

    //Create the Scatter circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.smokes))
        .attr("cy", d => yLinearScale(d.age))
        .attr("r","15")
        .attr("fill","orange")
        .attr("opacity","0.5");
    
    //Tooltip
    var toolTip = d3.tip()
        .attr("class","tooltip")
        .offset([80, -60])
        .html(function (d) {
            return(`${d.state}<br>Smokers: ${d.smokes}<br>Age: ${d.age}`);
        });

    //tooltip in chart
    chartGroup.call(toolTip);

    //Listeners
    circlesGroup.on("click", function(data) {
        toolTip.show(data,this);
    })
        ,on("mouseout", function(data, index){
            toolTip.hide(data);
        })
    
    //Axis Labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smoking Rate %");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age in Years");
    });
