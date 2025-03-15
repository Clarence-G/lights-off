'use client';

import { useState, useEffect } from 'react';
import styles from './LightsGame.module.css';

interface LightsGameProps {
  boardSize: number;
  initialState?: boolean[][] | null;
}

const LightsGame = ({ boardSize = 3, initialState = null }: LightsGameProps) => {
  // 游戏状态: true表示星星亮起，false表示星星暗淡
  const [stars, setStars] = useState<boolean[][]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  
  // 初始化游戏
  useEffect(() => {
    initializeGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize, initialState]); // 当boardSize或initialState改变时重新初始化游戏

  // 随机初始化游戏，确保有解
  const initializeGame = () => {
    // 如果提供了自定义初始状态，直接使用
    if (initialState) {
      setStars([...initialState.map(row => [...row])]);
      setIsWinner(false);
      setMoveCount(0);
      return;
    }
    
    // 否则创建一个全部为false（星星暗淡）的大小为boardSize的矩阵
    const newBoard = Array(boardSize).fill(false).map(() => Array(boardSize).fill(false));
    
    // 随机翻转一些格子来生成初始状态
    // 在实际游戏中，这确保游戏是可解的
    const flips = Math.max(boardSize * 2, 5); // 根据棋盘大小调整翻转次数
    for (let i = 0; i < flips; i++) {
      const row = Math.floor(Math.random() * boardSize);
      const col = Math.floor(Math.random() * boardSize);
      toggleStars(newBoard, row, col);
    }
    
    setStars(newBoard);
    setIsWinner(false);
    setMoveCount(0);
  };

  // 翻转星星的状态（在矩阵上直接操作）
  const toggleStars = (board: boolean[][], row: number, col: number) => {
    // 翻转点击的格子
    board[row][col] = !board[row][col];
    
    // 翻转上方格子（如果存在）
    if (row > 0) board[row-1][col] = !board[row-1][col];
    
    // 翻转下方格子（如果存在）
    if (row < boardSize - 1) board[row+1][col] = !board[row+1][col];
    
    // 翻转左侧格子（如果存在）
    if (col > 0) board[row][col-1] = !board[row][col-1];
    
    // 翻转右侧格子（如果存在）
    if (col < boardSize - 1) board[row][col+1] = !board[row][col+1];
  };

  // 处理格子点击
  const handleClick = (row: number, col: number) => {
    if (isWinner) return; // 如果已经赢了，不处理点击
    
    const newBoard = stars.map(row => [...row]); // 创建状态的深拷贝
    toggleStars(newBoard, row, col);
    setStars(newBoard);
    setMoveCount(prev => prev + 1);
    
    // 检查是否获胜
    checkWinner(newBoard);
  };

  // 检查是否获胜
  const checkWinner = (board: boolean[][]) => {
    // 所有星星都亮即为获胜
    const allStarsOn = board.every(row => row.every(star => star === true));
    if (allStarsOn) {
      setIsWinner(true);
    }
  };

  // 根据棋盘大小和屏幕宽度调整星星大小的样式
  const getStarSizeStyle = () => {
    // 检测窗口宽度以设置合适的大小
    const getBaseSize = () => {
      if (typeof window === 'undefined') return boardSize <= 3 ? 80 : boardSize <= 4 ? 65 : 50;
      
      const width = window.innerWidth;
      
      // 超小屏幕设备 (手机)
      if (width < 375) {
        return boardSize <= 3 ? 55 : boardSize <= 4 ? 45 : 35;
      }
      // 小屏幕设备 (大一点的手机)
      else if (width < 640) {
        return boardSize <= 3 ? 65 : boardSize <= 4 ? 50 : 40;
      }
      // 中等屏幕设备 (平板)
      else if (width < 768) {
        return boardSize <= 3 ? 75 : boardSize <= 4 ? 60 : 45;
      }
      // 大屏幕设备 (桌面)
      else {
        return boardSize <= 3 ? 80 : boardSize <= 4 ? 65 : 50;
      }
    };
    
    const baseSize = getBaseSize();
    
    return {
      width: `${baseSize}px`,
      height: `${baseSize}px`,
      '--delay': `${(Math.random() * 2).toFixed(1)}` // 随机延迟闪烁动画
    } as React.CSSProperties;
  };

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>
        星光唤醒
        {initialState && (
          <span className={styles.customBadge}>自定义星图</span>
        )}
      </h1>
      
      <div className={styles.board}>
        {stars.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((star, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.cell} ${star ? styles.on : styles.off}`}
                style={getStarSizeStyle()}
                onClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className={styles.stats}>
        <p>移动次数: {moveCount}</p>
      </div>
      
      {isWinner && (
        <div className={styles.winnerMessage}>
          <h2>✨ 星光璀璨！✨</h2>
          <p>你成功点亮了所有星星，用了 {moveCount} 次移动！</p>
          <button className={styles.resetButton} onClick={initializeGame}>
            <span>✨</span> 再次挑战 <span>✨</span>
          </button>
        </div>
      )}
      
      {!isWinner && (
        <button className={styles.resetButton} onClick={initializeGame}>
          <span>✨</span> 重置星图 <span>✨</span>
        </button>
      )}
    </div>
  );
};

export default LightsGame; 