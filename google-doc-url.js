
// returns params set in URL
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

var urls = [];
urls.push('https://docs.google.com/spreadsheets/d/1-13FgMNZeeuIOrEVenv3qhKwEt2_NflG_7FQKGY9KoE/edit#gid=0');
urls.push('https://docs.google.com/spreadsheets/d/1-13FgMNZeeuIOrEVenv3qhKwEt2_NflG_7FQKGY9KoE/edit#gid=0');
urls.push('https://docs.google.com/spreadsheets/d/1-13FgMNZeeuIOrEVenv3qhKwEt2_NflG_7FQKGY9KoE/edit#gid=0');
urls.push('https://docs.google.com/spreadsheets/d/1EVR6zqtjuGV_mX0AmGxtdRdQzZ8sW4u82tR-gpTecyo/');

var number = getUrlVars()["u"];
var googleDocURL = urls[number];