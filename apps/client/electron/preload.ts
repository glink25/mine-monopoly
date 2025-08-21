import {
	ipcRenderer,
	contextBridge,
	OpenDialogOptions,
	SaveDialogOptions,
	OpenDialogReturnValue,
	SaveDialogReturnValue,
} from "electron";
import { version } from "../package.json";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("electronAPI", {
	//窗口事件相关
	minimize: () => ipcRenderer.send("window-minimize"),
	isMaximized: () => ipcRenderer.invoke("window-is-maximized"),
	maximize: () => ipcRenderer.send("window-maximize"),
	unmaximize: () => ipcRenderer.send("window-unmaximize"),
	close: () => ipcRenderer.send("window-close"),
	getVersion: () => version,
});
