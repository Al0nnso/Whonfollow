const express = require('express')
const mongoose = require('mongoose');
const routes = express.Router();

//const UserController = require('./controllers/UserController')
const UserController = require('./controllers/GetController')
const ApiController = require('./controllers/ApiController')
const BotController = require('./controllers/BotController')

/*const User = mongoose.model('User')
User.create({userid:53543,unfollowers:[53543,53543]})*/

//[DEV] Get all users
routes.get("/users",UserController.index)

//Get info of a specific user [TOKEN]
routes.get("/users/:id",UserController.show)

//Redirected after instagram login api
routes.get("/auth",ApiController.auth)

//Redirected after instagram login api
routes.get("/validate/:id",UserController.valid)

//Update user information [TOKEN] TARGETS[info,media]
//routes.get("/users/load/:id",ApiController.updateinfo)

//Update info with API (time delay)
//routes.get("/time/:id",ApiController.updateinfo)

//Load and update information
//routes.get("/update/:id",ApiController.getinfo)

//[DEV] Get media
routes.get("/get/media/:id",ApiController.getmedia)
//Load media
routes.get("/load/media/:id",ApiController.loadmedia)
//Load media for private accounts (wihout _a=1 functions)
routes.get("/private/load/media/:id",ApiController.loadmedia_private)
//LoadTags
routes.get("/load/tags/:id",ApiController.loadtags)

//Load information
routes.get("/load/info/:id",ApiController.loadinfo)

//Load followers with the BOT
routes.get("/load/followers/:id",BotController.loadfollowers)

//Media
//routes.get("/users/media/:userid",ApiController.getmedia)

/*
routes.get("/login",UserController.login);
routes.put("/users/:id",UserController.update)
routes.delete("/users/:id",UserController.destroy)
routes.get("/users/media/:userid",UserController.getmedia)
routes.get("/users/info/:userid",UserController.getinfo)
routes.get("/auth/token/:userid",UserController.getinfo)
*/

module.exports = routes;