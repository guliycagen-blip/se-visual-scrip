// src/generator/se_csharp_base_generator.js
//  ИМПОРТИРУЕМ генератор из ЕДИНОГО источника
import { csharpGenerator } from './generator_instance.js';


export function registerSEBaseGenerators(generator) {
  generator.forBlock['se_variable_set'] = function(block, generator) {
    const variable_name = generator.getVariableName(block.getFieldValue('VAR'));
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ASSIGNMENT) || '0';
    return `${variable_name} = ${value};\n`;
  };

  const OPERATOR_MAP = {
    'EQ': '==', 'NEQ': '!=', 'LT': '<',
    'LTE': '<=', 'GT': '>', 'GTE': '>='
  };

  generator.forBlock['se_logic_compare'] = function(block, generator) {
    const op = OPERATOR_MAP[block.getFieldValue('OP')];
    const order = (op === '==' || op === '!=') ?
        generator.ORDER_EQUALITY : generator.ORDER_RELATIONAL;
    const arg0 = generator.valueToCode(block, 'A', order) || '0';
    const arg1 = generator.valueToCode(block, 'B', order) || '0';
    const code = `${arg0} ${op} ${arg1}`;
    return [code, order];
  };

  const MATH_OPERATOR_MAP = {
    'ADD': [' + ', generator.ORDER_ADDITIVE],
    'MINUS': [' - ', generator.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', generator.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', generator.ORDER_MULTIPLICATIVE]
  };

  generator.forBlock['se_math_operation'] = function(block, generator) {
    const operatorInfo = MATH_OPERATOR_MAP[block.getFieldValue('OP')];
    const op = operatorInfo[0];
    const order = operatorInfo[1];
    const arg0 = generator.valueToCode(block, 'A', order) || '0';
    const arg1 = generator.valueToCode(block, 'B', order) || '0';
    const code = `${arg0}${op}${arg1}`;
    return [code, order];
  };
}