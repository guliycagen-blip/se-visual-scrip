// src/generator/csharp_generator.js // 

// 1. Импортируем уже созданный экземпляр из нашего нового файла
import { csharpGenerator } from './generator_instance.js';

// 2. Подключаем все остальные файлы, чтобы они "зарегистрировали" свои блоки.
// Это называется "импорт для побочных эффектов" (import for side effects).
// Мы не используем ничего из этих файлов напрямую здесь, но сам факт их импорта
// заставляет их код выполниться.
import './standard_csharp_generator.js';

import './csharp/console_generator.js';

import './se_csharp_generator.js';
import './se_csharp_base_generator.js';
import './csharp/console_generator.js';

// 3. Экспортируем генератор дальше, чтобы его можно было использовать в компонентах React
export { csharpGenerator };