import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/forum/api": {
				target: "http://127.0.0.1:3001",
				changeOrigin: true,
				secure: false,
			}
		},
	}
})
