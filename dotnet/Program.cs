using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using Png2RspConverter.Defines;

namespace Png2RspConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.ReadKey();
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
