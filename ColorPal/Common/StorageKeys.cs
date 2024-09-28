namespace ColorPal.Common
{
    public enum StorageKeys
    {
        [Value("colorpal-version")]
        Version,

        [Value("colorpal-theme")]
        Theme,

        [Value("colorpal-selected-color")]
        SelectedColor,

        [Value("colorpal-saved-colors-array")]
        SavedColorsArray,

        [Value("colorpal-auto-save-eyedropper")]
        AutoSaveEyedropper,

        [Value("colorpal-auto-copy-code")]
        AutoCopyCode,

        [Value("colorpal-color-code-format")]
        ColorCodeFormat,

        [Value("colorpal-add-hex-character")]
        AddHexCharacter,

        [Value("colorpal-colors-per-line")]
        ColorsPerLine,

        [Value("colorpal-show-color-names")]
        ShowColorNames,

        [Value("colorpal-collapsed-color-tools")]
        CollapsedColorTools,
    }
}
