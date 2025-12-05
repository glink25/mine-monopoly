<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch } from "vue";
import { message } from "ant-design-vue";

// --- 接口定义 ---
export interface UISchema {
	id: string;
	type: "div" | "span" | "img" | "button" | "text";
	vFor?: string;
	vShow?: string;
	styleBinding?: Record<string, string>;
	style?: Record<string, string>;
	props?: Record<string, any>;
	content?: string;
	textBinding?: string;
	children?: UISchema[];
}

const props = defineProps<{ modelValue: UISchema }>();
const emit = defineEmits(["update:modelValue"]);

const KeyValueEditor = defineAsyncComponent(() => import("./key-value-editor.vue"));

// --- State ---
const activePanelKeys = ref<string[]>(["1", "2", "3"]);
const selectedKeys = ref<string[]>([]);
const rootId = computed(() => props.modelValue?.id);

watch(
	() => props.modelValue,
	(val) => {
		if (val && selectedKeys.value.length === 0) selectedKeys.value = [val.id];
	},
	{ immediate: true }
);

// --- Computed ---
const treeData = computed(() => {
	if (!props.modelValue) return [];
	const transform = (node: UISchema): any => ({
		title: node.type,
		key: node.id,
		type: node.type,
		id: node.id,
		dataRef: node,
		children: node.children ? node.children.map(transform) : [],
		isLeaf: !node.children || node.children.length === 0,
	});
	return [transform(props.modelValue)];
});

const selectedKey = computed(() => selectedKeys.value[0]);
const selectedNode = computed(() => {
	if (!selectedKeys.value.length || !props.modelValue) return null;
	const key = selectedKeys.value[0];
	const findNode = (node: UISchema): UISchema | null => {
		if (node.id === key) return node;
		if (node.children) {
			for (const child of node.children) {
				const found = findNode(child);
				if (found) return found;
			}
		}
		return null;
	};
	return findNode(props.modelValue);
});

// --- Methods ---
const generateId = () => `node-${Math.random().toString(36).substring(2, 9)}`;

const addNode = () => {
	if (!selectedNode.value) return;
	const newNode: UISchema = { id: generateId(), type: "div", style: {}, children: [] };
	if (!selectedNode.value.children) selectedNode.value.children = [];
	selectedNode.value.children.push(newNode);
	emit("update:modelValue", props.modelValue);
	message.success("节点已添加");
};

const removeNode = () => {
	const keyToRemove = selectedKeys.value[0];
	if (!keyToRemove || keyToRemove === rootId.value) return message.warning("根节点不可删除");
	const removeRecursive = (node: UISchema, parent?: UISchema) => {
		if (node.id === keyToRemove && parent && parent.children) {
			const idx = parent.children.findIndex((c) => c.id === keyToRemove);
			if (idx > -1) {
				parent.children.splice(idx, 1);
				selectedKeys.value = [parent.id];
				emit("update:modelValue", props.modelValue);
				message.success("节点已删除");
			}
			return true;
		}
		if (node.children) {
			for (const child of node.children) {
				if (removeRecursive(child, node)) return true;
			}
		}
		return false;
	};
	removeRecursive(props.modelValue);
};
</script>

<template>
	<div class="schema-editor-container">
		<div class="left-panel">
			<div class="panel-header">
				<span class="header-title">组件树</span>
				<div class="header-actions">
					<button class="icon-btn" @click="addNode" :disabled="!selectedNode" title="添加子节点">
						<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
							<line x1="12" y1="5" x2="12" y2="19"></line>
							<line x1="5" y1="12" x2="19" y2="12"></line>
						</svg>
					</button>
					<button
						class="icon-btn danger"
						@click="removeNode"
						:disabled="!selectedKey || selectedKey === rootId"
						title="删除节点"
					>
						<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
							<polyline points="3 6 5 6 21 6"></polyline>
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
						</svg>
					</button>
				</div>
			</div>

			<div class="tree-wrapper custom-scrollbar">
				<a-tree
					v-if="treeData && treeData.length"
					:tree-data="treeData"
					:field-names="{ children: 'children', title: 'title', key: 'key' }"
					default-expand-all
					show-line
					block-node
					v-model:selectedKeys="selectedKeys"
				>
					<template #title="{ dataRef }">
						<div class="tree-node-content">
							<span class="type-tag" :class="dataRef.type">{{ dataRef.type }}</span>
							<span class="node-id">{{ dataRef.id }}</span>
						</div>
					</template>
				</a-tree>
			</div>
		</div>

		<div class="right-panel">
			<div v-if="selectedNode" class="editor-content">
				<div class="panel-header">
					<span class="header-title">
						属性面板
						<span class="header-subtitle">/ {{ selectedNode.type }}</span>
					</span>
					<span class="header-id">ID: {{ selectedNode.id }}</span>
				</div>

				<div class="scrollable-form custom-scrollbar">
					<a-form layout="vertical" :model="selectedNode">
						<div class="form-section">
							<div class="section-title">基础属性</div>
							<a-row :gutter="12">
								<a-col :span="24">
									<a-form-item label="组件类型">
										<a-select v-model:value="selectedNode.type">
											<a-select-option value="div">容器 (div)</a-select-option>
											<a-select-option value="span">行内文本 (span)</a-select-option>
											<a-select-option value="text">纯文本节点 (text)</a-select-option>
											<a-select-option value="img">图片 (img)</a-select-option>
											<a-select-option value="button">按钮 (button)</a-select-option>
										</a-select>
									</a-form-item>
								</a-col>
							</a-row>

							<template v-if="['text', 'button'].includes(selectedNode.type)">
								<a-row :gutter="12">
									<a-col :span="12">
										<a-form-item label="静态文本">
											<a-input v-model:value="selectedNode.content" placeholder="输入文本内容" />
										</a-form-item>
									</a-col>
									<a-col :span="12">
										<a-form-item label="动态绑定">
											<a-input
												v-model:value="selectedNode.textBinding"
												prefix="{{"
												suffix="}}"
												placeholder="例如: user.name"
											/>
										</a-form-item>
									</a-col>
								</a-row>
							</template>
						</div>

						<div class="form-section">
							<div class="section-title">渲染逻辑</div>
							<a-row :gutter="12">
								<a-col :span="12">
									<a-form-item label="v-show (条件显示)">
										<a-input v-model:value="selectedNode.vShow" placeholder="例如: isVisible" />
									</a-form-item>
								</a-col>
								<a-col :span="12">
									<a-form-item label="v-for (循环渲染)">
										<a-input v-model:value="selectedNode.vFor" placeholder="例如: item in list" />
									</a-form-item>
								</a-col>
							</a-row>
						</div>

						<div class="collapse-container">
							<a-collapse ghost v-model:activeKey="activePanelKeys" :bordered="false">
								<a-collapse-panel key="1" header="样式配置 (Static Style)">
									<KeyValueEditor v-model:value="selectedNode.style" />
								</a-collapse-panel>
								<a-collapse-panel key="2" header="样式绑定 (Dynamic Style)">
									<p class="panel-desc">绑定数据路径到 CSS 属性</p>
									<KeyValueEditor v-model:value="selectedNode.styleBinding" />
								</a-collapse-panel>
								<a-collapse-panel key="3" header="原生属性 (HTML Attributes)">
									<p class="panel-desc">例如: src, alt, class, disabled 等</p>
									<KeyValueEditor v-model:value="selectedNode.props" />
								</a-collapse-panel>
							</a-collapse>
						</div>
					</a-form>
				</div>
			</div>

			<div v-else class="empty-state">
				<svg viewBox="0 0 24 24" width="48" height="48" stroke="#e0e0e0" stroke-width="1" fill="none">
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
					<line x1="9" y1="3" x2="9" y2="21"></line>
				</svg>
				<p>请选择左侧节点进行编辑</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 全局容器 */
