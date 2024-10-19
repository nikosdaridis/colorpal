using ColorPal.Common;
using ColorPal.Common.Models;
using Microsoft.JSInterop;
using System.Text.Json;

namespace ColorPal.Services
{
    public sealed class StateService
    {
        private readonly HttpClient _httpClient;
        private readonly IJSRuntime _jsRuntime;
        private readonly LocalStorageService _localStorageService;

        private List<ColorName> _colorNames = [];

        public StateService(HttpClient httpClient, IJSRuntime jsRuntime, LocalStorageService localStorageService)
        {
            _httpClient = httpClient;
            _jsRuntime = jsRuntime;
            _localStorageService = localStorageService;

            _jsRuntime.InvokeVoidAsync(JsFuncs.InitializeStateService.Value(), DotNetObjectReference.Create(this));
        }

        /// <summary>
        /// Sets localstorage theme and updates css variables
        /// </summary>
        public async Task SetThemeAsync(Theme theme)
        {
            await _localStorageService.SetKeyAsync(StorageKey.Theme, theme.Value());

            await SetCssVariableAsync(CSSVariable.Primary, Color.LightPrimary, Color.DarkPrimary);
            await SetCssVariableAsync(CSSVariable.Secondary, Color.LightSecondary, Color.DarkSecondary);
            await SetCssVariableAsync(CSSVariable.Text, Color.LightText, Color.DarkText);
            await SetCssVariableAsync(CSSVariable.ThemeInvert, Color.LightThemeInvert, Color.DarkThemeInvert);

            // Sets theme filter based on the current theme
            await _jsRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", CSSVariable.ThemeFilter.Value(),
                await _jsRuntime.InvokeAsync<string>(JsFuncs.GetThemeFilter.Value(), theme.Value()));

            // Sets css variable for theme
            async Task SetCssVariableAsync(CSSVariable property, Color light, Color dark) =>
                await _jsRuntime.InvokeVoidAsync("document.documentElement.style.setProperty", property.Value(), theme == Theme.Light ? light.Value() : dark.Value());
        }

        /// <summary>
        /// Sets localstorage theme and updates css variables
        /// </summary>
        public async Task SetThemeAsync(string theme) =>
            await SetThemeAsync(Enum.Parse<Theme>(theme, true));

        /// <summary>
        /// Parses color names json and stores in memory
        /// </summary>
        public async Task ParseAndStoreColorNamesAsync()
        {
            string namedColorsString = await _httpClient.GetStringAsync("Data/colorNames.json");

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
        [JSInvokable]
        public ColorName? FindClosestColorName(ColorRGB? colorRGB)
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
