
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 소스 맵 생성 설정 추가 (개발 모드에서는 항상 활성화, 프로덕션 모드에서도 활성화)
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // 공통 라이브러리 청크 분리
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    // 최적화 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // 프로덕션 모드에서 콘솔 로그 제거
      }
    }
  },
}));
