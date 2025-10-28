// backend/server.js

const express = require('express');
const cors = require('cors');
// --- ИЗМЕНЕНИЕ 1: Импортируем 'spawn' вместо (или вместе с) 'exec' ---
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/execute', (req, res) => {
    console.log(`\n--- ${new Date().toISOString()} --- ПОЛУЧЕН ЗАПРОС /api/execute ---`);

    const { code, input } = req.body;
    const userInput = (input || '') + '\r\n';

    if (!code) {
        return res.status(400).json({ error: 'Код для выполнения не предоставлен' });
    }

    console.log('Подготовлен ввод для программы:', JSON.stringify(userInput));
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileName = `Program_${Date.now()}`;
    const csFilePath = path.join(tempDir, `${fileName}.cs`);
    const exeFilePath = path.join(tempDir, `${fileName}.exe`);

    fs.writeFile(csFilePath, code, { encoding: 'utf8' }, (err) => {
        if (err) {
            console.error('!!! ОШИБКА ЗАПИСИ ФАЙЛА:', err);
            return res.status(500).json({ error: 'Ошибка сервера при записи файла', details: err.message });
        }
        
        console.log(`ЭТАП 2: Файл записан. Запуск компиляции...`);
        const compileCommand = `csc /utf8output -out:"${exeFilePath}" "${csFilePath}"`;

        exec(compileCommand, (compileError, stdout, stderr) => {
            console.log('ЭТАП 3: Компиляция завершена.');
            if (compileError || stderr) {
                console.error('!!! ОШИБКА ЭТАПА 3: Ошибка компиляции.', stderr || compileError);
                return res.status(400).json({ error: 'Ошибка компиляции', details: stderr || compileError.message });
            }

            console.log(`ЭТАП 4: Компиляция успешна. Запуск .exe через SPAWN...`);

            // --- ИЗМЕНЕНИЕ 2: Заменяем 'exec' на 'spawn' для запуска .exe ---
            const runProcess = spawn(`"${exeFilePath}"`, [], { shell: true });

            let runStdout = '';
            let runStderr = '';
            let timedOut = false;

            const timeoutId = setTimeout(() => {
                timedOut = true;
                runProcess.kill('SIGTERM'); // Убиваем процесс по таймауту
                console.error('!!! ОШИБКА ЭТАПА 5: Процесс убит по таймауту (5 секунд).');
                res.status(500).json({ error: 'Ошибка выполнения: программа работала слишком долго.', details: 'Это часто происходит, если программа ожидает больше вводимых данных, чем было предоставлено.' });
            }, 5000);

            // Собираем данные из стандартного вывода
            runProcess.stdout.on('data', (data) => {
                runStdout += data.toString();
            });

            // Собираем данные из потока ошибок
            runProcess.stderr.on('data', (data) => {
                runStderr += data.toString();
            });
            
            // Обрабатываем ошибки запуска самого процесса
            runProcess.on('error', (runError) => {
                if(timedOut) return;
                clearTimeout(timeoutId);
                console.error('!!! ОШИБКА ЭТАПА 4: Не удалось запустить процесс.', runError);
                res.status(500).json({ error: 'Не удалось запустить скомпилированную программу', details: runError.message });
            });

            // Когда процесс завершился, отправляем ответ
            runProcess.on('close', (code) => {
                if(timedOut) return; // Если уже отправили ответ по таймауту, ничего не делаем
                clearTimeout(timeoutId);
                console.log(`ЭТАП 5: Процесс завершился с кодом ${code}.`);

                if (runStderr) {
                     console.error('Поток stderr не пустой:', runStderr);
                }

                if (code !== 0) {
                    return res.status(500).json({ error: 'Программа завершилась с ошибкой', details: runStderr || `Код выхода: ${code}` });
                }

                console.log('ЭТАП 6: Отправка успешного ответа клиенту.');
                res.json({ output: runStdout });
            });
            
            // --- КРИТИЧЕСКИ ВАЖНЫЙ ШАГ ---
            // 1. Отправляем наши данные в стандартный поток ввода процесса
            runProcess.stdin.write(userInput);
            // 2. Закрываем поток, сигнализируя, что больше данных не будет
            runProcess.stdin.end();
        });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});