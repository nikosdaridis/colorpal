using System.Text.Json.Serialization;

namespace ColorPal.Common.Models
{
    public class ColorName
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("rgb")]
        public ColorRGB? RGB { get; set; }
    }
}
