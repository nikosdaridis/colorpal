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
const themeButton = document.querySelector("#theme-button");
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
const themeIcon = document.querySelector("#theme-icon");
const settingsPanel = document.querySelector(".settings-panel");
const codesMessages = document.querySelector(".codes-messages");
const selectedColorRect = document.querySelector(".selected-color-rect");
const savedColorsPanel = document.querySelector(".saved-colors-panel");
const selectedColor = document.querySelector(".selected-color .rect");
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
  localStorage.getItem("colorpal-saved-colors-array") ?? "[]"
);
const latestVersion = "1.2.4";
var messageTimeout, hideAnimTranTimeout;
var deletingColor = false,
  movingColor = false;

setOptions();
setPage("colors");

latestVersion !== localStorage.getItem("colorpal-version") && newVersion();

function newVersion() {
  localStorage.setItem("colorpal-version", latestVersion);
  // future code
}

function setOptions() {
  setTheme(localStorage.getItem("colorpal-theme") ?? "dark");

  setCurrentSelectedColor(
    localStorage.getItem("colorpal-current-selected-color") ?? "#000000"
  );

  localStorage.getItem("colorpal-auto-save-eye-dropper") ??
    localStorage.setItem("colorpal-auto-save-eye-dropper", "true");

  localStorage.getItem("colorpal-auto-copy-color-code") ??
    localStorage.setItem("colorpal-auto-copy-color-code", "true");

  localStorage.getItem("colorpal-color-code-format") ??
    localStorage.setItem("colorpal-color-code-format", "HEX");
  colorCodeFormat.value = localStorage.getItem("colorpal-color-code-format");

  setColorsPerLine(localStorage.getItem("colorpal-colors-per-line") ?? "6");

  localStorage.getItem("colorpal-display-messages") ??
    localStorage.setItem("colorpal-display-messages", "true");

  setCollapsedColorTools(
    JSON.parse(localStorage.getItem("colorpal-collapsed-color-tools")) ?? false
  );

  // visual check boxes
  autoSaveEyeDropper.checked = JSON.parse(
    localStorage.getItem("colorpal-auto-save-eye-dropper")
  );

  autoCopyColorCode.checked = JSON.parse(
    localStorage.getItem("colorpal-auto-copy-color-code")
  );

  displayMessagesOption.checked = JSON.parse(
    localStorage.getItem("colorpal-display-messages")
  );
}

function setTheme(theme) {
  localStorage.setItem("colorpal-theme", theme === "light" ? "light" : "dark");

  root.style.setProperty(
    "--primary-color",
    theme === "dark" ? "#24282a" : "#fafcff"
  );

  root.style.setProperty(
    "--secondary-color",
    theme === "dark" ? "#2b353e" : "#e7e7f4"
  );

  root.style.setProperty(
    "--text-color",
    theme === "dark" ? "#fafcff" : "#24282a"
  );

  root.style.setProperty(
    "--theme-filter",
    theme === "dark"
      ? "invert(89%) sepia(7%) saturate(1464%) hue-rotate(196deg) brightness(103%) contrast(121%)"
      : "invert(11%) sepia(9%) saturate(660%) hue-rotate(155deg) brightness(95%) contrast(87%)"
  );

  themeIcon.setAttribute(
    "src",
    theme === "dark" ? "icons/light.svg" : "icons/dark.svg"
  );
}

function setCurrentSelectedColor(currentColor) {
  localStorage.setItem("colorpal-current-selected-color", currentColor);

  selectedColor.lastElementChild.setAttribute(
    "src",
    `${savedColorsArray.includes(currentColor) ? "" : "icons/save.svg"}`
  );

  colorPalette.value = currentColor;
  selectedColor.style.background = currentColor;
  root.style.setProperty("--selected-color", currentColor);

  selectedColorRGB.textContent = hexToRgb(currentColor, true);
  selectedColorHex.textContent = currentColor;
  let rgbColor = hexToRgb(currentColor, false);
  selectedColorHSL.textContent = rgbToHsl(rgbColor, true);
  selectedColorHSV.textContent = rgbToHsv(rgbColor, true);
}

