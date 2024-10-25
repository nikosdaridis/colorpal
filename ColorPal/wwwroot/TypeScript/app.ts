declare const domtoimage: any;

var stateServiceReference: any;

// Initializes state service reference
function initializeStateService(dotNetObjectReference: any) {
    stateServiceReference = dotNetObjectReference;
}

// Gets dark or light theme filter 
function getThemeFilter(theme: string): string {
    const themeType = theme === "dark" ? "light" : "dark";
    const filterValue = getComputedStyle(document.documentElement).getPropertyValue(`--${themeType}-theme-filter`).trim();
    return filterValue;
};

// Gets version from manifest.json
async function getManifestVersionAsync(): Promise<string> {
    const response = await fetch("manifest.json");
    const manifest = await response.json();
    return manifest.version;
}

// Sets value of select element
function setSelectValue(elementId: string, value: string): void {
    const selectElement = document.getElementById(elementId) as HTMLSelectElement;
    if (!selectElement)
        return;

    selectElement.value = value;
}

// Sets value of grid columns
function setGridColumns(elementId: string, columns: string): void {
    const gridElement = document.getElementById(elementId) as HTMLElement;
    if (!gridElement)
        return;

    gridElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

// Activates eye dropper and returns hex color
function activateEyeDropper(): Promise<string | null> {
    document.body.style.display = "none";

    return new Promise((resolve) => {
        setTimeout(async function () {
            try {
                const eyeDropper = new (window as any).EyeDropper();
                const { sRGBHex } = await eyeDropper.open();

                resolve(sRGBHex);
            } catch {
                resolve(null);
            } finally {
                document.body.style.display = "block";
            }
        }, 100);
    });
}

// Opens color picker
function openColorPicker(elementId: string): void {
    const colorInput = document.getElementById(elementId);
    colorInput?.click();
}

// Copies text to clipboard
function copyToClipboard(text: string): void {
    if (!document.hasFocus())
        window.focus();

    try {
        navigator.clipboard.writeText(text);
    }
    catch { }
}

// Sets value of element
function setElementValue(elementId: string, value: string): void {
    const element = document.getElementById(elementId);
    if (!element)
        return;

    element.textContent = value;
}

// Downloads image of saved colors
async function downloadImage(savedColors: string[], colorsPerLine: number, showColorNames: boolean, addHexCharacter: boolean): Promise<void> {
    if (!savedColors.length)
        return;

    const cardWidth = 200;
    const cardHeight = 250;
    const columns = savedColors.length < 3 ? 3 : Math.min(colorsPerLine, savedColors.length);

    const colorsContainer = document.createElement("div");
    colorsContainer.append(await drawColors());
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
        })
        .catch()
        .finally(() => node.remove());

    async function drawColors(): Promise<HTMLElement> {
        const colorsContainer = document.createElement("div");
        colorsContainer.style.display = "grid";
        colorsContainer.style.gridTemplateColumns = `repeat(${colorsPerLine}, 1fr)`;

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
        for (const color of savedColors) {
            const colorRect = colorRectTemplate.cloneNode(false) as HTMLElement;
            colorRect.style.backgroundColor = color;

            const rgbColor = hexToRgb(color);

            if (showColorNames) {
                const nameText = nameTextTemplate.cloneNode(false) as HTMLElement;
                const colorName = await findClosestColorName(rgbColor) as ColorName | null;
                nameText.textContent = colorName?.name ?? "";

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

            colorsText.textContent += `${addHexCharacter ? color : color.slice(1)}\r\n`;
            colorsText.textContent += `${hexToRgb(color, "string")}\r\n`;
            colorsText.textContent += `${rgbToHsl(rgbColor, "string")}\r\n`;
            colorsText.textContent += `${rgbToHsv(rgbColor, "string")}`;

            const indexText = indexTextTemplate.cloneNode(false) as HTMLElement;
            indexText.textContent = String(index++);

            colorRect.appendChild(colorsText);
            colorRect.appendChild(indexText);
            colorsContainer.appendChild(colorRect);
        }

        return colorsContainer;

        async function findClosestColorName(rgb: ColorRGB): Promise<ColorName | null> {
            try {
                return await stateServiceReference?.invokeMethodAsync("FindClosestColorName", rgb) as ColorName | null;
            } catch {
                return null;
            }
        }
    }
}

// Downloads CSV file
function downloadCsv(dataString: string, fileName: string): void {
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(dataString)}`;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
