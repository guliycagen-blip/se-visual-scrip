// src/console_app/components/ConsoleCodeDisplay.js

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const ConsoleCodeDisplay = ({ code }) => {
  return (
    <SyntaxHighlighter language="csharp" style={vs2015} showLineNumbers>
      {code || '// Соберите программу из блоков...'}
    </SyntaxHighlighter>
  );
};

export default ConsoleCodeDisplay;