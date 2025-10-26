// src/blocks/console_blocks.js

import * as Blockly from 'blockly/core';

const programColour = '#5b6770';
const ioColour = "#5b80a5";

Blockly.Blocks['program_main'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Создать консольную программу C#");
    this.appendStatementInput("BODY")
        .setCheck(null);
    this.setColour(programColour);
    this.setTooltip("Главный блок для создания полноценной программы. Весь код внутри будет помещен в метод Main().");
    this.setDeletable(false); // Этот блок нельзя удалить
    this.setMovable(false);  // и нельзя передвинуть
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
  }
};

Blockly.Blocks['console_writeline'] = {
  init: function() {
    this.appendValueInput("TEXT_TO_WRITE")
        .setCheck(["String", "Number", "Boolean"])
        .appendField("вывести в консоль");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ioColour);
    this.setTooltip("Выводит указанное значение в консоль с новой строки.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['console_readline'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("прочитать строку из консоли");
    this.setOutput(true, "String");
    this.setColour(ioColour);
    this.setTooltip("Читает следующую строку из консоли и возвращает ее как текст.");
    this.setHelpUrl("");
  }
};