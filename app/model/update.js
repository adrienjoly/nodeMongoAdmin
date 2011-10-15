exports.model = function($, db, Return) {
  var collection = $.collection;
  var element = $.element;
  var modif = $.modif;
  if (collection && element && modif) {
    try {
      element = JSON.parse(decodeURI(element));
      modif = JSON.parse(decodeURI(modif));
      db[collection].update(element, modif, function() {
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