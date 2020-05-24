const mongoose = require('mongoose');
const request = require('request');
const User = mongoose.model('User')

const client_id='266386234514516';
const client_secret='6b64169771a96619579ad25aa7e99311';
//Put all pages wihout '/' in the end
const APP_PAGE= 'http://localhost:5500/whonfollow-pages'
const LOGIN_API='https://api.instagram.com/oauth/authorize?client_id='+client_id+'&redirect_uri='+APP_PAGE+'&scope=user_profile,user_media&response_type=code'

const Check = require('./checker')

/*
LONG-TOKEN TEST
IGQVJWZAXJIeUwxbC1ZANk1BTUtYakdlakM0cTVoZAmNRX2xsVXV4QlRHSnFybWFvbHRpcHNhTlhFbkpoSW5hS05oMFQ2cl9BVkJBdldPMkc3NWRvWUJrSVJYU1BhaWZARV3dUU0Vvb3l3
*/

module.exports = {
    async index(req,res){//WILL BE NOT ACESSIBLE
        const { page = 1 } = req.query;
        const users = await User.paginate({},{page, limit: 10});
        return res.json(users);
    },

    async show(req,res){
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        console.log(_TOKEN)
        console.log(_USERID)
        const valid=await Check.user(_TOKEN,_USERID)
        if(valid!=false){
            return res.json(valid)
        }else{
            return res.send('Invalid user token')
        }
    },
    async valid(req,res){
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        console.log(_TOKEN)
        console.log(_USERID)
        const valid=await Check.user(_TOKEN,_USERID)
        if(valid!=false){
            res.redirect(APP_PAGE+'/?id='+_USERID+'&token='+_TOKEN)
            //return res.send('{"valid":true}')
        }else{
            res.redirect(LOGIN_API)
            //return res.send('{"valid":false}')
        }
    },



}