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
const colorList = document.querySelector(".all-colors");
const deleteOnClick = document.querySelector(".delete-onclick");
const deleteAll = document.querySelector(".delete-all");
const lightModeIcon = document.querySelector('#light-mode-icon');
const root = document.querySelector(':root');
const settingsPanel = document.querySelector(".settings-panel");
const colorCodes = document.querySelector(".color-codes")
const saveSelectedColor = document.querySelector(".save-selected-color");
const savedColors = document.querySelector(".saved-colors")
const selectedColor = document.querySelector(".selected-color .rect");
const saveColorButton = document.querySelector(".save-color-button");
const displayMessage = document.querySelector(".display-message");
const selectedColorRGB = document.getElementById("rgb");
const selectedColorHex = document.getElementById("hex");
const selectedColorHSL = document.getElementById("hsl");
const selectedColorHSV = document.getElementById("hsv");
const autoSaveEyeDropper = document.querySelector("#save-eye-dropper");
const autoCopyColorCode = document.querySelector("#copy-color-code");
const colorCodeFormat = document.querySelector("#code-format");
const colorsPerLine = document.querySelector("#colors-per-line");
const allColors = document.querySelector('.all-colors');
const displayMessagesOption = document.querySelector("#display-messages-option");
const savedColorsArray = JSON.parse(localStorage.getItem("savedColorsArray") || "[]");
var currSelectedColor = localStorage.getItem("currSelectedColor");
var messageTimeout;

// Initialization
var deleteSelectedColorOnClick = false;
SetOptions();
SetLightDarkMode(localStorage.getItem("lightDarkMode"));
ShowSettingsHideColors();
if (currSelectedColor == null)
    ApplyCurrSelectedColor("#000000");
else
    ApplyCurrSelectedColor(currSelectedColor);
ShowColors();

