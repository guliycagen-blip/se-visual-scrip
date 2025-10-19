// src/generator/generator_instance.js // ОБНОВЛЕННАЯ ВЕРСИЯ

import * as Blockly from 'blockly/core';

export const csharpGenerator = new Blockly.Generator('C#');

csharpGenerator.init = function(workspace) {
  // 1. Создаем пустые словари для определений и имен переменных (стандартный код)
  csharpGenerator.definitions_ = Object.create(null);
  if (!csharpGenerator.variableDB_) {
    csharpGenerator.variableDB_ =
        new Blockly.Names(csharpGenerator.RESERVED_WORDS_);
  } else {
    csharpGenerator.variableDB_.reset();
  }
  csharpGenerator.variableDB_.setVariableMap(workspace.getVariableMap());

  // --- НАЧАЛО НАШЕГО НОВОГО КОДА ---
  // 2. Пробегаемся по ВСЕМ переменным, которые есть в рабочей области
  const variables = workspace.getVariableMap().getAllVariables();
  if (variables.length) {
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      const varName = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
      
      // 3. Добавляем для каждой переменной объявление по умолчанию.
      // Тип 'object' - это безопасный базовый тип.
      // Логика в 'variables_set' позже заменит это на более конкретный тип (double, string и т.д.)
      csharpGenerator.definitions_['variables_' + varName] = `object ${varName};`;
    }
  }
  // --- КОНЕЦ НАШЕГО НОВОГО КОДА ---
};

csharpGenerator.finish = function(code) {
  const definitions = Object.values(csharpGenerator.definitions_);
  // Убираем дубликаты, если они вдруг появятся
  const uniqueDefinitions = [...new Set(definitions)];
  return uniqueDefinitions.join('\n') + '\n\n' + code;
};

csharpGenerator.scrub_ = function(block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = '';
    if (nextBlock) {
        nextCode = thisOnly ? '' : csharpGenerator.blockToCode(nextBlock);
    }
    return code + nextCode;
};

csharpGenerator.quote_ = function(string) {
  string = string.replace(/"/g, '""');
  return '@"' + string + '"';
};

// ... КОНСТАНТЫ ПРИОРИТЕТА ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ ...
csharpGenerator.ORDER_ATOMIC = 0;
// ... и так далее ...
csharpGenerator.ORDER_MEMBER = 2;
csharpGenerator.ORDER_UNARY_POSTFIX = 3;
csharpGenerator.ORDER_UNARY_PREFIX = 4;
csharpGenerator.ORDER_MULTIPLICATIVE = 5.1;
csharpGenerator.ORDER_ADDITIVE = 5.2;
csharpGenerator.ORDER_SHIFT = 6;
csharpGenerator.ORDER_RELATIONAL = 7;
csharpGenerator.ORDER_EQUALITY = 8;
csharpGenerator.ORDER_LOGICAL_AND = 12;
csharpGenerator.ORDER_LOGICAL_OR = 13;
csharpGenerator.ORDER_CONDITIONAL = 14;
csharpGenerator.ORDER_ASSIGNMENT = 15;
csharpGenerator.ORDER_NONE = 99;