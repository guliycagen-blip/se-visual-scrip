// src/blocks/se_base_blocks.js

import * as Blockly from 'blockly/core';

const base_colour = "#777777"; // Нейтральный серый цвет

// Блок для установки значения переменной
Blockly.Blocks['se_variable_set'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .appendField("установить")
        .appendField(new Blockly.FieldVariable("item"), "VAR")
        .appendField("=");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(base_colour);
    this.setTooltip("Присваивает значение переменной.");
  }
};

// Блок для получения значения переменной (используем стандартный)
// Мы просто добавим его в нашу кастомную категорию позже.
// Blockly.Blocks['variables_get']

// Блок для логического сравнения
Blockly.Blocks['se_logic_compare'] = {
  init: function() {
    this.appendValueInput("A");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["==", "EQ"],
            ["!=", "NEQ"],
            ["<", "LT"],
            ["<=", "LTE"],
            [">", "GT"],
            [">=", "GTE"]
        ]), "OP");
    this.appendValueInput("B");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(base_colour);
    this.setTooltip("Сравнивает два значения.");
  }
};

// Блок для математических операций
Blockly.Blocks['se_math_operation'] = {
  init: function() {
    this.appendValueInput("A").setCheck("Number");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["+", "ADD"],
            ["-", "MINUS"],
            ["×", "MULTIPLY"],
            ["÷", "DIVIDE"]
        ]), "OP");
    this.appendValueInput("B").setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(base_colour);
    this.setTooltip("Выполняет арифметическую операцию.");
  }
};