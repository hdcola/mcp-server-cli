import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name: package_name, version: package_version } = require("../package.json");

// Create server instance
const server = new McpServer({
  name: package_name,
  version: package_version,
});

// Run a command on the shell and return stdout and stderr
async function runCommand(command: string): Promise<CallToolResult> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      // Optionally, error handling can be added here.
      resolve({
        content: [
          {
            type: "text",
            text: stdout.trim()
          },
          {
            type: "text",
            text: stderr.trim() ? `Error: ${stderr.trim()}` : ""
          }
        ]
      });
    });
  });
}

server.tool("run-command",
  "Run a command on the shell",
  {
    command: z.string().describe("Command with parameters to run on the shell")
  },
  async ({ command }) => {
    return await runCommand(command);
  }
);

async function main() {
  // Create a transport instance
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CLI MCP Server running on stdio");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});