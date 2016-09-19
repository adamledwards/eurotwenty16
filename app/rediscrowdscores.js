import Crowdscores from "./crowdscores";
import redis from "redis";
import bluebird from "bluebird";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export var client = redis.createClient({port:6379,host:'redis'});
var multi = client.multi();
/*
*	competition ID 267 for Euro
*
*/
//Whitelist teams
var TEAMS = [
    "albania",
    "france",
    "romania",
    "switzerland", "england",
    "russia",
    "slovakia",
    "wales",
    "germany",
    "northernIreland",
    "poland",
    "ukraine",
    "croatia",
    "czechRepublic",
    "spain",
    "turkey",
    "belgium",
    "italy",
    "republicOfIreland",
    "sweden",
    "austria",
    "hungary",
    "iceland",
    "portugal"
]
const competition_id = 267;
var c = new Crowdscores('');

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function isKeyEmpty(key) {
    return new Promise((resolve, reject) => {
        client.keysAsync(key).then((replies) => {
            if(replies.length < 1){
                resolve(true);
            } else {
                reject('Key is not empty')
            }
        });
    });
}

export function subscribe(sid) {
    return client.lpushAsync(
        'subscribe',
        sid
    ).then((i)=>{
        return {
            index: i,
            sid: sid
        }

    });
}

export function getSubscriptions(sid) {
    return client.lrangeAsync( "subscribe", 0, -1 ).then((data)=>data);
}

export function unsubscribe(sid) {
    return client.lremAsync(
        'subscribe','-1',
        sid
    ).then((i)=>{
        return {
            delete: i > 0,
            sid: sid
        }

    });
}

export function updateTopScorers() {
    return c.playerstats({competition_id}).then((data) => {
        for (let i = 0; i < data.length; i++) {
            var stats = data[i].playerstats[0];
            client.zadd(
                'players:topScorers',
                i,
                data[i].dbid
            );
            client.hmset('player:'+data[i].dbid,[
                'assists', stats.assists,
                'goals', stats.goals,
                'redCards', stats.redCards,
                'yellowCards', stats.yellowCards
            ]);
        }
    });
}

export function getTopScorers() {
    var multi = client.multi();
    return client.zrangeAsync("players:topScorers", 0, -1).then((dbids) => {
		for (var i = 0; i < dbids.length; i++) {
            multi.hgetall('player:'+dbids[i])
		}
        return multi.execAsync();
	});
}


export function updateGroupTable() {
    var multi = client.multi();
    return c.leagueTables({competition_id}).then((data) => {
        for (let i = 0; i < data.length; i++) {
            var group = data[i].round.name.replace("Group ", "").toLowerCase();
            multi.rpush('groups', group);
            for (let j = 0; j < data[i].leagueTable.length; j++) {
                var leagueTable = data[i].leagueTable[j];
                multi.zadd(
                    'groups:'+group,
                    leagueTable.position,
                    leagueTable.dbid
                );

                multi.hmset('teams:'+leagueTable.dbid,['group', group])
                multi.hmset('groups:'+group+':'+leagueTable.dbid,
                [
                    'goalsAway', leagueTable.goalsAway,
                    'draws', leagueTable.draws,
                    'team', leagueTable.name,
                    'wins', leagueTable.wins,
                    'points',leagueTable.points,
                    'dbid',leagueTable.dbid,
                    'goalsAgainst',leagueTable.goalsAgainst,
                    'goalDiff',leagueTable.goalDiff,
                    'goalsFor',leagueTable.goalsFor,
                    'shortCode',leagueTable.goalsFor,
                    'name', camelize(leagueTable.name),
                    'gamesPlayed', leagueTable.gamesPlayed,
                    'losses', leagueTable.losses,
                    'position', leagueTable.position
                ]);
            }
        };
        return multi.execAsync();
    });

}

export function getGroupTable(group='') {
    var multi = client.multi();
    return client.zrangeAsync("groups:"+group, 0, -1).then((dbids) => {
		for (var i = 0; i < dbids.length; i++) {
			multi.hgetall("groups:"+group+":"+dbids[i]);
		}
        return multi.execAsync();
	});

}

