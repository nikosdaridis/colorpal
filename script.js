const root = document.querySelector(":root");
const eyeDropperButton = document.querySelector("#eye-dropper-button");
const colorPalette = document.querySelector("#color-palette");
const settingsButton = document.querySelector("#settings-button");
const copyRGBButton = document.querySelector("#copy-rgb-button");
const copyHexButton = document.querySelector("#copy-hex-button");
const copyHslButton = document.querySelector("#copy-hsl-button");
const copyHsvButton = document.querySelector("#copy-hsv-button");
const colorsTools = document.querySelector(".colors-tools");
const settingsTools = document.querySelector(".settings-tools");
const colorsButton = document.querySelector("#colors-button");
const lightDarkButton = document.querySelector("#light-dark-button");
const savedColors = document.querySelector(".saved-colors");
const collapseSavedColorsTools = document.querySelector(
  ".collapse-saved-colors-tools"
);
const collapseSavedColorsToolsIcon = document.querySelector(
  "#collapse-saved-colors-tools-icon"
);
const savedColorsTools = document.querySelector(".saved-colors-tools");
const savedColorsCount = document.querySelector(".saved-colors-count");
const moveColor = document.querySelector("#move-color");
const deleteOnClick = document.querySelector("#delete-on-click");
const deleteAll = document.querySelector("#delete-all");
const lightModeIcon = document.querySelector("#light-mode-icon");
const settingsPanel = document.querySelector(".settings-panel");
const codesMessages = document.querySelector(".codes-messages");
const saveSelectedColor = document.querySelector(".save-selected-color");
const savedColorsPanel = document.querySelector(".saved-colors-panel");
const selectedColor = document.querySelector(".selected-color .rect");
const saveColorButton = document.querySelector(".save-color-button");
const displayMessages = document.querySelector(".display-messages");
const displayMessageText = document.querySelector("#display-message-text");
const displayMessageColorCode = document.querySelector(
  "#display-message-color-code"
);
const selectedColorRGB = document.querySelector("#rgb");
const selectedColorHex = document.querySelector("#hex");
const selectedColorHSL = document.querySelector("#hsl");
const selectedColorHSV = document.querySelector("#hsv");
const autoSaveEyeDropper = document.querySelector("#auto-save-eye-dropper");
const autoCopyColorCode = document.querySelector("#auto-copy-color-code");
const colorCodeFormat = document.querySelector("#color-code-format");
const colorsPerLine = document.querySelector("#colors-per-line");
const displayMessagesOption = document.querySelector(
  "#display-messages-option"
);
const savedColorsArray = JSON.parse(
  localStorage.getItem("savedColorsArray") ?? "[]"
);
var messageTimeout, hideAnimTranTimeout;
var deletingColor = false,
  movingColor = false;

setOptions();
setPage("colors");

function setOptions() {
  // set default values if null
  setLightDarkMode(localStorage.getItem("lightDarkMode"));

  localStorage.getItem("currSelectedColor") === null
    ? setCurrentSelectedColor("#000000")
    : setCurrentSelectedColor(localStorage.getItem("currSelectedColor"));

  localStorage.getItem("autoSaveEyeDropper") ||
    localStorage.setItem("autoSaveEyeDropper", "true");

  localStorage.getItem("autoCopyColorCode") ||
    localStorage.setItem("autoCopyColorCode", "true");

  localStorage.getItem("colorCodeFormat") ||
    localStorage.setItem("colorCodeFormat", "HEX");
  colorCodeFormat.value = localStorage.getItem("colorCodeFormat");

  localStorage.getItem("colorsPerLine") ||
    localStorage.setItem("colorsPerLine", "8");
  colorsPerLine.value = localStorage.getItem("colorsPerLine");
  setColorsPerLine(parseInt(localStorage.getItem("colorsPerLine")));

  localStorage.getItem("displayMessagesOption") ||
    localStorage.setItem("displayMessagesOption", "true");

  localStorage.getItem("collapseSavedColorsTools") ||
    localStorage.setItem("collapseSavedColorsTools", "false");
  setCollapseSavedColorsTools(localStorage.getItem("collapseSavedColorsTools"));

  // set visual check boxes
  localStorage.getItem("autoSaveEyeDropper") === "true"
    ? (autoSaveEyeDropper.checked = true)
    : (autoSaveEyeDropper.checked = false);
  localStorage.getItem("autoCopyColorCode") === "true"
    ? (autoCopyColorCode.checked = true)
    : (autoCopyColorCode.checked = false);
  localStorage.getItem("displayMessagesOption") === "true"
    ? (displayMessagesOption.checked = true)
    : (displayMessagesOption.checked = false);
}

