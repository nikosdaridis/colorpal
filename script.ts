declare const domtoimage: any;

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

const root = document.querySelector(":root") as HTMLElement;
const eyeDropperButton = document.querySelector(
  "#eyedropper-button"
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
const colorsButtons = document.querySelector(".colors-buttons") as HTMLElement;
const settingsButtons = document.querySelector(
  ".settings-buttons"
) as HTMLElement;
const colorsPageButton = document.querySelector(
  "#colors-page-button"
) as HTMLElement;
const themeButton = document.querySelector("#theme-button") as HTMLElement;
const reviewBanner = document.querySelector(".review-banner") as HTMLElement;
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
const moveColorTool = document.querySelector("#move-color-tool") as HTMLElement;
const tintsShadesTool = document.querySelector(
  "#tints-shades-tool"
) as HTMLElement;
const deleteColorTool = document.querySelector(
  "#delete-color-tool"
) as HTMLElement;
const downloadPNGTool = document.querySelector(
  "#download-png-tool"
) as HTMLElement;
const downloadCSVTool = document.querySelector(
  "#download-csv-tool"
) as HTMLElement;
const deleteAllColorsTool = document.querySelector(
  "#delete-all-colors-tool"
) as HTMLElement;
const themeIcon = document.querySelector("#theme-icon") as HTMLElement;
const settingsPanel = document.querySelector(".settings-panel") as HTMLElement;
const codesNameMessages = document.querySelector(
  ".codes-name-messages"
) as HTMLElement;
const selectedColorRect = document.querySelector(
  ".selected-color-rect"
) as HTMLElement;
const savedColorsPanel = document.querySelector(
  ".saved-colors-panel"
) as HTMLElement;
const selectedColor = document.querySelector(
  ".selected-color .rect"
) as HTMLElement;
const colorNameText = document.querySelector("#color-name-text") as HTMLElement;
const colorNamePercentage = document.querySelector(
  "#color-name-percentage"
) as HTMLElement;
const showMessages = document.querySelector(".show-messages") as HTMLElement;
const showMessageText = document.querySelector(
  "#show-message-text"
) as HTMLElement;
const showMessageColorCode = document.querySelector(
  "#show-message-color-code"
) as HTMLElement;
const selectedColorRGB = document.querySelector("#rgb") as HTMLElement;
const selectedColorHex = document.querySelector("#hex") as HTMLElement;
const selectedColorHSL = document.querySelector("#hsl") as HTMLElement;
const selectedColorHSV = document.querySelector("#hsv") as HTMLElement;
const autoSaveEyeDropper = document.querySelector(
  "#auto-save-eyedropper"
) as HTMLInputElement;
const autoCopyCode = document.querySelector(
  "#auto-copy-code"
) as HTMLInputElement;
const colorCodeFormat = document.querySelector(
  "#color-code-format"
) as HTMLInputElement;
const colorsPerLine = document.querySelector(
  ".colors-per-line"
) as HTMLInputElement;
const addHexCharacterOption = document.querySelector(
  "#add-hex-character-option"
) as HTMLInputElement;
const showColorName = document.querySelector(
  "#show-color-name"
) as HTMLInputElement;
const showMessagesOption = document.querySelector(
  "#show-messages-option"
) as HTMLInputElement;

// localStorage keys
const storage = {
  version: "colorpal-version",
  theme: "colorpal-theme",
  selectedColor: "colorpal-selected-color",
  savedColorsArray: "colorpal-saved-colors-array",
  autoSaveEyedropper: "colorpal-auto-save-eyedropper",
  autoCopyCode: "colorpal-auto-copy-code",
  colorCodeFormat: "colorpal-color-code-format",
  addHexCharacter: "colorpal-add-hex-character",
  colorsPerLine: "colorpal-colors-per-line",
  showColorNames: "colorpal-show-color-names",
  showMessages: "colorpal-show-messages",
  collapsedColorTools: "colorpal-collapsed-color-tools",
  openedCount: "colorpal-opened-count",
  reviewBannerClosed: "colorpal-review-banner-closed",
};

const latestVersion = "1.3.5";

var savedColorsArray: string[];

var namedColors: {
  name: string;
  rgb: ColorRGB;
}[];

var movingColor = false,
  selectingTintsShades = false,
  renderedTintsShades = false,
  deletingColor = false;

var messageTimeout = 0,
  hideAnimationsTimeout = 0,
  colorPaletteTimeout = 0,
  colorsPerLineTimeout = 0;

initialize();
validateStorage();
setPage("colors");

function initialize(): void {
  fetch("/data/named-colors.json")
    .then((res) => res.json())
    .then((data) => {
      namedColors = data;

      setColorName(localStorage.getItem(storage.selectedColor));
    });

  latestVersion !== localStorage.getItem(storage.version) && newVersion();
  document.querySelector("#version").textContent = `v${latestVersion}`;

  function newVersion(): void {
    localStorage.setItem(storage.version, latestVersion);

    localStorage.setItem(storage.reviewBannerClosed, "false");
    localStorage.setItem(storage.openedCount, "0");
  }
}

function validateStorage(): void {
  let localStorageTheme = localStorage.getItem(storage.theme);

  if (localStorageTheme === "light" || localStorageTheme === "dark")
    setTheme(localStorageTheme);
  else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
    setTheme("dark");
  else setTheme("light");

  // validate json and remove non 6 digit #hex color code
  savedColorsArray = validateJson(storage.savedColorsArray, "[]").filter(
    (color: string) => color.match(/^#[\dabcdef]{6}$/i)
  );

  localStorage.setItem(
    storage.savedColorsArray,
    JSON.stringify(savedColorsArray)
  );

  validateTrueOrFalse(storage.autoSaveEyedropper, "true");
  validateTrueOrFalse(storage.autoCopyCode, "true");

  if (
    localStorage.getItem(storage.colorCodeFormat) !== "RGB" &&
    localStorage.getItem(storage.colorCodeFormat) !== "HEX" &&
    localStorage.getItem(storage.colorCodeFormat) !== "HSL" &&
    localStorage.getItem(storage.colorCodeFormat) !== "HSV"
  )
    localStorage.setItem(storage.colorCodeFormat, "HEX");

  colorCodeFormat.value = localStorage.getItem(storage.colorCodeFormat)!;

  validateTrueOrFalse(storage.addHexCharacter, "true");

  if (
    Number(localStorage.getItem(storage.colorsPerLine)) >= 5 &&
    Number(localStorage.getItem(storage.colorsPerLine)) <= 10
  )
    setColorsPerLine(localStorage.getItem(storage.colorsPerLine));
  else setColorsPerLine(6);

  if (
    localStorage.getItem(storage.showColorNames) !== "No" &&
    localStorage.getItem(storage.showColorNames) !== "Yes" &&
    localStorage.getItem(storage.showColorNames) !== "Yes%"
  )
    localStorage.setItem(storage.showColorNames, "Yes");

  showColorName.value = localStorage.getItem(storage.showColorNames);

  validateTrueOrFalse(storage.showMessages, "true");

  validateTrueOrFalse(storage.collapsedColorTools, "false");

  setCollapsedColorTools(
    JSON.parse(localStorage.getItem(storage.collapsedColorTools))
  );

  try {
    hexToRgb(localStorage.getItem(storage.selectedColor), false);
    setSelectedColor(localStorage.getItem(storage.selectedColor));
  } catch {
    setSelectedColor("#000000");
  }

  if (
    !localStorage.getItem(storage.openedCount) ||
    isNaN(Number(localStorage.getItem(storage.openedCount)))
  ) {
    localStorage.setItem(storage.openedCount, "1");
  } else {
    localStorage.setItem(
      storage.openedCount,
      String(Number(localStorage.getItem(storage.openedCount)) + 1)
    );
  }

  validateTrueOrFalse(storage.reviewBannerClosed, "false");

  // update visual check boxes
  autoSaveEyeDropper.checked = JSON.parse(
    localStorage.getItem(storage.autoSaveEyedropper)
  );

  autoCopyCode.checked = JSON.parse(localStorage.getItem(storage.autoCopyCode));

  addHexCharacterOption.checked = JSON.parse(
    localStorage.getItem(storage.addHexCharacter)
  );

  showMessagesOption.checked = JSON.parse(
    localStorage.getItem(storage.showMessages)
  );

  // opera browser, disable eyedropper, hide feedback button and disable review banner
  navigator.userAgent.indexOf("OP") > -1 && disableOpera();

  function validateJson(storageKey: string, fallbackValue: string): string[] {
    localStorage.getItem(storageKey) ??
      localStorage.setItem(storageKey, fallbackValue);

    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch {
      localStorage.setItem(storageKey, fallbackValue);
      return JSON.parse(localStorage.getItem(storageKey));
    }
  }

  function validateTrueOrFalse(storageKey: string, defaultValue: string): void {
    if (
      localStorage.getItem(storageKey) !== "true" &&
      localStorage.getItem(storageKey) !== "false"
    )
      localStorage.setItem(storageKey, defaultValue);
  }

  function disableOpera(): void {
    eyeDropperButton.classList.add("disable");
    document.querySelector(".feedback").classList.add("hide");
    localStorage.setItem(storage.reviewBannerClosed, "true");
  }
}

function setTheme(theme: string): void {
  if (!theme) return;

  localStorage.setItem(storage.theme, theme);

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
    getComputedStyle(root).getPropertyValue(
      `--${theme === "dark" ? "light" : "dark"}-theme-filter`
    )
  );

  themeIcon.setAttribute(
    "src",
    `icons/${theme === "dark" ? "light" : "dark"}.svg`
  );
}

function setSelectedColor(color: string): void {
  if (!color) return;

  localStorage.setItem(storage.selectedColor, color);

  selectedColor.lastElementChild?.setAttribute(
    "src",
    `${savedColorsArray.includes(color) ? "" : "icons/save.svg"}`
  );

  colorPalette.value = color;
  selectedColor.style.background = color;
  root.style.setProperty("--selected-color", color);

  setSelectedColorCodes(color);
  setColorName(color);
}

function setSelectedColorCodes(color: string): void {
  selectedColorRGB.textContent = hexToRgb(color, true) as string;
  selectedColorHex.textContent = JSON.parse(
    localStorage.getItem(storage.addHexCharacter)
  )
    ? color
    : color.slice(1);

  let rgbColor = hexToRgb(color, false) as ColorRGB;

  selectedColorHSL.textContent = rgbToHsl(rgbColor);
  selectedColorHSV.textContent = rgbToHsv(rgbColor);
}

function setColorName(color: string): void {
  if (!namedColors || !color) return;

  if (localStorage.getItem(storage.showColorNames) === "No") {
    colorNameText.textContent = "";
    colorNamePercentage.textContent = "";
    return;
  }

  let closestNamedColor = findClosestNamedColor(
    hexToRgb(color, false) as ColorRGB
  );

  colorNameText.textContent = closestNamedColor.namedColor.name;

  if (
    localStorage.getItem(storage.showColorNames) === "Yes%" &&
    closestNamedColor.distancePercentage < 99.9
  ) {
    colorNamePercentage.style.display = "block";

    colorNamePercentage.textContent =
      closestNamedColor.distancePercentage.toFixed(2).replace(/[.,]0+$/, "") +
      "%";
  } else {
    colorNamePercentage.style.display = "none";
  }
}

function setColorsPerLine(clrPerLine: string | number): void {
  clrPerLine = Number(clrPerLine);
  if (clrPerLine < 5 || clrPerLine > 10) clrPerLine = 6;

  localStorage.setItem(storage.colorsPerLine, String(clrPerLine));

  colorsPerLine.value = String(clrPerLine);

  savedColors.style.setProperty(
    "grid-template-columns",
    `repeat(${String(clrPerLine)}, 1fr)`
  );

  root.style.setProperty(
    "--rect-size",
    `${
      (clrPerLine === 5 && "57px") ||
      (clrPerLine === 6 && "47px") ||
      (clrPerLine === 7 && "40px") ||
      (clrPerLine === 8 && "35px") ||
      (clrPerLine === 9 && "31px") ||
      (clrPerLine === 10 && "28px")
    }`
  );
}

function setCollapsedColorTools(isCollapsed: boolean): void {
  localStorage.setItem(storage.collapsedColorTools, String(isCollapsed));

  if (isCollapsed) {
    savedColorsTools.classList.add("hide");
    collapseColorToolsIcon.classList.add("flip");
  } else {
    savedColorsTools.classList.remove("hide");
    collapseColorToolsIcon.classList.remove("flip");
  }

  disableColorTools("all");
  renderColors();
}

function setPage(page: string): void {
  document.body.className = "hide-animations";
  collapseColorToolsIcon.classList.add("hide-transitions");

  if (page === "colors") {
    settingsButtons.classList.add("hide");
    settingsPanel.classList.add("hide");
    colorsButtons.classList.remove("hide");
    selectedColorRect.classList.remove("hide");
    codesNameMessages.classList.remove("hide");

    // review banner
    if (
      !JSON.parse(localStorage.getItem(storage.reviewBannerClosed)) &&
      Number(localStorage.getItem(storage.openedCount)) > 25
    ) {
      setTimeout(function () {
        reviewBanner.classList.remove("hide");
      }, 5000);
    }

    clearTimeout(hideAnimationsTimeout);
    hideAnimationsTimeout = setTimeout(function () {
      document.body.className = "";
      collapseColorToolsIcon.classList.remove("hide-transitions");
    }, 400);

    savedColorsCount.textContent = String(savedColorsArray.length);
    renderColors();
  } else if (page === "settings") {
    colorsButtons.classList.add("hide");
    selectedColorRect.classList.add("hide");
    codesNameMessages.classList.add("hide");
    savedColorsPanel.classList.add("hide");
    settingsButtons.classList.remove("hide");
    settingsPanel.classList.remove("hide");

    disableColorTools("all");
  }
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

  addColorsListeners();
}

function addColorsListeners(): void {
  document.querySelectorAll(".color .rect").forEach((color) => {
    color.addEventListener("click", (elem) => {
      savedColorClicked((elem.currentTarget! as HTMLElement).dataset.color);
    });

    // color tools listeners
    if (!movingColor && !selectingTintsShades && !deletingColor) return;

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

    color.addEventListener("mouseleave", (elem) => {
      (elem.target as HTMLElement).lastElementChild?.setAttribute("src", "");
    });
  });

  if (!movingColor) return;

  let draggables = document.querySelectorAll(".draggable");
  let draggingColorElement: HTMLElement, replacingColorElement: HTMLElement;
  let mouseOverColor = false;

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragenter", function () {
      mouseOverColor = true;
    });

    draggable.addEventListener("dragleave", function () {
      mouseOverColor = false;
      draggable.classList.remove("replacing");
    });

    draggable.addEventListener("dragover", (elem) => {
      elem.preventDefault(); // prevent dragging blocked icon

      replacingColorElement = draggable as HTMLElement;
      replacingColorElement.classList.add("replacing");
    });

    draggable.addEventListener("dragstart", function () {
      draggingColorElement = draggable as HTMLElement;
      draggingColorElement.classList.add("dragging");
      draggingColorElement.lastElementChild.setAttribute("src", "");
    });

    draggable.addEventListener("dragend", function () {
      draggingColorElement.lastElementChild.setAttribute(
        "src",
        "icons/move.svg"
      );

      if (
        !mouseOverColor ||
        !replacingColorElement.dataset.color ||
        draggingColorElement.dataset.color ===
          replacingColorElement.dataset.color
      ) {
        showMessage(
          `${
            (!mouseOverColor && "Drag over a color") ||
            ((!replacingColorElement.dataset.color ||
              draggingColorElement.dataset.color ===
                replacingColorElement.dataset.color) &&
              "Drag over another color")
          }`,
          null,
          null
        );

        draggable.classList.remove("dragging");
        draggable.classList.remove("replacing");
        return;
      }

      swapColors(draggingColorElement, replacingColorElement);
      draggable.classList.remove("dragging");
    });
  });
}

