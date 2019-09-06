/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

const margin = { left: 100, right: 10, top: 10, bottom: 150 };

const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

let time = 0;

//Declare (and also define sometimes) the scales up front
let x;
let y;

let area = d3
  .scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000]);

let circleColorScale;

//Start painting the canvas:
let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

let g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Y-label - TBA
g.append("text")
  .attr("class", "y axis")
  .attr("x", -(height / 2))
  .attr("y", -40)
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expenctancy");

//Year label - bottom right:
let timeLabel = g
  .append("text")
  .attr("y", height - 10)
  .attr("x", width - 40)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .text("1800");

let continents = ["africa", "europe", "asia", "americas"];

let legend = g.append("g");

//Read data in:
d3.json("data/data.json").then(function(data) {
  let cleanData = [];
  data.map(each => {
    cleanData.push(
      each["countries"].filter(
        country =>
          country["income"] !== null &&
          country["life_exp"] !== null &&
          country["population"] !== null
      )
    );
  });

  //Get all incomes for all years in 1 array, then calc min and max:
  let allIncomes = cleanData.map(each => each.map(eacher => eacher["income"]));
  let diffInIncomes = d3.extent([].concat(...allIncomes));

  //x-scale:
  x = d3
    .scaleLog()
    .base(10)
    .domain(diffInIncomes)
    .range([0, width]);

  //y-scale:
  y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

  //Circle-color scale:
  circleColorScale = d3
    .scaleOrdinal()
    .domain([cleanData.map(each => each.continent)])
    .range(d3.schemeAccent);

  //Update the legend with information -
  continents.forEach((conti, i) => {
    let legendRow = legend
      .append("g")
      .attr("transform", "translate(0, " + i * 20 + ")");

    legendRow
      .append("rect")
      .attr(
        "transform",
        "translate(" + (width - 10) + "," + (height - 130) + ")"
      )
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", circleColorScale(conti));

    legendRow
      .append("text")
      .text(conti)
      .attr(
        "transform",
        "translate(" + (width - 75) + "," + (height - 120) + ")"
      );
  });

  //x-axis:
  let xAxisCall = d3
    .axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"));

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxisCall);

  //y-axis:
  let yAxisCall = d3.axisLeft(y).tickFormat(function(d) {
    return d;
  });
  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);

  //Tooltip:
  // let tip = d3
  //   .tip()
  //   .attr("class", "d3-tip")
  //   .html(function(d) {
  //     return d;
  //   });

  // circles.call(tip);

  d3.interval(function() {
    // At the end of our data, loop back
    time = time < 214 ? time + 1 : 0;
    update(cleanData[time]);
  }, 200);

  // First run of the visualization
  update(cleanData[0]);
});

function update(data) {
  // let t = d3.transition().duration(100);
  let circles = g.selectAll("circle").data(data, function(d) {
    return d.country;
  });

  // EXIT old elements not present in new data.
  circles
    .exit()
    .attr("class", "exit")
    .remove();

  //ENTER new elements present in new data:
  circles
    .enter()
    .append("circle")
    .attr("class", "enter")
    .style("fill", function(d) {
      return circleColorScale(d.continent);
    })
    .merge(circles)
    // .transition(t)
    .attr("cx", function(d) {
      return x(d.income);
    })
    .attr("cy", function(d) {
      return y(d.life_exp);
    })
    .attr("r", function(d) {
      return Math.sqrt(area(d.population) / Math.PI);
    });
  // .on("mouseover", tip.show)
  // .on("mouseout", tip.hide);

  timeLabel.text(parseInt(time + 1800));
}
