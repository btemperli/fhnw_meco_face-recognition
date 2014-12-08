"use strict";

var $ = jQuery;

$(document).ready(function(){
    console.log('facedetection start');

    // read database
    var dir = "/database";
    var fileextension = ".jpg";
    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: dir,
        success: function (data) {
            //Listt all jpg file names in the page
            $(data).find("a:contains(" + fileextension + ")").each(function () {
                var filename = this.href.replace(window.location.host, "").replace("http:///", "");
                $("#database").append($("<div class='database-person' style=background-image:url(" + dir + '/' + filename + ")></div>"));
            });
        }
    });

    // start facetracker.
    initFaceTracker();
});