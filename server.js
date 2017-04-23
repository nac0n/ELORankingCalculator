var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var lineReader = require('line-reader');

server.listen(3000, function(){
  console.log('listening on localhost:3000');
});

app.set('views', __dirname + '/views');
app.use(express.static('static'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('index.html');
});
	
var playernr = 1;
var playerList = {};
//var matches = {};
var id2;


io.on('connection', function(socket){
	console.log('a user connected');

    socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});

  	socket.on('regexSwitch', function(data) {
  		console.log(data);
  		id2 = data;
  	});

  	socket.on('sentMatches', function(matches) {

  		var ReadLinePromise = new Promise(function(resolve, reject) {
  			lineReader.eachLine(__dirname + '/static/ratings/CurrentRanking.txt','utf8', function (line, last) {
				
				var content = JSON.stringify(line);

				var arr = line.split(',');
				playerList[arr[0]] = arr[1];

				playernr +=1;

				if(last){
					resolve();
					return false;t
					// or check if i's the last one
				}
			});
  		});

  		ReadLinePromise.then(function(message) {

  			var CalculateMatchesPromise  = new Promise(function(resolve, reject) {

	  			Object.entries(matches).forEach(


	  				//CALCULATE RANKING HERE
				    function([key, value])  {
				    	console.log(value.player1);//, value)
				    }
				);
  			});

			CalculateMatchesPromise.then(function(message) {

			}, function (errorMessage) {
			    console.log('Error, ', errorMessage);
			});
		}, function (errorMessage) {
		    console.log('Error, ', errorMessage);
		});
	});
});


var tournamentURL;
var regex;
var tournamentHTML = "";

function GetMatches () {

	
};

function transformedRating(ratingPrev) {
	var transformedRating;
	transformedRating = Math.pow(10,((ratingPrev)/400))
	return transformedRating;
};

function expectedScore(ratingPrev, otherPlayerPrevRating) {
	var expectedScore = transformedRating(ratingPrev) / (transformedRating(ratingPrev)
        + transformedRating(otherPlayerPrevRating));
	return expectedScore;
};

function actualScoreMethod(hasWon, wasTie)
{
    var x;
    if (hasWon == true)
    {
        x = 1.0;
    }
    else
    {
        x = 0.0;
    }
    if (wasTie == true)
    {
        x = 0.5;
    }

    return x;
}

function kFactor(doublePrevRank, playergamesINT)
{
    var k ;

    if (doublePrevRank > 2400 && playergamesINT >=15)
    {
        k = 5;
    }
    else if (doublePrevRank < 2400 && doublePrevRank >= 2100  && playergamesINT >=15)
    {
        k = 10;
    }
    else if (doublePrevRank < 2100 && doublePrevRank >= 1700  && playergamesINT >=15)
    {
        k = 15;
    }
    else if (doublePrevRank < 1700 && doublePrevRank >= 1600  && playergamesINT >=15)
    {
        k = 20;
    }
    else if (playergamesINT >= 15)
    {
        k = 25;
    }
    else {
        k = 35;
    }

    return k;
}

