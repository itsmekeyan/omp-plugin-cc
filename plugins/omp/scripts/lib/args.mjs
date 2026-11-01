export function splitRawArgumentString(raw = "") {
  if (typeof raw !== "string") {
    return [];
  }
  const tokens = [];
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    if (match[1] !== undefined) {
      tokens.push(match[1]);
    } else if (match[2] !== undefined) {
      tokens.push(match[2]);
    } else {
      tokens.push(match[0]);
    }
  }
  return tokens;
}

export function parseArgs(tokens, schema = {}) {
  const flags = {};
  const positionals = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (token === "--") {
      positionals.push(...tokens.slice(i + 1));
      break;
    }

    if (token.startsWith("--")) {
      const eqIdx = token.indexOf("=");
      let key = token.slice(2);
      let value = null;

      if (eqIdx !== -1) {
        key = token.slice(2, eqIdx);
        value = token.slice(eqIdx + 1);
      }

      const type = schema[key];
      if (type === "boolean") {
        flags[key] = value !== null ? value === "true" || value === "1" : true;
        i++;
      } else if (type === "string") {
        if (value !== null) {
          flags[key] = value;
          i++;
        } else if (i + 1 < tokens.length && !tokens[i + 1].startsWith("-")) {
          flags[key] = tokens[i + 1];
          i += 2;
        } else {
          flags[key] = "";
          i++;
        }
      } else {
        // Unknown flag: treat as boolean if no value attached
        if (value !== null) {
          flags[key] = value;
        } else {
          flags[key] = true;
        }
        i++;
      }
    } else if (token.startsWith("-") && token.length > 1) {
      const key = token.slice(1);
      flags[key] = true;
      i++;
    } else {
      positionals.push(token);
      i++;
    }
  }

  return { flags, positionals };
}
