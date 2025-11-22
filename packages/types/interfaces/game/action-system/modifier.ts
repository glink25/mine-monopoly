import { ICommandMap, ICommand, ICommandContext } from "./command";

export type ModifierTiming = "before" | "after";

export interface ModifierDescriptor<C extends ICommandMap> {
	id: string;
	timing: ModifierTiming;
	commandType: keyof C;
	remainingTriggers: number;
	priority?: number;
	// 可序列化的信息用于给玩家 UI 展示
	meta?: {
		name: string;
		timingName: string;
		description: string;
		source: string;
	};
}

export interface IModifier<C extends ICommandMap> {
	descriptor: ModifierDescriptor<C>;
	fn<K extends keyof C>(
		command: ICommand<C, K>,
		context: ICommandContext<C, K>
	): Promise<C[K]["result"]> | C[K]["result"];
}

export interface IModifierManager<C extends ICommandMap> {
	add(mod: IModifier<C>): void;

	removeById(id: string): boolean;

	clear(): void;

	getModifiersList(): IModifier<C>[];

	getFor<K extends keyof C>(cmd: ICommand<C, K>, timing: ModifierTiming): IModifier<C>[];

	decayAfterExecution(appliedMods: IModifier<C>[]): void;
}