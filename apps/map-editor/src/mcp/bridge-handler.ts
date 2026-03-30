/**
 * MCP Bridge Handler for Renderer Process
 *
 * This file handles MCP tool invocations from the main process.
 * Note: Most map content operations now use Service Layer directly.
 * This handler only handles: map event linking, and resource management.
 */

import { useMapDataStore, useResourceStore, useEditorStore } from "@src/stores";
import { createDefaultMapData } from "@src/utils/file";
import { eventBus } from "@src/utils/event-bus";
import { mapContentService } from "@src/services";

// Define MCP tool names locally
// Only remaining functionality: resources, and map event linking
// Game phases and extra libs now use Service Layer directly
type MCPToolName =
	// Map event tools (for linking events to items)
	| "get_map_event_by_id"
	// Resource tools
	| "list_models"
	| "list_images"
	| "get_resource_by_id"
	| "add_temp_model"
	| "add_temp_image";

/**
 * Send MCP operation feedback event
 */
function sendMCPFeedback(operation: string, success: boolean, message: string, details?: any) {
	eventBus.emit("mcp-operation", {
		operation,
		success,
		message,
		details,
	});
}

/**
 * Helper to convert reactive objects to plain objects for IPC
 */
function toPlain<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

/**
 * Initialize the MCP bridge handler
 * Call this in the main.ts of the renderer process
 */
export function initMCPBridge() {
	// Register the tool handler with the preload script via contextBridge
	console.log("MCP Bridge initialized");

	// Get the mcpAPI from window (exposed by contextBridge)
	const mcpAPI = (window as any).mcpAPI;
	if (mcpAPI && mcpAPI.registerToolHandler) {
		mcpAPI.registerToolHandler(handleToolInvocation);
		console.log("MCP Tool handler registered successfully");
	} else {
		console.error("mcpAPI.registerToolHandler not available!");
	}
}

/**
 * Handle tool invocation by routing to the appropriate store action
 */
export async function handleToolInvocation(toolName: MCPToolName, args: any): Promise<any> {
	const mapDataStore = useMapDataStore();
	const resourceStore = useResourceStore();
	const editorStore = useEditorStore();

	try {
		switch (toolName) {
			// Map Event Tools (for linking only)
			case "get_map_event_by_id": {
				const event = mapDataStore.findMapEventById(args.eventId);
				if (!event) throw new Error(`MapEvent with ID ${args.eventId} not found`);
				return toPlain(event);
			}

			// Resource Tools
			case "list_models":
				return toPlain(resourceStore.models);

			case "list_images":
				return toPlain(resourceStore.images);

			case "get_resource_by_id": {
				// Try to find as image first, then as model
				let resource = resourceStore.findImageById(args.resourceId);
				if (!resource) {
					resource = resourceStore.models.find(m => m.id === args.resourceId);
				}
				if (!resource) throw new Error(`Resource not found: ${args.resourceId}`);
				return toPlain(resource);
			}

			case "add_temp_model": {
				const tempModel = await resourceStore.addTempModel();
				return toPlain(tempModel);
			}

			case "add_temp_image": {
				const tempImage = await resourceStore.addTempImage();
				return toPlain(tempImage);
			}

			default:
				throw new Error(`Unknown tool: ${toolName}`);
		}
	} catch (error: any) {
		sendMCPFeedback(toolName, false, `操作失败: ${error.message}`, { error: error.message });
		throw error;
	}
}
