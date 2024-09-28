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
