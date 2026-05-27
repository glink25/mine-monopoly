<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { useEditorStore, useMapDataStore, useResourceStore } from "@src/stores";
import {
	handleNewProtoFile,
	handleOpenProtoFile,
	handleSaveAsOtherProtoFile,
	handleSaveProtoFile,
	exportGameMapToProductFile,
} from "@src/utils/file";
import MCPControlPanel from "@src/components/mcp/MCPControlPanel.vue";
import ExportProgressDialog from "./export-progress-dialog.vue";
import { eventBus } from "@src/utils/event-bus";

const editorStore = useEditorStore();
const modLabel = navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl";

const mcpPanelVisible = ref(false);
const mcpPanelRef = ref();

// 导出进度状态
const exportProgressVisible = ref(false);
const exportProgressPercent = ref(0);
const exportProgressStage = ref("");

// 文件下拉菜单项点击处理
type FileMenuKey = "new" | "open" | "save" | "saveas" | "exportmmmap";
function handleFileMenuClick({ key }: { key: FileMenuKey }) {
	switch (key) {
		case "new":
			handleNewProtoFile();
			break;
		case "open":
			handleOpenProtoFile();
			break;
		case "save":
			handleSaveProtoFile();
			break;
		case "saveas":
			handleSaveAsOtherProtoFile();
			break;
		case "exportmmmap":
			handleExportMmmapFile();
			break;
	}
}

function openMCPPanel() {
	mcpPanelVisible.value = true;
}

async function handleExportMmmapFile() {
	const mapDataStore = useMapDataStore();
	const editorStore = useEditorStore();

	const res = await window.electronAPI.showSaveDialog({
		title: "导出 .mmmap 产品文件",
		filters: [{ name: "地图产品文件", extensions: ["mmmap"] }],
	});

	const path = res.filePath;
	if (!path) return;

	// 显示进度对话框
	exportProgressVisible.value = true;
	exportProgressPercent.value = 0;
	exportProgressStage.value = "准备中...";

	try {
		await exportGameMapToProductFile(
			mapDataStore.id,
			path,
			mapDataStore.$state,
			(stage, percent) => {
				exportProgressStage.value = stage;
				exportProgressPercent.value = percent;
			}
		);

		// 导出成功，短暂延迟后关闭对话框
		exportProgressStage.value = "导出完成";
		exportProgressPercent.value = 100;

		setTimeout(() => {
			exportProgressVisible.value = false;
			message.success("导出 .mmmap 文件成功", 1);
		}, 500);
	} catch (error) {
		console.error("导出 .mmmap 文件失败:", error);
		exportProgressVisible.value = false;
		message.error(`导出失败: ${error instanceof Error ? error.message : "未知错误"}`);
	}
}

function handleUndoDelete() {
	eventBus.emit("undo-delete");
}

function handleReloadMap() {
	const mapDataStore = useMapDataStore();
	// 触发 map-loaded 事件，让渲染器重新加载当前地图数据
	eventBus.emit("map-loaded", mapDataStore.$state);
	message.success("地图已重新渲染");
}
</script>

<template>
	<div class="top-panel-container">
		<div class="top-panel left">
			<!-- 文件下拉菜单 -->
			<a-dropdown trigger="['click']">
				<a-button class="menu-button" size="small" type="text">
					<span>文件</span>
					<font-awesome-icon icon="fa-solid fa-chevron-down" style="font-size: 0.8em; margin-left: 4px;" />
				</a-button>
				<template #overlay>
					<a-menu @click="handleFileMenuClick">
						<a-menu-item key="new">新建</a-menu-item>
						<a-menu-item key="open">打开</a-menu-item>
						<a-menu-item key="save">保存 ({{ modLabel }}+S)</a-menu-item>
						<a-menu-item key="saveas">另存为</a-menu-item>
						<a-menu-item key="exportmmmap">导出 .mmmap</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>

			<!-- 恢复删除 -->
			<a-button
				v-if="editorStore.canUndoDelete"
				@click="handleUndoDelete"
				class="menu-button"
				size="small"
				type="text"
			>
				<span>恢复删除 ({{ modLabel }}+Z)</span>
			</a-button>

			<!-- 重新渲染 -->
			<a-button
				@click="handleReloadMap"
				class="menu-button"
				size="small"
				type="text"
			>
				<span>重新渲染</span>
			</a-button>

			<!-- Divider -->
			<a-divider type="vertical" style="height: 20px; margin: 0 10px;" />

			<!-- MCP Server Section -->
			<div class="mcp-server-section">
				<a-button size="small" type="text" @click="openMCPPanel">
					MCP 服务器
					<!-- Server Status Indicator Dot inside button -->
					<span
						v-if="mcpPanelRef?.serverRunning"
						class="status-dot running"
						title="运行中"
					></span>
					<span
						v-else
						class="status-dot stopped"
						title="未启动"
					></span>
				</a-button>
			</div>
		</div>
		<div class="top-panel right">
			<span v-if="editorStore.currentFilePath">当前地图文件: {{ editorStore.currentFilePath }}</span>
		</div>
	</div>
	<MCPControlPanel ref="mcpPanelRef" v-model="mcpPanelVisible" />
	<ExportProgressDialog
		v-model:open="exportProgressVisible"
		:percent="exportProgressPercent"
		:stage="exportProgressStage"
	/>
</template>

<style lang="scss" scoped>
.top-panel-container {
	display: flex;
	width: 100%;
	height: 100%;
}

.top-panel {
	display: flex;
	align-items: center;

	&.left {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	&.right {
		font-size: 0.7em;
		text-align: right;
		margin-right: 10px;
		margin-left: auto;
	}
}

.menu-button {
	margin-left: 5px;

	&:first-child {
		margin-left: 0;
	}
}

.mcp-server-section {
	display: flex;
	align-items: center;
	gap: 8px;
}

.status-dot {
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-left: 6px;
	margin-bottom: 1px;

	&.running {
		background-color: #52c41a;
	}

	&.stopped {
		background-color: #d9d9d9;
	}
}
</style>
