exports.controller = function(req, param, res) {
	req.logToConsole("collection.controller", param);
	
	if (!param || !param.collection)
		return res.render("invalid call");
	
	var template = this.views.collection;
	
	var records = [
		{_id:1, name:"adrien"},
		{_id:2, name:"jie"},
		{_id:3, name:"loick"}
	];
	
	var html = template(param.collection, records);
	
	res.render(html, null, {"content-type": "text/html"});
};