using ColorPal.Common;
using Microsoft.JSInterop;

namespace ColorPal.Services
{
    public sealed class StateService(IJSRuntime JSRuntime, LocalStorageService LocalStorageService)
    {
        /// <summary>
        /// Sets localstorage theme and updates css variables
        /// </summary>
        public async Task SetThemeAsync(Themes theme)
        {
            await LocalStorageService.SetKeyAsync(StorageKeys.Theme, theme.GetValue());

            await SetCssVariableAsync(CSSVariables.Primary, Colors.LightPrimary, Colors.DarkPrimary);
            await SetCssVariableAsync(CSSVariables.Secondary, Colors.LightSecondary, Colors.DarkSecondary);
            await SetCssVariableAsync(CSSVariables.Text, Colors.LightText, Colors.DarkText);
            await SetCssVariableAsync(CSSVariables.ThemeInvert, Colors.LightThemeInvert, Colors.DarkThemeInvert);

            // Sets theme filter based on the current theme
            await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", CSSVariables.ThemeFilter.GetValue(), await JSRuntime.InvokeAsync<string>("getThemeFilter", theme.GetValue()));

            // Sets css variable for theme
            async Task SetCssVariableAsync(CSSVariables property, Colors light, Colors dark) =>
                await JSRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", property.GetValue(), theme == Themes.Light ? light.GetValue() : dark.GetValue());
        }

        /// <summary>
        /// Sets localstorage theme and updates css variables
        /// </summary>
        public async Task SetThemeAsync(string theme) =>
            await SetThemeAsync(Enum.Parse<Themes>(theme, true));
    }
}
