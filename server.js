'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

// Database Configuration
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true });

let siteSchema = new mongoose.Schema({
  originalURL: String,
  shortURL: Number
});

let Site = mongoose.model("Site", siteSchema)

app.use(cors());

// Mounting the body-parser
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// API endpoint
app.post("/api/shorturl/new", function (req, res) {
  // Protocol is not important for dns lookup
  const url  = req.body.url;
  const host = url.replace(/^https?:\/\//, '');
  
  const format = /^https?:\/\/.+\..+/;
  
  // Check if URL is valid
  // and follows the http(s)://(www.)example.com(/more/routes) format
  dns.lookup( host, (error, hostname, service) => {
    if (error || !format.test(url)){ return res.json({"error":"invalid URL"}) }
   
    // Check if website exists in the database
    Site.findOne({originalURL: url}, function(error, doc) {
      if(error){ return res.send('Error accessing database') }
      
      // if so, find unique shortURL id and return it
      try {
        return res.json({ original_url: url, short_url: doc.shortURL});
      } catch (err){  
      // else create new shortURL and enter it to the database
        Site.countDocuments({}, function(error, count) {
          if(error){ return res.send('Error accessing database') }
          // New element's ID is the same as counter because the IDs are zero-indexed
          const newSite = new Site({ originalURL: url, shortURL: count });

          newSite.save(error => {
            if (error) { return res.send('Error saving to database') }
            return res.json({ original_url: url, short_url: count });
          });   
        });
      }    
    });
  });
});

app.get("/api/shorturl/:number", function (req, res) {
  let number = req.params.number; 
  Site.findOne({shortURL: number }, function(error, doc) {
      if(error){ return res.send('Error accessing database') }
      return res.redirect(doc.originalURL);
  })
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
