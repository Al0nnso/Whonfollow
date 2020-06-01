const mongoose = require('mongoose');
//const fetch = require('node-fetch')
const axios = require('axios')
//const getApi = require('./GetApi')
const request = require('request');
const User = mongoose.model('User')

const client_id='266386234514516';
const client_secret='6b64169771a96619579ad25aa7e99311';

/*
LONG-TOKEN TEST
IGQVJWZAXJIeUwxbC1ZANk1BTUtYakdlakM0cTVoZAmNRX2xsVXV4QlRHSnFybWFvbHRpcHNhTlhFbkpoSW5hS05oMFQ2cl9BVkJBdldPMkc3NWRvWUJrSVJYU1BhaWZARV3dUU0Vvb3l3
*/

/*
class Api{
    static async getToken(code){
        const api_url = 'https://api.instagram.com/oauth/access_token'
        var redirect_uri="https://ba1cc5db.ngrok.io/api/token"
        redirect_uri="https://ba1cc5db.ngrok.io/api/auth"
        const body='client_id='+client_id+';client_secret='+client_secret+';grant_type=authorization_code;redirect_uri='+redirect_uri+';code='+code
        console.log(body)

        request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     api_url,
                body:    body
            }, function(error, response, body){
                return body;
        });
    }

}*/

module.exports = {
    async index(req,res){
        const { page = 1 } = req.query;
        const users = await User.paginate({},{page, limit: 10});
        return res.json(users);
    },

    async show(req,res){
        const user = await User.findById(req.params.id);
        return res.json(user)
    },
    
    async regist(req,res){
        const {code} = req.query;
        //const response = await fetch(api_url,myInit)
        const api_url = 'https://api.instagram.com/oauth/access_token'
        var redirect_uri="https://bb2878e9e4a0.ngrok.io/api/auth"
        const body='client_id='+client_id+';client_secret='+client_secret+';grant_type=authorization_code;redirect_uri='+redirect_uri+';code='+code
        //console.log(body)

        request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     api_url,
                body:    body
            }, async function(error, response, body){
                const objbody=JSON.parse(body)
                //register_token(objbody.user_id,objbody.access_token)
                //console.log(objbody)
                //console.log('grant_type=ig_exchange_token;client_secret='+client_secret+';access_token='+objbody.access_token)
                const longtoken_url='https://graph.instagram.com/access_token/?grant_type=ig_exchange_token&client_secret='+client_secret+'&access_token='+objbody.access_token
                request(longtoken_url, async function (error, response, body) {
                    const longtoken=JSON.parse(body)
                    //console.log(longtoken)
                    var date=new Date(Date.now())
                    var newDate = new Date(date.getTime() + (1000 * longtoken.expires_in))
                    const user = await User.create({userid:objbody.user_id,token:longtoken.access_token,expire_token: new Date(date.toISOString())});
                    console.log(user)
                    //return res.send(user);
                    return res.redirect('http://localhost:5500/whonfollow-pages/')
                })
        });

        /*return res.json(getApi)*/
    },

    async update(req,res){
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true});
        return res.json(user);
    }, 
    async destroy(req,res){
        await User.findByIdAndRemove(req.params.id);
        return res.send();
    },
    async login(req,res){
        //const redirect_uri=''
        //const api_url = 'https://api.instagram.com/oauth/authorize?client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=user_profile,user_media&response_type=code'
        //console.log(api_url)
        //const response = await fetch(api_url)
        //return res.json(response)
    },
    async getmedia(req,res){
        const userid=req.params.userid
        User.findOne({ 'userid': userid }, '_id', async function (err, person) {
            if (err) return handleError(err);
            console.log(person._id);
            const userobj=await User.findById(person._id)
            console.log(userobj);
            const getmedia_url='https://graph.instagram.com/me/?fields=media&access_token='+userobj.token+'&after='+req.query.after+'&before='+req.query.before
            request(getmedia_url, async function (error, response, body) {
                const mediaobj=JSON.parse(body)
                return res.send(mediaobj);
            })
        });
    },
    async getinfo(req,res){
        const userid=req.params.userid
        User.findOne({ 'userid': userid }, '_id', async function (err, person) {
            if (err) return handleError(err);
            console.log(person._id);
            const userobj=await User.findById(person._id)
            console.log(userobj);
            var thisdate=new Date(Date.now())
            if(userobj.infoupdate!=undefined){
                const last_update=new Date(userobj.infoupdate)
                if(last_update.getHours()>=thisdate.getHours()){
                    var json_data={
                        username:userobj.username,
                        full_name:userobj.full_name,
                        followers:userobj.followers,
                        following:userobj.following,
                        infoupdate:userobj.infoupdate,
                    }
                    return res.send(json_data)
                }
            }
            const getinfo_url='https://graph.instagram.com/me/?fields=id,username,media_count,account_type&access_token='+userobj.token
            request(getinfo_url, async function (error, response, body) {
                const infoobj=JSON.parse(body)
                console.log(infoobj.username)
                var getfollows_url='https://www.instagram.com/'+infoobj.username+'?__a=1'
                //Second option if the first url not work
                //getfollows_url='https://www.instagram.com/web/search/topsearch/?context=blended&query='+infoobj.username
                request(getfollows_url, async function (error, response, body) {
                    const user_info=JSON.parse(body);
                    //console.log(user_info)
                    var json_data={
                        username:user_info.graphql.user.username,
                        full_name:user_info.graphql.user.full_name,
                        followers:user_info.graphql.user.edge_followed_by.count,
                        following:user_info.graphql.user.edge_follow.count,
                        infoupdate:new Date(thisdate.toISOString())
                    }
                    const user_info_update = await User.findByIdAndUpdate(person._id, json_data, { new: true});
                    console.log('[+] UPDATED ON SERVER')
                    return res.json(json_data)
                })
                //return res.send(infoobj);
            })
        });
    }
}