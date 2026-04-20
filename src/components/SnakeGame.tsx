import React, { useState, useEffect, useCallback } from 'react';
import { Skull, Power, Radio } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

const getRandomFoodPosition = (snake: Point[]): Point => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        resetGame();
        return;
      }
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused || isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [direction, isPaused, isGameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 1;
            setHighScore(h => Math.max(h, newScore));
            return newScore;
          });
          setFood(getRandomFoodPosition(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(40, BASE_SPEED - Math.floor(score / 5) * 10);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [direction, isPaused, isGameOver, food, score]);

  return (
    <div className="flex flex-col items-center w-full relative z-20">
      <div className="flex items-center justify-between w-full max-w-md mb-2 px-0 border-b-2 border-neon-cyan pb-2">
        <div className="flex flex-col">
          <span className="text-neon-cyan/50 font-pixel text-[10px] uppercase">YIELD</span>
          <span className="text-neon-cyan font-pixel text-xl">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-neon-magenta/50 font-pixel text-[10px] uppercase">PEAK_YIELD</span>
          <span className="text-neon-magenta font-pixel text-xl">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group p-1 bg-neon-cyan/20">
        <div 
          className="relative bg-black border-[3px] border-neon-cyan overflow-hidden"
        >
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              width: 'min(90vw, 400px)',
              height: 'min(90vw, 400px)'
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              
              const isSnakeHead = snake[0].x === x && snake[0].y === y;
              const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              let cellClasses = "border-[1px] border-neon-cyan/10 ";
              if (isSnakeHead) {
                cellClasses += "bg-white relative z-10 before:absolute before:inset-0 before:bg-neon-cyan/50 before:animate-pulse";
              } else if (isSnakeBody) {
                cellClasses += "bg-neon-cyan/80 mix-blend-screen";
              } else if (isFood) {
                cellClasses += "bg-neon-magenta animate-pulse";
              }

              return <div key={`${x}-${y}`} className={cellClasses} />;
            })}
          </div>

          {isGameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-20 overflow-hidden">
              <div className="absolute inset-0 bg-neon-magenta/10 mix-blend-color-burn animate-pulse"></div>
              <Skull size={48} className="text-neon-magenta mb-4 animate-bounce" />
              <h2 className="glitch-text text-xl md:text-2xl font-pixel text-white mb-2 text-center uppercase" data-text="[ERR: ENTITY_CONSUMED]">[ERR: ENTITY_CONSUMED]</h2>
              <p className="text-neon-cyan font-mono mb-8 font-bold">FATAL_EXCEPTION_0x000F</p>
              
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 bg-neon-magenta text-black hover:bg-white px-6 py-3 font-pixel text-[10px] uppercase transition-all z-10"
              >
                <Power size={14} />
                INIT_REBOOT
              </button>
            </div>
          )}

          {!isGameOver && isPaused && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,255,255,0.05)_10px,rgba(0,255,255,0.05)_20px)]"></div>
              <Radio size={48} className="text-neon-cyan mb-4 animate-pulse opacity-50" />
              <h2 className="glitch-text text-xl font-pixel text-neon-cyan mb-8 uppercase" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
              
              <button 
                onClick={() => setIsPaused(false)}
                className="flex items-center gap-2 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black px-6 py-3 font-pixel text-[10px] uppercase transition-all z-10"
              >
                ACTIVATE_LINK
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex w-full max-w-md justify-between text-neon-cyan/60 font-mono text-xs uppercase border-t border-neon-cyan/30 pt-2">
        <div className="flex items-center gap-2">
          <span>DIR_OVERRIDE:</span>
          <span className="text-neon-magenta font-bold">W A S D</span>
        </div>
        <div className="flex items-center gap-2">
          <span>INTERRUPT:</span>
          <span className="text-neon-magenta font-bold">SPACE</span>
        </div>
      </div>
    </div>
  );
}
