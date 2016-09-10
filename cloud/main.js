
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
  var time = request.params.time;
  
  console.log("The variables are: " + latitude + " message: " + note);
  
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
      userpic : userpic,
      time : time
    }
  }, { useMasterKey: true }).then(function() {
      response.success("Push was sent successfully.")
  }, function(error) {
      response.error("Push failed to send with error: " + error.message);
  });
});

Parse.Cloud.define("sendMessageToUser", function(request, response) {
  var TYPE = request.params.TYPE;
  var ctype = request.params.ctype;
  var content = request.params.content;
  var time = request.params.time;
  var username = request.params.username;
  var destination = request.params.destination;
  var rating = request.params.rating;
  console.log("Message type is: " + ctype);
  
  // Send the push.
  // Find devices associated with the recipient user
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("username", destination);
  
  
  // Send the push notification to results of the query
  Parse.Push.send({
    where: pushQuery,
    data: {
      alert : "Favourama",
      TYPE : TYPE,
      ctype : ctype,
      username : username,
      destination : destination,
      content : content,
      rating : rating,
      time : time
    }
  }, { useMasterKey: true }).then(function() {
      response.success("Push was sent successfully.")
  }, function(error) {
      response.error("Push failed to send with error: " + error.message);
  });
});

Parse.Cloud.define("RateUser", function(request, response) {
  var TYPE = request.params.TYPE;
  var ratingReceived = request.params.Rating;
  var username = request.params.username;
  
  //Update the rating entirely on server side
  var pushQuery = new Parse.Query(Parse.User);
  pushQuery.equalTo("username", username);
  
  pushQuery.first({ useMasterKey: true }).then(function(user) {
    var numRatings = user.get("NumRating");
    var ratingCurrent = user.get("Rating");
    console.log("Current Rating is: " + ratingCurrent);
    var ratingNew = ((ratingCurrent * numRatings) + ratingReceived)/(numRatings + 1);
    user.set("Rating", ratingNew);
    user.set("NumRating", numRatings + 1);
    return user.save(null, { useMasterKey: true });
    }).then((userAgain) => {
      console.log('New Rating is: ' + userAgain.get("Rating"));
      var pushQuery = new Parse.Query(Parse.Installation);
      pushQuery.equalTo("username", username);
      
      
      // Send the push notification to results of the query
      Parse.Push.send({
        where: pushQuery,
        data: {
          alert : "Favourama",
          TYPE : "RATING"
        }
      }, { useMasterKey: true }).then(function() {
          response.success("Rating User Successful.")
      }, function(error) {
          response.error("Rating user failed: " + error.message);
      });
    }, (error) => {
      console.log(error);
      response.error(error);
    });
});

Parse.Cloud.define("sendCommandToApp", function(request, response) {
  var TYPE = request.params.TYPE;
  var ctype = request.params.ctype;
  var content = request.params.content;
  var username = request.params.username;
  console.log("Command type is: " + TYPE);
  
  // Send the push notification to all installations
  Parse.Push.send({
    where: new Parse.Query(Parse.Installation),
    data: {
      alert : "Favourama",
      TYPE : TYPE,
      ctype : ctype,
      username : username,
      content : content
    }
  }, { useMasterKey: true }).then(function() {
      response.success("Push was sent successfully.")
  }, function(error) {
      response.error("Push failed to send with error: " + error.message);
  });
});
