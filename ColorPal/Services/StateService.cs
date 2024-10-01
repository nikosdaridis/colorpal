using ColorPal.Common;
using Microsoft.JSInterop;

namespace ColorPal.Services
{
    public sealed class StateService(IJSRuntime JSRuntime, LocalStorageService LocalStorageService)
    {
        /// <summary>
        /// Sets localstorage theme and updates css variables
        /// </summary>
        public async Task SetThemeAsync(Theme theme)
        {
            await LocalStorageService.SetKeyAsync(StorageKey.Theme, theme.GetValue());

            await SetCssVariableAsync(CSSVariable.Primary, Color.LightPrimary, Color.DarkPrimary);
            await SetCssVariableAsync(CSSVariable.Secondary, Color.LightSecondary, Color.DarkSecondary);
            await SetCssVariableAsync(CSSVariable.Text, Color.LightText, Color.DarkText);
            await SetCssVariableAsync(CSSVariable.ThemeInvert, Color.LightThemeInvert, Color.DarkThemeInvert);

            // Sets theme filter based on the current theme
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", CSSVariable.ThemeFilter.GetValue(), await JSRuntime.InvokeAsync<string>("getThemeFilter", theme.GetValue()));

            // Sets css variable for theme
            async Task SetCssVariableAsync(CSSVariable property, Color light, Color dark) =>
                await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", property.GetValue(), theme == Theme.Light ? light.GetValue() : dark.GetValue());
        }

        /// <summary>
        /// Sets localstorage theme and updates css variables
        /// </summary>
        public async Task SetThemeAsync(string theme) =>
            await SetThemeAsync(Enum.Parse<Theme>(theme, true));
    }
}
