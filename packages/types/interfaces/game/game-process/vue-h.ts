// vue-h.d.ts

// ==========================================
// 核心 VNode 定义
// ==========================================

export interface VNode<HostNode = any, HostElement = any> {
	__v_isVNode: true;
	type: VNodeTypes;
	props: (VNodeProps & Record<string, any>) | null;
	key: string | number | symbol | null;
	ref: VNodeRef | null;
	children: VNodeNormalizedChildren;
	component: ComponentInternalInstance | null;
	el: HostNode | null;
	shapeFlag: number;
	patchFlag: number;
	appContext: AppContext | null;
}

type VNodeRef = string | object | Function;

export type VNodeNormalizedChildren = string | VNodeArrayChildren | RawSlots | null;

export type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;

type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void;

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;

// ==========================================
// 组件与上下文
// ==========================================

export type VNodeTypes =
	| string
	| VNode
	| Component
	| typeof Text
	| typeof Comment

export type Component = ConcreteComponent | FunctionalComponent;

export interface ConcreteComponent<Props = Record<string, any>, RawBindings = any> {
	name?: string;
	props?: string[] | Record<string, any>;
	components?: Record<string, Component>;
	setup?: (props: Props, ctx: SetupContext) => RawBindings | RenderFunction | void;
	render?: RenderFunction;
	[key: string]: any;
}

export type FunctionalComponent<P = Record<string, any>, E extends EmitsOptions = Record<string, any>> = {
	(props: P, ctx: SetupContext<E>): VNodeChild;
	props?: Record<string, any>;
	emits?: E | string[];
	displayName?: string;
};

export type RenderFunction = () => VNodeChild;

export interface SetupContext<E = Record<string, any>> {
	attrs: Record<string, any>;
	slots: Slots;
	emit: (event: string, ...args: any[]) => void;
	expose: (exposed?: Record<string, any>) => void;
}

export type Slot = (...args: any[]) => VNode[];
export type InternalSlots = {
	[name: string]: Slot | undefined;
};
export type Slots = InternalSlots & {
	[key: string]: Slot | undefined;
};
export type RawSlots = {
	[name: string]: unknown;
	$stable?: boolean;
};

type EmitsOptions = Record<string, any> | string[];

export interface AppContext {
	app: any;
	config: any;
	mixins: any[];
	components: Record<string, Component>;
	directives: Record<string, any>;
	provides: Record<string | symbol, any>;
}

export interface ComponentInternalInstance {
	uid: number;
	type: ConcreteComponent;
	parent: ComponentInternalInstance | null;
	root: ComponentInternalInstance;
	appContext: AppContext;
	[key: string]: any;
}

// ==========================================
// Props 与 HTML 属性提示
// ==========================================

export interface VNodeProps {
	key?: string | number | symbol;
	ref?: VNodeRef;
	ref_for?: boolean;
	ref_key?: string;

	// 标准属性
	class?: any;
	style?: string | Record<string, string | number>;

	// 事件监听器提示
	[event: `on${string}`]: Function | undefined;
}

export type RawProps = VNodeProps & Record<string, any>;

// ==========================================
// h 函数定义 (修复版)
// ==========================================

// 为了清晰，这里定义 RawChildren
export type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any);

/**
 * h 函数 - 元素节点 (Element)
 */
export declare function h(type: string, children?: RawChildren): VNode;

export declare function h(type: string, props: RawProps | null, children?: RawChildren | RawSlots): VNode;

/**
 * h 函数 - 组件节点 (Component)
 */
export declare function h(type: Component, children?: RawChildren | RawSlots): VNode;

export declare function h(
	type: Component,
	props: (RawProps & Record<string, any>) | null,
	children?: RawChildren | RawSlots
): VNode;