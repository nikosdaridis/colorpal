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
const lightDarkButton = document.querySelector("#light-dark-mode");
const allColors = document.querySelector(".all-colors");
const deleteOnClick = document.querySelector(".delete-onclick");
const deleteAll = document.querySelector(".delete-all");
const lightModeIcon = document.querySelector("#light-mode-icon");
const root = document.querySelector(":root");
const settingsPanel = document.querySelector(".settings-panel");
const codesMessages = document.querySelector(".codes-messages")
const saveSelectedColor = document.querySelector(".save-selected-color");
const savedColors = document.querySelector(".saved-colors")
const selectedColor = document.querySelector(".selected-color .rect");
const saveColorButton = document.querySelector(".save-color-button");
const displayMessages = document.querySelector(".display-messages");
const displayMessageText = document.getElementById("text");
const displayMessageColorCode = document.getElementById("color-code");
const selectedColorRGB = document.getElementById("rgb");
const selectedColorHex = document.getElementById("hex");
const selectedColorHSL = document.getElementById("hsl");
const selectedColorHSV = document.getElementById("hsv");
const autoSaveEyeDropper = document.querySelector("#save-eye-dropper");
const autoCopyColorCode = document.querySelector("#copy-color-code");
const colorCodeFormat = document.querySelector("#code-format");
const colorsPerLine = document.querySelector("#colors-per-line");
const displayMessagesOption = document.querySelector("#display-messages-option");
const savedColorsArray = JSON.parse(localStorage.getItem("savedColorsArray") || "[]");
var currentSelectedColor = localStorage.getItem("currSelectedColor");
var messageTimeout, deleteColorOnClick;

// Initialization
disableDeleteOnClick();
setOptions();
setLightDarkMode(localStorage.getItem("lightDarkMode"));
showSettingsHideColors();
if (currentSelectedColor == null)
    applyCurrSelectedColor("#000000");
else
    applyCurrSelectedColor(currentSelectedColor);
showColors();

function setOptions() {
    if (localStorage.getItem("autoSaveEyeDropper") == null)
        localStorage.setItem("autoSaveEyeDropper", "true");

    if (localStorage.getItem("autoCopyColorCode") == null)
        localStorage.setItem("autoCopyColorCode", "true");

    // Update color code format visual
    switch (localStorage.getItem("colorCodeFormat")) {
        case null:
            localStorage.setItem("colorCodeFormat", "HEX");
            colorCodeFormat.value = "HEX";
            break;
        case "RGB":
            colorCodeFormat.value = "RGB";
            break;
        case "HEX":
            colorCodeFormat.value = "HEX";
            break;
        case "HSL":
            colorCodeFormat.value = "HSL";
            break;
        case "HSV":
            colorCodeFormat.value = "HSV";
            break;
        default:
            localStorage.setItem("colorCodeFormat", "HEX");
            colorCodeFormat.value = "HEX";
            break;
    }

    // Update colors per line visual
    switch (localStorage.getItem("colorsPerLine")) {
        case null:
            localStorage.setItem("colorsPerLine", "8");
            colorsPerLine.value = "8";
            setColorsPerLine(8);
            break;
        case "6":
            colorsPerLine.value = "6";
            setColorsPerLine(6);
            break;
        case "8":
            colorsPerLine.value = "8";
            setColorsPerLine(8);
            break;
        case "10":
            colorsPerLine.value = "10";
            setColorsPerLine(10);
            break;
        case "12":
            colorsPerLine.value = "12";
            setColorsPerLine(12);
            break;
        default:
            localStorage.setItem("colorsPerLine", "8");
            colorsPerLine.value = "8";
            break;
    }

    if (localStorage.getItem("displayMessagesOption") == null)
        localStorage.setItem("displayMessagesOption", "true");

    if (localStorage.getItem("lightDarkMode") == null)
        localStorage.setItem("lightDarkMode", "light");

    // Update check box visual
    if (localStorage.getItem("autoSaveEyeDropper") == "true")
        autoSaveEyeDropper.checked = true;
    if (localStorage.getItem("autoCopyColorCode") == "true")
        autoCopyColorCode.checked = true;
    if (localStorage.getItem("displayMessagesOption") == "true")
        displayMessagesOption.checked = true;
}