function swapColors(
  draggingColorElement: HTMLElement,
  replacingColorElement: HTMLElement
): void {
  let draggingIndex = savedColorsArray.findIndex(
    (color: string) => color === draggingColorElement.dataset.color
  );

  let replacingIndex = savedColorsArray.findIndex(
    (color: string) => color === replacingColorElement.dataset.color
  );

  if (draggingIndex === -1 || replacingIndex === -1) {
    showMessage("Something went wrong", null, null);
    return;
  }

  savedColorsArray[draggingIndex] = replacingColorElement.dataset.color;
  savedColorsArray[replacingIndex] = draggingColorElement.dataset.color;

  localStorage.setItem(
    storage.savedColorsArray,
    JSON.stringify(savedColorsArray)
  );

  showMessage(
    `Swapped ${draggingIndex + 1} with ${replacingIndex + 1}`,
    null,
    null
  );

  renderColors();
}

function findClosestNamedColor(color: ColorRGB): {
  namedColor: { name: string; rgb: ColorRGB };
  distancePercentage: number;
} {
  let namedColor: { name: string; rgb: ColorRGB };
  let closestDistance = 765;
  let dist = 765;

  for (let match of namedColors) {
    dist = getRGBSumDistance(color, match.rgb);

    if (dist < closestDistance) {
      namedColor = match;
      closestDistance = dist;

      if (closestDistance === 0) break;
    }
  }

  return {
    namedColor,
    distancePercentage: getEuclideanDistancePercentage(color, namedColor.rgb),
  };

  function getEuclideanDistancePercentage(
    color: ColorRGB,
    match: ColorRGB
  ): number {
    let squaredDistance =
      Math.pow(color.r - match.r, 2) +
      Math.pow(color.g - match.g, 2) +
      Math.pow(color.b - match.b, 2);

    return ((441.67 - Math.sqrt(squaredDistance)) / 441.67) * 100;
  }

  function getRGBSumDistance(color: ColorRGB, match: ColorRGB): number {
    return (
      Math.abs(color.r - match.r) +
      Math.abs(color.g - match.g) +
      Math.abs(color.b - match.b)
    );
  }
}

