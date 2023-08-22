const root = document.querySelector(":root") as HTMLElement;
const eyeDropperButton = document.querySelector(
  "#eye-dropper-button"
) as HTMLElement;
const colorPalette = document.querySelector(
  "#color-palette"
) as HTMLInputElement;
const settingsButton = document.querySelector(
  "#settings-button"
) as HTMLElement;
const copyRGBButton = document.querySelector("#copy-rgb-button") as HTMLElement;
const copyHexButton = document.querySelector("#copy-hex-button") as HTMLElement;
const copyHslButton = document.querySelector("#copy-hsl-button") as HTMLElement;
const copyHsvButton = document.querySelector("#copy-hsv-button") as HTMLElement;
const colorsTools = document.querySelector(".colors-tools") as HTMLElement;
const settingsTools = document.querySelector(".settings-tools") as HTMLElement;
const colorsButton = document.querySelector("#colors-button") as HTMLElement;
const themeButton = document.querySelector("#theme-button") as HTMLElement;
const savedColors = document.querySelector(".saved-colors") as HTMLElement;
const collapseColorToolsIcon = document.querySelector(
  "#collapse-color-tools-icon"
) as HTMLElement;
const savedColorsTools = document.querySelector(
  ".saved-colors-tools"
) as HTMLElement;
const savedColorsCount = document.querySelector(
  ".saved-colors-count"
) as HTMLElement;
const moveColor = document.querySelector("#move-color") as HTMLElement;
const tintsShades = document.querySelector("#tints-shades") as HTMLElement;
const deleteOnClick = document.querySelector("#delete-on-click") as HTMLElement;
const deleteAll = document.querySelector("#delete-all") as HTMLElement;
const themeIcon = document.querySelector("#theme-icon") as HTMLElement;
const settingsPanel = document.querySelector(".settings-panel") as HTMLElement;
const codesMessages = document.querySelector(".codes-messages") as HTMLElement;
const selectedColorRect = document.querySelector(
  ".selected-color-rect"
) as HTMLElement;
const savedColorsPanel = document.querySelector(
  ".saved-colors-panel"
) as HTMLElement;
const selectedColor = document.querySelector(
  ".selected-color .rect"
) as HTMLElement;
const displayMessages = document.querySelector(
  ".display-messages"
) as HTMLElement;
const displayMessageText = document.querySelector(
  "#display-message-text"
) as HTMLElement;
const displayMessageColorCode = document.querySelector(
  "#display-message-color-code"
) as HTMLElement;
const selectedColorRGB = document.querySelector("#rgb") as HTMLElement;
const selectedColorHex = document.querySelector("#hex") as HTMLElement;
const selectedColorHSL = document.querySelector("#hsl") as HTMLElement;
const selectedColorHSV = document.querySelector("#hsv") as HTMLElement;
const autoSaveEyeDropper = document.querySelector(
  "#auto-save-eye-dropper"
) as HTMLInputElement;
const autoCopyColorCode = document.querySelector(
  "#auto-copy-color-code"
) as HTMLInputElement;
const colorCodeFormat = document.querySelector(
  "#color-code-format"
) as HTMLInputElement;
const colorsPerLine = document.querySelector(
  "#colors-per-line"
) as HTMLInputElement;
const displayMessagesOption = document.querySelector(
  "#display-messages-option"
) as HTMLInputElement;
const savedColorsArray = JSON.parse(
  localStorage.getItem("colorpal-saved-colors-array") ?? "[]"
);

const latestVersion = "1.3.0";
var messageTimeout: number, hideAnimationsTimeout: number;
var movingColor = false,
  selectingTintsShades = false,
  renderedTintsShades = false,
  deletingColor = false;

setOptions();
setPage("colors");

latestVersion !== localStorage.getItem("colorpal-version") && newVersion();

function newVersion(): void {
  localStorage.setItem("colorpal-version", latestVersion);
  // future code
}

