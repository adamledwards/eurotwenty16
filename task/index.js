global.Promise = require('bluebird');
var kue = require('kue');
var express = require('express');
var ui = require('kue-ui');
var request = require('request');
var tasks = require('./tasks');
var states = require('./states.json');
var app = express();

var rc = tasks.rc;
var methods = tasks.methods;
var state;
// connect kue to appropriate redis, or omit for default localhost

var queue = kue.createQueue({
    redis: {
        port: 6379,
        host: 'redis',
        db: 1
    }
})

var slack = {
    url:"https://hooks.slack.com/services/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",
    method: "POST"
};

var HALOURL = "http://mediator.halo.pokedev.net/webhook/6fa8058ea4f6eadc3daa6de2bfd865c78929d3da/goal/";


function sendPush(sid) {

    var options = {
        method: 'POST',
        url: 'https://android.googleapis.com/gcm/send',
        headers: {
            'content-type': 'application/json',
            'authorization': 'key=AIzaSyBpwbgjlsEImBTP5GsSWHMV9j2VpuNbt4g'
        },
        body: { registration_ids: sid},
        json: true
    };

    request(options);
}


kue.Job.rangeByState( 'delayed', 0, 300, 'asc', function( err, jobs ) {
  jobs.forEach( function( job ) {
    job.remove( function(){
      console.log( 'removed ', job.id );
    });
  });
});

 rc.getMatches()
     .then(function(data){

         data.forEach(function(match, i){
             state = states[match.currentState];
             if(match.currentState === "0"){
                    var d = new Date(parseInt(match.start));
                    queue.create('updateMatch', match)
                    .delay(d)
                    .save();

                    queue.create('kickoff', match)
                    .delay(d)
                    .save();
            }
            if(state.inGame){
                queue.create('updateMatch', match)
                .save();
            }
        });

     });

 queue.on('job complete', function(id, result){
    kue.Job.get(id, function(err, job){
         if(job.type === 'updateMatch') {
             rc.getMatch(job.data.dbid)
             .then(
                 function(data){
                     var oldData = job.data;

                       var match = data;
                       if(oldData.awayGoals != match.awayGoals || oldData.homeGoals != match.homeGoals){
                           slack.json = {"text":"GOAL! : "+match.homeTeam+" "+match.homeGoals+" - "+match.awayTeam+" "+match.awayGoals};
                           request.post(HALOURL, {form:{
                               score:match.homeGoals+'-'+match.awayGoals,
                               team_1:match.homeTeamShort,
                               team_2:match.awayTeamShort,
                           }});
                           request(slack);
                           queue.create('updateTopScorer')
                           .save();
                           rc.getSubscriptions().then(sendPush);
                       }
                       var state = states[match.currentState];
                       var now = new Date().getTime();
                       var d = new Date(parseInt(match.start)).getTime();
                       if(state.inGame){
                            var delay = 1*60*100;
                            if(state.break){
                                delay = 5*60*100;
                            }
                            queue.create('updateMatch', match)
                            .delay(delay)
                            .save();

                        } else if (match.currentState === "0" && now > d ){
                            queue.create('updateMatch', match)
                            .delay(1*60*100)
                            .save();
                        } else if (match.currentState === "9" ){
                            queue.create('updateGroup')
                            .save();
                            queue.create('updateMatches')
                            .save();
                            slack.json = {"text":"Full Time : "+match.homeTeam+" "+match.homeGoals+" - "+match.awayTeam+" "+match.awayGoals};
                            request(slack);
                        }

                });
            }
        job.remove();
    });


});

 Object.keys(tasks.methods).forEach(function(type, i){
     queue.process(type, function(job, done){
       methods[type](job, done);
     });
});

ui.setup({
    apiURL: '/admin/api', // IMPORTANT: specify the api url
    baseURL: '/admin', // IMPORTANT: specify the base url
    updateInterval: 5000 // Optional: Fetches new data every 5000 ms
});


// Mount kue JSON api
app.use('/admin/api', kue.app);
// Mount UI
app.use('/admin', ui.app);

app.listen(4000);
