/**
 * Capacitor 平台实现（Android / iOS）
 *
 * 当前复用 Web 平台实现。随着 Capacitor 原生插件的集成，
 * 可逐步添加原生能力（如文件系统、推送、应用更新等）。
 */
import type { PlatformAPI, UpdateAPI } from "../types";
import { createWebPlatform } from "../web";
import { createWebUpdateAPI } from "../web/update";

/**
 * 创建 Capacitor 平台的 PlatformAPI 实现
 *
 * 目前完全复用 Web 平台能力。
 */
export function createCapacitorPlatform(): PlatformAPI {
	return createWebPlatform();
}

/**
 * Capacitor 平台更新 API
 * 可扩展为使用 @capacitor/app-update 或跳转应用商店
 */
export function createCapacitorUpdateAPI(): UpdateAPI {
	return createWebUpdateAPI();
}
