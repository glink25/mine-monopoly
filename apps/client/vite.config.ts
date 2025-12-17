import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import viteCompression from "vite-plugin-compression";
import electron from "vite-plugin-electron/simple";
import pkg from "./package.json";
import generateMonacoDTS from "./plugins/vite-plugin-generate-monaco-dts";

const APP_VERSION_SHORT = pkg.version.split(".").slice(0, 2).join(".");

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	return {
		base: "./",
		define: {
			// 全局常量注入
			__APP_VERSION__: JSON.stringify(pkg.version),
			__BUILD_TIME__: JSON.stringify(new Date().toISOString()),
			__COMPATIBLE_VERSION__: JSON.stringify(APP_VERSION_SHORT),
		},
		plugins: [
			vue(),
			generateMonacoDTS(),
			viteCompression(),
			electron({
				main: {
					entry: "electron/main.ts",
				},
				preload: {
					input: path.join(__dirname, "electron/preload.ts"),
				},
				renderer: process.env.NODE_ENV === "test" ? undefined : {},
			}),
		],
		build: {
			outDir: "dist/frontend",
		},
		resolve: {
			alias: [
				{
					find: "@src",
					replacement: path.resolve(path.dirname("./"), "src"),
				},
			],
		},
		server: {
			port: 80,
		},
		esbuild: {
			drop: command === "build" ? ["console", "debugger"] : [],
		},
	};
});
