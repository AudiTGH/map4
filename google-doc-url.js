
// returns params set in URL
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

var googleApiKey = 'AIzaSyCkSgBDkgcdnoqBGPnmPqiNjhUpV_e02gI' // mien n°2

//var UrlList = '1ymP0ufO4eKatKxFHC3nOmda_PZjaoqSxRdjPbBqoj7c';
function loadUrlList() { 
          Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRXU-Rbkwojw2hDppF_EFobsawFchtHCrPTVXdrn5k-FOI6qasCwvRppC6h-9ixt9pRuBxw4AzVJqHT/pub?gid=0&single=true&output=csv', {
          download: true,
          header: true,
          complete: function(results) {
            var urls = results.data
            //console.log(data)
          }
        })
window.addEventListener('DOMContentLoaded', loadUrlList)

*/ var urls = [];
urls.push('https://docs.google.com/spreadsheets/d/1-13FgMNZeeuIOrEVenv3qhKwEt2_NflG_7FQKGY9KoE/edit#gid=0');
urls.push('https://docs.google.com/spreadsheets/d/1-13FgMNZeeuIOrEVenv3qhKwEt2_NflG_7FQKGY9KoE/edit#gid=0');
urls.push('https://docs.google.com/spreadsheets/d/1-13FgMNZeeuIOrEVenv3qhKwEt2_NflG_7FQKGY9KoE/edit#gid=0');
urls.push('https://docs.google.com/spreadsheets/d/1EVR6zqtjuGV_mX0AmGxtdRdQzZ8sW4u82tR-gpTecyo/edit#gid=0');
*/
  
var number = getUrlVars()["u"];
var googleDocURL = urls[number]; 

//var googleDocURL = 'https://docs.google.com/spreadsheets/d/1-13FgMNZeeuIOrEVenv3qhKwEt2_NflG_7FQKGY9KoE/edit#gid=0'; // ok
//var googleDocURL = 'https://docs.google.com/spreadsheets/d/1EVR6zqtjuGV_mX0AmGxtdRdQzZ8sW4u82tR-gpTecyo/edit#gid=0'; // test
//var googleApiKey = 'AIzaSyBuCCp_xVL36St8f8sn9InouC2eqMDjB8I'; // mien

//var googleApiKey = 'AIzaSyBh9nKnVZm2RPeZa0ywCOxPAgJJfK87WhY'; // leur

// ceux du site 
//var googleDocURL = 'https://docs.google.com/spreadsheets/d/1ZxvU8eGyuN9M8GxTU9acKVJv70iC3px_m3EVFsOHN9g/edit#gid=0';
//var googleApiKey = 'AIzaSyBh9nKnVZm2RPeZa0ywCOxPAgJJfK87WhY';
