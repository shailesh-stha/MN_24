const plotTitle = {
  ta_2m: 'Air Temperature over time',
  tsurf: 'Surface Temperature ove time',
  bio_pet: 'PET over time',
  bio_utci: 'UTCI over time',
  tIndoor: 'Indoor Temperature over time',
};
const legendTitle = {
  ta_2m: 'Air Temperature',
  tsurf: 'Surface Temperature',
  bio_pet: 'PET',
  bio_utci: 'UTCI',
  tIndoor: 'Indoor Temperature'
};
const yaxisRanges = {
  ta_2m: [18, 36],
  tsurf: [16, 44],
  bio_pet: [16, 40],
  bio_utci: [18, 36],
  tIndoor: [20,24],
};

const shapeDatas = {
  ta_2m: [
    { y0: 36, y1: 38, fillcolor: "rgba(255, 69, 0, 0.5)" },
    { y0: 34, y1: 36, fillcolor: "rgba(255, 165, 0, 0.5)" },
    { y0: 32, y1: 34, fillcolor: "rgba(255, 255, 0, 0.5)" },
    { y0: 30, y1: 32, fillcolor: "rgba(200, 255, 100, 0.5)" },
    { y0: 28, y1: 30, fillcolor: "rgba(100, 255, 150, 0.5)" },
    { y0: 26, y1: 28, fillcolor: "rgba(0, 255, 200, 0.5)" },
    { y0: 24, y1: 26, fillcolor: "rgba(0, 200, 255, 0.5)" },
    { y0: 22, y1: 24, fillcolor: "rgba(0, 150, 255, 0.5)" },
    { y0: 20, y1: 22, fillcolor: "rgba(0, 100, 255, 0.5)" },
    { y0: 18, y1: 20, fillcolor: "rgba(0, 0, 255, 0.5)" }
  ],
  tsurf: [
    { y0: 44.6, y1: 48, fillcolor: "rgba(255, 100, 0, 0.5)" },
    { y0: 41.2, y1: 44.6, fillcolor: "rgba(255, 200, 0, 0.5)" },
    { y0: 37.8, y1: 41.2, fillcolor: "rgba(200, 255, 50, 0.5)" },
    { y0: 34.4, y1: 37.8, fillcolor: "rgba(100, 255, 100, 0.5)" },
    { y0: 31, y1: 34.4, fillcolor: "rgba(0, 255, 150, 0.5)" },
    { y0: 27.6, y1: 31, fillcolor: "rgba(0, 255, 200, 0.5)" },
    { y0: 24.2, y1: 27.6, fillcolor: "rgba(0, 200, 255, 0.5)" },
    { y0: 20.8, y1: 24.2, fillcolor: "rgba(0, 150, 255, 0.5)" },
    { y0: 17.4, y1: 20.8, fillcolor: "rgba(0, 100, 255, 0.5)" },
    { y0: 14, y1: 17.4, fillcolor: "rgba(0, 0, 255, 0.5)" },
  ],
  bio_pet: [
    { y0: 41, y1: 60, fillcolor: "rgba(128, 0, 0, 0.5)" }, // Extreme Heat Stress
    { y0: 35, y1: 41, fillcolor: "rgba(255, 0, 0, 0.5)" }, // Strong Heat Stress
    { y0: 29, y1: 35, fillcolor: "rgba(255, 165, 0, 0.5)" }, // Moderate Heat Stress
    { y0: 23, y1: 29, fillcolor: "rgba(255, 255, 0, 0.5)" }, // Slight Heat Stress
    { y0: 18, y1: 23, fillcolor: "rgba(0, 128, 0, 0.5)" }, // No Thermal Stress
    { y0: 13, y1: 18, fillcolor: "rgba(144, 238, 144, 0.5)" }, // Slight Cold Stress
    // { y0: 8, y1: 13, fillcolor: "rgba(173, 216, 230, 0.5)" }, // Moderate Cold Stress
    // { y0: 4, y1: 8, fillcolor: "rgba(0, 255, 255, 0.5)" }, // Strong Cold Stress
    // { y0: -100, y1: 4, fillcolor: "rgba(0, 0, 255, 0.5)" }, // Extreme Cold Stress
  ],
  bio_utci: [
    { y0: 46, y1: 60, fillcolor: "rgba(128, 0, 0, 0.5)" }, // Extreme Heat Stress
    { y0: 38, y1: 46, fillcolor: "rgba(255, 0, 0, 0.5)" }, // Very Strong Heat Stress
    { y0: 32, y1: 38, fillcolor: "rgba(255, 165, 0, 0.5)" }, // Strong Heat Stress
    { y0: 26, y1: 32, fillcolor: "rgba(255, 255, 0, 0.5)" }, // Moderate Heat Stress
    { y0: 9, y1: 26, fillcolor: "rgba(144, 238, 144, 0.5)" }, // No Thermal Stress
    // { y0: 0, y1: 9, fillcolor: "rgba(173, 216, 230, 0.5)" }, // Slight Cold Stress
    // { y0: -13, y1: 0, fillcolor: "rgba(0, 255, 255, 0.5)" }, // Moderate Cold Stress
    // { y0: -27, y1: -13, fillcolor: "rgba(0, 0, 255, 0.5)" }, // Strong Cold Stress
    // { y0: -40, y1: -27, fillcolor: "rgba(0, 0, 139, 0.5)" }, // Very Strong Cold Stress
    // { y0: -100, y1: -40, fillcolor: "rgba(75, 0, 130, 0.5)" }, // Extreme Cold Stress
  ],
  tIndoor: [
    { y0: 23.0, y1: 24.0, fillcolor: "rgba(255, 69, 0, 0.5)" },
    { y0: 22.5, y1: 23.0, fillcolor: "rgba(255, 165, 0, 0.5)" },
    { y0: 22.0, y1: 22.5, fillcolor: "rgba(255, 255, 0, 0.5)" },
    { y0: 21.5, y1: 22.0, fillcolor: "rgba(200, 255, 100, 0.5)" },
    { y0: 21.0, y1: 21.5, fillcolor: "rgba(100, 255, 150, 0.5)" },
    { y0: 20.5, y1: 21.0, fillcolor: "rgba(0, 200, 255, 0.5)" },
    { y0: 20.0, y1: 20.5, fillcolor: "rgba(0, 100, 255, 0.5)" },
  ],
};

