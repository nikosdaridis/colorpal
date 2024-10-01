using Blazored.LocalStorage;
using ColorPal.Common;

namespace ColorPal.Services
{
    public sealed class LocalStorageService(ILocalStorageService LocalStorageService)
    {
        /// <summary>
        /// Gets localstorage value for enum key
        /// </summary>
        public async Task<T?> GetKeyAsync<T>(StorageKey key) =>
            await LocalStorageService.GetItemAsync<T>(key.GetValue());

        /// <summary>
        /// Sets localstorage value for enum key
        /// </summary>
        public async Task SetKeyAsync<T>(StorageKey key, T value) =>
            await LocalStorageService.SetItemAsync(key.GetValue(), value);
    }
}
