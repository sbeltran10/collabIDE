function download() {
    var res = [];
    for(var m in firepad) {
        if(typeof firepad[m] == "function") {
            res.push(m)
        }
    }
    console.log(res);
    console.log(codeMirror.getDoc());
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent("test"));
    var fileName = $("#generated-file-name").val();
    if (fileName) {
        element.setAttribute('download', fileName + ".js");
    }
    else {
        element.setAttribute('download', "file.js");
    }

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

$(document).ready(function () {
    $('#generate-button').click(function (e) { e.preventDefault(); download(); return false; });
    getCurrentCode();
})

function getCurrentCode(){
    var codeInEditor = document.getElementsByClassName("CodeMirror-code");
    //var codeInEditor = $(".CodeMirror-code")[0];
    console.log(codeInEditor);
}

