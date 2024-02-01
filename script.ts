declare const domtoimage: any;

const getElement = (selector: string) =>
  document.querySelector(selector) as HTMLElement;

const root = getElement(":root");
const eyeDropperButton = getElement("#eyedropper-button");
const colorPalette = getElement("#color-palette") as HTMLInputElement;
const settingsButton = getElement("#settings-button");
const copyRGBButton = getElement("#copy-rgb-button");
const copyHexButton = getElement("#copy-hex-button");
const copyHslButton = getElement("#copy-hsl-button");
const copyHsvButton = getElement("#copy-hsv-button");
const colorsButtons = getElement(".colors-buttons");
const settingsButtons = getElement(".settings-buttons");
const colorsPageButton = getElement("#colors-page-button");
const themeButton = getElement("#theme-button");
const reviewBanner = getElement(".review-banner");
const savedColors = getElement(".saved-colors");
const collapseColorToolsIcon = getElement("#collapse-color-tools-icon");
const savedColorsTools = getElement(".saved-colors-tools");
const savedColorsCount = getElement(".saved-colors-count");
const moveColorTool = getElement("#move-color-tool");
const tintsShadesTool = getElement("#tints-shades-tool");
const deleteColorTool = getElement("#delete-color-tool");
const downloadPNGTool = getElement("#download-png-tool");
const downloadCSVTool = getElement("#download-csv-tool");
const deleteAllColorsTool = getElement("#delete-all-colors-tool");
const themeIcon = getElement("#theme-icon");
const settingsPanel = getElement(".settings-panel");
const codesNameMessages = getElement(".codes-name-messages");
const selectedColorRect = getElement(".selected-color-rect");
const savedColorsPanel = getElement(".saved-colors-panel");
const selectedColor = getElement(".selected-color .rect");
const colorNameText = getElement("#color-name-text");
const colorNamePercentage = getElement("#color-name-percentage");
const showMessages = getElement(".show-messages");
const showMessageText = getElement("#show-message-text");
const showMessageColorCode = getElement("#show-message-color-code");
const selectedColorRGB = getElement("#rgb");
const selectedColorHex = getElement("#hex");
const selectedColorHSL = getElement("#hsl");
const selectedColorHSV = getElement("#hsv");
const autoSaveEyeDropper = getElement(
  "#auto-save-eyedropper"
) as HTMLInputElement;
const autoCopyCode = getElement("#auto-copy-code") as HTMLInputElement;
const colorCodeFormat = getElement("#color-code-format") as HTMLInputElement;
const colorsPerLine = getElement(".colors-per-line") as HTMLInputElement;
const addHexCharacterOption = getElement(
  "#add-hex-character-option"
) as HTMLInputElement;
const showColorName = getElement("#show-color-name") as HTMLInputElement;
const showMessagesOption = getElement(
  "#show-messages-option"
) as HTMLInputElement;

