using System.Collections.Concurrent;
using System.Reflection;

namespace ColorPal.Common
{
    [AttributeUsage(AttributeTargets.Field)]
    public sealed class ValueAttribute(string value) : Attribute
    {
        public string Value { get; } = value;
    }

    /// <summary>
    /// Gets the value of enum with ValueAttribute
    /// </summary>
    public static class EnumExtensions
    {
        private static readonly ConcurrentDictionary<Enum, string> _enumValueCache = new();

        public static string Value(this Enum field) =>
            _enumValueCache.GetOrAdd(field, key =>
                key.GetType().GetField(key.ToString())?
                .GetCustomAttribute<ValueAttribute>()?.Value ?? string.Empty);
    }
}
