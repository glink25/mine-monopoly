declare enum TargetSelectType {
	ToSelf = "ToSelf",
	ToOtherPlayer = "ToOtherPlayer",
	ToPlayer = "ToPlayer",
	ToProperty = "ToProperty",
	ToMapItem = "ToMapItem"
}
interface DiceInfo {
	min: number;
	max: number;
	diceProphecyQueue: number[];
}
interface GameData {
	extra: {
		[key: string]: any;
	};
	currentPlayerIdInRound: string;
	currentRound: number;
	currentMultiplier: number;
	playersList: PlayerInfo[];
	propertiesList: PropertyInfo[];
	isGameOver: boolean;
}
interface PlayerInfo {
	id: string;
	user: UserInRoomInfo;
	dices: DiceInfo[];
	money: number;
	properties: PropertyInfo[];
	chanceCards: ChanceCardClientInfo[];
	buff: Buff[];
	positionIndex: number;
	stop: number;
	isBankrupted: boolean;
	isOffline: boolean;
}
interface PropertyInfo {
	id: string;
	name: string;
	sellCost: number;
	buildCost: number;
	level: number;
	maxLevel: number;
	costList: number[];
	streetId: string;
	buildingModelIdList?: string[];
	owner?: UserInRoomInfo;
	custom?: PropertyCustom;
}
interface PropertyCustom {
	effectCode: string;
	description: string;
}
interface ChanceCardClientInfo extends Omit<ChanceCardInstanceInfo, "effectCode"> {
}
interface ChanceCardInstanceInfo extends ChanceCardInfo {
	sourceId: string;
}
interface ChanceCardInfo {
	id: string;
	name: string;
	description: string;
	iconId: string;
	color: string;
	effectCode: string;
	type: TargetSelectType;
}
interface Buff {
	id: string;
	name: string;
	description: string;
	source: string;
	triggerTiming: string;
	triggerTimes: number;
}
interface VNode<HostNode = any, HostElement = any> {
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
type VNodeNormalizedChildren = string | VNodeArrayChildren | RawSlots | null;
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;
type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void;
type VNodeChild = VNodeChildAtom | VNodeArrayChildren;
type VNodeTypes = string | VNode | Component | typeof Text | typeof Comment;
type Component = ConcreteComponent | FunctionalComponent;
interface ConcreteComponent<Props = Record<string, any>, RawBindings = any> {
	name?: string;
	props?: string[] | Record<string, any>;
	components?: Record<string, Component>;
	setup?: (props: Props, ctx: SetupContext) => RawBindings | RenderFunction | void;
	render?: RenderFunction;
	[key: string]: any;
}
type FunctionalComponent<P = Record<string, any>, E extends EmitsOptions = Record<string, any>> = {
	(props: P, ctx: SetupContext<E>): VNodeChild;
	props?: Record<string, any>;
	emits?: E | string[];
	displayName?: string;
};
type RenderFunction = () => VNodeChild;
interface SetupContext<E = Record<string, any>> {
	attrs: Record<string, any>;
	slots: Slots;
	emit: (event: string, ...args: any[]) => void;
	expose: (exposed?: Record<string, any>) => void;
}
type Slot = (...args: any[]) => VNode[];
type InternalSlots = {
	[name: string]: Slot | undefined;
};
type Slots = InternalSlots & {
	[key: string]: Slot | undefined;
};
type RawSlots = {
	[name: string]: unknown;
	$stable?: boolean;
};
type EmitsOptions = Record<string, any> | string[];
interface AppContext {
	app: any;
	config: any;
	mixins: any[];
	components: Record<string, Component>;
	directives: Record<string, any>;
	provides: Record<string | symbol, any>;
}
interface ComponentInternalInstance {
	uid: number;
	type: ConcreteComponent;
	parent: ComponentInternalInstance | null;
	root: ComponentInternalInstance;
	appContext: AppContext;
	[key: string]: any;
}
interface VNodeProps {
	key?: string | number | symbol;
	ref?: VNodeRef;
	ref_for?: boolean;
	ref_key?: string;
	class?: any;
	style?: string | Record<string, string | number>;
	[event: `on${string}`]: Function | undefined;
}
type RawProps = VNodeProps & Record<string, any>;
type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any);
/**
 * h 函数 - 元素节点 (Element)
 */
declare function h(type: string, children?: RawChildren): VNode;
declare function h(type: string, props: RawProps | null, children?: RawChildren | RawSlots): VNode;
/**
 * h 函数 - 组件节点 (Component)
 */
declare function h(type: Component, children?: RawChildren | RawSlots): VNode;
declare function h(type: Component, props: (RawProps & Record<string, any>) | null, children?: RawChildren | RawSlots): VNode;
interface User {
	userId: string;
	username: string;
	isReady: boolean;
	avatar: string;
	color: string;
}
interface UserInRoomInfo extends User {
	roleId: string;
}