function setColorsPerLine(clrPerLine) {
  clrPerLine = Number(clrPerLine);
  if (clrPerLine < 5 || clrPerLine > 10) clrPerLine = 7;

  localStorage.setItem("colorpal-colors-per-line", clrPerLine);

  colorsPerLine.value = clrPerLine;

  savedColors.style.setProperty(
    "grid-template-columns",
    `repeat(${String(clrPerLine)}, 1fr)`
  );

  root.style.setProperty(
    "--rect-size",
    `${
      (clrPerLine === 5 && "56.8px") ||
      (clrPerLine === 6 && "47.2px") ||
      (clrPerLine === 7 && "40.5px") ||
      (clrPerLine === 8 && "35.4px") ||
      (clrPerLine === 9 && "31.5px") ||
      (clrPerLine === 10 && "28.3px")
    }`
  );
}

function setCollapsedColorTools(isCollapsed) {
  localStorage.setItem("colorpal-collapsed-color-tools", isCollapsed);

  isCollapsed
    ? savedColorsTools.classList.add("hide")
    : savedColorsTools.classList.remove("hide");

  collapseColorToolsIcon.setAttribute(
    "src",
    isCollapsed ? "icons/arrowsRight.svg" : "icons/arrowsLeft.svg"
  );

  movingColor && setMoveColor(false);
  deletingColor && setDeleteColor(false);
  renderColors();
}

function setPage(page) {
  document.body.className = "hide-animations";

  if (page === "colors") {
    settingsTools.classList.add("hide");
    settingsPanel.classList.add("hide");
    colorsTools.classList.remove("hide");
    selectedColorRect.classList.remove("hide");
    codesMessages.classList.remove("hide");

    clearTimeout(hideAnimTranTimeout);
    hideAnimTranTimeout = setTimeout(function () {
      document.body.className = "";
    }, 400);

    setColorsCount();
    renderColors();
  } else if (page === "settings") {
    colorsTools.classList.add("hide");
    selectedColorRect.classList.add("hide");
    codesMessages.classList.add("hide");
    savedColorsPanel.classList.add("hide");
    settingsTools.classList.remove("hide");
    settingsPanel.classList.remove("hide");

    movingColor && setMoveColor(false);
    deletingColor && setDeleteColor(false);
  }
}