.schema-editor-container {
	display: flex;
	height: 100%;
	width: 100%;
	border: 1px solid #e8e8e8;
	border-radius: 6px;
	background: #fff;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 通用头部样式 */
.panel-header {
	height: 48px;
	padding: 0 16px;
	border-bottom: 1px solid #f0f0f0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	flex-shrink: 0;
}
.header-title {
	font-weight: 600;
	font-size: 14px;
	color: #1f1f1f;
}
.header-actions {
	display: flex;
	gap: 10px;
}
.header-subtitle {
	color: #999;
	font-weight: normal;
	font-size: 13px;
	margin-left: 4px;
}
.header-id {
	font-family: monospace;
	color: #bfbfbf;
	font-size: 12px;
	background: #f5f5f5;
	padding: 2px 6px;
	border-radius: 4px;
}

/* 自定义图标按钮 */
.icon-btn {
	border: none;
	background: transparent;
	cursor: pointer;
	padding: 6px;
	border-radius: 4px;
	color: #666;
	display: flex;
	align-items: center;
	transition: background 0.2s;
}
.icon-btn:hover:not(:disabled) {
	background: #f0f0f0;
	color: #1890ff;
}
.icon-btn.danger:hover:not(:disabled) {
	background: #fff1f0;
	color: #ff4d4f;
}
.icon-btn:disabled {
	color: #d9d9d9;
	cursor: not-allowed;
}

/* 左侧面板 */
.left-panel {
	width: 260px;
	border-right: 1px solid #f0f0f0;
	display: flex;
	flex-direction: column;
	background: #fafafa;
}

.tree-wrapper {
	flex: 1;
	overflow-y: auto;
	padding: 10px 0;
}

/* 树节点美化 */
.tree-node-content {
	display: flex;
	align-items: center;
	font-size: 13px;
	width: 100%;
}

.type-tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 18px;
	padding: 0 6px;
	border-radius: 3px;
	font-size: 10px;
	font-weight: 700;
	margin-right: 8px;
	text-transform: uppercase;
	color: white;
}
.type-tag.div {
	background-color: #5c8ae6;
}
.type-tag.text {
	background-color: #52c41a;
}
.type-tag.button {
	background-color: #fa8c16;
}
.type-tag.img {
	background-color: #eb2f96;
}
.type-tag.span {
	background-color: #13c2c2;
}

.node-id {
	color: #ccc;
	font-size: 12px;
	transform: scale(0.9);
}
/* 右侧面板 */
.right-panel {
	flex: 1;
	display: flex;
	flex-direction: column;
	background: #fff;
	min-width: 0;
	overflow-y: scroll;
}

.scrollable-form {
	flex: 1;
	overflow-y: auto;
	padding: 20px 24px;
	min-height: 0;
}

.form-section {
	margin-bottom: 24px;
	padding: 16px;
	background: #fff;
}

.section-title {
	font-size: 12px;
	font-weight: bold;
	color: #999;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin-bottom: 12px;
	padding-bottom: 8px;
	border-bottom: 1px dashed #f0f0f0;
}

.collapse-container {
	margin-top: 24px;
	border-top: 1px solid #f0f0f0;
}
.panel-desc {
	font-size: 12px;
	color: #bfbfbf;
	margin-bottom: 8px;
}

.empty-state {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #bfbfbf;
	font-size: 13px;
}
</style>
