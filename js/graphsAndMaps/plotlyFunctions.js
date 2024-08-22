export function plotGraph(meanValuesList, yaxis_range) {
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

    var layout = {
        title: {
            text: "Temperature Over Time",
            font: {
                size: 20,
            },
            xref: "paper",
            x: 0.5,
        },
        xaxis: {
            title: {
                text: "Time (Hour)",
                font: {
                    size: 18,
                },
            },
            range: [-1, 25],
            dtick: 2,
            showgrid: true,
            gridcolor: "rgba(200, 200, 200, 0.5)",
            zeroline: false,
            showline: true,
            linewidth: 2,
            linecolor: "black",
            mirror: true,
            // showspikes: true,
            tickfont: {
                size: 16,
            },
        },
        yaxis: {
            title: {
                text: "Temperature (°C)",
                font: {
                    size: 18,
                },
            },
            range: yaxis_range,
            dtick: 2,
            showgrid: true,
            gridcolor: "rgba(200, 200, 200, 0.5)",
            zeroline: false,
            showline: true,
            linewidth: 2,
            linecolor: "black",
            mirror: true,
            // showspikes: true,
            tickfont: {
                size: 16,
            },
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
    };

    Plotly.newPlot('plotlyLineGraph', [trace1], layout);
    
    var fullX = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    var fullY = meanValuesList;

    // Plotly.extendTraces('plotlyLineGraph', {
    //     x: [fullX],
    //     y: [fullY]
    // }, [0]);

    var i = 0;
    function addPoint() {
        if (i < fullX.length) {
            Plotly.extendTraces('plotlyLineGraph', {
                x: [[fullX[i]]],
                y: [[fullY[i]]]
            }, [0]);
            i++;
            setTimeout(addPoint, 15);
        }
    }
    setTimeout(addPoint, 100);    
}
