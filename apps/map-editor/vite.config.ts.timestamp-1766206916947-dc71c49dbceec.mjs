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
import { generateDtsBundle } from "file:///C:/DEV/code/repo/fatpaper-monopoly/node_modules/.pnpm/dts-bundle-generator@9.5.1/node_modules/dts-bundle-generator/dist/bundle-generator.js";
function generateMonacoDTS() {
  function createTempConfig(workspaceRoot, tempPath) {
    const config = {
      extends: "../../tsconfig.json",
      compilerOptions: {
        baseUrl: "../../",
        paths: {
          "@fatpaper-monopoly/types": ["packages/types/index.ts"]
        },
        rootDir: "../../"
      },
      include: ["../../packages/**/*", "src/**/*"]
    };
    fs.writeFileSync(tempPath, JSON.stringify(config, null, 2), "utf-8");
  }
  function generateForFile(tsFile) {
    const outDir = path.dirname(tsFile);
    const appDir = process.cwd();
    const workspaceRoot = path.resolve(appDir, "../../");
    const tempConfigPath = path.resolve(appDir, "tsconfig.monaco-temp.json");
    console.log(`[monaco-dts] Generating for: ${path.basename(tsFile)}`);
    try {
      createTempConfig(workspaceRoot, tempConfigPath);
      const content = generateDtsBundle(
        [
          {
            filePath: tsFile,
            output: {
              noBanner: true,
              inlineDeclareGlobals: true
            },
            libraries: {
              inlinedLibraries: ["mitt", "@fatpaper-monopoly/types"]
            }
          }
        ],
        {
          preferredConfigPath: tempConfigPath
        }
      );
      const targetPath = path.join(
        outDir,
        path.basename(tsFile, path.extname(tsFile)) + ".d.ts"
      );
      const globalContent = toGlobalDts(content[0]);
      fs.writeFileSync(targetPath, globalContent, "utf8");
      console.log(
        `[monaco-dts] Success: ${path.relative(process.cwd(), targetPath)}`
      );
    } catch (e) {
      console.error(`[monaco-dts] Error processing ${path.basename(tsFile)}:`);
      if (e.message) {
        console.error(e.message.split("\n").slice(0, 8).join("\n"));
      } else {
        console.error(e);
      }
    } finally {
      if (fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath);
      }
    }
  }
  function scanAndGenerate() {
    function walk(dir) {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          walk(fullPath);
        } else if (file.isFile() && file.name.endsWith(".ts")) {
          try {
            const fd = fs.openSync(fullPath, "r");
            const buffer = Buffer.alloc(30);
            fs.readSync(fd, buffer, 0, 30, 0);
            fs.closeSync(fd);
            const NEED_PARSE_FLAG = "//@need-to-parse";
            if (buffer.toString().includes(NEED_PARSE_FLAG)) {
              generateForFile(fullPath);
            }
          } catch (err) {
          }
        }
      }
    }
    walk(path.resolve(process.cwd(), "src"));
  }
  return {
    name: "vite-plugin-generate-monaco-dts",
    buildStart() {
      scanAndGenerate();
    },
    configureServer(server) {
      server.watcher.on("change", (file) => {
        if (file.endsWith(".ts") && fs.existsSync(file)) {
          const content = fs.readFileSync(file, "utf-8");
          if (content.includes("//@need-to-parse")) {
            console.log(`[monaco-dts] File changed: ${path.basename(file)}`);
            generateForFile(file);
          }
        }
      });
    }
  };
}
function toGlobalDts(modularContent) {
  let text = modularContent;
  text = text.replace(/^\s*import\s+.*$/gm, "");
  text = text.replace(/export\s*\{[\s\S]*?\}\s*;?/g, "");
  text = text.replace(/^\s*export\s*\{\s*[^}]*\}\s*;?\s*$/gm, "");
  text = text.replace(/^\s*export\s*;\s*$/gm, "");
  text = text.replace(/^\s*export\s+declare\b/gm, "declare");
  text = text.replace(
    /^\s*export\s+(interface|type|class|function|const|let|var|enum|namespace)\b/gm,
    "$1"
  );
  text = text.replace(/^\s*export\s+default\s+interface\b/gm, "interface");
  text = text.replace(/^\s*export\s+default\s+class\b/gm, "class");
  text = text.replace(/^\s*export\s+default\s+type\b/gm, "type");
  text = text.replace(/^\s*export\s+default\s+function\b/gm, "function");
  text = text.replace(/^\s*export\s+default\s+/gm, "");
  text = text.replace(/declare\s+global\s*\{/g, "");
  text = text.split(/\r?\n/).filter((l, i, arr) => !(l.trim() === "" && arr[i - 1]?.trim() === "")).join("\n").trim();
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
var __vite_injected_original_dirname = "C:\\DEV\\code\\repo\\fatpaper-monopoly\\apps\\map-editor";
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
        input: path2.join(__vite_injected_original_dirname, "electron/preload.ts")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy92aXRlLXBsdWdpbi1nZW5lcmF0ZS1tb25hY28tZHRzLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXERFVlxcXFxjb2RlXFxcXHJlcG9cXFxcZmF0cGFwZXItbW9ub3BvbHlcXFxcYXBwc1xcXFxtYXAtZWRpdG9yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcbWFwLWVkaXRvclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovREVWL2NvZGUvcmVwby9mYXRwYXBlci1tb25vcG9seS9hcHBzL21hcC1lZGl0b3Ivdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IGVsZWN0cm9uIGZyb20gXCJ2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcclxuaW1wb3J0IHsgQW50RGVzaWduVnVlUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbmltcG9ydCBtb25hY29FZGl0b3JQbHVnaW4gZnJvbSBcInZpdGUtcGx1Z2luLW1vbmFjby1lZGl0b3ItZXNtXCI7XHJcbmltcG9ydCBnZW5lcmF0ZU1vbmFjb0RUUyBmcm9tIFwiLi9wbHVnaW5zL3ZpdGUtcGx1Z2luLWdlbmVyYXRlLW1vbmFjby1kdHNcIjtcclxuaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblx0YmFzZTogXCIuL1wiLFxyXG5cdGRlZmluZToge1xyXG5cdFx0Ly8gXHU2Q0U4XHU1MTY1XHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHJcblx0XHRfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHBrZy52ZXJzaW9uKSxcclxuXHRcdF9fQlVJTERfVElNRV9fOiBKU09OLnN0cmluZ2lmeShuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpLFxyXG5cdH0sXHJcblx0cGx1Z2luczogW1xyXG5cdFx0dnVlKCksXHJcblx0XHRnZW5lcmF0ZU1vbmFjb0RUUygpLFxyXG5cdFx0Q29tcG9uZW50cyh7XHJcblx0XHRcdHJlc29sdmVyczogW1xyXG5cdFx0XHRcdEFudERlc2lnblZ1ZVJlc29sdmVyKHtcclxuXHRcdFx0XHRcdGltcG9ydFN0eWxlOiBcImxlc3NcIiwgLy8gXHU0RjdGXHU3NTI4IExlc3MgXHU2ODM3XHU1RjBGXHVGRjA4QW50IERlc2lnbiBcdTlFRDhcdThCQTRcdUZGMDlcclxuXHRcdFx0XHR9KSxcclxuXHRcdFx0XSxcclxuXHRcdFx0ZHRzOiB0cnVlLFxyXG5cdFx0fSksXHJcblx0XHRlbGVjdHJvbih7XHJcblx0XHRcdG1haW46IHtcclxuXHRcdFx0XHRlbnRyeTogXCJlbGVjdHJvbi9tYWluLnRzXCIsXHJcblx0XHRcdH0sXHJcblx0XHRcdHByZWxvYWQ6IHtcclxuXHRcdFx0XHRpbnB1dDogcGF0aC5qb2luKF9fZGlybmFtZSwgXCJlbGVjdHJvbi9wcmVsb2FkLnRzXCIpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZW5kZXJlcjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiID8gdW5kZWZpbmVkIDoge30sXHJcblx0XHR9KSxcclxuXHRdLFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRvdXREaXI6IFwiZGlzdC9mcm9udGVuZFwiLFxyXG5cdH0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0YWxpYXM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGZpbmQ6IFwiQHNyY1wiLFxyXG5cdFx0XHRcdHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKFwiLi9cIiksIFwic3JjXCIpLFxyXG5cdFx0XHR9LFxyXG5cdFx0XSxcclxuXHR9LFxyXG5cdHdvcmtlcjoge1xyXG5cdFx0Zm9ybWF0OiBcImVzXCIsIC8vIFx1OTFDRFx1ODk4MVx1RkYxQVx1OEJBOSB3b3JrZXIgXHU3NTI4IEVTTSBcdTY4M0NcdTVGMEZcclxuXHR9LFxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcbWFwLWVkaXRvclxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxERVZcXFxcY29kZVxcXFxyZXBvXFxcXGZhdHBhcGVyLW1vbm9wb2x5XFxcXGFwcHNcXFxcbWFwLWVkaXRvclxcXFxwbHVnaW5zXFxcXHZpdGUtcGx1Z2luLWdlbmVyYXRlLW1vbmFjby1kdHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0RFVi9jb2RlL3JlcG8vZmF0cGFwZXItbW9ub3BvbHkvYXBwcy9tYXAtZWRpdG9yL3BsdWdpbnMvdml0ZS1wbHVnaW4tZ2VuZXJhdGUtbW9uYWNvLWR0cy50c1wiO2ltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZ2VuZXJhdGVEdHNCdW5kbGUgfSBmcm9tIFwiZHRzLWJ1bmRsZS1nZW5lcmF0b3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdlbmVyYXRlTW9uYWNvRFRTKCkge1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVRlbXBDb25maWcod29ya3NwYWNlUm9vdDogc3RyaW5nLCB0ZW1wUGF0aDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBjb25maWcgPSB7XHJcbiAgICAgIGV4dGVuZHM6IFwiLi4vLi4vdHNjb25maWcuanNvblwiLCBcclxuICAgICAgY29tcGlsZXJPcHRpb25zOiB7XHJcbiAgICAgICAgYmFzZVVybDogXCIuLi8uLi9cIixcclxuICAgICAgICBwYXRoczoge1xyXG4gICAgICAgICAgXCJAZmF0cGFwZXItbW9ub3BvbHkvdHlwZXNcIjogW1wicGFja2FnZXMvdHlwZXMvaW5kZXgudHNcIl0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb290RGlyOiBcIi4uLy4uL1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIGluY2x1ZGU6IFtcIi4uLy4uL3BhY2thZ2VzLyoqLypcIiwgXCJzcmMvKiovKlwiXVxyXG4gICAgfTtcclxuICAgIGZzLndyaXRlRmlsZVN5bmModGVtcFBhdGgsIEpTT04uc3RyaW5naWZ5KGNvbmZpZywgbnVsbCwgMiksICd1dGYtOCcpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuZXJhdGVGb3JGaWxlKHRzRmlsZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBvdXREaXIgPSBwYXRoLmRpcm5hbWUodHNGaWxlKTtcclxuICAgIC8vIFx1ODNCN1x1NTNENlx1NUY1M1x1NTI0RFx1NUU5NFx1NzUyOFx1NzZFRVx1NUY1NSAoYXBwcy9tYXAtZWRpdG9yKVxyXG4gICAgY29uc3QgYXBwRGlyID0gcHJvY2Vzcy5jd2QoKTtcclxuICAgIC8vIFx1ODNCN1x1NTNENiBXb3Jrc3BhY2UgXHU2ODM5XHU3NkVFXHU1RjU1XHJcbiAgICBjb25zdCB3b3Jrc3BhY2VSb290ID0gcGF0aC5yZXNvbHZlKGFwcERpciwgXCIuLi8uLi9cIik7XHJcbiAgICBcclxuICAgIC8vIFx1NzUxRlx1NjIxMFx1NEUzNFx1NjVGNiB0c2NvbmZpZyBcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODRcclxuICAgIGNvbnN0IHRlbXBDb25maWdQYXRoID0gcGF0aC5yZXNvbHZlKGFwcERpciwgXCJ0c2NvbmZpZy5tb25hY28tdGVtcC5qc29uXCIpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBbbW9uYWNvLWR0c10gR2VuZXJhdGluZyBmb3I6ICR7cGF0aC5iYXNlbmFtZSh0c0ZpbGUpfWApO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNyZWF0ZVRlbXBDb25maWcod29ya3NwYWNlUm9vdCwgdGVtcENvbmZpZ1BhdGgpO1xyXG5cclxuICAgICAgY29uc3QgY29udGVudCA9IGdlbmVyYXRlRHRzQnVuZGxlKFxyXG4gICAgICAgIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZmlsZVBhdGg6IHRzRmlsZSxcclxuICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgbm9CYW5uZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgaW5saW5lRGVjbGFyZUdsb2JhbHM6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpYnJhcmllczoge1xyXG4gICAgICAgICAgICAgIGlubGluZWRMaWJyYXJpZXM6IFtcIm1pdHRcIiwgXCJAZmF0cGFwZXItbW9ub3BvbHkvdHlwZXNcIl0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJlZmVycmVkQ29uZmlnUGF0aDogdGVtcENvbmZpZ1BhdGgsXHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgY29uc3QgdGFyZ2V0UGF0aCA9IHBhdGguam9pbihcclxuICAgICAgICBvdXREaXIsXHJcbiAgICAgICAgcGF0aC5iYXNlbmFtZSh0c0ZpbGUsIHBhdGguZXh0bmFtZSh0c0ZpbGUpKSArIFwiLmQudHNcIlxyXG4gICAgICApO1xyXG5cclxuICAgICAgY29uc3QgZ2xvYmFsQ29udGVudCA9IHRvR2xvYmFsRHRzKGNvbnRlbnRbMF0pO1xyXG5cclxuICAgICAgZnMud3JpdGVGaWxlU3luYyh0YXJnZXRQYXRoLCBnbG9iYWxDb250ZW50LCBcInV0ZjhcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgIGBbbW9uYWNvLWR0c10gU3VjY2VzczogJHtwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIHRhcmdldFBhdGgpfWBcclxuICAgICAgKTtcclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGBbbW9uYWNvLWR0c10gRXJyb3IgcHJvY2Vzc2luZyAke3BhdGguYmFzZW5hbWUodHNGaWxlKX06YCk7XHJcbiAgICAgIGlmIChlLm1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZS5zcGxpdChcIlxcblwiKS5zbGljZSgwLCA4KS5qb2luKFwiXFxuXCIpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICB9XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyh0ZW1wQ29uZmlnUGF0aCkpIHtcclxuICAgICAgICBmcy51bmxpbmtTeW5jKHRlbXBDb25maWdQYXRoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2NhbkFuZEdlbmVyYXRlKCkge1xyXG4gICAgZnVuY3Rpb24gd2FsayhkaXI6IHN0cmluZykge1xyXG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZGlyKSkgcmV0dXJuO1xyXG4gICAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGRpciwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XHJcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyLCBmaWxlLm5hbWUpO1xyXG4gICAgICAgIGlmIChmaWxlLmlzRGlyZWN0b3J5KCkpIHtcclxuICAgICAgICAgIHdhbGsoZnVsbFBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZmlsZS5pc0ZpbGUoKSAmJiBmaWxlLm5hbWUuZW5kc1dpdGgoXCIudHNcIikpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZkID0gZnMub3BlblN5bmMoZnVsbFBhdGgsIFwiclwiKTtcclxuICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmFsbG9jKDMwKTtcclxuICAgICAgICAgICAgZnMucmVhZFN5bmMoZmQsIGJ1ZmZlciBhcyBhbnksIDAsIDMwLCAwKTtcclxuICAgICAgICAgICAgZnMuY2xvc2VTeW5jKGZkKTtcclxuXHJcblx0XHRcdFx0XHRcdGNvbnN0IE5FRURfUEFSU0VfRkxBRyA9IFwiLy9cIiArIFwiQG5lZWQtdG8tcGFyc2VcIjtcclxuICAgICAgICAgICAgaWYgKGJ1ZmZlci50b1N0cmluZygpLmluY2x1ZGVzKE5FRURfUEFSU0VfRkxBRykpIHtcclxuICAgICAgICAgICAgICBnZW5lcmF0ZUZvckZpbGUoZnVsbFBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgLy8gaWdub3JlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB3YWxrKHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInNyY1wiKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogXCJ2aXRlLXBsdWdpbi1nZW5lcmF0ZS1tb25hY28tZHRzXCIsXHJcbiAgICBidWlsZFN0YXJ0KCkge1xyXG4gICAgICBzY2FuQW5kR2VuZXJhdGUoKTtcclxuICAgIH0sXHJcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyOiBhbnkpIHtcclxuICAgICAgc2VydmVyLndhdGNoZXIub24oXCJjaGFuZ2VcIiwgKGZpbGU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKFwiLnRzXCIpICYmIGZzLmV4aXN0c1N5bmMoZmlsZSkpIHtcclxuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgXCJ1dGYtOFwiKTtcclxuICAgICAgICAgIGlmIChjb250ZW50LmluY2x1ZGVzKFwiLy9AbmVlZC10by1wYXJzZVwiKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW21vbmFjby1kdHNdIEZpbGUgY2hhbmdlZDogJHtwYXRoLmJhc2VuYW1lKGZpbGUpfWApO1xyXG4gICAgICAgICAgICBnZW5lcmF0ZUZvckZpbGUoZmlsZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFx1NUMwNiBkLnRzIFx1NjI0MVx1NUU3M1x1NTMxNlx1NTkwNFx1NzQwNlxyXG4gKi9cclxuZnVuY3Rpb24gdG9HbG9iYWxEdHMobW9kdWxhckNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgbGV0IHRleHQgPSBtb2R1bGFyQ29udGVudDtcclxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzKmltcG9ydFxccysuKiQvZ20sIFwiXCIpO1xyXG4gIHRleHQgPSB0ZXh0LnJlcGxhY2UoL2V4cG9ydFxccypcXHtbXFxzXFxTXSo/XFx9XFxzKjs/L2csIFwiXCIpO1xyXG4gIHRleHQgPSB0ZXh0LnJlcGxhY2UoL15cXHMqZXhwb3J0XFxzKlxce1xccypbXn1dKlxcfVxccyo7P1xccyokL2dtLCBcIlwiKTtcclxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzKmV4cG9ydFxccyo7XFxzKiQvZ20sIFwiXCIpO1xyXG4gIHRleHQgPSB0ZXh0LnJlcGxhY2UoL15cXHMqZXhwb3J0XFxzK2RlY2xhcmVcXGIvZ20sIFwiZGVjbGFyZVwiKTtcclxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKFxyXG4gICAgL15cXHMqZXhwb3J0XFxzKyhpbnRlcmZhY2V8dHlwZXxjbGFzc3xmdW5jdGlvbnxjb25zdHxsZXR8dmFyfGVudW18bmFtZXNwYWNlKVxcYi9nbSxcclxuICAgIFwiJDFcIlxyXG4gICk7XHJcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXlxccypleHBvcnRcXHMrZGVmYXVsdFxccytpbnRlcmZhY2VcXGIvZ20sIFwiaW50ZXJmYWNlXCIpO1xyXG4gIHRleHQgPSB0ZXh0LnJlcGxhY2UoL15cXHMqZXhwb3J0XFxzK2RlZmF1bHRcXHMrY2xhc3NcXGIvZ20sIFwiY2xhc3NcIik7XHJcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXlxccypleHBvcnRcXHMrZGVmYXVsdFxccyt0eXBlXFxiL2dtLCBcInR5cGVcIik7XHJcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXlxccypleHBvcnRcXHMrZGVmYXVsdFxccytmdW5jdGlvblxcYi9nbSwgXCJmdW5jdGlvblwiKTtcclxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzKmV4cG9ydFxccytkZWZhdWx0XFxzKy9nbSwgXCJcIik7XHJcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvZGVjbGFyZVxccytnbG9iYWxcXHMqXFx7L2csIFwiXCIpO1xyXG4gIHRleHQgPSB0ZXh0XHJcbiAgICAuc3BsaXQoL1xccj9cXG4vKVxyXG4gICAgLmZpbHRlcigobCwgaSwgYXJyKSA9PiAhKGwudHJpbSgpID09PSBcIlwiICYmIGFycltpIC0gMV0/LnRyaW0oKSA9PT0gXCJcIikpXHJcbiAgICAuam9pbihcIlxcblwiKVxyXG4gICAgLnRyaW0oKTtcclxuICByZXR1cm4gdGV4dCArIFwiXFxuXCI7XHJcbn0iLCAie1xuXHRcIm5hbWVcIjogXCJAZmF0cGFwZXItbW9ub3BvbHkvbWFwLWVkaXRvclwiLFxuXHRcImF1dGhvclwiOiBcIkZhdF9QYXBlclwiLFxuXHRcImRlc2NyaXB0aW9uXCI6IFwiTWluZS1Nb25vcG9seVx1NzY4NFx1NTczMFx1NTZGRVx1N0YxNlx1OEY5MVx1NTY2OFwiLFxuXHRcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuXHRcInByaXZhdGVcIjogdHJ1ZSxcblx0XCJ0eXBlXCI6IFwibW9kdWxlXCIsXG5cdFwibWFpblwiOiBcImRpc3QtZWxlY3Ryb24vbWFpbi5qc1wiLFxuXHRcInNjcmlwdHNcIjoge1xuXHRcdFwiZGV2XCI6IFwidml0ZVwiLFxuXHRcdFwiYnVpbGRcIjogXCJub2RlIC4vc2NyaXB0cy9leHRyYWN0LWNoYW5nZWxvZy5qcyAmJiB2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXJcIixcblx0XHRcImVsZWN0cm9uXCI6IFwiZWxlY3Ryb24gLlwiLFxuXHRcdFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiXG5cdH0sXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcIkBmYXRwYXBlci1tb25vcG9seS90eXBlc1wiOiBcIndvcmtzcGFjZToqXCIsXG5cdFx0XCJAZmF0cGFwZXItbW9ub3BvbHkvdWlcIjogXCJ3b3Jrc3BhY2U6KlwiLFxuXHRcdFwiQGZhdHBhcGVyLW1vbm9wb2x5L3V0aWxzXCI6IFwid29ya3NwYWNlOipcIixcblx0XHRcImVsZWN0cm9uLXVwZGF0ZXJcIjogXCJeNi42LjJcIlxuXHR9LFxuXHRcImRldkRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJlbGVjdHJvblwiOiBcIjM3LjIuNlwiLFxuXHRcdFwiZWxlY3Ryb24tYnVpbGRlclwiOiBcIjI2LjAuMTJcIixcblx0XHRcImVsZWN0cm9uLWxvZ1wiOiBcIl41LjQuM1wiLFxuXHRcdFwidHMtbW9ycGhcIjogXCIyNi4wLjBcIlxuXHR9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNWLFNBQVMsb0JBQW9CO0FBQ25YLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFDckIsT0FBT0Es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
