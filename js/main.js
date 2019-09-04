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
//X-label - TBA

d3.json("data/data.json")
  .then(function(data) {
    console.log(data[1]);
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

    console.log(cleanData[1]);

    //[Array]

    //Get all incomes for all years in 1 array, then calc min and max:
    let allIncomes = cleanData.map(each =>
      each.map(eacher => eacher["income"])
    );

    let diffInIncomes = d3.extent([].concat(...allIncomes));

    let x = d3
      .scaleLog()
      .base(10)
      .domain([diffInIncomes[0], diffInIncomes[1]])
      .range([0, width]);

    let y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    let xAxisCall = d3.axisBottom(x);
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxisCall);

    let yAxisCall = d3.axisLeft(y).tickFormat(function(d) {
      return d;
    });
    g.append("g")
      .attr("class", "y axis")
      .call(yAxisCall);

    let circles = g
      .selectAll("circle")
      .data(cleanData, function(d) {
        return d.country;
      })
      .enter()
      .append("circle");

    circles
      .attr("cx", function(d) {
        return x(d.income);
      })
      .attr("cy", function(data, i) {
        return i;
      })
      .attr("r", 5)
      .style("fill", "blue");
  })
  .catch(function(error) {
    console.log(error);
  });
