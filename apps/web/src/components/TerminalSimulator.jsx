import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TerminalSimulator = () => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const bootSequence = [
    { text: 'Initializing system...', delay: 400 },
    { text: 'Loading profile: Ian Padua', delay: 600 },
    { text: 'Role: Systems & Web Developer | IT Project Manager', delay: 500 },
    { text: 'Experience: 25+ years across PH, KSA, Mongolia', delay: 700 },
    { text: 'Skills: Python, Java, JS, PHP, SQL, C++, VB', delay: 600 },
    { text: 'Infra: Windows Server, Linux, Cisco, Fiber Optic', delay: 600 },
    { text: 'Web: Nuxt.js, Sanity.io, Tailwind, WordPress', delay: 500 },
    { text: 'Certs: Java NC III, 120-Hr TEFL, Grapeseed', delay: 500 },
    { text: 'Education: STI (Programming) | Don Bosco (Electronics)', delay: 600 },
    { text: 'Portfolio loaded. System ready.', delay: 400 }
  ];

  useEffect(() => {
    if (currentLineIndex < bootSequence.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, bootSequence[currentLineIndex].text]);
        setCurrentLineIndex(prev => prev + 1);
      }, bootSequence[currentLineIndex].delay);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentLineIndex]);

  return (
    <div className="h-full w-full bg-black p-6 overflow-hidden">
      <div className="terminal-text text-[#00FF41] text-sm leading-relaxed">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-2 terminal-shadow"
          >
            <span className="text-[#00D9FF]">$</span> {line}
          </motion.div>
        ))}
        {!isComplete && (
          <div className="flex items-center mt-2">
            <span className="text-[#00D9FF]">$</span>
            <span className="ml-2 inline-block w-2 h-4 bg-[#00FF41] animate-blink"></span>
          </div>
        )}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[#9D4EDD]"
          >
            <span className="text-[#00D9FF]">$</span> Ready for input_
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TerminalSimulator;