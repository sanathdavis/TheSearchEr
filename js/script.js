
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

var getURLFromText = function(text, number){
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(text,"text/html");
  // => https://developer.mozilla.org/en/docs/Web/API/Element/getAttribute
  return xmlDoc.getElementsByTagName('a')[number].getAttribute('href');
};

var search = function(query){
  // the temprary FIX!
  var sqry = encodeURIComponent("https://www.google.com/search?q=" + encodeURIComponent(query + "site:maango.me"));
  // => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  FetchData("POST", "https://projects.shrimadhavuk.me/tracker/cors.php" + "?q=" + sqry, "", function(response) {
    var mainSearchResultId = "ires";
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(response,"text/html");
    var resultsAsText = xmlDoc.getElementById(mainSearchResultId).innerHTML;
    var r = resultsAsText.split('<div class="g">');
    var firstUrl = getURLFromText(r[1], 0).split('?q=')[1].split('&')[0];
    console.log(firstUrl);
    var TheURL = encodeURIComponent(firstUrl);
    FetchData("GET", "https://projects.shrimadhavuk.me/tracker/cors.php" + "?q=" + TheURL, "", function(esnopser){
      var SongResultPanelS = "songbox";
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(esnopser,"text/html");
      var TheRequiredThings = xmlDoc.getElementsByClassName(SongResultPanelS);
      var rpsq = "";
      for(var i = 0; i < TheRequiredThings.length; i++){
        var currentElement = TheRequiredThings[i].innerHTML;
        var url = getURLFromText(currentElement, 1);
        rpsq += "<li><a href='" + url + "'>" + url + "</a></li>";
      }
      document.getElementById('outputFrm').innerHTML = rpsq;
    });
  });
};
