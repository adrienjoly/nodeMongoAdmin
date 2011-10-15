exports.model = function($, db, Return) {
  var collection = $.collection;
  var element = $.element;
  if (collection && element) {
    try {
      element = JSON.parse(decodeURI(element));      
      db[collection].insert(element, function() {
        Return({success: true});
      }).errorHandler(function(error) {
        Return({success: false, error: error});
      });
    } catch (error) {
      Return({success: false, error: error});
    }
  } else {
    Return({succes: false, error: 'invalid query string'});
  }
}