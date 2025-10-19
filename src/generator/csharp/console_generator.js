// src/generator/csharp/console_generator.js

// ИМПОРТИРУЕМ главный генератор, который был создан в файле выше
import { csharpGenerator } from '../csharp_generator.js';

// Генератор для главного блока программы
csharpGenerator.forBlock['program_main'] = function(block) {
  const bodyCode = csharpGenerator.statementToCode(block, 'BODY');
  const variables = block.workspace.getVariablesOfType('');
  let variablesDeclaration = '';

  if (variables.length > 0) {
      const varNames = variables.map(v => csharpGenerator.getVariableName(v.getId()));
      // Добавим отступ для красоты кода
      variablesDeclaration = `            object ${varNames.join(', ')};\n`;
  }
  
  const programCode = `using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MyBlocklyApp
{
    class Program
    {
        static void Main(string[] args)
        {
${variablesDeclaration}${bodyCode}
        }
    }
}
`;
  return programCode.trim();
};