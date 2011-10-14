function makeHtmlPage(body) {
	var html = [
		'<!DOCTYPE html>',
		'<html>',
		'<head>',
		'<meta charset="utf-8" />',
//		'<link href="'+render.urlPrefix+'/favicon.png" rel="icon" type="image/png" />'
	];
	
	html.push('<title>nodeMongoAdmin</title>');
	/*
	for (var i in params.css)
		out.push('<link href="'+render.urlPrefix+'/'+params.mobilecss[i]+includeSuffix+'" rel="stylesheet" type="text/css" />');
	
	for (var i in params.js)
		out.push('<script src="'+render.urlPrefix+'/js/'+params.mobilejs[i]+includeSuffix+'" type="text/javascript" charset="utf-8"></script>');
	*/
	html.push(
		'</head>',
		'<body>',
		body,
		'</body>',
		'</html>'
	);
	
	return html.join("\n");
}


exports.view = function(records) {
	var html = [
		'<p>coucou</p>',
	];
	
	return makeHtmlPage(html.join("\n"));
};