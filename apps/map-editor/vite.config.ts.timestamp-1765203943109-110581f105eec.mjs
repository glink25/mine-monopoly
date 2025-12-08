// vite.config.ts
import { defineConfig } from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/vite@5.4.21_@types+node@20.6.4_sass@1.58.3/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_e00ad99c1c4729f073399a2f89a37b33/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import electron from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/vite-plugin-electron@0.29.0_9e45a57c461826f3fba03c6ac4fced36/node_modules/vite-plugin-electron/dist/simple.mjs";
import path2 from "path";
import Components from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/unplugin-vue-components@29._bea1dcaddab1274a90bdb11407beef67/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver } from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/unplugin-vue-components@29._bea1dcaddab1274a90bdb11407beef67/node_modules/unplugin-vue-components/dist/resolvers.js";

// plugins/vite-plugin-generate-monaco-dts.ts
import fs from "fs";
import path from "path";
import ts from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/typescript@5.9.2/node_modules/typescript/lib/typescript.js";
import { generateDtsBundle } from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/dts-bundle-generator@9.5.1/node_modules/dts-bundle-generator/dist/bundle-generator.js";
var __vite_injected_original_dirname = "C:\\DEV\\code\\repo\\fatpaper-monopoly\\apps\\map-editor\\plugins";
function generateMonacoDTS() {
  function generateForFile(tsFile) {
    const outDir = path.dirname(tsFile);
    const content = generateDtsBundle(
      [
        {
          filePath: tsFile,
          output: {
            noBanner: true,
            inlineDeclareGlobals: true
          }
        }
      ],
      { preferredConfigPath: path.resolve(__vite_injected_original_dirname, "../../../tsconfig.json") }
    );
    const targetPath = path.join(outDir, path.basename(tsFile, path.extname(tsFile)) + ".d.ts");
    const globalContent = toGlobalDts(content[0]);
    fs.writeFileSync(targetPath, globalContent, "utf8");
    console.log(
      `[monaco-dts] Generated: ${path.relative(process.cwd(), outDir)}\\${path.basename(tsFile, ".ts")}.d.ts`
    );
  }
  function scanAndGenerate() {
    function walk(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          walk(fullPath);
        } else if (file.isFile() && file.name.endsWith(".ts")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.startsWith("//@need-to-parse")) {
            generateForFile(fullPath);
          }
        }
      }
    }
    walk(path.resolve(process.cwd(), "./src"));
  }
  return {
    name: "vite-plugin-generate-monaco-dts",
    buildStart() {
      scanAndGenerate();
    },
    configureServer(server) {
      server.watcher.on("change", (file) => {
        if (file.endsWith(".ts")) {
          const content = fs.readFileSync(file, "utf-8");
          if (content.startsWith("//@need-to-parse")) {
            console.log(`[monaco-dts] Updating ${file}`);
            generateForFile(file);
          }
        }
      });
    }
    // closeBundle() {
    // 	scanAndGenerate();
    // },
  };
}
function toGlobalDts(modularContent) {
  let text = modularContent;
  text = text.replace(/^\s*export\s*\{\s*[^}]*\}\s*;?\s*$/gm, "");
  text = text.replace(/^\s*export\s*;\s*$/gm, "");
  text = text.replace(/\bexport\s+declare\b/g, "declare");
  text = text.replace(/\bexport\s+(interface|type|class|function|const|let|var|namespace)\b/g, "$1");
  text = text.replace(/\bexport\s+default\s+interface\b/g, "interface");
  text = text.replace(/\bexport\s+default\s+class\b/g, "class");
  text = text.replace(/\bexport\s+default\s+type\b/g, "type");
  text = text.replace(/\bexport\s+default\s+function\b/g, "function");
  text = text.replace(/\bexport\s+default\s+/g, "");
  const hasDeclareGlobal = /declare\s+global\s*\{/.test(text);
  text = text.split(/\r?\n/).filter((l, i, arr) => !(l.trim() === "" && arr[i - 1]?.trim() === "")).join("\n").trim();
  text = text.replace(/^\s*export\s*\{\s*\}\s*;?\s*$/gm, "");
  return text + "\n";
}

