import * as Blockly from 'blockly/core';

const programColour = '#5b6770';

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