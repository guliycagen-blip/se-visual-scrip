// src/console_app/components/ConsoleBlocklyComponent.js

import React, { useEffect, useRef } from 'react';
// --- ИЗМЕНЕНИЕ 1: Импортируем из 'blockly/core', как в рабочем компоненте ---
import * as Blockly from 'blockly/core'; 
import { csharpGenerator } from '../../generator/generator_instance';

// --- ИЗМЕНЕНИЕ 2: Импортируем нужные нам блоки напрямую ---
import 'blockly/blocks';
import '../../blocks/console_blocks';
import * as Ru from 'blockly/msg/ru';
Blockly.setLocale(Ru);


const ConsoleBlocklyComponent = ({ initialXml, toolbox, onCodeChange }) => {
  const blocklyDivRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (!blocklyDivRef.current) return;

    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: toolbox,
      media: 'media/',
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
    });
    workspaceRef.current = workspace;

    const dom = Blockly.utils.xml.textToDom(initialXml);
    // --- ИЗМЕНЕНИЕ 3: Используем старый API 'Blockly.Xml', как в рабочем компоненте ---
    Blockly.Xml.domToWorkspace(dom, workspace);

    const updateCode = () => {
      const code = csharpGenerator.workspaceToCode(workspace);
      onCodeChange(code);
    };

    workspace.addChangeListener(updateCode);
    updateCode();

    return () => {
      workspace.dispose();
    };
  }, [initialXml, toolbox, onCodeChange]);

  return <div ref={blocklyDivRef} style={{ height: '100%', width: '100%' }} />;
};

export default ConsoleBlocklyComponent;