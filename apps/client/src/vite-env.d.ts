/// <reference types="vite/client" />

// ========== 平台 API 类型（源定义见 src/platform/types.ts） ==========

declare global {
	interface Window {
		platformAPI?: import("./platform/types").PlatformAPI;
	}
}

declare module "*.md?raw" {
	const content: string;
	export default content;
}

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