function setLightDarkMode(mode) {
  if (mode === "dark") {
    localStorage.setItem("lightDarkMode", "dark");
    root.style.setProperty("--first-color", "#24282a");
    root.style.setProperty("--second-color", "#2b353e");
    root.style.setProperty("--text-color", "#fafcff");
    lightModeIcon.setAttribute("class", "bx bxs-sun");
  } else {
    // default set light
    localStorage.setItem("lightDarkMode", "light");
    root.style.setProperty("--first-color", "#fafcff");
    root.style.setProperty("--second-color", "#e7e7f4");
    root.style.setProperty("--text-color", "#24282a");
    lightModeIcon.setAttribute("class", "bx bxs-moon");
  }
}

function setCurrentSelectedColor(currentColor) {
  localStorage.setItem("currSelectedColor", currentColor);
  savedColorsArray.includes(currentColor)
    ? saveColorButton.classList.add("hide")
    : saveColorButton.classList.remove("hide");

  colorPalette.value = localStorage.getItem("currSelectedColor");
  selectedColor.style.background = currentColor;
  root.style.setProperty(
    "--selected-color",
    localStorage.getItem("currSelectedColor")
  );

  selectedColorRGB.textContent = hexToRgb(currentColor, true);
  selectedColorHex.textContent = currentColor;
  let rgbColor = hexToRgb(currentColor, false);
  selectedColorHSL.textContent = rgbToHsl(rgbColor, true);
  selectedColorHSV.textContent = rgbToHsv(rgbColor, true);
}

function setColorsPerLine(colorsPerLine) {
  savedColors.style.setProperty(
    "grid-template-columns",
    `repeat(${String(colorsPerLine)}, 1fr)`
  );

  switch (colorsPerLine) {
    case 6:
      root.style.setProperty("--rect-height", "71px");
      root.style.setProperty("--rect-width", "71px");
      root.style.setProperty("--rect-margin", "6.5px");
      break;
    case 8:
      root.style.setProperty("--rect-height", "53px");
      root.style.setProperty("--rect-width", "53px");
      root.style.setProperty("--rect-margin", "5px");
      break;
    case 10:
      root.style.setProperty("--rect-height", "42px");
      root.style.setProperty("--rect-width", "42px");
      root.style.setProperty("--rect-margin", "4.2px");
      break;
    case 12:
      root.style.setProperty("--rect-height", "35px");
      root.style.setProperty("--rect-width", "35px");
      root.style.setProperty("--rect-margin", "3.5px");
      break;
  }
}

function setCollapseSavedColorsTools(setCollapse) {
  localStorage.setItem("collapseSavedColorsTools", setCollapse);
  if (setCollapse === "true") {
    savedColorsTools.classList.add("hide");
    collapseSavedColorsToolsIcon.setAttribute("class", "bx bxs-chevrons-left");
  } else {
    savedColorsTools.classList.remove("hide");
    collapseSavedColorsToolsIcon.setAttribute("class", "bx bxs-chevrons-right");
  }

  movingColor && setMoveColor(false);
  deletingColor && setDeleteColor(false);
  renderColors();
}

function setPage(page) {
  document.body.className = "hide-animations-transitions";

  if (page === "colors") {
    !savedColorsArray.length
      ? savedColorsPanel.classList.add("hide")
      : savedColorsPanel.classList.remove("hide");

    saveSelectedColor.classList.remove("hide");
    codesMessages.classList.remove("hide");
    colorsTools.classList.remove("hide");
    settingsTools.classList.add("hide");
    settingsPanel.classList.add("hide");

    savedColorsCount.textContent =
      savedColorsArray.length === 1
        ? "1 Color"
        : `${savedColorsArray.length} Colors`;

    // remove hide animations and transitions
    clearTimeout(hideAnimTranTimeout);
    hideAnimTranTimeout = setTimeout(() => (document.body.className = ""), 500);

    renderColors();
  } else {
    // default set settings page
    savedColorsPanel.classList.add("hide");
    saveSelectedColor.classList.add("hide");
    codesMessages.classList.add("hide");
    colorsTools.classList.add("hide");
    settingsTools.classList.remove("hide");
    settingsPanel.classList.remove("hide");
    movingColor && setMoveColor(false);
    deletingColor && setDeleteColor(false);
  }
}

