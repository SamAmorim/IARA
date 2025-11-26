import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    build: {
        outDir: 'dist'
    },
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "assets": path.resolve(__dirname, "./src/assets"),
            "components": path.resolve(__dirname, "./src/components"),
            "context": path.resolve(__dirname, "./src/context"),
            "pages": path.resolve(__dirname, "./src/pages"),
            "services": path.resolve(__dirname, "./src/services"),
            "typesrc": path.resolve(__dirname, "./src/types"),
            "utils": path.resolve(__dirname, "./src/utils")
        }
    }
})
