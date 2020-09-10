using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Png2RspConverter
{
    public class CommomObject
    {
        readonly Dictionary<string, byte[]>  m_Files = new Dictionary<string, byte[]>();

        public CommomObject(string filePath)
        {
            using(Stream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                stream.ReadBytes(6);
                var unknownLength = stream.ReadInt();
                var unknown = stream.ReadBytes(unknownLength);
                stream.ReadInt();

                var headers = new List<(string name, int offset, int size)>();
                while(true)
                {
                    var nameLength = stream.ReadInt();
                    var name = Encoding.UTF8.GetString(stream.ReadBytes(nameLength));
                    headers.Add((name, stream.ReadInt(), stream.ReadInt()));
                    
                    if(headers.FirstOrDefault().offset == stream.Position)
                    {
                        break;
                    }
                }

                foreach (var (name, offset, size) in headers)
                {
                    stream.Position = offset;
                    m_Files[name] = stream.ReadBytes(size);
                }
            }
        }

        public string[] Extract(string dirPath)
        {
            Directory.CreateDirectory(dirPath);
            foreach (var file in m_Files)
            {
                File.WriteAllBytes(Path.Combine(dirPath, file.Key), file.Value);
            }
            return m_Files.Keys.ToArray();
        }
    }
}