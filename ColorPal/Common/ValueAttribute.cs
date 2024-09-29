using System.Reflection;

namespace ColorPal.Common
{
    [AttributeUsage(AttributeTargets.Field)]
    public sealed class ValueAttribute(string value) : Attribute
    {
        public string Value { get; } = value;
    }

    public static class EnumExtensions
    {
        /// <summary>
        /// Gets value from ValueAttribute
        /// </summary>
        public static string GetValue(this Enum enumField) =>
            enumField.GetType().GetField(enumField.ToString())?.GetCustomAttribute<ValueAttribute>()?.Value ?? string.Empty;
    }
}
