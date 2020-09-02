
// returns params set in URL
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

var googleApiKey = 'AIzaSyCkSgBDkgcdnoqBGPnmPqiNjhUpV_e02gI' // mien n°2
var number = getUrlVars()["u"];
var spreadsheetId  = getUrlVars()["u"];
