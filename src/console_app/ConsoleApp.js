// src/console_app/ConsoleApp.js

import React, { useState } from 'react';
import './ConsoleApp.css';

// --- БЛОК ИНИЦИАЛИЗАЦИИ УДАЛЕН ---
// Остались только импорты, которые мы используем напрямую в коде компонента.
import * as Blockly from 'blockly/core';
import { consoleToolbox } from '../toolboxConfig';
import ConsoleBlocklyComponent from './components/ConsoleBlocklyComponent';
import ConsoleCodeDisplay from './components/ConsoleCodeDisplay';
import ConsolePanel from '../console/ConsolePanel';

const CONSOLE_INITIAL_XML =
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  '  <block type="program_main" deletable="false" movable="false" x="50" y="50"></block>' +
  '</xml>';

function ConsoleApp({ onExit }) {
  // ... весь остальной код компонента ConsoleApp остается без изменений ...
  const [code, setCode] = useState('');

  return (
    <div className="ConsoleApp">
      <header className="console-header">
        <h1>Режим: Консольная программа C#</h1>
        <button className="back-button" onClick={onExit}>
          Вернуться к Space Engineers
        </button>
      </header>
      <div className="console-main-container">
        <div className="console-blockly-wrapper">
          <ConsoleBlocklyComponent
            initialXml={CONSOLE_INITIAL_XML}
            toolbox={consoleToolbox}
            onCodeChange={setCode}
          />
        </div>
        <div className="console-code-wrapper">
          <ConsoleCodeDisplay code={code} />
          <ConsolePanel csharpCode={code} />
        </div>
      </div>
    </div>
  );
}

export default ConsoleApp;