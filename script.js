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
const collapseColorToolsIcon = document.querySelector(
  "#collapse-color-tools-icon"
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
  localStorage.getItem("colorpal-saved-colors-array") ??
    localStorage.getItem("savedColorsArray") ?? // old localStorage name
    "[]"
);
var messageTimeout, hideAnimTranTimeout;
var rectSize;
var deletingColor = false,
  movingColor = false;

setOptions();
setPage("colors");

function setOptions() {
  // set default values if null
  setLightDarkMode(localStorage.getItem("colorpal-light-dark-mode"));

  localStorage.getItem("colorpal-current-selected-color") ??
    localStorage.setItem("colorpal-current-selected-color", "#000000");
  setCurrentSelectedColor(
    localStorage.getItem("colorpal-current-selected-color")
  );

  localStorage.getItem("colorpal-auto-save-eye-dropper") ??
    localStorage.setItem("colorpal-auto-save-eye-dropper", "true");

  localStorage.getItem("colorpal-auto-copy-color-code") ??
    localStorage.setItem("colorpal-auto-copy-color-code", "true");

  localStorage.getItem("colorpal-color-code-format") ??
    localStorage.setItem("colorpal-color-code-format", "HEX");
  colorCodeFormat.value = localStorage.getItem("colorpal-color-code-format");

  localStorage.getItem("colorpal-colors-per-line") ??
    localStorage.setItem("colorpal-colors-per-line", "8");
  colorsPerLine.value = localStorage.getItem("colorpal-colors-per-line");
  setColorsPerLine(parseInt(localStorage.getItem("colorpal-colors-per-line")));

  localStorage.getItem("colorpal-display-messages") ??
    localStorage.setItem("colorpal-display-messages", "true");

  localStorage.getItem("colorpal-collapsed-color-tools") ??
    localStorage.setItem("colorpal-collapsed-color-tools", "false");
  setCollapsedColorTools(
    localStorage.getItem("colorpal-collapsed-color-tools")
  );

  // set visual check boxes
  localStorage.getItem("colorpal-auto-save-eye-dropper") === "true"
    ? (autoSaveEyeDropper.checked = true)
    : (autoSaveEyeDropper.checked = false);
  localStorage.getItem("colorpal-auto-copy-color-code") === "true"
    ? (autoCopyColorCode.checked = true)
    : (autoCopyColorCode.checked = false);
  localStorage.getItem("colorpal-display-messages") === "true"
    ? (displayMessagesOption.checked = true)
    : (displayMessagesOption.checked = false);
}

function setLightDarkMode(mode) {
  if (mode === "dark") {
    localStorage.setItem("colorpal-light-dark-mode", "dark");
    root.style.setProperty("--first-color", "#24282a");
    root.style.setProperty("--second-color", "#2b353e");
    root.style.setProperty("--text-color", "#fafcff");
    lightModeIcon.setAttribute("class", "bx bxs-sun");
  } else {
    // default set light
    localStorage.setItem("colorpal-light-dark-mode", "light");
    root.style.setProperty("--first-color", "#fafcff");
    root.style.setProperty("--second-color", "#e7e7f4");
    root.style.setProperty("--text-color", "#24282a");
    lightModeIcon.setAttribute("class", "bx bxs-moon");
  }
}

