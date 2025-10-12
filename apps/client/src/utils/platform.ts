export type Platform = "web" | "PC" | "mobile";

export const getPlatform = (): Platform => {
	if (window.electronAPI) return "PC";
	if (/android|iphone|ipad|ipod/i.test(navigator.userAgent)) return "mobile";
	return "web";
};

export const isWeb = () => getPlatform() === "web";
export const isPC = () => getPlatform() === "PC";
export const isMobile = () => getPlatform() === "mobile";
