using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;

namespace Png2RspConverter
{
    public static class StreamExtentions
    {
        public static byte[] TakeWhileSequenceEqual(this Stream stream, byte[] pattern)
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

        public static byte[] Peek(this Stream stream, int length)
        {
            var postion = stream.Position;
            var buff = new byte[length];
            stream.Read(buff);
            stream.Position = postion;
            return buff;
        }

        public static int ReadInt(this Stream stream) => BitConverter.ToInt32(ReadBytes(stream, 4), 0);

        public static long ReadLong(this Stream stream) => BitConverter.ToInt64(ReadBytes(stream, 8), 0);

        public static byte[] ReadBytes(this Stream stream, long count)
        {
            var buff = new byte[count];
            stream.Read(buff);
            return buff;
        }

        public static T Deserialize<T>(this byte[] json)
        {
            var serializer = new DataContractJsonSerializer(typeof(T));
            using(var stream = new MemoryStream(json))
            {
                return (T)serializer.ReadObject(stream);
            }
        }
    
        public static byte[] Serialize<T>(this T obj)
        {
            var serializer = new DataContractJsonSerializer(typeof(T));
            using(var stream = new MemoryStream())
            {
                serializer.WriteObject(stream, obj);
                var buff = new byte[stream.Position];
                stream.Position = 0;
                stream.Read(buff);
                return buff;
            }
        }

        public static void Write(this Stream stream, byte[] bin) => stream.Write(bin, 0, bin.Length);
        public static void Read(this Stream stream, byte[] bin) => stream.Read(bin, 0, bin.Length);
    }
}