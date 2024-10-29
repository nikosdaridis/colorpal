using MessagePack;
using MessagePack.Resolvers;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO.Compression;
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
            Console.WriteLine("Enter RGB rounding step value (recommended 3-5)");
            Console.WriteLine("Lower values will increase CPU load and file size significantly: ");

            if (!int.TryParse(Console.ReadLine(), out int step) || step < 1)
            {
                step = 5;
                Console.WriteLine("⚠️ Invalid input, defaulting to step = 5");
            }

            string inputUri = "https://unpkg.com/color-name-list/dist/colornames.json";
            string outputFilePath = @$"C:\Users\nikos\Desktop\_repos\colorpal\ColorPal\wwwroot\Data\colorNamesStep{step}.dat";

            Console.WriteLine($"⏳ Generating colors map with step = {step}...");
            Console.WriteLine($"📂 Output Path: {outputFilePath}");

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
                Dictionary<uint, string> colorsMap = colorNamesBinaryMap.GenerateRoundedColorMap(colorNames, step);

                await colorNamesBinaryMap.CompressAndSaveDataAsync(colorsMap, outputFilePath);
                stopwatch.Stop();

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

            List<ColorName> colorNames = [];
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

        public async Task CompressAndSaveDataAsync(Dictionary<uint, string> colorsMap, string filePath)
        {
            byte[] messagePackBytes = MessagePackSerializer.Serialize(colorsMap, ContractlessStandardResolver.Options.WithCompression(MessagePackCompression.Lz4Block));

            using MemoryStream memoryStream = new();
            using (GZipStream gzipStream = new(memoryStream, CompressionLevel.Optimal))
            {
                gzipStream.Write(messagePackBytes, 0, messagePackBytes.Length);
            }

            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);
            await File.WriteAllBytesAsync(filePath, memoryStream.ToArray());
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

        public Dictionary<uint, string> GenerateRoundedColorMap(List<ColorName> colorNames, int step)
        {
            ConcurrentDictionary<uint, string> colorsMap = new();
            ConcurrentDictionary<uint, byte> uniqueColors = new();
            object consoleLock = new();

            Parallel.For(0, 256, r =>
            {
                for (int g = 0; g < 256; g++)
                    for (int b = 0; b < 256; b++)
                        uniqueColors.TryAdd(GetColorKey(RoundColor(new ColorRGB { R = (byte)r, G = (byte)g, B = (byte)b }, step)), 0);
            });

            long currentIteration = 0;
            long totalIterations = uniqueColors.Count;

            Parallel.ForEach(Partitioner.Create(uniqueColors.Keys), roundedColorKey =>
            {
                ColorRGB roundedColor = new()
                {
                    R = (byte)(roundedColorKey >> 16 & 0xFF),
                    G = (byte)(roundedColorKey >> 8 & 0xFF),
                    B = (byte)(roundedColorKey & 0xFF)
                };

                ColorName? closestColor = FindClosestColorEuclideanDistance(roundedColor, colorNames);
                if (closestColor is not null)
                {
                    colorsMap.TryAdd(roundedColorKey, closestColor.Name!);
                    long iteration = Interlocked.Increment(ref currentIteration);

                    if (iteration % 1000 == 0)
                    {
                        lock (consoleLock)
                        {
                            Console.SetCursorPosition(0, Console.CursorTop);
                            Console.Write($"Progress: {iteration:N0}/{totalIterations:N0} ({Math.Min((iteration / (double)totalIterations) * 100, 100):F2}%)");
                        }
                    }
                }
            });

            Console.SetCursorPosition(0, Console.CursorTop);
            Console.WriteLine($"Progress: {totalIterations:N0}/{totalIterations:N0} (100.00%)");

            return new Dictionary<uint, string>(colorsMap);
        }

        static ColorRGB RoundColor(ColorRGB color, int step) =>
            new()
            {
                R = color.R >= 255 ? (byte)255 : (byte)((color.R / step) * step),
                G = color.G >= 255 ? (byte)255 : (byte)((color.G / step) * step),
                B = color.B >= 255 ? (byte)255 : (byte)((color.B / step) * step)
            };

        static uint GetColorKey(ColorRGB color) =>
            (uint)(color.R << 16 | color.G << 8 | color.B);

        private static ColorName? FindClosestColorEuclideanDistance(ColorRGB colorRGB, List<ColorName> colorNames)
        {
            ColorName? closestNamedColor = null;
            double highestSimilarity = double.MinValue;

            foreach (ColorName colorName in colorNames)
            {
                if (colorName.RGB is null)
                    continue;

                double rDiff = colorRGB.R - colorName.RGB.R;
                double gDiff = colorRGB.G - colorName.RGB.G;
                double bDiff = colorRGB.B - colorName.RGB.B;
                double squaredDistance = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;

                double similarity = ((441.67 - Math.Sqrt(squaredDistance)) / 441.67) * 100;

                if (similarity > highestSimilarity)
                {
                    closestNamedColor = colorName;
                    highestSimilarity = similarity;

                    if (highestSimilarity == 100)
                        return closestNamedColor;
                }
            }

            return closestNamedColor;
        }
    }
}
