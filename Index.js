const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

//Initializing running port of the server
const PORT = 4000;

let accessToken = null;

//Applying middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Getting static assets
app.use(express.static('public'));

//Starting the server
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

//Getting the root (login page)
app.get('/', (req, res) => {
  res.sendFile('public/html/index.html', {root: __dirname});
});

//Redirecting response
app.get('/myprofile_redirect', (req, res) => {
  res.sendFile('/public/html/myProfileRedirect.html', {root: __dirname})
})

//Getting the home page
app.get('/home', (req, res) => {
  res.sendFile('/public/html/home.html', {root: __dirname})
})

//Getting the access token
app.post('/access-token', (req, res) => {
  axios({
    method: 'post',
    url: 'https://api.instagram.com/oauth/access_token',
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: `grant_type=authorization_code&code=${req.body.code}&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fmyprofile_redirect&client_id=2f5fb7d1345341f19c2eb07280006c67&client_secret=8477b83ea4124a4aa7f1271a085d98eb`,
  })
  .then(response => {
    accessToken = response.data.access_token;
    res.json({ success: true });
  })
  .catch(error => {
    console.log(error);
  });
})

//Getting the resources (profile details)
app.get('/get-profile', (req, res) =>{
  axios({
    method: 'get',
    url: `https://api.instagram.com/v1/users/self/?access_token=${accessToken}`,
  })
  .then(response => {
    return res.json(response.data.data);
  })
  .catch(error => {
    console.log('Error occured while getting profile info ' + error);
  });
})