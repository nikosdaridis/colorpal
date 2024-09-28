using ColorPal.Common;
using System.Reflection;

namespace ColorPal.Services
{
    public sealed class EventAggregator<T>
    {
        private readonly Dictionary<string, EventService<T>> _eventServices = [];

        /// <summary>
        /// Gets event service for event type
        /// </summary>
        public EventService<T> GetService(Events eventKey)
        {
            string value = EventAggregator<T>.GetEnumValue(eventKey);

            if (!_eventServices.TryGetValue(value, out EventService<T>? service))
            {
                service = new EventService<T>();
                _eventServices[value] = service;
            }

            return service;
        }

        /// <summary>
        /// Gets attribute value for enum
        /// </summary>
        private static string GetEnumValue(Events eventType)
        {
            FieldInfo? fieldInfo = eventType.GetType().GetField(eventType.ToString());
            if (fieldInfo is not null)
            {
                ValueAttribute? attribute = (ValueAttribute?)Attribute.GetCustomAttribute(fieldInfo, typeof(ValueAttribute));
                if (attribute is not null)
                    return attribute.Value;
            }

            return string.Empty;
        }
    }
}