function showMessage(
  text: string,
  color: string | null,
  colorFormat: string | null
): void {
  if (!JSON.parse(localStorage.getItem(storage.showMessages))) return;

  showMessages.classList.remove("hide");
  showMessageText.textContent = text;
  showMessageColorCode.textContent = showColorCode(color, colorFormat);

  clearTimeout(messageTimeout);
  messageTimeout = setTimeout(function () {
    showMessages.classList.add("hide");
  }, 2000);

  function showColorCode(
    color: string | null,
    colorFormat: string | null
  ): string {
    if (color === null || colorFormat === null) return;

    let rgbColor = hexToRgb(color, false) as ColorRGB;

    switch (colorFormat) {
      case "RGB":
        return hexToRgb(color, true) as string;
      case "HEX":
        return JSON.parse(localStorage.getItem(storage.addHexCharacter))
          ? color
          : color.slice(1);
      case "HSL":
        return rgbToHsl(rgbColor);
      case "HSV":
        return rgbToHsv(rgbColor);
    }
  }
}

function savedColorClicked(color: string): void {
  if (!color) return;

  setSelectedColor(color);

  if (movingColor) {
    showMessage("Drag to move color", null, null);
    return;
  }

  if (selectingTintsShades) {
    if (renderedTintsShades) return;

    showMessage("Click colors to save", null, null);
    renderTintsShades();
    return;
  }

  if (deletingColor) {
    deleteColor(color);
    return;
  }

  let text = "";
  if (JSON.parse(localStorage.getItem(storage.autoCopyCode))) {
    copyToClipboard(color, localStorage.getItem(storage.colorCodeFormat));
    text = "Copied";
  } else text = "Selected";

  showMessage(text, color, localStorage.getItem(storage.colorCodeFormat));
}

