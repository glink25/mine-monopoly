import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	return {
		plugins: [
			vue(),
			Components({
				resolvers: [
					AntDesignVueResolver({
						importStyle: "less", // 使用 Less 样式（Ant Design 默认）
					}),
				],
				dts: true,
			}),
		],
		server: {
			port: 5174,
		},
		resolve: {
			alias: [
				{
					find: "@",
					replacement: path.resolve(path.dirname("./"), "src"),
				},
			],
		},
		esbuild: {
			drop: command === "build" ? ["console", "debugger"] : [],
		},
	};
});
