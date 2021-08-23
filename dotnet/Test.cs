// using System;
// using System.Collections.Generic;
// using System.IO;

// public static class Test
// {
//     static readonly byte[] PNG_SIGNATURE = new byte[]{ 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, };

//     public static void UnpackRSP(string srcFilePath, string dstDirePath)
//     {
//         var data = File.ReadAllBytes(srcFilePath);
        
//         var segments = new List<int>();
//         for (int i = 0, il = data.Length - PNG_SIGNATURE.Length; i < il; i++)
//         {
//             var signatureSpan = new Span<byte>(data, i, PNG_SIGNATURE.Length);
//             if(signatureSpan.SequenceEqual(PNG_SIGNATURE))
//             {
//                 segments.Add(i);
//             }
//         }
        
//         foreach (var item in segments)
//         {
//             Console.WriteLine(item);
//         }
//     }
// }