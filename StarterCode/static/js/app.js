// Get the URL and read it into a variable, print it to check
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
console.log(url)

// Get the data from that URL and print it to check that this works
d3.json(url).then(function(data) {
    console.log(data);
  });

// Using the same .then method as above, get the data and then we have to do two things:
// 1. Put the Test Subject ID into a dropdown, and
// 2. Put the otu_id and their corresponding sample_values into bar chart for each SUbject ID
  d3.json(url).then(function(data) {
    // Put the list of IDs in the dropdown
    // From the HTML, I can see that we have id="selDataset" for this box
    let MyMenu = d3.select("#selDataset"); // Select the html element and assign it to a variable for the dropdown menu
    MyMenu.append("option").text('select an ID')
    data.names.forEach((name) => {
        MyMenu.append("option").text(name).property("value", name); // Now the list of names is in the HTML element
    });
});

// Function that will update the chart, it takes the Subject ID and the data as arguments
function updateBarChart(id, data) {
    let sample = data.samples.filter(sample => sample.id === id)[0]; // Filters the data to just the sample we want - matching the ID selected
    console.log(sample) // Checking that this is the right sample each time
    let otu_ids = sample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(); // Gets the top 10 OTUs - reverse to make descending order
    let sample_values = sample.sample_values.slice(0, 10).reverse(); // Gets the values for those top 10 OTUs
    let otu_labels = sample.otu_labels.slice(0, 10).reverse(); // Gets the labels for the top 10 OTUs
    // Create the trace for the chart
    let trace = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels, // Hover over shows the names
        type: "bar",
        orientation: "h"
    };
    // Create teh layout for the chart
    let layout = {
        title: `Top 10 OTUs found in Test Subject ID No. ${id}`
    };
    // Create the chart with plotly
    Plotly.newPlot("bar", [trace], layout);
}


// Function that will update the bubble chart
function updateBubbleChart(id, data) {
    let sample = data.samples.filter(sample => sample.id === id)[0]; // Filters the data to just the sample we want - matching the ID selected
    console.log(sample) // Checking that this is the right sample each time
    let otu_ids = sample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(); // Gets the top 10 OTUs - reverse to make descending order
    let sample_values = sample.sample_values.slice(0, 10).reverse(); // Gets the values for those top 10 OTUs
    let otu_labels = sample.otu_labels.slice(0, 10).reverse(); // Gets the labels for the top 10 OTUs
    // Trace for the bubble chart
    let trace2 = {
        x : otu_ids,
        y : sample_values,
        mode : 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'peach'
        },
        text: otu_labels,
        type: "bubble"
    };
    let layout2 = {
        title: 'Bubble chart'
    };
    Plotly.newPlot("bubble", [trace2], layout2)
};

// Update chart when new dropdown option is selected
d3.selectAll("#selDataset").on("change", function() { // When the dropdown list is changed, i.e. new option selected...
    let newId = d3.select(this).property("value"); // Get the Subject ID from the 'value' off the dropdown list 
    d3.json(url).then(function(data) {
        updateBarChart(newId, data), // Run the update function we wrote
        updateBubbleChart(newId, data)
    });
});
