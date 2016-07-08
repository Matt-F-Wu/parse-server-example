
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("sendRequestToUser", function(request, response) {
  var message = request.note;
  var TYPE = request.TYPE;
  var purpose = request.purpose;
  var latitude = request.latitude;
  var longitude = request.longitude;
  var note = request.note;
  var rad = request.rad;
  var category = request.category;
  var reward = request.reward;
  var address = request.address;
  var username = request.username;
  var rating = request.rating;
  var userpic = "";
  if(request.hasOwnProperty('userpic')){
    userpic = request.userpic;
  }
  // Send the push.
  // Find devices associated with the recipient user
  var centerPoint = new Parse.GeoPoint(latitude, longitude);
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.withinKilometers("location", centerPoint, rad);
 
  // Send the push notification to results of the query
  Parse.Push.send({
    where: pushQuery,
    data: {
      alert : "Favourama"
      TYPE : TYPE
      purpose : purpose
      latitude : latitude
      longitude : longitude
      note : note
      rad : rad
      category : category
      reward : reward
      address : address
      username : username
      rating : rating
      userpic : userpic
    }
  }).then(function() {
      response.success("Push was sent successfully.")
  }, function(error) {
      response.error("Push failed to send with error: " + error.message);
  });
});
