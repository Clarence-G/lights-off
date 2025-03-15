'use client';

import dynamic from 'next/dynamic';

// 使用dynamic import确保组件在客户端渲染
const LightsGame = dynamic(() => import('@/components/LightsGame'), {
  ssr: false,
  loading: () => <p className="text-center p-10">Loading game...</p>
});

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">欢迎来到灯光游戏</h1>
      <p className="mb-8 text-center max-w-md">
        点击灯光格子会改变当前格子及其相邻格子的状态。
        你的目标是点亮所有的灯光！
      </p>
      <LightsGame />
    </div>
  );
}