export function plotGraph(meanValuesList, selectedVariableValue, bandNumber) {
  let shapeData = shapeDatas[selectedVariableValue];
  let yaxis_range = yaxisRanges[selectedVariableValue];

  let backgroundShapes = shapeData.map((shape) => ({
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
    line: { color: "rgb(251,62,181)", width: 3, dash: "solid" },
    marker: { color: "rgb(251,62,181)", size: 10, symbol: "circle", line: { color: "white", width: 2 } },
    name: legendTitle[selectedVariableValue],
    showlegend: true,
  };

  var shapeDataLegend = shapeDatas[selectedVariableValue]
    .map((shape) => ({
      x: [null],
      y: [null],
      mode: "markers",
      marker: { color: shape.fillcolor, size: 12, symbol: "square" },
      name: `${shape.y0.toFixed(2)} - ${shape.y1.toFixed(2)} °C`,
      showlegend: true,
    }));

  // Define the layout for the plot
  var layout = {
    autosize: true,
    // height: 420,
    title: {
      text: plotTitle[selectedVariableValue],
      font: { size: 18 },
      xref: "paper",
      x: 0.5,
    },
    xaxis: {
      title: { text: "Time (Hour)", font: { size: 16 } },
      range: [-1, 25],
      dtick: 2,
      showgrid: true,
      gridcolor: "rgba(120, 120, 120, 0.5)",
      zeroline: false,
      linecolor: "black",
      mirror: true,
      tickfont: { size: 16 },
      tickvals: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
      ticktext: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "24"],
    },
    yaxis: {
      title: { text: "Temperature (°C)", font: { size: 16 } },
      range: yaxis_range,
      dtick: 2,
      showgrid: true,
      gridcolor: "rgba(120, 120, 120, 0.5)",
      zeroline: false,
      linecolor: "black",
      mirror: true,
      tickfont: { size: 16 },
    },
    margin: { l: 60, r: 30, b: 50, t: 40, pad: 5 },
    shapes: [
      ...backgroundShapes,
      {
        type: "line",
        xref: "x",
        yref: "paper",
        x0: bandNumber,
        y0: 0,
        x1: bandNumber,
        y1: 1,
        line: {
          color: "#ff00ff",
          width: 3,
          dash: "dashdot"
        },
        layer: "below"
      }
    ],
    legend: {
      x: 0.00,
      y: 1.00,
      xanchor: "left",
      yanchor: "top",
      bgcolor: "rgba(255,255,255,0.75)",
      tracegroupgap: 0, // Reduced the vertical space between legend items
      font: { size: 11 }, // Adjusted font size to make it more compact
      itemwidth: 30, // Adjusted the item width
    },
    paper_bgcolor: "rgba(0,0,150,0.01)",
  };

  // Plot the graph
  Plotly.newPlot("plotlyLineGraph", [trace1, ...shapeDataLegend], layout);

  let fullX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  let fullY = meanValuesList;

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

export function plotLineGraph(containerId, x, y, selectedVariableValue) {
  var trace = {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: "rgb(251,62,181)", width: 3, dash: "solid" },
      marker: { color: "rgb(251,62,181)", size: 10, symbol: "circle", line: { color: "white", width: 2 } },
  };

  // Data and layout for the plot
  var data = [trace];
  var layout = {
    title: {
      text: (plotTitle[selectedVariableValue] + ' at Marker Location'),
      font: { size: 18 },
      xref: "paper",
      x: 0.5,
    },
    xaxis: {
      title: { text: "Time (Hour)", font: { size: 16 } },
      range: [-1, 25],
      dtick: 2,
      showgrid: true,
      gridcolor: "rgba(120, 120, 120, 0.5)",
      zeroline: false,
      linecolor: "black",
      mirror: true,
      tickfont: { size: 16 },
      tickvals: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
      ticktext: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "24"],
    },
    yaxis: {
      title: { text: "Temperature (°C)", font: { size: 16 } },
      // range: yaxis_range,
      dtick: 2,
      showgrid: true,
      gridcolor: "rgba(120, 120, 120, 0.5)",
      zeroline: false,
      linecolor: "black",
      mirror: true,
      tickfont: { size: 16 },
    },
    margin: { l: 60, r: 30, b: 50, t: 40, pad: 5 },
    paper_bgcolor: "rgba(0,0,150,0.01)",
    autosize: true,
  };
  Plotly.newPlot(containerId, data, layout);
}
