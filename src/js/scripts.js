let exampleData = '{"communeName": "Paris 1er Arrondissement", "global": 50, "region": 120, "regionName": "\u00cele-de-France", "departement": 170, "departementName": "Paris", "digitalInterfaceAccess": 250, "informationAccess": 120, "administrativeCompetences": 75, "digitalAndScolarCompetences": 73}';
let resultShown = false;

let cache = {};

function search() {
  let value = document.getElementById("searchbar").value;
  let reg_only_digits = new RegExp('^[0-9]*$');
  if (!reg_only_digits.test(value))
    alert("Postal code must only contains digits !");
  else if (value.length !== 5)
    alert("Postal code must always contains 5 digits, nothing more nothing less !");
  else {
    if (cache[value] == null) {
     // getUrl('http://vps-45d5666d.vps.ovh.net/api/commune/' + value + '/statistics', showResultAndCache, value, "An error occurred...");
      showResultAndCache(value, JSON.parse(exampleData));
    } else {
      showResult(value, cache[value]);
    }
  }
}

function showResultAndCache(value, jsonDump) {
  cache[value] = jsonDump;
  showResult(value, jsonDump);
}

function color(MaxValue, value) {

  if (value > MaxValue * 0.8) {
    return 'green'
  } else if (value > MaxValue * 0.6) {
    return 'lightgreen'
  }  else if (value > MaxValue * 0.4) {
    return 'yellow'
  }  else if (value > MaxValue * 0.2) {
    return 'orange'
  } else {
    return 'red'
  }
}


function showResult(jsonDump, value) {
  document.getElementById("global-score").innerText = jsonDump["global"];
  document.getElementById("global-score-indicator").style.backgroundColor = color(276, jsonDump["global"]);

  document.getElementById("region-name").innerText = jsonDump["regionName"];
  document.getElementById("region-score").innerText = jsonDump["region"];
  document.getElementById("region-score-indicator").style.backgroundColor = color(276, jsonDump["region"]);

  document.getElementById("departement-name").innerText = jsonDump["departementName"];
  document.getElementById("departement-score").innerText = jsonDump["departement"];
  document.getElementById("departement-score-indicator").style.backgroundColor = color(276, jsonDump["departement"]);

  document.getElementById("digitalInterfaceAccess-score").innerText = jsonDump["digitalInterfaceAccess"];
  document.getElementById("digitalInterfaceAccess-score-indicator").style.backgroundColor = color(217, jsonDump["digitalInterfaceAccess"]);

  document.getElementById("informationAccess-score").innerText = jsonDump["informationAccess"];
  document.getElementById("informationAccess-score-indicator").style.backgroundColor = color(505, jsonDump["informationAccess"]);

  document.getElementById("administrativeCompetences-score").innerText = jsonDump["administrativeCompetences"];
  document.getElementById("administrativeCompetences-score-indicator").style.backgroundColor = color(597, jsonDump["administrativeCompetences"]);

  document.getElementById("digitalAndScolarCompetences-score").innerText = jsonDump["digitalAndScolarCompetences"];
  document.getElementById("digitalAndScolarCompetences-score-indicator").style.backgroundColor = color(431, jsonDump["digitalAndScolarCompetences"]);

  if (!resultShown) {
    let searchdiv = document.getElementById("search-div");
    searchdiv.style.width = "auto";
    searchdiv.style.height = "auto";
    searchdiv.style.position = "static";

    let resultdiv = document.getElementById("search-div");
    resultdiv.style.display = "block";
    resultdiv.style.position = "static";

    document.getElementById("searchbar").style.display = "inline-block";

    document.getElementById("searchButton").style.display = "inline-block";

    document.getElementById("pdfDownloadButton").style.visibility = "visible";

    document.getElementById("pdfDownload").href = 'http://vps-45d5666d.vps.ovh.net/api/commune/' + value + '/stat_report.pdf';
  }

  if (!resultShown) {
    resultShown = true;
  }

}

function getUrl(url, callback, value, errorMessage) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(value, JSON.parse(xmlHttp.responseText));
      }
      else if (xmlHttp.status === 404) {
        alert("ERROR 404 : Your postal code does not seem to exist !");
      }
      else {
        alert(errorMessage)
      }
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}
