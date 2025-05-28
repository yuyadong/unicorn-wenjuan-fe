import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { analyzer } from 'vite-bundle-analyzer';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    compression({ algorithm: 'brotliCompress' }),
    mode === 'analyze' ? analyzer() : undefined,
  ],
  test: {
    globals: true, // 启用全局 API（如 describe、test）
    environment: 'jsdom', // 浏览器环境（用于 DOM 测试）
    setupFiles: './src/setupTests.js', // 测试初始化文件
    coverage: {
      // 测试覆盖率配置（可选）
      provider: 'istanbul',
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  // 配置服务器的代理设置
  server: {
    port: 8000,
    // 代理配置，用于重定向请求到其他服务器
    proxy: {
      // 定义一个代理规则，将/hello-world路径下的请求代理到指定的目标服务器
      '/api': {
        // 目标服务器的地址
        target: 'http://localhost:3001',
        // 更改请求的 origin 为代理服务器的 origin，以便与目标服务器交互
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 修改为动态判断的函数形式
        manualChunks: id => {
          // 优先处理 React 及其所有相关依赖
          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            id.includes('scheduler') || // React 内部调度器
            id.includes('object-assign') || // React 内部依赖
            id.includes('prop-types') || // 可能被某些库使用
            id.includes('@babel/runtime') // Babel 运行时（可能关联 React）
          ) {
            // 确保路径精确匹配（排除类似名称的包，如 reactable）
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router-dom/') ||
              id.includes('/scheduler/')
            ) {
              return 'react-vendor';
            }
          }

          // 其他显式拆分的包...
          const explicitChunks = {
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-undo'],
            'ui-vendor': ['antd', '@ant-design/icons'],
            'drag-vendor': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
            utils: ['lodash.clonedeep', 'axios', 'ahooks'],
            charts: ['recharts'],
          };

          // 检查是否属于已明确的包（兼容 Windows/Unix 路径）
          for (const [chunkName, packages] of Object.entries(explicitChunks)) {
            if (
              packages.some(
                pkg =>
                  id.includes(`node_modules/${pkg}/`) || // Unix 路径
                  id.includes(`node_modules\\${pkg}\\`), // Windows 路径
              )
            ) {
              return chunkName;
            }
          }

          // 其他依赖归入 vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // 文件名哈希策略保持不变
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    minify: 'terser',
    terserOptions: { compress: { drop_console: true } },
    brotliSize: true,
  },
}));
