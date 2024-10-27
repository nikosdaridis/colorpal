using Blazored.LocalStorage;
using ColorPal.Common;
using Microsoft.JSInterop;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ColorPal.Services
{
    public sealed partial class LocalStorageService(ILocalStorageService LocalStorageService, IJSRuntime JSRuntime)
    {
        [GeneratedRegex("^#[\\dabcdef]{6}$", RegexOptions.IgnoreCase)]
        private static partial Regex HexColorValidationRegex();

        /// <summary>
        /// Gets localstorage value for enum key
        /// </summary>
        public async Task<T?> GetKeyAsync<T>(StorageKey key) =>
            await LocalStorageService.GetItemAsync<T>(key.Value());

        /// <summary>
        /// Sets localstorage value for enum key
        /// </summary>
        public async Task SetKeyAsync<T>(StorageKey key, T value) =>
            await LocalStorageService.SetItemAsync(key.Value(), value);

        public async Task ValidateLocalStorageAsync()
        {
            // Validate Version
            string version = await JSRuntime.InvokeAsync<string>(JsFuncs.GetManifestVersionAsync.Value()) ?? string.Empty;
            await SetKeyAsync(StorageKey.Version, version);

            // Validate Theme
            string? storedTheme = await GetKeyAsync<string>(StorageKey.Theme);
            string theme = storedTheme == "light" || storedTheme == "dark"
                ? storedTheme
                : (await JSRuntime.InvokeAsync<string>(JsFuncs.GetClientColorScheme.Value()));
            await SetKeyAsync(StorageKey.Theme, theme);

            // Validate SelectedHexColor
            string storedSelectedHexColor = await GetKeyAsync<string>(StorageKey.SelectedHexColor) ?? "#000000";
            string selectedHexColor = HexColorValidationRegex().IsMatch(storedSelectedHexColor) ? storedSelectedHexColor : "#000000";
            await SetKeyAsync(StorageKey.SelectedHexColor, selectedHexColor);

            // Validate SavedColorsArray
            List<string> storedsavedColorsArray = await ValidateJsonArrayAsync(StorageKey.SavedColorsArray, "[]");
            storedsavedColorsArray = storedsavedColorsArray.Where(color => HexColorValidationRegex().IsMatch(color)).ToList();
            await SetKeyAsync(StorageKey.SavedColorsArray, storedsavedColorsArray);

            // Validate AutoSaveEyedropper
            await ValidateTrueOrFalseAsync(StorageKey.AutoSaveEyedropper, "true");

            // Validate AutoCopyCode
            await ValidateTrueOrFalseAsync(StorageKey.AutoCopyCode, "true");

            // Validate ColorCodeFormat
            string? storedColorCodeFormat = await GetKeyAsync<string>(StorageKey.ColorCodeFormat);
            if (!EnumExtensions.TryParse(storedColorCodeFormat, out ColorCodeFormat codeFormatEnum))
                codeFormatEnum = ColorCodeFormat.HEX;
            await SetKeyAsync(StorageKey.ColorCodeFormat, codeFormatEnum.Value());

            // Validate AddHexCharacter
            await ValidateTrueOrFalseAsync(StorageKey.AddHexCharacter, "true");

            // Validate ColorsPerLine
            string storedColorsPerLine = await GetKeyAsync<string>(StorageKey.ColorsPerLine) ?? "5";
            _ = int.TryParse(storedColorsPerLine, out int colorsPerLine);
            colorsPerLine = colorsPerLine >= 5 && colorsPerLine <= 10 ? colorsPerLine : 5;
            await SetKeyAsync(StorageKey.ColorsPerLine, colorsPerLine.ToString());

            // Validate ShowColorNames
            await ValidateTrueOrFalseAsync(StorageKey.ShowColorNames, "true");

            // Validate PrependBlackFilter
            await ValidateTrueOrFalseAsync(StorageKey.PrependBlackFilter, "false");

            async Task<List<string>> ValidateJsonArrayAsync(StorageKey key, string fallbackValue)
            {
                try
                {
                    string storedValue = await GetKeyAsync<string>(key) ?? string.Empty;
                    return JsonSerializer.Deserialize<List<string>>(storedValue) ?? JsonSerializer.Deserialize<List<string>>(fallbackValue)!;
                }
                catch
                {
                    await SetKeyAsync(key, fallbackValue);
                    return JsonSerializer.Deserialize<List<string>>(fallbackValue)!;
                }
            }

            async Task ValidateTrueOrFalseAsync(StorageKey key, string defaultValue)
            {
                string? storedValue = await GetKeyAsync<string>(key);
                if (storedValue != "true" && storedValue != "false")
                    await SetKeyAsync(key, defaultValue);
            }
        }
    }
}
