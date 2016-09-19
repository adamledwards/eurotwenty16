import request from 'request';
import querystring from 'querystring';

const baseUrl = "https://api.crowdscores.com/api/v1";

class Crowdscores {

    static get baseUrl(){
        return baseUrl;
    }
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    static makeRequest(apiKey, method = '/', query = {}) {


        let qs = querystring.stringify(query)
        let options = {
            url: baseUrl+method,
            qs: query,
            headers: {
                'x-crowdscores-api-key': apiKey
            }
        };
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body);
                    resolve(data);
                } else {
                    reject('error: '+ response.statusCode);
                }
            });
        });
    }

    _makeRequest(method = '/', query = {}) {
        return Crowdscores.makeRequest(this.apiKey, method, query)
    }

    competitions() {
        let method = '/competitions/';
        return this._makeRequest(method);
    }

    footballStates() {
        let method = '/football_states/';
        return this._makeRequest(method);
    }

    teams(id='', query = {}) {
        let method;
        if(isNaN(id)){
            method = '/teams/';
        } else {
            method = '/teams/'+id;
        }

        return this._makeRequest(method, query);
    }

    leagueTables(query = {}) {
        let method ='/league-tables';
        return this._makeRequest(method, query);
    }

    matches(id='', query = {}) {
        id = parseInt(id);
        let method;
        if(isNaN(id)){
            method = '/matches/';
        } else {
            method = '/matches/'+id;
        }

        return this._makeRequest(method, query);
    }

    playerstats(query = {}) {
        let method = '/playerstats/';

        return this._makeRequest(method, query);
    }
}



module.exports = Crowdscores;
