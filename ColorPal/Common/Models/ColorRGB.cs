using System.Text.Json.Serialization;

namespace ColorPal.Common.Models
{
    public class ColorRGB
    {
        [JsonPropertyName("r")]
        public int R { get; set; }

        [JsonPropertyName("g")]
        public int G { get; set; }

        [JsonPropertyName("b")]
        public int B { get; set; }
    }
}
