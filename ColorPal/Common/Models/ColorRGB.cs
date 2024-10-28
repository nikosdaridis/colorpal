using MessagePack;

namespace ColorPal.Common.Models
{
    [MessagePackObject]
    public class ColorRGB
    {
        public ColorRGB() { }

        public ColorRGB(int r, int g, int b)
        {
            R = r;
            G = g;
            B = b;
        }

        [Key(0)]
        public int R { get; set; }

        [Key(1)]
        public int G { get; set; }

        [Key(2)]
        public int B { get; set; }
    }
}
