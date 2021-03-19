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
    var sample = samples.samples.filter(x => x.id === event);
    // console.log(sample[0].otu_ids.length);

    // combine arrays to object array
    var otus = [];
    for(var i=0; i<sample[0].otu_ids.length; i++) {
        otus.push({
            otu_id: sample[0].otu_ids[i],
            label: sample[0].otu_labels[i],
            otu_value: sample[0].sample_values[i]
        });
    }

    // sort the array and get top 10
    otus.sort((a,b)=>b.otu_value - a.otu_value);
    otus = otus.slice(0,10);
    otus = otus.reverse();

    var trace = {
        x: otus.map(x=>x.otu_value),
        y: otus.map(x=>`OTU ${x.otu_id}`),
        type: "bar",
        orientation: "h",
        text: otus.map(x=>x.label)
    }

    Plotly.newPlot("bar", [trace], { title: "Top 10 otus"});

    console.log(otus);
}
// function loadData(event) {
//     var 
// }



