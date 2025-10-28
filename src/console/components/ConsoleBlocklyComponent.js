// src/console/components/ConsoleBlocklyComponent.js

import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import * as Ru from 'blockly/msg/ru';

// --- ШАГ 1: Импортируем ОПРЕДЕЛЕНИЯ блоков ---
import '../../blocks/console_blocks';

// --- ШАГ 2: Импортируем НАШУ СИСТЕМУ ИЗОЛЯЦИИ РЕЖИМОВ ---
// Этот единственный импорт дает нам и настроенный генератор, и функцию для его активации.
import { csharpGenerator, setupConsoleGenerator } from '../../generator/console_csharp_generator';

Blockly.setLocale(Ru);

const ConsoleBlocklyComponent = ({ initialXml, toolbox, onCodeChange }) => {
  const blocklyDivRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    // --- ШАГ 3: АКТИВИРУЕМ РЕЖИМ КОНСОЛИ ---
    // Этот вызов очищает генератор от любых "чужих" блоков (например, от режима SE)
    // и загружает в него ТОЛЬКО те, что нужны для консоли.
    setupConsoleGenerator();

    if (!blocklyDivRef.current) return;

    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: toolbox,
      media: 'media/',
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
    });
    workspaceRef.current = workspace;
    
    workspace.clear();
    const dom = Blockly.utils.xml.textToDom(initialXml);
    Blockly.Xml.domToWorkspace(dom, workspace);

    const updateCode = () => {
      // Теперь мы используем csharpGenerator, который был 100% настроен для консоли
      csharpGenerator.init(workspace);
      const code = csharpGenerator.workspaceToCode(workspace);
      onCodeChange(code);
    };

    workspace.addChangeListener(updateCode);
    updateCode(); // Первоначальная генерация кода

    return () => {
      workspace.dispose();
    };
  }, [initialXml, toolbox, onCodeChange]);

  return <div ref={blocklyDivRef} style={{ height: '100%', width: '100%' }} />;
};

export default ConsoleBlocklyComponent;