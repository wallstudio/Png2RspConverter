using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization;

namespace Png2RspConverter.Defines
{
    [DataContract] public class PackerInfo
    {
        [DataMember(Name = "version")] public long Version;
        [DataMember(Name = "encrypt")] public bool Encrypt;
    }
        
    [DataContract] public class ContentFileInfo
    { 
        [DataMember(Name = "p")] public string Name;
        [DataMember(Name = "o")] public long StartOffset;
        [DataMember(Name = "s")] public long Size;
        [DataMember(Name = "f")] public long FileSize;
    }

    [DataContract] public class MultiLangageText
    {
        [DataMember(Name = "en")] public string English;
        [DataMember(Name = "ja")] public string Japanese; 
    }

    [DataContract] public class IndexContainer
    {
        [DataMember(Name = "index")] public long index;
    }

    [DataContract] public class ActionData
    {
        [DataMember(Name = "name")] public string Name; // "normal",
        [DataMember(Name = "display-name")] public MultiLangageText DisplayName; // {"en": "Wait-Normal","ja": "待機"}
        [DataMember(Name = "n")] public IndexContainer N; // {"index": 0},
        [DataMember(Name = "o")] public IndexContainer O; // {"index": 1},
        [DataMember(Name = "c")] public IndexContainer C; // {"index": 2},
    }

    [DataContract] public class MetaData
    {
        [DataMember(Name = "uk")] public string Name; //:"2D-Maki",
        [DataMember(Name = "display-name")] public MultiLangageText DisplayName; //:{"en":"2D-Tsurumaki Maki","ja":"2D-弦巻マキ"},
        [DataMember(Name = "display-desc")] public MultiLangageText DisplayDescription; //:{"en":"","ja":"弦巻マキの2Dキャラクターです。"},
        [DataMember(Name = "copyrights")] public List<string> Copyrights; //:["(C)AHS Co. Ltd."],
        [DataMember(Name = "thumbnail-img")] public string Thumbnail; //:"==", (based64)
        [DataMember(Name = "image-files")] public List<string> ImageFiles; //:["Maki_01.png","Maki_02.png","Maki_03.png","Maki_04.png"],
        [DataMember(Name = "image-size")] public List<int> ImageSize; //:[421,903],
        [DataMember(Name = "default-action")] public string DefaultAction; //:"normal",
        [DataMember(Name = "initial-action")] public string InitialAction; //:"smile",
        [DataMember(Name = "actions")] public List<ActionData> actions;

        public void SaveThumbnail(string filePath)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            var buff = Convert.FromBase64String(Thumbnail);
            File.WriteAllBytes(filePath, buff);
        }
    }

}