function saveColor(color: string): void {
  if (!color) return;

  if (savedColorsArray.includes(color)) {
    showMessage(
      "Already saved",
      color,
      localStorage.getItem(storage.colorCodeFormat)
    );
    return;
  }

  savedColorsArray.push(color);
  localStorage.setItem(
    storage.savedColorsArray,
    JSON.stringify(savedColorsArray)
  );

  savedColorsCount.textContent = String(savedColorsArray.length);

  if (!renderedTintsShades) renderColors();

  selectedColor.lastElementChild?.setAttribute("src", "");

  let text = "";
  if (JSON.parse(localStorage.getItem(storage.autoCopyCode))) {
    copyToClipboard(color, localStorage.getItem(storage.colorCodeFormat));
    text = "Saved and Copied";
  } else text = "Saved";

  showMessage(text, color, localStorage.getItem(storage.colorCodeFormat));
}

function copyToClipboard(color: string, colorFormat: string): void {
  let rgbColor = hexToRgb(color, false) as ColorRGB;

  switch (colorFormat) {
    case "RGB":
      navigator.clipboard.writeText(hexToRgb(color, true) as string);
      break;
    case "HEX":
      navigator.clipboard.writeText(
        JSON.parse(localStorage.getItem(storage.addHexCharacter))
          ? color
          : color.slice(1)
      );
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
      setSelectedColor(sRGBHex);

      if (JSON.parse(localStorage.getItem(storage.autoSaveEyedropper))) {
        saveColor(sRGBHex);

        JSON.parse(localStorage.getItem(storage.autoCopyCode)) &&
          copyToClipboard(
            sRGBHex,
            localStorage.getItem(storage.colorCodeFormat)
          );
      } else showMessage("Selected", sRGBHex, localStorage.getItem(storage.colorCodeFormat));
    } catch {
      showMessage("Closed Eye Dropper", null, null);
    }

    document.body.style.display = "block";
    document.body.className = "hide-animations";

    setTimeout(function () {
      document.body.className = "";
    }, 400);
  }, 10);
}

