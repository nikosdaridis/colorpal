const eyeDropperButton = document.querySelector("#eye-dropper");
const colorList = document.querySelector(".all-colors");
const clearAll = document.querySelector(".clear-all");
const settingsButton = document.querySelector("#settings-button");
const settingsPanel = document.querySelector(".settings-panel");
const colorCodes = document.querySelector(".color-codes")
const saveSelectedColor = document.querySelector(".save-selected-color");
const savedColors = document.querySelector(".saved-colors")
const selectedColor = document.querySelector(".selected-color .rect");
const saveColorButton = document.querySelector(".save-color-button");
const displayMessage = document.querySelector(".display-message");
const colorPalette = document.querySelector("#colorPicker");
const selectedColorRGB = document.getElementById("rgb");
const selectedColorHex = document.getElementById("hex");
const selectedColorHSL = document.getElementById("hsl");
const autoSaveEyeDropper = document.querySelector("#save-eye-dropper");
const autoCopyColorCode = document.querySelector("#copy-color-code");
const colorCodeFormat = document.querySelector("#code-format");
const displayMessagesOption = document.querySelector("#display-messages-option");
const savedColorsList = JSON.parse(localStorage.getItem("savedColorsList") || "[]");
var currSelectedColor = localStorage.getItem("currSelectedColor");
var timeout;

// Initialization
SetOptions();
ShowSettingsHideColors();
if (currSelectedColor == null)
    ApplyCurrSelectedColor("#000000");
else
    ApplyCurrSelectedColor(currSelectedColor);

// Generating li for the selected color and add it to the savedColorsList
const showColors = () => {
    if (!savedColorsList.length) return;
    colorList.innerHTML = savedColorsList.map(color => `
        <li class="color">
            <span class="rect" data-color="${color}" style="background: ${color};"></span>
        </li>`).join("");
    ShowColorsHideSettings();

    // Add a click event listener to each color
    document.querySelectorAll(".color").forEach(lin => {
        lin.addEventListener("click", elem => savedColorClicked(elem.currentTarget.lastElementChild));
    });
}
showColors();

function SetOptions() {
    if (localStorage.getItem("autoSaveEyeDropper") == null) {
        autoSaveEyeDropper.value = true;
        localStorage.setItem("autoSaveEyeDropper", true);
    }
    else
        autoSaveEyeDropper.value = localStorage.getItem("autoSaveEyeDropper");

    if (localStorage.getItem("autoCopyColorCode") == null) {
        autoCopyColorCode.value = true;
        localStorage.setItem("autoCopyColorCode", true);
    }
    else
        autoCopyColorCode.value = localStorage.getItem("autoCopyColorCode");

    if (localStorage.getItem("colorCodeFormat") == null) {
        colorCodeFormat.value = "HEX";
        localStorage.setItem("colorCodeFormat", "HEX");
    }
    else
        colorCodeFormat.value = localStorage.getItem("colorCodeFormat");

    if (localStorage.getItem("displayMessagesOption") == null) {
        displayMessagesOption.value = true;
        localStorage.setItem("displayMessagesOption", true);
    }
    else
        displayMessagesOption.value = localStorage.getItem("displayMessagesOption");

    // Update checkbox
    if (autoSaveEyeDropper.value == "true")
        autoSaveEyeDropper.checked = true;
    if (autoCopyColorCode.value == "true")
        autoCopyColorCode.checked = true;
    if (displayMessagesOption.value == "true")
        displayMessagesOption.checked = true;
}

function DisplayMessageColorFormat(text, color) {
    if (localStorage.getItem("displayMessagesOption") != "true") return;

    if (localStorage.getItem("colorCodeFormat") == "RGB")
        DisplayMessage(text + " " + hexToRgb(color));
    if (localStorage.getItem("colorCodeFormat") == "HEX")
        DisplayMessage(text + " " + color);
    if (localStorage.getItem("colorCodeFormat") == "HSL")
        DisplayMessage(text + " " + hexToHsl(color));
}

function DisplayMessage(message) {
    displayMessage.classList.remove("hide");
    displayMessage.innerHTML = message;
    clearTimeout(timeout);
    timeout = setTimeout(() => displayMessage.classList.add("hide"), 3000);
}

const savedColorClicked = elem => {
    CopyColorCode(elem.dataset.color);
    ApplyCurrSelectedColor(elem.dataset.color);

    if (localStorage.getItem("autoCopyColorCode") == "true")
        DisplayMessageColorFormat("Copied", currSelectedColor);
    else
        DisplayMessageColorFormat("Selected", currSelectedColor);
}

