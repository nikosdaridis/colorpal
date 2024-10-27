using System.Text.Json.Serialization;

namespace ColorPal.Common.Models
{
    public class ColorHSL(int h, int s, int l)
    {
        [JsonPropertyName("h")]
        public int H { get; set; } = h;

        [JsonPropertyName("s")]
        public int S { get; set; } = s;

        [JsonPropertyName("l")]
        public int L { get; set; } = l;
    }
}