function renderTintsShades(): void {
  // set temporary colors per line to 10
  savedColors.style.setProperty("grid-template-columns", "repeat(10, 1fr)");
  root.style.setProperty("--rect-size", "28.3px");
  colorsPerLine.value = "10";

  let baseColorHSL = hexToHsl(localStorage.getItem(storage.selectedColor));
  let tintsShades = [];

  for (let i = 1; i <= 99; i++) {
    tintsShades.push(hslToHex(baseColorHSL.h, baseColorHSL.s, i));
  }

  // add li for each tint and shade
  savedColors.innerHTML = tintsShades
    .map(
      (color: string, index: number) => `
        <li class="color">
          <span class="rect tintsShades" data-color="${color}" style="background: ${color}; color: ${
        index < 40 ? "white" : "black"
      };">${index + 1}</span>
        </li>`
    )
    .join("");

  renderedTintsShades = true;

  addColorsListeners();
}

function deleteColor(color: string): void {
  if (!color) return;

  let deleteColorIndex: number = savedColorsArray.findIndex((clr: string) => {
    return clr === color;
  });

  if (deleteColorIndex === -1) return;

  savedColorsArray.splice(deleteColorIndex, 1);
  localStorage.setItem(
    storage.savedColorsArray,
    JSON.stringify(savedColorsArray)
  );

  savedColorsCount.textContent = String(savedColorsArray.length);

  renderColors();

  selectedColor.lastElementChild?.setAttribute("src", "icons/save.svg");

  showMessage("Deleted", color, localStorage.getItem(storage.colorCodeFormat));

  !savedColorsArray.length && resetEmptyColorsArray();
}

