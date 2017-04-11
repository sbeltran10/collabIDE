var express = require('express');
var router = express.Router();

var firebase = require('firebase');

// Firebase init
var config = {
  apiKey: "AIzaSyBNqso86bEnzBIzRx4RNQ-3Ww2qNqL_xJA",
  authDomain: "collabide-c9fb9.firebaseapp.com",
  databaseURL: "https://collabide-c9fb9.firebaseio.com/"
};
firebase.initializeApp(config);
var db = firebase.database();

// Random color
var randCol = function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Get project and user data
function getProject(res, req, userName, userPassword, projectId) {
  var color = randCol();
  var loggedUser = {
    name: userName,
    color: color,
    password: userPassword
  }
  db.ref().once('value').then(function (snapshot) {
    if (!snapshot.val()[projectId]) {
      db.ref(projectId + "/users/" + userName).set({
        highlightColor: color,
        password: userPassword,
        active: true,
        online: true
      });
      req.session.user = loggedUser;
      res.redirect('/project/' + projectId);
    }
    else {
      db.ref(projectId + "/users").once('value').then(function (snapshot) {
        if (!snapshot.val()[userName]) {
          // Usuario nuevo
          db.ref(projectId + "/users/" + userName).set({
            highlightColor: color,
            password: userPassword,
            active: true,
            online: true
          });
          req.session.user = loggedUser;
          res.redirect('/project/' + projectId);
        }
        else {
          // Usuario ya existe, hacer comprobacion de contrasena
          // Paso comprobacion
          req.session.user = loggedUser;
          res.redirect('/project/' + projectId);
        }
      });
    }
  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CollabIDE' });
});

// Login
router.post('/login', function (req, res, next) {
  getProject(res, req, req.body.username.toLowerCase(), req.body.password, req.body.project.toLowerCase());
});

module.exports = router;
