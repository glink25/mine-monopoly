/**
 * 平台初始化入口
 *
 * 根据运行时环境动态加载对应平台实现，
 * 将 platformAPI / updateAPI 注入到 window 上。
 */
import { getPlatformType } from "@src/utils/platform";

let initialized = false;

/**
 * 初始化当前平台
 *
 * 在应用启动时调用一次，确保所有平台 API 可用。
 */
export async function initPlatform(): Promise<void> {
	if (initialized) return;
	initialized = true;

	const type = getPlatformType();

	try {
		switch (type) {
		case "electron": {
			// Electron — preload 已通过 contextBridge 暴露了 updateAPI（只读），
			// 我们只需设置 platformAPI 即可
			const { createElectronPlatform } = await import("./electron");
			window.platformAPI = createElectronPlatform();
			break;
		}

		case "capacitor": {
			const { createCapacitorPlatform, createCapacitorUpdateAPI } = await import("./capacitor");
			window.platformAPI = createCapacitorPlatform();
			window.updateAPI = createCapacitorUpdateAPI();
			break;
		}

		default: {
			// Web (及 UA 检测为 mobile 的非 Capacitor 浏览器)
			const { createWebPlatform } = await import("./web");
			const { createWebUpdateAPI } = await import("./web/update");
			window.platformAPI = createWebPlatform();
			window.updateAPI = createWebUpdateAPI();
			break;
		}
		}
	} catch (err) {
		console.error(`[Platform] 初始化失败 (${type}):`, err);
		// 降级为 Web 平台避免应用无法启动
		if (type !== "web") {
			const { createWebPlatform } = await import("./web");
			window.platformAPI = createWebPlatform();
		}
	}

	console.log(`[Platform] 已初始化: ${type}`);
}