function downloadImage(): void {
  if (!savedColorsArray.length) return;

  let cardWidth = 200;
  let cardHeight = 250;
  let columnsInImage: number;

  if (savedColorsArray.length < 3) columnsInImage = 3;
  else if (
    savedColorsArray.length < 10 &&
    Number(localStorage.getItem(storage.colorsPerLine)) >
      savedColorsArray.length
  )
    columnsInImage = savedColorsArray.length;
  else columnsInImage = Number(localStorage.getItem(storage.colorsPerLine));

  let watermarkDiv = document.createElement("div");
  watermarkDiv.style.marginBottom = "-60px";
  watermarkDiv.style.position = "relative";
  watermarkDiv.style.zIndex = "10";
  watermarkDiv.style.marginLeft = `${
    (columnsInImage / 2) * cardWidth - 87.5
  }px`;

  let watermarkText = document.createElement("h1");
  watermarkText.textContent = "ColorPal";
  watermarkText.style.fontSize = "40px";
  watermarkText.style.fontWeight = "800";
  watermarkText.style.color =
    getComputedStyle(root).getPropertyValue("--highlight-color");
  watermarkText.style.textShadow = "0px 0px 4px black";

  watermarkDiv.appendChild(watermarkText);

  let colorsContainer = document.createElement("div");
  colorsContainer.append(watermarkDiv);
  colorsContainer.append(drawColors());

  let node = document.body.appendChild(colorsContainer);

  domtoimage
    .toBlob(node)
    .then((blob: Blob) => {
      let blobUrl = URL.createObjectURL(blob);
      let link = window.document.createElement("a");
      link.href = blobUrl;
      link.download = "ColorPal-Palette.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage("Downloaded PNG", null, null);
    })
    .catch(() => {
      showMessage("Error PNG download", null, null);
    })
    .finally(() => node.remove());

  function drawColors(): HTMLElement {
    let colorsContainer = document.createElement("div");
    colorsContainer.style.display = "grid";
    colorsContainer.style.gridTemplateColumns = `repeat(${localStorage.getItem(
      storage.colorsPerLine
    )}, 1fr)`;

    // templates
    let colorRectTemplate = document.createElement("div");
    colorRectTemplate.style.display = "grid";
    colorRectTemplate.style.gridTemplateRows = "1fr";
    colorRectTemplate.style.justifyItems = "center";
    colorRectTemplate.style.alignItems = "end";
    colorRectTemplate.style.width = `${cardWidth}px`;
    colorRectTemplate.style.height = `${cardHeight}px`;
    colorRectTemplate.style.color = "white";
    colorRectTemplate.style.textShadow = "0px 0px 4px black";

    let nameTextTemplate = document.createElement("h1");
    nameTextTemplate.style.whiteSpace = "nowrap";

    let colorsTextTemplate = document.createElement("h2");
    colorsTextTemplate.style.display = "grid";
    colorsTextTemplate.style.marginTop = "15px";
    colorsTextTemplate.style.fontSize = "16px";
    colorsTextTemplate.style.lineHeight = "22px";
    colorsTextTemplate.style.whiteSpace = "pre";

    let indexTextTemplate = document.createElement("h2");
    indexTextTemplate.style.marginTop = "5px";
    indexTextTemplate.style.fontSize = "12px";

    let index = 1;

    for (let color of savedColorsArray) {
      let colorRect = colorRectTemplate.cloneNode(false) as HTMLElement;
      colorRect.style.backgroundColor = color;

      let rgbColor = hexToRgb(color, false) as ColorRGB;

      if (
        localStorage.getItem(storage.showColorNames) === "Yes" ||
        localStorage.getItem(storage.showColorNames) === "Yes%"
      ) {
        let nameText = nameTextTemplate.cloneNode(false) as HTMLElement;

        let closestNamedColor = findClosestNamedColor(rgbColor);

        nameText.textContent = closestNamedColor.namedColor.name;

        if (nameText.textContent.length > 33) nameText.style.fontSize = "10px";
        else if (nameText.textContent.length > 30)
          nameText.style.fontSize = "11px";
        else if (nameText.textContent.length > 25)
          nameText.style.fontSize = "12px";
        else if (nameText.textContent.length > 20)
          nameText.style.fontSize = "13px";
        else if (nameText.textContent.length > 15)
          nameText.style.fontSize = "15px";
        else if (nameText.textContent.length > 10)
          nameText.style.fontSize = "16px";
        else nameText.style.fontSize = "18px";

        colorRect.appendChild(nameText);
      }

      let colorsText = colorsTextTemplate.cloneNode(false) as HTMLElement;

      colorsText.textContent += `${hexToRgb(color, true)}\r\n`;
      colorsText.textContent += `${
        JSON.parse(localStorage.getItem(storage.addHexCharacter))
          ? color
          : color.slice(1)
      }\r\n`;
      colorsText.textContent += `${rgbToHsl(rgbColor)}\r\n`;
      colorsText.textContent += `${rgbToHsv(rgbColor)}`;

      let indexText = indexTextTemplate.cloneNode(false) as HTMLElement;
      indexText.textContent = String(index++);

      colorRect.appendChild(colorsText);
      colorRect.appendChild(indexText);
      colorsContainer.appendChild(colorRect);
    }

    return colorsContainer;
  }
}

