export function plotGraph(meanValuesList, selectedVariableValue) {
  // Define y-axis ranges for each selected variable
  const yaxisRanges = {
    airTempProjBS: [18, 36],
    tsurfProjBS: [290, 318],
    bioPETProjBS: [16, 40],
    bioUTCIProjBS: [18, 36],
  };
  // Define dummy shapesData for all selectedVariableValue options
  let shapesData;
  if (selectedVariableValue === "airTempProjBS") {
    shapesData = [
      { y0: 18, y1: 19.8, fillcolor: "rgba(0, 0, 255, 0.5)" }, // Blue: 18°C - 19.8°C
      { y0: 19.8, y1: 21.6, fillcolor: "rgba(0, 100, 255, 0.5)" }, // Light Blue: 19.8°C - 21.6°C
      { y0: 21.6, y1: 23.4, fillcolor: "rgba(0, 150, 255, 0.5)" }, // Cyan: 21.6°C - 23.4°C
      { y0: 23.4, y1: 25.2, fillcolor: "rgba(0, 200, 255, 0.5)" }, // Aqua: 23.4°C - 25.2°C
      { y0: 25.2, y1: 27, fillcolor: "rgba(0, 255, 200, 0.5)" }, // Light Green: 25.2°C - 27°C
      { y0: 27, y1: 28.8, fillcolor: "rgba(100, 255, 150, 0.5)" }, // Green: 27°C - 28.8°C
      { y0: 28.8, y1: 30.6, fillcolor: "rgba(200, 255, 100, 0.5)" }, // Yellow-Green: 28.8°C - 30.6°C
      { y0: 30.6, y1: 32.4, fillcolor: "rgba(255, 255, 0, 0.5)" }, // Yellow: 30.6°C - 32.4°C
      { y0: 32.4, y1: 34.2, fillcolor: "rgba(255, 165, 0, 0.5)" }, // Orange: 32.4°C - 34.2°C
      { y0: 34.2, y1: 36, fillcolor: "rgba(255, 69, 0, 0.5)" }, // Red-Orange: 34.2°C - 36°C
    ];
  } else if (selectedVariableValue === "tsurfProjBS") {
    shapesData = [
      { y0: 288, y1: 291.4, fillcolor: "rgba(0, 0, 255, 0.5)" }, // Dark Blue
      { y0: 291.4, y1: 294.8, fillcolor: "rgba(0, 100, 255, 0.5)" }, // Blue
      { y0: 294.8, y1: 298.2, fillcolor: "rgba(0, 150, 255, 0.5)" }, // Light Blue
      { y0: 298.2, y1: 301.6, fillcolor: "rgba(0, 200, 255, 0.5)" }, // Cyan
      { y0: 301.6, y1: 305, fillcolor: "rgba(0, 255, 200, 0.5)" }, // Aqua
      { y0: 305, y1: 308.4, fillcolor: "rgba(0, 255, 150, 0.5)" }, // Green
      { y0: 308.4, y1: 311.8, fillcolor: "rgba(100, 255, 100, 0.5)" }, // Light Green
      { y0: 311.8, y1: 315.2, fillcolor: "rgba(200, 255, 50, 0.5)" }, // Yellow
      { y0: 315.2, y1: 318.6, fillcolor: "rgba(255, 200, 0, 0.5)" }, // Orange
      { y0: 318.6, y1: 322, fillcolor: "rgba(255, 100, 0, 0.5)" }, // Red
    ];
  } else if (selectedVariableValue === "bioPETProjBS") {
    shapesData = [
      { y0: 41, y1: 100, fillcolor: "rgba(128, 0, 0, 0.5)" }, // Dark Red: Extreme Heat Stress
      { y0: 35, y1: 41, fillcolor: "rgba(255, 0, 0, 0.5)" }, // Red: Strong Heat Stress
      { y0: 29, y1: 35, fillcolor: "rgba(255, 165, 0, 0.5)" }, // Orange: Moderate Heat Stress
      { y0: 23, y1: 29, fillcolor: "rgba(255, 255, 0, 0.5)" }, // Yellow: Slight Heat Stress
      { y0: 18, y1: 23, fillcolor: "rgba(0, 128, 0, 0.5)" }, // Green: No Thermal Stress
      { y0: 13, y1: 18, fillcolor: "rgba(144, 238, 144, 0.5)" }, // Light Green: Slight Cold Stress
      // { y0: 8, y1: 13, fillcolor: "rgba(173, 216, 230, 0.5)" },         // Light Blue: Moderate Cold Stress
      // { y0: 4, y1: 8, fillcolor: "rgba(0, 255, 255, 0.5)" },            // Cyan: Strong Cold Stress
      // { y0: -100, y1: 4, fillcolor: "rgba(0, 0, 255, 0.5)" },      // Blue: Extreme Cold Stress
    ]; //https://www.researchgate.net/figure/Physiologically-equivalent-temperature-PET-for-different-grades-of-thermal-sensation_tbl2_346383592
  } else if (selectedVariableValue === "bioUTCIProjBS") {
    shapesData = [
      { y0: 46, y1: 100, fillcolor: "rgba(128, 0, 0, 0.5)" }, // Dark Red: Extreme Heat Stress
      { y0: 38, y1: 46, fillcolor: "rgba(255, 0, 0, 0.5)" }, // Red: Very Strong Heat Stress
      { y0: 32, y1: 38, fillcolor: "rgba(255, 165, 0, 0.5)" }, // Orange: Strong Heat Stress
      { y0: 26, y1: 32, fillcolor: "rgba(255, 255, 0, 0.5)" }, // Yellow: Moderate Heat Stress
      { y0: 9, y1: 26, fillcolor: "rgba(144, 238, 144, 0.5)" }, // Light Green: No Thermal Stress
      // { y0: 0, y1: 9, fillcolor: "rgba(173, 216, 230, 0.5)" },          // Light Blue: Slight Cold Stress
      // { y0: -13, y1: 0, fillcolor: "rgba(0, 255, 255, 0.5)" },          // Cyan: Moderate Cold Stress
      // { y0: -27, y1: -13, fillcolor: "rgba(0, 0, 255, 0.5)" },          // Blue: Strong Cold Stress
      // { y0: -40, y1: -27, fillcolor: "rgba(0, 0, 139, 0.5)" },          // Dark Blue: Very Strong Cold Stress
      // { y0: -100, y1: -40, fillcolor: "rgba(75, 0, 130, 0.5)" },   // Purple: Extreme Cold Stress
    ]; //https://www.researchgate.net/figure/The-scale-of-UTCI-and-the-degree-of-comfort_tbl1_327395693
  }
  // Assign the appropriate y-axis range based on the selected variable
  var yaxis_range = yaxisRanges[selectedVariableValue];
  var shapes = shapesData.map((shape) => ({
    type: "rect",
    xref: "paper",
    yref: "y",
    x0: 0,
    y0: shape.y0,
    x1: 1,
    y1: shape.y1,
    fillcolor: shape.fillcolor,
    line: { width: 0 },
    layer: "below",
  }));

  // Define the trace for the plot
  var trace1 = {
    x: [],
    y: [],
    type: "scatter",
    mode: "lines+markers",
    line: {
      color: "rgb(251,62,181)",
      width: 3,
      dash: "solid",
    },
    marker: {
      color: "rgb(251,62,181)",
      size: 10,
      symbol: "circle",
      line: {
        color: "white",
        width: 2,
      },
    },
  };

  // Define the layout for the plot
  var layout = {
    title: {
      text: "Temperature Over Time",
      font: { size: 20 },
      xref: "paper",
      x: 0.5,
    },
    xaxis: {
      title: { text: "Time (Hour)", font: { size: 18 } },
      range: [-1, 25],
      dtick: 2,
      showgrid: true,
      gridcolor: "rgba(120, 120, 120, 0.5)",
      zeroline: false,
      showline: true,
      linewidth: 2,
      linecolor: "black",
      mirror: true,
      tickfont: { size: 16 },
    },
    yaxis: {
      title: { text: "Temperature (°C)", font: { size: 18 } },
      range: yaxis_range,
      dtick: 2,
      showgrid: true,
      gridcolor: "rgba(120, 120, 120, 0.5)",
      zeroline: false,
      showline: true,
      linewidth: 1,
      linecolor: "black",
      mirror: true,
      tickfont: { size: 16 },
    },
    plot_bgcolor: "rgba(255, 255, 255, 1)",
    paper_bgcolor: "white",
    showlegend: false,
    margin: {
      l: 80,
      r: 30,
      b: 60,
      t: 60,
      pad: 10,
    },
    shapes: shapes,
  };

  // Plot the graph
  Plotly.newPlot("plotlyLineGraph", [trace1], layout);

  var fullX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24,];
  var fullY = meanValuesList;

  var i = 0;
  function addPoint() {
    if (i < fullX.length) {
      Plotly.extendTraces(
        "plotlyLineGraph",
        {
          x: [[fullX[i]]],
          y: [[fullY[i]]],
        },
        [0]
      );
      i++;
      setTimeout(addPoint, 15);
    }
  }
  setTimeout(addPoint, 100);
}
