import { useEffect, useState } from 'react';

export const useKeyboardNavigation = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [helpOverlayOpen, setHelpOverlayOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // / to open command palette (if not in input)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // ? to show help overlay (if not in input)
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setHelpOverlayOpen(true);
      }
      
      // Escape to close overlays
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setHelpOverlayOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    commandPaletteOpen,
    setCommandPaletteOpen,
    helpOverlayOpen,
    setHelpOverlayOpen
  };
};