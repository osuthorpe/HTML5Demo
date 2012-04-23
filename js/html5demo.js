//set the DOM element of dropbox as a variable
var dropbox = document.getElementById("dropbox");

//create new global variable
var csv;

//Create new global array for parsed csv data
var lines = [];

//Listen for the drag & drop event
dropbox.addEventListener("drop", drop, false);

//When File is dropped on zone do the following
function drop(event) {
	
	//stop moving through DOM
	event.stopPropagation();
	
	//Prevent the defualt action
	event.preventDefault();
	
	//Registers the files as an array
	var files = event.dataTransfer.files;
	
	//Record number of files being uploaded
	var number = files.length;
	
	//Only trigger parseFiles function if at least one file uploaded
	if (number > 0) {
		parseFiles(files);
	}
}

//Process the uploaded file
function parseFiles(files) {
	
	//Register the first file uploaded
	var file = files[0];
    
    //set the DOM element of file-data to a variable
  	var fileData = document.getElementById("file-data");
  	
  	//Add file information to the HTML page
    var output = "<p>file: <span class='meta'>" + file.name + "</span></p>";
    	output += "<p>last update: <span class='meta'>" + file.lastModifiedDate + "</span></p>";
		output += "<p>type: <span class='meta'>" + file.type + "</span></p>";
		output += "<p>size: <span class='meta'>" + file.size + "</span> bytes</p>";
	
	fileData.innerHTML = output;
    
	//Open FileReader to read content
	var reader = new FileReader();
	
	// begin the read operation
	reader.readAsText(file, "UTF-8");
	
	// init the reader event handlers
	reader.onload = handleReaderLoad;
	
}

/**
Once the file is loaded read it
**/
function handleReaderLoad(event, file) {
  	
  	//Set csv variable equal to file contents
  	csv = event.target.result;
  	
  	//Run CSV parsing function
  	processData();
}

/**
Split the content of the csv file first by line then by commas. Save each row as a new object in the array then render the chart
**/
function processData() {
	
	//Seperate file by line breaks
    var allTextLines = csv.split(/\r\n|\n/);
    
    //Set Key equal to the first row
    var headers = allTextLines[0].split(',');

	//loop through each line
	for (var i=1; i<allTextLines.length; i++) {
	
		//Seperate line by comma
	    var data = allTextLines[i].split(',');
	    
	    //Create associated array for each line
	    if (data.length == headers.length) {
	
			//Declare temp array
	        var array = {};
	        
	        //Loop through values
	        for (var j=0; j<headers.length; j++) {
	        	
	        	//Set header to Key
	        	var key = headers[j];
	        	
	        	//Set data to value
	        	var value = data[j];
	        	
	        	//Add Key Value pair to temp array
	        	array[key] = value;
	        }
	        
	        //Add temp line array to array of all data
	        lines.push(array);
	    }
	}
	
	//Convert data to graphical form
	renderChart();
}

/**
Create a new chart and display on screen. Options and usage are defined on the Highcharts.js website
**/
function renderChart() {
	
	var options = {
	    chart: {
	        renderTo: 'container',
	        defaultSeriesType: 'line'
	    },
	    title: {
	        text: 'Grades'
	    },
	    xAxis: {
	        categories: []
	    },
	    yAxis: {
	        title: {
	            text: 'GPA'
	        }
	    },
	    series: [{
			name: 'Fall 2011',
			data: []
		}, {
			name: 'Winter 2012',
			data: []
		}],
	    exporting: {
            enabled: true
        }
	};
	
	
	//Add object values from csv to the chart
	for(i = 0; i < lines.length; i++) {
		var obj = lines[i];
		
		for(var index in obj) {
			if (index === 'Name') {
				options.xAxis.categories.push(obj[index]);
			}
			
			if (index === 'Fall 2011') {
				options.series[0].data.push(parseFloat(obj[index]));
			}
			
			if (index === 'Winter 2012') {
				options.series[1].data.push(parseFloat(obj[index]));
			}
		}
	}
	
	//Create the chart
	var chart = new Highcharts.Chart(options);
}