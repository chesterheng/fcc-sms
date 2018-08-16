const mongoose = require('mongoose');
const dns = require('dns');
const Link = mongoose.model('links');
const re = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

module.exports = app => {
  app.post("/api/shorturl/new", async (req, res) => {
    //console.log(req.body);
    
    // invalid URL, error: invalid URL
    if(!re.test(req.body.url)) {
      return res.json({ "error": "invalid URL" });
    }
      
    // original_url is saved before?
    const existingLink = await Link.findOne({ original_url: req.body.url });
    if(existingLink) {
      return res.json({ original_url: existingLink.original_url, short_url: existingLink.short_url });
    }
    
    // generate short_url and save original_url and short_url
    const query = Link.find({}).sort({ short_url : -1 }).limit(1);
    await query.exec(async (err, member) => {
      console.log([err, member]);
      const max_short_url = member[0] ? member[0].short_url + 1 : 1;
      console.log(max_short_url);
      await new Link({ original_url: req.body.url, short_url: max_short_url }).save();
      res.json({ "original_url": req.body.url, "short_url": max_short_url });   
    });
  });
  
  app.get("/api/shorturl/:short_url", async (req, res) => {
  
    // No short url found for given input
    const short_url = req.params.short_url;
    if(isNaN(short_url)) {
      return res.json({ "error": "Wrong Format" });
    }
  
    // find existing link based on short_url
    const existingLink = await Link.findOne({ short_url: short_url });
    if(!existingLink) {
      return res.json({ "error": "No short url found for given input" });
    }
  
    // redirect to original url
    res.redirect(existingLink.original_url);

  });

};