import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SnakeGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const gridSize = 20;
  const cellSize = 20;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) {
        setGameStarted(true);
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameStarted, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#00FF41';
    ctx.globalAlpha = 0.1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, gridSize * cellSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(gridSize * cellSize, i * cellSize);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00FF41' : '#00D9FF';
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize - 2, cellSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#9D4EDD';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize - 2, cellSize - 2);
  }, [snake, food]);

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0F1929] rounded-xl p-6 neon-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#00FF41] terminal-text">Snake Game</h3>
          <div className="text-[#00D9FF] terminal-text">Score: {score}</div>
        </div>

        <canvas
          ref={canvasRef}
          width={gridSize * cellSize}
          height={gridSize * cellSize}
          className="border border-[#00FF41]/30 rounded-lg mb-4"
        />

        {!gameStarted && !gameOver && (
          <p className="text-center text-gray-400 text-sm mb-4">
            Press any arrow key to start
          </p>
        )}

        {gameOver && (
          <div className="text-center mb-4">
            <p className="text-[#9D4EDD] font-bold mb-2">Game Over!</p>
            <button
              onClick={handleRestart}
              className="px-4 py-2 bg-[#00FF41] text-black rounded-lg hover:bg-[#00FF41]/80 transition-colors duration-200 active:scale-95"
            >
              Restart
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-[#0F1929] border border-[#00D9FF]/30 text-[#00D9FF] rounded-lg hover:bg-[#00D9FF]/10 transition-colors duration-200 active:scale-95"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default SnakeGame;