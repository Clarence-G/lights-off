'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 使用dynamic import确保组件在客户端渲染
const LightsGame = dynamic(() => import('@/components/LightsGame'), {
  ssr: false,
  loading: () => <p className="text-center p-10">Loading game...</p>
});

export default function Home() {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">欢迎来到灯光游戏</h1>
      <p className="mb-4 text-center max-w-md">
        点击灯光格子会改变当前格子及其相邻格子的状态。
        你的目标是点亮所有的灯光！
      </p>
      
      <div className="w-full max-w-md mb-6">
        <button 
          onClick={toggleOptions}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg border border-gray-700"
        >
          <span className="font-medium">游戏选项</span>
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
            isOptionsOpen ? 'max-h-96 opacity-100 border border-gray-700' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">游戏大小:</p>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 rounded text-sm ${boardSize === 3 ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
                  onClick={() => setBoardSize(3)}
                >
                  3x3
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${boardSize === 4 ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
                  onClick={() => setBoardSize(4)}
                >
                  4x4
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${boardSize === 5 ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
                  onClick={() => setBoardSize(5)}
                >
                  5x5
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              当前游戏大小: <span className="text-white font-medium">{boardSize}x{boardSize}</span>
            </div>
          </div>
        </div>
      </div>
      
      <LightsGame boardSize={boardSize} />
    </div>
  );
}
