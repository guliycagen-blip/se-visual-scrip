// src/blocks/se_blocks.js
// se_blocks.js

import * as Blockly from 'blockly/core';
import { FieldReactColour } from '../fields/FieldReactColour.js';

// --- СПИСКИ ДАННЫХ ДЛЯ ВЫПАДАЮЩИХ СПИСКОВ ---
const ASSEMBLER_BLUEPRINTS = [
    ["Строительный компонент", "ConstructionComponent"],
    ["Компьютер", "ComputerComponent"],
    ["Мотор", "MotorComponent"],
    ["Малая стальная труба", "SmallTube"],
    ["Большая стальная труба", "LargeTube"],
    ["Стальная пластина", "SteelPlate"],
    ["Внутренняя пластина", "InteriorPlate"],
    ["Металлическая решетка", "MetalGrid"],
    ["Пуленепробиваемое стекло", "BulletproofGlass"],
    ["Дисплей", "Display"],
    ["Балка", "GirderComponent"],
    ["Холст", "Canvas"],
    ["Зональный чип", "ZoneChip"],
    ["Силовой элемент", "PowerCell"],
    ["Радио-компонент", "RadioCommunication"],
    ["Детекторный компонент", "DetectorComponent"],
    ["Гравитационный компонент", "GravityGeneratorComponent"],
    ["Медицинский компонент", "MedicalComponent"],
    ["Взрывчатка", "Explosives"],
    ["Солнечная панель", "SolarCell"],
    ["Суперконденсатор", "Superconductor"]
];

const INVENTORY_ITEM_TYPES = [
    ["Строительный компонент", "Construction"],
    ["Компьютер", "Computer"],
    ["Мотор", "Motor"],
    ["Малая стальная труба", "SmallTube"],
    ["Большая стальная труба", "LargeTube"],
    ["Стальная пластина", "SteelPlate"],
    ["Внутренняя пластина", "InteriorPlate"],
    ["Металлическая решетка", "MetalGrid"],
    ["Пуленепробиваемое стекло", "BulletproofGlass"],
    ["Дисплей", "Display"],
    ["Балка", "Girder"],
    ["Холст", "Canvas"],
    ["Зональный чип", "ZoneChip"]
];

// --- ЦВЕТА КАТЕГОРИЙ ---
const se_main_colour = "#5C81A6";
const se_vector_colour = '#5DB05D';
const se_mechanics_colour = '#ADA358';
const se_display_colour = '#5BA5A5';
const se_sensor_colour = '#9d5db0';
const se_timer_colour = '#f2a13d';
const se_production_colour = '#a6815c';
const se_energy_colour = '#c2c257';
const se_inventory_colour = '#7c9dbe'; 
const se_lighting_colour = '#7c9dbe';
const se_movement_colour = '#c28557';
const se_weapons_colour = '#b36262';
const se_vector_colour_2d = '#6DC06D';


// --- БЛОКИ СТРУКТУРЫ ---

Blockly.Blocks['se_program_structure'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("SE Скрипт")
        .appendField(new Blockly.FieldDropdown([
            ["Обновление: Нет", "NONE"],
            ["Обновление: 1 тик", "Update1"],
            ["Обновление: 10 тиков", "Update10"],
            ["Обновление: 100 тиков", "Update100"]
        ]), "UPDATE_FREQ");
    this.appendStatementInput("INIT")
        .setCheck(null)
        .appendField("При запуске (в конструкторе)");
    this.appendStatementInput("MAIN")
        .setCheck(null)
        .appendField("В цикле (Main)");
    this.appendStatementInput("ON_SAVE") // <<-- ВОТ ОН, НЕДОСТАЮЩИЙ ВХОД
        .setCheck(null)
        .appendField("При сохранении");
    this.appendValueInput("ARGUMENT")
        .setCheck("String")
        .appendField("Аргумент по умолчанию");
    this.setColour(230);
    this.setTooltip("Основная структура скрипта для Space Engineers.");
    this.setHelpUrl("");
    this.setDeletable(false);
    this.setMovable(false);
  }
};

Blockly.Blocks['se_set_update_frequency'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("установить частоту обновления на")
        .appendField(new Blockly.FieldDropdown([
            ["Нет (по вызову)", "None"],
            ["Каждый тик (Update1)", "Update1"],
            ["Каждые 10 тиков (Update10)", "Update10"],
            ["Каждые 100 тиков (Update100)", "Update100"]
        ]), "FREQUENCY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_main_colour);
    this.setTooltip("Устанавливает, как часто игра будет запускать этот скрипт. Поместите в секцию 'При запуске'.");
    this.setHelpUrl("");
  }
};

