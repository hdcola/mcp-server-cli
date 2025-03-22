#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runCommand, getOsname } from "./run-command.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { name: package_name, version: package_version } = require("../package.json");

const osname = await getOsname();

// Create server instance
const server = new McpServer({
  name: package_name,
  version: package_version,
});

server.tool("run-command",
  `Run a shell command in ${osname}`,
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

