import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/main'
import Product from './pages/app'

const PUBLIC_ID='266386234514516'
const redirect_uri=process.env.REACT_APP_API_URL+'/auth'
const login_url='https://api.instagram.com/oauth/authorize?client_id='+PUBLIC_ID+'&redirect_uri='+redirect_uri+'&scope=user_profile,user_media&response_type=code'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/app/" component={Product} />
            <Route exact path='/auth' component={() => { 
                function setCookie(name, value, days) {
                    var d = new Date;
                    d.setTime(d.getTime() + 24*60*60*1000*days);
                    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
                }
                let search = window.location.search;
                let params = new URLSearchParams(search);
                //alert(params.get('token'))
                if(params.get('token')!=null && params.get('userid')!=null){
                    setCookie('userid',params.get('userid'))
                    setCookie('token',params.get('token'))

                }
                window.location.href = '/app'; 
                return null;
            }}/>
            <Route exact path='/login' component={() => { 
                window.location.href = login_url; 
                return null;
            }}/>
        </Switch>
    </BrowserRouter>
)

export default Routes;