const mongoose = require('mongoose');
const User = mongoose.model('User')
const request = require('request');

module.exports = {
    async loadmedia(_TOKEN,_USERID){
            //var _USERNAME='fail';
            //const _TOKEN = req.query.token;
            //const _USERID = req.params.id;
            console.log("LOADING MEDIA...")
            const _ID= await User.findOne({ 'userid': _USERID }, '_id', async function (err, person) {})
                console.log(_ID);
                const userobj=await User.findById(_ID)
                console.log(userobj);
                var postsobj={
                    "media":{
                        "count": 0,
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
                            return user_info_update//return res.json(user_info_update/*'{"update":true,"updates":[],"time":4354}'*/)
                        }
                    });
                }
        const _USERNAME= userobj.username
        console.log('USERNAME: '+_USERNAME)
        posts_url='https://www.instagram.com/'+_USERNAME+'/?__a=1&after='+after+'&hl=en'
        console.log(posts_url)
        return await loadposts(posts_url)
    }
}