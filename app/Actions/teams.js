
import { getTeams, getTeam, getMatches,getAllGroupTable, getMatch ,getTopScorers,subscribe, unsubscribe} from 'rediscrowdscores'



export const SELECT_TEAM = 'SELECT_TEAM'
export const REQUESTING = 'REQUESTING'
export const RECEIVE_TEAMS = 'RECEIVE_TEAMS'
export const RECEIVE_TEAM = 'RECEIVE_TEAM'
export const SELECT_MATCH = 'SELECT_MATCH'
export const RECEIVE_MATCHES = 'RECEIVE_MATCHES'
export const RECEIVE_MATCH = 'RECEIVE_MATCH'
export const RECEIVE_GROUPS = 'RECEIVE_GROUPS'
export const MODAL_CLOSE = 'MODAL_CLOSE'
export const MODAL_OPEN = 'MODAL_OPEN'
export const HOVER_TEAM = 'HOVER_TEAM'
export const IS_MOBILE = 'IS_MOBILE'
export const RECEIVE_TOPSCORERS = 'RECEIVE_TOPSCORERS'
export const SUBSCRIBE = 'SUBSCRIBE'
export const UNSUBSCRIBE = 'UNSUBSCRIBE'


export function selectDevice(isMobile) {
	return {
		type: IS_MOBILE,
		isMobile
	}
}


function subscribeAction(index) {
	return {
		type: SUBSCRIBE,
		index
	}
}



export function subscribeUser(sid) {
   return dispatch => {
	   dispatch(requesting());
	   return subscribe(sid)
		 .then(data => dispatch(subscribeAction(index)));

   }
}

function unsubscribeAction(index) {
	return {
		type: UNSUBSCRIBE,
		index
	}
}

export function unsubscribeUser(sid) {
   return dispatch => {
	   dispatch(requesting());
	   return unsubscribe(sid)
		 .then(data => dispatch(unsubscribeAction(index)));

   }
}

export function selectTeam(team) {
	return {
		type: SELECT_TEAM,
		team
	}
}
function receiveTeam(team) {
  	return {
	  	type: RECEIVE_TEAM,
		receivedAt: Date.now(),
    	team,
  	}
 }

 export function fetchTeam(team, teams) {
 	return dispatch => {
		var dbid;
	   	 if(typeof team === "string"){
	   		 dbid = team;
	   	 }else{
	   		 dbid = team.dbid;
	   	 }
 		dispatch(requesting());
		return getTeam(dbid)
		  .then(data => dispatch(receiveTeam(data)));

 	}
 }


export function hoverTeam(team) {
	return {
		type: HOVER_TEAM,
		team
	}
}


export function fetchMatch(dbid) {
   return dispatch => {
	   dispatch(requesting());
	   return getMatch(dbid)
		 .then(data => dispatch(receiveMatch(data)));
   }
}

function receiveMatch(match) {
  	return {
	  	type: RECEIVE_MATCH,
		receivedAt: Date.now(),
    	match,
  	}
 }

 function receiveTopscorers(scorers) {
   	return {
 	  	type: RECEIVE_TOPSCORERS,
 		receivedAt: Date.now(),
     	scorers,
   	}
  }

export function selectMatch(id) {
	return {
		type: SELECT_MATCH,
		match :{
			dbid: id
		}
	}
}

export function modalOpen(){
	return {
		type: MODAL_OPEN
	}
}


export function modalClose(){
	return {
		type: MODAL_CLOSE
	}
}

export function animating(animating){
	return {
		type: ANIMATING,
		animating

	}
}

export function fetch(pathname) {
	//arrow function: return funtion(dispatch){}
	return dispatch => {

		dispatch(requesting());
	    var t = getTeams()
	      .then(data => dispatch(receiveTeams(data)));

		var m = getMatches()
		  .then(data => dispatch(receiveMatches(data)))
		  	.then(()=>{
			  if(pathname.indexOf('match') > -1){
	  			var dbid = pathname.match(/[0-9]+/g);
	  			if(dbid.length){

	  				return dispatch(fetchMatch(dbid)).then(() => {
						return dispatch(selectMatch(dbid))
					});
				}
	  		}
		  });
		  var g = getAllGroupTable()
  		  	.then(data => dispatch(receiveGroups(data)));

		var ts = getTopScorers()
		  .then(data => dispatch(receiveTopscorers(data)));

		return Promise.all([t,m,g,ts]);
	}
}

function requesting() {
	return {
		type: REQUESTING
	}
}

function receiveTeams(teams) {
  	return {
	  	type: RECEIVE_TEAMS,
		receivedAt: Date.now(),
    	teams
  	}
 }

 function receiveGroups(groups) {
   	return {
 	  	type: RECEIVE_GROUPS,
 		receivedAt: Date.now(),
     	groups
   	}
  }

  function receiveMatches(matches) {
	   return {
	   type: RECEIVE_MATCHES,
	   receivedAt: Date.now(),
	   matches
	   }
   }
