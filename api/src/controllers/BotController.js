const request = require('request');
const mongoose = require('mongoose');
const Instagram = require('instagram-web-api')
const client = new Instagram({ username: 'whonfollow', password: '8infinite' }, { language: 'es-CL' })

const User = mongoose.model('User')
const Check = require('./checker')

module.exports = {
    async loadfollowers(req,res){
        const _TOKEN = req.query.token;
        const _USERID = req.params.id;
        const valid_tokens=await Check.user(_TOKEN,_USERID)
        console.log(valid_tokens.unfollowers.last_update)
        if(valid_tokens==false){
            return res.send('Invalid tokens')
        }else if(valid_tokens.unfollowers.last_update!=undefined){
            var last_update=new Date(valid_tokens.last_update)
            var this_update=new Date()
            var last_expire = new Date(last_update.getTime() + (1000 * (/*HOURS*/1*(60*60))))
            console.log(this_update.getHours()+' - '+last_update.getHours())
            console.log(last_expire)
            if(last_expire>this_update){
                return res.send(valid_tokens.unfollowers)
            }
        }
        console.log(valid_tokens)
        console.log('LOADING FOLLOWERS...')
        //await client.login(/*{ username: 'whonfollow', password: '8infinite' }*/)
        try{
            await client.login()
          } catch(err) {
            if (err.error && err.error.message === 'checkpoint_required') {
              const challengeUrl = err.error.checkpoint_url
              await client.updateChallenge({ challengeUrl, choice: 1  })
            }
          }
        console.log('LOGIN...')
        var end_cursor='';
        var next=true;
        var count;
        var _userlist=[]
        var _maincounter=0;
        console.log(_USERID)
        loadbot()
        async function loadbot(){
            var followers = await client.getFollowers({ userId: valid_tokens.shortid/*String(_USERID)*/, first: 50, after: end_cursor})
            //console.log(followers)
            console.log(followers)
            end_cursor=followers.page_info.end_cursor
            next=followers.page_info.has_next_page
            //_data=followers
            count=followers.count

            for (i = 0; i < 50; i++) {
                if(followers.data[i]!=undefined){
                    _userlist.push(followers.data[i].username);
                    _maincounter++;
                }
            }
            console.log(_maincounter)
            //console.log(_filename)
            //console.log(followers)
            if(next==true){
                await setTimeout(loadbot, 1200/*2000*/);
            }else{
                console.log("FINISH...")
                //console.log(_userlist)
                console.log(_userlist)
                console.log(valid_tokens.unfollowers.data.length)
                if(valid_tokens.followers_list.length!=0){
                    async function analyze(a1,a2){
                        console.log('A1: '+a1)
                        console.log('A2: '+a2)
                        //return this.filter(function(i) {return a.indexOf(i) < 0;});
                        var earned=a2.filter(x => a1.indexOf(x) === -1);
                        var lost=a1.filter(x => a2.indexOf(x) === -1);
                        //var ISOdate=ISODateString(d)
                        //console.log(ISOdate);
                        var diff={"date": new Date(),"total":(earned.length-lost.length),"earned":{"count":earned.length,"edges":earned},"lost":{"count":lost.length,"edges":lost}}
                        //console.log(diff)
                        return diff;
                    }
                    var unfollow_list=valid_tokens.unfollowers.data
                    var unfollowers_dif=await analyze(valid_tokens.followers_list,_userlist)
                    unfollow_list.push(unfollowers_dif)
                    //console.log(valid_tokens.unfollowers.last_update)
                    const UnfollowersList=await User.findByIdAndUpdate(valid_tokens._id,{"unfollowers":{"data":unfollow_list,"last_update":new Date()}})
                    console.log(UnfollowersList)
                }
                const FollowersList=await User.findByIdAndUpdate(valid_tokens._id,{"followers_list":_userlist,"last_update":new Date()})
                return res.send(FollowersList.unfollowers)//Initializate this in the first time
            }
        }
    }
}