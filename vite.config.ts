
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
  build: {
    sourcemap: mode === 'development', // 개발 모드에서만 소스맵 생성
    rollupOptions: {
      output: {
        manualChunks: {
          // 공통 라이브러리 청크 분리 (향상된 분할)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          'vendor-icons': ['lucide-react']
        }
      }
    },
    // 최적화 설정 강화
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // 프로덕션 모드에서 콘솔 로그 제거
        drop_debugger: mode === 'production', // 프로덕션 모드에서 debugger 제거
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : []
      }
    },
    chunkSizeWarningLimit: 1000, // 청크 크기 경고 한계 설정
  },
}));
