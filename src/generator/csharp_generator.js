// src/generator/csharp_generator.js

// 1. Импортируем уже созданный экземпляр из нашего нового файла
import { csharpGenerator } from './generator_instance.js';

// 2. Подключаем все остальные файлы, чтобы они "зарегистрировали" свои блоки.
// Это называется "импорт для побочных эффектов" (import for side effects).
// Мы не используем ничего из этих файлов напрямую здесь, но сам факт их импорта
// заставляет их код выполниться.
import './standard_csharp_generator.js';
import './se_csharp_generator.js';
import './se_csharp_base_generator.js';
import './csharp/console_generator.js';

// 3. Экспортируем генератор дальше, чтобы его можно было использовать в компонентах React
export { csharpGenerator };
// 2. Добавляем список зарезервированных слов.
csharpGenerator.RESERVED_WORDS_ =
    'abstract,as,base,bool,break,byte,case,catch,char,checked,class,const,continue,decimal,default,delegate,do,double,else,enum,event,explicit,extern,false,finally,fixed,float,for,foreach,goto,if,implicit,in,int,interface,internal,is,lock,long,namespace,new,null,object,operator,out,override,params,private,protected,public,readonly,ref,return,sbyte,sealed,short,sizeof,stackalloc,static,string,struct,switch,this,throw,true,try,typeof,uint,ulong,unchecked,unsafe,ushort,using,virtual,void,volatile,while,' +
    'var,dynamic,get,set,value,add,remove,yield,from,where,select,group,into,orderby,join,let,on,equals,by,ascending,descending,async,await,when';

// 3. Устанавливаем ВСЕ приоритеты операций, используемые в ваших генераторах.
csharpGenerator.ORDER_ATOMIC = 0;             // Константы, переменные
csharpGenerator.ORDER_MEMBER = 2;             // .Length, .Count
csharpGenerator.ORDER_FUNCTION_CALL = 2;      // myFunction()
csharpGenerator.ORDER_UNARY_NEGATION = 4.1;   // -x
csharpGenerator.ORDER_LOGICAL_NOT = 4.4;      // !x
csharpGenerator.ORDER_MULTIPLICATION = 5.1;   // *
csharpGenerator.ORDER_DIVISION = 5.2;         // /
csharpGenerator.ORDER_ADDITION = 6.1;         // +
csharpGenerator.ORDER_SUBTRACTION = 6.2;      // -
csharpGenerator.ORDER_RELATIONAL = 8;         // <, >, <=, >=
csharpGenerator.ORDER_EQUALITY = 9;           // ==, !=
csharpGenerator.ORDER_LOGICAL_AND = 13;       // &&
csharpGenerator.ORDER_LOGICAL_OR = 14;        // ||
csharpGenerator.ORDER_ASSIGNMENT = 16;        // =
csharpGenerator.ORDER_COMMA = 18;             // , (для аргументов функций)
csharpGenerator.ORDER_NONE = 99;              // Без скобок

csharpGenerator.init = function(workspace) {
  // Словарь для хранения определений функций
  csharpGenerator.definitions_ = Object.create(null);
  // База данных для безопасных имен переменных
  if (!csharpGenerator.variableDB_) {
    csharpGenerator.variableDB_ = new Blockly.Names(csharpGenerator.RESERVED_WORDS_);
  } else {
    csharpGenerator.variableDB_.reset();
  }
  csharpGenerator.variableDB_.setVariableMap(workspace.getVariableMap());
  // Сохраняем список всех переменных
  csharpGenerator.variables_ = workspace.getAllVariables();
};

csharpGenerator.finish = function(code) {
  // Этот метод вызывается в конце, но наша основная логика сборки
  // находится в блоке se_program_structure для полного контроля над результатом.
  const definitions = Object.values(csharpGenerator.definitions_);
  // Если есть какие-то глобальные определения (например, функции), они будут добавлены.
  // В нашем случае, se_program_structure сам управляет этим.
  return definitions.join('\n\n') + '\n\n' + code;
};

csharpGenerator.scrub_ = function(block, code, thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = thisOnly ? '' : csharpGenerator.blockToCode(nextBlock);
  return code + nextCode;
};

csharpGenerator.quote_ = function(string) {
  if (string == null) return '""';
  string = string.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
  return '"' + string + '"';
};

