import Immutable from 'immutable';
import {RECEIVE_TEAMS, REQUESTING,
    SELECT_TEAM, RECEIVE_MATCHES,
    RECEIVE_GROUPS, MODAL_CLOSE, ANIMATING,
    MODAL_OPEN, HOVER_TEAM,RECEIVE_TEAM,SELECT_MATCH, RECEIVE_MATCH, IS_MOBILE,
RECEIVE_TOPSCORERS, SUBSCRIBE, UNSUBSCRIBE} from '../Actions/teams.js'

const initialState = Immutable.fromJS(
    {
        'app:isFetching': false,
        'app:modal': false
    }
)

function indexbyId(arr, id){
    var indx = arr.findIndex((v)=>{
        return id == v.dbid;
    });
    return indx;
}

 export function teams(state = initialState, action) {
	  switch (action.type) {
	  	case REQUESTING:
			state = state.set('app:isFetching', true);
	  		break;
		case RECEIVE_TEAMS:
			state = state.withMutations(state => {
	 			state.set('app:isFetching', false).set('app:teams', action.teams).set('app:team:lastUpdated',  action.receivedAt);
			});
            break;
        case RECEIVE_TEAM:
            var teams = state.get('app:teams');
            var indx = indexbyId(teams, action.team.dbid);
            teams[indx].players = action.team.players;

            teams = teams.map((item,index)=>{
                if(indx ===  index){
                    item.players = action.team.players;
                    return item;
                }
                return item;
            });

            state = state.withMutations(state => {
	 			state.set('app:isFetching', false).set('app:teams', teams).set('app:team:lastUpdated',  action.receivedAt);
			});
            break;
        case SELECT_TEAM:
            var teams = state.get('app:teams');
            var dbid,team;
            if(action.team !== false){
                if(typeof action.team === "string"){
                    dbid = action.team;
                }else{
                    dbid = action.team.dbid;
                }
                var indx = indexbyId(teams, dbid);
                team = teams[indx]
            }
            state = state.set('user:team', team);
            break;
        case HOVER_TEAM:
                state = state.withMutations(state => {
                    state.set('user:hover:team', action.team);
                });
            break
        case RECEIVE_TOPSCORERS:
            state = state.withMutations(state => {
                state.set('app:topScorers', action.scorers).set('app:isFetching', false)
            });
			break;
        case RECEIVE_MATCHES:
            state = state.withMutations(state => {
                state.set('app:matches', action.matches).set('app:isFetching', false)
            });
			break;
        case RECEIVE_MATCH:
            var matches = state.get('app:matches');
            var indx = indexbyId(matches, action.match.dbid);
            matches = matches.map((item,index)=>{
                if(indx ===  index){
                    return action.match;
                }
                return item;
            });

            state = state.withMutations(state => {
                state.set('app:matches', matches).set('app:isFetching', false)
            });
            break;
        case RECEIVE_GROUPS:
            state = state.withMutations(state => {
                state.set('app:groups', action.groups).set('app:isFetching', false)
            });
			break;
        case SELECT_MATCH:
            var match;
            if(action.match !== false){
                var matches = state.get('app:matches');
                var indx = indexbyId(matches, action.match.dbid);
                match = matches[indx]
            }
            state = state.set('user:match', match);
            break;
        case MODAL_OPEN:
            state = state.set('app:modal', true);
            break;
        case MODAL_CLOSE:
            state = state.set('app:modal', false);
            break;
        case IS_MOBILE:
            state = state.set('app:isMobile', action.isMobile);
            break;
        case SUBSCRIBE:
            state = state.set('user:subscribe', action.data);
            break;
        case UNSUBSCRIBE:
            state = state.set('user:subscribe', false);
            break;


	  }
	  return state
 }