const storageKeys = {
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

const latestVersion = "1.3.6";
const isChromeOS = navigator.userAgent.indexOf("CrOS") > -1;
const isOpera = navigator.userAgent.indexOf("OP") > -1;

var savedColorsArray: string[];
var namedColors: { name: string; rgb: ColorRGB }[];

var movingColor = false,
  selectingTintsShades = false,
  renderedTintsShades = false,
  deletingColor = false;

var messageTimeout = 0,
  disableAnimationsAndTransitionsTimeout = 0,
  colorPaletteTimeout = 0,
  colorsPerLineTimeout = 0;

initialize();
validateStorage();
setPage("colors");

function initialize(): void {
  // Fetch and set named colors from json
  fetch("/data/named-colors.json")
    .then((res) => res.json())
    .then((data) => {
      namedColors = data;
      setColorName(localStorage.getItem(storageKeys.selectedColor));
    });

  // Check for new version and update text
  latestVersion !== localStorage.getItem(storageKeys.version) && newVersion();
  document.querySelector("#version").textContent = `v${latestVersion}`;

  // Reset new version
  function newVersion(): void {
    localStorage.setItem(storageKeys.version, latestVersion);
    localStorage.setItem(storageKeys.reviewBannerClosed, "false");
    localStorage.setItem(storageKeys.openedCount, "0");
  }
}

function validateStorage(): void {
  // Set theme based on localStorage or prefers-color-scheme
  const storedTheme = localStorage.getItem(storageKeys.theme);
  setTheme(
    storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  // Validate and filter saved colors
  savedColorsArray = validateJson(storageKeys.savedColorsArray, "[]").filter(
    (color: string) => color.match(/^#[\dabcdef]{6}$/i)
  );
  localStorage.setItem(
    storageKeys.savedColorsArray,
    JSON.stringify(savedColorsArray)
  );

  // Validate and set color code format
  const validCodeFormats = ["RGB", "HEX", "HSL", "HSV"];
  const storedCodeFormat = localStorage.getItem(storageKeys.colorCodeFormat);
  localStorage.setItem(
    storageKeys.colorCodeFormat,
    validCodeFormats.includes(storedCodeFormat) ? storedCodeFormat : "HEX"
  );
  colorCodeFormat.value = localStorage.getItem(storageKeys.colorCodeFormat)!;

  // Validate and set colors per line
  const storedColorsPerLine = Number(
    localStorage.getItem(storageKeys.colorsPerLine)
  );
  setColorsPerLine(
    storedColorsPerLine >= 5 && storedColorsPerLine <= 10
      ? storedColorsPerLine
      : 6
  );

  // Validate and set show color names
  const validShowNames = ["No", "Yes", "Yes%"];
  const storedShowNames = localStorage.getItem(storageKeys.showColorNames);
  localStorage.setItem(
    storageKeys.showColorNames,
    validShowNames.includes(storedShowNames) ? storedShowNames : "Yes"
  );
  showColorName.value = localStorage.getItem(storageKeys.showColorNames);

  // Validate and set boolean options
  validateTrueOrFalse(storageKeys.autoSaveEyedropper, "true");
  validateTrueOrFalse(storageKeys.autoCopyCode, "true");
  validateTrueOrFalse(storageKeys.addHexCharacter, "true");
  validateTrueOrFalse(storageKeys.showMessages, "true");
  validateTrueOrFalse(storageKeys.collapsedColorTools, "false");
  validateTrueOrFalse(storageKeys.reviewBannerClosed, "false");

  setCollapsedColorTools(
    JSON.parse(localStorage.getItem(storageKeys.collapsedColorTools))
  );

  // Validate and set selected color
  const storedSelectedColor = localStorage.getItem(storageKeys.selectedColor);
  setSelectedColor(
    storedSelectedColor && storedSelectedColor.match(/^#[\dabcdef]{6}$/i)
      ? storedSelectedColor
      : "#000000"
  );

  // Update opened count
  localStorage.setItem(
    storageKeys.openedCount,
    String((parseInt(localStorage.getItem(storageKeys.openedCount)) || 0) + 1)
  );

  // Update visual checkboxes
  updateCheckboxState(autoSaveEyeDropper, storageKeys.autoSaveEyedropper);
  updateCheckboxState(autoCopyCode, storageKeys.autoCopyCode);
  updateCheckboxState(addHexCharacterOption, storageKeys.addHexCharacter);
  updateCheckboxState(showMessagesOption, storageKeys.showMessages);

  // Disable EyeDropper on ChromeOS and Opera
  isChromeOS && disableEyeDropper("ChromeOS");
  isOpera && disableEyeDropper("Opera");

  function validateJson(storageKey: string, fallbackValue: string): string[] {
    const storedValue = localStorage.getItem(storageKey) || fallbackValue;

    try {
      return JSON.parse(storedValue);
    } catch {
      localStorage.setItem(storageKey, fallbackValue);
      return JSON.parse(fallbackValue);
    }
  }

  function validateTrueOrFalse(storageKey: string, defaultValue: string): void {
    const storedValue = localStorage.getItem(storageKey);

    if (storedValue !== "true" && storedValue !== "false") {
      localStorage.setItem(storageKey, defaultValue);
    }
  }

  function disableEyeDropper(userAgent: string): void {
    eyeDropperButton.classList.add("disable", userAgent);
    document.querySelector(".feedback").classList.add("hide");
    localStorage.setItem(storageKeys.reviewBannerClosed, "true");
  }

  function updateCheckboxState(
    checkbox: HTMLInputElement,
    storageKey: string
  ): void {
    checkbox.checked = JSON.parse(localStorage.getItem(storageKey));
  }
}

function setTheme(theme: string): void {
  if (!theme) return;

  localStorage.setItem(storageKeys.theme, theme);

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

  localStorage.setItem(storageKeys.selectedColor, color);

  selectedColor.lastElementChild?.setAttribute(
    "src",
    `${savedColorsArray.includes(color) ? "" : "icons/save.svg"}`
  );

  colorPalette.value = color;
  selectedColor.style.background = color;
  root.style.setProperty("--selected-color", color);

  setSelectedColorCodes(color);
  setColorName(color);
  highlightSelectedColor(color);
}

function highlightSelectedColor(color: string) {
  document
    .querySelectorAll(".rect.selected")
    ?.forEach((element) => element.classList.remove("selected"));

  document.querySelector(`[data-color="${color}"]`)?.classList.add("selected");
}

function setSelectedColorCodes(color: string): void {
  selectedColorRGB.textContent = hexToRgb(color, "string");
  selectedColorHex.textContent = JSON.parse(
    localStorage.getItem(storageKeys.addHexCharacter)
  )
    ? color
    : color.slice(1);

  const rgbColor = hexToRgb(color);

  selectedColorHSL.textContent = rgbToHsl(rgbColor);
  selectedColorHSV.textContent = rgbToHsv(rgbColor);
}

function setColorName(color: string): void {
  if (!namedColors || !color) return;

  const showColorNames = localStorage.getItem(storageKeys.showColorNames);

  if (showColorNames === "No") {
    colorNameText.textContent = "";
    colorNamePercentage.textContent = "";
    return;
  }

  const closestNamedColor = findClosestNamedColor(hexToRgb(color));
  colorNameText.textContent = closestNamedColor.namedColor.name;

  if (
    showColorNames === "Yes%" &&
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

  localStorage.setItem(storageKeys.colorsPerLine, String(clrPerLine));
  colorsPerLine.value = String(clrPerLine);

  savedColors.style.setProperty(
    "grid-template-columns",
    `repeat(${String(clrPerLine)}, 1fr)`
  );

  const colorRectSizeMap: Record<number, string> = {
    5: "57px",
    6: "47px",
    7: "40px",
    8: "35px",
    9: "31px",
    10: "28px",
  };

  root.style.setProperty("--color-rect-size", colorRectSizeMap[clrPerLine]);
}

function setCollapsedColorTools(isCollapsed: boolean): void {
  localStorage.setItem(storageKeys.collapsedColorTools, String(isCollapsed));

  const action = isCollapsed ? "add" : "remove";
  savedColorsTools.classList[action]("hide");
  collapseColorToolsIcon.classList[action]("flip");

  disableColorTools("all");
  renderColors();
}

function setPage(page: string): void {
  document.body.className = "hide-animations";
  collapseColorToolsIcon.classList.add("hide-transitions");

  if (page === "colors") {
    hideElements(settingsButtons, settingsPanel);
    showElements(colorsButtons, selectedColorRect, codesNameMessages);

    // Check if review banner should be displayed
    if (
      !JSON.parse(localStorage.getItem(storageKeys.reviewBannerClosed)) &&
      Number(localStorage.getItem(storageKeys.openedCount)) > 50
    ) {
      setTimeout(function () {
        reviewBanner.classList.remove("hide");
      }, 5000);
    }

    // Disable animations and transitions temporarily
    clearTimeout(disableAnimationsAndTransitionsTimeout);
    disableAnimationsAndTransitionsTimeout = setTimeout(function () {
      document.body.className = "";
      collapseColorToolsIcon.classList.remove("hide-transitions");
    }, 400);

    updateSavedColorsCount();
    renderColors();
  } else if (page === "settings") {
    hideElements(
      colorsButtons,
      selectedColorRect,
      codesNameMessages,
      savedColorsPanel
    );
    showElements(settingsButtons, settingsPanel);
    disableColorTools("all");
  }

  function hideElements(...elements: HTMLElement[]): void {
    elements.forEach((element) => element.classList.add("hide"));
  }

  function showElements(...elements: HTMLElement[]): void {
    elements.forEach((element) => element.classList.remove("hide"));
  }
}

function renderColors(): void {
  if (!savedColorsArray.length) {
    savedColorsPanel.classList.add("hide");
    return;
  }

  savedColorsPanel.classList.remove("hide");

  // Add li with color rect for each color in savedColorsArray
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
      )}" style="background: ${color};">
            <img src="" draggable=false />
          </span>
        </li>`
    )
    .join("");

  addColorsListeners();
  highlightSelectedColor(localStorage.getItem(storageKeys.selectedColor));
}

function addColorsListeners(): void {
  document.querySelectorAll(".color .rect").forEach((color) => {
    color.addEventListener("click", (elem) => {
      savedColorClicked((elem.currentTarget! as HTMLElement).dataset.color);
    });

    // Color tools listeners
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
              ? "tintsShades"
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

  const draggables = document.querySelectorAll(".draggable");
  let draggingElement: HTMLElement, replacingElement: HTMLElement;
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
      elem.preventDefault();
      replacingElement = draggable as HTMLElement;
      replacingElement.classList.add("replacing");
    });

    draggable.addEventListener("dragstart", function () {
      draggingElement = draggable as HTMLElement;
      draggingElement.classList.add("dragging");
      draggingElement.lastElementChild.setAttribute("src", "");
    });

    draggable.addEventListener("dragend", function () {
      draggingElement.lastElementChild.setAttribute("src", "icons/move.svg");

      if (
        !mouseOverColor ||
        !replacingElement.dataset.color ||
        draggingElement.dataset.color === replacingElement.dataset.color
      ) {
        showMessage(
          `${
            (!mouseOverColor && "Drag over a color") ||
            ((!replacingElement.dataset.color ||
              draggingElement.dataset.color ===
                replacingElement.dataset.color) &&
              "Drag over another color")
          }`,
          null,
          null
        );

        draggable.classList.remove("dragging");
        draggable.classList.remove("replacing");
        return;
      }

      swapColors(draggingElement, replacingElement);
      draggable.classList.remove("dragging");
    });
  });
}

function swapColors(
  draggingElement: HTMLElement,
  replacingElement: HTMLElement
): void {
  const draggingIndex = savedColorsArray.indexOf(draggingElement.dataset.color);
  const replacingIndex = savedColorsArray.indexOf(
    replacingElement.dataset.color
  );

  if (draggingIndex === -1 || replacingIndex === -1) {
    showMessage("Something went wrong", null, null);
    return;
  }

  [savedColorsArray[draggingIndex], savedColorsArray[replacingIndex]] = [
    replacingElement.dataset.color,
    draggingElement.dataset.color,
  ];

  localStorage.setItem(
    storageKeys.savedColorsArray,
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

  for (const match of namedColors) {
    const dist = getRGBSumDistance(color, match.rgb);

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
    const squaredDistance =
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
  if (!JSON.parse(localStorage.getItem(storageKeys.showMessages))) return;

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

    const rgbColor = hexToRgb(color);

    switch (colorFormat) {
      case "RGB":
        return hexToRgb(color, "string");
      case "HEX":
        return JSON.parse(localStorage.getItem(storageKeys.addHexCharacter))
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
  if (JSON.parse(localStorage.getItem(storageKeys.autoCopyCode))) {
    copyToClipboard(color, localStorage.getItem(storageKeys.colorCodeFormat));
    text = "Copied";
  } else text = "Selected";

  showMessage(text, color, localStorage.getItem(storageKeys.colorCodeFormat));
}

function saveColor(color: string): void {
  if (!color) return;

  if (savedColorsArray.includes(color)) {
    showMessage(
      "Already saved",
      color,
      localStorage.getItem(storageKeys.colorCodeFormat)
    );
    return;
  }

  savedColorsArray.push(color);
  localStorage.setItem(
    storageKeys.savedColorsArray,
    JSON.stringify(savedColorsArray)
  );
  updateSavedColorsCount();

  if (!renderedTintsShades) renderColors();

  selectedColor.lastElementChild?.setAttribute("src", "");

  let text = "";
  if (JSON.parse(localStorage.getItem(storageKeys.autoCopyCode))) {
    copyToClipboard(color, localStorage.getItem(storageKeys.colorCodeFormat));
    text = "Saved and Copied";
  } else text = "Saved";

  showMessage(text, color, localStorage.getItem(storageKeys.colorCodeFormat));
}

function copyToClipboard(color: string, colorFormat: string): void {
  const rgbColor = hexToRgb(color);

  let textToCopy = "";
  switch (colorFormat) {
    case "RGB":
      textToCopy = hexToRgb(color, "string");
      break;
    case "HEX":
      textToCopy = JSON.parse(localStorage.getItem(storageKeys.addHexCharacter))
        ? color
        : color.slice(1);
      break;
    case "HSL":
      textToCopy = rgbToHsl(rgbColor);
      break;
    case "HSV":
      textToCopy = rgbToHsv(rgbColor);
      break;
  }

  navigator.clipboard.writeText(textToCopy);
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

      if (JSON.parse(localStorage.getItem(storageKeys.autoSaveEyedropper))) {
        saveColor(sRGBHex);

        JSON.parse(localStorage.getItem(storageKeys.autoCopyCode)) &&
          copyToClipboard(
            sRGBHex,
            localStorage.getItem(storageKeys.colorCodeFormat)
          );
      } else showMessage("Selected", sRGBHex, localStorage.getItem(storageKeys.colorCodeFormat));
    } catch {
      showMessage("Closed Eye Dropper", null, null);
    }

    document.body.style.display = "block";
    document.body.className = "hide-animations";

    setTimeout(function () {
      document.body.className = "";
    }, 400);
  }, 100);
}

function renderTintsShades(): void {
  // Set temporary colors per line to 10
  savedColors.style.setProperty("grid-template-columns", "repeat(10, 1fr)");
  root.style.setProperty("--color-rect-size", "28px");
  colorsPerLine.value = "10";

  const baseColorHSL = hexToHsl(
    localStorage.getItem(storageKeys.selectedColor)
  );

  // Generate an array of tints and shades
  const tintsShades = Array.from({ length: 99 }, (_, i) =>
    hslToHex(baseColorHSL.h, baseColorHSL.s, i++)
  );

  // Render li for each tint and shade
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

  const deleteColorIndex: number = savedColorsArray.indexOf(color);

  if (deleteColorIndex === -1) return;

  savedColorsArray.splice(deleteColorIndex, 1);
  localStorage.setItem(
    storageKeys.savedColorsArray,
    JSON.stringify(savedColorsArray)
  );
  updateSavedColorsCount();
  renderColors();
  selectedColor.lastElementChild?.setAttribute("src", "icons/save.svg");

  showMessage(
    "Deleted",
    color,
    localStorage.getItem(storageKeys.colorCodeFormat)
  );

  !savedColorsArray.length && resetEmptyColorsArray();
}

function downloadImage(): void {
  if (!savedColorsArray.length) return;

  const cardWidth = 200;
  const cardHeight = 250;
  const columnsInImage =
    savedColorsArray.length < 3
      ? 3
      : Math.min(
          Number(localStorage.getItem(storageKeys.colorsPerLine)),
          savedColorsArray.length
        );

  const watermarkDiv = document.createElement("div");
  watermarkDiv.style.marginBottom = "-60px";
  watermarkDiv.style.position = "relative";
  watermarkDiv.style.zIndex = "10";
  watermarkDiv.style.marginLeft = `${
    (columnsInImage / 2) * cardWidth - 87.5
  }px`;

  const watermarkText = document.createElement("h1");
  watermarkText.textContent = "ColorPal";
  watermarkText.style.fontSize = "40px";
  watermarkText.style.fontWeight = "800";
  watermarkText.style.color =
    getComputedStyle(root).getPropertyValue("--highlight-color");
  watermarkText.style.textShadow = "0px 0px 4px black";

  watermarkDiv.appendChild(watermarkText);

  const colorsContainer = document.createElement("div");
  colorsContainer.append(watermarkDiv);
  colorsContainer.append(drawColors());

  const node = document.body.appendChild(colorsContainer);

  domtoimage
    .toBlob(node)
    .then((blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
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
    const colorsContainer = document.createElement("div");
    colorsContainer.style.display = "grid";
    colorsContainer.style.gridTemplateColumns = `repeat(${localStorage.getItem(
      storageKeys.colorsPerLine
    )}, 1fr)`;

    // Templates
    const colorRectTemplate = document.createElement("div");
    colorRectTemplate.style.display = "grid";
    colorRectTemplate.style.gridTemplateRows = "1fr";
    colorRectTemplate.style.justifyItems = "center";
    colorRectTemplate.style.alignItems = "end";
    colorRectTemplate.style.width = `${cardWidth}px`;
    colorRectTemplate.style.height = `${cardHeight}px`;
    colorRectTemplate.style.color = "white";
    colorRectTemplate.style.textShadow = "0px 0px 4px black";

    const nameTextTemplate = document.createElement("h1");
    nameTextTemplate.style.whiteSpace = "nowrap";

    const colorsTextTemplate = document.createElement("h2");
    colorsTextTemplate.style.display = "grid";
    colorsTextTemplate.style.marginTop = "15px";
    colorsTextTemplate.style.fontSize = "16px";
    colorsTextTemplate.style.lineHeight = "22px";
    colorsTextTemplate.style.whiteSpace = "pre";

    const indexTextTemplate = document.createElement("h2");
    indexTextTemplate.style.marginTop = "5px";
    indexTextTemplate.style.fontSize = "12px";

    let index = 1;
    for (const color of savedColorsArray) {
      const colorRect = colorRectTemplate.cloneNode(false) as HTMLElement;
      colorRect.style.backgroundColor = color;

      const rgbColor = hexToRgb(color);

      if (localStorage.getItem(storageKeys.showColorNames)?.includes("Yes")) {
        const nameText = nameTextTemplate.cloneNode(false) as HTMLElement;
        const closestNamedColor = findClosestNamedColor(rgbColor);

        nameText.textContent = closestNamedColor.namedColor.name;

        const nameLength = nameText.textContent.length;
        if (nameLength > 33) nameText.style.fontSize = "10px";
        else if (nameLength > 30) nameText.style.fontSize = "11px";
        else if (nameLength > 25) nameText.style.fontSize = "12px";
        else if (nameLength > 20) nameText.style.fontSize = "13px";
        else if (nameLength > 15) nameText.style.fontSize = "15px";
        else if (nameLength > 10) nameText.style.fontSize = "16px";
        else nameText.style.fontSize = "18px";

        colorRect.appendChild(nameText);
      }

      const colorsText = colorsTextTemplate.cloneNode(false) as HTMLElement;

      colorsText.textContent += `${hexToRgb(color, "string")}\r\n`;
      colorsText.textContent += `${
        JSON.parse(localStorage.getItem(storageKeys.addHexCharacter))
          ? color
          : color.slice(1)
      }\r\n`;
      colorsText.textContent += `${rgbToHsl(rgbColor)}\r\n`;
      colorsText.textContent += `${rgbToHsv(rgbColor)}`;

      const indexText = indexTextTemplate.cloneNode(false) as HTMLElement;
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

  for (const color of savedColorsArray) {
    const rgbColor = hexToRgb(color);
    const closestNamedColor = findClosestNamedColor(rgbColor);

    dataString += `"${closestNamedColor.namedColor.name}",`;
    dataString += `"${hexToRgb(color, "string")}",`;
    dataString += `"${color}",`;
    dataString += `"${color.slice(1)}",`;
    dataString += `"${rgbToHsl(rgbColor)}",`;
    dataString += `"${rgbToHsv(rgbColor)}"\r\n`;
  }

  // Encode data string as UTF-8 and convert it to Base64
  const dataUTF8 = new TextEncoder().encode(dataString);
  const dataBase64 =
    "data:text/csv;base64," + btoa(String.fromCharCode.apply(null, dataUTF8));

  const link = document.createElement("a");
  link.href = dataBase64;
  link.download = "ColorPal-Data.csv";
  link.click();
  link.remove;

  showMessage("Downloaded CSV", null, null);
}

function deleteAllColors(): void {
  if (confirm("Delete All Your Colors?")) {
    savedColorsArray.length = 0;
    localStorage.setItem(storageKeys.savedColorsArray, "[]");
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
  setToolState(moveColorTool, movingColor, "move");
}

function setTintsShades(selecting: boolean): void {
  selectingTintsShades = selecting;

  if (!selectingTintsShades) {
    renderedTintsShades = false;
    setColorsPerLine(localStorage.getItem(storageKeys.colorsPerLine));
  }

  setToolState(tintsShadesTool, selectingTintsShades, "tintsShades");
}

function setDeleteColor(deleting: boolean): void {
  deletingColor = deleting;
  setToolState(deleteColorTool, deletingColor, "delete");
}

function setToolState(tool: HTMLElement, state: boolean, name: string): void {
  tool.setAttribute("src", `icons/${state ? "check" : name}.svg`);
  tool.style.setProperty(
    "filter",
    getComputedStyle(root).getPropertyValue(
      `--${state ? "check" : name}-tool-filter`
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

function updateSavedColorsCount(): void {
  savedColorsCount.textContent = String(savedColorsArray.length);
}

eyeDropperButton.addEventListener("click", function () {
  eyeDropperButton.classList.contains("disable")
    ? showMessage(
        `Not supported in\r\n${isChromeOS ? "ChromeOS" : "Opera"}, use\r\n${
          isChromeOS ? "Windows, Mac or Linux" : "Chrome or Edge"
        }`,
        null,
        null
      )
    : activateEyeDropper();
});

colorPalette.addEventListener("input", function () {
  clearTimeout(colorPaletteTimeout);

  colorPaletteTimeout = setTimeout(function () {
    setSelectedColor(colorPalette.value);

    showMessage(
      "Selected",
      colorPalette.value,
      localStorage.getItem(storageKeys.colorCodeFormat)
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
  setTheme(
    localStorage.getItem(storageKeys.theme) === "dark" ? "light" : "dark"
  );
});

copyRGBButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storageKeys.selectedColor), "RGB");

  showMessage("Copied", localStorage.getItem(storageKeys.selectedColor), "RGB");
});

copyHexButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storageKeys.selectedColor), "HEX");

  showMessage("Copied", localStorage.getItem(storageKeys.selectedColor), "HEX");
});

copyHslButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storageKeys.selectedColor), "HSL");

  showMessage("Copied", localStorage.getItem(storageKeys.selectedColor), "HSL");
});

copyHsvButton.addEventListener("click", function () {
  copyToClipboard(localStorage.getItem(storageKeys.selectedColor), "HSV");

  showMessage("Copied", localStorage.getItem(storageKeys.selectedColor), "HSV");
});

selectedColor.addEventListener("click", function () {
  savedColorsArray.includes(localStorage.getItem(storageKeys.selectedColor))
    ? colorPalette.click()
    : saveColor(localStorage.getItem(storageKeys.selectedColor));
});

collapseColorToolsIcon.addEventListener("click", function () {
  setCollapsedColorTools(
    !JSON.parse(localStorage.getItem(storageKeys.collapsedColorTools))
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
  localStorage.setItem(storageKeys.autoSaveEyedropper, String(this.checked));
});

autoCopyCode.addEventListener("change", function () {
  localStorage.setItem(storageKeys.autoCopyCode, String(this.checked));
});

colorCodeFormat.addEventListener("change", function () {
  localStorage.setItem(storageKeys.colorCodeFormat, colorCodeFormat.value);
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
  localStorage.setItem(storageKeys.addHexCharacter, String(this.checked));

  setSelectedColorCodes(localStorage.getItem(storageKeys.selectedColor));
});

showColorName.addEventListener("change", function () {
  localStorage.setItem(storageKeys.showColorNames, String(showColorName.value));

  setColorName(localStorage.getItem(storageKeys.selectedColor));
});

showMessagesOption.addEventListener("change", function () {
  localStorage.setItem(storageKeys.showMessages, String(this.checked));
});

reviewBanner.addEventListener("click", function () {
  localStorage.setItem(storageKeys.reviewBannerClosed, "true");
  reviewBanner.classList.add("hide");

  window.open(
    "https://chromewebstore.google.com/detail/colorpal-color-picker-eye/mbnpegpimodgjmlbfhkkdgbcfjmgpoad/reviews"
  );
});

colorNamePercentage.addEventListener("click", function () {
  const closestNamedColor = findClosestNamedColor(
    hexToRgb(localStorage.getItem(storageKeys.selectedColor))
  );
  const hexColor = rgbToHex(closestNamedColor.namedColor.rgb);

  setSelectedColor(hexColor);

  showMessage(
    "Selected",
    hexColor,
    localStorage.getItem(storageKeys.colorCodeFormat)
  );
});
