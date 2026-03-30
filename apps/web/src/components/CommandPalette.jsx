import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Terminal, Download, Mail, Github, Gamepad2, HelpCircle } from 'lucide-react';
import SnakeGame from './SnakeGame';
import { toast } from 'sonner';

const CommandPalette = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const inputRef = useRef(null);

  const commands = [
    { value: 'help', label: 'help', description: 'Show available commands', icon: HelpCircle },
    { value: 'theme --light', label: 'theme --light', description: 'Switch to light theme', icon: Terminal },
    { value: 'download --cv', label: 'download --cv', description: 'Download CV', icon: Download },
    { value: 'play --snake', label: 'play --snake', description: 'Play snake game', icon: Gamepad2 },
    { value: 'about --me', label: 'about --me', description: 'Show about info', icon: Terminal },
    { value: 'projects --all', label: 'projects --all', description: 'List all projects', icon: Terminal },
    { value: 'contact --email', label: 'contact --email', description: 'Show contact info', icon: Mail }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const executeCommand = (cmd) => {
    const timestamp = new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { type: 'input', text: `$ ${cmd}`, timestamp }]);

    switch (cmd) {
      case 'help':
        setOutput(prev => [...prev, {
          type: 'output',
          text: 'Available commands:\n  help - Show this help message\n  theme --light - Switch theme\n  download --cv - Download CV\n  play --snake - Launch snake game\n  about --me - Show about info\n  projects --all - List projects\n  contact --email - Show contact',
          timestamp
        }]);
        break;
      case 'theme --light':
        setOutput(prev => [...prev, {
          type: 'output',
          text: 'Light theme is not available in cyberpunk mode',
          timestamp
        }]);
        toast('Light theme is not available in cyberpunk mode');
        break;
      case 'download --cv':
        setOutput(prev => [...prev, {
          type: 'output',
          text: 'CV download initiated...',
          timestamp
        }]);
        toast('CV download feature coming soon');
        break;
      case 'play --snake':
        setOutput(prev => [...prev, {
          type: 'output',
          text: 'Launching snake game...',
          timestamp
        }]);
        setTimeout(() => {
          setShowSnakeGame(true);
          onClose();
        }, 500);
        break;
      case 'about --me':
        setOutput(prev => [...prev, {
          type: 'output',
          text: 'Ian Padua\nSystems & Web Developer | IT Project Manager\nLocation: Antipolo City, Rizal, Philippines\nExperience: 25+ years across PH, KSA, Mongolia\nEducation: STI (Programming) | Don Bosco (Electronics)',
          timestamp
        }]);
        break;
      case 'projects --all':
        setOutput(prev => [...prev, {
          type: 'output',
          text: '1. Headless CMS Blog & Portfolio (Nuxt.js + Sanity.io)\n2. Java Library Management System (LMS)\n3. Enterprise BIR Zonal Value Plugin (WordPress)\n4. IT Curriculum & Lab Migration (Ikh Zasag, Mongolia)\n5. Integrated Security & Web Deployment\n6. Multi-Branch Fiber Optic Network Migration (KSA)\n7. Legacy Financial System Migration',
          timestamp
        }]);
        break;
      case 'contact --email':
        setOutput(prev => [...prev, {
          type: 'output',
					text: 'Email: ianpadua@createwith-ip.com\nGitHub: github.com/ianpadua3169',
          timestamp
        }]);
        break;
      default:
        setOutput(prev => [...prev, {
          type: 'error',
          text: `Command not found: ${cmd}\nType 'help' for available commands`,
          timestamp
        }]);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl bg-black rounded-xl neon-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal Header */}
              <div className="bg-[#0F1929] px-4 py-2 border-b border-[#00FF41]/20 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs text-[#00FF41]/70 terminal-text">command-palette</span>
              </div>

              {/* Output Area */}
              <div className="max-h-64 overflow-y-auto p-4 terminal-text text-sm">
                {output.map((line, index) => (
                  <div key={index} className="mb-2">
                    {line.type === 'input' && (
                      <div className="text-[#00D9FF]">{line.text}</div>
                    )}
                    {line.type === 'output' && (
                      <div className="text-[#00FF41] whitespace-pre-line">{line.text}</div>
                    )}
                    {line.type === 'error' && (
                      <div className="text-[#9D4EDD] whitespace-pre-line">{line.text}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Command Input */}
              <Command className="bg-black border-t border-[#00FF41]/20">
                <div className="flex items-center px-4 py-2">
                  <Terminal className="w-4 h-4 text-[#00D9FF] mr-2" />
                  <CommandInput
                    ref={inputRef}
                    placeholder="Type a command..."
                    value={input}
                    onValueChange={setInput}
                    onKeyDown={handleKeyDown}
                    className="terminal-text text-[#00FF41] bg-transparent border-none focus:ring-0"
                  />
                </div>
                <CommandList className="max-h-64">
                  <CommandEmpty className="text-gray-400 text-sm p-4">No commands found</CommandEmpty>
                  <CommandGroup className="p-2">
                    {commands
                      .filter(cmd => cmd.value.includes(input.toLowerCase()))
                      .map((cmd) => (
                        <CommandItem
                          key={cmd.value}
                          value={cmd.value}
                          onSelect={() => executeCommand(cmd.value)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#00FF41]/10 transition-colors duration-200"
                        >
                          <cmd.icon className="w-4 h-4 text-[#00D9FF]" />
                          <div className="flex-1">
                            <div className="text-[#00FF41] terminal-text text-sm">{cmd.label}</div>
                            <div className="text-gray-400 text-xs">{cmd.description}</div>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>

              {/* Help Text */}
              <div className="bg-[#0F1929] px-4 py-2 border-t border-[#00FF41]/20 text-xs text-gray-400 terminal-text">
                Press <kbd className="px-2 py-1 bg-black rounded border border-[#00FF41]/30 text-[#00FF41]">Enter</kbd> to execute • <kbd className="px-2 py-1 bg-black rounded border border-[#00FF41]/30 text-[#00FF41]">Esc</kbd> to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSnakeGame && <SnakeGame onClose={() => setShowSnakeGame(false)} />}
    </>
  );
};

export default CommandPalette;