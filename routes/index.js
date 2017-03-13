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

// Get project and user data
function getProject(userEmail, userPassword, projectId) {
  db.ref().once('value').then(function (snapshot) {
    if (!snapshot.val()[projectId]) {
      db.ref(projectId).set({
        users: {
          
        }
      });
    }
    else {

    }
  });

  /*
  rootRef('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageUrl
  });
  */
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CollabIDE' });
});

router.post('/login', function (req, res, next) {
  getProject(req.body.email, req.body.password, req.body.project);
  res.redirect('/project/' + req.body.project);
});

module.exports = router;
