const mongoose = require('mongoose');
//const fetch = require('node-fetch')
const axios = require('axios')
//const getApi = require('./GetApi')
const request = require('request');
const User = mongoose.model('User')

const AUTH_PAGE='https://6338625c.ngrok.io/api/auth'
const REDIRECT_PAGE='http://localhost:5500/whonfollow-pages'
const client_id='266386234514516';
const client_secret='6b64169771a96619579ad25aa7e99311';

const Check = require('./checker')
const Media = require('./usermedia')

/*
LONG-TOKEN TEST
IGQVJWZAXJIeUwxbC1ZANk1BTUtYakdlakM0cTVoZAmNRX2xsVXV4QlRHSnFybWFvbHRpcHNhTlhFbkpoSW5hS05oMFQ2cl9BVkJBdldPMkc3NWRvWUJrSVJYU1BhaWZARV3dUU0Vvb3l3
*/

module.exports = {
    async gettime(req,res){
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        const valid_tokens=await Check.user(_TOKEN,_USERID)
        if(valid_tokens!=false){
            Check.time(_TOKEN,_USERID,30,'info')
        }else{
            return res.status(404).send('Invalid tokens')
        }
        //res.send(valid_tokens)

    },
    async getmedia(req,res){//Get media in the server
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        //return res.send('dsd')
        const _ID= await User.findOne({ 'userid': _USERID }, '_id', async function (err, person) {})
            console.log(_ID);
            const userobj=await User.findById(_ID)
            console.log(userobj);
            //return res.send(userobj.media.posts)
            const getmedia_url='https://graph.instagram.com/me/?fields=media&access_token='+userobj.token+'&after='+req.query.after+'&before='+req.query.before
            request(getmedia_url, async function (error, response, body) {
                const mediaobj=JSON.parse(body)
                return res.send(mediaobj);
            })
    },
    async loadmedia_private(req,res){//NOT WORKING
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        const valid_tokens=await Check.user(_TOKEN,_USERID)
        //Find user to update
        console.log(valid_tokens)
        if(valid_tokens==false){
            return res.status(404).send('Invalid tokens')
        }
        var after=50;
        var end_cursor='';
        var next_page=true;
        //while(next_page){
            var getmedia_url='https://graph.instagram.com/me/?fields=media&access_token='+_TOKEN+'&after='+after+'&before='+end_cursor
            request(getmedia_url, async function (error, response, body) {
                const mediaobj=JSON.parse(body)
                console.log(mediaobj)
                var infomedia_url='https://graph.instagram.com/'+mediaobj.media.data[0].id+'/?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token='+_TOKEN
                async function loadids(){ 
                console.log(infomedia_url)
                request(infomedia_url, async function (error, response, body) {
                    const postobj=JSON.parse(body)
                    //console.log(postobj)
                    return res.send(postobj)
                    var mediajson={
                        "id":543534,
                        "likes":342,
                        "hashtags":"",
                        "desc":""
                    }
                    infomedia_url='https://graph.instagram.com/'+mediaobj.media.data[i].id+'/?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token='+_TOKEN
                    loadids(infomedia_url)
                })
            }

                //return res.send(mediaobj);
            })
        //}
    },
    async loadtags(req,res){
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        const valid_tokens=await Check.user(_TOKEN,_USERID)
        console.log(valid_tokens)
        if(valid_tokens==false){
            return res.status(400).send('Invalid tokens')
        }
        console.log("LOADING TAGS...")
        const _ID= await User.findOne({ 'userid': _USERID }, '_id', async function (err, person) {})
            console.log(_ID);
            const userobj=await User.findById(_ID)
            console.log(userobj);
            var postsobj={
                "media":{
                    "types":{
                        "images":0,
                        "videos":0,
                    },
                    "tags":{
                        "total":0,
                        "person":0,
                        "persons":0,
                        "closeup":0,
                        "outdoor":0,
                        "standing":0,
                        "closeup":0,
                        "mirror":0,
                        "phone":0,
                        "closeup":0,
                        "sunglasses":0,
                        "sky":0,
                        "water":0,
                        "hat":0,
                    },
                },
            }
            var after=50;
            var end_cursor='';
            var next_page=true;
            var posts_url;
            async function loadposts(){
                console.log("while...")
                request(posts_url, async function (error, response, body) {
                    const mediaobj=JSON.parse(body)
                    console.log(mediaobj)
                    //return res.json(mediaobj)
                    var _posts=mediaobj.graphql.user.edge_owner_to_timeline_media.edges;
                    next_page=mediaobj.graphql.user.edge_owner_to_timeline_media.page_info.has_next_page;
                    //end_cursor=body.user.
                    for(var i=0;i<_posts.length;i++){
                        var photo=_posts[i].node;
                        var posttype;
                        var comment_count=0;
                        if(photo.__typename=="GraphImage"){
                            posttype="image"
                            postsobj.media.types.images+=1;
                        }if(photo.__typename=="GraphVideo"){
                            posttype="video"
                            postsobj.media.types.videos+=1;
                        }
                        if(!photo.edge_media_to_comment.comments_disabled){
                            comment_count=photo.edge_media_to_comment.count;
                        }
                        String.prototype.containsWord = function( word ) {
                            var regex = new RegExp( '\\b' + word + '\\b' );
                            return regex.test( this );
                        };
                        userobj.media.count+=1;
                        var ascaption=photo.accessibility_caption
                        if(ascaption!=null){
                            userobj.media.tags.total+=1;
                            if(ascaption.containsWord("1 person" || "one or more people")){
                                userobj.media.tags.person+=1;
                                if(ascaption.containsWord("phone")){tags.push("mirror");userobj.media.tags.mirror+=1;}
                            }if(ascaption.containsWord("people" )){
                                userobj.media.tags.persons+=1;
                                if(ascaption.containsWord("phone")){userobj.media.tags.mirror+=1;}
                            }if(ascaption.containsWord("closeup" )){
                                userobj.media.tags.closeup+=1;
                            }if(ascaption.containsWord("outdoor" )){
                                userobj.media.tags.outdoor+=1;
                            }if(ascaption.containsWord("standing")){
                                userobj.media.tags.standing+=1;
                            }if(ascaption.containsWord("sunglasses")){
                                userobj.media.tags.sunglasses+=1;
                            }if(ascaption.containsWord("sky")){
                                userobj.media.tags.sky+=1;
                            }if(ascaption.containsWord("water")){
                                userobj.media.tags.water+=1;
                            }if(ascaption.containsWord("hat")){
                                userobj.media.tags.hat+=1;
                            }
                        }
                    }
                    if(next_page==true){
                        //console.log(postsobj.count)
                        loadposts('https://www.instagram.com/'+_USERNAME+'/?__a=1&after='+after+'&before='+end_cursor+'&hl=en')
                    }else{
                        console.log("AAA:"+_ID)
                        const user_info_update = await User.findByIdAndUpdate(_ID, userobj, { new: true });
                        console.log('[+] UPDATED ON SERVER')
                        return res.json(user_info_update/*'{"update":true,"updates":[],"time":4354}'*/)
                    }
                });
            }
    const _USERNAME= userobj.username
    console.log('USERNAME: '+_USERNAME)
    posts_url='https://www.instagram.com/'+_USERNAME+'/?__a=1&after='+after+'&hl=en'
    console.log(posts_url)
    loadposts(posts_url)
    },
    async loadmedia(req,res){
        //var _USERNAME='fail';
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        const valid_tokens=await Check.user(_TOKEN,_USERID)
        //Find user to update
        console.log(valid_tokens)
        if(valid_tokens==false){
            return res.status(400).send('Invalid tokens')
        }
        console.log("LOADING MEDIA...")
        const _ID= await User.findOne({ 'userid': _USERID }, '_id', async function (err, person) {})
            console.log(_ID);
            const userobj=await User.findById(_ID)
            console.log(userobj);
            var postsobj={
                "media":{
                    "count": 0,
                    "last_update":new Date(),
                    "types":{
                        "images":0,
                        "videos":0,
                    },
                    "tags":{
                        "total":0,
                        "last_update":new Date(),
                        "person":0,
                        "persons":0,
                        "closeup":0,
                        "outdoor":0,
                        "standing":0,
                        "closeup":0,
                        "mirror":0,
                        "phone":0,
                        "closeup":0,
                        "sunglasses":0,
                        "sky":0,
                        "water":0,
                        "hat":0,
                    },
                    "posts":[]
                },
            }
            var after=50;
            var end_cursor='';
            var next_page=true;
            var posts_url;
            //const getinfo_url='https://graph.instagram.com/me/?fields=id,username,media_count,account_type&access_token='+_TOKEN
            /*request(getinfo_url, async function (error, response, body) {
                const infoobj=JSON.parse(body)
                _USERNAME= infoobj.username
                console.log('USERNAME: '+_USERNAME)
                posts_url='https://www.instagram.com/'+_USERNAME+'/?__a=1&after='+after+'&hl=en'
                console.log(posts_url)
                return loadposts(posts_url)
            })*/

            async function loadposts(){
                console.log("while...")
                request(posts_url, async function (error, response, body) {
                    const mediaobj=JSON.parse(body)
                    console.log(mediaobj)
                    //return res.json(mediaobj)
                    var _posts=mediaobj.graphql.user.edge_owner_to_timeline_media.edges;
                    next_page=mediaobj.graphql.user.edge_owner_to_timeline_media.page_info.has_next_page;
                    //end_cursor=body.user.
                    for(var i=0;i<_posts.length;i++){
                        var photo=_posts[i].node;
                        var posttype;
                        var comment_count=0;
                        if(photo.__typename=="GraphImage"){
                            posttype="image"
                            postsobj.media.types.images+=1;
                        }if(photo.__typename=="GraphVideo"){
                            posttype="video"
                            postsobj.media.types.videos+=1;
                        }
                        if(!photo.edge_media_to_comment.comments_disabled){
                            comment_count=photo.edge_media_to_comment.count;
                        }
                        String.prototype.containsWord = function( word ) {
                            var regex = new RegExp( '\\b' + word + '\\b' );
                            return regex.test( this );
                        };
                        postsobj.media.count+=1;
                        var tags=[];
                        var ascaption=photo.accessibility_caption
                        if(ascaption!=null){
                            postsobj.media.tags.total+=1;
                            if(ascaption.containsWord("1 person" || "one or more people")){
                                tags.push("person")
                                postsobj.media.tags.person+=1;
                                if(ascaption.containsWord("phone")){tags.push("mirror");postsobj.media.tags.mirror+=1;}
                            }if(ascaption.containsWord("people" )){
                                tags.push("peopless")
                                postsobj.media.tags.persons+=1;
                                if(ascaption.containsWord("phone")){tags.push("mirror");postsobj.media.tags.mirror+=1;}
                            }if(ascaption.containsWord("closeup" )){
                                tags.push("closeup")
                                postsobj.media.tags.closeup+=1;
                            }if(ascaption.containsWord("outdoor" )){
                                tags.push("outdoor")
                                postsobj.media.tags.outdoor+=1;
                            }if(ascaption.containsWord("standing")){
                                tags.push("standing")
                                postsobj.media.tags.standing+=1;
                            }if(ascaption.containsWord("sunglasses")){
                                tags.push("sunglasses")
                                postsobj.media.tags.sunglasses+=1;
                            }if(ascaption.containsWord("sky")){
                                tags.push("sky")
                                postsobj.media.tags.sky+=1;
                            }if(ascaption.containsWord("water")){
                                tags.push("water")
                                postsobj.media.tags.water+=1;
                            }if(ascaption.containsWord("hat")){
                                tags.push("hat")
                                postsobj.media.tags.hat+=1;
                            }
                        }
                        var photobj={
                            "id":photo.id,
                            "type":posttype,
                            "shortcode":photo.shortcode,
                            "img_url":photo.display_url,
                            "thumb_url":photo.thumbnail_src,
                            "likes":photo.edge_liked_by.count,
                            "comments":comment_count,
                            /*"hashtags":"",
                            "desc":"",*/
                            "tags":tags,
                        }
                        console.log(photobj)
                        postsobj.media.posts.push(photobj)
                    }
                    if(next_page==true){
                        console.log(postsobj.count)
                        loadposts('https://www.instagram.com/'+_USERNAME+'/?__a=1&after='+after+'&before='+end_cursor+'&hl=en')
                    }else{
                        console.log("AAA:"+_ID)
                        const user_info_update = await User.findByIdAndUpdate(_ID, postsobj, { new: true });
                        console.log('[+] UPDATED ON SERVER')
                        return res.json(user_info_update.media/*'{"update":true,"updates":[],"time":4354}'*/)
                    }
                });
            }
    const _USERNAME= userobj.username
    console.log('USERNAME: '+_USERNAME)
    posts_url='https://www.instagram.com/'+_USERNAME+'/?__a=1&after='+after+'&hl=en'
    console.log(posts_url)
    loadposts(posts_url)
    },
    async loadinfo(req,res){
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        const valid_tokens=await Check.user(_TOKEN,_USERID)
        //Find user to update
        console.log(valid_tokens)
        if(valid_tokens==false){
            return res.status(400).send('Invalid tokens')
        }
        const _ID=await User.findOne({ 'userid': _USERID }, '_id', async function (err, person) {});
        if(_ID==null){
            return res.status(404).send('Invalid tokens')
        }
            console.log(_ID);
            const userobj=await User.findById(_ID)
            console.log(userobj);

            const _UPDATE=true;
            const getinfo_url='https://graph.instagram.com/me/?fields=id,username,media_count,account_type&access_token='+_TOKEN
            request(getinfo_url, async function (error, response, body) {
                const infoobj=JSON.parse(body)
                const _USERNAME=infoobj.username
                console.log("LOADING INFO...")
                var getfollows_url='https://www.instagram.com/'+_USERNAME+'?__a=1'
                console.log(getfollows_url)
                const options = {
                    url: getfollows_url,
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                };
                //Second option if the first url not work
                //getfollows_url='https://www.instagram.com/web/search/topsearch/?context=blended&query='+infoobj.username
                request(options, async function (error, response, body) {
                    const user_info=JSON.parse(body);
                    //console.log(user_info)
                    var thisdate=new Date()
                    var json_data={
                        "username":user_info.graphql.user.username,
                        "full_name":user_info.graphql.user.full_name,
                        "picture_hd":user_info.graphql.user.profile_pic_url_hd,
                        "picture":user_info.graphql.user.profile_pic_url,
                        "private":user_info.graphql.user.is_private,
                        "followers":user_info.graphql.user.edge_followed_by.count,
                        "following":user_info.graphql.user.edge_follow.count,
                        "last_update":new Date(),
                    }
                    const user_info_update = await User.findByIdAndUpdate(_ID, json_data, { new: true });
                    return res.json(json_data)
                })
            });
    },
    async auth(req,res){//WILL BE CALLED BEFORE INSTAGRAM LOGIN API
        const {code} = req.query;
        const api_url = 'https://api.instagram.com/oauth/access_token'
        const body='client_id='+client_id+';client_secret='+client_secret+';grant_type=authorization_code;redirect_uri='+AUTH_PAGE+';code='+code
        var getuser_id;
        request.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url: api_url,
                body: body
            }, async function(error, response, body){
                const objbody=JSON.parse(body)
                const getusername_url='https://graph.instagram.com/me/?fields=id,username,media_count,account_type&access_token='+objbody.access_token
                console.log(objbody.access_token)
                request(getusername_url, async function (error, response, body) {
                    const infoobj=JSON.parse(body)
                    console.log(infoobj)
                    const userid=infoobj.id
                    getuser_id=await User.findOne({ 'userid': userid }, '_id', async function (err, person) {});
                    if(getuser_id!=null){
                        const _USER=await User.findById(getuser_id)
                        if(_USER.token!=undefined){
                            var thisdate=new Date(Date.now())
                            const last_update=new Date(_USER.expire_token)
                            console.log(last_update)
                            console.log(thisdate)
                            /*var diffMs = (thisdate - last_update); // milliseconds between now & Christmas
                            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                            console.log(diffMins)*/
                            console.log(_USER.token)
                            console.log(last_update.getHours() +" / "+thisdate.getHours()+" hours")
                            console.log(last_update.getDate() +" / "+thisdate.getDate()+" days")
                            console.log(last_update.getMonth()+1 +" / "+(thisdate.getMonth()+1)+" months")
                            console.log(last_update.getFullYear() +" / "+thisdate.getFullYear()+" year")
                            if(last_update>thisdate){
                                //return res.send(_USER.token);
                                console.log('Using old token...')
                                //return res.redirect("/api/load/info/"+objbody.user_id+"/?token="+_USER.token)
                                
                                //res.cookie('some_cross_domain_cookie', 'http://mysubdomain.example.com', { domain: 'localhost' })
                                //res.cookie('userid', objbody.user_id, { domain: 'localhost' })
                                //res.cookie('token', _USER.token, { domain: 'localhost' })
                                return res.redirect("http://192.168.25.11:3000/auth/?userid="+objbody.user_id+"&token="+_USER.token)
                            }else{
                                console.log('The token is expired...')
                                get_longtoken()
                            }
                        }
                    }else{
                        get_longtoken()
                    }
                })
                async function get_longtoken(){
                    const longtoken_url='https://graph.instagram.com/access_token/?grant_type=ig_exchange_token&client_secret='+client_secret+'&access_token='+objbody.access_token
                    request(longtoken_url, async function (error, response, body) {
                        const longtoken=JSON.parse(body)
                        var date=new Date(Date.now())
                        var newDate = new Date(date.getTime() + (1000 * longtoken.expires_in))
                        const redirect_url="http://192.168.25.11:3000/auth/?userid="+objbody.user_id+"&token="+longtoken.access_token
                        if(getuser_id==null){
                            const getusername_url='https://graph.instagram.com/me/?fields=id,username,media_count,account_type&access_token='+longtoken.access_token
                            request(getusername_url, async function (error, response, body) {
                                const userobj=JSON.parse(body)
                                const _USERNAME=userobj.username
                                console.log("GETTING USERNAME...")
                                const getshortid_url='https://www.instagram.com/'+_USERNAME+'?__a=1'
                                console.log(getshortid_url)
                                request(getshortid_url, async function (error, response, body) {
                                    const userobj2=JSON.parse(body)
                                    const user = await User.create({userid:objbody.user_id,shortid:userobj2.graphql.user.id,token:longtoken.access_token,expire_token: new Date(newDate.toISOString())});
                                    console.log(user)
                                    //res.cookie('userid', objbody.user_id)
                                    //res.cookie('token', longtoken.access_token)
                                    return res.redirect(redirect_url)
                                });
                            });
                            //const user = await User.create({userid:objbody.user_id,token:longtoken.access_token,expire_token: new Date(newDate.toISOString())});
                            //console.log(user)
                        }else{
                            const user = await User.findByIdAndUpdate(getuser_id,{userid:objbody.user_id,token:longtoken.access_token,expire_token: new Date(newDate.toISOString())});
                            console.log(user)
                            //res.cookie('userid', objbody.user_id)
                            //res.cookie('token', longtoken.access_token)
                            return res.redirect(redirect_url)
                        }
                        //return res.redirect(REDIRECT_PAGE+'/?id='+objbody.user_id+'&token='+longtoken.access_token)
                    })
            }
        });
    },
}