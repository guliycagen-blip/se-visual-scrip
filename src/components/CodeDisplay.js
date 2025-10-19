import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeDisplay = ({ code }) => {
  return (
    <SyntaxHighlighter 
      language="csharp" 
      style={atomDark}
      customStyle={{ 
        width: '100%', 
        height: '100%', 
        margin: 0, 
        padding: '1em',
        boxSizing: 'border-box',
        overflow: 'auto'
      }}
      codeTagProps={{
        style: {
          fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
          fontSize: '14px'
        }
      }}
    >
      {code || "// Перетащите блоки, чтобы сгенерировать код..."}
    </SyntaxHighlighter>
  );
};

export default CodeDisplay;