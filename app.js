const express = require('express');
const path = require('path');
var fs = require('fs')
var https = require('https')
const app = express();

const dotenv = require('dotenv/config');

app.set('view engine', 'pug')

app.use('/scripts', express.static(path.join(__dirname, '/scripts')), );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { auth, requiresAuth } = require('express-openid-connect'); 
const port = process.env.PORT || 4041;

const config = { 
  authRequired : false,
  idpLogout : true, //login not only from the app, but also from identity provider
  secret: process.env.SECRET,
  baseURL: process.env.APP_URL || `https://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://dev-mak4h80l.us.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code' ,
    //scope: "openid profile email"   
   },
};
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

let users = [];

app.get('/', function (req, res) {
  
    req.user = {
        isAuthenticated : req.oidc.isAuthenticated()
    };
    if (req.user.isAuthenticated) {
        req.user.name = req.oidc.user.name;
        
    }

    res.render('index', {user : req.user});
});


app.get("/sign-up", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {      
      screen_hint: "signup",
    },
  });
});

app.post("/location", (req, res) => {
  let longitude = req.body.longitude;
  let latitude = req.body.latitude;
  let username = req.body.username;

  let user = {
    name: username,
    timestamp: new Date().toLocaleString(),
    location: { latitude: latitude, longitude: longitude }
  }

  userExists = false;
  for(let i = 0; i < users.length; i++){
    if(users[i].name === user.name) userExists = true; 
  }   
  
  if(!userExists) {
    if(users.length == 5) users.shift();
    users.push(user);
  }

});

app.get("/user_locations", requiresAuth(), (req, res) => {
    res.status(200).send({users});
});

  
if(process.env.PORT){
  app.listen(process.env.PORT)
} else {
  https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, function () {
    console.log(`Server running at https://localhost:${port}/`);
  });
}
