var collSession;

function init() {

    // Assing session data
    collSession = {
        userId: loggedUser.id,
        userName: loggedUser.name,
        userEmail: loggedUser.email,
        userColor: loggedUser.color,
    };

    // Set user text highlighthing
    var styleSheet = document.styleSheets[document.styleSheets.length - 1];
    styleSheet.insertRule(".firepad-userid-" + collSession.userId + " { background-color: red }", 0);
    console.log(styleSheet);

    //// Initialize Firebase.
    console.log(loggedUser);
    var config = {
        apiKey: "AIzaSyBNqso86bEnzBIzRx4RNQ-3Ww2qNqL_xJA",
        authDomain: "collabide-c9fb9.firebaseapp.com",
        databaseURL: "https://collabide-c9fb9.firebaseio.com/"
    };
    firebase.initializeApp(config);

    //// Get Firebase Database reference.
    var firepadRef = getExampleRef();

    //// Create CodeMirror (with lineWrapping on).
    var codeMirror = CodeMirror(document.getElementById('firepad'), {
        lineNumbers: true,
        mode: 'javascript'
    });

    // Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
    var userId = Math.floor(Math.random() * 9999999999).toString();

    var min = Math.ceil(10000);
    var max = Math.floor(1);
    var rand = Math.floor(Math.random() * (max - min + 1)) + min;

    //Random color
    var randCol = function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    var col = randCol();
    //// Create Firepad.
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}',
        userColor: col,
        userId: loggedUser.id
    });

    /* Create FirepadUserList (with our desired userId).
    var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
        document.getElementById('userlist'), userId);
    */

}

// Helper to get hash from end of URL or generate a random one.
function getExampleRef() {
    var ref = firebase.database().ref();
    var proID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    ref = ref.child(proID);
    if (typeof console !== 'undefined') {
        console.log('Firebase data: ', ref.toString());
    }
    return ref;
}