var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var bcrypt = require('bcrypt');
const saltRounds = 10;

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
};

// Pool of colors
var colorPool = {
  green: '#2BCE48',
  blue: '#0075DC',
  mallow: '#C20088',
  orpiment: '#FFA405',
  turquoise: '#00998F',
  yellow: '#FFFF00',
  caramel: '#993F00',
  lime: '#9DCC00'
};

// Pick a random color from the remaining colors in the pool
function pickRandomColor(obj) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object)
    return 'empty';
  var result;
  var count = 0;
  for (var prop in obj)
    if (Math.random() < 1 / ++count)
      result = prop;
  return result;
}

function getAssignedColor(projectId, snapshot) {
  var colorName = pickRandomColor(snapshot.val().colorsPool);
  if (colorName !== 'empty') {
    db.ref(projectId + '/colorsPool').child(colorName).remove();
    return colorPool[colorName];;
  }
  else {
    return colorName
  }
}

function newUserExistingProject(res, req, projectId, loggedUser) {
  db.ref(projectId).once('value').then(function (snapshot) {
    var color = getAssignedColor(projectId, snapshot);
    bcrypt.hash(loggedUser.password, saltRounds, function (err, hash) {
      db.ref(projectId + "/users/" + loggedUser.name).set({
        highlightColor: color,
        password: hash,
        active: true,
        online: true
      }).then(function () {
        loggedUser.color = color;
        req.session.user = loggedUser;
        res.redirect('/project/' + projectId);
      });
    });
  });
}

// Get project and user data
function getProject(res, req, userName, userPassword, projectId) {
  //var color = randCol();
  var loggedUser = {
    name: userName,
    password: userPassword
  }
  db.ref().once('value').then(function (snapshot) {
    // Project doesnt exists
    if (!snapshot.val()[projectId]) {
      db.ref(projectId).set({
        edition: 'contribution',
        colorsPool: colorPool
      }).then(newUserExistingProject(res, req, projectId, loggedUser));
    }
    else {
      db.ref(projectId + "/users").once('value').then(function (snapshot) {
        if (!snapshot.val()[userName]) {
          // New user
          newUserExistingProject(res, req, projectId, loggedUser)
        }
        else {
          // User exists, check password
          bcrypt.compare(userPassword, snapshot.val()[userName].password, function (err, compareResult) {
            if (compareResult) {
              loggedUser.color = snapshot.val()[userName].highlightColor;
              req.session.user = loggedUser;
              res.redirect('/project/' + projectId);
            }
            else{
              res.render('index', { title: 'CollabIDE', validationFailed:true });
            }
          });
        }
      });
    }
  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { data: {name:'CollabIDE' }});
});

// Login
router.post('/login', function (req, res, next) {
  getProject(res, req, req.body.username.toLowerCase(), req.body.password, req.body.project.toLowerCase());
});


module.exports = router;
