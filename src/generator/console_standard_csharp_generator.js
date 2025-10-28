// src/generator/console_standard_csharp_generator.js

// --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
// Импортируем 'чистый' экземпляр, чтобы получить доступ к константам ORDER_*, не нарушая изоляцию.
import { csharpGenerator } from './generator_instance.js';

export const consoleStandardGenerators = {
  // --- ЛОГИКА ---
  controls_if: function(block) {
    let n = 0;
    let code = '';
    let branchCode, conditionCode;
    do {
      conditionCode = this.valueToCode(block, 'IF' + n, csharpGenerator.ORDER_NONE) || 'false';
      branchCode = this.statementToCode(block, 'DO' + n) || '';
      code += (n > 0 ? ' else ' : '') + 'if (' + conditionCode + ') {\n' + this.prefixLines(branchCode, this.INDENT) + '}';
      n++;
    } while (block.getInput('IF' + n));
    if (block.getInput('ELSE')) {
      branchCode = this.statementToCode(block, 'ELSE') || '';
      code += ' else {\n' + this.prefixLines(branchCode, this.INDENT) + '}';
    }
    return code + '\n';
  },
  logic_compare: function(block) {
    const OPERATORS = { 'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>=' };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = (operator === '==' || operator === '!=') ? csharpGenerator.ORDER_EQUALITY : csharpGenerator.ORDER_RELATIONAL;
    const argument0 = this.valueToCode(block, 'A', order) || '0';
    const argument1 = this.valueToCode(block, 'B', order) || '0';
    let code;
    if (operator === '==') {
      code = `(${argument0} ?? "").Equals(${argument1})`;
    } else if (operator === '!=') {
      code = `!(${argument0} ?? "").Equals(${argument1})`;
    } else {
      // Для числовых сравнений (<, >, <=, >=) оставляем как было.
      code = `${argument0} ${operator} ${argument1}`;
    }
    // --- КОНЕЦ ИЗМЕНЕНИЯ ---

    return [code, order];
  },
  logic_operation: function(block) {
    const OPERATORS = { 'AND': '&&', 'OR': '||' };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = (operator === '&&') ? csharpGenerator.ORDER_LOGICAL_AND : csharpGenerator.ORDER_LOGICAL_OR;
    const argument0 = this.valueToCode(block, 'A', order) || 'false';
    const argument1 = this.valueToCode(block, 'B', order) || 'false';
    return [`${argument0} ${operator} ${argument1}`, order];
  },
  logic_negate: function(block) {
    const order = csharpGenerator.ORDER_UNARY_PREFIX;
    const argument0 = this.valueToCode(block, 'BOOL', order) || 'true';
    return ['!' + argument0, order];
  },
  logic_boolean: function(block) {
    return [(block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false', csharpGenerator.ORDER_ATOMIC];
  },
  logic_null: function(block) {
    return ['null', csharpGenerator.ORDER_ATOMIC];
  },

  // --- ЦИКЛЫ ---
  controls_repeat_ext: function(block) {
    const repeats = this.valueToCode(block, 'TIMES', csharpGenerator.ORDER_ASSIGNMENT) || '0';
    let branch = this.statementToCode(block, 'DO');
    branch = this.addLoopTrap(branch, block.id);
    const loopVar = this.variableDB_.getDistinctName('count', 'VARIABLE');
    return `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n${branch}}\n`;
  },
  controls_whileUntil: function(block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = this.valueToCode(block, 'BOOL', until ? csharpGenerator.ORDER_LOGICAL_NOT : csharpGenerator.ORDER_NONE) || 'false';
    let branch = this.statementToCode(block, 'DO');
    branch = this.addLoopTrap(branch, block.id);
    if (until) argument0 = '!' + argument0;
    return `while (${argument0}) {\n${branch}}\n`;
  },
  controls_for: function(block) {
    const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
    const variable0 = this.variableDB_.getName(variable.name, 'VARIABLE');
    const argument0 = this.valueToCode(block, 'FROM', csharpGenerator.ORDER_ASSIGNMENT) || '0';
    const argument1 = this.valueToCode(block, 'TO', csharpGenerator.ORDER_ASSIGNMENT) || '0';
    const increment = this.valueToCode(block, 'BY', csharpGenerator.ORDER_ASSIGNMENT) || '1';
    let branch = this.statementToCode(block, 'DO');
    branch = this.addLoopTrap(branch, block.id);
    return `for (var ${variable0} = ${argument0}; ${variable0} <= ${argument1}; ${variable0} += ${increment}) {\n${branch}}\n`;
  },
  controls_forEach: function(block) {
    const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
    const variable0 = this.variableDB_.getName(variable.name, 'VARIABLE');
    const argument0 = this.valueToCode(block, 'LIST', csharpGenerator.ORDER_ASSIGNMENT) || 'new List<object>()';
    let branch = this.statementToCode(block, 'DO');
    branch = this.addLoopTrap(branch, block.id);
    return `foreach (var ${variable0} in ${argument0}) {\n${branch}}\n`;
  },
  controls_flow_statements: function(block) {
    switch (block.getFieldValue('FLOW')) {
      case 'BREAK': return 'break;\n';
      case 'CONTINUE': return 'continue;\n';
    }
    throw new Error('Unknown flow statement.');
  },

  // --- МАТЕМАТИКА ---
  math_number: function(block) {
    const code = Number(block.getFieldValue('NUM'));
    return [code, csharpGenerator.ORDER_ATOMIC];
  },
  math_arithmetic: function(block) {
    const OPERATORS = { 'ADD': [' + ', csharpGenerator.ORDER_ADDITIVE], 'MINUS': [' - ', csharpGenerator.ORDER_ADDITIVE], 'MULTIPLY': [' * ', csharpGenerator.ORDER_MULTIPLICATIVE], 'DIVIDE': [' / ', csharpGenerator.ORDER_MULTIPLICATIVE], 'POWER': [null, csharpGenerator.ORDER_NONE] };
    const tuple = OPERATORS[block.getFieldValue('OP')];
    const operator = tuple[0], order = tuple[1];
    const argument0 = this.valueToCode(block, 'A', order) || '0';
    const argument1 = this.valueToCode(block, 'B', order) || '0';
    if (!operator) {
        return [`Math.Pow(${argument0}, ${argument1})`, csharpGenerator.ORDER_FUNCTION_CALL];
    }
    return [`${argument0}${operator}${argument1}`, order];
  },
  math_single: function(block) {
    // Временно, чтобы избежать ошибок, пока не реализовано полностью
    const op = block.getFieldValue('OP');
    const arg = this.valueToCode(block, 'NUM', csharpGenerator.ORDER_UNARY_PREFIX) || '0';
    if (op === 'NEG') return [`-${arg}`, csharpGenerator.ORDER_UNARY_PREFIX];
    return ['0', csharpGenerator.ORDER_ATOMIC];
  },

  // --- ТЕКСТ ---
  text: function(block) {
    return [this.quote_(block.getFieldValue('TEXT')), csharpGenerator.ORDER_ATOMIC];
  },
  text_join: function(block) {
    if (block.itemCount_ === 0) return ['""', csharpGenerator.ORDER_ATOMIC];
    const elements = Array.from({length: block.itemCount_}, (_, i) => {
        const value = this.valueToCode(block, 'ADD' + i, csharpGenerator.ORDER_NONE) || '""';
        return `(${value} ?? "").ToString()`;
    });
    return [`string.Concat(${elements.join(', ')})`, csharpGenerator.ORDER_MEMBER];
  },
  text_append: function(block) {
    const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
    const varName = this.variableDB_.getName(variable.name, 'VARIABLE');
    const value = this.valueToCode(block, 'TEXT', csharpGenerator.ORDER_ASSIGNMENT) || '""';
    return `${varName} += (${value}).ToString();\n`;
  },
  text_length: function(block) {
      const text = this.valueToCode(block, 'VALUE', csharpGenerator.ORDER_MEMBER) || '""';
      return [`(${text}).Length`, csharpGenerator.ORDER_MEMBER];
  },
  text_isEmpty: function(block) {
      const text = this.valueToCode(block, 'VALUE', csharpGenerator.ORDER_MEMBER) || '""';
      return [`string.IsNullOrEmpty(${text})`, csharpGenerator.ORDER_FUNCTION_CALL];
  },

  // --- СПИСКИ ---
  lists_create_with: function(block) {
      const elements = new Array(block.itemCount_);
      for (let i = 0; i < block.itemCount_; i++) {
          elements[i] = this.valueToCode(block, 'ADD' + i, csharpGenerator.ORDER_NONE) || 'null';
      }
      const code = `new List<object> { ${elements.join(', ')} }`;
      return [code, csharpGenerator.ORDER_ATOMIC];
  },

  // --- ПЕРЕМЕННЫЕ ---
  variables_get: function(block) {
    const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
    const varName = this.variableDB_.getName(variable.name, 'VARIABLE');
    return [varName, csharpGenerator.ORDER_ATOMIC];
  },
  variables_set: function(block) {
    const argument0 = this.valueToCode(block, 'VALUE', csharpGenerator.ORDER_ASSIGNMENT) || 'null';
    const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
    const varName = this.variableDB_.getName(variable.name, 'VARIABLE');
    return `${varName} = ${argument0};\n`;
  },
  
  // --- ФУНКЦИИ (PROCEDURES) ---
  procedures_defnoreturn: function(block) {
      return null;
  },
  procedures_defreturn: function(block) {
      return null;
  },
  procedures_ifreturn: function(block) {
    const condition = this.valueToCode(block, 'CONDITION', csharpGenerator.ORDER_NONE) || 'false';
    let code = `if (${condition}) {\n`;
    if (block.hasReturnValue_) {
      const value = this.valueToCode(block, 'VALUE', csharpGenerator.ORDER_NONE) || 'null';
      code += `  return ${value};\n`;
    } else {
      code += '  return;\n';
    }
    code += '}\n';
    return code;
  }
};