// backend/server.js - КРОССПЛАТФОРМЕННАЯ ВЕРСИЯ

const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Превращаем fs.rm в асинхронную функцию
const rmAsync = util.promisify(fs.rm);

const app = express();
// SpaceWeb выдаст порт в переменной окружения, или используем 5000 для локальной разработки
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/execute', async (req, res) => {
    console.log(`\n--- ${new Date().toISOString()} --- ПОЛУЧЕН ЗАПРОС /api/execute ---`);
    const { code, input } = req.body;
    const userInput = (input || '') + '\n'; // Для Linux достаточно '\n'

    const uniqueId = `build_${Date.now()}`;
    const buildDir = path.join(__dirname, 'temp', uniqueId);

    try {
        // 1. Создаем временную папку для сборки
        await fs.promises.mkdir(buildDir, { recursive: true });
        console.log(`ЭТАП 1: Создана папка ${buildDir}`);

        // 2. Записываем файлы во временную папку
        const csFilePath = path.join(buildDir, 'Program.cs');
        const csprojFilePath = path.join(buildDir, 'Project.csproj');
        await fs.promises.writeFile(csFilePath, code, 'utf8');
        await fs.promises.copyFile(path.join(__dirname, 'template.csproj'), csprojFilePath);
        console.log(`ЭТАП 2: Файлы .cs и .csproj записаны.`);

        // 3. Компилируем с помощью dotnet
        const compileCommand = `dotnet publish -c Release -r linux-x64 --self-contained true -p:PublishSingleFile=true`;
        console.log(`ЭТАП 3: Запуск компиляции: ${compileCommand}`);
        
        await new Promise((resolve, reject) => {
            exec(compileCommand, { cwd: buildDir }, (err, stdout, stderr) => {
                if (err) {
                    console.error('!!! ОШИБКА КОМПИЛЯЦИИ:', stderr);
                    return reject({ status: 400, message: 'Ошибка компиляции', details: stderr });
                }
                console.log(stdout);
                resolve();
            });
        });

        console.log(`ЭТАП 4: Компиляция успешна. Запуск приложения...`);
        // Путь к исполняемому файлу после публикации
        const exePath = path.join(buildDir, 'bin/Release/net8.0/linux-x64/publish/Project');

        // 4. Запускаем скомпилированный файл через spawn
        const runProcess = spawn(exePath, [], { shell: false });
        
        let runStdout = '';
        let runStderr = '';
        let timedOut = false;
        let responseSent = false;

        const timeoutId = setTimeout(() => {
            timedOut = true;
            if (!responseSent) {
                responseSent = true;
                runProcess.kill('SIGTERM');
                console.error('!!! ОШИБКА ЭТАПА 5: Таймаут выполнения (5 секунд).');
                res.status(500).json({ error: 'Программа работала слишком долго' });
            }
        }, 5000);

        runProcess.stdout.on('data', data => { runStdout += data.toString(); });
        runProcess.stderr.on('data', data => { runStderr += data.toString(); });

        runProcess.on('close', code => {
            clearTimeout(timeoutId);
            if (timedOut || responseSent) return;
            responseSent = true;

            console.log(`ЭТАП 5: Процесс завершился с кодом ${code}.`);
            if (code !== 0 || runStderr) {
                res.status(500).json({ error: 'Ошибка выполнения программы', details: runStderr });
            } else {
                res.json({ output: runStdout });
            }
        });

        runProcess.on('error', err => {
            clearTimeout(timeoutId);
            if (timedOut || responseSent) return;
            responseSent = true;
            console.error('!!! ОШИБКА ЗАПУСКА ПРОЦЕССА:', err);
            res.status(500).json({ error: 'Не удалось запустить программу', details: err.message });
        });

        runProcess.stdin.write(userInput);
        runProcess.stdin.end();

    } catch (error) {
        console.error('Критическая ошибка в обработчике:', error);
        if (!res.headersSent) {
            res.status(error.status || 500).json({ error: error.message, details: error.details || '' });
        }
    } finally {
        // 5. Очищаем временную папку
        console.log(`ЭТАП 6: Очистка папки ${buildDir}`);
        await rmAsync(buildDir, { recursive: true, force: true });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});