<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import loader from "@monaco-editor/loader";

// 引用路径 (保持你的路径)
import { useMapDataStore } from "@src/stores";

const props = withDefaults(
	defineProps<{
		templateText: string;
		extraLibs?: string[]; // 外部传入的类型 (如 UISchema)
		language?: "typescript" | "javascript" | "html" | string;
	}>(),
	{
		language: "typescript",
	},
);

// 双向绑定
const code = defineModel<string>();

const containerRef = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let model: monaco.editor.ITextModel | null = null;
let resizeObserver: ResizeObserver | null = null;
let monacoInstance: typeof monaco | null = null;

// --- 资源管理 ---
// 专门存储 extraLib 的销毁器，用于更新时清理旧库
let libDisposables: monaco.IDisposable[] = [];
let decorationCollection: monaco.editor.IEditorDecorationsCollection | null = null;
const mapDataStore = useMapDataStore();

// 1. 组件实例 ID：区分不同组件实例 (比如同时打开两个编辑器)
const instanceId = Date.now();
// 2. 库版本号：区分同一次实例中的不同更新批次 (解决缓存问题)
let libVersion = 0;

// =========================================================
// 📚 核心功能: 动态更新类型库 (清理旧 -> 注入新)
// =========================================================
const updateLibs = () => {
	if (!monacoInstance) return;

	// [关键步骤 1] 清理上一次注入的所有 libs
	// 如果不 dispose，Monaco 会把新旧代码叠加，导致 "Duplicate identifier" 错误
	libDisposables.forEach((d) => d.dispose());
	libDisposables = [];

	// 版本号自增，生成全新的 URI，防止 Worker 缓存旧文件内容
	libVersion++;

	const tsDefaults = monacoInstance.languages.typescript.typescriptDefaults;

	// [关键步骤 2] 注入外部传入的 extraLibs
	if (props.extraLibs) {
		props.extraLibs.forEach((content, index) => {
			// 技巧：URI 包含 version，强制认为是新文件
			const uri = `file:///extra-lib-${index}-${instanceId}-v${libVersion}.d.ts`;
			const disposable = tsDefaults.addExtraLib(content, uri);
			libDisposables.push(disposable);
		});
	}

	// [关键步骤 3] 注入动态 Store 变量 ($ui__xxx)
	const uis = mapDataStore.uiTemplates || [];
	if (uis.length > 0) {
		const declarations = uis
			.map(
				(ui) => `
    /**
     * **组件名称**: ${ui.name}\n
     * **slug**: ${ui.slug}
     * * ID: \`${ui.id}\`
     */
    const $ui__${ui.slug}: UISchema;
  `,
			)
			.join("\n");

		const libContent = `
    declare global {
      ${declarations}
    }
    export {};
  `;

		const uri = `file:///dynamic-ui-types-${instanceId}-v${libVersion}.d.ts`;
		const disposable = tsDefaults.addExtraLib(libContent, uri);
		libDisposables.push(disposable);
	}

	// 调试日志 (可选)
	// console.log(`Libs Updated (v${libVersion})`, tsDefaults.getExtraLibs());
};

// =========================================================
// 🎨 核心功能: 高亮显示 (原有逻辑)
// =========================================================
const updateHighlights = () => {
	if (!editor || !monacoInstance || !model) return;

	const text = model.getValue();
	const regex = /(\$ui__[a-zA-Z0-9_\-]+)/g;
	const decorations: monaco.editor.IModelDeltaDecoration[] = [];
	let match;

	while ((match = regex.exec(text)) !== null) {
		const startOffset = match.index;
		const endOffset = startOffset + match[0].length;
		const startPos = model.getPositionAt(startOffset);
		const endPos = model.getPositionAt(endOffset);

		decorations.push({
			range: new monacoInstance.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
			options: {
				isWholeLine: false,
				inlineClassName: "custom-ui-token",
				hoverMessage: { value: "🧩 UI 组件" },
			},
		});
	}

	if (!decorationCollection) {
		decorationCollection = editor.createDecorationsCollection(decorations);
	} else {
		decorationCollection.set(decorations);
	}
};

