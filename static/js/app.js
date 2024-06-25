//url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"; 

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result_array = metadata.filter(sampleobject => sampleobject.id == id);
    let result = result_array[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel_id = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel_id.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel_id.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result_array= samples.filter(sampleobject => sampleobject.id == sample);
    let result= result_array[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    var bubble_chart = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    var bubble_layout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubble_chart, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var bar_chart = [{
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    var bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", bar_chart, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    var names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    d3.json("samples.json").then((data) => {
       names.forEach((sample) => {
        dropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      });

    // Get the first sample from the list
    var first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);
    });
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
