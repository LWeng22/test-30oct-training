(function () {
  // Points awarded when a pair of departments is adjacent.
  var RATING_POINTS = { A: 1000, E: 100, I: 10, O: 1, U: 0, X: -1000 };
  var RATING_MEANING = {
    A: "Absolutely necessary",
    E: "Especially important",
    I: "Important",
    O: "Ordinary closeness is okay",
    U: "Unimportant",
    X: "Undesirable – keep apart"
  };
  var GRID_ROWS = 5;
  var GRID_COLS = 5;
  var MIN_DEPARTMENTS = 2;
  var MAX_DEPARTMENTS = 8;

  // Adjacent means sharing a side; diagonal neighbours do not count.
  function isAdjacent(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  var nextId = 5;
  var departments = [
    { id: 1, name: "Receiving" },
    { id: 2, name: "Storage" },
    { id: 3, name: "Assembly" },
    { id: 4, name: "Shipping" }
  ];
  var ratings = { "1-2": "A", "2-3": "E", "3-4": "A", "1-4": "X" };
  var placement = [];
  var selectedId = null;

  function $(id) {
    return document.getElementById(id);
  }

  function make(tag, text, className) {
    var node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function pairKey(a, b) {
    return a < b ? a + "-" + b : b + "-" + a;
  }

  function nameOf(id) {
    for (var i = 0; i < departments.length; i++) {
      if (departments[i].id === id) {
        return departments[i].name.trim() || "Department " + (i + 1);
      }
    }
    return "";
  }

  function cellOf(id) {
    var index = placement.indexOf(id);
    if (index === -1) return null;
    return { row: Math.floor(index / GRID_COLS), col: index % GRID_COLS };
  }

  function clearGrid() {
    placement = [];
    for (var i = 0; i < GRID_ROWS * GRID_COLS; i++) placement.push(null);
  }

  function renderLegend() {
    var list = $("legend");
    Object.keys(RATING_POINTS).forEach(function (letter) {
      var points = RATING_POINTS[letter];
      list.appendChild(
        make("li", letter + " – " + RATING_MEANING[letter] + " (" + points + (Math.abs(points) === 1 ? " point" : " points") + " when adjacent)")
      );
    });
  }

  function renderDepartments() {
    var list = $("department-list");
    list.textContent = "";
    departments.forEach(function (dept, i) {
      var item = make("li");
      var input = make("input");
      input.type = "text";
      input.value = dept.name;
      input.maxLength = 24;
      input.setAttribute("aria-label", "Name of department " + (i + 1));
      input.addEventListener("input", function () {
        dept.name = input.value;
        renderRatings();
        renderTray();
        renderGrid();
        renderScore();
      });
      var remove = make("button", "Remove");
      remove.type = "button";
      remove.disabled = departments.length <= MIN_DEPARTMENTS;
      remove.setAttribute("aria-label", "Remove " + nameOf(dept.id));
      remove.addEventListener("click", function () {
        removeDepartment(dept.id);
      });
      item.appendChild(input);
      item.appendChild(remove);
      list.appendChild(item);
    });
    $("add-department").disabled = departments.length >= MAX_DEPARTMENTS;
  }

  function removeDepartment(id) {
    departments = departments.filter(function (d) {
      return d.id !== id;
    });
    Object.keys(ratings).forEach(function (key) {
      var parts = key.split("-");
      if (Number(parts[0]) === id || Number(parts[1]) === id) delete ratings[key];
    });
    placement = placement.map(function (cell) {
      return cell === id ? null : cell;
    });
    if (selectedId === id) selectedId = null;
    renderAll();
  }

  function renderRatings() {
    var list = $("rating-list");
    list.textContent = "";
    for (var i = 0; i < departments.length; i++) {
      for (var j = i + 1; j < departments.length; j++) {
        list.appendChild(ratingRow(departments[i], departments[j]));
      }
    }
  }

  function ratingRow(first, second) {
    var key = pairKey(first.id, second.id);
    var row = make("div", undefined, "rating-row");
    var selectId = "rating-" + key;
    var label = make("label", nameOf(first.id) + " and " + nameOf(second.id));
    label.setAttribute("for", selectId);
    var select = make("select");
    select.id = selectId;
    Object.keys(RATING_POINTS).forEach(function (letter) {
      var option = make("option", letter + " – " + RATING_MEANING[letter]);
      option.value = letter;
      select.appendChild(option);
    });
    select.value = ratings[key] || "U";
    select.addEventListener("change", function () {
      ratings[key] = select.value;
      renderScore();
    });
    row.appendChild(label);
    row.appendChild(select);
    return row;
  }

  function renderTray() {
    var tray = $("tray");
    tray.textContent = "";
    departments.forEach(function (dept) {
      var chip = make("button", nameOf(dept.id), "chip");
      chip.type = "button";
      chip.setAttribute("aria-pressed", String(selectedId === dept.id));
      if (placement.indexOf(dept.id) !== -1) chip.classList.add("placed");
      chip.addEventListener("click", function () {
        selectedId = selectedId === dept.id ? null : dept.id;
        renderTray();
        renderGrid();
      });
      tray.appendChild(chip);
    });
    var selectedPlaced = selectedId !== null && placement.indexOf(selectedId) !== -1;
    $("remove-selected").disabled = !selectedPlaced;
    if (selectedId === null) {
      $("grid-hint").textContent = "Choose a department below, then choose an empty square to place it.";
    } else {
      $("grid-hint").textContent = nameOf(selectedId) + " is selected. Choose an empty square to place it there.";
    }
  }

  function renderGrid() {
    var grid = $("grid");
    grid.textContent = "";
    grid.style.gridTemplateColumns = "repeat(" + GRID_COLS + ", 1fr)";
    placement.forEach(function (id, index) {
      var row = Math.floor(index / GRID_COLS) + 1;
      var col = (index % GRID_COLS) + 1;
      var cell = make("button", id === null ? "" : nameOf(id), "cell");
      cell.type = "button";
      cell.setAttribute(
        "aria-label",
        "Row " + row + ", column " + col + ": " + (id === null ? "empty" : nameOf(id))
      );
      if (id !== null) {
        cell.classList.add("occupied");
        cell.title = nameOf(id);
        if (id === selectedId) cell.classList.add("selected");
      }
      cell.addEventListener("click", function () {
        onCellClick(index);
      });
      grid.appendChild(cell);
    });
  }

  function onCellClick(index) {
    var occupant = placement[index];
    if (occupant !== null) {
      selectedId = occupant;
    } else if (selectedId !== null) {
      var old = placement.indexOf(selectedId);
      if (old !== -1) placement[old] = null;
      placement[index] = selectedId;
      selectedId = null;
    }
    renderTray();
    renderGrid();
    renderScore();
  }

  function formatPoints(n) {
    return n > 0 ? "+" + n : String(n);
  }

  function renderScore() {
    var body = $("breakdown");
    body.textContent = "";
    var total = 0;
    for (var i = 0; i < departments.length; i++) {
      for (var j = i + 1; j < departments.length; j++) {
        var a = departments[i];
        var b = departments[j];
        var rating = ratings[pairKey(a.id, b.id)] || "U";
        if (rating === "U") continue;
        var cellA = cellOf(a.id);
        var cellB = cellOf(b.id);
        var result;
        var points = 0;
        if (!cellA || !cellB) {
          result = "Not placed yet";
        } else if (isAdjacent(cellA, cellB)) {
          points = RATING_POINTS[rating];
          result = "Adjacent";
        } else if (rating === "X") {
          result = "Kept apart";
        } else if (RATING_POINTS[rating] >= RATING_POINTS.E) {
          result = "Not adjacent (missed chance)";
        } else {
          result = "Not adjacent";
        }
        total += points;
        var row = make("tr");
        row.appendChild(make("td", nameOf(a.id) + " – " + nameOf(b.id)));
        row.appendChild(make("td", rating));
        row.appendChild(make("td", result));
        row.appendChild(make("td", formatPoints(points)));
        body.appendChild(row);
      }
    }
    $("total").textContent = String(total);
    var unplaced = departments.filter(function (d) {
      return placement.indexOf(d.id) === -1;
    }).length;
    $("unplaced-note").textContent =
      unplaced === 0 ? "" : unplaced + " department" + (unplaced === 1 ? " is" : "s are") + " not on the grid yet.";
  }

  function renderAll() {
    renderDepartments();
    renderRatings();
    renderTray();
    renderGrid();
    renderScore();
  }

  document.addEventListener("DOMContentLoaded", function () {
    clearGrid();
    renderLegend();
    $("add-department").addEventListener("click", function () {
      departments.push({ id: nextId++, name: "Department " + (departments.length + 1) });
      renderAll();
    });
    $("remove-selected").addEventListener("click", function () {
      var index = placement.indexOf(selectedId);
      if (index !== -1) placement[index] = null;
      selectedId = null;
      renderAll();
    });
    $("clear-grid").addEventListener("click", function () {
      clearGrid();
      selectedId = null;
      renderAll();
    });
    renderAll();
  });
})();
