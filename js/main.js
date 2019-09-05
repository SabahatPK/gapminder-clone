/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

const margin = { left: 100, right: 10, top: 10, bottom: 150 };

const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

let g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Y-label - TBA
//X-label
g.append("text")
  .attr("class", "y axis")
  .attr("x", -(height / 2))
  .attr("y", -40)
  .attr("font-size", "10px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expenctancy");

d3.json("data/data.json")
  .then(function(data) {
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

    //Checking structure of data post-clean-up:

    //[Array]

    //Get all incomes for all years in 1 array, then calc min and max:
    let allIncomes = cleanData.map(each =>
      each.map(eacher => eacher["income"])
    );
    let diffInIncomes = d3.extent([].concat(...allIncomes));

    //x-scale:
    let x = d3
      .scaleLog()
      .base(10)
      .domain(diffInIncomes)
      .range([0, width]);

    //y-scale:
    let y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

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

    //Focus on Yr1 data only:
    cleanData = cleanData[0];

    let circles = g
      .selectAll("circle")
      .data(cleanData)
      .enter()
      .append("circle");

    circles
      .attr("cx", function(d) {
        return x(d.income);
      })
      .attr("cy", function(d) {
        return y(d.life_exp);
      })
      .attr("r", 5)
      .style("fill", "blue");
  })
  .catch(function(error) {
    console.log(error);
  });
