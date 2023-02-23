import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import analyze from 'rollup-plugin-analyzer'

export default defineConfig((args) => {
    return {
        plugins: [
            reactRefresh(),
            analyze({
                // 用户分析包的大小 和 数量
                summaryOnly: true,
                limit: 10, //
            }),
        ],
        base: args.mode === 'production' ? 'http://cdn-src.renjianzahuopu.store/release-vite/product/' : './',
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
            alias: {
                '@assets/': '/src/assets/',
                '@components/': '/src/containers/components/',
                '@constant/': '/src/constant/',
                '@shared/': '/src/containers/shared/',
                '@views/': '/src/containers/views/',
                '@router/': '/src/router/',
                '@services/': '/src/services/',
                '@store/': '/src/store/',
                '@utils/': '/src/utils/',
                '@typings/': '/typings/',
                '@config/': '/config/',
                '@styles/': '/src/styles/',
                '@nm/': '/node_modules/',
            },
        },
        build: {
            outDir: `build/${args.mode}`,
            minify: 'terser', // boolean | 'terser' | 'esbuild'
        },
        server: {
            port: 9000,
            host: 'localhost',
            open: '/',
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                    modifyVars: {},
                },
            },
        },
        define: {},
    }
})
