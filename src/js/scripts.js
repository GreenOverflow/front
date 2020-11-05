let resultShown = false;

let cache = {};

document.getElementById("searchbar").addEventListener("keydown", event => {
  if (event.key === 'Enter'){
    search()
  }
});

function search() {
  let value = document.getElementById("searchbar").value;
  let reg_only_digits = new RegExp('^[0-9]*$');
  if (!reg_only_digits.test(value))
    alert("Le code postal doit contenir uniquement des chiffres !");
  else if (value.length !== 5)
    alert("Le code postal doit contenir 5 chiffres, ni plus, ni moins !");
  else {
    if (cache[value] == null) {
      getUrl('http://vps-45d5666d.vps.ovh.net/api/commune/' + value + '/statistics', showResultAndCache, value);
    } else {
      showResult(value, cache[value]);
    }
  }
}

function showResultAndCache(value, jsonDump) {
  cache[value] = jsonDump;
  showResult(value, jsonDump);
}

function backgroundColor(MaxValue, value) {
  if (value > MaxValue * 0.6) {
    return '#CBEBC9'
  } else if (value > MaxValue * 0.4) {
    return 'lightgoldenrodyellow'
  } else {
    return '#FFC4A8'
  }
}

function color(MaxValue, value) {
  if (value > MaxValue * 0.8) {
    return 'green'
  } else if (value > MaxValue * 0.6) {
    return '#62BF65'
  }  else if (value > MaxValue * 0.4) {
    return '#EE0'
  }  else if (value > MaxValue * 0.2) {
    return 'orange'
  } else {
    return 'red'
  }
}

function setResultConclusion(value, communeName) {
  console.log(value);
  let maxValue = 276;
  console.log(maxValue * 0.8);
  let conclusion = document.getElementById("conclusion");
  if (value > maxValue * 0.8) {
    conclusion.innerText = "Le score de " + communeName + " est vraiment excellent. Cela veut dire que " + communeName + " n'a presque pas d'exclusion numérique.";
  } else if (value > maxValue * 0.6) {
    conclusion.innerText = "Le score de " + communeName + " est bon. Cela veut dire que " + communeName + " n'a pas beaucoup d'exclusion numérique.";
  }  else if (value > maxValue * 0.4) {
    conclusion.innerText = "Le score de " + communeName + " est moyen. Cela veut dire que " + communeName + " a de l'exclusion numérique.";
  }  else if (value > maxValue * 0.2) {
    conclusion.innerText = "Le score de " + communeName + " est assez bas. Cela veut dire que " + communeName + " a beaucoup d'exclusion numérique.";
  } else {
    conclusion.innerText = "Le score de " + communeName + " est très bas. Cela veut dire que " + communeName + " a vraiment beaucoup d'exclusion numérique.";
  }
}

function colorizeScoresBackgrouds(jsonDump) {
  document.getElementById("global-score-div").style.backgroundColor = backgroundColor(276, jsonDump["global"]);
  document.getElementById("region-score-div").style.backgroundColor = backgroundColor(276, jsonDump["region"]);
  document.getElementById("departement-score-div").style.backgroundColor = backgroundColor(276, jsonDump["departement"]);
  document.getElementById("digitalInterfaceAccess-score-div").style.backgroundColor = backgroundColor(217, jsonDump["digitalInterfaceAccess"]);
  document.getElementById("informationAccess-score-div").style.backgroundColor = backgroundColor(505, jsonDump["informationAccess"]);
  document.getElementById("administrativeCompetences-score-div").style.backgroundColor = backgroundColor(597, jsonDump["administrativeCompetences"]);
  document.getElementById("digitalAndScolarCompetences-score-div").style.backgroundColor = backgroundColor(431, jsonDump["digitalAndScolarCompetences"]);
}

function colorizeScoreIndicators(jsonDump) {
  document.getElementById("global-score-indicator").style.backgroundColor = color(276, jsonDump["global"]);
  document.getElementById("region-score-indicator").style.backgroundColor = color(276, jsonDump["region"]);
  document.getElementById("departement-score-indicator").style.backgroundColor = color(276, jsonDump["departement"]);
  document.getElementById("informationAccess-score-indicator").style.backgroundColor = color(505, jsonDump["informationAccess"]);
  document.getElementById("administrativeCompetences-score-indicator").style.backgroundColor = color(597, jsonDump["administrativeCompetences"]);
  document.getElementById("digitalAndScolarCompetences-score-indicator").style.backgroundColor = color(431, jsonDump["digitalAndScolarCompetences"]);
  document.getElementById("digitalInterfaceAccess-score-indicator").style.backgroundColor = color(217, jsonDump["digitalInterfaceAccess"]);
}

function showResult(value, jsonDump) {
  colorizeScoresBackgrouds(jsonDump);
  colorizeScoreIndicators(jsonDump);
  setResultConclusion(jsonDump["global"], jsonDump['communeName']);

  document.getElementById("city-name").innerText = jsonDump["communeName"];
  document.getElementById("global-score").innerText = jsonDump["global"];
  document.getElementById("region-name").innerText = jsonDump["regionName"];
  document.getElementById("region-score").innerText = jsonDump["region"];
  document.getElementById("departement-name").innerText = jsonDump["departementName"];
  document.getElementById("departement-score").innerText = jsonDump["departement"];
  document.getElementById("digitalInterfaceAccess-score").innerText = jsonDump["digitalInterfaceAccess"];
  document.getElementById("informationAccess-score").innerText = jsonDump["informationAccess"];
  document.getElementById("administrativeCompetences-score").innerText = jsonDump["administrativeCompetences"];
  document.getElementById("digitalAndScolarCompetences-score").innerText = jsonDump["digitalAndScolarCompetences"];


  if (!resultShown) {
    document.getElementsByTagName("BODY")[0].style.height = "auto";
    document.getElementsByTagName("FOOTER")[0].style.position = "relative";

    let searchdiv = document.getElementById("search-div");
    searchdiv.style.width = "auto";
    searchdiv.style.height = "auto";
    searchdiv.style.position = "static";

    let resultdiv = document.getElementById("result-div");
    resultdiv.style.position = "static";


    document.getElementById("searchbar").style.display = "inline-block";
    document.getElementById("searchButton").style.display = "inline-block";
    document.getElementById("pdfDownload").href = 'http://vps-45d5666d.vps.ovh.net/api/commune/' + value + '/stat_report.pdf';
    document.getElementById("pdfDownloadButton").style.visibility = "visible";

    resultdiv.style.display = "block";
  }

  if (!resultShown) {
    resultShown = true;
  }

}

function getUrl(url, callback, value) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(value, JSON.parse(xmlHttp.responseText));
      }
      else if (xmlHttp.status === 404) {
        alert("Il semblerait que ce code postal n'existe pas...");
      }
      else {
        alert("Une erreur est survenue...")
      }
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}
