import { useEffect, useState } from 'react';

export const useCustomCursor = () => {
  const [cursorState, setCursorState] = useState('default');

  useEffect(() => {
    const body = document.body;
    
    // Remove all cursor classes
    body.classList.remove('cursor-bracket', 'cursor-crosshair-custom', 'cursor-terminal');
    
    // Add appropriate cursor class
    if (cursorState === 'code') {
      body.classList.add('cursor-bracket');
    } else if (cursorState === 'design') {
      body.classList.add('cursor-crosshair-custom');
    } else if (cursorState === 'terminal') {
      body.classList.add('cursor-terminal');
    }
    
    return () => {
      body.classList.remove('cursor-bracket', 'cursor-crosshair-custom', 'cursor-terminal');
    };
  }, [cursorState]);

  return { cursorState, setCursorState };
};