export function getAllGroupTable() {
    let groups = ['a','b','c','d','e','f'];
    let obj = {};
    let goupsPromise = ['a','b','c','d','e','f'].map(group=>getGroupTable(group));
    return Promise.all(goupsPromise).then(table =>{
        for (var i = 0; i < table.length; i++) {
            obj[groups[i]] = table[i]
        }
        return obj;
    });
}


 export function getTeams(){
     var sort = function(a, b) {
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
     return client.hgetallAsync("teams").then((data) => {
         var multi = client.multi();
         var keys = Object.keys(data);
         for(let i = 0; i < keys.length; i++ ){
             multi.hgetall("teams:"+data[keys[i]]);
             multi.smembers("teams:"+data[keys[i]]+':matches')
         }
         return multi.execAsync().then(data => {
             var result = [];
             data.forEach((data,i) => {
                 if(!Array.isArray(data)){
                     result.push(data)
                 } else {
                     result[result.length-1].matches = data;
                 }
            });
            return result.sort(sort);
        });
     });
 }

export function updateTeamDetail(){
    var multi = client.multi();
    return client.hgetallAsync("teams").then((data) => {
        var keys = Object.keys(data);
        var promises = [];
        for(let i = 0; i < keys.length; i++ ){
            promises.push(c.teams(
                parseInt(data[keys[i]]),
                {competition_ids:competition_id})
            );
        }
        return promises;
    }).map((data)=>{
        var latitude = '';
        var longitude = '';
        var stadium = '';
        if(data.defaultHomeVenue){
            if(data.defaultHomeVenue.geolocation){
                latitude = data.defaultHomeVenue.geolocation.latitude;
                longitude = data.defaultHomeVenue.geolocation.longitude;
            }
                stadium = data.defaultHomeVenue.name;
        }
        multi.hmset('teams:'+data.dbid,
        ['stadium', stadium,
        'geoLat', latitude,
        'geoLon', longitude,
        'coach', '']);
        //Player loop
        multi.del('teams:'+data.dbid+':players');
        for(let i=0; i< data.players.length; i++){

            var player = data.players[i];
            ;
            multi.sadd('teams:'+data.dbid+':players', player.dbid);
            multi.hmset('player:'+player.dbid,[
                'position', player.position,
                'number', player.number,
                'name', player.name,
                'dbid', player.dbid,
                'shortName', player.shortName,
                'teamId', data.dbid,
                'teamName', data.name
            ]);
        }
        return multi.execAsync();

    });
}

export function getTeam(id=''){
    var multi = client.multi();
    var team;
    return client.hgetallAsync('teams:'+id).then((data) => {
        if(!data){
            return Promise.reject('Teams not found');
        }
        team = data;
        return client.smembersAsync("teams:"+team.dbid+':players').then((data) => {
            for(let i=0; i< data.length; i++){
                multi.hgetall('player:'+data[i])
            }
            return multi.execAsync().then((data) => {
                team.players = data;
                return team;
            });
        });

    });
}


export function updateMatchesTable() {
    var multi = client.multi();
    c.matches('', {competition_id})
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            multi.zadd(
                'matches',
                data[i].start,
                data[i].dbid.toString()
            );
            var latitude = '';
            var longitude = '';
            var stadium = '';
            var capacity = '';
            if(data[i].venue){
                if(data[i].venue.geolocation){
                    latitude = data[i].venue.geolocation.latitude;
                    longitude = data[i].venue.geolocation.longitude;

                }
                    stadium = data[i].venue.name;
                    capacity = data[i].venue.capacity|| '';
            }

            multi.hmset('matches:'+data[i].dbid.toString(),
            [
                'awayGoals', data[i].awayGoals,
                'homeGoals', data[i].homeGoals,
                'homeTeam', data[i].homeTeam.name,
                'homeTeamShort', data[i].homeTeam.shortCode,
                'homeTeamId', data[i].homeTeam.dbid,
                'awayTeam', data[i].awayTeam.name,
                'awayTeamShort', data[i].awayTeam.shortCode,
                'awayTeamId', data[i].awayTeam.dbid,
                'dbid',data[i].dbid,
                'homeDismissals', data[i].dismissals.home,
                'awayDismissals', data[i].dismissals.away,
                'isResult', data[i].isResult,
                'start', data[i].start,
                'stadium', stadium,
                'geoLat', latitude,
                'geoLon', longitude,
                'stadiumCapacity', stadium,
                'currentState', data[i].currentState,
                'nextState', data[i].currentState,
                ]
            );

            multi.sadd('teams:'+data[i].homeTeam.dbid+':matches', data[i].dbid)
            multi.sadd('teams:'+data[i].awayTeam.dbid+':matches', data[i].dbid)
        }
        return multi.execAsync();
    });
}

