//'v-0.0.3'
Dexie = require('dexie');
var db = new Dexie('eurotwenty16');
db.version(1).stores({
    matches: "dbid,start,homeTeam,homeGoals,awayTeam,awayGoals,currentState,penaltyShootout"
});

db.on('ready', function () {
    return new Dexie.Promise(function (resolve, reject) {
        fetch('/api/matches').then(function(res){
            return res.json();
        }).then(function(data){
            resolve(data);
        });
    }).then(function(data){
        var matches = data.map(function(match){
            return {
                dbid: match.dbid,
                start: parseInt(match.start),
                homeTeam: match.homeTeam,
                homeGoals: match.homeGoals,
                awayTeam: match.awayTeam,
                awayGoals: match.awayGoals,
                currentState: match.currentState,
                penaltyShootout: match.currentState
            }
        });

        db.matches.bulkPut(matches).then(function(lastKey) {
            console.log("Last match's id was: " + lastKey);
        }).catch(Dexie.BulkError, function (e) {
        });
    });
});

self.addEventListener('install', function(event) {
  console.log('Installed', event);
  db.open().catch (function (err) {
 console.error('Failed to open db: ' + (err.stack || err));
});
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
  db.open().catch (function (err) {
  console.error('Failed to open db: ' + (err.stack || err));
});
});


self.addEventListener('push', function(event) {

    event.waitUntil(
    db.matches
        .where('start')
        .between(new Date().setUTCHours(0,0,0,0),  new Date().setUTCHours(23,59,59,0))
        .toArray(function(data){
            return fetch('/api/matches').then(function(res){
                return res.json();
            }).then(function(res){
                var ids = data.map(function(m) {
                    return m.dbid;
                });

                var latest = res.filter(function(r){
                     return ids.indexOf(r.dbid) > -1;
                });

                return {
                    orginal:data,
                    match: latest
                }
            });

        }).then(function(d) {
            var arr = [];
            var notification;
            d.orginal.forEach(function(oldData, i) {
                var match = d.match[i];
                var test1 = oldData.awayGoals != match.awayGoals;
                var test2 = oldData.homeGoals != match.homeGoals;
                if(test1 || test2){
                    arr.push({text:match.homeTeam+" "+match.homeGoals+" - "+match.awayGoals+" "+match.awayTeam, dbid:match.dbid});
                }
            });

            if(arr.length > 0) {
                var text = arr[0].text;
                var data = null;
                if(arr.length > 1){
                    text = arr.map(function(d){return d.text}).join('\r\n');
                } else {
                    data = {
                        id: arr[0].dbid
                    }
                }

                notification = self.registration.showNotification("Goal!", {
                    body: text,
                    icon: '/s/img/icon/icon-192x192.png',
                    tag: 'goal',
                    data: data
                });
            }
            var matches = d.match.map(function(match){
                return {
                    dbid: match.dbid,
                    start: parseInt(match.start),
                    homeTeam: match.homeTeam,
                    homeGoals: match.homeGoals,
                    awayTeam: match.awayTeam,
                    awayGoals: match.awayGoals,
                    currentState: match.currentState,
                    penaltyShootout: match.currentState
                }
            });

             var dbPromise = db.matches.bulkPut(matches).then(function(lastKey) {
                 console.log("Last match's id was: " + lastKey);
             });

            if(notification) {
                return Promise.all([notification, dbPromise]);
            }else {
                return dbPromise;
            }

        })

        );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    var url = 'https://eurotwenty16.com/';
    if(event.notification.data){
        url = 'https://eurotwenty16.com/match/'+event.notification.data.id;
    }


    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
        .then(function (windowClients) {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
