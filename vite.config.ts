import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	preview: {
		host: true,
		port: 3000,
	},
	server: {
		port: 3000, // Set the port here
	},
	define: {
		global: 'window',
	},
});