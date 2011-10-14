function makeHtmlPage(body, params) {
	var html = [
		'<!DOCTYPE html>',
		'<html>',
			'<head>',
				'<meta charset="utf-8" />',
		//		'<link href="/favicon.png" rel="icon" type="image/png" />',
				'<link href="nodeMongoAdmin.css" rel="stylesheet" type="text/css" />',
		//		'<script src="nodeMongoAdmin.css" type="text/javascript" charset="utf-8"></script>',
				'<title>nodeMongoAdmin</title>',
			'</head>',
			'<body>',
				body,
			'</body>',
		'</html>'
	];
	
	return html.join("\n");
}

function detectColumns(records) {
	var colSet = {};
	for (var i in records)
		for (var j in records[i])
			colSet[j] = true;
	
	delete colSet["_id"];
	var columns = [];
	
	for (var i in colSet)
		columns.push(i);
	
	columns.sort();
	columns.unshift("_id");
	
	return columns;
}

exports.view = function(records) {
	
	var columns = detectColumns(records);
	
	var htmlCols = '<tr><th>' + columns.join('</th><th>') + '</th></tr>';
	
	var htmlRecords = [];
	for (var i in records) {
		var row = '';
		for (var j in columns)
			row += '<td>' + records[i][columns[j]] + '</td>';
		htmlRecords.push('<tr>' + row + '</tr>');
	}
	
	var html = [
		'<table>',
			htmlCols,
			htmlRecords.join("\n"),
		'</table>',
	];
	
	return makeHtmlPage(html.join("\n"));
};