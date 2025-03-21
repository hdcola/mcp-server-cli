import { exec } from "child_process";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";


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

export { runCommand };