function SaveColor(color) {
    if (savedColorsList.includes(color)) {
        DisplayMessageColorFormat("Already Saved", color);
        return;
    }

    if (color != null || color != "") {
        savedColorsList.push(color);
        localStorage.setItem("savedColorsList", JSON.stringify(savedColorsList));
        showColors();
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
    if (savedColorsList.includes(currSelectedColor))
        saveColorButton.classList.add("hide");
    else
        saveColorButton.classList.remove("hide");
}

function CopyColorCode(color) {
    if (localStorage.getItem("autoCopyColorCode") == "true") {
        if (colorCodeFormat.value == "RGB")
            navigator.clipboard.writeText(hexToRgb(color));
        else if (colorCodeFormat.value == "HEX")
            navigator.clipboard.writeText(color);
        else if (colorCodeFormat.value == "HSL")
            navigator.clipboard.writeText(hexToHsl(color));
    }
}

function ApplyCurrSelectedColor(color) {
    localStorage.setItem("currSelectedColor", color);
    currSelectedColor = localStorage.getItem("currSelectedColor");
    ShowHideSaveColorButton();
    colorPalette.value = currSelectedColor;

    selectedColor.style.background = color;
    selectedColorHex.textContent = color;
    if (color != "") {
        selectedColorRGB.textContent = hexToRgb(color);
        selectedColorHSL.textContent = hexToHsl(color);
    } else {
        selectedColorRGB.textContent = "";
        selectedColorHSL.textContent = "";
    }
}

function ShowSettingsHideColors() {
    savedColors.classList.add("hide");
    saveSelectedColor.classList.add("hide");
    colorCodes.classList.add("hide");
    displayMessage.classList.add("hide");
    settingsPanel.classList.remove("hide");
}

function ShowColorsHideSettings() {
    if (savedColorsList.length > 0)
        savedColors.classList.remove("hide");

    saveSelectedColor.classList.remove("hide");
    colorCodes.classList.remove("hide");
    displayMessage.classList.remove("hide");
    DisplayMessage("");
    settingsPanel.classList.add("hide");
}

const activateEyeDropper = () => {
    document.body.style.display = "none";
    ShowColorsHideSettings();
    setTimeout(async () => {
        try {
            // Opening the eye dropper and setting the selected color and hex code
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            ApplyCurrSelectedColor(sRGBHex);

            // Adding the color to the list if auto save eye dropper is true
            if (localStorage.getItem("autoSaveEyeDropper") == "true") {
                SaveColor(sRGBHex);
                CopyColorCode(sRGBHex);
            }
            else
                DisplayMessageColorFormat("Selected", sRGBHex);
        } catch (error) {
            console.log("Eye Dropper Failed!");
        }
        document.body.style.display = "block";
    }, 20);
}

const clearAllColors = () => {
    if (confirm("Delete All Your Colors?")) {
        savedColorsList.length = 0;
        localStorage.setItem("savedColorsList", JSON.stringify(savedColorsList));
        ShowSettingsHideColors();
        ApplyCurrSelectedColor("#000000"); // Apply black as selected color
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    var cssString = "rgb(" + r + ", " + g + ", " + b + ")";
    return cssString;
}

function hexToHsl(hex, valuesOnly = false) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    cssString = "";
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    cssString = h + ', ' + s + '%, ' + l + '%';
    cssString = !valuesOnly ? 'hsl(' + cssString + ')' : cssString;
    return cssString;
}

eyeDropperButton.addEventListener("click", activateEyeDropper);
clearAll.addEventListener("click", clearAllColors);
settingsButton.addEventListener("click", ShowSettingsHideColors);
saveColorButton.addEventListener("click", SaveColorButtonClicked);
colorPalette.addEventListener("click", ShowColorsHideSettings);

colorPalette.addEventListener('input', function () {
    ApplyCurrSelectedColor(colorPalette.value);
    DisplayMessageColorFormat("Selected", colorPalette.value);
});

// Options event listeners and save local storage
autoSaveEyeDropper.addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("autoSaveEyeDropper", true);
    } else {
        localStorage.setItem("autoSaveEyeDropper", false);
    }
});

autoCopyColorCode.addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("autoCopyColorCode", true);
    } else {
        localStorage.setItem("autoCopyColorCode", false);
    }
});

colorCodeFormat.addEventListener('change', function () {
    if (colorCodeFormat.value == "RGB") {
        localStorage.setItem("colorCodeFormat", "RGB");
    } else if (colorCodeFormat.value == "HEX") {
        localStorage.setItem("colorCodeFormat", "HEX");
    } else if (colorCodeFormat.value == "HSL") {
        localStorage.setItem("colorCodeFormat", "HSL");
    }
});

displayMessagesOption.addEventListener('change', function () {
    if (this.checked) {
        localStorage.setItem("displayMessagesOption", true);
    } else {
        localStorage.setItem("displayMessagesOption", false);
    }
});