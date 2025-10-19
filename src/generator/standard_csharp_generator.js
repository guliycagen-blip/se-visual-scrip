import { csharpGenerator } from './generator_instance.js';
import * as Blockly from 'blockly/core';

// --- ЛОГИКА ---
csharpGenerator.forBlock['controls_if'] = function(block) {
  let n = 0;
  let code = '';
  let branchCode, conditionCode;
  do {
    conditionCode = csharpGenerator.valueToCode(block, 'IF' + n, csharpGenerator.ORDER_NONE) || 'false';
    branchCode = csharpGenerator.statementToCode(block, 'DO' + n) || '';
    code += (n > 0 ? 'else ' : '') + 'if (' + conditionCode + ') {\n' + branchCode + '}';
    n++;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = csharpGenerator.statementToCode(block, 'ELSE') || '';
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

csharpGenerator.forBlock['logic_compare'] = function(block) {
  const OPERATORS = { 'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>=' };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = (operator === '==' || operator === '!=') ? csharpGenerator.ORDER_EQUALITY : csharpGenerator.ORDER_RELATIONAL;
  const argument0 = csharpGenerator.valueToCode(block, 'A', order) || '0';
  const argument1 = csharpGenerator.valueToCode(block, 'B', order) || '0';
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

csharpGenerator.forBlock['logic_operation'] = function(block) {
  const OPERATORS = { 'AND': '&&', 'OR': '||' };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order = (operator === '&&') ? csharpGenerator.ORDER_LOGICAL_AND : csharpGenerator.ORDER_LOGICAL_OR;
  let argument0 = csharpGenerator.valueToCode(block, 'A', order) || 'false';
  let argument1 = csharpGenerator.valueToCode(block, 'B', order) || 'false';
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

csharpGenerator.forBlock['logic_negate'] = function(block) {
  const order = csharpGenerator.ORDER_UNARY_PREFIX;
  const argument0 = csharpGenerator.valueToCode(block, 'BOOL', order) || 'true';
  const code = '!' + argument0;
  return [code, order];
};

csharpGenerator.forBlock['logic_boolean'] = function(block) {
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
  return [code, csharpGenerator.ORDER_ATOMIC];
};

csharpGenerator.forBlock['logic_null'] = function(block) {
  return ['null', csharpGenerator.ORDER_ATOMIC];
};

// --- ЦИКЛЫ ---
csharpGenerator.forBlock['controls_repeat_ext'] = function(block) {
  const repeats = csharpGenerator.valueToCode(block, 'TIMES', csharpGenerator.ORDER_ASSIGNMENT) || '0';
  let branch = csharpGenerator.statementToCode(block, 'DO') || '';
  let loopVar = csharpGenerator.variableDB_.getDistinctName('count', 'VARIABLE');
  let code = `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n${branch}}\n`;
  return code;
};

csharpGenerator.forBlock['controls_for'] = function(block) {
  // ИСПРАВЛЕНО: Приведено к новому стандарту получения имени переменной
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  const variable0 = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
  const from = csharpGenerator.valueToCode(block, 'FROM', csharpGenerator.ORDER_ASSIGNMENT) || '0';
  const to = csharpGenerator.valueToCode(block, 'TO', csharpGenerator.ORDER_ASSIGNMENT) || '0';
  const increment = csharpGenerator.valueToCode(block, 'BY', csharpGenerator.ORDER_ASSIGNMENT) || '1';
  let branch = csharpGenerator.statementToCode(block, 'DO') || '';
  return `for (int ${variable0} = ${from}; ${variable0} <= ${to}; ${variable0} += ${increment}) {\n${branch}}\n`;
};

csharpGenerator.forBlock['controls_forEach'] = function(block) {
  // ИСПРАВЛЕНО: Приведено к новому стандарту получения имени переменной
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  const variable0 = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
  const list = csharpGenerator.valueToCode(block, 'LIST', csharpGenerator.ORDER_ASSIGNMENT) || 'new List<object>()';
  let branch = csharpGenerator.statementToCode(block, 'DO') || '';
  return `foreach (var ${variable0} in ${list}) {\n${branch}}\n`;
};

csharpGenerator.forBlock['controls_whileUntil'] = function(block) {
  const until = block.getFieldValue('MODE') === 'UNTIL';
  let argument0 = csharpGenerator.valueToCode(block, 'BOOL', until ? csharpGenerator.ORDER_UNARY_PREFIX : csharpGenerator.ORDER_NONE) || 'false';
  let branch = csharpGenerator.statementToCode(block, 'DO') || '';
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

csharpGenerator.forBlock['controls_flow_statements'] = function(block) {
  return block.getFieldValue('FLOW').toLowerCase() + ';\n';
};

// --- МАТЕМАТИКА ---
csharpGenerator.forBlock['math_number'] = function(block) {
  const code = String(block.getFieldValue('NUM'));
  return [code, code < 0 ? csharpGenerator.ORDER_UNARY_PREFIX : csharpGenerator.ORDER_ATOMIC];
};

csharpGenerator.forBlock['math_arithmetic'] = function(block) {
  const OPERATORS = {
    'ADD': [' + ', csharpGenerator.ORDER_ADDITIVE], 'MINUS': [' - ', csharpGenerator.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', csharpGenerator.ORDER_MULTIPLICATIVE], 'DIVIDE': [' / ', csharpGenerator.ORDER_MULTIPLICATIVE],
    'POWER': [null, csharpGenerator.ORDER_NONE]
  };
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  const arg0 = csharpGenerator.valueToCode(block, 'A', order) || '0';
  const arg1 = csharpGenerator.valueToCode(block, 'B', order) || '0';
  if (!operator) {
    const code = `Math.Pow(${arg0}, ${arg1})`;
    return [code, csharpGenerator.ORDER_MEMBER];
  }
  return [`${arg0}${operator}${arg1}`, order];
};

csharpGenerator.forBlock['math_single'] = function(block) {
  const op = block.getFieldValue('OP');
  const arg = csharpGenerator.valueToCode(block, 'NUM', csharpGenerator.ORDER_UNARY_PREFIX) || '0';
  let code;
  let order;
  switch(op) {
      case 'ROOT': code = `Math.Sqrt(${arg})`; order = csharpGenerator.ORDER_MEMBER; break;
      case 'ABS': code = `Math.Abs(${arg})`; order = csharpGenerator.ORDER_MEMBER; break;
      case 'NEG': code = `-${arg}`; order = csharpGenerator.ORDER_UNARY_PREFIX; break;
      case 'LN': code = `Math.Log(${arg})`; order = csharpGenerator.ORDER_MEMBER; break;
      case 'LOG10': code = `Math.Log10(${arg})`; order = csharpGenerator.ORDER_MEMBER; break;
      case 'EXP': code = `Math.Exp(${arg})`; order = csharpGenerator.ORDER_MEMBER; break;
      case 'POW10': code = `Math.Pow(10, ${arg})`; order = csharpGenerator.ORDER_MEMBER; break;
      default: throw new Error('Unknown math single operator: ' + op);
  }
  return [code, order];
};

csharpGenerator.forBlock['math_trig'] = function(block) {
  const op = block.getFieldValue('OP');
  const arg = csharpGenerator.valueToCode(block, 'NUM', csharpGenerator.ORDER_NONE) || '0';
  const argInRad = `${arg} * (Math.PI / 180.0)`;
  let code;
  switch(op) {
      case 'SIN': code = `Math.Sin(${argInRad})`; break;
      case 'COS': code = `Math.Cos(${argInRad})`; break;
      case 'TAN': code = `Math.Tan(${argInRad})`; break;
      case 'ASIN': code = `Math.Asin(${arg}) / (Math.PI / 180.0)`; break;
      case 'ACOS': code = `Math.Acos(${arg}) / (Math.PI / 180.0)`; break;
      case 'ATAN': code = `Math.Atan(${arg}) / (Math.PI / 180.0)`; break;
      default: throw new Error('Unknown math trig operator: ' + op);
  }
  return [code, csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['math_constant'] = function(block) {
  const CONSTANTS = { 'PI': 'Math.PI', 'E': 'Math.E', 'GOLDEN_RATIO': '(1.0 + Math.Sqrt(5.0)) / 2.0', 'SQRT2': 'Math.Sqrt(2.0)', 'SQRT1_2': 'Math.Sqrt(0.5)', 'INFINITY': 'double.PositiveInfinity' };
  return [CONSTANTS[block.getFieldValue('CONSTANT')], csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['math_round'] = function(block) {
  const op = block.getFieldValue('OP');
  const arg = csharpGenerator.valueToCode(block, 'NUM', csharpGenerator.ORDER_NONE) || '0';
  const funcs = { 'ROUND': 'Math.Round', 'ROUNDUP': 'Math.Ceiling', 'ROUNDDOWN': 'Math.Floor' };
  const code = `${funcs[op]}(${arg})`;
  return [code, csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['math_modulo'] = function(block) {
  const arg0 = csharpGenerator.valueToCode(block, 'DIVIDEND', csharpGenerator.ORDER_MULTIPLICATIVE) || '0';
  const arg1 = csharpGenerator.valueToCode(block, 'DIVISOR', csharpGenerator.ORDER_MULTIPLICATIVE) || '0';
  const code = `${arg0} % ${arg1}`;
  return [code, csharpGenerator.ORDER_MULTIPLICATIVE];
};

csharpGenerator.forBlock['math_change'] = function(block) {
  // ИСПРАВЛЕНО: Приведено к новому стандарту получения имени переменной
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  const varName = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
  const delta = csharpGenerator.valueToCode(block, 'DELTA', csharpGenerator.ORDER_ADDITIVE) || '0';
  return `${varName} += ${delta};\n`;
};

// --- ПЕРЕМЕННЫЕ ---
csharpGenerator.forBlock['variables_get'] = function(block) {
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  const varName = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
  return [varName, csharpGenerator.ORDER_ATOMIC];
};

csharpGenerator.forBlock['variables_set'] = function(block) {
  const argument0 = csharpGenerator.valueToCode(block, 'VALUE', csharpGenerator.ORDER_ASSIGNMENT) || '0';
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  const varName = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
  
  // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Эта часть кода отсутствовала в вашей версии
  let varType = 'object'; 
  const valueBlock = block.getInputTargetBlock('VALUE');
  if (valueBlock) {
      switch (valueBlock.type) {
          case 'math_number': varType = 'double'; break;
          case 'text': varType = 'string'; break;
          case 'logic_boolean': varType = 'bool'; break;
          case 'lists_create_with': varType = 'List<object>'; break;
          default: varType = 'var'; break;
      }
  }
  csharpGenerator.definitions_['variables_' + varName] = `${varType} ${varName};`;
  return `${varName} = ${argument0};\n`;
};

// --- ТЕКСТ ---
csharpGenerator.forBlock['text'] = function(block) {
  const textValue = csharpGenerator.quote_(block.getFieldValue('TEXT'));
  return [textValue, csharpGenerator.ORDER_ATOMIC];
};

csharpGenerator.forBlock['text_join'] = function(block) {
  if (block.itemCount_ === 0) return ['""', csharpGenerator.ORDER_ATOMIC];
  const elements = Array.from({length: block.itemCount_}, (_, i) => csharpGenerator.valueToCode(block, 'ADD' + i, csharpGenerator.ORDER_NONE) || '""');
  return [`string.Concat(${elements.join(', ')})`, csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['text_append'] = function(block) {
  // ИСПРАВЛЕНО: Приведено к новому стандарту получения имени переменной
  const variable = block.workspace.getVariableById(block.getFieldValue('VAR'));
  const varName = csharpGenerator.variableDB_.getName(variable.name, 'VARIABLE');
  const text = csharpGenerator.valueToCode(block, 'TEXT', csharpGenerator.ORDER_ASSIGNMENT) || '""';
  return `${varName} += ${text};\n`;
};

csharpGenerator.forBlock['text_length'] = function(block) {
  const text = csharpGenerator.valueToCode(block, 'VALUE', csharpGenerator.ORDER_MEMBER) || '""';
  return [`${text}.Length`, csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['text_isEmpty'] = function(block) {
  const text = csharpGenerator.valueToCode(block, 'VALUE', csharpGenerator.ORDER_NONE) || '""';
  return [`string.IsNullOrEmpty(${text})`, csharpGenerator.ORDER_MEMBER];
};

// --- СПИСКИ (предполагаем List<object> для универсальности) ---
csharpGenerator.forBlock['lists_create_with'] = function(block) {
  const elements = Array.from(
    {length: block.itemCount_},
    (_, i) => csharpGenerator.valueToCode(block, 'ADD' + i, csharpGenerator.ORDER_NONE) || 'null'
  );
  const code = `new List<object> { ${elements.join(', ')} }`;
  return [code, csharpGenerator.ORDER_ATOMIC];
};

csharpGenerator.forBlock['lists_repeat'] = function(block) {
  const item = csharpGenerator.valueToCode(block, 'ITEM', csharpGenerator.ORDER_NONE) || 'null';
  const count = csharpGenerator.valueToCode(block, 'NUM', csharpGenerator.ORDER_NONE) || '0';
  const code = `new List<object>(Enumerable.Repeat(${item}, (int)${count}))`;
  return [code, csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['lists_length'] = function(block) {
  const list = csharpGenerator.valueToCode(block, 'VALUE', csharpGenerator.ORDER_MEMBER) || 'new List<object>()';
  return [`${list}.Count`, csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['lists_isEmpty'] = function(block) {
  const list = csharpGenerator.valueToCode(block, 'VALUE', csharpGenerator.ORDER_MEMBER) || 'new List<object>()';
  return [`(${list}.Count == 0)`, csharpGenerator.ORDER_EQUALITY];
};

csharpGenerator.forBlock['lists_getIndex'] = function(block) {
    // Note: C# uses 0-based indexing.
    const list = csharpGenerator.valueToCode(block, 'VALUE', csharpGenerator.ORDER_MEMBER) || 'new List<object>()';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const at = csharpGenerator.valueToCode(block, 'AT', csharpGenerator.ORDER_NONE) || '1';
    const mode = block.getFieldValue('MODE') || 'GET';

    let atCode;
    if (where === 'FIRST') atCode = '0';
    else if (where === 'LAST') atCode = `${list}.Count - 1`;
    else if (where === 'FROM_START') atCode = `(int)${at} - 1`;
    else if (where === 'FROM_END') atCode = `${list}.Count - (int)${at}`;
    else if (where === 'RANDOM') {
        // Requires a helper function.
        const func = csharpGenerator.provideFunction_('GetRandomItem', [
            `object ${csharpGenerator.FUNCTION_NAME_PLACEHOLDER_}(List<object> list) {`,
            '  if (list.Count == 0) return null;',
            '  int index = new Random().Next(list.Count);',
            '  return list[index];',
            '}',
        ]);
        return [`${func}(${list})`, csharpGenerator.ORDER_MEMBER];
    } else {
        atCode = `(int)${at} - 1`; // Default fallback
    }

    if (mode === 'GET') {
        return [`${list}[${atCode}]`, csharpGenerator.ORDER_MEMBER];
    } else if (mode === 'GET_REMOVE') {
        // Requires a helper function to get and remove atomically.
        const func = csharpGenerator.provideFunction_('GetAndRemoveItem', [
            `object ${csharpGenerator.FUNCTION_NAME_PLACEHOLDER_}(List<object> list, int index) {`,
            '  object item = list[index];',
            '  list.RemoveAt(index);',
            '  return item;',
            '}',
        ]);
        return [`${func}(${list}, ${atCode})`, csharpGenerator.ORDER_MEMBER];
    } else if (mode === 'REMOVE') {
        return `${list}.RemoveAt(${atCode});\n`;
    }
    return '';
};

csharpGenerator.forBlock['lists_setIndex'] = function(block) {
    const list = csharpGenerator.valueToCode(block, 'LIST', csharpGenerator.ORDER_MEMBER) || 'new List<object>()';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const at = csharpGenerator.valueToCode(block, 'AT', csharpGenerator.ORDER_NONE) || '1';
    const value = csharpGenerator.valueToCode(block, 'TO', csharpGenerator.ORDER_ASSIGNMENT) || 'null';
    const mode = block.getFieldValue('MODE') || 'SET';

    let atCode;
    if (where === 'FIRST') atCode = '0';
    else if (where === 'LAST') atCode = `${list}.Count - 1`;
    else if (where === 'FROM_START') atCode = `(int)${at} - 1`;
    else if (where === 'FROM_END') atCode = `${list}.Count - (int)${at}`;
    else { // RANDOM needs special handling for set/insert
        atCode = `new Random().Next(${list}.Count)`;
    }

    if (mode === 'SET') {
        if (where === 'LAST') { // Special case for setting last, as index might be -1 for empty list
             return `${list}[${list}.Count > 0 ? ${list}.Count - 1 : 0] = ${value};\n`;
        }
        return `${list}[${atCode}] = ${value};\n`;
    } else { // INSERT
        if (where === 'LAST') return `${list}.Add(${value});\n`;
        return `${list}.Insert(${atCode}, ${value});\n`;
    }
};

// --- ПРОЦЕДУРЫ (ФУНКЦИИ) ---
csharpGenerator.forBlock['procedures_defnoreturn'] = function(block) {
  const funcName = csharpGenerator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
  let branch = csharpGenerator.statementToCode(block, 'STACK') || '';
  const args = block.getVars().map(v => `object ${csharpGenerator.variableDB_.getName(v.name, 'VARIABLE')}`);
  let code = `void ${funcName}(${args.join(', ')}) {\n${branch}}`;
  csharpGenerator.definitions_[funcName] = code;
  return null;
};

csharpGenerator.forBlock['procedures_defreturn'] = function(block) {
  const funcName = csharpGenerator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
  let branch = csharpGenerator.statementToCode(block, 'STACK') || '';
  let returnValue = csharpGenerator.valueToCode(block, 'RETURN', csharpGenerator.ORDER_NONE) || 'null';
  if (returnValue) {
    branch += `  return ${returnValue};\n`;
  }
  const args = block.getVars().map(v => `object ${csharpGenerator.variableDB_.getName(v.name, 'VARIABLE')}`);
  let code = `object ${funcName}(${args.join(', ')}) {\n${branch}}`;
  csharpGenerator.definitions_[funcName] = code;
  return null;
};

csharpGenerator.forBlock['procedures_callnoreturn'] = function(block) {
  const funcName = csharpGenerator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
  const args = [];
  const argNames = block.getVars();
  for (let i = 0; i < argNames.length; i++) {
      args[i] = csharpGenerator.valueToCode(block, 'ARG' + i, csharpGenerator.ORDER_NONE) || 'null';
  }
  return `${funcName}(${args.join(', ')});\n`;
};

csharpGenerator.forBlock['procedures_callreturn'] = function(block) {
  const funcName = csharpGenerator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
  const args = [];
  const argNames = block.getVars();
  for (let i = 0; i < argNames.length; i++) {
      args[i] = csharpGenerator.valueToCode(block, 'ARG' + i, csharpGenerator.ORDER_NONE) || 'null';
  }
  const code = `${funcName}(${args.join(', ')})`;
  return [code, csharpGenerator.ORDER_MEMBER];
};

csharpGenerator.forBlock['procedures_ifreturn'] = function(block) {
  const condition = csharpGenerator.valueToCode(block, 'CONDITION', csharpGenerator.ORDER_NONE) || 'false';
  let code = `if (${condition}) {\n`;
  if (block.hasReturnValue_) {
    const value = csharpGenerator.valueToCode(block, 'VALUE', csharpGenerator.ORDER_NONE) || 'null';
    code += `  return ${value};\n`;
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};