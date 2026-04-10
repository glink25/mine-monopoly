import type { Ref } from "vue";
import type * as monaco from "monaco-editor";

export function useMonacoTypeLibs(monacoInstance: Ref<typeof monaco | null>) {
	function refreshTypeLibs(options: {
		staticTypes?: string;
		extraLibs?: string;
		uiTemplates?: any[];
	}) {
		if (!monacoInstance.value) return;

		const tsDefaults = monacoInstance.value.languages.typescript.typescriptDefaults;
		const libs: { content: string; filePath: string }[] = [];

		// 1. 组件静态类型
		if (options.staticTypes) {
			libs.push({
				content: options.staticTypes,
				filePath: "file:///static-types.d.ts",
			});
		}

		// 2. 全局额外类型库
		if (options.extraLibs) {
			libs.push({
				content: options.extraLibs,
				filePath: "file:///extra-libs.d.ts",
			});
		}

		// 3. 动态 UI 模板类型
		if (options.uiTemplates && options.uiTemplates.length > 0) {
			const declarations = options.uiTemplates
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

			libs.push({
				content: `
    declare global {
      ${declarations}
    }
    export {};
  `,
				filePath: "file:///ui-templates.d.ts",
			});
		}

		tsDefaults.setExtraLibs(libs);
	}

	return { refreshTypeLibs };
}
