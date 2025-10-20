// /src/api.js

export const executeCode = async (code) => {
    try {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Лог ошибки в консоли браузера важен для отладки фронтенда
            console.error("API Error: Сервер вернул ошибку:", responseData);
            return { success: false, error: responseData.details || responseData.error };
        }

        return { success: true, output: responseData.output };

    } catch (error) {
        // Лог критической ошибки (сеть, CORS и т.д.) также важен
        console.error("API Critical Error: Ошибка при выполнении запроса!", error);
        return { success: false, error: error.message || 'Не удалось связаться с сервером.' };
    }
};