function downloadData(): void {
  if (!savedColorsArray.length) return;

  let dataString = `"Name","RGB","#HEX","HEX","HSL","HSV"\r\n`;

  for (let color of savedColorsArray) {
    let rgbColor = hexToRgb(color, false) as ColorRGB;

    let closestNamedColor = findClosestNamedColor(rgbColor);

    dataString += `"${closestNamedColor.namedColor.name}",`;
    dataString += `"${hexToRgb(color, true)}",`;
    dataString += `"${color}",`;
    dataString += `"${color.slice(1)}",`;
    dataString += `"${rgbToHsl(rgbColor)}",`;
    dataString += `"${rgbToHsv(rgbColor)}"\r\n`;
  }

  // encode data string as UTF-8 and convert it to Base64
  let dataUTF8 = new TextEncoder().encode(dataString);
  let dataBase64 =
    "data:text/csv;base64," + btoa(String.fromCharCode.apply(null, dataUTF8));

  let link = document.createElement("a");
  link.href = dataBase64;
  link.download = "ColorPal-Data.csv";
  link.click();
  link.remove;

  showMessage("Downloaded CSV", null, null);
}

function deleteAllColors(): void {
  if (confirm("Delete All Your Colors?")) {
    savedColorsArray.length = 0;
    localStorage.setItem(storage.savedColorsArray, "[]");
    showMessage("Deleted All", null, null);
    resetEmptyColorsArray();
  }
}

function resetEmptyColorsArray(): void {
  setSelectedColor("#000000");
  disableColorTools("all");
  savedColorsPanel.classList.add("hide");
}

function setMoveColor(moving: boolean): void {
  movingColor = moving;

  moveColorTool.setAttribute(
    "src",
    `icons/${movingColor ? "check" : "move"}.svg`
  );

  moveColorTool.style.setProperty(
    "filter",
    getComputedStyle(root).getPropertyValue(
      `--${movingColor ? "check" : "move"}-tool-filter`
    )
  );
}

function setTintsShades(selecting: boolean): void {
  selectingTintsShades = selecting;

  if (!selecting) {
    renderedTintsShades = false;
    setColorsPerLine(localStorage.getItem(storage.colorsPerLine));
  }

  tintsShadesTool.setAttribute(
    "src",
    `icons/${selectingTintsShades ? "check" : "tintsShades"}.svg`
  );

  tintsShadesTool.style.setProperty(
    "filter",
    getComputedStyle(root).getPropertyValue(
      `--${selectingTintsShades ? "check" : "tint-shades"}-tool-filter`
    )
  );
}

