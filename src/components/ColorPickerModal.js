//src/components/ColorPickerModal.js

import React, { useState, useCallback } from 'react';
import { SketchPicker } from 'react-color';

const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  content: { position: 'relative', background: '#333', padding: '20px', borderRadius: '8px', zIndex: 1001 },
  closeButton: { position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }
};

export const ColorPickerModal = ({ initialColor, onColorChange, onClose }) => {
  const [color, setColor] = useState(initialColor);
  const handleChangeComplete = useCallback((newColor) => { setColor(newColor.hex); onColorChange(newColor.hex); }, [onColorChange]);
  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) { onClose(); } };
  return (
    <div style={modalStyles.overlay} onClick={handleOverlayClick}>
      <div style={modalStyles.content}>
        <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
        <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
      </div>
    </div>
  );
};