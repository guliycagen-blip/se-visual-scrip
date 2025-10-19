// src/generator/standard_csharp_generator.js

/**
 * @param {Blockly.Generator} generator The C# generator instance.
 */
export function registerStandardGenerators(generator) {
  
  // --- ЛОГИКА ---
  generator.forBlock['controls_if'] = function(block) {
    let n = 0;
    let code = '';
    let branchCode, conditionCode;
    do {
      conditionCode = generator.valueToCode(block, 'IF' + n, generator.ORDER_NONE) || 'false';
      branchCode = generator.statementToCode(block, 'DO' + n) || '';
      code += (n > 0 ? 'else ' : '') + 'if (' + conditionCode + ') {\n' + generator.prefixLines(branchCode, '  ') + '}';
      n++;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE')) {
      branchCode = generator.statementToCode(block, 'ELSE') || '';
      code += ' else {\n' + generator.prefixLines(branchCode, '  ') + '}';
    }
    return code + '\n';
  };

  generator.forBlock['logic_compare'] = function(block) {
    const OPERATORS = { 'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>=' };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = (operator === '==' || operator === '!=') ? generator.ORDER_EQUALITY : generator.ORDER_RELATIONAL;
    const argument0 = generator.valueToCode(block, 'A', order) || '0';
    const argument1 = generator.valueToCode(block, 'B', order) || '0';
    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
  };

  generator.forBlock['logic_operation'] = function(block) {
    const OPERATORS = { 'AND': '&&', 'OR': '||' };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = (operator === '&&') ? generator.ORDER_LOGICAL_AND : generator.ORDER_LOGICAL_OR;
    let argument0 = generator.valueToCode(block, 'A', order) || 'false';
    let argument1 = generator.valueToCode(block, 'B', order) || 'false';
    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
  };
  
  generator.forBlock['logic_negate'] = function(block) {
    const order = generator.ORDER_LOGICAL_NOT;
    const argument0 = generator.valueToCode(block, 'BOOL', order) || 'true';
    const code = '!' + argument0;
    return [code, order];
  };

  generator.forBlock['logic_boolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
    return [code, generator.ORDER_ATOMIC];
  };
  
  generator.forBlock['logic_null'] = function(block) {
  // Null value.
  return ['null', generator.ORDER_ATOMIC];
};

  // --- ЦИКЛЫ ---
  generator.forBlock['controls_repeat_ext'] = function(block) {
    const repeats = generator.valueToCode(block, 'TIMES', generator.ORDER_ASSIGNMENT) || '0';
    let branch = generator.statementToCode(block, 'DO') || '';
    branch = generator.addLoopTrap(branch, block);
    let loopVar = generator.variableDB_.getDistinctName('count', 'VARIABLE');
    let code = `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n${branch}}\n`;
    return code;
  };

  generator.forBlock['controls_for'] = function(block) {
    const variable0 = generator.variableDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    const from = generator.valueToCode(block, 'FROM', generator.ORDER_ASSIGNMENT) || '0';
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ASSIGNMENT) || '0';
    const increment = generator.valueToCode(block, 'BY', generator.ORDER_ASSIGNMENT) || '1';
    let branch = generator.statementToCode(block, 'DO') || '';
    branch = generator.addLoopTrap(branch, block);
    return `for (int ${variable0} = ${from}; ${variable0} <= ${to}; ${variable0} += ${increment}) {\n${branch}}\n`;
  };

  generator.forBlock['controls_forEach'] = function(block) {
    const variable0 = generator.variableDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    const list = generator.valueToCode(block, 'LIST', generator.ORDER_ASSIGNMENT) || 'new List<object>()';
    let branch = generator.statementToCode(block, 'DO') || '';
    branch = generator.addLoopTrap(branch, block);
    return `foreach (var ${variable0} in ${list}) {\n${branch}}\n`;
  };
  
  generator.forBlock['controls_whileUntil'] = function(block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = generator.valueToCode(block, 'BOOL', until ? generator.ORDER_LOGICAL_NOT : generator.ORDER_NONE) || 'false';
    let branch = generator.statementToCode(block, 'DO') || '';
    branch = generator.addLoopTrap(branch, block);
    if (until) {
      argument0 = '!' + argument0;
    }
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
  };
  
  generator.forBlock['controls_flow_statements'] = function(block) {
    return block.getFieldValue('FLOW').toLowerCase() + ';\n';
  };

  // --- МАТЕМАТИКА ---
  generator.forBlock['math_number'] = function(block) {
    const code = String(block.getFieldValue('NUM'));
    return [code, code < 0 ? generator.ORDER_UNARY_NEGATION : generator.ORDER_ATOMIC];
  };
  
  generator.forBlock['math_arithmetic'] = function(block) {
    const OPERATORS = {
      'ADD': [' + ', generator.ORDER_ADDITION], 'MINUS': [' - ', generator.ORDER_SUBTRACTION],
      'MULTIPLY': [' * ', generator.ORDER_MULTIPLICATION], 'DIVIDE': [' / ', generator.ORDER_DIVISION],
      'POWER': [null, generator.ORDER_COMMA]
    };
    const tuple = OPERATORS[block.getFieldValue('OP')];
    const operator = tuple[0];
    const order = tuple[1];
    const arg0 = generator.valueToCode(block, 'A', order) || '0';
    const arg1 = generator.valueToCode(block, 'B', order) || '0';
    if (!operator) {
      const code = `Math.Pow(${arg0}, ${arg1})`;
      return [code, generator.ORDER_FUNCTION_CALL];
    }
    return [`${arg0}${operator}${arg1}`, order];
  };

  generator.forBlock['math_single'] = function(block) {
    const op = block.getFieldValue('OP');
    const arg = generator.valueToCode(block, 'NUM', generator.ORDER_NONE) || '0';
    let code;
    switch(op) {
        case 'ROOT': code = `Math.Sqrt(${arg})`; break;
        case 'ABS': code = `Math.Abs(${arg})`; break;
        case 'NEG': code = `-${arg}`; break;
        case 'LN': code = `Math.Log(${arg})`; break;
        case 'LOG10': code = `Math.Log10(${arg})`; break;
        case 'EXP': code = `Math.Exp(${arg})`; break;
        case 'POW10': code = `Math.Pow(10, ${arg})`; break;
        default: throw new Error('Unknown math single operator: ' + op);
    }
    const order = (op === 'NEG') ? generator.ORDER_UNARY_NEGATION : generator.ORDER_FUNCTION_CALL;
    return [code, order];
  };
  
  generator.forBlock['math_trig'] = function(block) {
    const op = block.getFieldValue('OP');
    const arg = generator.valueToCode(block, 'NUM', generator.ORDER_NONE) || '0';
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
    return [code, generator.ORDER_FUNCTION_CALL];
  };

  generator.forBlock['math_constant'] = function(block) {
    const CONSTANTS = { 'PI': 'Math.PI', 'E': 'Math.E', 'GOLDEN_RATIO': '(1.0 + Math.Sqrt(5.0)) / 2.0', 'SQRT2': 'Math.Sqrt(2.0)', 'SQRT1_2': 'Math.Sqrt(0.5)', 'INFINITY': 'double.PositiveInfinity' };
    return [CONSTANTS[block.getFieldValue('CONSTANT')], generator.ORDER_MEMBER];
  };

  generator.forBlock['math_round'] = function(block) {
    const op = block.getFieldValue('OP');
    const arg = generator.valueToCode(block, 'NUM', generator.ORDER_NONE) || '0';
    const funcs = { 'ROUND': 'Math.Round', 'ROUNDUP': 'Math.Ceiling', 'ROUNDDOWN': 'Math.Floor' };
    const code = `${funcs[op]}(${arg})`;
    return [code, generator.ORDER_FUNCTION_CALL];
  };

  // =================================================================
  // ИСПРАВЛЕНИЕ №1: Этот блок теперь возвращает массив [код, приоритет]
  // =================================================================
