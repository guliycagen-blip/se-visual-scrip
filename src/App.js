// src/App.js

import React, { useRef, useState, useCallback, useMemo } from 'react';
import BlocklyComponent from './components/BlocklyComponent';
import CodeDisplay from './components/CodeDisplay';
import { ColorPickerModal } from './components/ColorPickerModal';
import FAQPage from './components/FAQPage';
import './App.css';

import ConsolePanel from './console/ConsolePanel';

// --- БЛОК ИНИЦИАЛИЗАЦИИ BLOCKLY ---
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import './fields/FieldReactColour.js';
import './blocks/se_blocks.js';
import './blocks/se_base_blocks.js';
import './blocks/console_blocks.js';
import './generator/csharp/console_generator.js';
import { seToolbox, consoleToolbox } from './toolboxConfig';
import { ERROR_MESSAGE_STRING } from './generator/standard_csharp_generator.js';
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
  const [showFaq, setShowFaq] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Копировать');
  const [mode, setMode] = useState('se');

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

  // --- ИЗМЕНЕНИЕ: Функция копирования заменена на версию без 'confirm' для исправления ошибки ESLint ---
  const handleCopyClick = () => {
    // Просто копируем код. Визуальные предупреждения на блоках и в коде уже информируют пользователя.
    navigator.clipboard.writeText(code)
      .then(() => {
        // Если в коде есть ошибка, кнопка покажет это, но код все равно скопируется.
        if (code.includes(ERROR_MESSAGE_STRING)) {
          setCopyButtonText('Скопировано с ошибками');
        } else {
          setCopyButtonText('Скопировано!');
        }
        
        // Возвращаем текст обратно через 2 секунды
        setTimeout(() => {
          setCopyButtonText('Копировать');
        }, 2000);
      })
      .catch(err => {
        console.error('Ошибка копирования: ', err);
        setCopyButtonText('Ошибка копирования!');
         setTimeout(() => {
          setCopyButtonText('Копировать');
        }, 2000);
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
           {mode === 'console' && <ConsolePanel csharpCode={code} />}
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