function setColorsCount() {
  savedColorsCount.textContent =
    savedColorsArray.length === 1
      ? "1 Color"
      : `${savedColorsArray.length} Colors`;
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
      )}" style="background: ${color};"> <img src="" draggable=false />
      </span>
    </li>`
    )
    .join("");
  addColorListeners();
}

function addColorListeners() {
  document.querySelectorAll(".color .rect").forEach((color) => {
    // click listener
    color.addEventListener("click", (elem) =>
      savedColorClicked(elem.currentTarget.dataset.color)
    );

    // moving and deleting listeners
    if (!movingColor && !deletingColor) return;

    // mouse enter listener
    color.addEventListener("mouseenter", (elem) => {
      elem.target.lastElementChild.setAttribute(
        "src",
        `icons/${(movingColor && "move") || (deletingColor && "delete")}.svg`
      );

      root.style.setProperty(
        "--tool-icon-filter",
        movingColor
          ? "invert(44%) sepia(28%) saturate(4405%) hue-rotate(178deg) brightness(98%) contrast(95%) drop-shadow(0 0 2px black)"
          : deletingColor
          ? "invert(29%) sepia(79%) saturate(7465%) hue-rotate(354deg) brightness(87%) contrast(103%) drop-shadow(0 0 2px black)"
          : ""
      );
    });

    // mouse leave listener
    color.addEventListener("mouseleave", (elem) => {
      elem.target.lastElementChild.setAttribute("src", "");
    });
  });

  // moving listeners
  if (!movingColor) return;

  let draggables = document.querySelectorAll(".draggable");
  let draggingColorElement, closestColorElement;
  let mouseOverColor = false;

  draggables.forEach((draggable) => {
    // drag enter listener
    draggable.addEventListener("dragenter", function () {
      mouseOverColor = true;
    });

    // drag leave listener
    draggable.addEventListener("dragleave", function () {
      mouseOverColor = false;
      draggable.classList.remove("closest");
    });

    // dragging listener
    draggable.addEventListener("dragover", (elem) => {
      elem.preventDefault(); // prevent dragging blocked icon
      closestColorElement = elem.target;
      closestColorElement.classList.add("closest");
    });

    // drag start listener
    draggable.addEventListener("dragstart", function () {
      draggable.classList.add("dragging");
      draggingColorElement = draggable;
      draggingColorElement.lastElementChild.setAttribute("src", "");
    });

    // drag end listener
    draggable.addEventListener("dragend", function () {
      draggingColorElement.lastElementChild.setAttribute(
        "src",
        "icons/move.svg"
      );

      if (
        !mouseOverColor ||
        !closestColorElement.dataset.color ||
        draggingColorElement.dataset.color === closestColorElement.dataset.color
      ) {
        displayMessage(
          `${
            (!mouseOverColor && "Drag over a color") ||
            ((!closestColorElement.dataset.color ||
              draggingColorElement.dataset.color ===
                closestColorElement.dataset.color) &&
              "Drag over another color")
          }`,
          null,
          null
        );
        draggable.classList.remove("closest");
        draggable.classList.remove("dragging");
        return;
      }

      swapColors(draggingColorElement, closestColorElement);
      draggable.classList.remove("dragging");
    });
  });
}

function swapColors(draggingColorElement, closestColorElement) {
  let draggingIndex = savedColorsArray.findIndex(
    (color) => color === draggingColorElement.dataset.color
  );
  let closestIndex = savedColorsArray.findIndex(
    (color) => color === closestColorElement.dataset.color
  );

  if (draggingIndex === -1 || closestIndex === -1) {
    displayMessage("Something went wrong", null, null);
    return;
  }

  savedColorsArray[draggingIndex] = closestColorElement.dataset.color;
  savedColorsArray[closestIndex] = draggingColorElement.dataset.color;

  localStorage.setItem(
    "colorpal-saved-colors-array",
    JSON.stringify(savedColorsArray)
  );

  displayMessage(
    `Swapped ${draggingIndex + 1} with ${closestIndex + 1}`,
    null,
    null
  );

  renderColors();
}

function displayMessage(text, color, colorFormat) {
  if (!JSON.parse(localStorage.getItem("colorpal-display-messages"))) return;

  displayMessages.classList.remove("hide");
  displayMessageText.textContent = text;
  displayMessageColorCode.textContent = displayColorCode(color, colorFormat);

  clearTimeout(messageTimeout);
  messageTimeout = setTimeout(function () {
    displayMessages.classList.add("hide");
  }, 2000);

  function displayColorCode(color, colorFormat) {
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
}

function savedColorClicked(color) {
  setCurrentSelectedColor(color);

  if (movingColor) {
    displayMessage("Drag to move color", null, null);
    return;
  }

  if (deletingColor) {
    deleteColor(color);
    return;
  }

  let text = "";
  if (JSON.parse(localStorage.getItem("colorpal-auto-copy-color-code"))) {
    copyToClipboard(color, localStorage.getItem("colorpal-color-code-format"));
    text = "Copied";
  } else text = "Selected";

  displayMessage(
    text,
    color,
    localStorage.getItem("colorpal-color-code-format")
  );
}

function saveColor(color) {
  if (savedColorsArray.includes(color)) {
    displayMessage(
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

  setColorsCount();
  renderColors();

  selectedColor.lastElementChild.setAttribute("src", "");

  let text = "";
  if (JSON.parse(localStorage.getItem("colorpal-auto-copy-color-code"))) {
    copyToClipboard(color, localStorage.getItem("colorpal-color-code-format"));
    text = "Saved and Copied";
  } else text = "Saved";

  displayMessage(
    text,
    color,
    localStorage.getItem("colorpal-color-code-format")
  );
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

  setTimeout(async function () {
    try {
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open(); // hex color
      setCurrentSelectedColor(sRGBHex);

      if (JSON.parse(localStorage.getItem("colorpal-auto-save-eye-dropper"))) {
        saveColor(sRGBHex);
        JSON.parse(localStorage.getItem("colorpal-auto-copy-color-code")) &&
          copyToClipboard(
            sRGBHex,
            localStorage.getItem("colorpal-color-code-format")
          );
      } else displayMessage("Selected", sRGBHex, localStorage.getItem("colorpal-color-code-format"));
    } catch {
      displayMessage("Closed Eye Dropper", null, null);
    }

    document.body.style.display = "block";
    document.body.className = "hide-animations";

    setTimeout(function () {
      document.body.className = "";
    }, 400);
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

  setColorsCount();
  renderColors();

  selectedColor.lastElementChild.setAttribute("src", "icons/save.svg");

  displayMessage(
    "Deleted",
    color,
    localStorage.getItem("colorpal-color-code-format")
  );

  !savedColorsArray.length && resetEmptyColorsArray();
}

function deleteAllColors() {
  if (confirm("Delete All Your Colors?")) {
    savedColorsArray.length = 0;
    localStorage.setItem("colorpal-saved-colors-array", "[]");
    displayMessage("Deleted All", null, null);
    resetEmptyColorsArray();
  }
}

function resetEmptyColorsArray() {
  setCurrentSelectedColor("#000000");
  movingColor && setMoveColor(false);
  deletingColor && setDeleteColor(false);
  savedColorsPanel.classList.add("hide");
}

function setMoveColor(isMoving) {
  movingColor = isMoving;

  moveColor.setAttribute(
    "src",
    movingColor ? "icons/check.svg" : "icons/move.svg"
  );

  moveColor.style.setProperty(
    "filter",
    movingColor
      ? "invert(85%) sepia(6%) saturate(6698%) hue-rotate(73deg) brightness(99%) contrast(100%)"
      : "invert(44%) sepia(28%) saturate(4405%) hue-rotate(178deg) brightness(98%) contrast(95%)"
  );
}

function setDeleteColor(isDeleting) {
  deletingColor = isDeleting;

  deleteOnClick.setAttribute(
    "src",
    deletingColor ? "icons/check.svg" : "icons/delete.svg"
  );

  deleteOnClick.style.setProperty(
    "filter",
    deletingColor
      ? "invert(85%) sepia(6%) saturate(6698%) hue-rotate(73deg) brightness(99%) contrast(100%)"
      : "invert(11%) sepia(83%) saturate(5622%) hue-rotate(356deg) brightness(105%) contrast(100%)"
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

colorPalette.addEventListener("input", function () {
  setCurrentSelectedColor(colorPalette.value);
  displayMessage(
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

settingsButton.addEventListener("click", function () {
  setPage("settings");
});

colorsButton.addEventListener("click", function () {
  setPage("colors");
});

themeButton.addEventListener("click", function () {
  setTheme(
    localStorage.getItem("colorpal-theme") === "dark" ? "light" : "dark"
  );
});

copyRGBButton.addEventListener("click", function () {
  copyToClipboard(
    localStorage.getItem("colorpal-current-selected-color"),
    "RGB"
  );
  displayMessage(
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
  displayMessage(
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
  displayMessage(
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
  displayMessage(
    "Copied",
    localStorage.getItem("colorpal-current-selected-color"),
    "HSV"
  );
});

selectedColor.addEventListener("click", function () {
  savedColorsArray.includes(
    localStorage.getItem("colorpal-current-selected-color")
  )
    ? colorPalette.click()
    : saveColor(localStorage.getItem("colorpal-current-selected-color"));
});

collapseSavedColorsTools.addEventListener("click", function () {
  setCollapsedColorTools(
    !JSON.parse(localStorage.getItem("colorpal-collapsed-color-tools"))
  );
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

autoSaveEyeDropper.addEventListener("change", function () {
  localStorage.setItem("colorpal-auto-save-eye-dropper", this.checked);
});

autoCopyColorCode.addEventListener("change", function () {
  localStorage.setItem("colorpal-auto-copy-color-code", this.checked);
});

colorCodeFormat.addEventListener("change", function () {
  localStorage.setItem("colorpal-color-code-format", colorCodeFormat.value);
});

colorsPerLine.addEventListener("change", function () {
  setColorsPerLine(colorsPerLine.value);
});

displayMessagesOption.addEventListener("change", function () {
  localStorage.setItem("colorpal-display-messages", this.checked);
});
