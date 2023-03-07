const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Demographic Info
function panelInfo(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let metadata = sampleData.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
        let gaugeTrace = {
            domain: { x: [0, 5], y: [0, 1] },
            // value: identifier.wfreq,
            type: "indicator",
            ids: ['0-1', '1-2', '2-3', '3-4', '5-6', '6-7', '7-8', '8-9'],
            gauge: {
                axis: {
                    range: [0, 9],
                    tickmode: 'linear'
                },
                steps: [
                    { range: [0, 1], color: 'rgb(248,243,236)', id: '0-1' },
                    { range: [1, 2], color: 'rgb(244,241,228)', name: '1-2' },
                    { range: [2, 3], color: 'rgb(233,230,201)', name: '2-3' },
                    { range: [3, 4], color: 'rgb(229,232,176)', name: '3-4' },
                    { range: [4, 5], color: 'rgb(213,229,153)', name: '4-5' },
                    { range: [5, 6], color: 'rgb(183,205,143)', name: '5-6' },
                    { range: [6, 7], color: 'rgb(138,192,134)', name: '6-7' },
                    { range: [7, 8], color: 'rgb(137,188,141)', name: '7-8' },
                    { range: [8, 9], color: 'rgb(132,181,137)', name: '8-9' },
                ]
            },
            mode: "gauge"
        };
        let deg = (180 / 9) * identifier.wfreq;
        let radius = 0.5;
        let radians = (deg * Math.PI) / 180;
        let x = -1 * radius * Math.cos(radians);
        let y = radius * Math.sin(radians);
        let guageLayout = {
            title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
            shapes: [{
                type: 'line',
                x0: 0.5,
                y0: 0,
                x1: x + 0.5,
                y1: y + 0.5,
                line: {
                    color: 'red',
                    width: 4
                }
            }],
            xaxis: { visible: true, range: [-1, 1] },
            yaxis: { visible: true, range: [-1, 1] },
            width: 800,
            height: 500

        };

        let gaugeData = [gaugeTrace];
        Plotly.newPlot('gauge', gaugeData, guageLayout);
    })
}

//Plots
function Plots(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let samples = sampleData.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];
        let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
        let OTUids = filtered.otu_ids.slice(0, 10).reverse();
        let labels = filtered.otu_labels.slice(0, 10).reverse();
        let barTrace = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU ' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: `Top 10 OTUs for Subject ${id}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };
        let barData = [barTrace];

        Plotly.newPlot('bar', barData, barLayout);

        let bubbleTrace = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                colorscale: 'Portland'
            },
            text: filtered.otu_labels,
        };
        let bubbleData = [bubbleTrace];
        let bubbleLayout = {
            title: `OTUs for Subject ${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
}

//Build new upon ID change
function optionChanged(id) {
    Plots(id);
    panelInfo(id);
}

//Test Subject Dropdown and initial function
function init() {
    let dropDown = d3.select('#selDataset');
    let id = dropDown.property('value');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        let samples = sampleData.samples;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelInfo(names[0]);
        Plots(names[0])
    })
};

init();