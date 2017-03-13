var express = require('express');
var router = express.Router();
var firebase = require('firebase');

// Firebase init
/*
var config = {
  apiKey: "AIzaSyBNqso86bEnzBIzRx4RNQ-3Ww2qNqL_xJA",
  authDomain: "collabide-c9fb9.firebaseapp.com",
  databaseURL: "https://collabide-c9fb9.firebaseio.com/"
};
firebase.initializeApp(config);
*/
var db = firebase.database();

// Get project and user data
function getProject(userEmail, userPassword, projectId) {
}


/* GET users listing. */
router.get('/:id', function (req, res, next) {
  var sessionUser = req.session.user;
  res.render("project", {
    loggedUser: {
      color: sessionUser.color,
      username: sessionUser.name
    }
  });
});

module.exports = router;
