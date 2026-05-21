/**
 * MCP Tool for Getting Code Templates
 *
 * Returns the correct code template based on code type and extra parameters.
 * This ensures that AI skills get the latest template definitions from the editor.
 */

import { z } from "zod";
import { successResult } from "../utils.js";

// Schema definitions
const CodeTypeEnum = z.enum([
	"chance-card",
	"map-event",
	"role",
	"game-phase",
	"modifier",
	"property",
	"extra-libs",
]);

const TargetTypeEnum = z.enum([
	"ToSelf",
	"ToOtherPlayer",
	"ToPlayer",
	"ToProperty",
	"ToMapItem",
]);

const GetCodeTemplateSchema = z.object({
	codeType: CodeTypeEnum.describe("代码类型"),
	extraParams: z.object({
		targetType: TargetTypeEnum.optional().describe("机会卡的 type 字段"),
		commandType: z.string().optional().describe("修饰器的 commandType 字段"),
	}).optional(),
});

// Template definitions
const TARGET_TYPE_MAP: Record<string, string> = {
	[TargetTypeEnum.enum.ToSelf]: "IPlayer",
	[TargetTypeEnum.enum.ToOtherPlayer]: "IPlayer",
	[TargetTypeEnum.enum.ToPlayer]: "IPlayer",
	[TargetTypeEnum.enum.ToProperty]: "IProperty",
	[TargetTypeEnum.enum.ToMapItem]: "string",
};

function getChanceCardTemplate(targetType?: string): { template: string; params: string } {
	const targetTypeKey = targetType || TargetTypeEnum.enum.ToSelf;
	const targetParamType = TARGET_TYPE_MAP[targetTypeKey] || "IPlayer";

	const template = `(async (sourcePlayer: IPlayer, target: ${targetParamType}, gameProcess: IGameProcess) => {
  // --- USER CODE ---
});`;

	const params = `sourcePlayer: IPlayer, target: ${targetParamType}, gameProcess: IGameProcess`;

	return { template, params };
}

function getMapEventTemplate(): { template: string; params: string } {
	const template = `(async (player: IPlayer, gameProcess: IGameProcess) => {
  // --- USER CODE ---
	});`;

	const params = `player: IPlayer, gameProcess: IGameProcess`;

	return { template, params };
}

function getRoleTemplate(): { template: string; params: string } {
	const template = `((player: IPlayer, gameProcess: IGameProcess) => {
  // --- USER CODE ---
});`;

	const params = `player: IPlayer, gameProcess: IGameProcess`;

	return { template, params };
}

function getGamePhaseTemplate(): { template: string; params: string } {
	const template = `(async (context, gameProcess: IGameProcess) => {
  // --- USER CODE ---
});`;

	const params = `context, gameProcess: IGameProcess`;

	return { template, params };
}

/**
 * 根据命令类型获取对应的 CommandMap 类型和 owner 参数名称
 * player.* 命令使用 PlayerCommandMap，owner 参数为 player: IPlayer
 * property.* 命令使用 PropertyCommandMap，owner 参数为 property: IProperty
 * 其他命令回退到 ICommandMap
 */
function getCommandMapType(commandType: string): { commandMap: string; ownerName: string; ownerType: string } {
	if (commandType.startsWith("player.")) {
		return { commandMap: "PlayerCommandMap", ownerName: "player", ownerType: "IPlayer" };
	}
	if (commandType.startsWith("property.")) {
		return { commandMap: "PropertyCommandMap", ownerName: "property", ownerType: "IProperty" };
	}
	return { commandMap: "ICommandMap", ownerName: "owner", ownerType: "any" };
}

function getModifierTemplate(commandType?: string): { template: string; params: string } {
	// 如果提供了具体的 commandType，使用精确的类型签名
	if (commandType && commandType.trim()) {
		const { commandMap, ownerName, ownerType } = getCommandMapType(commandType);
		const template = `(async (${ownerName}: ${ownerType}, gameProcess: IGameProcess, cmd: ICommand<${commandMap}, "${commandType}">, ctx: ICommandContext<${commandMap}, "${commandType}">) => {
  // --- USER CODE ---
});`;

		const params = `${ownerName}: ${ownerType}, gameProcess: IGameProcess, cmd: ICommand<${commandMap}, "${commandType}">, ctx: ICommandContext<${commandMap}, "${commandType}">`;

		return { template, params };
	}

	// 默认使用泛型签名
	const template = `(async (player: IPlayer, gameProcess: IGameProcess, cmd: ICommand<ICommandMap, keyof ICommandMap>, ctx: ICommandContext<ICommandMap, keyof ICommandMap>) => {
  // --- USER CODE ---
});`;

	const params = `player: IPlayer, gameProcess: IGameProcess, cmd: ICommand<ICommandMap, keyof ICommandMap>, ctx: ICommandContext<ICommandMap, keyof ICommandMap>`;

	return { template, params };
}

function getPropertyTemplate(): { template: string; params: string } {
	const template = `(async (player: IPlayer, property: IProperty, gameProcess: IGameProcess) => {
  // --- USER CODE ---
});`;

	const params = `player: IPlayer, property: IProperty, gameProcess: IGameProcess`;

	return { template, params };
}

function getExtraLibsTemplate(): { template: string; params: string } {
	const template = `// --- USER CODE ---`;
	const params = "";

	return { template, params };
}

export async function getCodeTemplate(args: unknown) {
	const parsed = GetCodeTemplateSchema.parse(args);
	const { codeType, extraParams } = parsed;

	let result: { template: string; params: string };

	switch (codeType) {
		case "chance-card":
			result = getChanceCardTemplate(extraParams?.targetType);
			break;
		case "map-event":
			result = getMapEventTemplate();
			break;
		case "role":
			result = getRoleTemplate();
			break;
		case "game-phase":
			result = getGamePhaseTemplate();
			break;
		case "modifier":
			result = getModifierTemplate(extraParams?.commandType);
			break;
		case "property":
			result = getPropertyTemplate();
			break;
		case "extra-libs":
			result = getExtraLibsTemplate();
			break;
		default:
			result = { template: "", params: "" };
	}

	return successResult(result);
}

export const getCodeTemplateTools = [
	{
		name: "get_code_template",
		description: "获取代码模板。根据代码类型和额外参数返回正确的模板。参数: codeType(代码类型), extraParams(targetType-机会卡类型/commandType-修饰器命令类型)。对于修饰器，提供 commandType 会生成精确的类型签名。返回: { template, params }",
		inputSchema: GetCodeTemplateSchema,
		handler: getCodeTemplate,
	},
];
