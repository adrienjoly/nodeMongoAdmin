exports.model = function($, db, Return) {
  var collection = $.collection;
  var page = page || 1;
  var limit = $.pageLength || 20;
  var skip = (page - 1) * limit;
  var sort = {};
  sort[$.orderBy || '_id'] = $.decreasing ? -1 : 1;
  db[collection].count(function(count) {
    db[collection].find(null, null, {limit: limit, skip: skip, sort: sort}, 
      function(elts) {
        Return({
          collection: collection, 
          elements: elts, 
          nbPages: Math.ceil(count/limit)
        });
      }
    );  
  });  
}