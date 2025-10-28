// src/generator/csharp/console_generator.js

// Импортируем экземпляр ТОЛЬКО для доступа к константам ORDER_*
import { csharpGenerator } from '../generator_instance.js';

export const consoleGenerators = {
  
  program_main: function(block) {
    const bodyCode = this.statementToCode(block, 'BODY');
    const variables = block.workspace.getVariablesOfType('');
    let variablesDeclaration = '';

      if (variables.length > 0) {
        // --- ВОЗВРАЩАЕМ ИЗМЕНЕНИЕ ОБРАТНО ---
        // Используем 'object', так как 'var a;' - это невалидный синтаксис C#.
        const varNames = variables.map(v => this.variableDB_.getName(v.name, 'VARIABLE'));
        variablesDeclaration = `            object ${varNames.join(', ')};\n`;
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
    }
    
    return `using System;
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
${variablesDeclaration}${this.prefixLines(bodyCode, '            ')}
        }
    }
}
`.trim();
  },

  console_writeline: function (block) {
    // Используем правильное имя "VALUE" и константу порядка операций из 'this'
    const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '""';
    return `Console.WriteLine(${value});\n`;
  },

  console_readline: function (block) {
     return ['Console.ReadLine().Trim()', this.ORDER_FUNCTION_CALL];
  }
};