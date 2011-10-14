exports.controller = function(req, param, res) {
	req.logToConsole("collection.controller", param);
	
	if (!param || !param.collection)
		return res.render("invalid call");
	
	var records = [
		{_id:1, name:"adrien"},
		{_id:2, name:"loick"}
	];
	
	console.log(this.views);
	
	var template = this.views.collection;
	
	var html = template(records);
	
	res.render(html, null, {"content-type": "text/html"});
};