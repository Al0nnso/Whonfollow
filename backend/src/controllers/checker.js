const mongoose = require('mongoose');
const User = mongoose.model('User')

module.exports = {
    async user(_TOKEN,_USERID){
        if(!(/^\d+$/.test(_USERID))){
            return false;
        }
        var getuser=await User.findOne({ 'userid': _USERID }, '_id', async function (err, person) {});
        async function validate(person){
            if(person==null) return false//return res.send('Invalid USERID')//Dedirect to login page
            console.log(person._id);
            const _USER=await User.findById(person._id)
            if(_USER.token!=_TOKEN) return false//return res.send('Invalid TOKEN')//Dedirect to login page
            console.log(_TOKEN);
            return _USER;
            //return res.send('[+] Sucefull AUTH')
        }
        return validate(getuser);
    },async time(_TOKEN,_USERID,_TIME,_FUNC){
        const userobj= await this.user(_TOKEN,_USERID);
        var update;
        switch(_FUNC){
            case 'info':
                update=userobj.info_update;
                break
            case 'media':
                update=userobj.media_update;
                break
            case 'unfollow':
                update=userobj.unfollow_update;
                break
            default:
                return false;
        }
        if(update!=undefined){
            var thisdate=new Date(Date.now())
            const last_update=new Date(userobj.infoupdate)
            var diffMs = (thisdate - last_update); // milliseconds between now & Christmas
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            console.log(diffMins)
            if(last_update.getHours()>=thisdate.getHours()){
                return true;
            }
        }else{
            return true;
        }
        return false;
    }
}