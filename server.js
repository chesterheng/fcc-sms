'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
require('./models/Link');

const app = express();

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI);


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

require('./routes/apiRoutes')(app);

// Basic Configuration 
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Node.js listening ...');
});