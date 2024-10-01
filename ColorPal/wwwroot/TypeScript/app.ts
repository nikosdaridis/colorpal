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
