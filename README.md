# Lights-On 益智游戏

一个基于Next.js构建的经典Lights-Out益智游戏。游戏目标是通过点击格子，使所有灯都亮起来。

## 游戏规则

- 游戏界面是一个3x3的格子
- 点击一个格子会改变该格子及其上下左右相邻格子的状态（亮变暗，暗变亮）
- 游戏的目标是使所有格子都变成亮的状态
- 系统会记录你完成游戏所用的点击次数

## 技术栈

- Next.js 14
- React
- TypeScript
- CSS Modules
- Tailwind CSS

## 本地开发

首先，克隆此仓库并安装依赖：

```bash
git clone <repository-url>
cd lights-off
npm install
```

然后，启动开发服务器：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看应用。

## 部署到Vercel

此项目已配置为可以轻松部署到Vercel平台。

### 部署步骤：

1. 创建一个 [Vercel 账号](https://vercel.com/signup)
2. 将代码推送到GitHub仓库
3. 在Vercel控制台中导入此GitHub仓库
4. Vercel将自动检测到Next.js项目并使用最佳配置
5. 点击"Deploy"按钮

或者，您可以使用Vercel CLI进行部署：

```bash
npm i -g vercel
vercel
```

## 自定义游戏难度

如果你想调整游戏难度，可以修改`src/components/LightsGame.tsx`文件中的初始化函数，更改随机翻转的次数：

```typescript
// 随机翻转更多或更少次数来改变难度
for (let i = 0; i < 5; i++) { // 将5改为其他数字
  const row = Math.floor(Math.random() * 3);
  const col = Math.floor(Math.random() * 3);
  toggleLights(newBoard, row, col);
}
```

## 许可证

MIT
