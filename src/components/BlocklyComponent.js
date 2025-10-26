// src/components/BlocklyComponent.js
// BlocklyComponent.js

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as Blockly from 'blockly/core';

// 1. Импортируем ЕДИНЫЙ, уже полностью настроенный генератор.
import { csharpGenerator } from '../generator/csharp_generator';

// 2. Импортируем ВСЕ определения блоков (стандартные, SE, SE Base),
// чтобы Blockly знал о них при рендеринге.
import 'blockly/blocks';
import '../blocks/se_blocks';
import '../blocks/se_base_blocks';
import * as Ru from 'blockly/msg/ru';
Blockly.setLocale(Ru);

const BlocklyComponent = forwardRef(({ onCodeChange, openReactColourPicker, toolbox, initialXml }, ref) => {
    const blocklyDiv = useRef(null);
    const primaryWorkspace = useRef(null);
    const onCodeChangeRef = useRef(onCodeChange);
    const openPickerRef = useRef(openReactColourPicker);

    useEffect(() => {
        onCodeChangeRef.current = onCodeChange;
    }, [onCodeChange]);

    useEffect(() => {
        openPickerRef.current = openReactColourPicker;
    }, [openReactColourPicker]);

    useImperativeHandle(ref, () => ({
        getWorkspaceXml() {
            if (!primaryWorkspace.current) return '';
            const xml = Blockly.Xml.workspaceToDom(primaryWorkspace.current);
            return Blockly.Xml.domToText(xml);
        },
        loadWorkspaceXml(xmlText) {
            if (!primaryWorkspace.current) return;
            primaryWorkspace.current.clear();
            try {
                const xml = Blockly.utils.xml.textToDom(xmlText);
                Blockly.Xml.domToWorkspace(xml, primaryWorkspace.current);
            } catch (e) {
                console.error("Ошибка при загрузке XML рабочей области:", e);
                alert('Не удалось загрузить данные. Возможно, они повреждены.');
            }
        }
    }));

    useEffect(() => {
        if (primaryWorkspace.current || !blocklyDiv.current) {
            return;
        }

        const workspace = Blockly.inject(blocklyDiv.current, {
            toolbox: toolbox,
            renderer: 'zelos',
            theme: Blockly.Themes.Dark,
            grid: { spacing: 25, length: 3, colour: '#555', snap: true },
            zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
        });
        primaryWorkspace.current = workspace;

        if (initialXml) {
            try {
                const xml = Blockly.utils.xml.textToDom(initialXml);
                Blockly.Xml.domToWorkspace(xml, workspace);
            } catch (e) {
                console.error("Ошибка при загрузке начального XML:", e);
            }
        }

        workspace.openReactColourPicker = (initialColor, callback) => {
            if (openPickerRef.current) {
                openPickerRef.current(initialColor, callback);
            }
        };

        const updateCode = () => {
            try {
                // Перезапускаем init, чтобы обновить список переменных перед каждой генерацией
                csharpGenerator.init(workspace); 
                
                const code = csharpGenerator.workspaceToCode(workspace);
                if (onCodeChangeRef.current) {
                    onCodeChangeRef.current(code);
                }
            } catch (e) {
                console.error("Ошибка при генерации кода:", e);
            }
        };

        workspace.addChangeListener((event) => {
            if (event.isUiEvent || event.type === Blockly.Events.FINISHED_LOADING) return;
            updateCode();
        });
        
        // Генерируем код при первой загрузке
        updateCode();

        return () => {
            workspace.dispose();
            primaryWorkspace.current = null;
        };
    }, [initialXml, toolbox]);

    return <div ref={blocklyDiv} style={{ height: '100%', width: '100%' }} />;
});

export default BlocklyComponent;