namespace ColorPal.Common
{
    [AttributeUsage(AttributeTargets.Field)]
    public class ValueAttribute(string value) : Attribute
    {
        public string Value { get; } = value;
    }
}
