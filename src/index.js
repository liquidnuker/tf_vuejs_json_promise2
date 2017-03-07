import "./styles/main.scss";

import {where} from "underscore";
const Vue = require("./js/vendor/vue.min.js");

// 
// ======================================================/
const jsonUrl = "src/js/ajax/bonsai.json";
const jsonLoader = {
  start: (url) => {
    return new Promise(function (resolve, reject) {
      let req = new XMLHttpRequest();
      req.open("GET", url);

      req.onload = function () {
        if (req.status == 200) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function () {
        reject(Error("error"));
      };

      req.send();
    });
  },
  getJSON: (url) => {
    return jsonLoader.start(url).then(JSON.parse);
  },
  filter: () => {
    store.state.message = where(store.state.message, {
      species: "Jukan"
    });
  },
  filterId: (idToFilter) => {
    store.state.filteredId = where(store.state.message, {
      id: idToFilter
    });
    console.log(store.state.filteredId);
  },
  preloader: () => {
    const spinner = `<div class="sk-wave">
      <div class="sk-rect sk-rect1"></div>
      <div class="sk-rect sk-rect2"></div>
      <div class="sk-rect sk-rect3"></div>
      <div class="sk-rect sk-rect4"></div>
      <div class="sk-rect sk-rect5"></div>
      </div>`;
    document.getElementById("loader").innerHTML = spinner;
  }
};

// 
// ======================================================/
const store = {
  debug: true,
  state: {
    message: "",
    filteredId: ""
  }
};

// 
// ======================================================/
const vmA = new Vue({
  el: "#app",
  data: {
    privateState: {},
    sharedState: store.state,
    loader: true
  }
});

const vmB = new Vue({
  el: "#app2",
  data: {
    privateState: {},
    sharedState: store.state
  }
});

const vmC = new Vue({
  el: "#descriptionBox",
  data: {
    privateState: {},
    sharedState: store.state
  }
});

// 
// ======================================================/
jsonLoader.preloader();
jsonLoader.getJSON(jsonUrl)
  .then(function (response) {
    // console.log(response.bonsai.length);
    store.state.message = response.bonsai;
    vmA.loader = false;
  });

(function () {
  const run = () => {
    console.log("document ready");
    document.getElementById("filterSpecies").onclick = jsonLoader.filter;
    $(document.body).on("click", "img", function () {
      jsonLoader.filterId(this.id);
    });

  };
  // in case the document is already rendered
  if (document.readyState !== "loading") run();
  // modern browsers
  else if (document.addEventListener) document.addEventListener("DOMContentLoaded", run);
  // IE <= 8
  else document.attachEvent("onreadystatechange", () => {
    if (document.readyState === "complete") run();
  });
})();