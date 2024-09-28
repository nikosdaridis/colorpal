using ColorPal.Common;
using Microsoft.JSInterop;

namespace ColorPal.Services
{
    public sealed class StateService(IJSRuntime JSRuntime, LocalStorageService LocalStorageService)
    {
        /// <summary>
        /// Gets version from manifest.json
        /// </summary>
        public async Task<string> GetManifestVersionAsync() =>
            await JSRuntime.InvokeAsync<string>("getManifestVersionAsync");

        /// <summary>
        /// Sets localstorage theme and updates css variables
        /// </summary>
        public async Task SetThemeAsync(string theme)
        {
            await LocalStorageService.SetKeyAsync(StorageKeys.Theme, theme);

            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", "--primary-color", theme == "dark" ? "#09090b" : "#ffffff");
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", "--secondary-color", theme == "dark" ? "#27272a" : "#f4f4f5");
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", "--text-color", theme == "dark" ? "#9f9fa8" : "#787881");
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", "--theme-invert-color", theme == "dark" ? "#fafafa" : "#0a0a0a");

            string themeFilter = await JSRuntime.InvokeAsync<string>("getThemeFilter", theme);
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", "--theme-filter", themeFilter);
        }
    }
}
