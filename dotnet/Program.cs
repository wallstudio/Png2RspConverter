using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using Png2RspConverter.Defines;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Drawing.Processing;

namespace Png2RspConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            switch(args[0])
            {
                case "--unpack":
                    Unpack(args[1], args[2]);
                    break;
                case "--pack":
                    throw new NotImplementedException();
                case "--composite":
                    // "args": [
                    //     "--composite",
                    //     "output/composite.png",
                    //     ".composoteSampleImage/default_n.png.rdi",
                    //     ".composoteSampleImage/action10_n.png.rdi",
                    //     ".composoteSampleImage/action10_o.png.rdi"
                    // ],
                    Composite(args[1], args.Skip(2).ToArray());
                    break;
            }
        }

        static void Unpack(string input, string output)
        {
            var rsp = new RSPObject(input);
            var files = rsp.Extract(output);
        }
    
        static void Composite(string output, string[] inputs)
        {
            if(inputs.Any(path => Path.GetExtension(path) != ".rdi")) throw new Exception("not format RDI");

            using var baseStream = new FileStream(inputs.First(), FileMode.Open);
            baseStream.Position += 5; // 謎の5Byte
            using var @base = Image.Load(baseStream);

            foreach (var diffPath in inputs.Skip(1))
            {
                using var diffStream = new FileStream(diffPath, FileMode.Open);
                diffStream.Position += 5; // 謎の5Byte
                using var diff = Image.Load(diffStream);

                @base.Mutate(ctx => ctx.DrawImage(diff, 1));
            }

            @base.SaveAsPng(output);
        }

        static void TestUnpack()
        {
            var rsp = new RSPObject(@"2D-Maki.rsp");
            var files = rsp.Extract(".tmp/");
            rsp.Save(Path.Combine(".tmp/", "2D-Maki.rsp"));
        }
    
        static void TestPack()
        {
            var srcDirectory = "pack/";
            var rsp = new RSPObject(
                name: "2D-VFlower",
                displayName: ("2D-v_flower", "2D-花ちゃん"),
                displayDescription: ("", "うぷはしのテスト！"),
                copyrights: new []{"うぷはし"},
                thumbnailFilePath: Path.Combine(srcDirectory, "thumbnail.png"),
                imageFilePaths: new[]
                {
                    // あほ面
                    Path.Combine(srcDirectory, "vf_0000.png"), // へ
                    Path.Combine(srcDirectory, "vf_0001.png"), // U
                    Path.Combine(srcDirectory, "vf_0002.png"), // ω
                    Path.Combine(srcDirectory, "vf_0003.png"), // ワ
                    // うーん
                    Path.Combine(srcDirectory, "vf_0004.png"), // へ
                    Path.Combine(srcDirectory, "vf_0005.png"), // U
                    Path.Combine(srcDirectory, "vf_0006.png"), // ω
                    Path.Combine(srcDirectory, "vf_0007.png"), // ワ
                    // ぎゅっ
                    Path.Combine(srcDirectory, "vf_0008.png"), // へ
                    Path.Combine(srcDirectory, "vf_0009.png"), // U
                    Path.Combine(srcDirectory, "vf_0010.png"), // ω
                    Path.Combine(srcDirectory, "vf_0011.png"), // ワ
                    // キリッ
                    Path.Combine(srcDirectory, "vf_0012.png"), // へ
                    Path.Combine(srcDirectory, "vf_0013.png"), // U
                    Path.Combine(srcDirectory, "vf_0014.png"), // ω
                    Path.Combine(srcDirectory, "vf_0015.png"), // ワ
                },
                actions: new []
                {
                    new MetaData.ActionData("aho", ("aho", "あほ面"), 3, 2, 3),
                    new MetaData.ActionData("umm", ("umm", "うーん"), 7, 5, 7),
                    new MetaData.ActionData("gyu", ("gyu", "ぎゅっ"), 11, 9),
                    new MetaData.ActionData("kiri", ("kiri", "キリッ"), 15, 13, 11),
                },
                defaultAction: "kiri",
                initialAction: "kiri");
            rsp.Save(Path.Combine(srcDirectory, "2D-VFlower.rsp"));
            _ = new RSPObject(Path.Combine(srcDirectory, "2D-VFlower.rsp"));
        }
    
    }
}