function renderColors() {
  if (!savedColorsArray.length) {
    savedColorsPanel.classList.add("hide");
    return;
  }

  savedColorsPanel.classList.remove("hide");

  // add li for each color
  savedColors.innerHTML = savedColorsArray
    .map(
      (color) => `
    <li class="color">
        <span class="${
          movingColor
            ? "rect draggable"
            : deletingColor
            ? "rect deletable"
            : "rect"
        }" data-color="${color}" draggable="${String(
        movingColor
      )}" style="background: ${color};"> <i class=""></i>
      </span>
    </li>`
    )
    .join("");

  addColorsListeners();
}

function addColorsListeners() {
  // click listener
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (elem) =>
      savedColorClicked(elem.currentTarget.lastElementChild.dataset.color)
    );
  });

  // mouse enter listener
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("mouseenter", (elem) => {
      // moving color icon
      if (movingColor) {
        root.style.setProperty("--tool-icon-color", "rgb(12, 16, 233)");
        elem.target.lastElementChild.lastElementChild.setAttribute(
          "class",
          "bx bx-move"
        );
      }
      // deleting color icon
      if (deletingColor) {
        root.style.setProperty("--tool-icon-color", "rgb(231, 11, 11)");
        elem.target.lastElementChild.lastElementChild.setAttribute(
          "class",
          "bx bx-trash-alt"
        );
      }
    });
  });

  // mouse leave listener
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("mouseleave", (elem) => {
      // remove icon
      (movingColor || deletingColor) &&
        elem.target.lastElementChild.lastElementChild.setAttribute("class", "");
    });
  });

  // moving listeners
  if (!movingColor) return;

  const draggables = document.querySelectorAll(".draggable");
  let draggingColor;
  let closestColor;

  // dragging listener
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("dragover", (elem) => {
      elem.preventDefault(); // prevent dragging blocked icon
      closestColor = findClosestColor(draggables);
    });
  });

  // drag start listener
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
      draggingColor = draggable.dataset.color;
    });
  });

  // drag end listener
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragend", () => {
      if (!closestColor) return;

      let replacingIndex = -1,
        draggingIndex = -1;
      let index = 0;

      savedColorsArray.forEach((color) => {
        if (color === closestColor) replacingIndex = index;
        if (color === draggingColor) draggingIndex = index;
        index++;
      });

      if (replacingIndex === -1 || draggingIndex === -1) {
        displayMessageAndColor("Something went wrong", null, null);
        return;
      }

      displayMessageAndColor(
        `Swapped Color ${draggingIndex + 1} with ${replacingIndex + 1}`,
        null,
        null
      );

      savedColorsArray[replacingIndex] = draggingColor;
      savedColorsArray[draggingIndex] = closestColor;

      localStorage.setItem(
        "savedColorsArray",
        JSON.stringify(savedColorsArray)
      );

      draggable.classList.remove("dragging");
      renderColors();
    });
  });
}

function findClosestColor(draggables) {
  const rectSize = Number(
    getComputedStyle(root).getPropertyValue("--rect-height").replace("px", "") /
      2
  );

  let closestColor = document.querySelector(".dragging").dataset.color;
  let closestDistance = Number.MAX_VALUE;
  let distance;

  draggables.forEach((draggable) => {
    distance = getDistance(
      draggable.getBoundingClientRect().x + rectSize,
      draggable.getBoundingClientRect().y + rectSize,
      window.event.x,
      window.event.y
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = draggable.dataset.color;
    }
  });

  function getDistance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  return closestColor;
}

function displayMessageAndColor(text, color, colorFormat) {
  if (localStorage.getItem("displayMessagesOption") === "false") return;

  displayMessages.classList.remove("hide");
  displayMessageText.textContent = text;
  displayMessageColorCode.textContent = displayColorCodeString(
    color,
    colorFormat
  );

  // hide message after 2 seconds
  clearTimeout(messageTimeout);
  messageTimeout = setTimeout(
    () => displayMessages.classList.add("hide"),
    2000
  );
}

function displayColorCodeString(color, colorFormat) {
  if (color === null || colorFormat === null) return;

  let rgbColor = hexToRgb(color, false);
  switch (colorFormat) {
    case "RGB":
      return hexToRgb(color, true);
    case "HEX":
      return color;
    case "HSL":
      return rgbToHsl(rgbColor, true);
    case "HSV":
      return rgbToHsv(rgbColor, true);
  }
}

