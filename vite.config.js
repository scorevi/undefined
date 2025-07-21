import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
<<<<<<< HEAD
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
=======
// import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
>>>>>>> origin/frontend

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
<<<<<<< HEAD
        tailwindcss(),
=======
>>>>>>> origin/frontend
    ],
});