// package.json
var package_default = {
  name: "@fatpaper-monopoly/map-editor",
  author: "Fat_Paper",
  description: "Mine-Monopoly\u7684\u5730\u56FE\u7F16\u8F91\u5668",
  version: "1.0.0",
  private: true,
  type: "module",
  main: "dist-electron/main.js",
  scripts: {
    dev: "vite",
    build: "node ./scripts/extract-changelog.js && vite build && electron-builder",
    electron: "electron .",
    preview: "vite preview"
  },
  dependencies: {
    "@fatpaper-monopoly/types": "workspace:*",
    "@fatpaper-monopoly/ui": "workspace:*",
    "@fatpaper-monopoly/utils": "workspace:*",
    "electron-updater": "^6.6.2"
  },
  devDependencies: {
    electron: "37.2.6",
    "electron-builder": "26.0.12",
    "electron-log": "^5.4.3",
    "ts-morph": "26.0.0"
  }
};

// vite.config.ts
var __vite_injected_original_dirname2 = "C:\\DEV\\code\\repo\\fatpaper-monopoly\\apps\\map-editor";
var vite_config_default = defineConfig({
  base: "./",
  define: {
    // 注入全局变量
    __APP_VERSION__: JSON.stringify(package_default.version),
    __BUILD_TIME__: JSON.stringify((/* @__PURE__ */ new Date()).toISOString())
  },
  plugins: [
    vue(),
    generateMonacoDTS(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: "less"
          // 使用 Less 样式（Ant Design 默认）
        })
      ],
      dts: true
    }),
    electron({
      main: {
        entry: "electron/main.ts"
      },
      preload: {
        input: path2.join(__vite_injected_original_dirname2, "electron/preload.ts")
      },
      renderer: process.env.NODE_ENV === "test" ? void 0 : {}
    })
  ],
  build: {
    outDir: "dist/frontend"
  },
  resolve: {
    alias: [
      {
        find: "@src",
        replacement: path2.resolve(path2.dirname("./"), "src")
      }
    ]
  },
  worker: {
    format: "es"
    // 重要：让 worker 用 ESM 格式
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1nZW5lcmF0ZS1tb25hY28tZHRzLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXERFVlxcXFxjb2RlXFxcXHJlcG9cXFxcZmF0cGFwZXItbW9ub3BvbHlcXFxcYXBwc1xcXFxtYXAtZWRpdG9yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcbWFwLWVkaXRvclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovREVWL2NvZGUvcmVwby9mYXRwYXBlci1tb25vcG9seS9hcHBzL21hcC1lZGl0b3Ivdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IGVsZWN0cm9uIGZyb20gXCJ2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcclxuaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbmltcG9ydCBtb25hY29FZGl0b3JQbHVnaW4gZnJvbSBcInZpdGUtcGx1Z2luLW1vbmFjby1lZGl0b3ItZXNtXCI7XHJcbmltcG9ydCBnZW5lcmF0ZU1vbmFjb0RUUyBmcm9tIFwiLi9wbHVnaW5zL3ZpdGUtcGx1Z2luLWdlbmVyYXRlLW1vbmFjby1kdHNcIjtcclxuaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblx0YmFzZTogXCIuL1wiLFxyXG5cdGRlZmluZToge1xyXG5cdFx0Ly8gXHU2Q0U4XHU1MTY1XHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHJcblx0XHRfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHBrZy52ZXJzaW9uKSxcclxuXHRcdF9fQlVJTERfVElNRV9fOiBKU09OLnN0cmluZ2lmeShuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpLFxyXG5cdH0sXHJcblx0cGx1Z2luczogW1xyXG5cdFx0dnVlKCksXHJcblx0XHRnZW5lcmF0ZU1vbmFjb0RUUygpLFxyXG5cdFx0Q29tcG9uZW50cyh7XHJcblx0XHRcdHJlc29sdmVyczogW1xyXG5cdFx0XHRcdEFudERlc2lnblZ1ZVJlc29sdmVyKHtcclxuXHRcdFx0XHRcdGltcG9ydFN0eWxlOiBcImxlc3NcIiwgLy8gXHU0RjdGXHU3NTI4IExlc3MgXHU2ODM3XHU1RjBGXHVGRjA4QW50IERlc2lnbiBcdTlFRDhcdThCQTRcdUZGMDlcclxuXHRcdFx0XHR9KSxcclxuXHRcdFx0XSxcclxuXHRcdFx0ZHRzOiB0cnVlLFxyXG5cdFx0fSksXHJcblx0XHRlbGVjdHJvbih7XHJcblx0XHRcdG1haW46IHtcclxuXHRcdFx0XHRlbnRyeTogXCJlbGVjdHJvbi9tYWluLnRzXCIsXHJcblx0XHRcdH0sXHJcblx0XHRcdHByZWxvYWQ6IHtcclxuXHRcdFx0XHRpbnB1dDogcGF0aC5qb2luKF9fZGlybmFtZSwgXCJlbGVjdHJvbi9wcmVsb2FkLnRzXCIpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZW5kZXJlcjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiID8gdW5kZWZpbmVkIDoge30sXHJcblx0XHR9KSxcclxuXHRdLFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRvdXREaXI6IFwiZGlzdC9mcm9udGVuZFwiLFxyXG5cdH0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0YWxpYXM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGZpbmQ6IFwiQHNyY1wiLFxyXG5cdFx0XHRcdHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKFwiLi9cIiksIFwic3JjXCIpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XSxcclxuXHR9LFxyXG5cdHdvcmtlcjoge1xyXG5cdFx0Zm9ybWF0OiBcImVzXCIsIC8vIFx1OTFDRFx1ODk4MVx1RkYxQVx1OEJBOSB3b3JrZXIgXHU3NTI4IEVTTSBcdTY4M0NcdTVGMEZcclxuXHR9LFxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcbWFwLWVkaXRvclxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcbWFwLWVkaXRvclxcXFxwbHVnaW5zXFxcXHZpdGUtcGx1Z2luLWdlbmVyYXRlLW1vbmFjby1kdHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0RFVi9jb2RlL3JlcG8vZmF0cGFwZXItbW9ub3BvbHkvYXBwcy9tYXAtZWRpdG9yL3BsdWdpbnMvdml0ZS1wbHVnaW4tZ2VuZXJhdGUtbW9uYWNvLWR0cy50c1wiO2ltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHRzIGZyb20gXCJ0eXBlc2NyaXB0XCI7XHJcbmltcG9ydCB7IGdlbmVyYXRlRHRzQnVuZGxlIH0gZnJvbSBcImR0cy1idW5kbGUtZ2VuZXJhdG9yXCI7XHJcblxyXG5mdW5jdGlvbiByZWFkVHNDb25maWcoKSB7XHJcblx0Y29uc3QgdHNjb25maWdQYXRoID0gdHMuZmluZENvbmZpZ0ZpbGUocHJvY2Vzcy5jd2QoKSwgdHMuc3lzLmZpbGVFeGlzdHMsIFwidHNjb25maWcuanNvblwiKTtcclxuXHRpZiAoIXRzY29uZmlnUGF0aCkgcmV0dXJuIHt9O1xyXG5cdGNvbnN0IGNvbmZpZ0ZpbGUgPSB0cy5yZWFkQ29uZmlnRmlsZSh0c2NvbmZpZ1BhdGgsIHRzLnN5cy5yZWFkRmlsZSk7XHJcblx0Y29uc3QgcGFyc2VkID0gdHMucGFyc2VKc29uQ29uZmlnRmlsZUNvbnRlbnQoY29uZmlnRmlsZS5jb25maWcsIHRzLnN5cywgcGF0aC5kaXJuYW1lKHRzY29uZmlnUGF0aCkpO1xyXG5cdHJldHVybiBwYXJzZWQub3B0aW9ucztcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGVNb25hY29EVFMoKSB7XHJcblx0Ly8gXHU3NTFGXHU2MjEwXHU1MzU1XHU0RTJBXHU2NTg3XHU0RUY2XHU3Njg0IGQudHNcclxuXHRmdW5jdGlvbiBnZW5lcmF0ZUZvckZpbGUodHNGaWxlOiBzdHJpbmcpIHtcclxuXHRcdGNvbnN0IG91dERpciA9IHBhdGguZGlybmFtZSh0c0ZpbGUpO1xyXG5cclxuXHRcdGNvbnN0IGNvbnRlbnQgPSBnZW5lcmF0ZUR0c0J1bmRsZShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGZpbGVQYXRoOiB0c0ZpbGUsXHJcblx0XHRcdFx0XHRvdXRwdXQ6IHtcclxuXHRcdFx0XHRcdFx0bm9CYW5uZXI6IHRydWUsXHJcblx0XHRcdFx0XHRcdGlubGluZURlY2xhcmVHbG9iYWxzOiB0cnVlLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0XHR7IHByZWZlcnJlZENvbmZpZ1BhdGg6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vdHNjb25maWcuanNvblwiKSB9XHJcblx0XHQpO1xyXG5cdFx0Ly8gXHU4RjkzXHU1MUZBXHU2NTg3XHU0RUY2XHU1NDBEID0gXHU2RTkwXHU2NTg3XHU0RUY2XHU1NDBDXHU1NDBEXHVGRjBDXHU0RjQ2XHU2MjY5XHU1QzU1XHU1NDBEXHU2NTM5XHU0RTNBIC5kLnRzXHJcblx0XHRjb25zdCB0YXJnZXRQYXRoID0gcGF0aC5qb2luKG91dERpciwgcGF0aC5iYXNlbmFtZSh0c0ZpbGUsIHBhdGguZXh0bmFtZSh0c0ZpbGUpKSArIFwiLmQudHNcIik7XHJcblxyXG5cdFx0Y29uc3QgZ2xvYmFsQ29udGVudCA9IHRvR2xvYmFsRHRzKGNvbnRlbnRbMF0pO1xyXG5cclxuXHRcdGZzLndyaXRlRmlsZVN5bmModGFyZ2V0UGF0aCwgZ2xvYmFsQ29udGVudCwgXCJ1dGY4XCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXHJcblx0XHRcdGBbbW9uYWNvLWR0c10gR2VuZXJhdGVkOiAke3BhdGgucmVsYXRpdmUocHJvY2Vzcy5jd2QoKSwgb3V0RGlyKX1cXFxcJHtwYXRoLmJhc2VuYW1lKHRzRmlsZSwgXCIudHNcIil9LmQudHNgXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0Ly8gXHU2MjZCXHU2M0NGIHNyYyBcdTRFMEJcdTVFMjYgLy9AbmVlZC10by1wYXJzZSBcdTc2ODQgdHMgXHU2NTg3XHU0RUY2XHJcblx0ZnVuY3Rpb24gc2NhbkFuZEdlbmVyYXRlKCkge1xyXG5cdFx0ZnVuY3Rpb24gd2FsayhkaXI6IHN0cmluZykge1xyXG5cdFx0XHRjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGRpciwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xyXG5cdFx0XHRmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcclxuXHRcdFx0XHRjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihkaXIsIGZpbGUubmFtZSk7XHJcblx0XHRcdFx0aWYgKGZpbGUuaXNEaXJlY3RvcnkoKSkge1xyXG5cdFx0XHRcdFx0d2FsayhmdWxsUGF0aCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChmaWxlLmlzRmlsZSgpICYmIGZpbGUubmFtZS5lbmRzV2l0aChcIi50c1wiKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmdWxsUGF0aCwgXCJ1dGYtOFwiKTtcclxuXHRcdFx0XHRcdGlmIChjb250ZW50LnN0YXJ0c1dpdGgoXCIvL0BuZWVkLXRvLXBhcnNlXCIpKSB7XHJcblx0XHRcdFx0XHRcdGdlbmVyYXRlRm9yRmlsZShmdWxsUGF0aCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR3YWxrKHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcIi4vc3JjXCIpKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRuYW1lOiBcInZpdGUtcGx1Z2luLWdlbmVyYXRlLW1vbmFjby1kdHNcIixcclxuXHRcdGJ1aWxkU3RhcnQoKSB7XHJcblx0XHRcdHNjYW5BbmRHZW5lcmF0ZSgpO1xyXG5cdFx0fSxcclxuXHRcdGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXI6IGFueSkge1xyXG5cdFx0XHRzZXJ2ZXIud2F0Y2hlci5vbihcImNoYW5nZVwiLCAoZmlsZTogYW55KSA9PiB7XHJcblx0XHRcdFx0aWYgKGZpbGUuZW5kc1dpdGgoXCIudHNcIikpIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgXCJ1dGYtOFwiKTtcclxuXHRcdFx0XHRcdGlmIChjb250ZW50LnN0YXJ0c1dpdGgoXCIvL0BuZWVkLXRvLXBhcnNlXCIpKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGBbbW9uYWNvLWR0c10gVXBkYXRpbmcgJHtmaWxlfWApO1xyXG5cdFx0XHRcdFx0XHRnZW5lcmF0ZUZvckZpbGUoZmlsZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHQvLyBjbG9zZUJ1bmRsZSgpIHtcclxuXHRcdC8vIFx0c2NhbkFuZEdlbmVyYXRlKCk7XHJcblx0XHQvLyB9LFxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvR2xvYmFsRHRzKG1vZHVsYXJDb250ZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdGxldCB0ZXh0ID0gbW9kdWxhckNvbnRlbnQ7XHJcblxyXG5cdC8vIDEpIFx1NTNCQlx1NjM4OSBcImV4cG9ydCB7fTtcIiBcdTRFRTVcdTUzQ0FcdTVCRkNcdTUxRkFcdTk2QzZcdTU0MDggXCJleHBvcnQgeyBBLCBCIH1cIlxyXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoL15cXHMqZXhwb3J0XFxzKlxce1xccypbXn1dKlxcfVxccyo7P1xccyokL2dtLCBcIlwiKTtcclxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzKmV4cG9ydFxccyo7XFxzKiQvZ20sIFwiXCIpOyAvLyBcdTRGRERcdTk2NjlcclxuXHJcblx0Ly8gMikgXHU2MjhBXHU1RTM4XHU4OUMxXHU3Njg0XHU1QkZDXHU1MUZBXHU2ODA3XHU4QkIwXHU1M0JCXHU2Mzg5XHVGRjFBZXhwb3J0IGRlY2xhcmUgLyBleHBvcnQgaW50ZXJmYWNlIC8gZXhwb3J0IHR5cGUgLyBleHBvcnQgY2xhc3MgLyBleHBvcnQgZnVuY3Rpb24gLyBleHBvcnQgY29uc3QgLyBleHBvcnQgbGV0IC8gZXhwb3J0IHZhciAvIGV4cG9ydCBuYW1lc3BhY2VcclxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXGJleHBvcnRcXHMrZGVjbGFyZVxcYi9nLCBcImRlY2xhcmVcIik7XHJcblx0dGV4dCA9IHRleHQucmVwbGFjZSgvXFxiZXhwb3J0XFxzKyhpbnRlcmZhY2V8dHlwZXxjbGFzc3xmdW5jdGlvbnxjb25zdHxsZXR8dmFyfG5hbWVzcGFjZSlcXGIvZywgXCIkMVwiKTtcclxuXHJcblx0Ly8gMykgXHU1OTA0XHU3NDA2IFwiZXhwb3J0IGRlZmF1bHRcIlx1RkYwOFx1NUMzRFx1OTFDRlx1NEZERFx1NzU1OVx1NThGMFx1NjYwRVx1RkYwQ1x1NTNCQlx1NjM4OSBkZWZhdWx0XHVGRjA5XHJcblx0Ly8gICAgLSBleHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgWCAtPiBpbnRlcmZhY2UgWFxyXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcYmV4cG9ydFxccytkZWZhdWx0XFxzK2ludGVyZmFjZVxcYi9nLCBcImludGVyZmFjZVwiKTtcclxuXHQvLyAgICAtIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFggLT4gY2xhc3MgWFxyXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcYmV4cG9ydFxccytkZWZhdWx0XFxzK2NsYXNzXFxiL2csIFwiY2xhc3NcIik7XHJcblx0Ly8gICAgLSBleHBvcnQgZGVmYXVsdCB0eXBlIFggPSAuLi4gLT4gdHlwZSBYID0gLi4uXHJcblx0dGV4dCA9IHRleHQucmVwbGFjZSgvXFxiZXhwb3J0XFxzK2RlZmF1bHRcXHMrdHlwZVxcYi9nLCBcInR5cGVcIik7XHJcblx0Ly8gICAgLSBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBYKC4uLikgLT4gZnVuY3Rpb24gWCguLi4pXHJcblx0dGV4dCA9IHRleHQucmVwbGFjZSgvXFxiZXhwb3J0XFxzK2RlZmF1bHRcXHMrZnVuY3Rpb25cXGIvZywgXCJmdW5jdGlvblwiKTtcclxuXHQvLyAgICAtIFx1NUJGOVx1NEU4RVx1NkNBMVx1NjcwOVx1NTQwRFx1NUI1N1x1NzY4NCBkZWZhdWx0XHVGRjA4XHU1QzExXHU4OUMxXHU0RThFIC5kLnRzXHVGRjA5XHVGRjBDXHU3NkY0XHU2M0E1XHU1M0JCXHU2Mzg5IGRlZmF1bHRcclxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXGJleHBvcnRcXHMrZGVmYXVsdFxccysvZywgXCJcIik7XHJcblxyXG5cdC8vIDQpIFx1NTk4Mlx1Njc5Q1x1NURGMlx1N0VDRlx1NUI1OFx1NTcyOCBkZWNsYXJlIGdsb2JhbFx1RkYwQ1x1NUMzMVx1NEUwRFx1NTE4RFx1NTMwNVx1ODhGOVxyXG5cdGNvbnN0IGhhc0RlY2xhcmVHbG9iYWwgPSAvZGVjbGFyZVxccytnbG9iYWxcXHMqXFx7Ly50ZXN0KHRleHQpO1xyXG5cclxuXHQvLyA1KSBcdTZFMDVcdTc0MDZcdTU5MUFcdTRGNTlcdTdBN0FcdTg4NENcclxuXHR0ZXh0ID0gdGV4dFxyXG5cdFx0LnNwbGl0KC9cXHI/XFxuLylcclxuXHRcdC5maWx0ZXIoKGwsIGksIGFycikgPT4gIShsLnRyaW0oKSA9PT0gXCJcIiAmJiBhcnJbaSAtIDFdPy50cmltKCkgPT09IFwiXCIpKVxyXG5cdFx0LmpvaW4oXCJcXG5cIilcclxuXHRcdC50cmltKCk7XHJcblxyXG5cdC8vIDYpIFx1NTMwNVx1NEUwQSBkZWNsYXJlIGdsb2JhbFx1RkYwOFx1OEJBOVx1NUI4M1x1NzcxRlx1NkI2M1x1NjIxMFx1NEUzQVx1NTE2OFx1NUM0MFx1NThGMFx1NjYwRVx1RkYwOVxyXG5cdC8vIGlmICghaGFzRGVjbGFyZUdsb2JhbCkge1xyXG5cdC8vIFx0Ly8gXHU3RjI5XHU4RkRCXHU0RTAwXHU0RTBCXHU2NkY0XHU1OTdEXHU3NzBCXHVGRjA4XHU1M0VGXHU5MDA5XHVGRjA5XHJcblx0Ly8gXHRjb25zdCBpbmRlbnRlZCA9IHRleHRcclxuXHQvLyBcdFx0LnNwbGl0KFwiXFxuXCIpXHJcblx0Ly8gXHRcdC5tYXAoKGwpID0+IChsLnRyaW0oKSA/IFwiICBcIiArIGwgOiBsKSlcclxuXHQvLyBcdFx0LmpvaW4oXCJcXG5cIik7XHJcblx0Ly8gXHR0ZXh0ID0gYGRlY2xhcmUgZ2xvYmFsIHtcXG4ke2luZGVudGVkfVxcbn1cXG5gO1xyXG5cdC8vIH1cclxuXHJcblx0Ly8gNykgXHU3ODZFXHU0RkREXHU2Q0ExXHU2NzA5XHU1OTFBXHU0RjU5XHU3Njg0IGV4cG9ydCB7fSBcdTRFNEJcdTdDN0JcdTZCOEJcdTc1NTlcclxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzKmV4cG9ydFxccypcXHtcXHMqXFx9XFxzKjs/XFxzKiQvZ20sIFwiXCIpO1xyXG5cclxuXHRyZXR1cm4gdGV4dCArIFwiXFxuXCI7XHJcbn1cclxuIiwgIntcblx0XCJuYW1lXCI6IFwiQGZhdHBhcGVyLW1vbm9wb2x5L21hcC1lZGl0b3JcIixcblx0XCJhdXRob3JcIjogXCJGYXRfUGFwZXJcIixcblx0XCJkZXNjcmlwdGlvblwiOiBcIk1pbmUtTW9ub3BvbHlcdTc2ODRcdTU3MzBcdTU2RkVcdTdGMTZcdThGOTFcdTU2NjhcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcblx0XCJwcml2YXRlXCI6IHRydWUsXG5cdFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuXHRcIm1haW5cIjogXCJkaXN0LWVsZWN0cm9uL21haW4uanNcIixcblx0XCJzY3JpcHRzXCI6IHtcblx0XHRcImRldlwiOiBcInZpdGVcIixcblx0XHRcImJ1aWxkXCI6IFwibm9kZSAuL3NjcmlwdHMvZXh0cmFjdC1jaGFuZ2Vsb2cuanMgJiYgdml0ZSBidWlsZCAmJiBlbGVjdHJvbi1idWlsZGVyXCIsXG5cdFx0XCJlbGVjdHJvblwiOiBcImVsZWN0cm9uIC5cIixcblx0XHRcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIlxuXHR9LFxuXHRcImRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJAZmF0cGFwZXItbW9ub3BvbHkvdHlwZXNcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuXHRcdFwiQGZhdHBhcGVyLW1vbm9wb2x5L3VpXCI6IFwid29ya3NwYWNlOipcIixcblx0XHRcIkBmYXRwYXBlci1tb25vcG9seS91dGlsc1wiOiBcIndvcmtzcGFjZToqXCIsXG5cdFx0XCJlbGVjdHJvbi11cGRhdGVyXCI6IFwiXjYuNi4yXCJcblx0fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiZWxlY3Ryb25cIjogXCIzNy4yLjZcIixcblx0XHRcImVsZWN0cm9uLWJ1aWxkZXJcIjogXCIyNi4wLjEyXCIsXG5cdFx0XCJlbGVjdHJvbi1sb2dcIjogXCJeNS40LjNcIixcblx0XHRcInRzLW1vcnBo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Q1IsSUFBSTtBQUFBLElBQ0osa0JBQWtCO0FBQUEsSUFDbEIsV0FBVztBQUFBLE1BQ1YsV0FBVztBQUFBLFFBQ1YscUJBQXFCO0FBQUEsVUFDcEIsYUFBYTtBQUFBO0FBQUEsUUFDZCxDQUFDO0FBQUEsTUFDRjtBQUFBLE1BQ0EsS0FBSztBQUFBLElBQ04sQ0FBQztBQUFBLElBQ0QsU0FBUztBQUFBLE1BQ1IsTUFBTTtBQUFBLFFBQ0wsT0FBTztBQUFBLE1BQ1I7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNSLE9BQU9DLE1BQUssS0FBS0MsbUNBQVcscUJBQXFCO0FBQUEsTUFDbEQ7QUFBQSxNQUNBLFVBQVUsUUFBUSxJQUFJLGFBQWEsU0FBUyxTQUFZLENBQUM7QUFBQSxJQUMxRCxDQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOO0FBQUEsUUFDQyxNQUFNO0FBQUEsUUFDTixhQUFhRCxNQUFLLFFBQVFBLE1BQUssUUFBUSxJQUFJLEdBQUcsS0FBSztBQUFBLE1BQ3BEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNQLFFBQVE7QUFBQTtBQUFBLEVBQ1Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiXQp9Cg==