function setLightDarkMode(mode) {
    if (mode == "dark") {
        lightModeIcon.classList.toggle('bxs-sun');
        root.style.setProperty('--first-color', '#24282a');
        root.style.setProperty('--second-color', '#2b353e');
        root.style.setProperty('--text-color', '#fafcff');
    }
}

function setColorsPerLine(colorsPerLine) {
    switch (colorsPerLine) {
        case 6:
            allColors.style.setProperty("grid-template-columns", "repeat(6, 1fr)");
            root.style.setProperty("--rect-height", "71.1px");
            root.style.setProperty("--rect-width", "71.1px");
            root.style.setProperty("--rect-margin", "6.5px");
            break;
        case 8:
            allColors.style.setProperty("grid-template-columns", "repeat(8, 1fr)");
            root.style.setProperty("--rect-height", "53.1px");
            root.style.setProperty("--rect-width", "53.1px");
            root.style.setProperty("--rect-margin", "5px");
            break;
        case 10:
            allColors.style.setProperty("grid-template-columns", "repeat(10, 1fr)");
            root.style.setProperty("--rect-height", "42.1px");
            root.style.setProperty("--rect-width", "42.1px");
            root.style.setProperty("--rect-margin", "4.2px");
            break;
        case 12:
            allColors.style.setProperty("grid-template-columns", "repeat(12, 1fr)");
            root.style.setProperty("--rect-height", "35.1px");
            root.style.setProperty("--rect-width", "35.1px");
            root.style.setProperty("--rect-margin", "3.5px");
            break;
    }
}

function toggleLightDarkMode() {
    if (localStorage.getItem("lightDarkMode") == "light") {
        localStorage.setItem("lightDarkMode", "dark");
        root.style.setProperty('--first-color', '#24282a');
        root.style.setProperty('--second-color', '#2b353e');
        root.style.setProperty('--text-color', '#fafcff');

    } else if (localStorage.getItem("lightDarkMode") == "dark") {
        localStorage.setItem("lightDarkMode", "light");
        root.style.setProperty('--first-color', '#fafcff');
        root.style.setProperty('--second-color', '#e7e7f4');
        root.style.setProperty('--text-color', '#24282a');
    }

    lightModeIcon.classList.toggle('bxs-sun');
}

function showSettingsHideColors() {
    savedColors.classList.add("hide");
    saveSelectedColor.classList.add("hide");
    codesMessages.classList.add("hide");
    colorsTools.classList.add("hide");
    settingsTools.classList.remove("hide");
    settingsPanel.classList.remove("hide");
    disableDeleteOnClick();
}

function showColorsHideSettings() {
    if (savedColorsArray.length > 0)
        savedColors.classList.remove("hide");

    saveSelectedColor.classList.remove("hide");
    codesMessages.classList.remove("hide");
    colorsTools.classList.remove("hide");
    settingsTools.classList.add("hide");
    settingsPanel.classList.add("hide");
}

function applyCurrSelectedColor(color) {
    if (color == null || color == "")
        return;

    localStorage.setItem("currSelectedColor", color);
    currentSelectedColor = localStorage.getItem("currSelectedColor");
    showHideSaveColorButton();
    colorPalette.value = currentSelectedColor;
    selectedColor.style.background = color;
    selectedColorHex.textContent = color;
    selectedColorRGB.textContent = hexToRgb(color);
    selectedColorHSL.textContent = hexToHsl(color);
    selectedColorHSV.textContent = hexToHsv(color);
}

function showColors() {
    if (savedColorsArray.length <= 0)
        return;

    allColors.innerHTML = savedColorsArray.map(color => `
        <li class="color">
            <span class="rect" data-color="${color}" style="background: ${color};"></span>
        </li>`).join("");
    showColorsHideSettings();

    document.querySelectorAll(".color").forEach(lin => {
        lin.addEventListener("click", element => savedColorClicked(element.currentTarget.lastElementChild));
    });
}