// --- ОБЩИЕ БЛОКИ ---

Blockly.Blocks['se_get_typed_block_by_name'] = {
    init: function() {
        this.appendValueInput("BLOCK_NAME")
            .setCheck("String")
            .appendField("найти блок типа")
            .appendField(new Blockly.FieldDropdown([
                ["Любой", "TerminalBlock"], ["Сенсор", "SensorBlock"], ["Свет", "LightingBlock"],
                ["Таймер", "TimerBlock"], ["LCD панель", "TextPanel"], ["Поршень", "PistonBase"],
                ["Ротор", "MotorStator"], ["Контейнер", "CargoContainer"], ["Батарея", "BatteryBlock"],
                ["Ассемблер", "Assembler"], ["Реактор", "Reactor"], ["Коннектор", "ShipConnector"],
            ]), "BLOCK_TYPE")
            .appendField("с именем");
        this.setOutput(true, null);
        this.setColour(se_main_colour);
        this.setTooltip("Находит конкретный блок по его имени и типу.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['se_get_blocks_of_type'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("найти все блоки типа")
            .appendField(new Blockly.FieldDropdown([
                ["Свет", "LightingBlock"], ["Батарея", "BatteryBlock"],
                ["Двигатель", "Thrust"], ["Гироскоп", "Gyro"],
                ["Реактор", "Reactor"], ["Солнечная панель", "SolarPanel"]
            ]), "BLOCK_TYPE");
        this.setOutput(true, "Array");
        this.setColour(se_main_colour);
        this.setTooltip("Возвращает список всех блоков указанного типа.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['se_get_blocks_in_group'] = {
    init: function() {
        this.appendValueInput("GROUP_NAME")
            .setCheck("String")
            .appendField("найти все блоки в группе");
        this.setOutput(true, "Array");
        this.setColour(se_main_colour);
        this.setTooltip("Возвращает список всех блоков из указанной группы.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['se_is_block_found'] = {
  init: function() {
    this.appendValueInput("BLOCK")
        .setCheck(null)
        .appendField("блок");
    this.appendDummyInput()
        .appendField("найден?");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(se_main_colour);
    this.setTooltip("Возвращает 'истина', если блок был успешно найден, и 'ложь' в противном случае.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_set_enabled'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("для блока");
        this.appendValueInput("ENABLED").setCheck("Boolean").appendField("установить состояние вкл/выкл");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(se_main_colour);
        this.setTooltip("Включает или выключает блок (аналог On/Off в терминале).");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['se_set_use_conveyor'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для блока");
    this.appendValueInput("ENABLED").setCheck("Boolean").appendField("установить 'использовать конвейер'");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_main_colour);
    this.setTooltip("Включает или выключает использование конвейерной системы для блока.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_get_block_property_boolean'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("у блока");
    this.appendDummyInput()
        .appendField("получить свойство")
        .appendField(new Blockly.FieldDropdown([
            ["работает (не поврежден)?", "IsFunctional"],
            ["включен и выполняет функцию?", "IsWorking"],
            ["есть инвентарь?", "HasInventory"]
        ]), "PROPERTY");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(se_main_colour);
    this.setTooltip("Возвращает логическое значение (истина/ложь) для общих свойств блока.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_echo'] = {
  init: function() {
    this.appendValueInput("TEXT").setCheck(null).appendField("вывести в консоль");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_main_colour);
    this.setTooltip("Выводит сообщение в консоль программного блока.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_program_argument'] = {
  init: function() {
    this.appendDummyInput().appendField("аргумент запуска");
    this.setOutput(true, "String");
    this.setColour(se_main_colour);
    this.setTooltip("Возвращает аргумент, с которым был запущен скрипт.");
    this.setHelpUrl("");
  }
};


// --- БЛОКИ ОСВЕЩЕНИЯ ---
Blockly.Blocks['se_light_set_color'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для света");
    this.appendDummyInput().appendField("установить цвет").appendField(new FieldReactColour('#ff0000'), 'COLOR');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_lighting_colour);
    this.setTooltip("Устанавливает цвет для блока освещения.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_light_set_radius'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("для света");
        this.appendValueInput("RADIUS").setCheck("Number").appendField("установить радиус");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(se_lighting_colour);
    }
};

Blockly.Blocks['se_light_set_intensity'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("для света");
        this.appendValueInput("INTENSITY").setCheck("Number").appendField("установить интенсивность");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(se_lighting_colour);
    }
};

// --- МЕХАНИЗМЫ ---
Blockly.Blocks['se_piston_set_velocity'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для поршня");
    this.appendValueInput("VELOCITY").setCheck("Number").appendField("установить скорость");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_mechanics_colour);
    this.setTooltip("Устанавливает скорость движения поршня в м/с.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_piston_change_limit'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("для поршня изменить");
        this.appendDummyInput().appendField(new Blockly.FieldDropdown([["мин. лимит", "MinLimit"], ["макс. лимит", "MaxLimit"]]), "LIMIT_TYPE");
        this.appendValueInput("VALUE").setCheck("Number").appendField("на");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(se_mechanics_colour);
    }
};
Blockly.Blocks['se_piston_get_position'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("текущая позиция поршня");
        this.setOutput(true, "Number");
        this.setColour(se_mechanics_colour);
    }
};

Blockly.Blocks['se_piston_get_status'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить статус поршня");
    this.setOutput(true, "String");
    this.setColour(se_mechanics_colour);
    this.setTooltip("Возвращает текущий статус поршня (Stopped, Extending, Retracting и т.д.).");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_rotor_set_velocity'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("для ротора");
        this.appendValueInput("VELOCITY").setCheck("Number").appendField("установить скорость (RPM)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(se_mechanics_colour);
    }
};

Blockly.Blocks['se_rotor_set_limits'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для ротора установить");
    this.appendValueInput("LOWER").setCheck("Number").appendField("нижний лимит (град)");
    this.appendValueInput("UPPER").setCheck("Number").appendField("верхний лимит (град)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_mechanics_colour);
    this.setTooltip("Устанавливает верхний и нижний пределы вращения ротора в градусах.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_rotor_get_angle'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("текущий угол ротора (градусы)");
        this.setOutput(true, "Number");
        this.setColour(se_mechanics_colour);
    }
};

Blockly.Blocks['se_landing_gear_lock_unlock'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для шасси");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["заблокировать", "Lock"],
            ["разблокировать", "Unlock"]
        ]), "ACTION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_mechanics_colour);
    this.setTooltip("Блокирует или разблокирует посадочное шасси.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_landing_gear_get_status'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить статус шасси");
    this.setOutput(true, "String");
    this.setColour(se_mechanics_colour);
    this.setTooltip("Возвращает текущий статус шасси (Locked, Unlocked, ReadyToLock).");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_connector_lock_unlock'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для коннектора");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["заблокировать", "Lock"],
            ["разблокировать", "Unlock"]
        ]), "ACTION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_mechanics_colour);
    this.setTooltip("Блокирует или разблокирует коннектор.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_connector_get_status'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить статус коннектора");
    this.setOutput(true, "String");
    this.setColour(se_mechanics_colour);
    this.setTooltip("Возвращает текущий статус коннектора (Unconnected, Connected, Connectable).");
    this.setHelpUrl("");
  }
};

// --- ДВИЖЕНИЕ И УПРАВЛЕНИЕ ---
Blockly.Blocks['se_thruster_set_override'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("для двигателя");
        this.appendValueInput("OVERRIDE").setCheck("Number").appendField("установить переопределение тяги (%)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(se_movement_colour);
    }
};

Blockly.Blocks['se_thruster_get_thrust'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("текущая тяга двигателя (N)");
        this.setOutput(true, "Number");
        this.setColour(se_movement_colour);
    }
};

Blockly.Blocks['se_gyro_set_override'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для гироскопа");
    this.appendValueInput("ENABLED").setCheck("Boolean").appendField("включить ручное управление");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_movement_colour);
    this.setTooltip("Включает или выключает режим Gyro Override.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_gyro_set_rotation'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для гироскопа");
    this.appendValueInput("VALUE").setCheck("Number")
        .appendField("установить")
        .appendField(new Blockly.FieldDropdown([
            ["тангаж (Pitch)", "Pitch"],
            ["рысканье (Yaw)", "Yaw"],
            ["крен (Roll)", "Roll"]
        ]), "AXIS");
    this.appendDummyInput().appendField("(град/с)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_movement_colour);
    this.setTooltip("Устанавливает желаемую скорость вращения. Gyro Override должен быть включен.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_controller_is_under_control'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("кокпит/пульт управления");
    this.appendDummyInput().appendField("управляется игроком?");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(se_movement_colour);
    this.setTooltip("Возвращает 'истина', если игрок сидит в этом кокпите и управляет кораблем.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_controller_get_gravity'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить вектор гравитации для");
    this.setOutput(true, "Vector3D");
    this.setColour(se_movement_colour);
    this.setTooltip("Возвращает вектор естественной гравитации, действующей на кокпит.");
    this.setHelpUrl("");
  }
};

// --- ИНВЕНТАРЬ ---
Blockly.Blocks['se_inventory_get_fill_percent'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить % заполнения инвентаря у");
    this.setOutput(true, "Number");
    this.setColour(se_inventory_colour);
    this.setTooltip("Возвращает процент заполнения первого инвентаря у указанного блока.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_inventory_transfer_item'] = {
  init: function() {
    this.appendValueInput("AMOUNT").setCheck("Number").appendField("переместить");
    this.appendValueInput("ITEM_SUBTYPE").setCheck("String").appendField("предмета (ID)");
    this.appendDummyInput().appendField("типа")
        .appendField(new Blockly.FieldDropdown([
            ["Компонент", "Component"], ["Слиток", "Ingot"], ["Руда", "Ore"]
        ]), "ITEM_TYPE");
    this.appendValueInput("FROM_BLOCK").setCheck(null).setAlign(Blockly.inputs.Align.RIGHT).appendField("из блока");
    this.appendValueInput("TO_BLOCK").setCheck(null).setAlign(Blockly.inputs.Align.RIGHT).appendField("в блок");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_inventory_colour);
    this.setTooltip("Перемещает предмет из одного блока в другой.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_inventory_get_item_amount'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить кол-во предмета");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(INVENTORY_ITEM_TYPES), "ITEM_TYPE")
        .appendField("из инвентаря");
    this.setOutput(true, "Number");
    this.setColour(se_inventory_colour);
    this.setTooltip("Возвращает количество указанного предмета в первом инвентаре блока.");
    this.setHelpUrl("");
  }
};

