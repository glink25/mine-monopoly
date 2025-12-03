import { TargetSelectType } from "../../../../types/enums/game/game";
import { VNode } from "./vue-h";

//Dialog
interface DialogOption {
	title: string;
	content: string;
	confirmText?: string;
	cancelText?: string;
}

// 目标选择Dialog
export interface TargetSelectDialogOption<I extends TargetSelectType> extends DialogOption {
	type: I;
}

export interface TargetSelectDialogResult<I extends TargetSelectType> {
	target: TargetSelectResult[I];
}

export interface TargetSelectResult {
	[TargetSelectType.ToMapItem]: string[];
	[TargetSelectType.ToPlayer]: string[];
	[TargetSelectType.ToOtherPlayer]: string[];
	[TargetSelectType.ToSelf]: string[];
	[TargetSelectType.ToProperty]: string[];
}

// 确认Dialog
export interface ConfirmDialogOption<I extends readonly InputOptionItem<string, any>[]> extends DialogOption {
	inputOptions?: I;
}

export type InputOptionItem<K extends string, D> = {
	key: K;
	label: string;
	initData: D;
};

export type ConfirmDialogResult<I extends readonly InputOptionItem<string, any>[]> = {
	[P in I[number] as P["key"]]: P["initData"];
} & { confirm: boolean };

// 自定义选择Dialog
export interface ItemSelectDialogOption<T = SelectorItem> extends Omit<DialogOption, "content"> {
	itemList: Array<T>;
	keyName?: keyof T;
	multiple?: boolean;
	column?: number;
	selectedKey?: string | string[];
}

export interface SelectorItem {
	id: string;
	display: string;
}

// 对应的返回结果定义
export interface ItemSelectDialogResult {
	selected: string | string[];
}
