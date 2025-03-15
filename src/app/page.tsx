'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// 使用dynamic import确保组件在客户端渲染
const LightsGame = dynamic(() => import('@/components/LightsGame'), {
  ssr: false,
  loading: () => <p className="text-center p-10">Loading game...</p>
});

export default function Home() {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [customInitialState, setCustomInitialState] = useState<boolean[][] | null>(null);
  
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
      alert('🔓 开发者模式已激活！');
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
  
  // 关闭开发者模式
  const closeDevMode = () => {
    setIsDevMode(false);
    // 同时清除自定义状态，确保不再显示自定义模式浮窗
    setCustomInitialState(null);
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
  }, [boardSize]);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 
        className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center cursor-pointer select-none"
        onClick={handleTitleClick}
      >
        欢迎来到灯光游戏
        {isDevMode && <span className="text-xs align-top text-blue-400 ml-1">DEV</span>}
      </h1>
      <p className="mb-4 text-center max-w-md text-sm md:text-base px-2">
        点击灯光格子会改变当前格子及其相邻格子的状态。
        你的目标是点亮所有的灯光！
      </p>
      
      <div className="w-full max-w-md mb-4 md:mb-6 px-2">
        <button 
          onClick={toggleOptions}
          className="flex items-center justify-between w-full px-3 py-2 md:px-4 md:py-2 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg border border-gray-700"
        >
          <span className="font-medium text-sm md:text-base">游戏选项</span>
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
          className={`mt-2 bg-gray-800 rounded-lg transition-all duration-300 overflow-hidden ${
            isOptionsOpen ? 'max-h-[1000px] opacity-100 border border-gray-700' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-3 md:p-4">
            <div className="mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-gray-400 mb-2">游戏大小:</p>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-2 rounded text-xs md:text-sm ${boardSize === 3 ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
                  onClick={() => setBoardSize(3)}
                >
                  3x3
                </button>
                <button 
                  className={`px-3 py-2 rounded text-xs md:text-sm ${boardSize === 4 ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
                  onClick={() => setBoardSize(4)}
                >
                  4x4
                </button>
                <button 
                  className={`px-3 py-2 rounded text-xs md:text-sm ${boardSize === 5 ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
                  onClick={() => setBoardSize(5)}
                >
                  5x5
                </button>
              </div>
            </div>
            
            <div className="text-xs md:text-sm text-gray-400 mb-4">
              当前游戏大小: <span className="text-white font-medium">{boardSize}x{boardSize}</span>
            </div>
            
            {/* 开发者模式选项 */}
            {isDevMode && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs md:text-sm text-blue-400">开发者选项</p>
                  <button 
                    className="text-xs text-gray-400 hover:text-white"
                    onClick={closeDevMode}
                  >
                    关闭开发者模式
                  </button>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs md:text-sm text-gray-400 mb-2">自定义初始状态:</p>
                  <div className="flex space-x-2 mb-2">
                    <button 
                      className={`px-2 py-1 rounded text-xs ${customInitialState ? 'bg-green-600' : 'bg-gray-700'} hover:bg-green-500 transition-colors`}
                      onClick={initializeCustomState}
                    >
                      {customInitialState ? '编辑自定义状态' : '创建自定义状态'}
                    </button>
                    <button 
                      className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-blue-500 transition-colors"
                      onClick={randomizeCustomState}
                    >
                      随机生成
                    </button>
                    {customInitialState && (
                      <button 
                        className="px-2 py-1 rounded text-xs bg-red-700 hover:bg-red-600 transition-colors"
                        onClick={clearCustomState}
                      >
                        清除自定义
                      </button>
                    )}
                  </div>
                  
                  {/* 自定义初始状态编辑器 */}
                  {customInitialState && (
                    <div className="mb-3 bg-gray-900 p-2 rounded">
                      <p className="text-xs text-gray-400 mb-2">点击格子设置初始状态 (黄色=亮)</p>
                      <div className="grid place-items-center">
                        {customInitialState.map((row, rowIndex) => (
                          <div key={`custom-${rowIndex}`} className="flex">
                            {row.map((cell, colIndex) => (
                              <div
                                key={`custom-${rowIndex}-${colIndex}`}
                                className={`w-6 h-6 m-1 rounded cursor-pointer border border-gray-600 ${
                                  cell ? 'bg-yellow-400' : 'bg-gray-800'
                                }`}
                                onClick={() => toggleCustomCell(rowIndex, colIndex)}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 在移动设备上添加额外的提示 */}
      {isMobile && (
        <p className="text-xs text-center text-gray-400 mb-3">
          提示: 点击灯光可以改变其状态
        </p>
      )}
      
      <LightsGame 
        boardSize={boardSize} 
        initialState={customInitialState}
      />
      
      {/* 在移动设备上添加屏幕旋转提示 */}
      {isMobile && boardSize > 3 && (
        <p className="text-xs text-center text-gray-400 mt-3 px-4">
          提示: 对于{boardSize}x{boardSize}的游戏，横屏体验可能更好
        </p>
      )}
    </div>
  );
}