// --- ПРОИЗВОДСТВО ---
Blockly.Blocks['se_assembler_add_to_queue'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("добавить в очередь ассемблера");
    this.appendDummyInput().appendField(new Blockly.FieldDropdown(ASSEMBLER_BLUEPRINTS), "BLUEPRINT_ID");
    this.appendValueInput("AMOUNT").setCheck("Number").appendField("в количестве");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setColour(se_production_colour);
    this.setTooltip("Добавляет компоненты в очередь производства ассемблера.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_assembler_get_queue_amount'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить кол-во предмета");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(ASSEMBLER_BLUEPRINTS), "BLUEPRINT_ID")
        .appendField("в очереди ассемблера");
    this.setOutput(true, "Number");
    this.setColour(se_production_colour);
    this.setTooltip("Возвращает количество указанного предмета в очереди на производство.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_assembler_set_repeating'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для ассемблера");
    this.appendValueInput("REPEATING").setCheck("Boolean").appendField("установить режим повтора");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_production_colour);
    this.setTooltip("Включает или выключает режим 'Repeat' для ассемблера.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_production_is_working'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("производственный блок работает?");
        this.setOutput(true, "Boolean");
        this.setColour(se_production_colour);
    }
};

// --- ЭНЕРГИЯ ---
Blockly.Blocks['se_battery_get_charge'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("у батареи");
        this.appendDummyInput().appendField("получить").appendField(new Blockly.FieldDropdown([
            ["текущий заряд (%)", "CURRENT_PERCENT"],
            ["текущий заряд (MWh)", "CURRENT_MWH"],
            ["макс. заряд (MWh)", "MAX_MWH"]]), "CHARGE_TYPE");
        this.setOutput(true, "Number");
        this.setColour(se_energy_colour);
    }
};

