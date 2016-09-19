import fetch from 'isomorphic-fetch'


function getMatches() {
	return fetch('/api/matches');
}

function getTeams() {
	return fetch('/api/teams');
}


function getTeam(id='') {
	return fetch('/api/teams/'+id);
}

function getMatch(id='') {
	return fetch('/api/matches/'+id);
}

function subscribe(sid='') {
	new Promise((resolve, reject) => {
		var client = new XMLHttpRequest();
	 	client.open("PUT", "/api/subscribe/", false);
	 	client.setRequestHeader("Content-Type", "application/json");
	 	client.send(JSON.stringify({sid:sid}));
		client.onload = function() {
		  if (client.status >= 200 && client.status < 400) {
			 resolve({
				  data:client.responseText,
				  json: function() {
				  	return JSON.parse(client.responseText);
				  }

			  })
		  } else {
		    reject();

		  }
	  };

	});
}

function unsubscribe(sid='') {
	new Promise((resolve, reject) => {
		var client = new XMLHttpRequest();
	 	client.open("DELETE", "/api/subscribe/", false);
	 	client.setRequestHeader("Content-Type", "application/json");
	 	client.send(JSON.stringify({sid:sid}));
		client.onload = function() {
		  if (client.status >= 200 && client.status < 400) {
			 resolve({
				  data:client.responseText,
				  json: function() {
				  	return JSON.parse(client.responseText);
				  }

			  })
		  } else {
		    reject();

		  }
	  };

	});
}


onmessage = function(event) {
	var promise;
	var options = event.data;
	switch (options.method) {
		case 'getMatches':
			promise = getMatches()
			break;
		case 'getTeams':
			promise = getMatches()
			break;
		case 'getMatch':
				promise = getMatch(options.id)
			break;
		case 'getTeam':
				promise = getTeam(options.id)
			break;
		case 'subscribe':
			promise = subscribe(options.id)
			break;
		case 'unsubscribe':
			promise = unsubscribe(options.id)
			break;
		default:
			promise = false;
	}
	if(promise) {
		promise.then(response => response.json())
		.then(data =>{
			postMessage({json:data, workerId:options.workerId});
		});

	}

}
