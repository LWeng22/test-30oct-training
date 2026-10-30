// Tool panels open when the address ends in their id (e.g. #tool-1)
// and close when it doesn't (Home, Back, or the browser's Back button).
(function () {
  function show(moveFocus) {
    var id = window.location.hash.slice(1);
    var open = null;
    document.querySelectorAll("[data-tool-panel]").forEach(function (panel) {
      var match = panel.id === id;
      panel.hidden = !match;
      if (match) open = panel;
    });
    document.getElementById("home").hidden = open !== null;
    if (moveFocus) {
      var heading = open ? open.querySelector("h1") : document.querySelector("#home h1");
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", function () {
    show(true);
  });
  document.addEventListener("DOMContentLoaded", function () {
    show(false);
  });
})();