function savedColorClicked(colorClicked) {
  setCurrentSelectedColor(colorClicked);

  if (movingColor) {
    displayMessageAndColor("Drag to move Colors", null, null);
    return;
  }

  if (deletingColor) {
    deleteColor(colorClicked);
    return;
  }

  localStorage.getItem("autoCopyColorCode") === "true" &&
    copyToClipboard(colorClicked, localStorage.getItem("colorCodeFormat"));

  localStorage.getItem("autoCopyColorCode") === "true"
    ? (text = "Copied")
    : (text = "Selected");

  displayMessageAndColor(
    text,
    colorClicked,
    localStorage.getItem("colorCodeFormat")
  );
}

function saveColor(color) {
  if (savedColorsArray.includes(color)) {
    displayMessageAndColor(
      "Already Saved",
      color,
      localStorage.getItem("colorCodeFormat")
    );
    return;
  }

  savedColorsArray.push(color);
  localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));

  savedColorsCount.textContent =
    savedColorsArray.length === 1
      ? "1 Color"
      : `${savedColorsArray.length} Colors`;

  renderColors();
  saveColorButton.classList.add("hide");

  localStorage.getItem("autoCopyColorCode") === "true"
    ? (text = "Saved and Copied")
    : (text = "Saved");

  displayMessageAndColor(text, color, localStorage.getItem("colorCodeFormat"));

  localStorage.getItem("autoCopyColorCode") === "true" &&
    copyToClipboard(color, localStorage.getItem("colorCodeFormat"));
}

function copyToClipboard(color, colorFormat) {
  let rgbColor = hexToRgb(color, false);
  switch (colorFormat) {
    case "RGB":
      navigator.clipboard.writeText(hexToRgb(color, true));
      break;
    case "HEX":
      navigator.clipboard.writeText(color);
      break;
    case "HSL":
      navigator.clipboard.writeText(rgbToHsl(rgbColor, true));
      break;
    case "HSV":
      navigator.clipboard.writeText(rgbToHsv(rgbColor, true));
      break;
  }
}

function activateEyeDropper() {
  if (movingColor || deletingColor) {
    setMoveColor(false);
    setDeleteColor(false);
    renderColors();
  }

  document.body.style.display = "none";

  setTimeout(async () => {
    try {
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open(); // hex color
      setCurrentSelectedColor(sRGBHex);

      if (localStorage.getItem("autoSaveEyeDropper") === "true") {
        saveColor(sRGBHex);
        localStorage.getItem("autoCopyColorCode") === "true" &&
          copyToClipboard(sRGBHex, localStorage.getItem("colorCodeFormat"));
      } else
        displayMessageAndColor(
          "Selected",
          sRGBHex,
          localStorage.getItem("colorCodeFormat")
        );
    } catch {
      displayMessageAndColor("Closed Eye Dropper", null, null);
    }

    document.body.style.display = "block";

    document.body.className = "hide-animations-transitions";
    // remove hide animations and transitions
    setTimeout(() => (document.body.className = ""), 500);
  }, 10);
}

function deleteColor(color) {
  let deleteColorIndex = savedColorsArray.findIndex((clr) => {
    return clr === color;
  });

  savedColorsArray.splice(deleteColorIndex, 1);
  localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));

  savedColorsCount.textContent =
    savedColorsArray.length === 1
      ? "1 Color"
      : `${savedColorsArray.length} Colors`;

  renderColors();
  saveColorButton.classList.remove("hide");

  displayMessageAndColor(
    "Deleted",
    color,
    localStorage.getItem("colorCodeFormat")
  );

  if (!savedColorsArray.length) {
    setCurrentSelectedColor("#000000");
    movingColor && setMoveColor(false);
    deletingColor && setDeleteColor(false);
    savedColorsPanel.classList.add("hide");
  }
}

function deleteAllColors() {
  if (confirm("Delete All Your Colors?")) {
    savedColorsArray.length = 0;
    localStorage.setItem("savedColorsArray", "[]");
    displayMessageAndColor("Deleted All", null, null);
    setCurrentSelectedColor("#000000");
    movingColor && setMoveColor(false);
    deletingColor && setDeleteColor(false);
    savedColorsPanel.classList.add("hide");
  }
}

