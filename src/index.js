import {where} from "underscore";
const Vue = require("./js/vendor/vue.min.js");

// 
// ======================================================/
const ajaxUrl = "src/js/ajax/bonsai.json";
const store = {
  debug: true,
  state: {
    message: "",
    filteredId: ""
  },
  ajaxLoader: () => {
    let request = new XMLHttpRequest();
    request.open("GET", ajaxUrl, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(request.responseText);
        store.state.message = data.bonsai;
        console.log("loaded");

      } else {
        // console.log();
      }
    };
    request.onerror = () => {
      // console.log();
    };
    request.send();
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
  }
};

// 
// ======================================================/
const vmA = new Vue({
  el: "#app",
  data: {
    privateState: {},
    sharedState: store.state
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
store.ajaxLoader();

(function () {
  var run = () => {
    console.log("document ready");
    document.getElementById("filterSpecies").onclick = store.filter;
    $(document.body).on('click', 'img', function () {
      store.filterId(this.id);
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