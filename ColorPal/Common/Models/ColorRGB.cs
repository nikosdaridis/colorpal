using System.Text.Json.Serialization;

namespace ColorPal.Common.Models
{
    public class ColorRGB(int r, int g, int b)
    {
        [JsonPropertyName("r")]
        public int R { get; set; } = r;

        [JsonPropertyName("g")]
        public int G { get; set; } = g;

        [JsonPropertyName("b")]
        public int B { get; set; } = b;
    }
}
