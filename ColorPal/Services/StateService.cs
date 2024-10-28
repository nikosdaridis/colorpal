using ColorPal.Common;
using ColorPal.Common.Models;
using MessagePack;
using Microsoft.JSInterop;

namespace ColorPal.Services
{
    public sealed class StateService
    {
        private readonly HttpClient _httpClient;
        private readonly IJSRuntime _jsRuntime;
        private Dictionary<int, string> _colorNamesMap = [];
        private readonly int _colorNamesStep = 4;

        public StateService(HttpClient httpClient, IJSRuntime jsRuntime)
        {
            _httpClient = httpClient;
            _jsRuntime = jsRuntime;

            _jsRuntime.InvokeVoidAsync(JsFuncs.InitializeStateService.Value(), DotNetObjectReference.Create(this));
        }

        /// <summary>
        /// Checks if color names have been initialized
        /// </summary>
        public bool ColorNamesInitialized() =>
            _colorNamesMap.Count > 0;

        /// <summary>
        /// Parses binary color names file and caches it in memory
        /// </summary>
        public async Task ParseAndCacheColorNamesAsync()
        {
            try
            {
                byte[] binaryData = await _httpClient.GetByteArrayAsync(@$"Data/colorNamesStep{_colorNamesStep}.dat");

                _colorNamesMap = MessagePackSerializer.Deserialize<Dictionary<int, string>>(binaryData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing color names: {ex.Message}");
            }
        }

        /// <summary>
        /// Finds the closest rounded color name
        /// </summary>
        [JSInvokable]
        public string FindClosestRoundedColorName(ColorRGB colorRGB)
        {
            ColorRGB roundedColor = RoundColor(colorRGB, _colorNamesStep);
            int roundedColorKey = GetColorKey(roundedColor);
            if (_colorNamesMap.TryGetValue(roundedColorKey, out string? closestColorName) && closestColorName is not null)
                return closestColorName;

            return string.Empty;

            static ColorRGB RoundColor(ColorRGB color, int step)
            {
                return new ColorRGB
                {
                    R = color.R >= 255 ? (byte)255 : (byte)(Math.Round((color.R + step / 2.0) / step) * step),
                    G = color.G >= 255 ? (byte)255 : (byte)(Math.Round((color.G + step / 2.0) / step) * step),
                    B = color.B >= 255 ? (byte)255 : (byte)(Math.Round((color.B + step / 2.0) / step) * step)
                };
            }

            static int GetColorKey(ColorRGB color) =>
                (color.R << 16) | (color.G << 8) | color.B;
        }
    }
}
