
// use d3 to load sample data
var samples = {};
d3.json("/static/data/samples.json").then(function(data) {
//    console.log(data);
    samples = data;
    data.names.forEach(function(name){
        d3.select("#selDataset").append("option").attr("value", name).text(name);
    });
});

// d3.select("#selDataset").on("change", loadData)
function optionChanged(event) {
    createAll(event);
    loadMeta(event);
}

// to create every thing
function createAll(id) {

    // get the data for id selected
    var sample = samples.samples.filter(x => x.id === id);

    // console.log(sample[0].otu_ids.length);

    // combine sample arrays to one object array
    var otus = [];
    for(var i=0; i<sample[0].otu_ids.length; i++) {
        otus.push({
            otu_id: sample[0].otu_ids[i],
            label: sample[0].otu_labels[i],
            otu_value: sample[0].sample_values[i]
        });
    }

    // to create the bar chart
    // sort the array and get top 10
    var bar_data = otus.map(x=>x);
    bar_data.sort((a,b)=>b.otu_value - a.otu_value);
    bar_data = bar_data.slice(0,10);
    bar_data = bar_data.reverse();
    createBar(bar_data);

    // to create bubble chart
    createBubble(otus);

}

// load meta data when id selected and display
function loadMeta(id) {
    var metadata = samples.metadata.filter(d=>d.id === parseInt(id))
    if (metadata.length > 0) {
        var html = "";
        var freq = 0;
        metadata.forEach(d => {
            Object.entries(d).forEach(([key, value]) => html += `<p>${key}:${value}</p>`);
            freq = d.wfreq;
        });
        d3.select("#sample-metadata").html(html);

        // create gauge chart
        createGauge(freq);

        // use pie chart as gauge
        createPie(freq);
    }


}

// create bar chart function
function createBar(data) {
    var trace = {
        x: data.map(x=>x.otu_value),
        y: data.map(x=>`OTU ${x.otu_id}`),
        type: "bar",
        orientation: "h",
        text: data.map(x=>x.label),
        labels: data.map(x=>x.label),
        hoverinfo: "labels"
    }

    Plotly.newPlot("bar", [trace], {title: "<b>Top 10 otus</b>"});
}


// create bubble chart function
function createBubble(data) {
    var trace = {
        x: data.map(x=>x.otu_id),
        y: data.map(x=>x.otu_value),
        mode: "markers",
        marker: {
            size: data.map(x=>x.otu_value),
            color: data.map(x=> `${x.otu_id}`),
            colorscale: 'Jet'
        }
    }
    Plotly.newPlot("bubble", [trace], {title: "<b>OTU Bubble Chart</b>"});
}

// create gauge chart function
function createGauge(freq) {
    var trace = {
        domain: {x:[0, 1], y:[0, 1]},
        value: freq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis : {range: [null, 9]},
            bar: { color: "black" },
            steps : [
                {range: [0, 1], color: "red"},
                {range: [1, 2], color: "orange"},
                {range: [2, 3], color: "yellow"},
                {range: [3, 4], color: "green"},
                {range: [4, 5], color: "cyan"},
                {range: [5, 6], color: "blue"},
                {range: [6, 7], color: "purple"},
                {range: [7, 8], color: "pink"},
                {range: [8, 9], color: "brown"},
            ],
            labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"]
        }
    }
    Plotly.newPlot("gauge", [trace], {title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"});
}

// use a pie chart as gauge
function createPie(freq) {

    // draw a holed pie chart
    var tracePie = {
        type: "pie",
        showlegend: false,
        hole: 0.6,
        rotation: 90,
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
            colors: ["red",
            "orange",
            "yellow",
            "green",
            "cyan",
            "blue",
            "purple",
            "pink",
            "brown",
            // set the lower half part same color as blackground color to make it invisible
            "white"]
        },
        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        hoverinfo: "label"
    };

    // calc the pointer point
    var radius = 0.5;
    var x0 = 0;
    var y0 = 0;
    var degree = 180 - 20 * freq;
    var radian = Math.PI * degree / 180;
    var x1 = radius * Math.cos(radian);
    var y1 = radius * Math.sin(radian);

    // add the point line on the chart
    var traceLine = {
         type: "scatter",
         mode: "line",
         showlegend: false,
         x: [x0, x1],
         y: [y0, y1],
         marker: {
             color: "black",
             size: 1
         }
    }
    var layout = {
        title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
    };
    Plotly.newPlot("pie", [tracePie, traceLine], layout);
}