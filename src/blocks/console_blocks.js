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
    this.setDeletable(false);
    this.setMovable(false);
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
  }
};

Blockly.Blocks['console_writeline'] = {
  init: function() {
    this.appendValueInput("VALUE") // <-- ИЗМЕНЕНИЕ ЗДЕСЬ: "TEXT_TO_WRITE" заменено на "VALUE"
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

    // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
    // Явно указываем, что этот блок НЕ МОЖЕТ иметь соединений сверху или снизу.
    // Это делает его определение абсолютно однозначным для движка Blockly
    // и не позволит пользователю "бросить" его на рабочую область как отдельную команду.
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    // -------------------------

    this.setColour(ioColour);
    this.setTooltip("Читает следующую строку из консоли и возвращает ее как текст.");
    this.setHelpUrl("");
  }
};