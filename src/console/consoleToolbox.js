// src/console/consoleToolbox.js

export const consoleToolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "Программа",
      "colour": "#5b6770",
      "contents": [
        { "kind": "block", "type": "program_main" }
      ]
    },
    { kind: 'category', name: 'Логика', colour: '%{BKY_LOGIC_HUE}', contents: [ { kind: 'block', type: 'controls_if' }, { kind: 'block', type: 'logic_compare' }, { kind: 'block', type: 'logic_operation' }, { kind: 'block', type: 'logic_negate' }, { kind: 'block', type: 'logic_boolean' }, { kind: 'block', type: 'logic_null' } ] },
    { kind: 'category', name: 'Циклы', colour: '%{BKY_LOOPS_HUE}', contents: [ { kind: 'block', type: 'controls_repeat_ext' }, { kind: 'block', type: 'controls_whileUntil' }, { kind: 'block', type: 'controls_for' }, { kind: 'block', type: 'controls_forEach' }, { kind: 'block', type: 'controls_flow_statements' } ] },
    { kind: 'category', name: 'Математика', colour: '%{BKY_MATH_HUE}', contents: [ { kind: 'block', type: 'math_number' }, { kind: 'block', type: 'math_arithmetic' }, { kind: 'block', type: 'math_single' }, { kind: 'block', type: 'math_trig' }, { kind: 'block', type: 'math_constant' }, { kind: 'block', type: 'math_round' }, { kind: 'block', type: 'math_modulo' }, { kind: 'block', type: 'math_change' } ] },
    { kind: 'category', name: 'Текст', colour: '%{BKY_TEXTS_HUE}', contents: [ { kind: 'block', type: 'text' }, { kind: 'block', type: 'text_join' }, { kind: 'block', type: 'text_append' }, { kind: 'block', type: 'text_length' }, { kind: 'block', type: 'text_isEmpty' } ] },
    { kind: 'category', name: 'Списки', colour: '%{BKY_LISTS_HUE}', contents: [ { kind: 'block', type: 'lists_create_with' }, { kind: 'block', type: 'lists_repeat' }, { kind: 'block', type: 'lists_length' }, { kind: 'block', type: 'lists_isEmpty' }, { kind: 'block', type: 'lists_getIndex' }, { kind: 'block', type: 'lists_setIndex' } ] },
    { kind: 'sep' },
    { kind: 'category', name: 'Переменные', colour: '%{BKY_VARIABLES_HUE}', custom: 'VARIABLE' },
    { kind: 'category', name: 'Функции', colour: '%{BKY_PROCEDURES_HUE}', custom: 'PROCEDURE' },
    { kind: 'sep' },
    { kind: "category", "name": "Ввод/Вывод", "colour": "#5b80a5", "contents": [{ "kind": "block", "type": "console_writeline" },{ "kind": "block", "type": "console_readline" }] }
  ]
};