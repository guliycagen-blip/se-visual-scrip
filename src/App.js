// src/App.js

import React, { useRef, useState, useCallback } from 'react';
import BlocklyComponent from './components/BlocklyComponent';
import CodeDisplay from './components/CodeDisplay';
import { ColorPickerModal } from './components/ColorPickerModal';
import FAQPage from './components/FAQPage';
import './App.css';

// ИЗМЕНЕНИЕ 1: Импортируем ConsoleView из новой, правильной папки
import ConsoleView from './console/ConsoleView';

// ... импорты Blockly, seToolbox и т.д. остаются без изменений ...
import * as Blockly from 'blockly/core';
import { seToolbox } from './toolboxConfig';
import { ERROR_MESSAGE_STRING } from './generator/standard_csharp_generator.js';

const SE_INITIAL_XML =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '  <block type="se_program_structure" deletable="false" movable="false" x="50" y="50"></block>' +
  '</xml>';

function App() {
  const [code, setCode] = useState('');
  const blocklyComponentRef = useRef(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [pickerInitialColor, setPickerInitialColor] = useState('#ffffff');
  const [pickerCallback, setPickerCallback] = useState(null);
  const [showFaq, setShowFaq] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Копировать');
  
  const [showConsoleMode, setShowConsoleMode] = useState(false);

  // ... остальная часть вашего кода (функции openColorPicker, handleCopyClick и т.д.) ...
  const toolbox = seToolbox;
  const initialXml = SE_INITIAL_XML;
  const mode = 'se';

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

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        if (code.includes(ERROR_MESSAGE_STRING)) {
          setCopyButtonText('Скопировано с ошибками');
        } else {
          setCopyButtonText('Скопировано!');
        }
        setTimeout(() => setCopyButtonText('Копировать'), 2000);
      })
      .catch(err => {
        console.error('Ошибка копирования: ', err);
        setCopyButtonText('Ошибка копирования!');
         setTimeout(() => setCopyButtonText('Копировать'), 2000);
      });
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
  
  if (showFaq) {
    return <FAQPage onBack={() => setShowFaq(false)} />;
  }
  
  // ИЗМЕНЕНИЕ 2: Используем ConsoleView вместо ConsoleApp
  if (showConsoleMode) {
    return <ConsoleView onExit={() => setShowConsoleMode(false)} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>SE Blockly V2</h1>
        <div className="mode-switcher">
          <button className="active">
            Скрипты Space Engineers
          </button>
          <button onClick={() => setShowConsoleMode(true)}>
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
            toolbox={toolbox}
            initialXml={initialXml}
            key={mode} 
          />
        </div>
        <div className="code-wrapper">
          <div className="code-header">
            <h2>Сгенерированный код C#</h2>
            {code && (
              <button onClick={handleCopyClick} className="copy-button">
                {copyButtonText}
              </button>
            )}
          </div>
          <CodeDisplay code={code} />
        </div>
      </div>
      <div className="buttons-panel">
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={handleLoad}>Загрузить</button>
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
