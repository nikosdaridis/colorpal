using Blazored.LocalStorage;
using ColorPal.Common;
using System.Reflection;

namespace ColorPal.Services
{
    public sealed class LocalStorageService(ILocalStorageService localStorageService)
    {
        /// <summary>
        /// Gets localstorage value for enum key
        /// </summary>
        public async Task<T?> GetKeyAsync<T>(StorageKeys key) =>
            await localStorageService.GetItemAsync<T>(GetEnumValue(key));

        /// <summary>
        /// Sets localstorage value for enum key
        /// </summary>
        public async Task SetKeyAsync<T>(StorageKeys key, T value) =>
            await localStorageService.SetItemAsync(GetEnumValue(key), value);

        /// <summary>
        /// Gets attribute value for enum
        /// </summary>
        private static string GetEnumValue(Enum value) =>
            value.GetType().GetField(value.ToString())?.GetCustomAttribute<ValueAttribute>()?.Value ?? string.Empty;
    }
}