import test from "node:test";
import assert from "node:assert/strict";
import { splitRawArgumentString, parseArgs } from "../plugins/omp/scripts/lib/args.mjs";

test("splitRawArgumentString parses tokens with quotes properly", () => {
  const input = `--model "gpt-5.4" --wait "debug failing test" simple`;
  const tokens = splitRawArgumentString(input);
  assert.deepEqual(tokens, ["--model", "gpt-5.4", "--wait", "debug failing test", "simple"]);
});

test("parseArgs extracts boolean and string flags according to schema", () => {
  const schema = {
    wait: "boolean",
    background: "boolean",
    model: "string",
    effort: "string"
  };
  const tokens = ["--background", "--model", "openai-codex/gpt-5.4", "fix", "issue"];
  const { flags, positionals } = parseArgs(tokens, schema);

  assert.equal(flags.background, true);
  assert.equal(flags.model, "openai-codex/gpt-5.4");
  assert.deepEqual(positionals, ["fix", "issue"]);
});
