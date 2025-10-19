// В файле: src/generator/standard_csharp_generator.js

csharpGenerator['variables_get'] = function(block) {
  // Получаем модель переменной по ее ID
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  // Генерируем безопасное имя, используя настоящее имя переменной
  const varName = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
  return [varName, csharpGenerator.ORDER_ATOMIC];
};

csharpGenerator['variables_set'] = function(block) {
  const argument0 = csharpGenerator.valueToCode(block, 'VALUE',
      csharpGenerator.ORDER_ASSIGNMENT) || '0';
  // Точно так же получаем модель и генерируем безопасное имя
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  const varName = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');

  // Ваш код для определения и обновления типа переменной
  let varType = 'object'; 
  const valueBlock = block.getInputTargetBlock('VALUE');
  if (valueBlock) {
      switch (valueBlock.type) {
          case 'math_number':
              varType = 'double';
              break;
          case 'text':
              varType = 'string';
              break;
          // Добавьте другие типы по необходимости
          default:
              varType = 'var'; // или 'object'
              break;
      }
  }
  // Обновляем объявление переменной с новым типом
  csharpGenerator.definitions_['variables_' + varName] = `${varType} ${varName};`;
  
  return `${varName} = ${argument0};\n`;
};