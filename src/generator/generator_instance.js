// src/generator/generator_instance.js  // <-- ИСПРАВЛЕННАЯ ВЕРСИЯ
import * as Blockly from 'blockly/core';

export const csharpGenerator = new Blockly.Generator('C#');

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

// --- Дальше идут константы приоритета, которые у вас уже есть ---

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