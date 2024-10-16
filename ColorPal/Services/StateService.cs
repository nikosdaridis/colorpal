using ColorPal.Common;
using ColorPal.Common.Models;
using Microsoft.JSInterop;
using System.Text.Json;

namespace ColorPal.Services
{
    public sealed class StateService(HttpClient HttpClient, IJSRuntime JSRuntime, LocalStorageService LocalStorageService)
    {
        private List<ColorName> _colorNames = [];

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

        /// <summary>
        /// Parses color names json and stores in memory
        /// </summary>
        public async Task ParseAndStoreColorNameAsync()
        {
            string namedColorsString = await HttpClient.GetStringAsync("Data/named-colors.json");

            try
            {
                _colorNames = JsonSerializer.Deserialize<List<ColorName>>(namedColorsString) ?? [];
            }
            catch (JsonException)
            {
                _colorNames = [];
            }
        }

        /// <summary>
        /// Gets color names
        /// </summary>
        public List<ColorName> GetColorNames() =>
            _colorNames;

        /// <summary>
        /// Finds closest named color based on rgb sum distance
        /// </summary>
        public ColorName? FindClosestNamedColor(ColorRGB? colorRGB)
        {
            if (colorRGB is null)
                return null;

            ColorName? closestNamedColor = null;
            int closestDistance = 765;

            foreach (ColorName match in GetColorNames())
            {
                if (match.RGB is null)
                    continue;

                int distance = GetRGBSumDistance(colorRGB, match.RGB);

                if (distance < closestDistance)
                {
                    closestNamedColor = match;
                    closestDistance = distance;

                    if (closestDistance == 0)
                        break;
                }
            }

            static int GetRGBSumDistance(ColorRGB color, ColorRGB match) =>
                Math.Abs(color.R - match.R) + Math.Abs(color.G - match.G) + Math.Abs(color.B - match.B);

            return closestNamedColor;
        }
    }
}
