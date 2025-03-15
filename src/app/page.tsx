'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// 使用dynamic import确保组件在客户端渲染
const LightsGame = dynamic(() => import('@/components/LightsGame'), {
  ssr: false,
  loading: () => <p className="text-center p-10 text-indigo-200">正在加载星空...</p>
});

export default function Home() {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [customInitialState, setCustomInitialState] = useState<boolean[][] | null>(null);
  const [solutionHints, setSolutionHints] = useState<boolean[][] | null>(null); // 存储求解提示
  
  // 开发者模式激活计数器
  const [titleClickCount, setTitleClickCount] = useState<number>(0);
  const titleClickTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 重置开发者模式激活的点击计数器
  const resetTitleClickTimer = () => {
    if (titleClickTimerRef.current) {
      clearTimeout(titleClickTimerRef.current);
    }
    
    titleClickTimerRef.current = setTimeout(() => {
      setTitleClickCount(0);
    }, 3000); // 3秒内需要完成点击
  };
  
  // 处理标题点击，用于激活开发者模式
  const handleTitleClick = () => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    
    // 重置计时器
    resetTitleClickTimer();
    
    // 如果点击5次，激活开发者模式
    if (newCount === 5) {
      setIsDevMode(true);
      setTitleClickCount(0);
      if (titleClickTimerRef.current) {
        clearTimeout(titleClickTimerRef.current);
      }
      
      // 显示开发者模式已激活的消息
      alert('🔓 星图设计师模式已激活！');
    }
  };
  
  // 创建自定义初始状态
  const createEmptyCustomState = () => {
    return Array(boardSize).fill(false).map(() => Array(boardSize).fill(false));
  };
  
  // 切换自定义状态中的单个格子
  const toggleCustomCell = (row: number, col: number) => {
    if (!customInitialState) return;
    
    const newState = customInitialState.map(r => [...r]);
    newState[row][col] = !newState[row][col];
    setCustomInitialState(newState);
  };
  
  // 清除自定义状态
  const clearCustomState = () => {
    setCustomInitialState(null);
  };
  
  // 初始化自定义状态
  const initializeCustomState = () => {
    setCustomInitialState(createEmptyCustomState());
  };
  
  // 随机生成自定义状态
  const randomizeCustomState = () => {
    const newState = Array(boardSize).fill(false).map(() => 
      Array(boardSize).fill(false).map(() => Math.random() > 0.5)
    );
    setCustomInitialState(newState);
  };
  
  // 高斯消元法解决星图游戏
  const solveLightsOutPuzzle = (currentStars: boolean[][] | null) => {
    if (!currentStars) return null;
    
    const n = currentStars.length;
    const MODULO = 2; // 模2运算
    
    // 构建增广矩阵
    const matrix: number[][] = [];
    const target: number[] = [];
    
    // 映射2D棋盘到1D数组
    const getIndex = (row: number, col: number) => row * n + col;
    
    // 构建系数矩阵和目标向量
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const row = new Array(n * n).fill(0);
        
        // 点击位置(i,j)会影响的格子
        row[getIndex(i, j)] = 1; // 自身
        if (i > 0) row[getIndex(i - 1, j)] = 1; // 上
        if (i < n - 1) row[getIndex(i + 1, j)] = 1; // 下
        if (j > 0) row[getIndex(i, j - 1)] = 1; // 左
        if (j < n - 1) row[getIndex(i, j + 1)] = 1; // 右
        
        matrix.push(row);
        // 目标是所有灯都亮，所以暗的格子需要变亮
        target.push(currentStars[i][j] ? 0 : 1);
      }
    }
    
    // 高斯消元求解
    const solution = new Array(n * n).fill(0);
    const matrixSize = n * n;
    
    // 前向消元
    for (let col = 0; col < matrixSize; col++) {
      // 寻找主元
      let pivotRow = -1;
      for (let row = col; row < matrixSize; row++) {
        if (matrix[row][col] === 1) {
          pivotRow = row;
          break;
        }
      }
      
      if (pivotRow === -1) continue; // 这一列没有主元，跳过
      
      // 交换行
      if (pivotRow !== col) {
        [matrix[col], matrix[pivotRow]] = [matrix[pivotRow], matrix[col]];
        [target[col], target[pivotRow]] = [target[pivotRow], target[col]];
      }
      
      // 消元
      for (let row = 0; row < matrixSize; row++) {
        if (row !== col && matrix[row][col] === 1) {
          for (let c = col; c < matrixSize; c++) {
            matrix[row][c] = (matrix[row][c] + matrix[col][c]) % MODULO;
          }
          target[row] = (target[row] + target[col]) % MODULO;
        }
      }
    }
    
    // 检查是否有解
    for (let row = 0; row < matrixSize; row++) {
      let allZeros = true;
      for (let col = 0; col < matrixSize; col++) {
        if (matrix[row][col] === 1) {
          allZeros = false;
          break;
        }
      }
      
      if (allZeros && target[row] === 1) {
        console.log('无解的方程组');
        return null; // 无解
      }
    }
    
    // 回代求解
    for (let row = matrixSize - 1; row >= 0; row--) {
      // 寻找这一行的主元
      let pivotCol = -1;
      for (let col = 0; col < matrixSize; col++) {
        if (matrix[row][col] === 1) {
          pivotCol = col;
          break;
        }
      }
      
      if (pivotCol !== -1) {
        solution[pivotCol] = target[row];
        // 更新上方的行
        for (let r = 0; r < row; r++) {
          if (matrix[r][pivotCol] === 1) {
            target[r] = (target[r] + solution[pivotCol]) % MODULO;
          }
        }
      }
    }
    
    // 将解决方案转换回2D棋盘格式
    const hintBoard = Array(n).fill(0).map(() => Array(n).fill(false));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        hintBoard[i][j] = solution[getIndex(i, j)] === 1;
      }
    }
    
    // 检查解的正确性
    const isSolutionValid = validateSolution(currentStars, hintBoard);
    if (!isSolutionValid) {
      console.log('解决方案验证失败');
      // 找到一个贪心解决方案
      return findGreedySolution(currentStars);
    }
    
    return hintBoard;
  };
  
  // 验证解决方案是否正确
  const validateSolution = (initialState: boolean[][], solution: boolean[][]) => {
    const n = initialState.length;
    // 复制初始状态
    const board = initialState.map(row => [...row]);
    
    // 应用解决方案
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (solution[i][j]) {
          // 模拟点击
          toggleSimulatedStars(board, i, j, n);
        }
      }
    }
    
    // 检查所有星星是否都亮起
    return board.every(row => row.every(star => star === true));
  };
  
  // 模拟点击操作，用于验证解决方案
  const toggleSimulatedStars = (board: boolean[][], row: number, col: number, size: number) => {
    // 翻转点击的格子
    board[row][col] = !board[row][col];
    
    // 翻转上方格子（如果存在）
    if (row > 0) board[row-1][col] = !board[row-1][col];
    
    // 翻转下方格子（如果存在）
    if (row < size - 1) board[row+1][col] = !board[row+1][col];
    
    // 翻转左侧格子（如果存在）
    if (col > 0) board[row][col-1] = !board[row][col-1];
    
    // 翻转右侧格子（如果存在）
    if (col < size - 1) board[row][col+1] = !board[row][col+1];
  };
  
  // 贪心算法找到一个可能的解决方案
  const findGreedySolution = (currentStars: boolean[][]) => {
    const n = currentStars.length;
    const hintBoard = Array(n).fill(0).map(() => Array(n).fill(false));
    const boardCopy = currentStars.map(row => [...row]);
    
    // 从上到下，从左到右遍历
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n; j++) {
        // 如果当前格子是暗的，点击下方格子
        if (!boardCopy[i][j]) {
          const nextRow = i + 1;
          hintBoard[nextRow][j] = true;
          toggleSimulatedStars(boardCopy, nextRow, j, n);
        }
      }
    }
    
    // 检查最后一行
    const lastRow = boardCopy[n - 1];
    const allLit = lastRow.every(cell => cell === true);
    
    if (allLit) {
      return hintBoard;
    }
    
    return null;
  };
  
  // 获取当前星图状态的提示
  const getHintForCurrentState = () => {
    // 需要从LightsGame组件获取当前状态
    // 这里我们通过发起事件获取
    const event = new CustomEvent('requestCurrentStarState', {
      detail: { callback: (currentState: boolean[][]) => {
        const hints = solveLightsOutPuzzle(currentState);
        setSolutionHints(hints);
        
        if (!hints) {
          alert('当前星图状态无解！');
        }
      }}
    });
    window.dispatchEvent(event);
  };
  
  // 清除提示
  const clearHints = () => {
    setSolutionHints(null);
  };

  // 检测设备是否为移动设备
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初始检查
    checkIfMobile();
    
    // 窗口大小变化时重新检查
    window.addEventListener('resize', checkIfMobile);
    
    // 设置全局样式
    document.body.style.backgroundColor = '#0b0f1d';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      if (titleClickTimerRef.current) {
        clearTimeout(titleClickTimerRef.current);
      }
    };
  }, []);
  
  // 当棋盘大小改变时，重置自定义状态
  useEffect(() => {
    if (customInitialState) {
      setCustomInitialState(createEmptyCustomState());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize]);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  // 关闭开发者模式
  const closeDevMode = () => {
    setIsDevMode(false);
    // 同时清除自定义状态和提示，确保不再显示自定义模式浮窗
    setCustomInitialState(null);
    setSolutionHints(null);
  };

  return (
    <>
      <div className="starry-bg"></div>
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 w-full">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center cursor-pointer select-none text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300"
          onClick={handleTitleClick}
        >
          欢迎来到星光唤醒
          {isDevMode && <span className="text-xs align-top text-blue-400 ml-1">设计师</span>}
        </h1>
        <p className="mb-4 text-center max-w-md text-sm md:text-base px-2 text-indigo-200">
          点击暗淡的星星会改变当前星星及其相邻星星的状态。
          你的目标是点亮所有的星星，让星空璀璨！
        </p>
        
        <div className="w-full max-w-md mb-4 md:mb-6 px-2">
          <button 
            onClick={toggleOptions}
            className="flex items-center justify-between w-full px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-colors rounded-full border border-indigo-400 text-white shadow-md shadow-indigo-500/20"
          >
            <span className="font-medium text-sm md:text-base flex items-center">
              <span className="mr-1 opacity-80">✨</span> 星图选项
            </span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isOptionsOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* 选项面板 */}
          <div 
            className={`mt-2 bg-indigo-900/80 backdrop-blur-md rounded-lg transition-all duration-300 overflow-hidden border border-indigo-700 shadow-md shadow-indigo-500/10 ${
              isOptionsOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-3 md:p-4">
              <div className="mb-3 md:mb-4">
                <p className="text-xs md:text-sm text-indigo-300 mb-2">星图大小:</p>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-2 rounded-full text-xs md:text-sm flex items-center justify-center ${boardSize === 3 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border border-blue-400' : 'bg-indigo-800/70 text-white border border-indigo-600'} hover:bg-indigo-700 transition-all shadow-sm`}
                    onClick={() => setBoardSize(3)}
                  >
                    3x3
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-full text-xs md:text-sm flex items-center justify-center ${boardSize === 4 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border border-blue-400' : 'bg-indigo-800/70 text-white border border-indigo-600'} hover:bg-indigo-700 transition-all shadow-sm`}
                    onClick={() => setBoardSize(4)}
                  >
                    4x4
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-full text-xs md:text-sm flex items-center justify-center ${boardSize === 5 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border border-blue-400' : 'bg-indigo-800/70 text-white border border-indigo-600'} hover:bg-indigo-700 transition-all shadow-sm`}
                    onClick={() => setBoardSize(5)}
                  >
                    5x5
                  </button>
                </div>
              </div>
              
              <div className="text-xs md:text-sm text-indigo-300 mb-4">
                当前星图大小: <span className="text-white font-medium">{boardSize}x{boardSize}</span>
              </div>
              
              {/* 开发者模式选项 */}
              {isDevMode && (
                <div className="mt-4 pt-4 border-t border-indigo-700">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs md:text-sm text-indigo-300 flex items-center">
                      <span className="mr-1 opacity-80">✨</span> 星图设计师工具
                    </p>
                    <button 
                      className="text-xs bg-gradient-to-r from-rose-400/80 to-rose-500/80 px-2 py-1 rounded-full border border-rose-400/50 text-white hover:from-rose-500/80 hover:to-rose-600/80 transition-all shadow-sm"
                      onClick={closeDevMode}
                    >
                      关闭设计师模式
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs md:text-sm text-indigo-300 mb-2">自定义星图初始状态:</p>
                    <div className="flex space-x-2 mb-2">
                      <button 
                        className={`px-2 py-1 rounded-full text-xs ${customInitialState ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border border-teal-400/50' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border border-indigo-400/50'} hover:brightness-105 transition-all shadow-sm`}
                        onClick={initializeCustomState}
                      >
                        {customInitialState ? '编辑星图状态' : '创建星图'}
                      </button>
                      <button 
                        className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white border border-blue-400/50 hover:brightness-105 transition-all shadow-sm"
                        onClick={randomizeCustomState}
                      >
                        随机星图
                      </button>
                      {customInitialState && (
                        <button 
                          className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-rose-500/80 to-rose-600/80 text-white border border-rose-400/50 hover:brightness-105 transition-all shadow-sm"
                          onClick={clearCustomState}
                        >
                          清除自定义
                        </button>
                      )}
                    </div>
                    
                    {/* 自定义初始状态编辑器 */}
                    {customInitialState && (
                      <div className="mb-3 bg-gray-900 p-2 rounded">
                        <p className="text-xs text-indigo-300 mb-2">点击星星设置初始状态 (黄色=亮)</p>
                        <div className="grid place-items-center">
                          {customInitialState.map((row, rowIndex) => (
                            <div key={`custom-${rowIndex}`} className="flex">
                              {row.map((cell, colIndex) => (
                                <div
                                  key={`custom-${rowIndex}-${colIndex}`}
                                  className={`w-6 h-6 m-1 rounded-full cursor-pointer ${
                                    cell ? 'bg-yellow-400' : 'bg-indigo-900'
                                  } border border-indigo-600`}
                                  onClick={() => toggleCustomCell(rowIndex, colIndex)}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 提示工具 */}
                  <div className="mb-3 border-t border-indigo-700 pt-3">
                    <p className="text-xs md:text-sm text-indigo-300 mb-2">求解提示工具:</p>
                    <div className="flex space-x-2">
                      {!solutionHints ? (
                        <button 
                          className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-500/80 to-amber-600/80 text-white border border-yellow-400/50 hover:brightness-105 transition-all shadow-sm"
                          onClick={getHintForCurrentState}
                        >
                          显示解法提示
                        </button>
                      ) : (
                        <button 
                          className="px-2 py-1 rounded-full text-xs bg-gradient-to-r from-rose-500/80 to-rose-600/80 text-white border border-rose-400/50 hover:brightness-105 transition-all shadow-sm"
                          onClick={clearHints}
                        >
                          清除提示
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-indigo-300 mt-2">
                      提示将显示需点击的星星位置
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 在移动设备上添加额外的提示 */}
        {isMobile && (
          <p className="text-xs text-center text-indigo-300 mb-3">
            提示: 点击星星可以改变其状态
          </p>
        )}
        
        <LightsGame 
          boardSize={boardSize} 
          initialState={customInitialState}
          solutionHints={solutionHints}
        />
        
        {/* 在移动设备上添加屏幕旋转提示 */}
        {isMobile && boardSize > 3 && (
          <p className="text-xs text-center text-indigo-300 mt-3 px-4">
            提示: 对于{boardSize}x{boardSize}的星图，横屏体验可能更好
          </p>
        )}
      </div>
    </>
  );
}
