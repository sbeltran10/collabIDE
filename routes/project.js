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
function getProject(sessionUser, res, projectId) {
  var rulesArray = [];
  db.ref(projectId + "/users").once('value').then(function (snapshot) {
    var developers = snapshot.val();
    for (var property in developers) {
      if (developers.hasOwnProperty(property)) {
        var rule = ".firepad-username-" + property + " { background-color:" + developers[property].highlightColor + "}";
        rulesArray.push(rule);
      }
    }
    res.render("project", {
      loggedUser: {
        color: sessionUser.color,
        username: sessionUser.name,
        rules:rulesArray
      }
    });
  });
}


router.get('/:id', function (req, res, next) {
  var sessionUser = req.session.user;
  getProject(sessionUser, res, req.params.id);
});

module.exports = router;