function setDeleteColor(deleting: boolean): void {
  deletingColor = deleting;

  deleteColorTool.setAttribute(
    "src",
    `icons/${deletingColor ? "check" : "delete"}.svg`
  );

  deleteColorTool.style.setProperty(
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

  movingColor && tools.includes("setMoveColor") && setMoveColor(false);

  selectingTintsShades &&
    tools.includes("setTintsShades") &&
    setTintsShades(false);

  deletingColor && tools.includes("setDeleteColor") && setDeleteColor(false);
}

eyeDropperButton.addEventListener("click", function () {
  eyeDropperButton.classList.contains("disable")
    ? showMessage("Not supported in Opera\r\nuse Chrome or Edge", null, null)
    : activateEyeDropper();
});

colorPalette.addEventListener("input", function () {
  clearTimeout(colorPaletteTimeout);

  colorPaletteTimeout = setTimeout(function () {
    setSelectedColor(colorPalette.value);

    showMessage(
      "Selected",
      colorPalette.value,
      localStorage.getItem(storage.colorCodeFormat)
    );
  }, 2);
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

colorsPageButton.addEventListener("click", function () {
  setPage("colors");
});

themeButton.addEventListener("click", function () {
  setTheme(localStorage.getItem(storage.theme) === "dark" ? "light" : "dark");
});

copyRGBButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storage.selectedColor), "RGB");

  showMessage("Copied", localStorage.getItem(storage.selectedColor), "RGB");
});

copyHexButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storage.selectedColor), "HEX");

  showMessage("Copied", localStorage.getItem(storage.selectedColor), "HEX");
});

copyHslButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storage.selectedColor), "HSL");

  showMessage("Copied", localStorage.getItem(storage.selectedColor), "HSL");
});

copyHsvButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storage.selectedColor), "HSV");

  showMessage("Copied", localStorage.getItem(storage.selectedColor), "HSV");
});

selectedColor.addEventListener("click", function () {
  savedColorsArray.includes(localStorage.getItem(storage.selectedColor))
    ? colorPalette.click()
    : saveColor(localStorage.getItem(storage.selectedColor));
});

collapseColorToolsIcon.addEventListener("click", function () {
  setCollapsedColorTools(
    !JSON.parse(localStorage.getItem(storage.collapsedColorTools))
  );
});

moveColorTool.addEventListener("click", function () {
  setMoveColor(!movingColor);
  disableColorTools(["setTintsShades", "setDeleteColor"]);
  renderColors();
});

tintsShadesTool.addEventListener("click", function () {
  setTintsShades(!selectingTintsShades);
  disableColorTools(["setMoveColor", "setDeleteColor"]);
  renderColors();
});

deleteColorTool.addEventListener("click", function () {
  setDeleteColor(!deletingColor);
  disableColorTools(["setMoveColor", "setTintsShades"]);
  renderColors();
});

downloadPNGTool.addEventListener("click", downloadImage);

downloadCSVTool.addEventListener("click", downloadData);

deleteAllColorsTool.addEventListener("click", deleteAllColors);

autoSaveEyeDropper.addEventListener("change", function () {
  localStorage.setItem(storage.autoSaveEyedropper, String(this.checked));
});

autoCopyCode.addEventListener("change", function () {
  localStorage.setItem(storage.autoCopyCode, String(this.checked));
});

colorCodeFormat.addEventListener("change", function () {
  localStorage.setItem(storage.colorCodeFormat, colorCodeFormat.value);
});

colorsPerLine.addEventListener("change", function () {
  root.style.setProperty("--rect-transition-time", "0.6s");

  setColorsPerLine(colorsPerLine.value);

  clearTimeout(colorsPerLineTimeout);
  colorsPerLineTimeout = setTimeout(function () {
    root.style.setProperty("--rect-transition-time", "0.3s");
  }, 600);
});

addHexCharacterOption.addEventListener("change", function () {
  localStorage.setItem(storage.addHexCharacter, String(this.checked));

  setSelectedColorCodes(localStorage.getItem(storage.selectedColor));
});

showColorName.addEventListener("change", function () {
  localStorage.setItem(storage.showColorNames, String(showColorName.value));

  setColorName(localStorage.getItem(storage.selectedColor));
});

showMessagesOption.addEventListener("change", function () {
  localStorage.setItem(storage.showMessages, String(this.checked));
});

reviewBanner.addEventListener("click", function () {
  localStorage.setItem(storage.reviewBannerClosed, "true");
  reviewBanner.classList.add("hide");

  window.open(
    "https://chromewebstore.google.com/detail/colorpal-color-picker-eye/mbnpegpimodgjmlbfhkkdgbcfjmgpoad/reviews"
  );
});
