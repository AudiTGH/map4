
// returns params set in URL
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

var apiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';
var googleApiKey = 'AIzaSyCkSgBDkgcdnoqBGPnmPqiNjhUpV_e02gI' // mien n°2
var spreadsheetId  = getUrlVars()["u"];
