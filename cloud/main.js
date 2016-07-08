
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("sendRequestToUser", function(request, response) {
  var TYPE = request.params.TYPE;
  var purpose = request.params.purpose;
  var latitude = request.params.latitude;
  var longitude = request.params.longitude;
  var note = request.params.note;
  var rad = request.params.rad;
  var category = request.params.category;
  var reward = request.params.reward;
  var address = request.params.address;
  var username = request.params.username;
  var rating = request.params.rating;
  var userpic = "";
  if(request.params.hasOwnProperty('userpic')){
    userpic = request.params.userpic;
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
      alert : "Favourama",
      TYPE : TYPE,
      purpose : purpose,
      latitude : latitude,
      longitude : longitude,
      note : note,
      rad : rad,
      category : category,
      reward : reward,
      address : address,
      username : username,
      rating : rating,
      userpic : userpic
    }
  }).then(function() {
      response.success("Push was sent successfully.")
  }, function(error) {
      response.error("Push failed to send with error: " + error.message);
  });
});
