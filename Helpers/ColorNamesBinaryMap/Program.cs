using MessagePack;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ColorNamesBinaryMap
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;
            Console.Write("Enter step value for RGB processing (recommended 5). Lower values will increase CPU load significantly: ");

            if (!int.TryParse(Console.ReadLine(), out int step) || step < 1)
            {
                step = 5;
                Console.WriteLine("⚠️ Invalid input, defaulting to step = 5");
            }

            string inputUri = "https://unpkg.com/color-name-list@10.28.0/dist/colornames.json";
            string outputFilePath = @$"C:\Users\nikos\Desktop\_repos\colorpal\ColorPal\wwwroot\Data\colorNamesStep{step}.dat";

            Console.WriteLine($"⏳ Generating colors map with step = {step}...");

            Console.WriteLine(step switch
            {
                <= 2 => "⚠️ Brace yourself, your CPU is about to go turbo",
                <= 5 => "💻 Things are heating up, CPU is getting a workout",
                <= 10 => "🙂 Just a light workout for the CPU",
                _ => "😎 Relaxed mode"
            });

            try
            {
                ColorNamesBinaryMap colorNamesBinaryMap = new();
                List<ColorName> colorNames = await colorNamesBinaryMap.DownloadAndConvertColorDataAsync(inputUri);

                Stopwatch stopwatch = Stopwatch.StartNew();
                Dictionary<int, string> colorsMap = colorNamesBinaryMap.GenerateRoundedColorMap(colorNames, step);
                stopwatch.Stop();

                await colorNamesBinaryMap.SaveClosestColorDataAsync(colorsMap, outputFilePath);
                Console.WriteLine($"\n👍 Done in {stopwatch.Elapsed.TotalSeconds:F2} seconds!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"👎 Error: {ex.Message}");
            }
        }
    }

    [MessagePackObject]
    public class ColorName
    {
        [Key(0)]
        public string? Name { get; set; }

        [Key(1)]
        public ColorRGB? RGB { get; set; }
    }

    [MessagePackObject]
    public class ColorRGB
    {
        [Key(0)]
        public byte R { get; set; }

        [Key(1)]
        public byte G { get; set; }

        [Key(2)]
        public byte B { get; set; }
    }

    public class ColorNamesBinaryMap
    {
        private readonly HttpClient _httpClient = new();

        private class InputModel
        {
            [JsonPropertyName("name")]
            public string? Name { get; set; }

            [JsonPropertyName("hex")]
            public string? Hex { get; set; }
        }

        public async Task<List<ColorName>> DownloadAndConvertColorDataAsync(string uri)
        {
            string json = await _httpClient.GetStringAsync(uri);
            List<InputModel> inputColors = JsonSerializer.Deserialize<List<InputModel>>(json) ?? [];

            List<ColorName> colorNames = new();
            foreach (InputModel inputColor in inputColors)
            {
                colorNames.Add(new()
                {
                    Name = inputColor.Name,
                    RGB = HexToRgb(inputColor.Hex)
                });
            }

            return colorNames;
        }

        public async Task SaveClosestColorDataAsync(Dictionary<int, string> colorsMap, string filePath)
        {
            byte[] bytes = MessagePackSerializer.Serialize(colorsMap);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);
            await File.WriteAllBytesAsync(filePath, bytes);
        }

        private static ColorRGB HexToRgb(string? hex)
        {
            if (string.IsNullOrWhiteSpace(hex))
                return new ColorRGB { R = 0, G = 0, B = 0 };

            hex = hex.TrimStart('#');
            byte r = Convert.ToByte(hex[..2], 16);
            byte g = Convert.ToByte(hex.Substring(2, 2), 16);
            byte b = Convert.ToByte(hex.Substring(4, 2), 16);

            return new() { R = r, G = g, B = b };
        }

        public Dictionary<int, string> GenerateRoundedColorMap(List<ColorName> colorNames, int step)
        {
            ConcurrentDictionary<int, string> colorsMap = new();
            object lockObj = new();
            HashSet<int> uniqueColors = [];

            Parallel.For(0, 256, r =>
            {
                for (int g = 0; g < 256; g++)
                {
                    for (int b = 0; b < 256; b++)
                    {
                        ColorRGB roundedColor = RoundColor(new ColorRGB { R = (byte)r, G = (byte)g, B = (byte)b }, step);
                        int colorKey = GetColorKey(roundedColor);

                        if (!uniqueColors.Contains(colorKey))
                            lock (uniqueColors)
                                uniqueColors.Add(colorKey);
                    }
                }
            });

            int currentIteration = 0;
            int totalIterations = uniqueColors.Count;

            Parallel.For(0, 256, r =>
            {
                for (int g = 0; g < 256; g++)
                {
                    for (int b = 0; b < 256; b++)
                    {
                        ColorRGB roundedColor = RoundColor(new ColorRGB { R = (byte)r, G = (byte)g, B = (byte)b }, step);
                        int roundedColorKey = GetColorKey(roundedColor);

                        if (!colorsMap.ContainsKey(roundedColorKey))
                        {
                            ColorName? closestColor = FindClosestColor(roundedColor, colorNames);
                            if (closestColor is not null)
                            {
                                colorsMap.TryAdd(roundedColorKey, closestColor.Name!);
                                int iteration = Interlocked.Increment(ref currentIteration);

                                if (iteration <= totalIterations)
                                {
                                    double percentage = (iteration / (double)totalIterations) * 100;
                                    lock (lockObj)
                                    {
                                        Console.SetCursorPosition(0, Console.CursorTop);
                                        Console.Write($"Progress: {iteration:N0}/{totalIterations:N0} ({Math.Min(percentage, 100):F2}%)");
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return new Dictionary<int, string>(colorsMap);
        }

        static ColorRGB RoundColor(ColorRGB color, int step)
        {
            return new ColorRGB
            {
                R = color.R >= 255 ? (byte)255 : (byte)(Math.Round((color.R + step / 2.0) / step) * step),
                G = color.G >= 255 ? (byte)255 : (byte)(Math.Round((color.G + step / 2.0) / step) * step),
                B = color.B >= 255 ? (byte)255 : (byte)(Math.Round((color.B + step / 2.0) / step) * step)
            };
        }

        static int GetColorKey(ColorRGB color) =>
            (color.R << 16) | (color.G << 8) | color.B;

        private static ColorName? FindClosestColor(ColorRGB colorRGB, List<ColorName> colorNames)
        {
            ColorName? closestNamedColor = null;
            int closestDistance = int.MaxValue;

            foreach (ColorName colorName in colorNames)
            {
                if (colorName.RGB is null)
                    continue;

                int distance = GetRGBSumDistance(colorRGB, colorName.RGB);
                if (distance < closestDistance)
                {
                    closestNamedColor = colorName;
                    closestDistance = distance;

                    if (closestDistance == 0)
                        break;
                }
            }
            return closestNamedColor;

            static int GetRGBSumDistance(ColorRGB color, ColorRGB match) =>
                Math.Abs(color.R - match.R) + Math.Abs(color.G - match.G) + Math.Abs(color.B - match.B);
        }
    }
}
