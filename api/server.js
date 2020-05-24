const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir')
const cors= require('cors')
//const fs = require('fs');
const app = express();
//app.use(cors());
app.use(cors(/*{ credentials: true, origin: 'http://192.168.25.11:3000' }*/));
app.use(express.json())

//Starting DB
mongoose.connect('mongodb://localhost:27017/instapi',{ useNewUrlParser:true,useUnifiedTopology:true})
requireDir('./src/models/');

//const User = mongoose.model('User')

//Routes
app.use('/api',require('./src/routes'))

app.listen(3009)