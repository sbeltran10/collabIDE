function createNewVersion() {
    var versionName = $("#new-version-name").val();
    if (!versionName)
        window.alert("The name of the new version must not be empty");
    else {
        var refEdition = firebase.database().ref(proID + "/versions/");
        refEdition.once('value').then(function (snapshot) {
            if (!snapshot.val() || !snapshot.val()[versionName]) {

                if (activeVersion === "principal") {
                    firebase.database().ref(proID).once('value').then(function (snapshot) {
                        firebase.database().ref(proID + "-" + versionName).set(snapshot.val());
                    });
                }
                else {
                    firebase.database().ref(proID + "-" + activeVersion).once('value').then(function (snapshot) {
                        firebase.database().ref(proID + "-" + versionName).set(snapshot.val());
                    });
                }


                firebase.database().ref(proID + "/versions/" + versionName).set({
                    createdAt: new Date().getTime(),
                    firepadRef: versionName
                });
            }
            else {
                window.alert("A version with that name already exists");
            }
        })
    }
}


function loadVersion(versionLabel) {

    var newItem = $('<div class="row menu-version-item"></div>');

    var colVersionLabel = $('<div id="txt-version-'+versionLabel+'" class="col-md-12">' + versionLabel + '</div>');

    var colRestore = $('<div class="col-md-6"></div>');
    var butRestore = $('<a id="restore-version-' + versionLabel + '" class="btn btn-primary restore-button" name="restorebutton">Switch to this version</a>');
    colRestore.append(butRestore);

    var colUpdate = $('<div class="col-md-6"></div>');
    var butUpdate = $('<a id="update-version-' + versionLabel + '" class="btn btn-primary update-button" name="updatebutton">Update version</a>');
    colUpdate.append(butUpdate);

    newItem.append(colVersionLabel);
    newItem.append(colRestore);
    newItem.append(colUpdate);

    $('#version-existing').append(newItem);
    $('#restore-version-' + versionLabel).click(function (e) { e.preventDefault(); changeVersion(versionLabel); return false; });
    $('#update-version-' + versionLabel).click(function (e) { e.preventDefault(); updateVersion(versionLabel); return false; });
}

function changeVersion(versionName) {
    firebase.database().ref(proID).update({ "activeVersion": versionName });
}

function restoreVersion(versionName) {
    var firepadNode = document.getElementById('firepad');
    firepadNode.removeChild(firepadNode.firstChild);
    var ref = firebase.database().ref();

    $('#restore-version-' + activeVersion).removeClass("disabled");
    $('#update-version-' + activeVersion).removeClass("disabled");
    $('#txt-version-' + activeVersion).html(activeVersion);

    if (versionName !== "principal") {
        activeFirepadRef = ref.child(proID + "-" + versionName);
        activeVersion = versionName;
        firepadInitialization(activeFirepadRef);
    }
    else {
        activeFirepadRef = ref.child(proID);
        activeVersion = versionName;
        firepadInitialization(activeFirepadRef);
    }
    $('#restore-version-'+activeVersion).addClass("disabled");
    $('#update-version-' + activeVersion).addClass("disabled");
    $('#txt-version-' + activeVersion).html(activeVersion + " - ACTIVE");
}

function updateVersion(versionName) {
    activeFirepadRef.once('value').then(function (snapshot) {
        firebase.database().ref(proID + "-" + versionName).update(snapshot.val());
    });
}

function changePrincipalVersion() {
    firebase.database().ref(proID).update({ "activeVersion": "principal" });
}

function updatePrincipalVersion() {
    activeFirepadRef.once('value').then(function (snapshot) {
        var updateData = {};
        updateData.history = snapshot.val().history;
        firebase.database().ref(proID).update(snapshot.val());
    });
}