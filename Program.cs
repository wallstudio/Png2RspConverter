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
            var rsp = new RSPObject(@"2D-Maki.rsp");
            var files = rsp.Extract(TMP_DIRECTORY_PATH);
            var meta = rsp.Contents.First(kv => kv.Key == "info.json").Value.obj as MetaData;
            meta.SaveThumbnail(Path.Combine(TMP_DIRECTORY_PATH, "thumbnail.png"));
            rsp.Save(Path.Combine(TMP_DIRECTORY_PATH, "out.rsp"));
        
            Console.ReadKey();
        }
    }
}
