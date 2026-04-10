import * as monaco from "monaco-editor";
import { ref } from "vue";
import loader from "@monaco-editor/loader";

// 模块级单例（跨组件共享）
let monacoSingleton: typeof monaco | null = null;

export function useMonacoInstance() {
	const monacoInstance = ref<typeof monaco | null>(null);

	let editor: monaco.editor.IStandaloneCodeEditor | null = null;
	let model: monaco.editor.ITextModel | null = null;
	let resizeObserver: ResizeObserver | null = null;

	async function initEditor(container: HTMLElement, options: {
		value: string;
		language: string;
		containerId: string;
	}): Promise<{ editor: monaco.editor.IStandaloneCodeEditor; model: monaco.editor.ITextModel }> {
		// 首次初始化全局单例
		if (!monacoSingleton) {
			loader.config({ monaco });
			monacoSingleton = await loader.init();
			monacoSingleton.languages.typescript.typescriptDefaults.setCompilerOptions({
				target: monacoSingleton.languages.typescript.ScriptTarget.ES2020,
				allowNonTsExtensions: true,
				moduleResolution: monacoSingleton.languages.typescript.ModuleResolutionKind.NodeJs,
				module: monacoSingleton.languages.typescript.ModuleKind.CommonJS,
				noEmit: true,
				esModuleInterop: true,
			});
		}
		monacoInstance.value = monacoSingleton;

		// 创建 Model（唯一 URI，避免多实例冲突）
		const modelUri = monacoSingleton.Uri.parse(`file:///main-${options.containerId}.ts`);
		model = monacoSingleton.editor.createModel(
			options.value,
			options.language,
			modelUri,
		);

		// 创建编辑器
		editor = monacoSingleton.editor.create(container, {
			model,
			minimap: { enabled: false },
			wordWrap: "on",
			theme: "vs",
			automaticLayout: false,
			fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
			fontSize: 13,
		});

		// ResizeObserver
		resizeObserver = new ResizeObserver(() => {
			editor!.layout();
		});
		resizeObserver.observe(container);

		return { editor, model };
	}

	function destroyEditor() {
		if (resizeObserver) {
			resizeObserver.disconnect();
			resizeObserver = null;
		}
		if (model) {
			model.dispose();
			model = null;
		}
		if (editor) {
			editor.dispose();
			editor = null;
		}
		monacoInstance.value = null;
	}

	return { monacoInstance, initEditor, destroyEditor };
}
