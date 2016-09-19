var worker = new Worker("/s/worker.js");
var countId = 0;
var promiseObj = {};

export function getMatches(id='') {
	var workerId = startWorker();
	var promise = new Promise(function(resolve, reject) {
		promiseObj[workerId] = resolve;
		worker.postMessage({method:'getMatches', workerId:workerId});

	});
	return promise;
}

export function getTeams(id='') {
	var workerId = startWorker();
	var promise = new Promise(function(resolve, reject) {
		promiseObj[workerId] = resolve;
		worker.postMessage({method:'getTeams', workerId:workerId});

	});
	return promise;
}


export function getTeam(id='') {
	var workerId = startWorker();
	var promise = new Promise(function(resolve, reject) {
		promiseObj[workerId] = resolve;
		worker.postMessage({method:'getTeam',id:id, workerId:workerId});

	});
	return promise;
}

export function getMatch(id='') {
	var workerId = startWorker();
	var promise = new Promise(function(resolve, reject) {
		promiseObj[workerId] = resolve;
		worker.postMessage({method:'getMatch',id:id, workerId:workerId});

	});
	return promise;
}

export function getMatch(id='') {
	var workerId = startWorker();
	var promise = new Promise(function(resolve, reject) {
		promiseObj[workerId] = resolve;
		worker.postMessage({method:'getMatch',id:id, workerId:workerId});

	});
	return promise;
}

export function subscribe(id='') {
	var workerId = startWorker();
	var promise = new Promise(function(resolve, reject) {
		promiseObj[workerId] = resolve;
		worker.postMessage({method:'subscribe',id:id, workerId:workerId});

	});
	return promise;
}

export function unsubscribe(id='') {
	var workerId = startWorker();
	var promise = new Promise(function(resolve, reject) {
		promiseObj[workerId] = resolve;
		worker.postMessage({method:'unsubscribe',id:id, workerId:workerId});

	});
	return promise;
}

worker.addEventListener('message', function(event) {
	promiseObj[event.data.workerId ](event.data.json);
});
function startWorker() {
	 countId = countId + 1;
	 return countId;
}
