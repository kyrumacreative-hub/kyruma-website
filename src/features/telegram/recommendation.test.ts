import assert from "node:assert/strict";
import test from "node:test";
import { recommend } from "./recommendation";
import { handleTelegramUpdate } from "./handler";

test("routes a focused Instagram issue to live KX-001", () => {
  const result = recommend("instagram", "focused");
  assert.equal(result.code, "KX-001");
  assert.equal(result.available, true);
});

test("protects structural leads by routing to Discovery", () => {
  assert.equal(recommend("multiple", "structural").code, "DISCOVERY");
});

test("keeps unavailable products out of immediate purchase", () => {
  for (const problem of ["website", "content", "brand", "multiple"] as const) assert.equal(recommend(problem, "focused").available, false);
});

test("start resets the conversation", () => {
  const action = handleTelegramUpdate({ message: { chat: { id: 42 }, text: "/start campaign" } });
  assert.equal(action?.chatId, 42);
  assert.match(action?.reply.text ?? "", /KYRUMA MATCH/);
});

test("unknown callback returns a safe restart", () => {
  const action = handleTelegramUpdate({ callback_query: { id: "callback", data: "unknown", message: { chat: { id: 42 } } } });
  assert.equal(action?.reply.keyboard?.[0]?.[0]?.callback_data, "restart");
});
