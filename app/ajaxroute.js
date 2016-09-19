import express from 'express';
import { getTeams, getTeam,getMatches, getMatch, subscribe, unsubscribe} from 'rediscrowdscores'


let router = express.Router();

router.get('/teams', function(req, res) {
	getTeams()
	 .then(data => res.send(data))
});

router.get('/teams/:id', function(req, res) {
	getTeam(req.params.id)
	 .then(data => res.send(data))
});


router.put('/subscribe/', function(req, res) {
	subscribe(req.body.sid)
		.then(data => res.send(data))
		.catch((error)=>{
			res.status(500);
			res.send({error:error});
		});
});

router.delete('/subscribe/', function(req, res) {
	unsubscribe(req.body.sid)
		.then(data => res.send(data))
		.catch((error)=>{
			res.status(500);
			res.send({error:error});
		});
});
router.get('/matches', function(req, res) {
	getMatches()
	 .then(data => res.send(data))
});

router.get('/matches/:id', function(req, res) {
	getMatch(req.params.id)
	 .then(data => res.send(data))
	 .catch((error)=>{
		 res.status(404);
		 res.send({error:error});
	 });
});
export default router;
