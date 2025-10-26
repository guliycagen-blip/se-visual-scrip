// src/blockly_init.js

// 1. Импортируем основной объект Blockly
import * as Blockly from 'blockly';

// 2. Импортируем дополнения для их побочного эффекта.
//    Они "прикрепят" себя к основному объекту Blockly.
import 'blockly/blocks';           // Добавляет стандартные блоки
import 'blockly/serialization/xml';  // <-- Это добавит Blockly.serialization.xml

// 3. Импортируем локализацию
import * as Ru from 'blockly/msg/ru';

// 4. Импортируем наши собственные модули, как и раньше
import './generator/generator_instance.js';
import './generator/standard_csharp_generator.js';
import './generator/se_csharp_base_generator.js';
import './generator/se_csharp_generator.js';
import './generator/csharp/console_generator.js';

import './fields/FieldReactColour.js';

import './blocks/se_base_blocks.js';
import './blocks/se_blocks.js';
import './blocks/console_blocks.js';


// 5. Наконец, настраиваем локаль
Blockly.setLocale(Ru);