// =========================================================
// 🚀 初始化编辑器
// =========================================================
const initEditor = async () => {
	if (editor || !containerRef.value) return;

	try {
		loader.config({ monaco });
		monacoInstance = await loader.init();

		// 配置 TS 编译器
		monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
			allowNonTsExtensions: true,
			moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
			module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
			noEmit: true,
			esModuleInterop: true,
		});

		// 初始注入类型
		updateLibs();

		if (!containerRef.value) return;

		// 创建 Model (使用唯一 URI)
		const modelUri = monacoInstance.Uri.parse(`file:///main-${instanceId}.ts`);
		model = monacoInstance.editor.createModel(code.value || props.templateText || "", props.language, modelUri);

		editor = monacoInstance.editor.create(containerRef.value, {
			model: model,
			minimap: { enabled: false },
			wordWrap: "on",
			theme: "vs",
			automaticLayout: false,
			fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
			fontSize: 13,
		});

		// 监听内容变化
		editor.onDidChangeModelContent(() => {
			const val = editor!.getValue();
			if (val !== code.value) {
				code.value = val;
			}
			updateHighlights();
		});

		// 初始高亮
		updateHighlights();
	} catch (error) {
		console.error("Monaco Init Failed:", error);
	}
};

// =========================================================
// 🔄 监听器
// =========================================================

// 1. 外部代码变化 -> 同步到编辑器
watch(code, (newValue) => {
	if (editor && newValue !== editor.getValue()) {
		editor.setValue(newValue || "");
		updateHighlights();
	}
});

// 2. 外部 Libs 变化 -> 重新生成 .d.ts
watch(
	() => props.extraLibs,
	() => {
		updateLibs();
	},
	{ deep: true },
);

// 3. Store 中 UI 模板变化 -> 重新生成 $ui__xxx 类型
watch(
	() => mapDataStore.uiTemplates,
	() => {
		updateLibs();
		updateHighlights(); // 变量名可能变了，高亮也要重扫
	},
	{ deep: true },
);

// 4. 语言变化
watch(
	() => props.language,
	(lang) => {
		if (model && monacoInstance) {
			monacoInstance.editor.setModelLanguage(model, lang);
		}
	},
);

// =========================================================
// 🧬 生命周期
// =========================================================

onMounted(async () => {
	await nextTick();
	await initEditor();

	// Resize 逻辑
	resizeObserver = new ResizeObserver(() => {
		if (editor) editor.layout();
	});
	if (containerRef.value) resizeObserver.observe(containerRef.value);
});

onBeforeUnmount(() => {
	resizeObserver?.disconnect();

	// 1. 销毁注入的类型库
	libDisposables.forEach((d) => d.dispose());

	// 2. 销毁 Model (防止旧 Model 残留在内存，下次打开显示旧报错)
	if (model) {
		model.dispose();
		model = null;
	}

	// 3. 销毁编辑器实例
	if (editor) {
		editor.dispose();
		editor = null;
	}
});
</script>

<template>
	<div ref="containerRef" id="editor"></div>
</template>

<style lang="scss">
/* 全局样式：绿色胶囊 */
.custom-ui-token {
	background-color: #f0f5ffd7;
	color: #1d39c4 !important;
	border: 1px solid #adc6ff;
	border-radius: 4px;
	font-weight: bold;
	font-style: oblique;
	margin: 0 1px;
}
.vs-dark .custom-ui-token {
	background-color: #162447;
	color: #6a85b6 !important;
	border-color: #2f4b7c;
}
</style>

<style lang="scss" scoped>
#editor {
	width: 100%;
	height: 100%;
	border: 1px solid #cccccc;
	box-sizing: border-box;
	background-color: #eeeeee;
}
</style>
