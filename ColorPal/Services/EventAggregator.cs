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
        public EventService<T> GetEventService(EventServiceType eventType)
        {
            string eventName = EventAggregator<T>.GetEnumValue(eventType);

            if (!_eventServices.TryGetValue(eventName, out EventService<T>? value))
            {
                value = new EventService<T>();
                _eventServices[eventName] = value;
            }

            return value;
        }

        /// <summary>
        /// Gets attribute value for enum
        /// </summary>
        private static string GetEnumValue(EventServiceType eventType)
        {
            FieldInfo? fieldInfo = eventType.GetType().GetField(eventType.ToString());
            if (fieldInfo is not null)
            {
                ValueAttribute? attribute = (ValueAttribute?)Attribute.GetCustomAttribute(fieldInfo, typeof(ValueAttribute));
                if (attribute is not null)
                {
                    return attribute.Value;
                }
            }

            return string.Empty;
        }
    }
}