generator.forBlock['math_modulo'] = function(block) {
  // БЫЛО: generator.ORDER_MODULUS
  // СТАЛО: generator.ORDER_MULTIPLICATION
  const arg0 = generator.valueToCode(block, 'DIVIDEND', generator.ORDER_MULTIPLICATION) || '0';
  const arg1 = generator.valueToCode(block, 'DIVISOR', generator.ORDER_MULTIPLICATION) || '0';
  const code = `${arg0} % ${arg1}`;
  // Возвращаем код с правильным, существующим приоритетом
  return [code, generator.ORDER_MULTIPLICATION];
};

  generator.forBlock['math_change'] = function(block) {
    const varName = generator.variableDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    const delta = generator.valueToCode(block, 'DELTA', generator.ORDER_ADDITION) || '0';
    return `${varName} += ${delta};\n`;
  };

  // --- ПЕРЕМЕННЫЕ ---
  generator.forBlock['variables_get'] = function(block) {
    const varName = generator.variableDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    return [varName, generator.ORDER_ATOMIC];
  };

  generator.forBlock['variables_set'] = function(block) {
    const varName = generator.variableDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ASSIGNMENT) || '0';
    return `${varName} = ${value};\n`;
  };

  // --- ТЕКСТ ---
  generator.forBlock['text'] = function(block) {
    const textValue = generator.quote_(block.getFieldValue('TEXT'));
    return [textValue, generator.ORDER_ATOMIC];
  };
  
  generator.forBlock['text_join'] = function(block) {
    if (block.itemCount_ === 0) return ['""', generator.ORDER_ATOMIC];
    const elements = Array.from({length: block.itemCount_}, (_, i) => generator.valueToCode(block, 'ADD' + i, generator.ORDER_NONE) || '""');
    return [`string.Concat(${elements.join(', ')})`, generator.ORDER_FUNCTION_CALL];
  };

  generator.forBlock['text_append'] = function(block) {
    const varName = generator.variableDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ASSIGNMENT) || '""';
    return `${varName} += ${text};\n`;
  };

  generator.forBlock['text_length'] = function(block) {
    const text = generator.valueToCode(block, 'VALUE', generator.ORDER_MEMBER) || '""';
    return [`${text}.Length`, generator.ORDER_MEMBER];
  };

  generator.forBlock['text_isEmpty'] = function(block) {
    const text = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || '""';
    return [`string.IsNullOrEmpty(${text})`, generator.ORDER_FUNCTION_CALL];
  };
  
  // --- СПИСКИ (предполагаем List<object> для универсальности) ---
  
  // =================================================================
  // ИСПРАВЛЕНИЕ №2: Этот блок теперь возвращает массив [код, приоритет]
  // =================================================================
