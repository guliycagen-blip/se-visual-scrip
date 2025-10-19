// src/generator/generator_instance.js // ПОЛНАЯ, ИСПРАВЛЕННАЯ ВЕРСИЯ

import * as Blockly from 'blockly/core';

export const csharpGenerator = new Blockly.Generator('C#');

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ, КОТОРЫХ НЕ ХВАТАЛО ---

/**
 * Initializes the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
csharpGenerator.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  csharpGenerator.definitions_ = Object.create(null);
  // Create a dictionary of variable names.
  if (!csharpGenerator.variableDB_) {
    csharpGenerator.variableDB_ =
        new Blockly.Names(csharpGenerator.RESERVED_WORDS_);
  } else {
    csharpGenerator.variableDB_.reset();
  }
  csharpGenerator.variableDB_.setVariableMap(workspace.getVariableMap());
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
csharpGenerator.finish = function(code) {
  // Convert the definitions dictionary into a list.
  const definitions = Object.values(csharpGenerator.definitions_);
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are generated as literals.
 * This is unlikely to be wanted, so warn.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
csharpGenerator.scrub_ = function(block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = '';
    if (nextBlock) {
        nextCode = thisOnly ? '' : csharpGenerator.blockToCode(nextBlock);
    }
    return code + nextCode;
};

/**
 * Enclose the provided string in C#-style quotes.
 * @param {string} string The string to enclose in quotes.
 * @return {string} The quoted string.
 * @protected
 */
csharpGenerator.quote_ = function(string) {
  // TODO: This is a quick hack. It may need to be more robust.
  // C# strings use @ to indicate verbatim strings, which simplifies escaping.
  string = string.replace(/"/g, '""');
  return '@"' + string + '"';
};

// --- КОНСТАНТЫ ПРИОРИТЕТА ОПЕРАЦИЙ (ORDER), КОТОРЫЕ УЖЕ БЫЛИ ---

csharpGenerator.ORDER_ATOMIC = 0;
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