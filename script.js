
// global variables ////////////////////////////////////////////////
var latLong
var clueNum = 1

// HTML Geolocation ////////////////////////////////////////////////
function getLocation() {
  // if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(printPosition);
  // } else {
  //     alert("We're sorry, we can't seem to locate you.");
  // }
  latLong = "40.724313,-73.997337" // Foursquare HQ
}

function printPosition(position) {
  latLong = position.coords.latitude + "," + position.coords.longitude;
  return latLong;
} 

///////////////////////////////////////////////////////////////////
$(document).ready(function() {                            // init jQuery

  getLocation();                                          // get current location

  function displayElement(selector) {
    var element = document.getElementById(selector);  
    if (element != null) {
      element.setAttribute("style","display:inline");
    } else {
      console.log("No such element exists.")
    };
  }
  
  function hideElement(selector) {
    var element = document.getElementById(selector);  
    if (element != null) {  
      element.setAttribute("style","display:none");
    } else {
      console.log("No such element exists.")
    };
  }

  function displayClue(i) {  
    var thisClue = document.getElementById("clue" + i);
    if (thisClue != null) {
      thisClue.setAttribute("style","display:inline");
      displayElement("submit");
    } else {
      console.log("You're out of clues!")
    };
  }

  function displayAnswer(i) {  
    var thisAnswer = document.getElementById("answer" + i);
    if (thisAnswer != null) {
      thisAnswer.setAttribute("style","display:inline");
    } else {
      console.log("You're out of clues!")
    };
  }

  // Set DOM Event Handlers /////////////////////////////////////////
  $("#soho").click(function(){
    alert("This is just a prototype, so you can play from a single location. Check back soon to take Find New York on the road!");
    displayElement("clues");
    hideElement("neighborhood");
    displayClue(clueNum);
  });

  $(".nothingYet").click(function(){
    alert("We don't have an adventure for " + this.innerText + " yet.  Please check back later!")
  });

  $("#submit").click(function(){
    var lastClue = "clue" + clueNum;

    var lastClueEl = document.getElementById(lastClue);
    var name = lastClueEl.dataset.name;
    var ll = lastClueEl.dataset.ll;

    // var latLong = getLocation();
    var latLong = ll;                 

    submitAnswer(name,ll,latLong,lastClue);
  });
  
  $(".continue").click(function(){
    var lastAnswer = "answer" + clueNum;
    hideElement(lastAnswer);
    clueNum = clueNum + 1;
    displayClue(clueNum);
    return clueNum;
  });

  // Receive answer and compare search to expected /////////////////////
  function submitAnswer(name,ll,latLong,lastClue){
    hideElement("submit");
    $.get({
      url:'https://api.foursquare.com/v2/venues/search',
      data: {
        client_id: 'NJGPZ3UKJBQBNLROMMQIAGS2EGV3CBYJUGEDLLRF4ZGAE3HH',
        client_secret: '2425ZFYRIE03HIA0PPADXN20FJLSUWOOJCM22WAAYTSOZHVQ',
        v: '20180209',
        intent: 'browse',
        ll: latLong,
        query: name,
        radius: 50
      },
      success: function(data,textStatus,jqXHR){
        return data
      },
      dataType: 'json'
    }).then(function(data){
      if (data.response.venues[0].name = name) {
        hideElement(lastClue);
        displayAnswer(clueNum);
      } else {
        console.log("WRONG!");
      }
    });
  };

});