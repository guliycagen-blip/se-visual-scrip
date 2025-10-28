// src/console/ConsoleView.js

import React, { useState, useCallback } from 'react';
import CodeDisplay from '../components/CodeDisplay';
import { ColorPickerModal } from '../components/ColorPickerModal';
import { executeCode } from './api';
import './ConsoleView.css';
import ConsoleBlocklyComponent from './components/ConsoleBlocklyComponent';
import { consoleToolbox } from './consoleToolbox.js';

const CONSOLE_INITIAL_XML =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '  <block type="program_main" deletable="false" movable="false" x="50" y="50"></block>' +
  '</xml>';

function ConsoleView({ onExit }) {
  const [code, setCode] = useState('');
  // --- ИЗМЕНЕНИЕ 1: Добавляем состояние для входных данных консоли ---
  const [consoleInput, setConsoleInput] = useState('');
  const [output, setOutput] = useState("Консоль C# (перезагрузка).");
  const [isRunning, setIsRunning] = useState(false);
  
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [pickerInitialColor, setPickerInitialColor] = useState('#ffffff');
  const [pickerCallback, setPickerCallback] = useState(null);

  const openColorPicker = useCallback((initialColor, callback) => {
    setPickerInitialColor(initialColor);
    setPickerCallback(() => callback);
    setPickerOpen(true);
  }, []);

  const handleRun = async () => {
    if (!code || isRunning) return;
    setIsRunning(true);
    setOutput('Компиляция и запуск...');
    // --- ИЗМЕНЕНИЕ 2: Передаем входные данные в API ---
    const result = await executeCode(code, consoleInput); 
    if (result.success) {
      setOutput(result.output || '[Программа завершилась без вывода]');
    } else {
      setOutput(`Ошибка: ${result.error}`);
    }
    setIsRunning(false);
  };

  return (
    <div className="console-app">
      <header className="console-header">
        <h1>Режим Консольной Программы C#</h1>
        <button onClick={onExit} className="exit-button">Выйти</button>
      </header>
      <div className="main-container">
        <div className="blockly-wrapper">
          <ConsoleBlocklyComponent
            onCodeChange={setCode}
            openReactColourPicker={openColorPicker}
            toolbox={consoleToolbox}
            initialXml={CONSOLE_INITIAL_XML}
            key="console_mode"
          />
        </div>
        <div className="right-panel">
          <div className="code-wrapper">
            <div className="code-header">
              <h2>Сгенерированный код C#</h2>
            </div>
            <CodeDisplay code={code} />
          </div>
          {/* --- ИЗМЕНЕНИЕ 3: Оборачиваем консоль и добавляем поле ввода --- */}
          <div className="console-area">
            <div className="console-header-bar">
                <span>Входные данные для Console.ReadLine()</span>
            </div>
            <textarea
              className="console-input-area"
              value={consoleInput}
              onChange={(e) => setConsoleInput(e.target.value)}
              placeholder="Введите сюда текст, который будет прочитан командой 'прочитать строку...'. Каждая строка - отдельный вызов."
            />
            <div className="console-header-bar">
                <span>Консоль вывода</span>
                <button onClick={handleRun} disabled={isRunning} className="run-button">
                    {isRunning ? 'Выполнение...' : 'Запустить (run)'}
                </button>
            </div>
            <pre className="console-output">{output}</pre>
          </div>
        </div>
      </div>
      {isPickerOpen && (
        <ColorPickerModal
          initialColor={pickerInitialColor}
          onColorChange={(newColor) => pickerCallback && pickerCallback(newColor)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

export default ConsoleView;