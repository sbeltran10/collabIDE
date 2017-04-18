var proID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
var styleSheet = document.styleSheets[document.styleSheets.length - 1];
var rules;
var firepad;
var codeMirror;

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
    codeMirror = CodeMirror(document.getElementById('firepad'), {
        lineNumbers: true,
        mode: 'javascript'
    });

    //// Create Firepad.
    firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        userColor: loggedUser.color,
        userId: loggedUser.username
    });

    // Listeners for new user connected, activated or disconnected

    // Set user text highlighthing for new user 
    var userRef = firebase.database().ref(proID + "/users");
    userRef.on('child_added', function (snapshot) {
        updateRulesContext(snapshot);
    });

    // Set user offline status
    var userconnectedRef = firebase.database().ref(proID + "/users/" + loggedUser.username);
    userconnectedRef.onDisconnect().update({
        online: false,
    });

    // Set status online
    userconnectedRef.update({
        online: true,
    });

    // Set the functions on each radio
    prepareRadio();

    // Listener for edition mode
    var userRefEdition = firebase.database().ref(proID + "/edition");
    userRefEdition.on('value', function (snapshotEdition) {
        updateEditionMode(snapshotEdition);
    });

    rules = styleSheet.cssRules || sheet.rules;

    //experimental();
    firepad.on('ready', function () {
        $('#generate-button').removeClass("disabled");
        $('#generate-button').click(function (e) { e.preventDefault(); download(); return false; });
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
    var developerUserName = snapshot.getKey();
    var rgbaColor = hexToRgb(snapshot.val().highlightColor);
    styleSheet.insertRule(".firepad-username-" + developerUserName + " { background-color: rgba(" + rgbaColor.r + ',' + rgbaColor.g + ',' + rgbaColor.b + ',' + rgbaColor.a + ")}", 0);
    loadContext(developerUserName, snapshot.val());
    loadDeveloper(developerUserName, snapshot.val());

    // Adds listeners for users status changes
    // Set user online icon status
    var userRefOnline = firebase.database().ref(proID + "/users/" + developerUserName + "/online");
    userRefOnline.on('value', function (snapshotStatus) {
        updateOnlineOfflineStatus(developerUserName, snapshotStatus);
    });

    var userRefActive = firebase.database().ref(proID + "/users/" + developerUserName + "/active");
    userRefActive.on('value', function (snapshotStatus) {
        updateActiveInactiveStatus(developerUserName, snapshotStatus)
    });

}

function experimental() {
    var nContexts = 0;
    while (nContexts < 500000) {
        var DevContext = new Context({ name: "developer" });
        console.log(DevContext.activate());

    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 0.4
    } : null;
}