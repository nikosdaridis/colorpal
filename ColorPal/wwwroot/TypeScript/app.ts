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
    navigator.clipboard.writeText(text);
}

// Sets value of element
function setElementValue(elementId: string, value: string): void {
    const element = document.getElementById(elementId);
    if (!element)
        return;

    element.textContent = value;
}
