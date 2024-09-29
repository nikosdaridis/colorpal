namespace ColorPal.Common
{
    public enum Events
    {
        ColorCodeActiveTab,
    }

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

    public enum Themes
    {
        [Value("light")]
        Light,

        [Value("dark")]
        Dark
    }

    public enum CSSVariables
    {
        [Value("--primary-color")]
        Primary,

        [Value("--secondary-color")]
        Secondary,

        [Value("--text-color")]
        Text,

        [Value("--theme-invert-color")]
        ThemeInvert,

        [Value("--theme-filter")]
        ThemeFilter,
    }

    public enum Colors
    {
        [Value("#09090b")]
        DarkPrimary,

        [Value("#ffffff")]
        LightPrimary,

        [Value("#27272a")]
        DarkSecondary,

        [Value("#f4f4f5")]
        LightSecondary,

        [Value("#9f9fa8")]
        DarkText,

        [Value("#787881")]
        LightText,

        [Value("#fafafa")]
        DarkThemeInvert,

        [Value("#0a0a0a")]
        LightThemeInvert,
    }

    public enum Size
    {
        Small,
        Medium,
        Large
    }
}
