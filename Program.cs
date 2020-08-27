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
        const string TMP_DIRECTORY_PATH = ".tmp/";

        static void Main(string[] args)
        {
            // Repack();
            // BuildMK();
            // BuildVF();
            new RSPObject("2D-Itako.rsp").Extract(".tmp/");

            // Console.ReadKey();
        }
    
        static void Repack()
        {
            var rsp = new RSPObject(@"2D-Maki.rsp");
            var files = rsp.Extract(TMP_DIRECTORY_PATH);
            rsp.Save(Path.Combine(TMP_DIRECTORY_PATH, "2D-Maki.rsp"));
        }

        static void BuildMK()
        {
            var srcDirectory = "pack/";
            var rsp = new RSPObject(
                name: "2D-Maki",
                displayName: ("2D-Tsurumaki Maki", "2D-弦巻マキ"),
                displayDescription: ("", "弦巻マキの2Dキャラクターです。"),
                copyrights: new []{"(C)AHS Co. Ltd."},
                thumbnailFilePath: @"C:\Users\huser\Desktop\Png2RspConverter\.tmp\thumbnail.png",
                imageFilePaths: new[]
                {
                    @"C:\Users\huser\Desktop\Png2RspConverter\.mk\Maki_01.png",
                    @"C:\Users\huser\Desktop\Png2RspConverter\.mk\Maki_02.png",
                    @"C:\Users\huser\Desktop\Png2RspConverter\.mk\Maki_03.png",
                    @"C:\Users\huser\Desktop\Png2RspConverter\.mk\Maki_04.png",
                },
                actions: new []
                {
                    new MetaData.ActionData("normal", ("Wait-Normal", "待機"), 0, 1, 2),
                    new MetaData.ActionData("smile", ("Smile", "喜び"), 2, 3, 2),
                },
                defaultAction: "normal",
                initialAction: "smile");
            rsp.Save(Path.Combine(srcDirectory, "2D-Maki.rsp"));
            _ = new RSPObject(Path.Combine(srcDirectory, "2D-Maki.rsp"));
        }
    
        static void BuildVF()
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
