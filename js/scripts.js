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

compareFaces = function () {

    console.log('compare image');
    var jsonString = localStorage.getItem('result');
    var resultFace = $.parseJSON(jsonString);

    console.log(resultFace);
    console.log(localstorageDatabase);

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