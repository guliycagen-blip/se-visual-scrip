// src/generator/generator_instance.js

import * as Blockly from 'blockly/core';

// Этот файл теперь единственный, кто СОЗДАЕТ генератор.
// Он является "источником правды".
export const csharpGenerator = new Blockly.Generator('CSharp');