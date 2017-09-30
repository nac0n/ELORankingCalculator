$(document).ready(function() {
	console.log("Loaded script, able to calculate ranking...");
	var io = require('socket.io-client')();

	var ioClient = io.connect('http://localhost:3000');

	// ioClient.on('readfile', function(data) {

	// 	console.log(data.Players.Ayanator);
	// 	$('#results').val(JSON.stringify(data));
	// });

	var matches = {};
	var tournamentURL;
	var regex;
	var tournamentHTML = "";
	var id2;


	function dropDownClick(id) {
		id2 = id;
		console.log(id2)
	}

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
			    	//Have to remove square brackets and colon from results
			    	var array = m[3].split(",");
			    	var result1 = array[0];
			    	result1 = result1.replace("[","");
			    	var result2 = array[1];
			    	result2 = result2.replace("]","");
			    	matches["match"+ i] = {"player1": m[1], "player2": m[2], "ResultPlayer1": result1 , "ResultPlayer2": result2 };
			        i += 1;
			    }
			} while (m);


			ioClient.emit('sentMatches', matches );

			//console.log(matches.match1.player1);
		});

		//$('#results').val(expectedScore(1500,1600));

		console.log("Ranking results sent.");
		
	});

global.dropDownClick = dropDownClick;
});
