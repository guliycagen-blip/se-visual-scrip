// src/generator/console_csharp_generator.js

// 1. Импортируем "чистый" экземпляр генератора.
import { csharpGenerator } from './generator_instance.js';

// 2. Импортируем ОБЪЕКТЫ с наборами генераторов.
import { consoleStandardGenerators } from './console_standard_csharp_generator.js';
import { consoleGenerators } from './csharp/console_generator.js';

// 3. Создаем функцию-настройщик, которая ИЗОЛИРУЕТ этот режим.
export function setupConsoleGenerator() {
  // Собираем все наши генераторы в один объект
  const allConsoleGenerators = {
    ...consoleStandardGenerators,
    ...consoleGenerators
  };

  // Очищаем любые старые генераторы, оставшиеся от другого режима (например, SE)
  csharpGenerator.forBlock = Object.create(null);

  // Привязываем и регистрируем каждый НАШ генератор
  for (const blockName in allConsoleGenerators) {
    const originalFunction = allConsoleGenerators[blockName];
    csharpGenerator.forBlock[blockName] = originalFunction.bind(csharpGenerator);
  }

  // --- НОВОЕ ДОПОЛНЕНИЕ: ОТКЛЮЧАЕМ АВТОМАТИЧЕСКОЕ ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ ---
  // Мы переопределяем стандартный метод 'finish'.
  // Теперь он просто возвращает код как есть, не добавляя в начало `object a;`.
  // Всю работу по объявлению переменных теперь выполняет наш блок `program_main`.
  csharpGenerator.finish = function(code) {
    return code;
  };
  // --- КОНЕЦ ДОПОЛНЕНИЯ ---
}

// 4. По-прежнему экспортируем сам экземпляр для использования в компоненте
export { csharpGenerator };