function setCurrentSelectedColor(currentColor) {
  localStorage.setItem("colorpal-current-selected-color", currentColor);
  savedColorsArray.includes(currentColor)
    ? saveColorButton.classList.add("hide")
    : saveColorButton.classList.remove("hide");

  colorPalette.value = localStorage.getItem("colorpal-current-selected-color");
  selectedColor.style.background = currentColor;
  root.style.setProperty(
    "--selected-color",
    localStorage.getItem("colorpal-current-selected-color")
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

  rectSize = Number(
    getComputedStyle(root).getPropertyValue("--rect-height").replace("px", "")
  );
}

function setCollapsedColorTools(setCollapsed) {
  localStorage.setItem("colorpal-collapsed-color-tools", setCollapsed);
  if (setCollapsed === "true") {
    savedColorsTools.classList.add("hide");
    collapseColorToolsIcon.setAttribute("class", "bx bxs-chevrons-right");
  } else {
    savedColorsTools.classList.remove("hide");
    collapseColorToolsIcon.setAttribute("class", "bx bxs-chevrons-left");
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
        <span class="rect${
          movingColor ? " draggable" : deletingColor ? " deletable" : ""
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
  document.querySelectorAll(".color .rect").forEach((li) => {
    li.addEventListener("click", (elem) =>
      savedColorClicked(elem.currentTarget.dataset.color)
    );

    // moving and deleting listeners
    if (!movingColor && !deletingColor) return;

    // mouse enter listener
    li.addEventListener("mouseenter", (elem) => {
      // moving or deleting icon
      elem.target.lastElementChild.setAttribute(
        "class",
        `${movingColor ? "bx bx-move" : deletingColor ? "bx bx-trash-alt" : ""}`
      );

      root.style.setProperty(
        "--tool-icon-color",
        `${
          movingColor
            ? "rgb(12, 16, 233)"
            : deletingColor
            ? "rgb(231, 11, 11)"
            : ""
        }`
      );
    });

    // mouse leave listener
    li.addEventListener("mouseleave", (elem) => {
      // remove icon
      elem.target.lastElementChild.setAttribute("class", "");
    });
  });

  // moving listeners
  if (!movingColor) return;

  let draggables = document.querySelectorAll(".draggable");
  let draggingColor;
  let closestColorElement;
  let mouseOverColor = true;

  draggables.forEach((draggable) => {
    // drag enter listener
    draggable.addEventListener("dragenter", () => {
      mouseOverColor = true;
    });

    // drag leave listener
    draggable.addEventListener("dragleave", () => {
      mouseOverColor = false;
      draggable.classList.remove("closest");
    });

    // dragging listener
    draggable.addEventListener("dragover", (elem) => {
      elem.preventDefault(); // prevent dragging blocked icon
      closestColorElement = findClosestColor(draggables);
    });

    // drag start listener
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
      draggingColor = draggable.dataset.color;
    });

    // drag end listener
    draggable.addEventListener("dragend", () => {
      if (
        !closestColorElement ||
        !mouseOverColor ||
        draggingColor === closestColorElement.dataset.color
      ) {
        displayMessageAndColor(
          `${
            !closestColorElement
              ? "Didn't find the closest color"
              : !mouseOverColor
              ? "Drag over a color"
              : draggingColor === closestColorElement.dataset.color
              ? "Drag over another color"
              : ""
          }`,
          null,
          null
        );
        draggable.classList.remove("closest");
        draggable.classList.remove("dragging");
        return;
      }

      SwapColors(draggable, draggingColor, closestColorElement);
    });
  });
}

function SwapColors(draggable, draggingColor, closestColorElement) {
  let replacingIndex = -1,
    draggingIndex = -1;
  let index = 0;

  savedColorsArray.forEach((color) => {
    if (color === closestColorElement.dataset.color) replacingIndex = index;
    if (color === draggingColor) draggingIndex = index;
    index++;
  });

  if (replacingIndex === -1 || draggingIndex === -1) {
    displayMessageAndColor("Something went wrong", null, null);
    return;
  }

  savedColorsArray[replacingIndex] = draggingColor;
  savedColorsArray[draggingIndex] = closestColorElement.dataset.color;

  localStorage.setItem(
    "colorpal-saved-colors-array",
    JSON.stringify(savedColorsArray)
  );

  displayMessageAndColor(
    `Swapped color ${draggingIndex + 1} with ${replacingIndex + 1}`,
    null,
    null
  );

  draggable.classList.remove("dragging");
  renderColors();
}

function findClosestColor(draggables) {
  let closestColorElement = document.querySelector(".dragging");
  let closestDistance = Number.MAX_VALUE;
  let distance;

  draggables.forEach((draggable) => {
    distance = getDistance(
      draggable.getBoundingClientRect().x + rectSize / 2,
      draggable.getBoundingClientRect().y + rectSize / 2,
      window.event.x,
      window.event.y
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestColorElement = draggable;
    }

    draggable.classList.remove("closest");
  });

  closestColorElement.classList.add("closest");

  function getDistance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  return closestColorElement;
}

function displayMessageAndColor(text, color, colorFormat) {
  if (localStorage.getItem("colorpal-display-messages") === "false") return;

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
    displayMessageAndColor("Drag to move color", null, null);
    return;
  }

  if (deletingColor) {
    deleteColor(colorClicked);
    return;
  }

  localStorage.getItem("colorpal-auto-copy-color-code") === "true" &&
    copyToClipboard(
      colorClicked,
      localStorage.getItem("colorpal-color-code-format")
    );

  localStorage.getItem("colorpal-auto-copy-color-code") === "true"
    ? (text = "Copied")
    : (text = "Selected");

  displayMessageAndColor(
    text,
    colorClicked,
    localStorage.getItem("colorpal-color-code-format")
  );
}

