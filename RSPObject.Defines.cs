using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;

namespace Png2RspConverter.Defines
{
    [DataContract] public class PackerInfo
    {
        [DataMember(Name = "version", Order = 0)] public long Version = 1;
        [DataMember(Name = "encrypt", Order = 1)] public bool Encrypt = false;

        public PackerInfo() {}
        public PackerInfo(long version, bool encrypt)
        {
            Version = version;
            Encrypt = encrypt;
        }
    }
        
    [DataContract] public class ContentFileInfo
    { 
        [DataMember(Name = "p", Order = 0)] public string Name;
        [DataMember(Name = "o", Order = 1)] public long StartOffset;
        [DataMember(Name = "s", Order = 2)] public long Size;
        [DataMember(Name = "f", Order = 3)] public long FileSize;

        public ContentFileInfo() {}
        public ContentFileInfo(string fileName, byte[] data, long startOffsetWithoutOrigin)
        {
            Name = fileName;
            StartOffset = startOffsetWithoutOrigin;
            Size = FileSize = data.Length;
        }
        public ContentFileInfo(string filePath, long startOffsetWithoutOrigin)
        {
            Name = Path.GetFileName(filePath);
            StartOffset = startOffsetWithoutOrigin;
            Size = FileSize = new FileInfo(filePath).Length;
        }
    }


    [DataContract] public class MultiLangageText
    {
        [DataMember(Name = "en", Order = 0)] public string English;
        [DataMember(Name = "ja", Order = 1)] public string Japanese;

        public static implicit operator MultiLangageText((string en, string ja) src) => new MultiLangageText(){ English = src.en, Japanese = src.ja };
        public static implicit operator (string en, string ja)(MultiLangageText src) => (src.English, src.Japanese);
    }


    [DataContract] public class MetaData
    {
        [DataContract] public class ImageIndex
        {
            [DataMember(Name = "index", Order = 0)] public long index;

            public static implicit operator ImageIndex(long index) => new ImageIndex(){ index = index, };
            public static implicit operator long(ImageIndex index) => index.index;
        }

        [DataContract] public class ActionData
        {
            [DataMember(Name = "name", Order = 0)] public string Name;
            [DataMember(Name = "display-name", Order = 1)] public MultiLangageText DisplayName;
            [DataMember(Name = "n", Order = 2)] public ImageIndex OpenMouse;
            [DataMember(Name = "o", Order = 3)] public ImageIndex CloseMouse;
            [DataMember(Name = "c", Order = 4)] public ImageIndex CloseEye;

            public ActionData() {}
            public ActionData(string name, (string en, string ja) displayName, long openMouse, long? closeMouse = null, long? closeEye = null)
            {
                closeMouse = closeMouse ?? openMouse; // 口閉じ差分無し
                closeEye = closeEye ?? openMouse; // 目閉じ差分なし
                // 目閉じ＋口閉じは？？？

                Name = name;
                DisplayName = displayName;
                OpenMouse = openMouse;
                CloseMouse = closeMouse;
                CloseEye = closeEye;
            }
        }
        
        [DataMember(Name = "uk", Order = 0)] public string Name;
        [DataMember(Name = "display-name", Order = 1)] public MultiLangageText DisplayName;
        [DataMember(Name = "display-desc", Order = 2)] public MultiLangageText DisplayDescription;
        [DataMember(Name = "copyrights", Order = 3)] public List<string> Copyrights;
        [DataMember(Name = "thumbnail-img", Order = 4)] public string Thumbnail;
        [DataMember(Name = "image-files", Order = 5)] public List<string> ImageFiles;
        [DataMember(Name = "image-size", Order = 6)] public List<int> ImageSize;
        [DataMember(Name = "default-action", Order = 7)] public string DefaultAction;
        [DataMember(Name = "initial-action", Order = 8)] public string InitialAction;
        [DataMember(Name = "actions", Order = 9)] public List<ActionData> Actions;

        public MetaData() {}
        public MetaData(string name, (string en, string ja) displayName, (string en, string ja) displayDescription, IEnumerable<string> copyrights,
            string thumbnailFilePath, IEnumerable<string> imageFilePaths, IEnumerable<ActionData> actions, string defaultAction, string initialAction)
        {
            Name = name;
            DisplayName = displayName;
            DisplayDescription = displayDescription;
            Copyrights = copyrights.ToList();
            ImageFiles = imageFilePaths.Select(path => Path.GetFileName(path)).ToList();
            DefaultAction = defaultAction;
            InitialAction = initialAction;
            Actions = actions.ToList();

            var sizes = imageFilePaths.Select(path => GetPngSize(path)).ToArray();
            if(sizes.Distinct().Count() != 1) throw new Exception("Not some resolutions");
            ImageSize = new List<int>(){ sizes.First().w, sizes.First().h};

            if(!Path.GetExtension(thumbnailFilePath).Equals(".png", StringComparison.InvariantCultureIgnoreCase)) throw new Exception("PNG only");
            LoadThumbnail(thumbnailFilePath);
        }

        public void SaveThumbnail(string filePath)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            var buff = Convert.FromBase64String(Thumbnail);
            File.WriteAllBytes(filePath, buff);
        }
    
        void LoadThumbnail(string filePath)
        {
            var buff = File.ReadAllBytes(filePath);
            Thumbnail = Convert.ToBase64String(buff);
        }

        static (int w, int h) GetPngSize(string imageFilePath)
        {
            const int PNG_SIGNATURE_COUNT = 0x8;
            const int IHDR_SIZE_OFFSET = 0x8;
            const int DIMENSION_BYTE_COUNT = 0x4;

            using(var reader = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read))
            {
                var buff = new byte[DIMENSION_BYTE_COUNT];
                reader.Position = PNG_SIGNATURE_COUNT + IHDR_SIZE_OFFSET;
                reader.Read(buff);
                var w = BitConverter.ToInt32(buff.Reverse().ToArray()); // LE
                reader.Read(buff);
                var h = BitConverter.ToInt32(buff.Reverse().ToArray()); // LE
                return (w, h);
            }
        } 
    }

}
