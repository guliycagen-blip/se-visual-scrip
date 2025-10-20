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

// Генератор для блока вывода в консоль
csharpGenerator.forBlock['console_writeline'] = function(block) {
  // Получаем значение из подключенного блока. Если ничего не подключено, используем пустую строку.
  const value_text_to_write = csharpGenerator.valueToCode(block, 'TEXT_TO_WRITE', csharpGenerator.ORDER_ATOMIC) || '""';
  // Вставляем отступ для красоты
  const code = `            Console.WriteLine(${value_text_to_write});\n`;
  return code;
};

// Генератор для блока чтения из консоли
csharpGenerator.forBlock['console_readline'] = function(block) {
  const code = 'Console.ReadLine()';
  // Этот блок возвращает значение, поэтому результат - массив [код, приоритет операции]
  return [code, csharpGenerator.ORDER_FUNCTION_CALL];
};