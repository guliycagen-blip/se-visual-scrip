// src/generator/csharp/console_generator.js

// ИМПОРТИРУЕМ ПРАВИЛЬНУЮ ПЕРЕМЕННУЮ И ДАЕМ ЕЙ ПСЕВДОНИМ 'generator'
import { csharpGenerator as generator } from '../csharp_generator.js';
import * as Blockly from 'blockly/core';

// Генератор для главного блока программы
generator.forBlock['program_main'] = function(block) {
  const bodyCode = generator.statementToCode(block, 'BODY');
  const variables = block.workspace.getVariablesOfType('');
  let variablesDeclaration = '';

  if (variables.length > 0) {
      const varNames = variables.map(v => generator.getVariableName(v.getId()));
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