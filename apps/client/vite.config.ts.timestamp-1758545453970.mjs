// vite.config.ts
import { defineConfig } from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/vite@4.1.0_@types+node@20.6.4_sass@1.58.3/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/@vitejs+plugin-vue@4.0.0_vi_ed3ccac861cf0dbb19b2ab4c29c77650/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import viteCompression from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/vite-plugin-compression@0.5_2ce21c53368e603b4dad84d6a56ec720/node_modules/vite-plugin-compression/dist/index.mjs";
import electron from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/vite-plugin-electron@0.29.0_9e45a57c461826f3fba03c6ac4fced36/node_modules/vite-plugin-electron/dist/simple.mjs";
var __vite_injected_original_dirname = "C:\\DEV\\code\\repo\\fatpaper-monopoly\\apps\\client";
var vite_config_default = defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      viteCompression(),
      // manifestGenerator(pkg.version, pkg.updateMessage),
      // visualizer({
      // 	gzipSize: true,
      // 	brotliSize: true,
      // 	emitFile: false,
      // 	filename: "test.html", //分析图生成的文件名
      // 	open: true, //如果存在本地服务端口，将在打包后自动展示
      // }),
      electron({
        main: {
          entry: "electron/main.ts"
        },
        preload: {
          input: path.join(__vite_injected_original_dirname, "electron/preload.ts")
        },
        renderer: process.env.NODE_ENV === "test" ? void 0 : {}
      })
    ],
    build: {
      outDir: "dist/frontend",
      rollupOptions: {
        plugins: [
          // externalGlobals({
          // 	vue: "Vue",
          // 	"vue-router": "VueRouter",
          // 	"vue-demi": "VueDemi",
          // 	pinia: "Pinia",
          // 	three: "",
          // 	gsap: "",
          // }),
        ]
      }
    },
    resolve: {
      alias: [
        {
          find: "@src",
          replacement: path.resolve(path.dirname("./"), "src")
        }
      ]
    },
    server: {
      port: 80
    },
    esbuild: {
      drop: command === "build" ? ["console", "debugger"] : []
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9ERVYvY29kZS9yZXBvL2ZhdHBhcGVyLW1vbm9wb2x5L2FwcHMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCI7XHJcbmltcG9ydCBleHRlcm5hbEdsb2JhbHMgZnJvbSBcInJvbGx1cC1wbHVnaW4tZXh0ZXJuYWwtZ2xvYmFsc1wiO1xyXG5pbXBvcnQgeyBtYW5pZmVzdEdlbmVyYXRvciB9IGZyb20gXCIuL2J1aWxkL3BsdWdpbnMvdml0ZS1wbHVnaW4tbWFuaWZlc3RcIjtcclxuLy8gaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcclxuaW1wb3J0IGVsZWN0cm9uIGZyb20gXCJ2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGVcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0cGx1Z2luczogW1xyXG5cdFx0XHR2dWUoKSxcclxuXHRcdFx0dml0ZUNvbXByZXNzaW9uKCksXHJcblx0XHRcdC8vIG1hbmlmZXN0R2VuZXJhdG9yKHBrZy52ZXJzaW9uLCBwa2cudXBkYXRlTWVzc2FnZSksXHJcblx0XHRcdC8vIHZpc3VhbGl6ZXIoe1xyXG5cdFx0XHQvLyBcdGd6aXBTaXplOiB0cnVlLFxyXG5cdFx0XHQvLyBcdGJyb3RsaVNpemU6IHRydWUsXHJcblx0XHRcdC8vIFx0ZW1pdEZpbGU6IGZhbHNlLFxyXG5cdFx0XHQvLyBcdGZpbGVuYW1lOiBcInRlc3QuaHRtbFwiLCAvL1x1NTIwNlx1Njc5MFx1NTZGRVx1NzUxRlx1NjIxMFx1NzY4NFx1NjU4N1x1NEVGNlx1NTQwRFxyXG5cdFx0XHQvLyBcdG9wZW46IHRydWUsIC8vXHU1OTgyXHU2NzlDXHU1QjU4XHU1NzI4XHU2NzJDXHU1NzMwXHU2NzBEXHU1MkExXHU3QUVGXHU1M0UzXHVGRjBDXHU1QzA2XHU1NzI4XHU2MjUzXHU1MzA1XHU1NDBFXHU4MUVBXHU1MkE4XHU1QzU1XHU3OTNBXHJcblx0XHRcdC8vIH0pLFxyXG5cdFx0XHRlbGVjdHJvbih7XHJcblx0XHRcdFx0bWFpbjoge1xyXG5cdFx0XHRcdFx0ZW50cnk6IFwiZWxlY3Ryb24vbWFpbi50c1wiLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cHJlbG9hZDoge1xyXG5cdFx0XHRcdFx0aW5wdXQ6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiZWxlY3Ryb24vcHJlbG9hZC50c1wiKSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJlbmRlcmVyOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJ0ZXN0XCIgPyB1bmRlZmluZWQgOiB7fSxcclxuXHRcdFx0fSksXHJcblx0XHRdLFxyXG5cdFx0YnVpbGQ6IHtcclxuXHRcdFx0b3V0RGlyOiBcImRpc3QvZnJvbnRlbmRcIixcclxuXHRcdFx0cm9sbHVwT3B0aW9uczoge1xyXG5cdFx0XHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0XHRcdC8vIGV4dGVybmFsR2xvYmFscyh7XHJcblx0XHRcdFx0XHQvLyBcdHZ1ZTogXCJWdWVcIixcclxuXHRcdFx0XHRcdC8vIFx0XCJ2dWUtcm91dGVyXCI6IFwiVnVlUm91dGVyXCIsXHJcblx0XHRcdFx0XHQvLyBcdFwidnVlLWRlbWlcIjogXCJWdWVEZW1pXCIsXHJcblx0XHRcdFx0XHQvLyBcdHBpbmlhOiBcIlBpbmlhXCIsXHJcblx0XHRcdFx0XHQvLyBcdHRocmVlOiBcIlwiLFxyXG5cdFx0XHRcdFx0Ly8gXHRnc2FwOiBcIlwiLFxyXG5cdFx0XHRcdFx0Ly8gfSksXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRyZXNvbHZlOiB7XHJcblx0XHRcdGFsaWFzOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0ZmluZDogXCJAc3JjXCIsXHJcblx0XHRcdFx0XHRyZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShcIi4vXCIpLCBcInNyY1wiKSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0fSxcclxuXHRcdHNlcnZlcjoge1xyXG5cdFx0XHRwb3J0OiA4MCxcclxuXHRcdH0sXHJcblx0XHRlc2J1aWxkOiB7XHJcblx0XHRcdGRyb3A6IGNvbW1hbmQgPT09IFwiYnVpbGRcIiA/IFtcImNvbnNvbGVcIiwgXCJkZWJ1Z2dlclwiXSA6IFtdLFxyXG5cdFx0fSxcclxuXHR9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwVSxTQUFTLG9CQUFvQjtBQUN2VyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBRWpCLE9BQU8scUJBQXFCO0FBSTVCLE9BQU8sY0FBYztBQVJyQixJQUFNLG1DQUFtQztBQVd6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsTUFBTTtBQUM1QyxTQUFPO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUixJQUFJO0FBQUEsTUFDSixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFTaEIsU0FBUztBQUFBLFFBQ1IsTUFBTTtBQUFBLFVBQ0wsT0FBTztBQUFBLFFBQ1I7QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNSLE9BQU8sS0FBSyxLQUFLLGtDQUFXLHFCQUFxQjtBQUFBLFFBQ2xEO0FBQUEsUUFDQSxVQUFVLFFBQVEsSUFBSSxhQUFhLFNBQVMsU0FBWSxDQUFDO0FBQUEsTUFDMUQsQ0FBQztBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLGVBQWU7QUFBQSxRQUNkLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFTVDtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUixPQUFPO0FBQUEsUUFDTjtBQUFBLFVBQ0MsTUFBTTtBQUFBLFVBQ04sYUFBYSxLQUFLLFFBQVEsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLO0FBQUEsUUFDcEQ7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1A7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNSLE1BQU0sWUFBWSxVQUFVLENBQUMsV0FBVyxVQUFVLElBQUksQ0FBQztBQUFBLElBQ3hEO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
