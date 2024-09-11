import { useState } from "react";
export default function ChatModeSelection({ workspace, setHasChanges }) {
  const [chatMode, setChatMode] = useState(workspace?.chatMode || "chat");

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="chatMode" className="block input-label">
          聊天模式
        </label>
      </div>

      <div className="flex flex-col gap-y-1 mt-2">
        <div className="w-fit flex gap-x-1 items-center p-1 rounded-lg bg-zinc-800 ">
          <input type="hidden" name="chatMode" value={chatMode} />
          <button
            type="button"
            disabled={chatMode === "chat"}
            onClick={() => {
              setChatMode("chat");
              setHasChanges(true);
            }}
            className="transition-bg duration-200 px-6 py-1 text-md text-white/60 disabled:text-white bg-transparent disabled:bg-[#687280] rounded-md"
          >
            对话
          </button>
          <button
            type="button"
            disabled={chatMode === "query"}
            onClick={() => {
              setChatMode("query");
              setHasChanges(true);
            }}
            className="transition-bg duration-200 px-6 py-1 text-md text-white/60 disabled:text-white bg-transparent disabled:bg-[#687280] rounded-md"
          >
            查询
          </button>
        </div>
        <p className="text-sm text-white/60">
          {chatMode === "chat" ? (
            <>
              <span>聊天将提供LLM的一般知识和找到的文档上下文的答案。</span>
            </>
          ) : (
            <>
              <span>仅当找到文档上下文时，查询才会提供答案。</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
