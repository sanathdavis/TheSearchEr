
var CORS_URL = "https://projects.shrimadhavuk.me/tracker/cors.php";

var confirmExit = function (e) {
  // => http://stackoverflow.com/a/10311375/4723940
  e = e || window.event;
  // For IE and Firefox prior to version 4
  if (e) {
      e.returnValue = 'Sure?';
  }
  // For Safari
  return 'Sure?';
  // => http://stackoverflow.com/a/10311375/4723940
};

// uncomment this line before production!
//window.onbeforeunload = confirmExit;

var advertisements = function(){
  sa_client = "94c732f75083abcdc4b3c63809a9ad5d";
  sa_code = "609e751e782c9a9461145e80f980e507";
  sa_protocol = ("https:"==document.location.protocol)?"https":"http";
  sa_pline = "3";
  sa_maxads = "1";
  sa_bgcolor = "FFFFFF";
  sa_bordercolor = "FFFFFF";
  sa_superbordercolor = "FFFFFF";
  sa_linkcolor = "000000";
  sa_desccolor = "000000";
  sa_urlcolor = "008000";
  sa_b = "0";
  sa_format = "banner_468x90";
  sa_width = "468";
  sa_height = "90";
  sa_location = "0";
  sa_radius = "10";
  sa_borderwidth = "2";
  sa_font = "1";
  document.write(unescape("%3cscript type='text/javascript' src='"+sa_protocol+"://sa.entireweb.com/sense2.js'%3e%3c/script%3e"));
}

var notifyUSER = function(data) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    console.warn("This browser does not support system notifications");
  }
  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(data);
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(data);
      }
    });
  }
  // Finally, if the user has denied notifications and you
  // want to be respectful there is no need to bother them any more.
};

var FetchData = function(type, URL, formData, callBack){
  // create a XHR object
  var xhr = new XMLHttpRequest();
  // open the XHR object in asynchronous mode
  xhr.open(type, URL, true);
  //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1')
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // OK! we have a successful response.
      var response = xhr.responseText;
      //console.log('OUTPUT: ' + response);
      // do something else with the response
      callBack(response);
    }
  };
  // GET or POST the URL according to type
  if(type == "GET"){
    xhr.send();
  }
  if(type == "POST"){
    xhr.send(formData);
  }
};

var FormatURLs = function(googleurl){
  return googleurl.split('?q=')[1].split('&')[0];
};

var FormatGoogleIRes = function(response){
  var mainSearchResultId = "ires";
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(response,"text/html");
  var resultsAsText = xmlDoc.getElementById(mainSearchResultId).innerHTML;
  return resultsAsText.split('<div class="g">');
};

var getURLFromText = function(text, number){
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(text,"text/html");
  // => https://developer.mozilla.org/en/docs/Web/API/Element/getAttribute
  var the_array = xmlDoc.getElementsByTagName('a');
  if(number <= (the_array.length - 1)){
    return the_array[number].getAttribute('href');
  }
  else{
    return "SPONSORED: https://whatapp.me/?q=whatapp.me&utm_response=shrimadhav";
  }
};

advertisements();

var search = function(query){
  document.getElementById('outputFrm').innerHTML = "L o a d i n g ...";
  var rpsq = "";
  // the temprary FIX!
  var supported_extensions = ["mkv", "mp4", "avi", "epub", "pdf", "mp3"];
  var fg_extensions = "inurl: (" + supported_extensions.join('|') + ")";
  var sqry = encodeURIComponent("https://www.google.com/search?q=" + encodeURIComponent(query + fg_extensions));
  // => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  FetchData("POST", CORS_URL + "?q=" + sqry, "", function(response) {
    var r = FormatGoogleIRes(response);
    var firstUrl = FormatURLs(getURLFromText(r[1], 0));
    if(firstUrl.indexOf("maango.me") != -1){
      var TheURL = encodeURIComponent(firstUrl);
      FetchData("GET", CORS_URL + "?q=" + TheURL, "", function(esnopser){
        var SongResultPanelS = "songbox";
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(esnopser,"text/html");
        var TheRequiredThings = xmlDoc.getElementsByClassName(SongResultPanelS);
        for(var i = 0; i < TheRequiredThings.length; i++){
          var currentElement = TheRequiredThings[i].innerHTML;
          var url = getURLFromText(currentElement, 1);
          rpsq += "<li><a href='" + url + "'>" + url + "</a></li>";
        }
        document.getElementById('outputFrm').innerHTML = rpsq;
      });
    }
    else{
      console.log(firstUrl);
      document.getElementById('outputFrm').innerHTML += "404! under construction";
    }
  });
};
