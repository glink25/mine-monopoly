# 开发指南

## 关键概念

### 游戏进程

核心逻辑在 `GameProcessWorker` (Web Worker) 中运行，确保游戏逻辑不阻塞 UI 渲染。

**关键文件：**
- 实现: [apps/client/src/core/worker/GameProcessWorker.ts](../apps/client/src/core/worker/GameProcessWorker.ts)
- 类型定义: [packages/types/interfaces/game/game-process/](../packages/types/interfaces/game/game-process/)

**核心系统：**
- **命令模式** - 实现游戏动作的封装和执行
- **修饰器系统** - 动态扩展命令功能
- **阶段系统** - 管理游戏流程和状态转换
- **事件总线** - 处理组件间通信

### 通信协议

类型安全的 Socket 消息系统，确保前后端通信的可靠性。

**关键文件：**
- 类型定义: [packages/types/interfaces/game/socket.ts](../packages/types/interfaces/game/socket.ts)

**特性：**
- TypeScript 类型安全
- Protocol Buffers 高效序列化
- 消息类型验证

### 地图系统

基于 Protocol Buffers 的地图数据存储和加载系统。

**关键文件：**
- Proto 定义: [packages/utils/protos/game-map.proto](../packages/utils/protos/game-map.proto)

**特性：**
- 二进制序列化，体积小、加载快
- 类型安全的地图数据结构
- MySQL 数据库存储
- 支持地图版本管理和分享

## 开发规范

### 通用规范

- **使用中文**：回复、代码注释、Git 提交信息都必须使用中文
- **类型导入**：始终从 `@mine-monopoly/types` 导入类型
- **环境变量**：从 `@mine-monopoly/env` 导入，不要直接使用 `process.env`
- **工作区协议**：包间依赖使用 `workspace:*`

### Git 规范

- ❌ 禁止包含 `Co-Authored-By: Claude Sonnet` 等 AI 签名
- ✅ 使用纯用户身份提交，提交信息用中文清晰描述变更
- ✅ 完成相关任务后，使用 `git reset --soft HEAD~N` 合并小提交
- ❌ 不提交设计文档和计划，只提交代码和用户文档

### 临时文件管理

- ✅ 所有临时文件保存到 `/temp` 文件夹
- ❌ 不要在项目根目录创建临时文件

## 重要注意事项

### Monaco Editor 类型定义

所有 `editor-lib.d.ts` 文件由 Vite 插件自动生成，**不要手动编辑**。

- 修改源类型：`packages/types/interfaces/game/action-system/command.ts`
- 重启开发服务器应用更改：`pnpm dev-client` 或 `pnpm dev-editor`

### FontAwesome 图标

添加新图标时必须在 `apps/client/src/main.ts` 更新：

```typescript
import { faGear, faNewIcon } from "@fortawesome/free-solid-svg-icons";
library.add(faGear, faNewIcon);
```

### TypeORM 实体更新

修改 `apps/server/src/db/entities/` 后，确保启用数据库模式同步或运行迁移。

### Electron 应用

- 构建流程：`vite build` → `electron-builder`
- 入口点：`dist-electron/main.js`
- 使用 file:// 协议（需要 hash 路由）

## 项目结构

```
mine-monopoly/
├── apps/
│   ├── client/         # 游戏客户端 (Vue 3 + Vite + Electron)
│   ├── server/         # 游戏服务器 (Express + TypeORM + MySQL)
│   ├── admin/          # 管理后台 (Vue 3 + Vite)
│   └── map-editor/     # 地图编辑器 (Vue 3 + Vite + Electron)
├── packages/
│   ├── types/          # TypeScript 类型定义
│   ├── env/            # 环境变量包（带类型验证）
│   ├── utils/          # 共享工具 (protobuf, three.js)
│   └── components/     # 共享 Vue 组件 (login, ui)
├── docs/               # 项目文档
└── pnpm-workspace.yaml
```

## 常用命令

```bash
pnpm install           # 安装所有依赖
pnpm dev-client        # 启动客户端 (http://localhost:5173)
pnpm dev-server        # 启动服务器
pnpm dev-editor        # 启动地图编辑器
pnpm build-client      # 构建客户端 + Electron
pnpm build-editor      # 构建地图编辑器
```

## 主要依赖

- `vue@3.5.18`, `pinia@2.0.33`, `vue-router@4.6.3`
- `three@0.179.1`, `pixi.js@8.14.0` (渲染)
- `protobufjs@7.5.3` (序列化)
- `peerjs@1.5.4` (WebRTC)
- `ant-design-vue@4.2.6` (UI)
- `monaco-editor@0.50.0` (代码编辑器)
