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
        static readonly byte[] RSP_SIGNATURE = new byte[]{ 0x52, 0x53, 0x70, 0x65, 0x61, 0x6B, 0x65, 0x72, 0x1D, 0x00, 0x00, 0x00, };
        static readonly byte[] START_CONTENT_LIST_SIGNATURE = new byte[]{ 0x00, 0x01, 0x00, 0x00, };
        static readonly byte[] START_CONTENT_SIGNATURE = new byte[]{ 0x7F, 0x21, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, };
        

        public readonly PackerInfo PackerInfo;
        public readonly List<ContentFileInfo> ContentFileInfos;
        public readonly Dictionary<string, (byte[] raw, object obj)> Contents = new Dictionary<string, (byte[], object)>();

        public RSPObject(string rspFile)
        {
            using(Stream stream = new FileStream(rspFile, FileMode.Open, FileAccess.Read))
            {
                var rspSignature = new byte[RSP_SIGNATURE.Length];
                stream.Read(rspSignature, 0, RSP_SIGNATURE.Length);
                if (!RSP_SIGNATURE.SequenceEqual(rspSignature)) throw new InvalidDataException($"Invalid SIG");
        
                PackerInfo = Deserialize<PackerInfo>((TakeWhileSequenceEqual(stream, START_CONTENT_LIST_SIGNATURE)));
                if(PackerInfo.Encrypt) throw new Exception("Encrypted RSP");
                stream.Seek(START_CONTENT_LIST_SIGNATURE.Length, SeekOrigin.Current);
                ContentFileInfos = Deserialize<List<ContentFileInfo>>((TakeWhileSequenceEqual(stream, START_CONTENT_SIGNATURE)));
                stream.Seek(START_CONTENT_SIGNATURE.Length, SeekOrigin.Current);

                var origin = stream.Position;
                foreach (var contentFileInfo in ContentFileInfos)
                {
                    var buff = new byte[contentFileInfo.FileSize];
                    stream.Position = origin + contentFileInfo.StartOffset;
                    stream.Read(buff, 0, buff.Length);
                    switch(Path.GetExtension(contentFileInfo.Name))
                    {
                        case ".json":
                            Contents[contentFileInfo.Name] = (buff, Deserialize<MetaData>(buff));
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
                stream.Write(Serialize(PackerInfo));
                stream.Write(START_CONTENT_LIST_SIGNATURE);
                stream.Write(Serialize(ContentFileInfos));
                stream.Write(START_CONTENT_SIGNATURE);

                var origin = stream.Position;
                foreach (var contentFileInfo in ContentFileInfos.OrderBy(info => info.StartOffset))
                {
                    if(stream.Position - origin != contentFileInfo.StartOffset) throw new Exception("Broken file info list");
                    stream.Write(Contents[contentFileInfo.Name].raw);
                }
            }
        }

        static byte[] TakeWhileSequenceEqual(Stream stream, byte[] pattern)
        {
            var contentListData = new List<byte>();
            while (true)
            {
                var sig = Peek(stream, pattern.Length);
                if (pattern.SequenceEqual(sig))
                {
                    break;
                }

                contentListData.Add((byte)stream.ReadByte());
            }
            return contentListData.ToArray();
        }

        static byte[] Peek(Stream stream, int length)
        {
            var postion = stream.Position;
            var buff = new byte[length];
            stream.Read(buff);
            stream.Position = postion;
            return buff;
        }
    
        static T Deserialize<T>(byte[] json)
        {
            var serializer = new DataContractJsonSerializer(typeof(T));
            using(var stream = new MemoryStream(json))
            {
                return (T)serializer.ReadObject(stream);
            }
        }
    
        static byte[] Serialize<T>(T obj)
        {
            var serializer = new DataContractJsonSerializer(typeof(T));
            using(var stream = new MemoryStream())
            {
                serializer.WriteObject(stream, obj);
                var buff = new byte[stream.Position];
                stream.Position = 0;
                stream.Read(buff, 0, buff.Length);
                return buff;
            }
        }
    }
}