function saveColor(color) {
  if (savedColorsArray.includes(color)) {
    displayMessageAndColor(
      "Already saved",
      color,
      localStorage.getItem("colorpal-color-code-format")
    );
    return;
  }

  savedColorsArray.push(color);
  localStorage.setItem(
    "colorpal-saved-colors-array",
    JSON.stringify(savedColorsArray)
  );

  savedColorsCount.textContent =
    savedColorsArray.length === 1
      ? "1 Color"
      : `${savedColorsArray.length} Colors`;

  renderColors();
  saveColorButton.classList.add("hide");

  localStorage.getItem("colorpal-auto-copy-color-code") === "true"
    ? (text = "Saved and Copied")
    : (text = "Saved");

  displayMessageAndColor(
    text,
    color,
    localStorage.getItem("colorpal-color-code-format")
  );

  localStorage.getItem("colorpal-auto-copy-color-code") === "true" &&
    copyToClipboard(color, localStorage.getItem("colorpal-color-code-format"));
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

      if (localStorage.getItem("colorpal-auto-save-eye-dropper") === "true") {
        saveColor(sRGBHex);
        localStorage.getItem("colorpal-auto-copy-color-code") === "true" &&
          copyToClipboard(
            sRGBHex,
            localStorage.getItem("colorpal-color-code-format")
          );
      } else
        displayMessageAndColor(
          "Selected",
          sRGBHex,
          localStorage.getItem("colorpal-color-code-format")
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
  localStorage.setItem(
    "colorpal-saved-colors-array",
    JSON.stringify(savedColorsArray)
  );

  savedColorsCount.textContent =
    savedColorsArray.length === 1
      ? "1 Color"
      : `${savedColorsArray.length} Colors`;

  renderColors();
  saveColorButton.classList.remove("hide");

  displayMessageAndColor(
    "Deleted",
    color,
    localStorage.getItem("colorpal-color-code-format")
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
    localStorage.setItem("colorpal-saved-colors-array", "[]");
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
  localStorage.getItem("colorpal-light-dark-mode") === "light"
    ? setLightDarkMode("dark")
    : setLightDarkMode("light");
});

copyRGBButton.addEventListener("click", function () {
  copyToClipboard(
    localStorage.getItem("colorpal-current-selected-color"),
    "RGB"
  );
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("colorpal-current-selected-color"),
    "RGB"
  );
});

copyHexButton.addEventListener("click", function () {
  copyToClipboard(
    localStorage.getItem("colorpal-current-selected-color"),
    "HEX"
  );
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("colorpal-current-selected-color"),
    "HEX"
  );
});

copyHslButton.addEventListener("click", function () {
  copyToClipboard(
    localStorage.getItem("colorpal-current-selected-color"),
    "HSL"
  );
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("colorpal-current-selected-color"),
    "HSL"
  );
});

copyHsvButton.addEventListener("click", function () {
  copyToClipboard(
    localStorage.getItem("colorpal-current-selected-color"),
    "HSV"
  );
  displayMessageAndColor(
    "Copied",
    localStorage.getItem("colorpal-current-selected-color"),
    "HSV"
  );
});

saveColorButton.addEventListener("click", function () {
  saveColor(localStorage.getItem("colorpal-current-selected-color"));
});

selectedColor.addEventListener("click", function () {
  colorPalette.click();
});

collapseSavedColorsTools.addEventListener("click", function () {
  localStorage.getItem("colorpal-collapsed-color-tools") === "true"
    ? setCollapsedColorTools("false")
    : setCollapsedColorTools("true");
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
    localStorage.getItem("colorpal-color-code-format")
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
    ? localStorage.setItem("colorpal-auto-save-eye-dropper", "true")
    : localStorage.setItem("colorpal-auto-save-eye-dropper", "false");
});

autoCopyColorCode.addEventListener("change", function () {
  this.checked
    ? localStorage.setItem("colorpal-auto-copy-color-code", "true")
    : localStorage.setItem("colorpal-auto-copy-color-code", "false");
});

colorCodeFormat.addEventListener("change", function () {
  localStorage.setItem("colorpal-color-code-format", colorCodeFormat.value);
});

colorsPerLine.addEventListener("change", function () {
  localStorage.setItem("colorpal-colors-per-line", colorsPerLine.value);
  setColorsPerLine(parseInt(colorsPerLine.value));
});

displayMessagesOption.addEventListener("change", function () {
  this.checked
    ? localStorage.setItem("colorpal-display-messages", "true")
    : localStorage.setItem("colorpal-display-messages", "false");
});
