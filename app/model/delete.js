exports.model = function($, db, Return) {
  var collection = $.collection;
  var element = $.element;
  if (collection && element) {
    try {     
      db[collection].remove({_id: element}, function() {
        Return({succes: true});
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