// backend/server.js

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/execute', (req, res) => {
    const { code } = req.body;
    if (!code) {
        // Оставляем лог для критической ошибки на стороне сервера
        console.error('Ошибка 400: Запрос не содержит код для выполнения.');
        return res.status(400).json({ error: 'Код для выполнения не предоставлен' });
    }

    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const fileName = `Program_${Date.now()}`;
    const csFilePath = path.join(tempDir, `${fileName}.cs`);
    const exeFilePath = path.join(tempDir, `${fileName}.exe`);

    fs.writeFile(csFilePath, code, { encoding: 'utf8' }, (err) => {
        if (err) {
            console.error('Ошибка записи файла:', err);
            return res.status(500).json({ error: 'Ошибка сервера при записи файла', details: err.message });
        }

        const compileCommand = `csc /utf8output -out:"${exeFilePath}" "${csFilePath}"`;

        exec(compileCommand, (compileError, stdout, stderr) => {
            // Всегда удаляем исходный .cs файл
            fs.unlink(csFilePath, () => {});

            if (compileError || stderr) {
                console.error('Ошибка компиляции (stderr):', stderr);
                if(compileError) console.error('Объект ошибки компиляции:', compileError);
                // Если .exe создался несмотря на ошибку, удаляем его
                fs.unlink(exeFilePath, () => {}); 
                return res.status(400).json({ error: 'Ошибка компиляции', details: stderr || compileError.message });
            }

            exec(`"${exeFilePath}"`, (runError, runStdout, runStderr) => {
                // Всегда удаляем .exe файл после выполнения
                fs.unlink(exeFilePath, () => {});

                if (runError || runStderr) {
                    console.error('Ошибка выполнения .exe:', runError || runStderr);
                    return res.status(500).json({ error: 'Ошибка во время выполнения программы', details: runStderr || runError.message });
                }

                res.json({ output: runStdout });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});