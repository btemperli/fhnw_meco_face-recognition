"use strict";

var $ = jQuery;

var $startButton,
    databaseImages,
    localstorageDatabase;

var initStartButton,
    initDatabaseTracker,
    showStartButton,
    compareFaces;

$(document).ready(function(){

    initStartButton();
    databaseImages = {};

    // read database
    var dir = "/database";
    var fileextension = ".jpg";

    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: dir,
        success: function (data) {
            //Listt all jpg file names in the page
            $(data).find("a[href$='" + fileextension + "']").each(function () {
                var filename = this.href.replace(window.location.host, "").replace("http:///", "");
                var splitFilename = filename.split('.')[0].split('_');
                $("#database").append(
                    $("<div class='database-person' style=background-image:url(" + dir + '/' + filename + ")>"
                        + capitaliseFirstLetter(splitFilename[1]) + "<br />" + capitaliseFirstLetter(splitFilename[2])
                        + "</div>")
                );

                databaseImages[splitFilename[1] + '_' + splitFilename[2]] = dir + '/' + filename;
            });

            //showStartButton();
            initDatabaseTracker();
        }
    });
});

showStartButton = function () {
    $startButton.show();
};

initStartButton = function () {

    $startButton = $('#startButton');
    $startButton.click(function () {
        initFaceTracker();
    });
};

initDatabaseTracker = function () {

    var database = localStorage.getItem('database');

    if (database == null) {
        initFaceTrackerImage(databaseImages);
    } else {
        initImagesFinished();
    }
};

function initImagesFinished ()
{
    var jsonString = localStorage.getItem('database');
    var databaseStrings = $.parseJSON(jsonString);

    localstorageDatabase = {};

    $.each(databaseStrings, function (index, item) {
        jsonString = localStorage.getItem(item);
        localstorageDatabase[item] = $.parseJSON(jsonString);
    });

    showStartButton();
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

compareFaces = function () {

    console.log('compare image');
    var jsonString = localStorage.getItem('result');
    var resultFace = $.parseJSON(jsonString);

    console.log(resultFace);
    console.log(localstorageDatabase);

    getFaceProportions(resultFace);

    $.each(localstorageDatabase, function (index, item) {

    });
};

function getFaceProportions(face) {

    // get different distances for a comparable face

    // main distance persons left eye.
    var main = getDistance(face['points'][27], face['points'][29]);

    // right eye
    var rightEye = getDistance(face['points'][34], face['points'][32]);
    var noseLeftEye = getDistance(face['points'][67], face['points'][31]);
    var noseRightEye = getDistance(face['points'][67], face['points'][33]);
    var eyeEye = getDistance(face['points'][31], face['points'][33]);
    var noseMouth = getDistance(face['points'][67], face['points'][64]);
    var noseChin = getDistance(face['points'][67], face['points'][7]);
    var noseLeft = getDistance(face['points'][67], face['points'][2]);
    var noseRight = getDistance(face['points'][67], face['points'][12]);
    var noseLeftTop = getDistance(face['points'][67], face['points'][0]);
    var noseRightTop = getDistance(face['points'][67], face['points'][14]);
    var noseRightBottom = getDistance(face['points'][67], face['points'][10]);
    var noseLeftBottom = getDistance(face['points'][67], face['points'][4]);

}

function getDistance(a, b) {

    var x = a.x - b.x;
    var y = a.y - b.y;

    if (x < 0) { x = x * -1; }
    if (y < 0) { y = y * -1; }

    return Math.sqrt((x*x) + (y*y));
}