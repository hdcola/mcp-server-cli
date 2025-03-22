import { exec } from "child_process";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import * as os from "os";

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

// Get the current operating system name and version
async function getOsname(): Promise<string> {
  const platform = os.platform();
  const type = os.type();

  if (platform === 'darwin') {
    // For macOS, use a shell command to get a more user-friendly version
    return new Promise((resolve) => {
      exec('sw_vers -productName && sw_vers -productVersion', (error, stdout, stderr) => {
        if (error || stderr) {
          // Fallback to default if the command fails
          resolve(`${type} (${platform}), Version: ${os.release()}`);
        } else {
          const lines = stdout.trim().split('\n');
          if (lines.length >= 2) {
            resolve(`${lines[0]} ${lines[1]}`);
          } else {
            resolve(`macOS, Version: ${os.release()}`);
          }
        }
      });
    });
  } else if (platform === 'win32') {
    // For Windows, use wmic to get version info
    return new Promise((resolve) => {
      exec('wmic os get Caption, Version /value', (error, stdout, stderr) => {
        if (error || stderr) {
          resolve(`Windows, Version: ${os.release()}`);
        } else {
          const captionMatch = stdout.match(/Caption=([^\n]+)/);
          const versionMatch = stdout.match(/Version=([^\n]+)/);
          const caption = captionMatch ? captionMatch[1].trim() : 'Windows';
          const version = versionMatch ? versionMatch[1].trim() : os.release();
          resolve(`${caption}, Version: ${version}`);
        }
      });
    });
  } else if (platform === 'linux') {
    // For Linux, try to get distribution info
    return new Promise((resolve) => {
      exec('cat /etc/*release | grep -E "^(NAME|VERSION)="', (error, stdout, stderr) => {
        if (error || stderr) {
          resolve(`Linux, Version: ${os.release()}`);
        } else {
          const nameMatch = stdout.match(/NAME="([^"]+)"/);
          const versionMatch = stdout.match(/VERSION="([^"]+)"/);
          const name = nameMatch ? nameMatch[1] : 'Linux';
          const version = versionMatch ? versionMatch[1] : os.release();
          resolve(`${name}, Version: ${version}`);
        }
      });
    });
  } else {
    // For other platforms, return the default info
    return `${type} (${platform}), Version: ${os.release()}`;
  }
}

export { runCommand, getOsname };