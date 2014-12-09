"use strict";

var $ = jQuery;

var $startButton,
    faceResultImages,
    databaseImages,
    localstorageDatabase;

window.startedAnalyse = false;

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

            initDatabaseTracker();
            faceResultImages = $('.database-person');
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
    var resultFaceProportions = getFaceProportions(resultFace);
    var proportions = {};
    var faceComparePercents = {};
    var i = 0;

    $.each(localstorageDatabase, function (index, item) {
        var faceProportions = getFaceProportions(item);
        proportions[index] = faceProportions;
        var comparePercents = compareProportions(resultFaceProportions, faceProportions);
        faceComparePercents[index] = comparePercents;

        $(faceResultImages[i]).removeClass().addClass('database-person').addClass('result-' + Math.round(comparePercents));
        i++;
    });

    console.log("recognized face proportions:");
    console.log(resultFaceProportions);

    console.log("faceproportions of the database-faces:");
    console.log(proportions);

    console.log("compared percents: ");
    console.log(faceComparePercents);

    window.startedAnalyse = false;

};

function getFaceProportions(face) {

    // get different distances for a comparable face

    // main distance persons left eye.
    var main = getDistance(face['points'][31], face['points'][33]);

    // right eye
    var rightEye = getDistance(face['points'][34], face['points'][32]);
    var noseLeftEye = getDistance(face['points'][67], face['points'][31]);
    var noseRightEye = getDistance(face['points'][67], face['points'][33]);
    var leftEye = getDistance(face['points'][27], face['points'][29]);
    var noseMouth = getDistance(face['points'][67], face['points'][64]);
    var noseChin = getDistance(face['points'][67], face['points'][7]);
    var noseLeft = getDistance(face['points'][67], face['points'][2]);
    var noseRight = getDistance(face['points'][67], face['points'][12]);
    var noseLeftTop = getDistance(face['points'][67], face['points'][0]);
    var noseRightTop = getDistance(face['points'][67], face['points'][14]);
    var noseRightBottom = getDistance(face['points'][67], face['points'][10]);
    var noseLeftBottom = getDistance(face['points'][67], face['points'][4]);
    var mouthLeft = getDistance(face['points'][64], face['points'][3]);
    var mouthRight = getDistance(face['points'][64], face['points'][11]);
    var mouthLeftTop = getDistance(face['points'][64], face['points'][22]);
    var mouthRightTop = getDistance(face['points'][64], face['points'][16]);

    var proportions = [];

    proportions.push(rightEye/main);
    proportions.push(noseLeftEye/main);
    proportions.push(noseRightEye/main);
    proportions.push(leftEye/main);
    proportions.push(noseMouth/main);
    proportions.push(noseChin/main);
    proportions.push(noseLeft/main);
    proportions.push(noseRight/main);
    proportions.push(noseLeftTop/main);
    proportions.push(noseRightTop/main);
    proportions.push(noseRightBottom/main);
    proportions.push(noseLeftBottom/main);
    proportions.push(mouthLeft/main);
    proportions.push(mouthRight/main);
    proportions.push(mouthLeftTop/main);
    proportions.push(mouthRightTop/main);

    return proportions;
}

function getDistance(a, b) {

    var x = getAmount(a.x - b.x);
    var y = getAmount(a.y - b.y);

    return Math.sqrt((x*x) + (y*y));
}

function compareProportions(a, b) {

    var comparePercent = [];
    $.each(a, function(index, value) {
        var difference = getAmount(value - b[index]);
        comparePercent.push(difference * 100 / value);
    });

    return getAverage(comparePercent);
}

// get average of array
function getAverage(a) {
    var count = a.length;
    var sum = 0;

    $.each(a, function(index, value) {
        sum += value;
    });

    return sum/count;
}

// get amount of a number
// x alwoys > 0
function getAmount(x) {

    if (x < 0) {
        x = x * -1;
    }

    return x;
}