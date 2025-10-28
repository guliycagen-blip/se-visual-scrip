// src/console/components/InteractiveConsole.js

import React, { useState, useEffect, useRef } from 'react';
import './InteractiveConsole.css';
import { executeCode } from '../api';

const appVersion = process.env.REACT_APP_VERSION || '1.0';

const InteractiveConsole = ({ csharpCode }) => {
  const [history, setHistory] = useState([
    { type: 'response', text: `Консоль C# (перезагрузка). Версия ${appVersion}. Введите 'help' для списка команд.` }
  ]);
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (command) => {
    const newHistory = [...history, { type: 'command', text: command }];
    
    switch (command.toLowerCase()) {
      case 'help':
        setHistory([...newHistory, { type: 'response', text: "Доступные команды:\n  run   - скомпилировать и запустить код из редактора выше\n  clear - очистить консоль\n  help  - показать это сообщение\n  ver   - показать версию приложения" }]);
        break;
        
      case 'clear':
        setHistory([]);
        break;

      case 'ver':
         setHistory([...newHistory, { type: 'response', text: `Версия приложения: ${appVersion}` }]);
        break;

      case 'run':
        setIsExecuting(true);
        setHistory([...newHistory, { type: 'response', text: "Компиляция и запуск..." }]);
        
        const result = await executeCode(csharpCode);
        
        if (result.success) {
          const outputText = result.output.trim() === '' ? '[Программа завершилась без вывода]' : result.output;
          setHistory(prev => [...prev, { type: 'response', text: outputText }]);
        } else {
          setHistory(prev => [...prev, { type: 'error', text: `Ошибка выполнения:\n${result.error}` }]);
        }
        setIsExecuting(false);
        break;
        
      default:
        setHistory([...newHistory, { type: 'error', text: `Команда не найдена: ${command}` }]);
        break;
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isExecuting) {
      e.preventDefault();
      if (input.trim()) {
        handleCommand(input.trim());
      }
    }
  };

  return (
    <div className="interactive-console">
      <div className="console-code-display">
        <pre><code>{csharpCode}</code></pre>
      </div>

      <div className="console-runtime">
        <div className="console-output" ref={outputRef}>
          {history.map((item, index) => (
            <div key={index} className={`log-entry log-${item.type}`}>
              {item.type === 'command' && <span className="log-prompt">&gt;</span>}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <div className="console-input-container">
          <span>&gt;</span>
          <input
            type="text"
            className="console-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExecuting}
            placeholder={isExecuting ? 'Выполняется...' : 'Введите команду...'}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveConsole;