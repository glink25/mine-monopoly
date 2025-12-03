// utils/item-selector/index.ts
import { createVNode, render, getCurrentInstance, type AppContext } from "vue";
import SelectorModal from "./selector-modal.vue";
import { VNode } from "@fatpaper-monopoly/types";

interface SelectorOptions<T = any> {
	title?: string;
	itemList: Array<T>;
	keyName?: keyof T;
	multiple?: boolean;
	column?: number;
	selectedKey?: string | string[];
	// 上下文：用于确保 FontAwesome 等全局组件能正常工作
	appContext?: AppContext;
}

export function showItemSelector(options: SelectorOptions): Promise<string | string[]> {
	return new Promise((resolve, reject) => {
		// 1. 创建容器
		const container = document.createElement("div");

		// 2. 准备 Props
		const props = {
			...options,
			// 监听组件抛出的 confirm 事件
			onConfirm: (result: string | string[]) => {
				resolve(result);
				destroy();
			},
			// 监听组件抛出的 cancel 事件
			onCancel: () => {
				reject("cancel");
				destroy();
			},
		};

		// 3. 创建虚拟节点
		const vnode = createVNode(SelectorModal, props);

		// 4. 关键步骤：继承应用上下文
		// 如果调用时传入了 context，就用传入的；否则尝试获取当前的
		// 这确保了 fp-dialog 里的 FontAwesomeIcon 能找到组件定义
		if (options.appContext) {
			vnode.appContext = options.appContext;
		} else {
			// 尝试自动获取（仅在 setup 期间调用有效）
			const currentInstance = getCurrentInstance();
			if (currentInstance) {
				vnode.appContext = currentInstance.appContext;
			}
		}

		// 5. 渲染
		render(vnode, container);
		// 因为 fp-dialog 使用了 Teleport to="body"，所以我们不需要把 container append 到 body
		// 但是我们需要把 container 作为一个挂载点让 render 函数执行
		// 注意：SelectorModal 内部的 fp-dialog 如果是 teleport，它会自己去 body
		// 但为了保险起见，或者如果我们将 fp-dialog 的 appendToBody 关掉，我们可以把 container 加进去
		// 这里建议：SelectorModal 里设置 fp-dialog :append-to-body="false"，然后我们手动管 container
		document.body.appendChild(container);

		// 6. 打开弹窗
		// 调用组件暴露的 init 方法让 visible = true
		if (vnode.component && vnode.component.exposed) {
			(vnode.component.exposed as any).init();
		}

		// 7. 销毁逻辑
		function destroy() {
			// 延迟销毁以等待关闭动画 (假设动画 300ms)
			setTimeout(() => {
				render(null, container);
				document.body.removeChild(container);
			}, 350);
		}
	});
}
