module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.client = undefined;
	exports.subscribe = subscribe;
	exports.getSubscriptions = getSubscriptions;
	exports.unsubscribe = unsubscribe;
	exports.updateTopScorers = updateTopScorers;
	exports.getTopScorers = getTopScorers;
	exports.updateGroupTable = updateGroupTable;
	exports.getGroupTable = getGroupTable;
	exports.getAllGroupTable = getAllGroupTable;
	exports.getTeams = getTeams;
	exports.updateTeamDetail = updateTeamDetail;
	exports.getTeam = getTeam;
	exports.updateMatchesTable = updateMatchesTable;
	exports.updateMatcheDetail = updateMatcheDetail;
	exports.getMatches = getMatches;
	exports.getMatch = getMatch;

	var _crowdscores = __webpack_require__(1);

	var _crowdscores2 = _interopRequireDefault(_crowdscores);

	var _redis = __webpack_require__(4);

	var _redis2 = _interopRequireDefault(_redis);

	var _bluebird = __webpack_require__(5);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
	_bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);

	var client = exports.client = _redis2.default.createClient({ port: 6379, host: 'redis' });
	var multi = client.multi();
	/*
	*	competition ID 267 for Euro
	*
	*/

	var TEAMS = ["albania", "france", "romania", "switzerland", "england", "russia", "slovakia", "wales", "germany", "northernIreland", "poland", "ukraine", "croatia", "czechRepublic", "spain", "turkey", "belgium", "italy", "republicOfIreland", "sweden", "austria", "hungary", "iceland", "portugal"];
	var competition_id = 267;
	var c = new _crowdscores2.default('3063739e8f544121ba1bbb7008aa044c');

	function camelize(str) {
	    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
	        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
	        return index == 0 ? match.toLowerCase() : match.toUpperCase();
	    });
	}

	function isKeyEmpty(key) {
	    return new Promise(function (resolve, reject) {
	        client.keysAsync(key).then(function (replies) {
	            if (replies.length < 1) {
	                resolve(true);
	            } else {
	                reject('Key is not empty');
	            }
	        });
	    });
	}

	function subscribe(sid) {
	    return client.lpushAsync('subscribe', sid).then(function (i) {
	        return {
	            index: i,
	            sid: sid
	        };
	    });
	}

	function getSubscriptions(sid) {
	    return client.lrangeAsync("subscribe", 0, -1).then(function (data) {
	        return data;
	    });
	}

	function unsubscribe(sid) {
	    return client.lremAsync('subscribe', '-1', sid).then(function (i) {
	        return {
	            delete: i > 0,
	            sid: sid
	        };
	    });
	}

	function updateTopScorers() {
	    return c.playerstats({ competition_id: competition_id }).then(function (data) {
	        for (var i = 0; i < data.length; i++) {
	            var stats = data[i].playerstats[0];
	            client.zadd('players:topScorers', i, data[i].dbid);
	            client.hmset('player:' + data[i].dbid, ['assists', stats.assists, 'goals', stats.goals, 'redCards', stats.redCards, 'yellowCards', stats.yellowCards]);
	        }
	    });
	}

	function getTopScorers() {
	    var multi = client.multi();
	    return client.zrangeAsync("players:topScorers", 0, -1).then(function (dbids) {
	        for (var i = 0; i < dbids.length; i++) {
	            multi.hgetall('player:' + dbids[i]);
	        }
	        return multi.execAsync();
	    });
	}

	function updateGroupTable() {
	    var multi = client.multi();
	    return c.leagueTables({ competition_id: competition_id }).then(function (data) {
	        for (var i = 0; i < data.length; i++) {
	            var group = data[i].round.name.replace("Group ", "").toLowerCase();
	            multi.rpush('groups', group);
	            for (var j = 0; j < data[i].leagueTable.length; j++) {
	                var leagueTable = data[i].leagueTable[j];
	                multi.zadd('groups:' + group, leagueTable.position, leagueTable.dbid);

	                multi.hmset('teams:' + leagueTable.dbid, ['group', group]);
	                multi.hmset('groups:' + group + ':' + leagueTable.dbid, ['goalsAway', leagueTable.goalsAway, 'draws', leagueTable.draws, 'team', leagueTable.name, 'wins', leagueTable.wins, 'points', leagueTable.points, 'dbid', leagueTable.dbid, 'goalsAgainst', leagueTable.goalsAgainst, 'goalDiff', leagueTable.goalDiff, 'goalsFor', leagueTable.goalsFor, 'shortCode', leagueTable.goalsFor, 'name', camelize(leagueTable.name), 'gamesPlayed', leagueTable.gamesPlayed, 'losses', leagueTable.losses, 'position', leagueTable.position]);
	            }
	        };
	        return multi.execAsync();
	    });
	}

	function getGroupTable() {
	    var group = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	    var multi = client.multi();
	    return client.zrangeAsync("groups:" + group, 0, -1).then(function (dbids) {
	        for (var i = 0; i < dbids.length; i++) {
	            multi.hgetall("groups:" + group + ":" + dbids[i]);
	        }
	        return multi.execAsync();
	    });
	}

	function getAllGroupTable() {
	    var groups = ['a', 'b', 'c', 'd', 'e', 'f'];
	    var obj = {};
	    var goupsPromise = ['a', 'b', 'c', 'd', 'e', 'f'].map(function (group) {
	        return getGroupTable(group);
	    });
	    return Promise.all(goupsPromise).then(function (table) {
	        for (var i = 0; i < table.length; i++) {
	            obj[groups[i]] = table[i];
	        }
	        return obj;
	    });
	}

	function getTeams() {
	    var sort = function sort(a, b) {
	        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
	        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
	        if (nameA < nameB) {
	            return -1;
	        }
	        if (nameA > nameB) {
	            return 1;
	        }

	        // names must be equal
	        return 0;
	    };
	    return client.hgetallAsync("teams").then(function (data) {
	        var multi = client.multi();
	        var keys = Object.keys(data);
	        for (var i = 0; i < keys.length; i++) {
	            multi.hgetall("teams:" + data[keys[i]]);
	            multi.smembers("teams:" + data[keys[i]] + ':matches');
	        }
	        return multi.execAsync().then(function (data) {
	            var result = [];
	            data.forEach(function (data, i) {
	                if (!Array.isArray(data)) {
	                    result.push(data);
	                } else {
	                    result[result.length - 1].matches = data;
	                }
	            });
	            return result.sort(sort);
	        });
	    });
	}

	function updateTeamDetail() {
	    var multi = client.multi();
	    return client.hgetallAsync("teams").then(function (data) {
	        var keys = Object.keys(data);
	        var promises = [];
	        for (var i = 0; i < keys.length; i++) {
	            promises.push(c.teams(parseInt(data[keys[i]]), { competition_ids: competition_id }));
	        }
	        return promises;
	    }).map(function (data) {
	        var latitude = '';
	        var longitude = '';
	        var stadium = '';
	        if (data.defaultHomeVenue) {
	            if (data.defaultHomeVenue.geolocation) {
	                latitude = data.defaultHomeVenue.geolocation.latitude;
	                longitude = data.defaultHomeVenue.geolocation.longitude;
	            }
	            stadium = data.defaultHomeVenue.name;
	        }
	        multi.hmset('teams:' + data.dbid, ['stadium', stadium, 'geoLat', latitude, 'geoLon', longitude, 'coach', '']);
	        //Player loop
	        multi.del('teams:' + data.dbid + ':players');
	        for (var i = 0; i < data.players.length; i++) {

	            var player = data.players[i];
	            ;
	            multi.sadd('teams:' + data.dbid + ':players', player.dbid);
	            multi.hmset('player:' + player.dbid, ['position', player.position, 'number', player.number, 'name', player.name, 'dbid', player.dbid, 'shortName', player.shortName, 'teamId', data.dbid, 'teamName', data.name]);
	        }
	        return multi.execAsync();
	    });
	}

	function getTeam() {
	    var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	    var multi = client.multi();
	    var team;
	    return client.hgetallAsync('teams:' + id).then(function (data) {
	        if (!data) {
	            return Promise.reject('Teams not found');
	        }
	        team = data;
	        return client.smembersAsync("teams:" + team.dbid + ':players').then(function (data) {
	            for (var i = 0; i < data.length; i++) {
	                multi.hgetall('player:' + data[i]);
	            }
	            return multi.execAsync().then(function (data) {
	                team.players = data;
	                return team;
	            });
	        });
	    });
	}

	function updateMatchesTable() {
	    var multi = client.multi();
	    c.matches('', { competition_id: competition_id }).then(function (data) {
	        for (var i = 0; i < data.length; i++) {
	            multi.zadd('matches', data[i].start, data[i].dbid.toString());
	            var latitude = '';
	            var longitude = '';
	            var stadium = '';
	            var capacity = '';
	            if (data[i].venue) {
	                if (data[i].venue.geolocation) {
	                    latitude = data[i].venue.geolocation.latitude;
	                    longitude = data[i].venue.geolocation.longitude;
	                }
	                stadium = data[i].venue.name;
	                capacity = data[i].venue.capacity || '';
	            }

	            multi.hmset('matches:' + data[i].dbid.toString(), ['awayGoals', data[i].awayGoals, 'homeGoals', data[i].homeGoals, 'homeTeam', data[i].homeTeam.name, 'homeTeamShort', data[i].homeTeam.shortCode, 'homeTeamId', data[i].homeTeam.dbid, 'awayTeam', data[i].awayTeam.name, 'awayTeamShort', data[i].awayTeam.shortCode, 'awayTeamId', data[i].awayTeam.dbid, 'dbid', data[i].dbid, 'homeDismissals', data[i].dismissals.home, 'awayDismissals', data[i].dismissals.away, 'isResult', data[i].isResult, 'start', data[i].start, 'stadium', stadium, 'geoLat', latitude, 'geoLon', longitude, 'stadiumCapacity', stadium, 'currentState', data[i].currentState, 'nextState', data[i].currentState]);

	            multi.sadd('teams:' + data[i].homeTeam.dbid + ':matches', data[i].dbid);
	            multi.sadd('teams:' + data[i].awayTeam.dbid + ':matches', data[i].dbid);
	        }
	        return multi.execAsync();
	    });
	}

	function updateMatcheDetail(id) {
	    return c.matches(parseInt(id)).then(function (data) {
	        return client.hmsetAsync('matches:' + data.dbid.toString(), ['awayGoals', data.awayGoals, 'homeGoals', data.homeGoals, 'homeDismissals', data.dismissals.home, 'awayDismissals', data.dismissals.away, 'isResult', data.isResult, 'homePlayers', data.homePlayers.length ? JSON.stringify(data.homePlayers) : null, 'awayPlayers', data.awayPlayers.length ? JSON.stringify(data.awayPlayers) : null, 'matchevents', data.matchevents.length ? JSON.stringify(data.matchevents) : null, 'penaltyShootout', Object.keys(data.penaltyShootout).length ? JSON.stringify(data.penaltyShootout) : null, 'isResult', data.isResult, 'currentState', data.currentState, 'nextState', data.currentState]);
	    });
	}

	function getMatches() {
	    return client.zrangeAsync('matches', 0, -1).then(function (data) {
	        var multi = client.multi();
	        for (var i = 0; i < data.length; i++) {
	            //Ugly but makes page size smaller
	            multi.hmget("matches:" + data[i], ['awayGoals', 'homeGoals', 'homeTeam', 'homeTeamId', 'awayTeam', 'awayTeamId', 'dbid', 'stadium', 'start', 'currentState', 'penaltyShootout']);
	        }
	        return multi.execAsync().map(function (data) {
	            return {
	                'awayGoals': data[0],
	                'homeGoals': data[1],
	                'homeTeam': data[2],
	                'homeTeamId': data[3],
	                'awayTeam': data[4],
	                'awayTeamId': data[5],
	                'dbid': data[6],
	                'stadium': data[7],
	                'start': data[8],
	                'currentState': data[9],
	                'penaltyShootout': data[10]
	            };
	        });
	    });
	}

	function getMatch() {
	    var dbid = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	    return client.hgetallAsync('matches:' + dbid).then(function (match) {
	        if (!match) {
	            Promise.reject('Match not found');
	        }
	        if (typeof match.matchevents == 'string' || match.matchevents != null) {
	            match.matchevents = JSON.parse(match.matchevents);
	        }
	        if (!match.hasOwnProperty('awayPlayers') && !match.hasOwnProperty('homePlayers') && !match.awayPlayers && !match.homePlayers) {

	            return Promise.all([match.homeTeamId, match.awayTeamId].map(getTeam)).then(function (teams) {
	                match.players = {
	                    lineup: false,
	                    homeTeam: teams[0].players,
	                    awayTeam: teams[1].players
	                };
	                return match;
	            }).catch(function () {
	                return match;
	            });
	        } else {
	            match.players = {
	                lineup: true,
	                homeTeam: JSON.parse(match.homePlayers),
	                awayTeam: JSON.parse(match.awayPlayers)
	            };
	            delete match.awayPlayers;
	            delete match.homePlayers;
	            return match;
	        }
	    });
	}

	(function () {
	    //Set Up teams
	    isKeyEmpty('teams').then(function () {
	        var teams = c.teams('', { competition_ids: competition_id });
	        return teams.filter(function (team) {
	            return TEAMS.indexOf(camelize(team.name)) != -1;
	        });
	    }).map(function (data) {
	        return client.hmsetAsync('teams:' + data.dbid, ['name', camelize(data.name), 'team', data.name, 'dbid', data.dbid, 'shortCode', data.shortCode]).then(function () {
	            return data;
	        });
	    }).map(function (data) {
	        return client.hsetAsync('teams', camelize(data.name), data.dbid.toString());
	    }).catch(function (error) {
	        console.log('team', error);
	    });

	    //SET UP GROUPS
	    isKeyEmpty('groups').then(updateGroupTable).catch(function (error) {
	        console.log('groups ' + error);
	    });

	    //SET UP matches
	    isKeyEmpty('matches').then(updateMatchesTable).catch(function (error) {
	        console.log('matches ' + error);
	    });
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _request = __webpack_require__(2);

	var _request2 = _interopRequireDefault(_request);

	var _querystring = __webpack_require__(3);

	var _querystring2 = _interopRequireDefault(_querystring);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var baseUrl = "https://api.crowdscores.com/api/v1";

	var Crowdscores = function () {
	    _createClass(Crowdscores, null, [{
	        key: 'baseUrl',
	        get: function get() {
	            return baseUrl;
	        }
	    }]);

	    function Crowdscores(apiKey) {
	        _classCallCheck(this, Crowdscores);

	        this.apiKey = apiKey;
	    }

	    _createClass(Crowdscores, [{
	        key: '_makeRequest',
	        value: function _makeRequest() {
	            var method = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
	            var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            return Crowdscores.makeRequest(this.apiKey, method, query);
	        }
	    }, {
	        key: 'competitions',
	        value: function competitions() {
	            var method = '/competitions/';
	            return this._makeRequest(method);
	        }
	    }, {
	        key: 'footballStates',
	        value: function footballStates() {
	            var method = '/football_states/';
	            return this._makeRequest(method);
	        }
	    }, {
	        key: 'teams',
	        value: function teams() {
	            var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	            var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            var method = void 0;
	            if (isNaN(id)) {
	                method = '/teams/';
	            } else {
	                method = '/teams/' + id;
	            }

	            return this._makeRequest(method, query);
	        }
	    }, {
	        key: 'leagueTables',
	        value: function leagueTables() {
	            var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            var method = '/league-tables';
	            return this._makeRequest(method, query);
	        }
	    }, {
	        key: 'matches',
	        value: function matches() {
	            var id = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	            var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            id = parseInt(id);
	            var method = void 0;
	            if (isNaN(id)) {
	                method = '/matches/';
	            } else {
	                method = '/matches/' + id;
	            }

	            return this._makeRequest(method, query);
	        }
	    }, {
	        key: 'playerstats',
	        value: function playerstats() {
	            var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            var method = '/playerstats/';

	            return this._makeRequest(method, query);
	        }
	    }], [{
	        key: 'makeRequest',
	        value: function makeRequest(apiKey) {
	            var method = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];
	            var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];


	            var qs = _querystring2.default.stringify(query);
	            var options = {
	                url: baseUrl + method,
	                qs: query,
	                headers: {
	                    'x-crowdscores-api-key': apiKey
	                }
	            };
	            return new Promise(function (resolve, reject) {
	                (0, _request2.default)(options, function (error, response, body) {
	                    if (!error && response.statusCode == 200) {
	                        var data = JSON.parse(body);
	                        resolve(data);
	                    } else {
	                        reject('error: ' + response.statusCode);
	                    }
	                });
	            });
	        }
	    }]);

	    return Crowdscores;
	}();

	module.exports = Crowdscores;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("querystring");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("redis");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ }
/******/ ]);