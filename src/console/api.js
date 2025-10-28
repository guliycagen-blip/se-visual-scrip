// src/console/api.js

/**
 * Отправляет C# код и входные данные на бэкенд.
 * @param {string} csharpCode Код для выполнения.
 * @param {string} inputData Текст для стандартного потока ввода (stdin).
 * @returns {Promise<{success: boolean, output?: string, error?: string}>}
 */
export const executeCode = async (csharpCode, inputData) => { // Добавлен параметр inputData
  try {
    const response = await fetch('http://localhost:5000/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Упаковываем и код, и входные данные
      body: JSON.stringify({ code: csharpCode, input: inputData }), 
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.details || result.error || `Сервер вернул ошибку ${response.status}`,
      };
    }

    return { success: true, output: result.output };

  } catch (error) {
    console.error('Ошибка при отправке запроса на сервер:', error);
    return {
      success: false,
      error: 'Не удалось подключиться к серверу. Убедитесь, что он запущен.',
    };
  }
};