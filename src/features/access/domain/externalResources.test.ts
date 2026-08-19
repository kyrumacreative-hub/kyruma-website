import test from "node:test";
import assert from "node:assert/strict";
import { parseExternalResourceUrl } from "./externalResources";

test("accepts official Figma and Google Drive HTTPS URLs", () => {
  assert.equal(
    parseExternalResourceUrl("https://www.figma.com/design/example#node-id=1", "figma"),
    "https://www.figma.com/design/example",
  );
  assert.equal(
    parseExternalResourceUrl("https://drive.google.com/drive/folders/example", "google-drive"),
    "https://drive.google.com/drive/folders/example",
  );
});

test("rejects lookalike hosts, credentials and insecure URLs", () => {
  for (const url of [
    "https://evilfigma.com/file/example",
    "https://figma.com.attacker.test/file/example",
    "http://www.figma.com/file/example",
    "https://user:secret@www.figma.com/file/example",
  ]) {
    assert.throws(
      () => parseExternalResourceUrl(url, "figma"),
      /ACCESS_EXTERNAL_URL_INVALID/,
    );
  }
});

test("returns undefined for an optional empty value", () => {
  assert.equal(parseExternalResourceUrl("  ", "figma"), undefined);
});
