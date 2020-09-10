using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using Png2RspConverter.Defines;

namespace Png2RspConverter
{
    public class RSPObject
    {
        const string TMP_DIRECTORY_PATH = ".tmp/";
        const string INFO_JSON_FILE_NAME = "info.json";
        static readonly byte[] RSP_SIGNATURE = new byte[]{ 0x52, 0x53, 0x70, 0x65, 0x61, 0x6B, 0x65, 0x72, }; // "RSpeaker"
        

        public readonly PackerInfo PackerInfo = new PackerInfo();
        public readonly List<ContentFileInfo> ContentFileInfos = new List<ContentFileInfo>();
        public readonly Dictionary<string, (byte[] raw, object obj)> Contents = new Dictionary<string, (byte[], object)>();

        public RSPObject(string rspFile)
        {
            using(Stream stream = new FileStream(rspFile, FileMode.Open, FileAccess.Read))
            {
                var rspSignature = stream.ReadBytes(RSP_SIGNATURE.Length);
                // if (!RSP_SIGNATURE.SequenceEqual(rspSignature)) throw new InvalidDataException($"Invalid SIG");
        
                var packerInfoSize = stream.ReadInt();
                PackerInfo = stream.ReadBytes(packerInfoSize).Deserialize<PackerInfo>();
                if(PackerInfo.Encrypt) throw new Exception("Encrypted RSP");

                var contentFileInfoSize = stream.ReadInt();
                ContentFileInfos = stream.ReadBytes(contentFileInfoSize).Deserialize<List<ContentFileInfo>>();

                var contentsSize = stream.ReadLong();
                foreach (var contentFileInfo in ContentFileInfos)
                {
                    var buff = stream.ReadBytes(contentFileInfo.FileSize);
                    switch(Path.GetExtension(contentFileInfo.Name))
                    {
                        case ".json":
                            Contents[contentFileInfo.Name] = (buff, buff.Deserialize<MetaData>());
                            break;
                        case ".png":
                            // Directory.CreateDirectory(TMP_DIRECTORY_PATH);
                            // var fileName = Path.Combine(TMP_DIRECTORY_PATH, contentFileInfo.Name);
                            // File.WriteAllBytes(fileName, buff);
                            // Contents[contentFileInfo.Name] = fileName;
                            // break;
                        default:
                            Contents[contentFileInfo.Name] = (buff, null);
                            break;
                    }
                }
            }
        }

        public RSPObject(string name, (string en, string ja) displayName, (string en, string ja) displayDescription, IEnumerable<string> copyrights,
            string thumbnailFilePath, IEnumerable<string> imageFilePaths,
            IEnumerable<MetaData.ActionData> actions, string defaultAction, string initialAction)
        {
            var offset = 0;

            var metaData = new MetaData(
                name, displayName, displayDescription, copyrights,
                thumbnailFilePath, imageFilePaths, actions, defaultAction, initialAction);
            Contents[INFO_JSON_FILE_NAME] = (metaData.Serialize<MetaData>(), metaData);
            ContentFileInfos.Add(new ContentFileInfo(INFO_JSON_FILE_NAME, Contents[INFO_JSON_FILE_NAME].raw, offset));
            offset += Contents[INFO_JSON_FILE_NAME].raw.Length;

            foreach (var imagePath in imageFilePaths)
            {
                var fileName = Path.GetFileName(imagePath);
                Contents[fileName] = (File.ReadAllBytes(imagePath), null);
                ContentFileInfos.Add(new ContentFileInfo(imagePath, offset));
                offset += Contents[fileName].raw.Length;
            }
        }

        public IReadOnlyList<string> Extract(string directory)
        {
            Directory.CreateDirectory(directory);
            var filePaths = new List<string>();
            foreach (var kv in Contents)
            {
                var filePath = Path.Combine(directory, kv.Key);
                File.WriteAllBytes(filePath, kv.Value.raw);
                filePaths.Add(kv.Key);
            }
            return filePaths;
        }

        public void Save(string rspFile)
        {
            using(Stream stream = new FileStream(rspFile, FileMode.OpenOrCreate, FileAccess.ReadWrite))
            {
                stream.Position = 0;

                stream.Write(RSP_SIGNATURE);
                
                var packerInfo = PackerInfo.Serialize();
                stream.Write(BitConverter.GetBytes((int)packerInfo.Length));
                stream.Write(packerInfo);
                
                var contentFileInfos = ContentFileInfos.Serialize();
                stream.Write(BitConverter.GetBytes((int)contentFileInfos.Length));
                stream.Write(contentFileInfos);
                
                stream.Write(BitConverter.GetBytes((long)ContentFileInfos.Sum(c => c.Size)));
                var origin = stream.Position;
                foreach (var contentFileInfo in ContentFileInfos.OrderBy(info => info.StartOffset))
                {
                    if(stream.Position - origin != contentFileInfo.StartOffset) throw new Exception("Broken file info list");
                    stream.Write(Contents[contentFileInfo.Name].raw);
                }
            }
        }
    
    }
}
