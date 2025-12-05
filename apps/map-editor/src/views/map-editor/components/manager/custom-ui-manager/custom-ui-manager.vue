<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { CustomUI } from "@fatpaper-monopoly/types";
import { useMapDataStore } from "@src/stores";

// 组件引入
import UiSelector from "./ui-selector.vue";
import CustomUiEditor from "./form/custom-ui-editor.vue";

// 初始化 Store
const mapStore = useMapDataStore();

// 定义 Model
const model = defineModel<boolean>({ default: false });

// 状态定义
const createCustomUIFormVisible = ref(false);
const currentCustomUI = ref<CustomUI | null>(null);

/**
 * 生成 UUID 的辅助函数 (增加兼容性)
 */
function generateUUID() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return URL.createObjectURL(new Blob([])).slice(-36);
}

// 处理创建新 UI
function handleCreate(layout: { x: number; y: number; width: number; height: number }) {
	const tempCustomUI: CustomUI = {
		id: generateUUID(),
		name: "新建自定义UI",
		layout,
		uiSchema: {
			id: generateUUID(),
			type: "div",
		},
	};
	currentCustomUI.value = tempCustomUI;
	createCustomUIFormVisible.value = true;
}

// 处理选中现有 UI
function handleSelect(ui: CustomUI) {
	currentCustomUI.value = JSON.parse(JSON.stringify(ui));
	createCustomUIFormVisible.value = true;
}

// 处理保存
function handleSave(ui: CustomUI) {
	mapStore.saveCustomUI(ui);
	message.success("保存自定义UI成功", 1);
	closeEditor();
}

// 处理删除
function handleDelete(id: string) {
	mapStore.removeCustomUI(id);
	message.success("删除自定义UI成功", 1);
	closeEditor();
}

// 关闭编辑器并清理状态
function closeEditor() {
	createCustomUIFormVisible.value = false;
	// 等待 Modal 动画结束后清理数据，避免 UI 闪烁，或者立即清理视情况而定
	// 这里选择立即置空配合 v-if 销毁子组件
	currentCustomUI.value = null;
}

watch(createCustomUIFormVisible, (val) => {
	if (!val) {
		currentCustomUI.value = null;
	}
});
</script>

<template>
	<a-modal
		v-model:open="model"
		title="自定义UI"
		width="100%"
		destroyOnClose
		:footer="null"
		wrap-class-name="custom-ui-manager-container"
	>
		<ui-selector @select="handleSelect" @create="handleCreate"></ui-selector>
	</a-modal>

	<a-modal
		v-model:open="createCustomUIFormVisible"
		title="编辑自定义UI"
		width="100%"
		centered
		destroyOnClose
		:footer="null"
		:mask-closable="false"
	>
		<custom-ui-editor v-if="currentCustomUI" :custom-ui="currentCustomUI" @save="handleSave" @delete="handleDelete" />
	</a-modal>
</template>

<style lang="scss">
.custom-ui-manager-container {
	.ant-modal {
		max-width: 96vw;
		top: 10vh;
		padding-bottom: 0;
		margin: 0 auto;
	}

	.ant-modal-content {
		display: flex;
		flex-direction: column;
		height: 85vh;
		overflow: hidden; 
	}

	.ant-modal-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: auto;
		padding: 24px;
	}
}
</style>
