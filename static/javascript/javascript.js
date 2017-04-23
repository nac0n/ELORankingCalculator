$(document).ready(function() {
	console.log("Loaded script, able to calculate ranking...");
	var io = require('socket.io-client')();

	var ioClient = io.connect('http://localhost:3000');

	ioClient.on('readfile', function(data) {
		// finalRatingP1 = prevratingP1 + kfactorP1 * (actualScoreP1 - expectedScoreP1)
  //   	finalRatingP2 = prevratingP2 + kfactorP2 * (actualScoreP2 - expectedScoreP2)

		console.log(data.Players.Ayanator);
		$('#results').val(JSON.stringify(data));
	});

	var matches = {};
	var tournamentURL;
	var regex;
	var tournamentHTML = "";
	var id2;


	function dropDownClick(id) {
		id2 = id;
		console.log(id2)
	}

	//ReadFile();
	//ULTIMATE FUNCTION OF DOOM
	$('#calculatebuttonid').click(function() {
		console.log("calculating ranking...");

		matches = {};
		
		var newID = id2;
		tournamentURL = $('#input').val();

		$.ajaxPrefilter( function (options) {
			if (options.crossDomain && jQuery.support.cors) {
				var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
				options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
				//options.url = "http://cors.corsproxy.io/url=" + options.url;
			}
		});

		$.get(tournamentURL, function (response) {
			if(newID == "1") {
				regex = /name":"([\w\s\d]*?)","portrait_url":null,"participant_id":\d*?},"player2":{"id":\d*?,"seed":\d*?,"display_name":"([\w\s\d]*?)","portrait_url":null,"participant_id":\d*?},"player1_prereq_identifier":null,"player2_prereq_identifier":null,"player1_is_prereq_match_loser":false,"player2_is_prereq_match_loser":false,"player1_placeholder_text":null,"player2_placeholder_text":null,"winner_id":\d*?,"loser_id":\d*?,"scores":(.*?),"/g;
			}
			else if(newID == "2") {
				regex = /name":"([\w\s\d]*?)","portrait_url":null,"participant_id":null},"player2":{"id":\d*?,"seed":\d*?,"display_name":"([\w\s\d]*?)","portrait_url":null,"participant_id":null},"player1_prereq_identifier":.*?,"player2_prereq_identifier":.*?,"player1_is_prereq_match_loser":.*?,"player2_is_prereq_match_loser":.*?,"player1_placeholder_text":null,"player2_placeholder_text":null,"winner_id":\d*?,"loser_id":\d*?,"scores":(.*?),"/g;
			}
			else {
				console.log("invalid id for regex");
			}


			//console.log(test[1]);
			var i = 1;

			do {
				
			    m = regex.exec(response);
			    if (m) {
			    	matches["match"+ i] = {"player1": m[1], "player2": m[2], "result": m[3] };
			        i += 1;
			    }
			} while (m);


			ioClient.emit('sentMatches', matches );

			console.log(matches.match1.player1);
		});

		//$('#results').val(expectedScore(1500,1600));

		console.log("Ranking results ready, see textarea and files.");
		
	});


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

    // finalRatingP1 = prevratingP1 + kfactorP1 * (actualScoreP1 - expectedScoreP1)
    // finalRatingP2 = prevratingP2 + kfactorP2 * (actualScoreP2 - expectedScoreP2)

     // var finalsRankingA =  rdpk.rankingList.get(index1) + (rankcalc.kFactor( rdpk.rankingList.get(index1), intTourn1) * ((rankcalc.actualScoreMethod(aHasWon, tie)- rankcalc.expectedScore(rdpk.rankingList.get(index1), rdpk.rankingList.get(index2)))));
     // var finalsRankingB =  rdpk.rankingList.get(index2) + (rankcalc.kFactor( rdpk.rankingList.get(index2), intTourn2) * ((rankcalc.actualScoreMethod(bHasWon, tie)- rankcalc.expectedScore(rdpk.rankingList.get(index2),rdpk.rankingList.get(index1)))));


global.dropDownClick = dropDownClick;
});
