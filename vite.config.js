import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isDocker = process.env.DOCKER_ENV === 'true' || env.VITE_DEV_SERVER_HOST === '0.0.0.0';
    
    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.jsx'],
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: env.VITE_DEV_SERVER_HOST || (isDocker ? '0.0.0.0' : 'localhost'),
            port: parseInt(env.VITE_DEV_SERVER_PORT) || 5173,
            hmr: {
                host: isDocker ? 'localhost' : env.VITE_DEV_SERVER_HOST || 'localhost',
                port: parseInt(env.VITE_DEV_SERVER_PORT) || 5173,
            },
            proxy: {
                '/api': isDocker ? 'http://nginx:80' : 'http://127.0.0.1:8000',
            },
            watch: {
                usePolling: isDocker, // Enable polling for Docker file watching
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                        router: ['react-router-dom'],
                    },
                },
            },
        },
    };
});