function setOptions(): void {
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
  colorCodeFormat.value = localStorage.getItem("colorpal-color-code-format")!;

  setColorsPerLine(localStorage.getItem("colorpal-colors-per-line") ?? "6");

  localStorage.getItem("colorpal-display-messages") ??
    localStorage.setItem("colorpal-display-messages", "true");

  setCollapsedColorTools(
    JSON.parse(
      localStorage.getItem("colorpal-collapsed-color-tools") ?? "false"
    )
  );

  // visual check boxes
  autoSaveEyeDropper.checked = JSON.parse(
    localStorage.getItem("colorpal-auto-save-eye-dropper")!
  );

  autoCopyColorCode.checked = JSON.parse(
    localStorage.getItem("colorpal-auto-copy-color-code")!
  );

  displayMessagesOption.checked = JSON.parse(
    localStorage.getItem("colorpal-display-messages")!
  );
}

function setTheme(theme: string): void {
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
    getComputedStyle(root).getPropertyValue(`--${theme}-theme-filter`)
  );

  themeIcon.setAttribute(
    "src",
    `icons/${
      (theme === "dark" && "light") || (theme === "light" && "dark")
    }.svg`
  );
}

function setCurrentSelectedColor(currentColor: string): void {
  if (!currentColor) return;

  localStorage.setItem("colorpal-current-selected-color", currentColor);

  selectedColor.lastElementChild?.setAttribute(
    "src",
    `${savedColorsArray.includes(currentColor) ? "" : "icons/save.svg"}`
  );

  colorPalette.value = currentColor;
  selectedColor.style.background = currentColor;
  root.style.setProperty("--selected-color", currentColor);

  selectedColorRGB.textContent = hexToRgb(currentColor, true) as string;
  selectedColorHex.textContent = currentColor;
  let rgbColor = hexToRgb(currentColor, false) as {
    r: number;
    g: number;
    b: number;
  };
  selectedColorHSL.textContent = rgbToHsl(rgbColor);
  selectedColorHSV.textContent = rgbToHsv(rgbColor);
}

