// src/fields/FieldReactColour.js

import * as Blockly from 'blockly/core';
// --- ИЗМЕНЕНИЕ 1: Импортируем базовый класс напрямую ---
import { FieldColour } from 'blockly/core';

// --- ИЗМЕНЕНИЕ 2: Наследуемся от импортированного класса, а не от Blockly.FieldColour ---
export class FieldReactColour extends FieldColour {
  static fromJson(options) {
    return new FieldReactColour(options.colour, undefined, options);
  }

  showEditor_() {
    if (FieldReactColour.outsider) {
      FieldReactColour.outsider(this.getValue(), (newColour) => {
        this.setValue(newColour);
      });
    } else {
      super.showEditor_();
    }
  }
}

// --- ИЗМЕНЕНИЕ 3: Используем современный способ регистрации поля ---
Blockly.fieldRegistry.register('field_react_colour', FieldReactColour);