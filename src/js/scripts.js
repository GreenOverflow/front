//let exampleData = '{"global":10,"region":62,"regionName":"Occitanie","departement":50,"departementName":"Hérault","digitalInterfaceAccess":123,"informationAccess":456,"administrativeCompetences":789,"digitalAndScolarCompetences":42}';
let resultShown = false;

//TODO: add cache
let cache = {};

function search() {
  let value = document.getElementById("searchbar").value;

  //TODO: vérifier que value soit 5 chiffres
  getUrl('http://vps-45d5666d.vps.ovh.net/api/commune/' + value + '/statistics', showResult, "An error occurred...");
  //showResult(exampleData)
}

function color(first, second, value) {
  let color = 'red';
    if (value > second)
      color = 'lightgreen';
    else if (value > first)
      color = 'yellow';
    return color
}


function showResult(jsonDump) {

  //TODO: revoir les palliers
  document.getElementById("global-score").innerText = jsonDump["global"];
  document.getElementById("global-score-indicator").style.backgroundColor = color(138,220, jsonDump["global"]);

  document.getElementById("region-name").innerText = jsonDump["regionName"];
  document.getElementById("region-score").innerText = jsonDump["region"];
  document.getElementById("region-score-indicator").style.backgroundColor = color(138,220, jsonDump["region"]);

  document.getElementById("departement-name").innerText = jsonDump["departementName"];
  document.getElementById("departement-score").innerText = jsonDump["departement"];
  document.getElementById("departement-score-indicator").style.backgroundColor = color(138,220, jsonDump["departement"]);

  document.getElementById("digitalInterfaceAccess-score").innerText = jsonDump["digitalInterfaceAccess"];
  document.getElementById("digitalInterfaceAccess-score-indicator").style.backgroundColor = color(108,173, jsonDump["digitalInterfaceAccess"]);

  document.getElementById("informationAccess-score").innerText = jsonDump["informationAccess"];
  document.getElementById("informationAccess-score-indicator").style.backgroundColor = color(252,404, jsonDump["informationAccess"]);

  document.getElementById("administrativeCompetences-score").innerText = jsonDump["administrativeCompetences"];
  document.getElementById("administrativeCompetences-score-indicator").style.backgroundColor = color(298,477, jsonDump["administrativeCompetences"]);

  document.getElementById("digitalAndScolarCompetences-score").innerText = jsonDump["digitalAndScolarCompetences"];
  document.getElementById("digitalAndScolarCompetences-score-indicator").style.backgroundColor = color(215,344, jsonDump["digitalAndScolarCompetences"]);

  if (!resultShown) {
    document.getElementById("search-div").style.width = "500px";
    document.getElementById("result-div").style.display = "inline-block";
    document.getElementById("search-div").style.position = "relative";
    document.getElementById("searchbar").style.display = "inline-block";
    document.getElementById("searchButton").style.display = "inline-block";
  }

  if (!resultShown) {
    resultShown = true;
  }

}


function getUrl(url, callback, errorMessage) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      //TODO: faire le cas de la 404
      if (xmlHttp.status === 200) {
        callback(JSON.parse(xmlHttp.responseText));
      } else {
        alert(errorMessage)
      }
    }
  };
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
}
