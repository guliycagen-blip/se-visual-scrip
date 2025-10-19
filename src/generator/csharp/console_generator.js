// src/generator/csharp/console_generator.js

// ИМПОРТИРУЕМ генератор из ЕДИНОГО источника
import { csharpGenerator } from '../generator_instance.js';

// Генератор для главного блока программы
csharpGenerator.forBlock['program_main'] = function(block) {
  // ... остальной код этого файла остается без изменений ...
  const bodyCode = csharpGenerator.statementToCode(block, 'BODY');
  const variables = block.workspace.getVariablesOfType('');
  let variablesDeclaration = '';

  if (variables.length > 0) {
      const varNames = variables.map(v => csharpGenerator.getVariableName(v.getId()));
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