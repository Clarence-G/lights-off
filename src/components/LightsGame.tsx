'use client';

import { useState, useEffect } from 'react';
import styles from './LightsGame.module.css';

const LightsGame = () => {
  // 游戏状态: true表示灯亮，false表示灯灭
  const [lights, setLights] = useState<boolean[][]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  
  // 初始化游戏
  useEffect(() => {
    initializeGame();
  }, []);

  // 随机初始化游戏，确保有解
  const initializeGame = () => {
    // 创建一个全部为false（灯灭）的3x3矩阵
    const newBoard = Array(3).fill(false).map(() => Array(3).fill(false));
    
    // 随机翻转一些格子来生成初始状态
    // 在实际游戏中，这确保游戏是可解的
    for (let i = 0; i < 5; i++) {
      const row = Math.floor(Math.random() * 3);
      const col = Math.floor(Math.random() * 3);
      toggleLights(newBoard, row, col);
    }
    
    setLights(newBoard);
    setIsWinner(false);
    setMoveCount(0);
  };

  // 翻转灯的状态（在矩阵上直接操作）
  const toggleLights = (board: boolean[][], row: number, col: number) => {
    // 翻转点击的格子
    board[row][col] = !board[row][col];
    
    // 翻转上方格子（如果存在）
    if (row > 0) board[row-1][col] = !board[row-1][col];
    
    // 翻转下方格子（如果存在）
    if (row < 2) board[row+1][col] = !board[row+1][col];
    
    // 翻转左侧格子（如果存在）
    if (col > 0) board[row][col-1] = !board[row][col-1];
    
    // 翻转右侧格子（如果存在）
    if (col < 2) board[row][col+1] = !board[row][col+1];
  };

  // 处理格子点击
  const handleClick = (row: number, col: number) => {
    if (isWinner) return; // 如果已经赢了，不处理点击
    
    const newBoard = lights.map(row => [...row]); // 创建状态的深拷贝
    toggleLights(newBoard, row, col);
    setLights(newBoard);
    setMoveCount(prev => prev + 1);
    
    // 检查是否获胜
    checkWinner(newBoard);
  };

  // 检查是否获胜
  const checkWinner = (board: boolean[][]) => {
    // 所有灯都亮即为获胜
    const allLightsOn = board.every(row => row.every(light => light === true));
    if (allLightsOn) {
      setIsWinner(true);
    }
  };

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>Lights-On Game</h1>
      
      <div className={styles.board}>
        {lights.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((light, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.cell} ${light ? styles.on : styles.off}`}
                onClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className={styles.stats}>
        <p>Moves: {moveCount}</p>
      </div>
      
      {isWinner && (
        <div className={styles.winnerMessage}>
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You turned all the lights on in {moveCount} moves!</p>
          <button className={styles.resetButton} onClick={initializeGame}>
            Play Again
          </button>
        </div>
      )}
      
      {!isWinner && (
        <button className={styles.resetButton} onClick={initializeGame}>
          Reset Game
        </button>
      )}
    </div>
  );
};

export default LightsGame; 