export function updateMatcheDetail(id){
    return c.matches(parseInt(id)).
        then((data)=>{
            return client.hmsetAsync('matches:'+data.dbid.toString(),
            [
                'awayGoals', data.awayGoals,
                'homeGoals', data.homeGoals,
                'homeDismissals', data.dismissals.home,
                'awayDismissals', data.dismissals.away,
                'isResult', data.isResult,
                'homePlayers', data.homePlayers.length ? JSON.stringify(data.homePlayers): null,
                'awayPlayers', data.awayPlayers.length ? JSON.stringify(data.awayPlayers): null,
                'matchevents', data.matchevents.length ? JSON.stringify(data.matchevents): null,
                'penaltyShootout', Object.keys(data.penaltyShootout).length ? JSON.stringify(data.penaltyShootout): null,
                'isResult', data.isResult,
                'currentState', data.currentState,
                'nextState', data.currentState
                ]
            );
        });

}

export function getMatches(){
    return client.zrangeAsync('matches',0, -1).then((data) => {
        var multi = client.multi();
        for(var i = 0; i < data.length; i++ ){
            //Ugly but makes page size smaller
            multi.hmget("matches:"+data[i], [
                'awayGoals',
                'homeGoals',
                'homeTeam',
                'homeTeamId',
                'awayTeam',
                'awayTeamId',
                'dbid',
                'stadium',
                'start',
                'currentState',
                'penaltyShootout'
            ]);
        }
        return multi.execAsync().map((data) => {
            return {
                'awayGoals':data[0],
                'homeGoals':data[1],
                'homeTeam':data[2],
                'homeTeamId':data[3],
                'awayTeam':data[4],
                'awayTeamId':data[5],
                'dbid':data[6],
                'stadium':data[7],
                'start':data[8],
                'currentState':data[9],
                'penaltyShootout':data[10]
            };
        });
    });
}

export function getMatch(dbid=''){
    return client.hgetallAsync('matches:'+dbid).then((match) => {
        if(!match){
            Promise.reject('Match not found');
        }
        if(typeof match.matchevents == 'string' || match.matchevents != null){
            match.matchevents = JSON.parse(match.matchevents);
        }
        if(
            (!match.hasOwnProperty('awayPlayers') && !match.hasOwnProperty('homePlayers')) &&
            (!match.awayPlayers  && !match.homePlayers)
        ){

        return Promise.all([match.homeTeamId,match.awayTeamId].map(getTeam)).then(teams => {
                 match.players = {
                     lineup: false,
                     homeTeam:teams[0].players,
                     awayTeam:teams[1].players
                 };
                 return match
         }).catch(()=>match);

        }else {
            match.players = {
                lineup: true,
                homeTeam:JSON.parse(match.homePlayers),
                awayTeam:JSON.parse(match.awayPlayers)
            };
            delete match.awayPlayers;
            delete match.homePlayers;
            return match;
        }
    });
}

(function(){
    //Set Up teams
    isKeyEmpty('teams').then(() => {
        var teams = c.teams('', {competition_ids:competition_id});
        return teams.filter((team)=> TEAMS.indexOf(camelize(team.name)) != -1 )
    }).map((data) => {
		return client.hmsetAsync('teams:'+data.dbid,
			['name', camelize(data.name),
            'team', data.name,
            'dbid', data.dbid,
            'shortCode', data.shortCode]
		).then(() => {
			return data;
			});
    }).map((data) => {
		return client.hsetAsync('teams' ,camelize(data.name), data.dbid.toString());
	}).catch((error) => {
        console.log('team' ,error)
    });

    //SET UP GROUPS
    isKeyEmpty('groups')
    .then(updateGroupTable)
    .catch((error) => {
        console.log('groups '+error)
    });

    //SET UP matches
    isKeyEmpty('matches')
    .then(updateMatchesTable)
    .catch((error) => {
        console.log('matches '+error)
    });




})();
