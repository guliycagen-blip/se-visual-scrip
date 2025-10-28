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
            var a;
              a = Console.ReadLine();
              if (a == @"pass") {
                  Console.WriteLine(@"a");
              } else {
                  Console.WriteLine(@"n");
              }

        }
    }
}