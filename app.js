var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.set('view engine', 'jade');
app.use("/assets", express.static(__dirname + '/assets'));


var Twit = require('twit');

var T = new Twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: ''
});

var argentina = [ '-72.592999', '-56.127844', '-53.126095', '-22.350824' ]

var stream = T.stream('statuses/filter', { locations: argentina });

app.get('/', function (req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  stream.on('tweet', function (tweet) {
    if(tweet.coordinates){
      socket.emit('new_tweet_with_coordinates', { tweet: tweet });
    } else if(tweet.place){
      socket.emit('new_tweet_with_place', { tweet: tweet });
    }
  });
});