function displayMessageAndColorFormat(text, color) {
    if (localStorage.getItem("displayMessagesOption") == "false")
        return;

    displayMessages.classList.remove("hide");

    displayMessageText.textContent = text;
    switch (localStorage.getItem("colorCodeFormat")) {
        case "RGB":
            displayMessageColorCode.textContent = hexToRgb(color);
            break;
        case "HEX":
            displayMessageColorCode.textContent = color;
            break;
        case "HSL":
            displayMessageColorCode.textContent = hexToHsl(color);
            break;
        case "HSV":
            displayMessageColorCode.textContent = hexToHsv(color);
            break;
    }

    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => displayMessages.classList.add("hide"), 3000);
}

function savedColorClicked(colorClicked) {
    if (deleteColorOnClick) {
        applyCurrSelectedColor(colorClicked.dataset.color);
        deleteOnClickColor(colorClicked.dataset.color);
        if (savedColorsArray.length <= 0)
            disableDeleteOnClick();
        return;
    }

    copyColorCode(colorClicked.dataset.color);
    applyCurrSelectedColor(colorClicked.dataset.color);

    if (localStorage.getItem("autoCopyColorCode") == "true")
        displayMessageAndColorFormat("Copied", currentSelectedColor);
    else
        displayMessageAndColorFormat("Selected", currentSelectedColor);
}

function saveColor(color) {
    if (savedColorsArray.includes(color)) {
        displayMessageAndColorFormat("Already Saved", color);
        return;
    }

    if (color != null || color != "") {
        savedColorsArray.push(color);
        localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));
        showColors();
        if (localStorage.getItem("autoCopyColorCode") == "true")
            displayMessageAndColorFormat("Saved and Copied", color);
        else
            displayMessageAndColorFormat("Saved", color);
        copyColorCode(color);
        showHideSaveColorButton();
    }
}

function saveColorButtonClicked() {
    saveColor(currentSelectedColor);
    showHideSaveColorButton();
}

function showHideSaveColorButton() {
    if (savedColorsArray.includes(currentSelectedColor))
        saveColorButton.classList.add("hide");
    else
        saveColorButton.classList.remove("hide");
}

function copyColorCode(color) {
    if (localStorage.getItem("autoCopyColorCode") == "false")
        return;

    switch (localStorage.getItem("colorCodeFormat")) {
        case "RGB":
            navigator.clipboard.writeText(hexToRgb(color));
            break;
        case "HEX":
            navigator.clipboard.writeText(color);
            break;
        case "HSL":
            navigator.clipboard.writeText(hexToHsl(color));
            break;
        case "HSV":
            navigator.clipboard.writeText(hexToHsv(color));
            break;
    }
}

function copyAndDisplayRgb() {
    navigator.clipboard.writeText(hexToRgb(currentSelectedColor));

    if (localStorage.getItem("displayMessagesOption") == "true")
        displayMessageAndColorFormat("Copied", hexToRgb(currentSelectedColor));
}

function copyAndDisplayHex() {
    navigator.clipboard.writeText(currentSelectedColor);

    if (localStorage.getItem("displayMessagesOption") == "true")
        displayMessageAndColorFormat("Copied", currentSelectedColor);
}

function copyAndDisplayHsl() {
    navigator.clipboard.writeText(hexToHsl(currentSelectedColor));

    if (localStorage.getItem("displayMessagesOption") == "true")
        displayMessageAndColorFormat("Copied", hexToHsl(currentSelectedColor));
}

function copyAndDisplayHsv() {
    navigator.clipboard.writeText(hexToHsv(currentSelectedColor));

    if (localStorage.getItem("displayMessagesOption") == "true")
        displayMessageAndColorFormat("Copied", hexToHsv(currentSelectedColor));
}

function activateEyeDropper() {
    document.body.style.display = "none";
    showColorsHideSettings();
    setTimeout(async () => {
        try {
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            applyCurrSelectedColor(sRGBHex);

            if (localStorage.getItem("autoSaveEyeDropper") == "true") {
                saveColor(sRGBHex);
                copyColorCode(sRGBHex);
            }
            else
                displayMessageAndColorFormat("Selected", sRGBHex);
        } catch (error) {
            console.log(error);
        }
        document.body.style.display = "block";
    }, 10);
}