function setColorsPerLine(clrPerLine: string | number): void {
  clrPerLine = Number(clrPerLine);
  if (clrPerLine < 5 || clrPerLine > 10) clrPerLine = 7;

  localStorage.setItem(
    "colorpal-colors-per-line",
    clrPerLine as unknown as string
  );

  colorsPerLine.value = clrPerLine as unknown as string;

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

function setCollapsedColorTools(isCollapsed: string | boolean): void {
  localStorage.setItem("colorpal-collapsed-color-tools", isCollapsed as string);

  isCollapsed
    ? savedColorsTools.classList.add("hide")
    : savedColorsTools.classList.remove("hide");

  collapseColorToolsIcon.setAttribute(
    "src",
    `icons/${isCollapsed ? "arrowsRight" : "arrowsLeft"}.svg`
  );

  disableColorTools("all");
  renderColors();
}

function setPage(page: string): void {
  document.body.className = "hide-animations";

  if (page === "colors") {
    settingsTools.classList.add("hide");
    settingsPanel.classList.add("hide");
    colorsTools.classList.remove("hide");
    selectedColorRect.classList.remove("hide");
    codesMessages.classList.remove("hide");

    clearTimeout(hideAnimationsTimeout);
    hideAnimationsTimeout = setTimeout(function () {
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

    disableColorTools("all");
  }
}

function setColorsCount(): void {
  if (!savedColorsArray.length) return;

  savedColorsCount.textContent = `${savedColorsArray.length} ${
    savedColorsArray.length > 1 ? "Colors" : "Color"
  }`;
}

function renderColors(): void {
  if (!savedColorsArray.length) {
    savedColorsPanel.classList.add("hide");
    return;
  }
  savedColorsPanel.classList.remove("hide");

  // add li for each color
  savedColors.innerHTML = savedColorsArray
    .map(
      (color: string) => `
        <li class="color">
          <span class="rect${
            movingColor
              ? " draggable"
              : selectingTintsShades
              ? " selectableTintsShades"
              : deletingColor
              ? " deletable"
              : ""
          }" data-color="${color}" draggable="${String(
        movingColor
      )}" style="background: ${color};"> <img src="" draggable=false />
          </span>
        </li>`
    )
    .join("");
  addColorListeners();
}

function addColorListeners(): void {
  document.querySelectorAll(".color .rect").forEach((color) => {
    // click listener
    color.addEventListener("click", (elem) => {
      savedColorClicked((elem.currentTarget! as HTMLElement).dataset.color);
    });

    // moving and deleting listeners
    if (!movingColor && !selectingTintsShades && !deletingColor) return;

    // mouse enter listener
    color.addEventListener("mouseenter", (elem) => {
      (elem.target as HTMLElement).lastElementChild?.setAttribute(
        "src",
        `icons/${
          (movingColor && "move") ||
          (selectingTintsShades && "tintsShades") ||
          (deletingColor && "delete")
        }.svg`
      );

      root.style.setProperty(
        "--tool-icon-filter",
        getComputedStyle(root).getPropertyValue(
          `--${
            movingColor
              ? "move"
              : selectingTintsShades
              ? "tint-shades"
              : deletingColor
              ? "delete"
              : ""
          }-tool-filter`
        )
      );
    });

    // mouse leave listener
    color.addEventListener("mouseleave", (elem) => {
      (elem.target as HTMLElement).lastElementChild?.setAttribute("src", "");
    });
  });

  // moving listeners
  if (!movingColor) return;

  let draggables = document.querySelectorAll(".draggable");
  let draggingColorElement: HTMLElement, closestColorElement: HTMLElement;
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
      closestColorElement = elem.target as HTMLElement;
      closestColorElement.classList.add("closest");
    });

    // drag start listener
    draggable.addEventListener("dragstart", function () {
      draggable.classList.add("dragging");
      draggingColorElement = draggable as HTMLElement;
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

function swapColors(
  draggingColorElement: HTMLElement,
  closestColorElement: HTMLElement
): void {
  let draggingIndex = savedColorsArray.findIndex(
    (color: string) => color === draggingColorElement.dataset.color
  );
  let closestIndex = savedColorsArray.findIndex(
    (color: string) => color === closestColorElement.dataset.color
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

function displayMessage(
  text: string,
  color: string | null,
  colorFormat: string | null
): void {
  if (!JSON.parse(localStorage.getItem("colorpal-display-messages")!)) return;

  displayMessages.classList.remove("hide");
  displayMessageText.textContent = text;
  displayMessageColorCode.textContent = displayColorCode(color, colorFormat);

  clearTimeout(messageTimeout);
  messageTimeout = setTimeout(function () {
    displayMessages.classList.add("hide");
  }, 2000);

  function displayColorCode(
    color: string | null,
    colorFormat: string | null
  ): string {
    if (color === null || colorFormat === null) return;

    let rgbColor = hexToRgb(color, false) as {
      r: number;
      g: number;
      b: number;
    };
    switch (colorFormat) {
      case "RGB":
        return hexToRgb(color, true) as string;
      case "HEX":
        return color;
      case "HSL":
        return rgbToHsl(rgbColor);
      case "HSV":
        return rgbToHsv(rgbColor);
    }
  }
}

function savedColorClicked(color: string): void {
  if (!color) return;

  setCurrentSelectedColor(color);

  if (movingColor) {
    displayMessage("Drag to move color", null, null);
    return;
  }

  if (selectingTintsShades) {
    if (renderedTintsShades) return;

    displayMessage("Click colors to save", null, null);
    renderTintsShades();
    return;
  }

  if (deletingColor) {
    deleteColor(color);
    return;
  }

  let text = "";
  if (JSON.parse(localStorage.getItem("colorpal-auto-copy-color-code")!)) {
    copyToClipboard(color, localStorage.getItem("colorpal-color-code-format"));
    text = "Copied";
  } else text = "Selected";

  displayMessage(
    text,
    color,
    localStorage.getItem("colorpal-color-code-format")
  );
}

function saveColor(color: string): void {
  if (!color) return;

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
  if (!selectingTintsShades) renderColors();

  selectedColor.lastElementChild?.setAttribute("src", "");

  let text = "";
  if (JSON.parse(localStorage.getItem("colorpal-auto-copy-color-code")!)) {
    copyToClipboard(color, localStorage.getItem("colorpal-color-code-format"));
    text = "Saved and Copied";
  } else text = "Saved";

  displayMessage(
    text,
    color,
    localStorage.getItem("colorpal-color-code-format")
  );
}

function copyToClipboard(color: string, colorFormat: string): void {
  let rgbColor = hexToRgb(color, false) as { r: number; g: number; b: number };
  switch (colorFormat) {
    case "RGB":
      navigator.clipboard.writeText(hexToRgb(color, true) as string);
      break;
    case "HEX":
      navigator.clipboard.writeText(color);
      break;
    case "HSL":
      navigator.clipboard.writeText(rgbToHsl(rgbColor));
      break;
    case "HSV":
      navigator.clipboard.writeText(rgbToHsv(rgbColor));
      break;
  }
}

function activateEyeDropper(): void {
  if (movingColor || deletingColor || selectingTintsShades) {
    disableColorTools("all");
    renderColors();
  }

  document.body.style.display = "none";

  setTimeout(async function () {
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      setCurrentSelectedColor(sRGBHex);

      if (JSON.parse(localStorage.getItem("colorpal-auto-save-eye-dropper")!)) {
        saveColor(sRGBHex);
        JSON.parse(localStorage.getItem("colorpal-auto-copy-color-code")!) &&
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

function renderTintsShades(): void {
  // Set temporary colors per line to 10
  savedColors.style.setProperty("grid-template-columns", `repeat(10, 1fr)`);
  root.style.setProperty("--rect-size", "28.3px");

  let baseColorHSL = hexToHsl(
    localStorage.getItem("colorpal-current-selected-color")
  );
  let tintsShades = [];

  for (let i = 1; i <= 99; i += 1) {
    tintsShades.push(hslToHex(baseColorHSL.h, baseColorHSL.s, i));
  }

  // add li for each tint and shade
  savedColors.innerHTML = tintsShades
    .map(
      (color: string, index: number) => `
        <li class="color">
          <span class="rect tintsShades" data-color="${color}" style="background: ${color}; color: ${
        index < 50 ? "white" : "black"
      };">${index + 1}</span>
        </li>`
    )
    .join("");

  renderedTintsShades = true;
  addColorListeners();
}

function deleteColor(color: string): void {
  if (!color) return;

  let deleteColorIndex: number = savedColorsArray.findIndex((clr: string) => {
    return clr === color;
  });

  if (deleteColorIndex === -1) return;

  savedColorsArray.splice(deleteColorIndex, 1);
  localStorage.setItem(
    "colorpal-saved-colors-array",
    JSON.stringify(savedColorsArray)
  );

  setColorsCount();
  renderColors();

  selectedColor.lastElementChild?.setAttribute("src", "icons/save.svg");

  displayMessage(
    "Deleted",
    color,
    localStorage.getItem("colorpal-color-code-format")
  );

  !savedColorsArray.length && resetEmptyColorsArray();
}

function deleteAllColors(): void {
  if (confirm("Delete All Your Colors?")) {
    savedColorsArray.length = 0;
    localStorage.setItem("colorpal-saved-colors-array", "[]");
    displayMessage("Deleted All", null, null);
    resetEmptyColorsArray();
  }
}

function resetEmptyColorsArray(): void {
  setCurrentSelectedColor("#000000");
  disableColorTools("all");
  savedColorsPanel.classList.add("hide");
}

function setMoveColor(isMoving: boolean): void {
  movingColor = isMoving;

  moveColor.setAttribute("src", `icons/${movingColor ? "check" : "move"}.svg`);

  moveColor.style.setProperty(
    "filter",
    getComputedStyle(root).getPropertyValue(
      `--${movingColor ? "check" : "move"}-tool-filter`
    )
  );
}

function setTintsShades(setTintsShades: boolean): void {
  selectingTintsShades = setTintsShades;
  if (!setTintsShades) {
    renderedTintsShades = false;
    setColorsPerLine(localStorage.getItem("colorpal-colors-per-line"));
  }

  tintsShades.setAttribute(
    "src",
    `icons/${selectingTintsShades ? "check" : "tintsShades"}.svg`
  );

  tintsShades.style.setProperty(
    "filter",
    getComputedStyle(root).getPropertyValue(
      `--${selectingTintsShades ? "check" : "tint-shades"}-tool-filter`
    )
  );
}

function setDeleteColor(isDeleting: boolean): void {
  deletingColor = isDeleting;

  deleteOnClick.setAttribute(
    "src",
    `icons/${deletingColor ? "check" : "delete"}.svg`
  );

  deleteOnClick.style.setProperty(
    "filter",
    getComputedStyle(root).getPropertyValue(
      `--${deletingColor ? "check" : "delete"}-tool-filter`
    )
  );
}

function disableColorTools(tools: string | string[]): void {
  if (tools === "all") {
    movingColor && setMoveColor(false);
    deletingColor && setDeleteColor(false);
    selectingTintsShades && setTintsShades(false);
    return;
  }

  tools.includes("setMoveColor") && movingColor && setMoveColor(false);
  tools.includes("setTintsShades") &&
    selectingTintsShades &&
    setTintsShades(false);
  tools.includes("setDeleteColor") && deletingColor && setDeleteColor(false);
}

function hexToRgb(
  hex: string,
  returnString: boolean
): string | { r: number; g: number; b: number } {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex
  ) as RegExpExecArray;
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  if (returnString) return `rgb(${r}, ${g}, ${b})`;
  else return { r, g, b };
}

function rgbToHsl(rbg: { r: number; g: number; b: number }): string {
  let r = rbg.r / 255;
  let g = rbg.g / 255;
  let b = rbg.b / 255;
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

  return `hsl(${h}, ${s}%, ${l}%)`;
}

function rgbToHsv(rbg: { r: number; g: number; b: number }): string {
  let rabs,
    gabs,
    babs,
    rr,
    gg,
    bb,
    h,
    s,
    v: number,
    diff: number,
    diffc,
    percentRoundFn;
  rabs = rbg.r / 255;
  gabs = rbg.g / 255;
  babs = rbg.b / 255;
  (v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
  diffc = (c: number) => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = (num: number) => Math.round(num * 100) / 100;
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

  return `hsv(${h}, ${s}%, ${v}%)`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
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

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    function hueToRgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  function toHex(x: number) {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
  if (movingColor || deletingColor || selectingTintsShades) {
    disableColorTools("all");
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

collapseColorToolsIcon.addEventListener("click", function () {
  setCollapsedColorTools(
    !JSON.parse(localStorage.getItem("colorpal-collapsed-color-tools")!)
  );
});

moveColor.addEventListener("click", function () {
  setMoveColor(!movingColor);
  disableColorTools(["setTintsShades", "setDeleteColor"]);
  renderColors();
});

tintsShades.addEventListener("click", function () {
  setTintsShades(!selectingTintsShades);
  disableColorTools(["setMoveColor", "setDeleteColor"]);
  renderColors();
});

deleteOnClick.addEventListener("click", function () {
  setDeleteColor(!deletingColor);
  disableColorTools(["setMoveColor", "setTintsShades"]);
  renderColors();
});

deleteAll.addEventListener("click", deleteAllColors);

autoSaveEyeDropper.addEventListener("change", function () {
  localStorage.setItem(
    "colorpal-auto-save-eye-dropper",
    this.checked as unknown as string
  );
});

autoCopyColorCode.addEventListener("change", function () {
  localStorage.setItem(
    "colorpal-auto-copy-color-code",
    this.checked as unknown as string
  );
});

colorCodeFormat.addEventListener("change", function () {
  localStorage.setItem("colorpal-color-code-format", colorCodeFormat.value);
});

colorsPerLine.addEventListener("change", function () {
  setColorsPerLine(colorsPerLine.value);
});

displayMessagesOption.addEventListener("change", function () {
  localStorage.setItem(
    "colorpal-display-messages",
    this.checked as unknown as string
  );
});
