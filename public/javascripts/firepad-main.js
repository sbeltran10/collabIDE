var proID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
var styleSheet = document.styleSheets[document.styleSheets.length - 1];

function init() {
    //// Initialize Firebase.
    var config = {
        apiKey: "AIzaSyBNqso86bEnzBIzRx4RNQ-3Ww2qNqL_xJA",
        authDomain: "collabide-c9fb9.firebaseapp.com",
        databaseURL: "https://collabide-c9fb9.firebaseio.com/"
    };
    firebase.initializeApp(config);

    //// Get Firebase Database reference.
    var firepadRef = getRef();

    //// Create CodeMirror (with lineWrapping on).
    var codeMirror = CodeMirror(document.getElementById('firepad'), {
        lineNumbers: true,
        mode: 'javascript'
    });

    //// Create Firepad.
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        userColor: loggedUser.color,
        userId: loggedUser.username
    });

    // Set user text highlighthing
    var usuariosRef = firebase.database().ref(proID + "/users");
    usuariosRef.on('child_added', function (snapshot) {
        updateRulesContext(snapshot);
    });

}

// Helper to get databse reference.
function getRef() {
    var ref = firebase.database().ref();
    ref = ref.child(proID);
    return ref;
}

// Function to update css rules and context on new user registration on the project
function updateRulesContext(snapshot) {
    styleSheet.insertRule(".firepad-username-" + snapshot.getKey() + " { background-color:" + snapshot.val().highlightColor + "}", 0);
    loadContext(snapshot.getKey(), snapshot.val());
    loadDeveloper(snapshot.getKey(), snapshot.val());
}