generator.forBlock['lists_create_with'] = function(block) {
  // ИСПРАВЛЕНИЕ: Заменяем несуществующий ORDER_COMMA на ORDER_NONE.
  const elements = Array.from(
    {length: block.itemCount_},
    (_, i) => generator.valueToCode(block, 'ADD' + i, generator.ORDER_NONE) || 'null'
  );
  const code = `new List<object> { ${elements.join(', ')} }`;
  return [code, generator.ORDER_ATOMIC];
};

  // =================================================================
  // ИСПРАВЛЕНИЕ №3: Этот блок теперь возвращает массив [код, приоритет]
  // =================================================================
generator.forBlock['lists_repeat'] = function(block) {
  // ИСПРАВЛЕНИЕ: Здесь тоже заменяем несуществующий ORDER_COMMA на ORDER_NONE.
  const item = generator.valueToCode(block, 'ITEM', generator.ORDER_NONE) || 'null';
  const count = generator.valueToCode(block, 'NUM', generator.ORDER_NONE) || '0';
  const code = `new List<object>(Enumerable.Repeat(${item}, (int)${count}))`;
  return [code, generator.ORDER_FUNCTION_CALL];
};
  
  generator.forBlock['lists_length'] = function(block) {
    const list = generator.valueToCode(block, 'VALUE', generator.ORDER_MEMBER) || 'new List<object>()';
    return [`${list}.Count`, generator.ORDER_MEMBER];
  };
  
  generator.forBlock['lists_isEmpty'] = function(block) {
    const list = generator.valueToCode(block, 'VALUE', generator.ORDER_MEMBER) || 'new List<object>()';
    return [`(${list}.Count == 0)`, generator.ORDER_EQUALITY];
  };

  generator.forBlock['lists_getIndex'] = function(block) {
    const list = generator.valueToCode(block, 'VALUE', generator.ORDER_MEMBER) || 'new List<object>()';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const at = generator.valueToCode(block, 'AT', generator.ORDER_NONE) || '1';
    const mode = block.getFieldValue('MODE') || 'GET';
    // This needs a helper function for complex index logic (from end, etc.)
    // For now, a simplified version:
    if (where === 'FIRST') {
        if (mode === 'GET' || mode === 'GET_REMOVE') {
            return [`${list}[0]`, generator.ORDER_MEMBER];
        } else { // REMOVE
            return `${list}.RemoveAt(0);\n`;
        }
    }
    if (where === 'LAST') {
        if (mode === 'GET' || mode === 'GET_REMOVE') {
            return [`${list}[${list}.Count - 1]`, generator.ORDER_MEMBER];
        } else { // REMOVE
            return `${list}.RemoveAt(${list}.Count - 1);\n`;
        }
    }
    
    // Simplified 'from start' logic
    if (mode === 'GET') {
        return [`${list}[(int)${at}-1]`, generator.ORDER_MEMBER];
    } else { // GET_REMOVE or REMOVE
        return `${list}.RemoveAt((int)${at}-1);\n`;
    }
  };

  generator.forBlock['lists_setIndex'] = function(block) {
    const list = generator.valueToCode(block, 'LIST', generator.ORDER_MEMBER) || 'new List<object>()';
    const where = block.getFieldValue('WHERE') || 'FROM_START';
    const at = generator.valueToCode(block, 'AT', generator.ORDER_NONE) || '1';
    const value = generator.valueToCode(block, 'TO', generator.ORDER_ASSIGNMENT) || 'null';
    const mode = block.getFieldValue('MODE') || 'SET';
    
    if(where === 'FIRST') {
      if (mode === 'SET') return `${list}[0] = ${value};\n`;
      return `${list}.Insert(0, ${value});\n`;
    }
    if(where === 'LAST') {
      if (mode === 'SET') return `${list}[${list}.Count - 1] = ${value};\n`;
      return `${list}.Add(${value});\n`;
    }
    if (mode === 'SET') {
      return `${list}[(int)${at}-1] = ${value};\n`;
    } else { // INSERT
      return `${list}.Insert((int)${at}-1, ${value});\n`;
    }
  };
  
  // --- ПРОЦЕДУРЫ (ФУНКЦИИ) ---
  generator.forBlock['procedures_defnoreturn'] = function(block) {
    const funcName = generator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
    let branch = generator.statementToCode(block, 'STACK') || '';
    const args = block.getVars().map(v => `object ${generator.variableDB_.getName(v.name, 'VARIABLE')}`);
    let code = `void ${funcName}(${args.join(', ')}) {\n${branch}}`;
    generator.definitions_[funcName] = code;
    return null;
  };

  generator.forBlock['procedures_defreturn'] = function(block) {
    const funcName = generator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
    let branch = generator.statementToCode(block, 'STACK') || '';
    let returnValue = generator.valueToCode(block, 'RETURN', generator.ORDER_NONE) || 'null';
    if (returnValue) {
      branch += `  return ${returnValue};\n`;
    }
    const args = block.getVars().map(v => `object ${generator.variableDB_.getName(v.name, 'VARIABLE')}`);
    let code = `object ${funcName}(${args.join(', ')}) {\n${branch}}`;
    generator.definitions_[funcName] = code;
    return null;
  };

  generator.forBlock['procedures_callnoreturn'] = function(block) {
    const funcName = generator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
    const args = [];
    const argNames = block.getVars();
    for (let i = 0; i < argNames.length; i++) {
        args[i] = generator.valueToCode(block, 'ARG' + i, generator.ORDER_COMMA) || 'null';
    }
    return `${funcName}(${args.join(', ')});\n`;
  };

  generator.forBlock['procedures_callreturn'] = function(block) {
    const funcName = generator.variableDB_.getName(block.getFieldValue('NAME'), 'PROCEDURE');
    const args = [];
    const argNames = block.getVars();
    for (let i = 0; i < argNames.length; i++) {
        args[i] = generator.valueToCode(block, 'ARG' + i, generator.ORDER_COMMA) || 'null';
    }
    const code = `${funcName}(${args.join(', ')})`;
    return [code, generator.ORDER_FUNCTION_CALL];
  };

  generator.forBlock['procedures_ifreturn'] = function(block) {
    const condition = generator.valueToCode(block, 'CONDITION', generator.ORDER_NONE) || 'false';
    let code = `if (${condition}) {\n`;
    if (block.hasReturnValue_) {
      const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || 'null';
      code += `  return ${value};\n`;
    } else {
      code += '  return;\n';
    }
    code += '}\n';
    return code;
  };
}