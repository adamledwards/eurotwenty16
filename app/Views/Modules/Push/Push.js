import React, {  Component } from 'react'
import prefix from 'react-prefixr';
import { Link } from 'react-router';
import classNames from 'classnames';

class Push extends Component {

    constructor (props){
        super(props)
        this.supported = false;
        this.state = {btnText:"Enable Notifications", permissionPending:false, error: ''};
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.getSubscription = this.getSubscription.bind(this);
        this.toggleSubscription = this.toggleSubscription.bind(this);
    }

    componentDidMount(){
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
            .then(this.getSubscription)
            .catch(function(error) {
                console.log(':^(', error);
                console.log(':(', Notification.permission );
            });
        }else{
            this.setState({permissionPending:true, error:"Notifications are not supported in the borwser"});
        }
    }

    subscribe(serviceWorkerRegistration) {
        var this_ = this;
        const {subscribeUser} = this.props;
        this_.setState({permissionPending:true});
        return serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true
            }).then(function(sub) {
                this_.setState({btnText:"Disable Notifications",error:"",permissionPending:false})
                console.log('endpoint:', sub.endpoint);
                var endpoint = sub.endpoint.replace('https://android.googleapis.com/gcm/send/', '');
                subscribeUser(endpoint);
                localStorage.setItem('sid', endpoint);
            });
    }

    unsubscribe(subscription) {
        var this_ = this
        const {unsubscribeUser} = this.props;
        return subscription.unsubscribe().then(function(sub) {
                var sid = localStorage.getItem('sid');
                unsubscribeUser(sid);
                this_.setState({btnText:"Enable Notifications",error:"",permissionPending:false})
        });

    }

    toggleSubscription (event) {
        var this_ = this
        event.preventDefault()
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
                return serviceWorkerRegistration.pushManager.getSubscription()
                .then(function(subscription) {
                    if(subscription){
                        return this_.unsubscribe(subscription)
                    }else{
                        return this_.subscribe(serviceWorkerRegistration)
                    }

                });

            })
            .catch(function(error) {
                this_.setState({permissionPending:false, error:error.message});
            });
        }
    }

    getSubscription() {
        var this_ = this
        if ('serviceWorker' in navigator) {
         console.log('Service Worker is supported');
         navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {

             serviceWorkerRegistration.pushManager.getSubscription()
             .then(function(subscription) {
                 if(subscription){
                     this_.setState({btnText:"Disable Notifications"})
                 }
            }).catch(function(error) {
                console.log(':(', Notification.permission );
            });
        });
    }
}
    render() {
         let cn = classNames({
             'container':true,
             'permissionPending':this.state.permissionPending
         })

        return (
                <div className={cn}>
                    <div className="overlay"></div>
                    <div className="row">
                        <div className="col-xs-14 center-pullup">
                            <h2>Notifications settings</h2>
                            <a className="btn" href="#" onClick={this.toggleSubscription}>{this.state.btnText}</a>
                            <p>{this.state.error}</p>
                        </div>
                    </div>
                </div>
        )
    }
}


export default Push