function setMoveColor(setMove) {
  movingColor = setMove;

  moveColor.setAttribute("class", movingColor ? "bx bx-check" : "bx bx-move");
  moveColor.style.setProperty(
    "color",
    movingColor ? "green" : "rgb(12, 16, 233)"
  );
}

function setDeleteColor(setDelete) {
  deletingColor = setDelete;

  deleteOnClick.setAttribute(
    "class",
    deletingColor ? "bx bx-check" : "bx bx-trash"
  );
  deleteOnClick.style.setProperty(
    "color",
    deletingColor ? "green" : "rgb(231, 11, 11)"
  );
}

function hexToRgb(hex, returnString) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  if (returnString) return `rgb(${r}, ${g}, ${b})`;
  else return { r, g, b };
}

function rgbToHsl(rbg, returnString) {
  (r = rbg.r / 255), (g = rbg.g / 255), (b = rbg.b / 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  if (returnString) return `hsl(${h}, ${s}%, ${l}%)`;
  else return { h, s, l };
}

function rgbToHsv(rbg, returnString) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = rbg.r / 255;
  gabs = rbg.g / 255;
  babs = rbg.b / 255;
  (v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
  diffc = (c) => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = (num) => Math.round(num * 100) / 100;
  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  v = Math.round(v * 100);

  if (returnString) return `hsv(${h}, ${s}%, ${v}%)`;
  else return { h, s, v };
}

eyeDropperButton.addEventListener("click", activateEyeDropper);
settingsButton.addEventListener("click", function () {
  setPage("settings");
});

colorsButton.addEventListener("click", function () {
  setPage("colors");
});

lightDarkButton.addEventListener("click", function () {
  // toggle mode
  localStorage.getItem("lightDarkMode") === "light"
    ? setLightDarkMode("dark")
    : setLightDarkMode("light");
});

copyRGBButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem("currSelectedColor"), "RGB");
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("currSelectedColor"),
    "RGB"
  );
});

copyHexButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem("currSelectedColor"), "HEX");
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("currSelectedColor"),
    "HEX"
  );
});

copyHslButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem("currSelectedColor"), "HSL");
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("currSelectedColor"),
    "HSL"
  );
});

copyHsvButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem("currSelectedColor"), "HSV");
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("currSelectedColor"),
    "HSV"
  );
});

saveColorButton.addEventListener("click", function () {
  saveColor(localStorage.getItem("currSelectedColor"));
});

selectedColor.addEventListener("click", function () {
  colorPalette.click();
});

collapseSavedColorsTools.addEventListener("click", function () {
  localStorage.getItem("collapseSavedColorsTools") === "true"
    ? setCollapseSavedColorsTools("false")
    : setCollapseSavedColorsTools("true");
});

moveColor.addEventListener("click", function () {
  setMoveColor(!movingColor);
  setDeleteColor(false);
  renderColors();
});

deleteOnClick.addEventListener("click", function () {
  setDeleteColor(!deletingColor);
  setMoveColor(false);
  renderColors();
});

deleteAll.addEventListener("click", deleteAllColors);

colorPalette.addEventListener("input", function () {
  setCurrentSelectedColor(colorPalette.value);
  displayMessageAndColor(
    "Selected",
    colorPalette.value,
    localStorage.getItem("colorCodeFormat")
  );
});

colorPalette.addEventListener("click", function () {
  if (movingColor || deletingColor) {
    setMoveColor(false);
    setDeleteColor(false);
    renderColors();
  }
});

autoSaveEyeDropper.addEventListener("change", function () {
  this.checked
    ? localStorage.setItem("autoSaveEyeDropper", "true")
    : localStorage.setItem("autoSaveEyeDropper", "false");
});

autoCopyColorCode.addEventListener("change", function () {
  this.checked
    ? localStorage.setItem("autoCopyColorCode", "true")
    : localStorage.setItem("autoCopyColorCode", "false");
});

colorCodeFormat.addEventListener("change", function () {
  localStorage.setItem("colorCodeFormat", colorCodeFormat.value);
});

colorsPerLine.addEventListener("change", function () {
  localStorage.setItem("colorsPerLine", colorsPerLine.value);
  setColorsPerLine(parseInt(colorsPerLine.value));
});

displayMessagesOption.addEventListener("change", function () {
  this.checked
    ? localStorage.setItem("displayMessagesOption", "true")
    : localStorage.setItem("displayMessagesOption", "false");
});
