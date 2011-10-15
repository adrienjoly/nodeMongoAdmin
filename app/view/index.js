function makeHtmlPage(body, params) {
	var html = [
		'<!DOCTYPE html>',
		'<html>',
			'<head>',
				'<meta charset="utf-8" />',
		//		'<link href="/favicon.png" rel="icon" type="image/png" />',
				'<link href="/nodeMongoAdmin.css" rel="stylesheet" type="text/css" />',
				'<title>nodeMongoAdmin</title>',
			'</head>',
			'<body>',
				body,
				'<script src="/jquery-1.5.1.min.js" type="text/javascript" charset="utf-8"></script>',
				'<script src="/nodeMongoAdmin.js" type="text/javascript" charset="utf-8"></script>',
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

exports.view = function($) {
	
	var collectionName = $.collection;
	var records = $.elements;

	var columns = detectColumns(records);
	
	var linkPrefix = "?collection=" + collectionName;
	
	//var htmlCols = '<tr><th>' + columns.join('</th><th>') + '</th></tr>';
	var htmlCols = [];
	for (var i in columns)
		htmlCols.push('<th><a href="'+linkPrefix+'&orderBy='+columns[i]+'">' + columns[i] + '</a></th>');
	htmlCols = '<tr>' + htmlCols.join("\n") + '</tr>'
	
	var htmlRecords = [];
	for (var i in records) {
		var row = '';
		for (var j in columns)
			row += '<td>' + records[i][columns[j]] + '</td>';
		htmlRecords.push('<tr>' + row + '<td class="actions"></td></tr>');
	}
	
	var page = parseInt($.page);
	var nbPages = parseInt($.nbPages);
	
	linkPrefix += '&orderBy='+columns[i];
	
	var html = [
		'<p>Collection: ' + collectionName + '</p>',
		'<table>',
			htmlCols,
			htmlRecords.join("\n"),
		'</table>',
//		'<button id="createRow">create a new row</button>',
//		'<button id="createDoc">create a new doc</button>',
		'<div id="pagination">',
			'<a href="' + (page > 1 ? linkPrefix+'&page='+(page-1) : "#") +'" id="prev" ' + (page == 1 ? 'class="disabled"' : '') + '>prev</a>',
			'<div id="page">' + page + " / " + nbPages + '</div>',
			'<a href="' + (page < nbPages ? linkPrefix+'&page='+(page+1) : "#") +'" id="next" ' + (page == nbPages ? 'class="disabled"' : '') + '>next</a>',
		'</div>',
		'<div id="editor"><textarea name="value" placeholder="enter a value"></textarea><button>save</button></div>',
		'<div id="msgBox"></div>',
		'<script>',
		'var collectionName="'+collectionName+'";',
		'var orderBy="'+$.orderBy+'";',
		'</script>'
	];
	
	return makeHtmlPage(html.join("\n"));
};