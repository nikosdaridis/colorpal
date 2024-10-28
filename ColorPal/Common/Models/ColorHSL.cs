using System.Text.Json.Serialization;

namespace ColorPal.Common.Models
{
    public class ColorHSL
    {
        public ColorHSL() { }

        public ColorHSL(int h, int s, int l)
        {
            H = h;
            S = s;
            L = l;
        }

        [JsonPropertyName("h")]
        public int H { get; set; }

        [JsonPropertyName("s")]
        public int S { get; set; }

        [JsonPropertyName("l")]
        public int L { get; set; }
    }
}
