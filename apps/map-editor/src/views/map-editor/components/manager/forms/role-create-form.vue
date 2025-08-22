<script setup lang="ts">
import { useMapDataStore, useResourceStore } from "@src/stores";
import { handleNewImage } from "@src/utils/file";
import { RolePreviewerRenderer } from "@src/utils/three/RolePreviewerRenderer";
import { message } from "ant-design-vue";
import { ref, reactive, onMounted, onUpdated } from "vue";

interface FormState {
	name: string;
	color: string;
	fileUrl: string;
}
const createRoleFrom = reactive<FormState>({
	name: "",
	color: "#000000",
	fileUrl: "",
});

const visible = defineModel({ default: false });
let rolePreviewer: RolePreviewerRenderer | null;

async function handleCreateRole() {
	try {
		const imageId = await handleNewImage(createRoleFrom.fileUrl, createRoleFrom.name);
		const role = {
			id: `role-${crypto.randomUUID()}`,
			name: createRoleFrom.name,
			color: createRoleFrom.color,
			imageId,
		};
		useMapDataStore().addRole(role);
		message.success(`添加角色 "${role.name}" 成功`, 1);
	} catch (e: any) {
		message.error(e.message, 1);
	}

	handleClose();
	visible.value = false;
}

async function handleAddRole() {
	const res = await window.electronAPI.showOpenDialog({
		filters: [{ name: "纸片人", extensions: ["png"] }],
		properties: ["openFile"],
	});
	if (res.filePaths.length > 0) {
		createRoleFrom.fileUrl = res.filePaths[0];
		if (!rolePreviewer) {
			const canvasContainer = document.querySelector("#form-preview-canvas-container") as HTMLDivElement;
			rolePreviewer = new RolePreviewerRenderer(canvasContainer);
		}
		await rolePreviewer.loadRole(createRoleFrom.fileUrl);
	} else {
		createRoleFrom.fileUrl = "";
	}
}

function handleClose() {
	createRoleFrom.name = "";
	createRoleFrom.fileUrl = "";
	rolePreviewer?.destroy();
	rolePreviewer = null;
}
</script>

<template>
	<a-modal destroyOnClose @cancel="handleClose" :footer="null" width="30%" v-model:open="visible" title="添加角色">
		<a-form @finish="handleCreateRole" :model="createRoleFrom" name="basic" autocomplete="off">
			<a-form-item label="角色名称" name="name" :rules="[{ required: true, message: '请输入角色名称' }]">
				<a-input v-model:value="createRoleFrom.name" />
			</a-form-item>
			<a-form-item label="代表颜色" name="color" :rules="[{ required: true, message: '请输入代表颜色' }]">
				<input type="color" v-model="createRoleFrom.color" />
			</a-form-item>

			<a-form-item label="角色预览" name="fileUrl" :rules="[{ required: true, message: '请选择角色图片' }]">
				<span class="role-image-url" v-if="createRoleFrom.fileUrl">{{ createRoleFrom.fileUrl }}</span>
				<div id="form-preview-canvas-container" class="model-preview-canvas-container"></div>
				<a-button @click="handleAddRole" type="primary">添加纸片人图片</a-button>
			</a-form-item>

			<a-form-item>
				<a-button style="float: right" type="primary" html-type="submit">添加</a-button>
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<style lang="scss" scoped>
.role-image-url {
	display: block;
	margin-bottom: 10px;
	padding: 5px;
	border: 1px solid #ccc;
	border-radius: 5px;
	background-color: #f3f3f3;
}
.model-preview-canvas-container {
	display: block;
	margin-bottom: 10px;
	border-radius: 10px;
	width: 100%;
	height: 150px;
	border-radius: 5px;
	background-color: #f3f3f3;
	overflow: hidden;
}
</style>
