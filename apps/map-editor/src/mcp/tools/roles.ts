/**
 * MCP Tools for Role Management
 *
 * This module provides CRUD operations for roles through the IPC Bridge.
 * All business logic, validation, and event notifications are handled by mapContentService
 * in the renderer process via the bridge.
 */

import { invokeTool } from "../bridge.js";
import { successResult, errorResult } from "../utils.js";
import type { Role } from "@src/services/validators/role-validators";

/**
 * Add a new role
 */
export async function addRole(args: unknown) {
	try {
		const result = await invokeTool("add_role", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to add role");
	}
}

/**
 * Update an existing role
 */
export async function updateRole(args: unknown) {
	try {
		const result = await invokeTool("update_role", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to update role");
	}
}

/**
 * Remove a role
 */
export async function removeRole(args: unknown) {
	try {
		const result = await invokeTool("remove_role", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to remove role");
	}
}

/**
 * List all roles
 */
export async function listRoles(args: unknown) {
	try {
		const result = await invokeTool("list_roles", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to list roles");
	}
}

/**
 * Export tool definitions for MCP server
 */
export const roleTools = [
	{
		name: "add_role",
		description: "添加新角色。参数：name（名称）, description?（描述，可选）, color?（颜色，可选）, initCode?（初始化代码，可选）, imageId?（图片ID，可选）",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string", description: "角色名称" },
				description: { type: "string", description: "角色描述" },
				color: { type: "string", description: "角色颜色" },
				initCode: { type: "string", description: "初始化代码" },
				imageId: { type: "string", description: "图片ID" }
			},
			required: ["name"]
		},
		handler: addRole
	},
	{
		name: "update_role",
		description: "更新角色。参数：roleId（角色ID）, name?, description?, color?, initCode?, imageId?",
		inputSchema: {
			type: "object",
			properties: {
				roleId: { type: "string", description: "角色ID" },
				name: { type: "string", description: "角色名称" },
				description: { type: "string", description: "角色描述" },
				color: { type: "string", description: "角色颜色" },
				initCode: { type: "string", description: "初始化代码" },
				imageId: { type: "string", description: "图片ID" }
			},
			required: ["roleId"]
		},
		handler: updateRole
	},
	{
		name: "remove_role",
		description: "删除角色。参数：roleId（角色ID）",
		inputSchema: {
			type: "object",
			properties: {
				roleId: { type: "string", description: "角色ID" }
			},
			required: ["roleId"]
		},
		handler: removeRole
	},
	{
		name: "list_roles",
		description: "获取当前地图中所有角色的列表。返回所有角色的完整信息，包括 ID、名称、描述、颜色、初始化代码和图片ID。",
		inputSchema: {
			type: "object",
			properties: {},
			required: []
		},
		handler: listRoles
	}
];