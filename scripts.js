
var wpApiHost = 'https://en.wikipedia.org/w/api.php';
var wpSearchParams = "?action=query&format=json&prop=extracts&iwurl=1&exsentences=3&exintro=1&explaintext=1&gsrlimit=15&generator=";
var wpUrl = "https://en.wikipedia.org"

$(document).ready(function () {
  $('#btnSearch').on('click', function() {
    wpSearch("search");
  })
  $('#searchBox').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){
          wpSearch("search");
      }
  });
  $('#btnRandom').on('click', function() {
    wpSearch("random");
  })
})

// search
function wpSearch(type) {
  // clear old results
  removeResults();
  // prepare url
  var searchTerm = "";
  var generator = type;
  var grnNamespace = ""
  if (type == "search") {
    searchTerm = "&gsrsearch=" + $('#searchBox').val();
  }
  if (type == "random") {
    grnNamespace = "&grnnamespace=0"
  }
  // wikipedia API call
  $.ajax({
    type: "GET"
    , url: wpApiHost + wpSearchParams + generator + searchTerm + grnNamespace
    , dataType: "jsonp"
    , success: function(response) {
      processResults(response);
    }
  })
}

function removeResults() {
  var results = document.getElementById('searchResults');
  while (results.hasChildNodes()) {
    results.removeChild(results.lastChild);
  }
}

function processResults(response) {
  var results = [];
  var pages = response.query.pages;

  for (var key in pages) {
    if (pages.hasOwnProperty(key)) {
      results.push(pages[key]);
    }
  }
  // order results by index
  results.sort(sortCondition);
  displayResults(results);
}

function sortCondition(a, b) {
  console.log(a["index"] + " " + b["index"]);
  if (a["index"] === b["index"]) {
    return 0;
  }
  else {
    return (a["index"] < b["index"]) ? -1 : 1;
  }
}

function displayResults(pages) {
  for (var key in pages) {
    var pageid = "";
    var title = "";
    var extract = "";
    if (pages.hasOwnProperty(key)) {
      pageid = pages[key]["pageid"];
      title = pages[key]["title"];
      extract = pages[key]["extract"];
    }
    $('#searchResults').append('<h4><a href="' + wpUrl + '?curid=' + pageid + '" target="blank">' + title + '</a></h4><p>' + extract + '</p>');
  }
}
