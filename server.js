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
	
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
	    if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


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
				
				//var content = JSON.stringify(line);
				line = line.replace(/\uFEFF/g,'');

				var arr = line.split(',');
				playerList[arr[0]] = arr[1];

				playernr +=1;

				if(last){
					resolve();
					//console.log(playerList)
					return false;t
					// or check if i's the last one
				}
			});
  		});

  		ReadLinePromise.then(function(message) {

  			var OrganizePlayersPromise;

  			var CalculateMatchesPromise  = new Promise(function(resolve, reject) {
  				console.log("playerList", playerList)
  				console.log("matches", Object.size(matches));

	  			Object.entries(matches).forEach(
	  				//CALCULATE RANKING HERE
				    function([key, value])  {
				    	console.log(value.player1, value.player2, value.ResultPlayer1, value.ResultPlayer2);
				    	value.player1 = value.player1.replace(" ", "");
				    	value.player2 = value.player2.replace(" ", "");
				    	console.log(value.player1, value.player2);

				    	var prevratingP1;
				    	var prevratingP2;

					    Object.keys(playerList).forEach(function(key) {
					    	if(value.player1 == key) {
					    		console.log(key);
					    		prevratingP1 = playerList[key];

					    	}
					    	if(value.player2 == key) {
					    		console.log(key)
					    		prevratingP2 = playerList[key];;
					    	}

							//var value = obj[key];
						});

					    if(value.ResultPlayer1 > value.ResultPlayer2) {
					    	var hasWonP1 = true;
					    	var hasWonP2 = false;
					    	var wasTie = false;
					    }
					    else if(value.ResultPlayer2 > value.ResultPlayer1) {
					    	var hasWonP1 = false;
					    	var hasWonP2 = true;
					    	var wasTie = false;
					    }
					    else {
					    	console.log("It's a tie: ", value.ResultPlayer1, value.ResultPlayer2);
					    	var hasWonP1 = false;
					    	var hasWonP2 = false;
					    	var wasTie = true;
					    }

				    	//calculate ranking to variables using the algortithm, 
				    	var finalRatingP1 = parseInt(prevratingP1) + (kFactor(parseInt(prevratingP1), 5) * (actualScoreMethod(hasWonP1, wasTie) - expectedScore(parseInt(prevratingP1), parseInt(prevratingP2))));
			    		var finalRatingP2 = parseInt(prevratingP2) + (kFactor(parseInt(prevratingP2), 5) * (actualScoreMethod(hasWonP2, wasTie) - expectedScore(parseInt(prevratingP2), parseInt(prevratingP1))));

				    	 console.log("NEW RATING", finalRatingP1, finalRatingP2)
				    	 console.log("OLD RATING", prevratingP1, prevratingP2)

			    		var hasWonP1 = false;
				    	var hasWonP2 = false;
				    	var wasTie = false;
				    	//use variables to post to file.
				    		//find player1name, replace it's ranking
				    		//find player2name, replace it's ranking

				    }
				);

  			});

			CalculateMatchesPromise.then(function(message) {
				//Send it, present it

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