function SetOptions() {
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
        case "HEX":
            colorCodeFormat.value = "HEX";
            break;
        case "RGB":
            colorCodeFormat.value = "RGB";
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
            SetColorsPerLine(8);
            break;
        case "6":
            colorsPerLine.value = "6";
            SetColorsPerLine(6);
            break;
        case "8":
            colorsPerLine.value = "8";
            SetColorsPerLine(8);
            break;
        case "10":
            colorsPerLine.value = "10";
            SetColorsPerLine(10);
            break;
        case "12":
            colorsPerLine.value = "12";
            SetColorsPerLine(12);
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

function SetLightDarkMode(mode) {
    if (mode == "dark") {
        lightModeIcon.classList.toggle('bxs-sun');
        root.style.setProperty('--first-color', '#24282a');
        root.style.setProperty('--second-color', '#2b353e');
        root.style.setProperty('--text-color', '#fafcff');
    }
}

function SetColorsPerLine(colorsPerLine) {
    switch (colorsPerLine) {
        case 6:
            allColors.style.setProperty("grid-template-columns", "repeat(6, 1fr)");
            root.style.setProperty("--rect-height", "71.2px");
            root.style.setProperty("--rect-width", "71.2px");
            root.style.setProperty("--rect-margin", "6.5px");
            break;
        case 8:
            allColors.style.setProperty("grid-template-columns", "repeat(8, 1fr)");
            root.style.setProperty("--rect-height", "53.2px");
            root.style.setProperty("--rect-width", "53.2px");
            root.style.setProperty("--rect-margin", "5px");
            break;
        case 10:
            allColors.style.setProperty("grid-template-columns", "repeat(10, 1fr)");
            root.style.setProperty("--rect-height", "42.2px");
            root.style.setProperty("--rect-width", "42.2px");
            root.style.setProperty("--rect-margin", "4.2px");
            break;
        case 12:
            allColors.style.setProperty("grid-template-columns", "repeat(12, 1fr)");
            root.style.setProperty("--rect-height", "35.2px");
            root.style.setProperty("--rect-width", "35.2px");
            root.style.setProperty("--rect-margin", "3.5px");
            break;
    }
}

function ToggleLightDarkMode() {
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

function ShowSettingsHideColors() {
    savedColors.classList.add("hide");
    saveSelectedColor.classList.add("hide");
    colorCodes.classList.add("hide");
    displayMessage.classList.add("hide");
    colorsTools.classList.add("hide");
    settingsTools.classList.remove("hide");
    settingsPanel.classList.remove("hide");
}

function ShowColorsHideSettings() {
    if (savedColorsArray.length > 0)
        savedColors.classList.remove("hide");

    saveSelectedColor.classList.remove("hide");
    colorCodes.classList.remove("hide");
    displayMessage.classList.remove("hide");
    DisplayMessage("");
    colorsTools.classList.remove("hide");
    settingsTools.classList.add("hide");
    settingsPanel.classList.add("hide");
}

function ApplyCurrSelectedColor(color) {
    if (color == null || color == "")
        return;

    localStorage.setItem("currSelectedColor", color);
    currSelectedColor = localStorage.getItem("currSelectedColor");
    ShowHideSaveColorButton();
    colorPalette.value = currSelectedColor;
    selectedColor.style.background = color;
    selectedColorHex.textContent = color;
    selectedColorRGB.textContent = HexToRgb(color);
    selectedColorHSL.textContent = HexToHsl(color);
    selectedColorHSV.textContent = HexToHsv(color);
}

// Generating li for the selected color and add it to the savedColorsArray
function ShowColors() {
    if (savedColorsArray.length <= 0)
        return;

    colorList.innerHTML = savedColorsArray.map(color => `
        <li class="color">
            <span class="rect" data-color="${color}" style="background: ${color};"></span>
        </li>`).join("");
    ShowColorsHideSettings();

    // Add a click event listener to each color
    document.querySelectorAll(".color").forEach(lin => {
        lin.addEventListener("click", element => SavedColorClicked(element.currentTarget.lastElementChild));
    });
}

function DisplayMessageColorFormat(text, color) {
    if (localStorage.getItem("displayMessagesOption") != "true")
        return;

    switch (localStorage.getItem("colorCodeFormat")) {
        case "RGB":
            DisplayMessage(`${text} ${HexToRgb(color)}`);
            break;
        case "HEX":
            DisplayMessage(`${text} ${color}`);
            break;
        case "HSL":
            DisplayMessage(`${text} ${HexToHsl(color)}`);
            break;
        case "HSV":
            DisplayMessage(`${text} ${HexToHsv(color)}`);
            break;
    }
}

function DisplayMessage(message) {
    displayMessage.classList.remove("hide");
    displayMessage.innerHTML = message;
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => displayMessage.classList.add("hide"), 3000);
}

function SavedColorClicked(element) {
    if (deleteSelectedColorOnClick) {
        ApplyCurrSelectedColor(element.dataset.color);
        DeleteOnClickColor(element.dataset.color);
        return;
    }

    CopyColorCode(element.dataset.color);
    ApplyCurrSelectedColor(element.dataset.color);

    if (localStorage.getItem("autoCopyColorCode") == "true")
        DisplayMessageColorFormat("Copied", currSelectedColor);
    else
        DisplayMessageColorFormat("Selected", currSelectedColor);
}

function SaveColor(color) {
    if (savedColorsArray.includes(color)) {
        DisplayMessageColorFormat("Already Saved", color);
        return;
    }

    if (color != null || color != "") {
        savedColorsArray.push(color);
        localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));
        ShowColors();
        if (localStorage.getItem("autoCopyColorCode") == "true")
            DisplayMessageColorFormat("Saved and Copied", color);
        else
            DisplayMessageColorFormat("Saved", color);
        CopyColorCode(color);
        ShowHideSaveColorButton();
    }
}

function SaveColorButtonClicked() {
    SaveColor(currSelectedColor);
    ShowHideSaveColorButton();
}

function ShowHideSaveColorButton() {
    if (savedColorsArray.includes(currSelectedColor))
        saveColorButton.classList.add("hide");
    else
        saveColorButton.classList.remove("hide");
}

function CopyColorCode(color) {
    if (localStorage.getItem("autoCopyColorCode") == "false")
        return;

    switch (localStorage.getItem("colorCodeFormat")) {
        case "RGB":
            navigator.clipboard.writeText(HexToRgb(color));
            break;
        case "HEX":
            navigator.clipboard.writeText(color);
            break;
        case "HSL":
            navigator.clipboard.writeText(HexToHsl(color));
            break;
        case "HSV":
            navigator.clipboard.writeText(HexToHsv(color));
            break;
    }
}

function CopyAndDisplayRgb() {
    navigator.clipboard.writeText(HexToRgb(currSelectedColor));

    if (localStorage.getItem("displayMessagesOption") == "true")
        DisplayMessage(`Copied ${HexToRgb(currSelectedColor)}`);
}

