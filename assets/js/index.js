$(window).load(function(){

  var myLatlng = new google.maps.LatLng(-34.6033, -58.3817);

  var mapOptions = {
    center: myLatlng,
    zoom: 8,
    styles: [{"featureType":"water","stylers":[{"color":"#0e171d"}]},
             {"featureType":"landscape","stylers":[{"color":"#1e303d"}]},
             {"featureType":"road","stylers":[{"color":"#1e303d"}]},
             {"featureType":"poi.park","stylers":[{"color":"#1e303d"}]},
             {"featureType":"transit","stylers":[{"color":"#182731"},{"visibility":"simplified"}]},
             {"featureType":"poi","elementType":"labels.icon","stylers":[{"color":"#f0c514"},{"visibility":"off"}]},
             {"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#1e303d"},{"visibility":"off"}]},
             {"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#e77e24"},{"visibility":"off"}]},
             {"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#94a5a6"},{"visibility":"off"}]},
             {"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}, {"color":"#e84c3c"}]},
             {"featureType":"poi","stylers":[{"color":"#e84c3c"},{"visibility":"off"}]}]
  };

  var map = new google.maps.Map(document.getElementById("map_canvas"),
  mapOptions);

  var addMarker = function(lat, lng) {

    var image = {
      url: 'assets/images/green_dot.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      size: new google.maps.Size(2, 2)
    };

    new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      icon: image
    });
  }

  var avg = function(values) {
    var sum = 0;
    for( var i = 0; i < values.length; i++ ){
        sum += parseFloat(values[i]);
    }

    return sum/values.length;
  }

  var midPoint = function(coordinates) {
    var lat = [], lng = [];
    for(var i = 0; i < coordinates.length; i++) {
      lat.push(coordinates[i][1]);
      lng.push(coordinates[i][0]);
    }
    return [avg(lat), avg(lng)];
  }

  var host = location.origin.replace(/^http/, 'ws');
  var socket = io.connect(host);

  socket.on('new_tweet_with_place', function (data) {
    var coordinates = data.tweet.place.bounding_box.coordinates[0];
    var mid = midPoint(coordinates);
    addMarker(mid[0], mid[1]);
  });

  socket.on('new_tweet_with_coordinates', function (data) {
    coordinates = data.tweet.coordinates.coordinates;
    addMarker(coordinates[1], coordinates[0]);
  });
});
