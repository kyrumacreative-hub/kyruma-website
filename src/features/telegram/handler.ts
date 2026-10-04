import { errorReply, mainMenu, privacyReply, recommendationReply, scopeQuestion, solutionsReply, supportReply, type BotReply } from "./messages";
import { parseMatchProblem, parseMatchScope, recommend } from "./recommendation";

export type TelegramUpdate = {
  update_id?: number;
  message?: { chat?: { id?: number }; text?: string };
  callback_query?: { id?: string; data?: string; message?: { chat?: { id?: number } } };
};

export type MatchAction = { chatId: number; reply: BotReply; callbackQueryId?: string };

function command(text: string) { return text.trim().split(/\s+/)[0]?.split("@")[0]?.toLowerCase() ?? ""; }

export function handleTelegramUpdate(update: TelegramUpdate): MatchAction | null {
  const callback = update.callback_query;
  if (callback?.id && callback.message?.chat?.id && callback.data) {
    const chatId = callback.message.chat.id;
    if (callback.data === "restart") return { chatId, reply: mainMenu, callbackQueryId: callback.id };
    const [kind, problemValue, scopeValue] = callback.data.split(":");
    const problem = parseMatchProblem(problemValue ?? "");
    if (kind === "problem" && problem) return { chatId, reply: scopeQuestion(problem), callbackQueryId: callback.id };
    const scope = parseMatchScope(scopeValue ?? "");
    if (kind === "scope" && problem && scope) return { chatId, reply: recommendationReply(recommend(problem, scope)), callbackQueryId: callback.id };
    return { chatId, reply: errorReply, callbackQueryId: callback.id };
  }

  const chatId = update.message?.chat?.id;
  if (!chatId) return null;
  switch (command(update.message?.text ?? "")) {
    case "/start": case "/check": return { chatId, reply: mainMenu };
    case "/solutions": return { chatId, reply: solutionsReply };
    case "/support": case "/order": return { chatId, reply: supportReply };
    case "/privacy": return { chatId, reply: privacyReply };
    default: return { chatId, reply: errorReply };
  }
}
