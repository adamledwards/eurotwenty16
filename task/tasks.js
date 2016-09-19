
var rc = require('./rediscrowdscores');
var request = require('request');

var slack = {
    url:"https://hooks.slack.com/services/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",
    method: "POST"
};

var HALOURL = "http://mediator.halo.pokedev.net/webhook/6fa8058ea4f6eadc3daa6de2bfd865c78929d3da/text/";



var task = {
    rc: rc,
    methods:{
        updateMatch:function(job, done){
            rc.updateMatcheDetail(job.data.dbid).then(function(data) {
                done();
            });
        },
        kickoff:function(job, done){
            var match = job.data;
            slack.json = {"text": "Kick off : "+match.homeTeam+" "+match.homeGoals+" - "+match.awayTeam+" "+match.awayGoals};
            request(slack);
            // request.post(HALOURL, {form:{
            //     text:"Kick off : "+match.homeTeam+" "+match.homeGoals+" - "+match.awayTeam+" "+match.awayGoals,
            //     colour:"255,255,255",
            // }});
            done();

        },
        updateGroup:function(job, done){
            rc.updateGroupTable().then(function(data) {
                done();
            });
        },
        updateTopScorer:function(job, done){
            rc.updateTopScorers().then(function(data) {
                done();
            });
        },
        updateMatches:function(job, done){
            rc.updateMatchesTable().then(function(data) {
                done();
            });
        }
    }

}

module.exports = task;
