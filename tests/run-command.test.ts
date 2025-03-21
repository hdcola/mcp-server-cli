import { runCommand } from "../src/run-command.js";

describe("runCommand", () => {
  test("runs a command", async () => {
    const result = await runCommand("echo Hello, World!");
    expect(result.content[0].text).toBe("Hello, World!");
  });
});