Blockly.Blocks['se_battery_get_input'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("текущий вход (MW) у батареи");
    this.setOutput(true, "Number");
    this.setColour(se_energy_colour);
    this.setTooltip("Возвращает текущую мощность, потребляемую батареей для зарядки.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_battery_set_charge_mode'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для батареи");
    this.appendDummyInput().appendField("установить режим")
        .appendField(new Blockly.FieldDropdown([
            ["Авто", "Auto"],
            ["Только зарядка", "Recharge"],
            ["Только разрядка", "Discharge"]
        ]), "MODE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_energy_colour);
    this.setTooltip("Устанавливает режим работы батареи.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_power_get_output'] = {
    init: function() {
        this.appendValueInput("BLOCK").setCheck(null).appendField("текущая выработка (MW) у");
        this.setOutput(true, "Number");
        this.setColour(se_energy_colour);
    }
};

Blockly.Blocks['se_power_get_max_output'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить макс. выработку (MW) у");
    this.setOutput(true, "Number");
    this.setColour(se_energy_colour);
    this.setTooltip("Возвращает максимальную выработку энергии для блока.");
    this.setHelpUrl("");
  }
};

// --- ДИСПЛЕИ И ВЫВОД ---
Blockly.Blocks['se_lcd_write_text'] = {
  init: function() {
    this.appendValueInput("TEXT").setCheck("String").appendField("записать текст");
    this.appendValueInput("BLOCK").setCheck(null).appendField("на LCD панель");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_display_colour);
    this.setTooltip("Полностью заменяет текст на LCD панели.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_lcd_append_text'] = {
  init: function() {
    this.appendValueInput("TEXT").setCheck("String").appendField("добавить текст");
    this.appendValueInput("BLOCK").setCheck(null).appendField("на LCD панель");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_display_colour);
    this.setTooltip("Добавляет текст на LCD панель с новой строки.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_lcd_clear'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("очистить LCD панель");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_display_colour);
    this.setTooltip("Удаляет весь текст с LCD панели.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_lcd_set_font_size'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для LCD панели");
    this.appendValueInput("SIZE").setCheck("Number").appendField("установить размер шрифта");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_display_colour);
    this.setTooltip("Устанавливает размер шрифта на LCD панели. Значение по умолчанию: 1.0");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_lcd_set_color'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для LCD панели установить");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["цвет текста", "FontColor"], ["цвет фона", "BackgroundColor"]]), "TARGET")
        .appendField("на")
        .appendField(new Blockly.FieldDropdown([
            ["Белый", "White"], ["Черный", "Black"], ["Синий", "Blue"], ["Зеленый", "Green"],
            ["Красный", "Red"], ["Желтый", "Yellow"]
        ]), "COLOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_display_colour);
    this.setTooltip("Устанавливает цвет текста или фона на LCD панели.");
    this.setHelpUrl("");
  }
};

// --- СЕНСОРЫ ---
Blockly.Blocks['se_sensor_get_last_detected'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить информацию об объекте с сенсора");
    this.setOutput(true, "EntityInfo");
    this.setColour(se_sensor_colour);
    this.setTooltip("Возвращает подробную информацию о последнем объекте, обнаруженном сенсором.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_entity_info_is_empty'] = {
  init: function() {
    this.appendValueInput("ENTITY_INFO").setCheck("EntityInfo").appendField("информация об объекте");
    this.appendDummyInput().appendField("пуста?");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(se_sensor_colour);
    this.setTooltip("Возвращает 'истина', если сенсор ничего не обнаружил.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_entity_info_get_property'] = {
  init: function() {
    this.appendValueInput("ENTITY_INFO").setCheck("EntityInfo").appendField("из информации об объекте");
    this.appendDummyInput().appendField("получить")
        .appendField(new Blockly.FieldDropdown([
            ["имя", "Name"], ["тип", "Type"], ["отношение", "Relationship"], ["позицию", "Position"]
        ], function(property) { // <-- ПЕРЕДАЕМ ФУНКЦИЮ НАПРЯМУЮ
            // 'this' здесь - это поле. this.sourceBlock_ - это наш блок.
            if (this.sourceBlock_) { 
                if (property === 'Position') {
                    this.sourceBlock_.setOutput(true, "Vector3D");
                } else {
                    this.sourceBlock_.setOutput(true, "String");
                }
            }
        }), "PROPERTY");
    this.setOutput(true, "String");
    this.setColour(se_sensor_colour);
    this.setTooltip("Возвращает конкретное свойство обнаруженного объекта.");
    this.setHelpUrl("");
  }
  // Внешняя функция onPropertyChange полностью удалена
};

// --- ТАЙМЕРЫ ---
Blockly.Blocks['se_timer_control'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для таймера");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["запустить", "Start"], ["остановить", "Stop"], ["сработать сейчас", "TriggerNow"]
        ]), "ACTION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_timer_colour);
    this.setTooltip("Управляет таймер-блоком.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_timer_set_delay'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для таймера");
    this.appendValueInput("DELAY").setCheck("Number").appendField("установить задержку (сек)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_timer_colour);
    this.setTooltip("Устанавливает время задержки таймера в секундах.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_timer_is_counting_down'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("таймер");
    this.appendDummyInput().appendField("запущен?");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(se_timer_colour);
    this.setTooltip("Возвращает 'истина', если таймер ведет обратный отсчет.");
    this.setHelpUrl("");
  }
};

// --- ВЕКТОРЫ ---
Blockly.Blocks['se_vector_create'] = {
  init: function() {
    this.appendValueInput("X").setCheck("Number").appendField("создать вектор с X");
    this.appendValueInput("Y").setCheck("Number").appendField("Y");
    this.appendValueInput("Z").setCheck("Number").appendField("Z");
    this.setInputsInline(true);
    this.setOutput(true, "Vector3D");
    this.setColour(se_vector_colour);
    this.setTooltip("Создает новый трехмерный вектор (Vector3D).");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector_get_component'] = {
  init: function() {
    this.appendValueInput("VECTOR").setCheck("Vector3D").appendField("из вектора");
    this.appendDummyInput().appendField("получить компонент")
        .appendField(new Blockly.FieldDropdown([["X", "X"],["Y", "Y"],["Z", "Z"]]), "COMPONENT");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(se_vector_colour);
    this.setTooltip("Возвращает значение одного из компонентов вектора.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector_get_length'] = {
  init: function() {
    this.appendValueInput("VECTOR").setCheck("Vector3D").appendField("получить длину вектора");
    this.setOutput(true, "Number");
    this.setColour(se_vector_colour);
    this.setTooltip("Вычисляет и возвращает длину (модуль) вектора.");
    this.setHelpUrl("");
  }
};

// --- ОРУЖИЕ ---
Blockly.Blocks['se_weapon_shoot_toggle'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для оружия");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["включить", "Shoot_On"],
            ["выключить", "Shoot_Off"]
        ]), "ACTION")
        .appendField("стрельбу");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_weapons_colour);
    this.setTooltip("Включает или выключает непрерывную стрельбу для оружия.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_weapon_shoot_once'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("для оружия");
    this.appendDummyInput().appendField("выстрелить один раз");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_weapons_colour);
    this.setTooltip("Производит одиночный выстрел. Идеально для ракетниц.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_weapon_get_ammo'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("получить кол-во боеприпасов у оружия");
    this.setOutput(true, "Number");
    this.setColour(se_weapons_colour);
    this.setTooltip("Возвращает количество оставшихся патронов в оружии.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_weapon_is_shooting'] = {
  init: function() {
    this.appendValueInput("BLOCK").setCheck(null).appendField("оружие");
    this.appendDummyInput().appendField("стреляет?");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(se_weapons_colour);
    this.setTooltip("Возвращает 'истина', если оружие в данный момент ведет огонь.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_me'] = {
  init: function() {
    this.appendDummyInput().appendField("этот программный блок (Me)");
    this.setOutput(true, null); // Может подключаться к любому входу блока
    this.setColour(se_main_colour);
    this.setTooltip("Возвращает ссылку на сам программный блок, выполняющий этот скрипт.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_grid_get_property'] = {
  init: function() {
    this.appendValueInput("BLOCK")
        .setCheck(null)
        .appendField("у грида, к которому принадлежит блок");
    this.appendDummyInput()
        .appendField("получить")
        .appendField(new Blockly.FieldDropdown([
            ["имя", "DisplayName"],
            ["массу (кг)", "Mass"],
            ["является станцией?", "IsStatic"]
        ], function(property) { // <-- ИСПРАВЛЕНО
            if (this.sourceBlock_) {
                if (property === 'IsStatic') {
                    this.sourceBlock_.setOutput(true, "Boolean");
                } else if (property === 'Mass') {
                    this.sourceBlock_.setOutput(true, "Number");
                } else {
                    this.sourceBlock_.setOutput(true, "String");
                }
            }
        }), "PROPERTY");
    this.setOutput(true, "String");
    this.setColour(se_main_colour);
    this.setTooltip("Возвращает свойство всего грида (корабля/станции).");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_storage_write'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("String")
        .appendField("сохранить в хранилище");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(se_main_colour);
    this.setTooltip("Сохраняет текстовое значение в постоянное хранилище программного блока. Оно будет доступно при следующем запуске.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_storage_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("прочитать из хранилища");
    this.setOutput(true, "String");
    this.setColour(se_main_colour);
    this.setTooltip("Читает текстовое значение из постоянного хранилища программного блока.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_controller_get_input'] = {
  init: function() {
    this.appendValueInput("BLOCK")
        .setCheck(null)
        .appendField("у кокпита/пульта");
    this.appendDummyInput()
        .appendField("получить сигнал")
        .appendField(new Blockly.FieldDropdown([
            ["движения (WASD)", "MoveIndicator"],
            ["вращения (мышь)", "RotationIndicator"],
            ["крена (Q/E)", "RollIndicator"]
        ], function(property) { // <-- ИСПРАВЛЕНО
            if (this.sourceBlock_) {
                if (property === 'RotationIndicator') {
                    this.sourceBlock_.setOutput(true, "Vector2D");
                } else if (property === 'MoveIndicator') {
                    this.sourceBlock_.setOutput(true, "Vector3D");
                } else { // RollIndicator
                    this.sourceBlock_.setOutput(true, "Number");
                }
            }
        }), "PROPERTY");
    this.setOutput(true, "Vector3D");
    this.setColour(se_movement_colour);
    this.setTooltip("Возвращает сигналы управления от игрока, сидящего в кокпите.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector2d_create'] = {
  init: function() {
    this.appendValueInput("X").setCheck("Number").appendField("создать 2D-вектор с X");
    this.appendValueInput("Y").setCheck("Number").appendField("Y");
    this.setInputsInline(true);
    this.setOutput(true, "Vector2D");
    this.setColour(se_vector_colour_2d);
    this.setTooltip("Создает новый двумерный вектор (Vector2).");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector2d_get_component'] = {
  init: function() {
    this.appendValueInput("VECTOR").setCheck("Vector2D").appendField("из 2D-вектора");
    this.appendDummyInput().appendField("получить компонент")
        .appendField(new Blockly.FieldDropdown([["X", "X"],["Y", "Y"]]), "COMPONENT");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(se_vector_colour_2d);
    this.setTooltip("Возвращает значение одного из компонентов 2D-вектора.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_get_block_position'] = {
  init: function() {
    this.appendValueInput("BLOCK")
        .setCheck(null)
        .appendField("получить мировые координаты блока");
    this.setOutput(true, "Vector3D");
    this.setColour(se_main_colour); // Относится к общим свойствам блока
    this.setTooltip("Возвращает мировые координаты (Vector3D) центра блока.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_get_block_direction'] = {
  init: function() {
    this.appendValueInput("BLOCK")
        .setCheck(null)
        .appendField("у блока");
    this.appendDummyInput()
        .appendField("получить вектор направления")
        .appendField(new Blockly.FieldDropdown([
            ["вперед", "Forward"],
            ["назад", "Backward"],
            ["вверх", "Up"],
            ["вниз", "Down"],
            ["вправо", "Right"],
            ["влево", "Left"]
        ]), "DIRECTION");
    this.setOutput(true, "Vector3D");
    this.setColour(se_movement_colour); // Относится к ориентации и движению
    this.setTooltip("Возвращает мировой вектор, указывающий направление одной из шести сторон блока.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_gps_to_vector'] = {
  init: function() {
    this.appendValueInput("GPS_STRING")
        .setCheck("String")
        .appendField("преобразовать GPS-строку в вектор");
    this.setOutput(true, "Vector3D");
    this.setColour(se_vector_colour);
    this.setTooltip("Преобразует строку формата 'GPS:Имя:X:Y:Z:' в Vector3D. Вставляет код для безопасного парсинга.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector_distance'] = {
  init: function() {
    this.appendValueInput("VEC1").setCheck("Vector3D").appendField("расстояние между");
    this.appendValueInput("VEC2").setCheck("Vector3D").appendField("и");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(se_vector_colour);
    this.setTooltip("Вычисляет расстояние между двумя точками в пространстве.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector_normalize'] = {
  init: function() {
    this.appendValueInput("VECTOR").setCheck("Vector3D").appendField("нормализовать вектор");
    this.setOutput(true, "Vector3D");
    this.setColour(se_vector_colour);
    this.setTooltip("Преобразует вектор в вектор направления (длиной 1), сохраняя его направление.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector_dot_product'] = {
  init: function() {
    this.appendValueInput("VEC1").setCheck("Vector3D").appendField("скалярное произведение");
    this.appendValueInput("VEC2").setCheck("Vector3D").appendField("и");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(se_vector_colour);
    this.setTooltip("Вычисляет скалярное произведение двух векторов. Полезно для определения угла между ними.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_vector_math_op'] = {
  init: function() {
    this.appendValueInput("A").setCheck("Vector3D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
            ["+", "ADD"],
            ["-", "MINUS"],
            ["× (вектор)", "CROSS"],
            ["× (число)", "MULTIPLY"],
            ["÷ (число)", "DIVIDE"]
        ], function(operator) { // <-- ИСПРАВЛЕНО
            if (this.sourceBlock_) {
                if (operator === 'MULTIPLY' || operator === 'DIVIDE') {
                    this.sourceBlock_.getInput('B').setCheck('Number');
                } else { // ADD, MINUS, CROSS
                    this.sourceBlock_.getInput('B').setCheck('Vector3D');
                }
            }
        }), "OP");
    this.appendValueInput("B").setCheck("Vector3D"); // Начальное значение остается
    this.setOutput(true, "Vector3D");
    this.setColour(se_vector_colour);
    this.setTooltip("Выполняет математические операции над векторами.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['se_camera_raycast'] = {
  init: function() {
    this.jsonInit({
      "type": "se_camera_raycast",
      "message0": "камерой %1 просканировать на %2 м вперёд\n(с тангажом %3 и рысканием %4 градусов)",
      "args0": [
        { "type": "input_value", "name": "CAMERA", "check": "IMyCameraBlock" },
        { "type": "input_value", "name": "DISTANCE", "check": "Number", "align": "RIGHT" },
        { "type": "input_value", "name": "PITCH", "check": "Number", "align": "RIGHT" },
        { "type": "input_value", "name": "YAW", "check": "Number", "align": "RIGHT" }
      ],
      "inputsInline": true,  // <--- ИСПРАВЛЕНИЕ ЗДЕСЬ
      "output": "MyDetectedEntityInfo",
      "colour": "#9d5db0",
      "tooltip": "Выполняет сканирование (Raycast) из камеры. Возвращает информацию об обнаруженном объекте. Тангаж и рыскание - необязательные параметры для сканирования под углом.",
      "helpUrl": ""
    });
  }
};

Blockly.Blocks['se_camera_raycast_is_valid'] = {
  init: function() {
    this.jsonInit({
      "type": "se_camera_raycast_is_valid",
      "message0": "результат сканирования %1 содержит объект?",
      "args0": [
        { "type": "input_value", "name": "ENTITY_INFO", "check": "MyDetectedEntityInfo" }
      ],
      "output": "Boolean",
      "colour": "#9d5db0",
      "tooltip": "Проверяет, был ли обнаружен какой-либо объект в результате сканирования. Возвращает Истина, если объект найден.",
      "helpUrl": ""
    });
  }
};

Blockly.Blocks['se_camera_raycast_get_property'] = {
  init: function() {
    this.jsonInit({
      "type": "se_camera_raycast_get_property",
      "message0": "из результата сканирования %1 получить %2",
      "args0": [
        { "type": "input_value", "name": "ENTITY_INFO", "check": "MyDetectedEntityInfo" },
        {
          "type": "field_dropdown",
          "name": "PROPERTY",
          "options": [
            ["Имя", "Name"],
            ["Тип объекта", "Type"],
            ["Отношение", "Relationship"],
            ["Скорость (вектор)", "Velocity"],
            ["Позиция попадания (вектор)", "HitPosition"],
            ["ID объекта", "EntityId"]
          ]
        }
      ],
      "output": null,
      "colour": "#9d5db0",
      "tooltip": "Получает конкретное свойство из информации об обнаруженном объекте.",
      "helpUrl": "",
      "mutator": "se_camera_get_property_mutator"
    });
  }
};

Blockly.Extensions.registerMutator(
  'se_camera_get_property_mutator',
  {
    // --- ИСПРАВЛЕНИЕ: Добавляем хуки для сохранения/загрузки состояния ---

    /**
     * Создает объект с дополнительным состоянием для сохранения.
     * @returns {{property: string}} Объект состояния.
     */
    saveExtraState: function() {
      return {
        'property': this.getFieldValue('PROPERTY'),
      };
    },

    /**
     * Применяет сохраненное состояние к блоку.
     * @param {*} state Загруженное состояние.
     */
    loadExtraState: function(state) {
      this.setFieldValue(state['property'], 'PROPERTY');
      // После установки значения нужно обновить форму блока.
      this.updateShape_();
    },
    
    // --- Существующая логика обновления формы ---
    
    updateShape_: function() {
      const property = this.getFieldValue('PROPERTY');
      let outputType = null;
      switch (property) {
        case 'Name':
        case 'Type':
        case 'Relationship':
          outputType = 'String';
          break;
        case 'Velocity':
        case 'HitPosition':
          outputType = 'Vector3D';
          break;
        case 'EntityId':
          outputType = 'Number';
          break;
        default:
          break;
      }
      this.setOutput(true, outputType);
    },
    
    // onchange нужен для реагирования на действия пользователя в реальном времени
    onchange: function(event) {
        if (event.type === Blockly.Events.BLOCK_CHANGE && event.element === 'field' && event.name === 'PROPERTY' && event.blockId === this.id) {
            this.updateShape_();
        }
    }
  },
  function() {
    // Эта функция вызывается при инициализации блока (например, при перетаскивании из тулбокса).
    this.updateShape_();
  },
  ['se_camera_raycast_get_property']
);
