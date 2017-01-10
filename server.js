var http = require('http');
var express = require('express');
var app = express();
app.use(express.static(__dirname));
require('dotenv').config();


app.get('/authorize_user', function(req, res) {
  ig.use({ client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET});
  res.redirect(ig.get_authorization_url(redirect_uri));
});

app.get('/handleauth', function(req, res) {
  ig.use({ client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET});

  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      req.session.authorised_user = result;
      res.redirect('/');
    }
  });
});

app.get('/accesstoken', function(req, res){
  if(req.session.authorised_user == null){
    res.send(false);
  }else{
    res.send(true);
  }
});

app.get('/posts', function(req, res){
  ig.use({ client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      access_token: req.session.authorised_user.access_token});

  ig.user_media_recent(req.session.authorised_user.user.id, 8, function(err, medias, pagination, remaining, limit) {
    if (err){
      console.log(err.body);
      return "Could not get user";
    }else {
      console.log('user successfully fetched', medias);
      res.send(medias);
    }
  });

});

app.listen(8080);