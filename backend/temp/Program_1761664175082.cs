using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MyBlocklyApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            object a;
              a = Console.ReadLine().Trim();
              if ((a ?? "").Equals(@"pass")) {
                  Console.WriteLine(@"acss");
              } else {
                  Console.WriteLine(@"none");
              }

        }
    }
}