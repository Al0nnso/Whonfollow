const mongoose= require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const UserSchema = new mongoose.Schema({
    media:{
        count:{type: Number},
        types:{
            images:{type:Number},
            videos:{type:Number},
        },
        tags:{
            total:{type:Number},
            last_update:{type:Date},
            person:{type:Number},
            persons:{type:Number},
            closeup:{type:Number},
            outdoor:{type:Number},
            standing:{type:Number},
            closeup:{type:Number},
            mirror:{type:Number},
            phone:{type:Number},
            closeup:{type:Number},
            sunglasses:{type:Number},
            sky:{type:Number},
            water:{type:Number},
            hat:{type:Number},
        },
        posts:{
            type: Array,
        },
        last_update: {
            type: Date,
        }
    },picture_hd: {
        type: String
    },picture: {
        type: String
    }
    ,userid: {
        type: Number,
        required: true
    },shortid: {
        type: Number,
        required: true
    },username: {
        type: String,
        required: false
    },private: {
        type: Boolean,
        required: false
    },full_name: {
        type: String,
        required: false
    },token: {
        type: String,
        required: true
    },followers: {
        type: Number,
        required: false
    },following: {
        type: Number,
        required: false
    },followers_list: {
        type: Array,
        required: false
    },infoupdate:{
        type: Date,
        required: false
    },unfollowers: {
        data:{
            type: Array,
            required: false
        },last_update:{
            type: Date,
            required: false
        }
    },expire_token:{
        type: Date,
        required: false
    },createdAt:{
        type: Date,
        default: Date.now,
    },last_update: {
        type: Date,
        required: false
    }
})

UserSchema.plugin(mongoosePaginate);

mongoose.model('User',UserSchema);