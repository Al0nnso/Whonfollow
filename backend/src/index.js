const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir')
const cors= require('cors')
require('dotenv').config()
//const fs = require('fs');
const app = express();
//app.use(cors());
app.use(cors(/*{ credentials: true, origin: 'http://192.168.25.11:3000' }*/));
app.use(express.json())

//Starting DB
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser:true,useUnifiedTopology:true})
requireDir('./models/');

//const User = mongoose.model('User')

//Routes
app.use('/api',require('./routes'))

app.listen(process.env.PORT || 3009)