function deleteOnClickColor(color) {
    let colorIndex = savedColorsArray.findIndex((clr) => {
        return clr == color;
    });

    savedColorsArray.splice(colorIndex, 1);
    localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));
    showColors();
    displayMessageAndColorFormat("Deleted", color);

    if (currentSelectedColor == color)
        showHideSaveColorButton();

    if (savedColorsArray.length <= 0) {
        showSettingsHideColors();
        applyCurrSelectedColor("#000000");
        toggleDeleteOnClick();
    }
}

function deleteAllColors() {
    if (confirm("Delete All Your Colors?")) {
        savedColorsArray.length = 0;
        localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));
        applyCurrSelectedColor("#000000");
        disableDeleteOnClick();
        showSettingsHideColors();
    }
}

function toggleDeleteOnClick() {
    if (deleteColorOnClick) {
        deleteColorOnClick = false;
        deleteOnClick.textContent = "Delete On Click";
    } else {
        deleteColorOnClick = true;
        deleteOnClick.textContent = "Done Deleting";
    }
}

function disableDeleteOnClick() {
    deleteColorOnClick = false;
    deleteOnClick.textContent = "Delete On Click";
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case
                g: h = (b - r) / d + 2;
                break;
            case
                b: h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

function hexToHsv(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
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

eyeDropperButton.addEventListener("click", activateEyeDropper);
colorPalette.addEventListener("click", showColorsHideSettings);
settingsButton.addEventListener("click", showSettingsHideColors);
colorsButton.addEventListener("click", showColorsHideSettings);
lightDarkButton.addEventListener("click", toggleLightDarkMode);
copyRGBButton.addEventListener("click", copyAndDisplayRgb);
copyHexButton.addEventListener("click", copyAndDisplayHex);
copyHslButton.addEventListener("click", copyAndDisplayHsl);
copyHsvButton.addEventListener("click", copyAndDisplayHsv);
saveColorButton.addEventListener("click", saveColorButtonClicked);
deleteOnClick.addEventListener("click", toggleDeleteOnClick);
deleteAll.addEventListener("click", deleteAllColors);


colorPalette.addEventListener('input', function () {
    applyCurrSelectedColor(colorPalette.value);
    displayMessageAndColorFormat("Selected", colorPalette.value);
});

autoSaveEyeDropper.addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("autoSaveEyeDropper", "true");
    } else {
        localStorage.setItem("autoSaveEyeDropper", "false");
    }
});

autoCopyColorCode.addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("autoCopyColorCode", "true");
    } else {
        localStorage.setItem("autoCopyColorCode", "false");
    }
});

colorCodeFormat.addEventListener('change', function () {
    if (colorCodeFormat.value == "RGB") {
        localStorage.setItem("colorCodeFormat", "RGB");
    } else if (colorCodeFormat.value == "HEX") {
        localStorage.setItem("colorCodeFormat", "HEX");
    } else if (colorCodeFormat.value == "HSL") {
        localStorage.setItem("colorCodeFormat", "HSL");
    } else if (colorCodeFormat.value == "HSV") {
        localStorage.setItem("colorCodeFormat", "HSV");
    }
});

colorsPerLine.addEventListener('change', function () {
    if (colorsPerLine.value == "6") {
        localStorage.setItem("colorsPerLine", "6");
        setColorsPerLine(6);
    } else if (colorsPerLine.value == "8") {
        localStorage.setItem("colorsPerLine", "8");
        setColorsPerLine(8);
    } else if (colorsPerLine.value == "10") {
        localStorage.setItem("colorsPerLine", "10");
        setColorsPerLine(10);
    } else if (colorsPerLine.value == "12") {
        localStorage.setItem("colorsPerLine", "12");
        setColorsPerLine(12);
    }
});

displayMessagesOption.addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("displayMessagesOption", "true");
    } else {
        localStorage.setItem("displayMessagesOption", "false");
    }
});