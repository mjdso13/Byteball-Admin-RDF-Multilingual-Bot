'use strict';

// return subject anchor
function getSubjectAnchor(
	anchor // uri address with anchor
) {
	return anchor.substring(anchor.lastIndexOf("#") + 1);
}

// internationalization functions
var RDFParser = {
	// parse RDF local file
	parseLocalRDF ()
	{
		// remote url where are stored RDF files
		var hostUrl = 'https://raw.githubusercontent.com/n-ric-v/RDF-Files/master/';

		// RDF folder related to the project
		var project = 'Byteball-Admin-RDF-Multilingual-Bot/';

		// RDF file
		var file = 'botmessages';

		// build the url to fetch
		var documentUri = hostUrl+project+file;

		// mime type to parse
		var mimeType = 'application/rdf+xml';

		// load fs and path module
		var fs = require('fs');
		var path = require('path');

		// read the RDF file synchronously
		var rdfDocument = fs.readFileSync(
			path.join ( // build path to file
				__dirname, // path of the modules folder
				'..',
				'rdf/botmessages'
			), 
			'utf8'
		);

		// load the RDFLib.JS library
		var rdf = require('rdflib');

		// initialize the data model to store the RDF graph
		var graphDataModel = rdf.graph();

		// parse the RDF file and store it into the data model 
		try {
			rdf.parse (rdfDocument, graphDataModel, documentUri, mimeType);
		} catch (err) {
			 console.log(err)
		}

		// extract the subject sub graph of the data model
		var subgraph = graphDataModel.subjectIndex;
		
		// clear all useless variables to help GC
		fs = path = hostUrl = project = file = rdf = rdfDocument = documentUri = 
		mimeType = ''; graphDataModel = [];

		// return subject of the data model
		return subgraph;
	} , 

	// return IETF language tags
	getIETFLanguageTags(
		graph // data model of the subject data model
	)
	{
		var arr = []; // initialize array
		var i = ''; // initialize key iterator
		var j = ''; // initialize key iterator

		for (i in graph) {
			for (j = 0; j < graph[i].length; j++) { 
				arr.push(graph[i][j].object.lang); // push object language
			}
			break; // stop iteration after one iteration 
		}
		i = j = ''; // clear iterator from memory
		
		return arr; // return IETF language tags as array
	} ,

	// return array of bot messages
	getMessages(
		graph, // data model of the subject data model
		languages // array of IETF language tags
	)
	{
		var arr = [];	// initialize an array
		var i = ''; // initialize a key iterator
		var anchor = ''; // initialize anchor variable

		// initialize linguistic sub arrays of the above array
		for (i in languages) {
			arr[languages[i]] = [];
		}
		
		for(i in graph){
			// extract anchor once
			anchor = getSubjectAnchor(graph[i][0].subject.value);
			for (var j = 0; j < graph[i].length; j++) {
				// store object value of the data model into its sub array
				arr[graph[i][j].object.lang][anchor] = graph[i][j].object.value;
			}
		}
		i = anchor = ''; // clear key iterator and anchor from memory

		return arr; // return messages array
	}
};
// export the functions
module.exports = RDFParser;
