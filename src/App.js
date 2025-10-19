// src/App.js

import React, { useRef, useState, useCallback, useMemo } from 'react';
import BlocklyComponent from './components/BlocklyComponent';
import CodeDisplay from './components/CodeDisplay';
import { ColorPickerModal } from './components/ColorPickerModal';
import FAQPage from './components/FAQPage'; // Убедитесь, что этот компонент создан
import './App.css';

import ConsolePanel from './console/ConsolePanel';


// --- БЛОК ИНИЦИАЛИЗАЦИИ BLOCKLY ---
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import './fields/FieldReactColour.js';
import './blocks/se_blocks.js';
import './blocks/se_base_blocks.js';
import './blocks/console_blocks.js'; // --- ИЗМЕНЕНИЕ: Добавлен импорт новых блоков
import './generator/csharp/console_generator.js'; // --- ИЗМЕНЕНИЕ: Добавлен импорт нового генератора
import { seToolbox, consoleToolbox } from './toolboxConfig';
import * as Ru from 'blockly/msg/ru';

Blockly.setLocale(Ru);
// --- КОНЕЦ БЛОКА ИНИЦИАЛИЗАЦИИ ---



const SE_INITIAL_XML =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '  <block type="se_program_structure" deletable="false" movable="false" x="50" y="50"></block>' +
  '</xml>';
const CONSOLE_INITIAL_XML =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '  <block type="program_main" deletable="false" movable="false" x="50" y="50"></block>' +
  '</xml>';



function App() {
  const [code, setCode] = useState('');
  const blocklyComponentRef = useRef(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [pickerInitialColor, setPickerInitialColor] = useState('#ffffff');
  const [pickerCallback, setPickerCallback] = useState(null);
  const [showFaq, setShowFaq] = useState(false); // Состояние для показа FAQ

  const [mode, setMode] = useState('se'); // 'se' или 'console'

  // --- ИЗМЕНЕНИЕ: "Умный калькулятор", который выбирает нужные настройки в зависимости от режима
  const { toolbox, initialXml } = useMemo(() => {
    if (mode === 'se') {
      return { toolbox: seToolbox, initialXml: SE_INITIAL_XML };
    } else {
      return { toolbox: consoleToolbox, initialXml: CONSOLE_INITIAL_XML };
    }
  }, [mode]);

  const openColorPicker = useCallback((initialColor, callback) => {
    setPickerInitialColor(initialColor);
    setPickerCallback(() => callback);
    setPickerOpen(true);
  }, []);

  const handleColorChange = (newColor) => {
    if (pickerCallback) {
      pickerCallback(newColor);
    }
  };

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code)
        .then(() => alert('Код скопирован в буфер обмена!'))
        .catch(err => console.error('Ошибка копирования: ', err));
    }
  };

  const handleSave = () => {
    if (blocklyComponentRef.current) {
      const xml = blocklyComponentRef.current.getWorkspaceXml();
      localStorage.setItem(`blocklyWorkspace_${mode}`, xml);
      alert(`Рабочая область для режима "${mode}" сохранена!`);
    }
  };

  const handleLoad = () => {
    if (blocklyComponentRef.current) {
      const xml = localStorage.getItem(`blocklyWorkspace_${mode}`);
      if (xml) {
        blocklyComponentRef.current.loadWorkspaceXml(xml);
        alert(`Рабочая область для режима "${mode}" загружена!`);
      } else {
        alert('Сохраненная рабочая область для этого режима не найдена.');
      }
    }
  };
  
  // --- ИЗМЕНЕНИЕ 1: Добавляем условный рендеринг ---
  if (showFaq) {
    // Если showFaq равно true, показываем только страницу FAQ
    // и передаем ей функцию для возврата назад
    return <FAQPage onBack={() => setShowFaq(false)} />;
  }

  // В противном случае, показываем основной интерфейс редактора
  return (
    <div className="App">
      <header className="app-header">
        <h1>SE Blockly V2</h1>
        <div className="mode-switcher">
          <button className={mode === 'se' ? 'active' : ''} onClick={() => setMode('se')}>
            Скрипты Space Engineers
          </button>
          <button className={mode === 'console' ? 'active' : ''} onClick={() => setMode('console')}>
            Консольная программа C#
          </button>
        </div>
      </header>
      <div className="main-container">
        <div className="blockly-wrapper">
          <BlocklyComponent
            ref={blocklyComponentRef}
            onCodeChange={setCode}
            openReactColourPicker={openColorPicker}
            // --- ИЗМЕНЕНИЕ: Используем динамические пропсы ---
            toolbox={toolbox}
            initialXml={initialXml}
            // --- ИЗМЕНЕНИЕ: Ключ для полной перезагрузки Blockly при смене режима ---
            key={mode}
          />
        </div>
        <div className="code-wrapper">
          <div className="code-header">
            <h2>Сгенерированный код C#</h2>
            {code && (<button onClick={copyToClipboard} className="copy-button">Копировать</button>)}
          </div>
          <CodeDisplay code={code} />
           {mode === 'console' && <ConsolePanel csharpCode={code} />}
        </div>
      </div>
      <div className="buttons-panel">
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={handleLoad}>Загрузить</button>
        {/* --- ИЗМЕНЕНИЕ 2: Кнопка теперь переключает состояние --- */}
        <button onClick={() => setShowFaq(true)}>Справка (FAQ)</button>
      </div>

      {isPickerOpen && (
        <ColorPickerModal
          initialColor={pickerInitialColor}
          onColorChange={handleColorChange}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

export default App;