function CopyAndDisplayHex() {
    navigator.clipboard.writeText(currSelectedColor);

    if (localStorage.getItem("displayMessagesOption") == "true")
        DisplayMessage(`Copied ${currSelectedColor}`);
}

function CopyAndDisplayHsl() {
    navigator.clipboard.writeText(HexToHsl(currSelectedColor));

    if (localStorage.getItem("displayMessagesOption") == "true")
        DisplayMessage(`Copied ${HexToHsl(currSelectedColor)}`);
}

function CopyAndDisplayHsv() {
    navigator.clipboard.writeText(HexToHsv(currSelectedColor));

    if (localStorage.getItem("displayMessagesOption") == "true")
        DisplayMessage(`Copied ${HexToHsv(currSelectedColor)}`);
}

function ActivateEyeDropper() {
    document.body.style.display = "none";
    ShowColorsHideSettings();
    setTimeout(async () => {
        try {
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            ApplyCurrSelectedColor(sRGBHex);

            if (localStorage.getItem("autoSaveEyeDropper") == "true") {
                SaveColor(sRGBHex);
                CopyColorCode(sRGBHex);
            }
            else
                DisplayMessageColorFormat("Selected", sRGBHex);
        } catch (error) {
            console.log(error);
        }
        document.body.style.display = "block";
    }, 10);
}

function DeleteOnClickColor(color) {
    let colorIndex = savedColorsArray.findIndex((clr) => {
        return clr == color;
    });

    savedColorsArray.splice(colorIndex, 1);
    localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));
    ShowColors();
    DisplayMessageColorFormat("Deleted", color);

    if (currSelectedColor == color)
        ShowHideSaveColorButton();

    if (savedColorsArray.length <= 0) {
        ShowSettingsHideColors();
        ApplyCurrSelectedColor("#000000");
        ToggleDeleteOnClick();
    }
}

function DeleteAllColors() {
    if (confirm("Delete All Your Colors?")) {
        savedColorsArray.length = 0;
        localStorage.setItem("savedColorsArray", JSON.stringify(savedColorsArray));
        ApplyCurrSelectedColor("#000000");
        deleteSelectedColorOnClick = false;
        deleteOnClick.innerHTML = "Delete On Click";
        ShowSettingsHideColors();
    }
}

function ToggleDeleteOnClick() {
    if (deleteSelectedColorOnClick) {
        deleteSelectedColorOnClick = false;
        deleteOnClick.innerHTML = "Delete On Click";
    } else {
        deleteSelectedColorOnClick = true;
        deleteOnClick.innerHTML = "Done Deleting";
    }
}

function HexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    return `rgb(${r}, ${g}, ${b})`;
}

function HexToHsl(hex) {
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

function HexToHsv(hex) {
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

eyeDropperButton.addEventListener("click", ActivateEyeDropper);
colorPalette.addEventListener("click", ShowColorsHideSettings);
settingsButton.addEventListener("click", ShowSettingsHideColors);
colorsButton.addEventListener("click", ShowColorsHideSettings);
lightDarkButton.addEventListener("click", ToggleLightDarkMode);
copyRGBButton.addEventListener("click", CopyAndDisplayRgb);
copyHexButton.addEventListener("click", CopyAndDisplayHex);
copyHslButton.addEventListener("click", CopyAndDisplayHsl);
copyHsvButton.addEventListener("click", CopyAndDisplayHsv);
saveColorButton.addEventListener("click", SaveColorButtonClicked);
deleteOnClick.addEventListener("click", ToggleDeleteOnClick);
deleteAll.addEventListener("click", DeleteAllColors);


colorPalette.addEventListener('input', function () {
    ApplyCurrSelectedColor(colorPalette.value);
    DisplayMessageColorFormat("Selected", colorPalette.value);
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
        SetColorsPerLine(6);
    } else if (colorsPerLine.value == "8") {
        localStorage.setItem("colorsPerLine", "8");
        SetColorsPerLine(8);
    } else if (colorsPerLine.value == "10") {
        localStorage.setItem("colorsPerLine", "10");
        SetColorsPerLine(10);
    } else if (colorsPerLine.value == "12") {
        localStorage.setItem("colorsPerLine", "12");
        SetColorsPerLine(12);
    }
});

displayMessagesOption.addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("displayMessagesOption", "true");
    } else {
        localStorage.setItem("displayMessagesOption", "false");
    }
});