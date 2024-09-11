export const ABORT_STREAM_EVENT = "abort-chat-stream";

// For handling of chat responses in the frontend by their various types.
export default function handleChat(
  chatResult,
  setLoadingResponse,
  setChatHistory,
  remHistory,
  _chatHistory
) {
  const {
    uuid,
    textResponse,
    type,
    sources = [],
    error,
    close,
    chatId = null,
  } = chatResult;

  if (type === "abort") {
    setLoadingResponse(false);
    setChatHistory([
      ...remHistory,
      {
        uuid,
        content: textResponse,
        role: "assistant",
        sources,
        closed: true,
        error,
        animate: false,
        pending: false,
      },
    ]);
    _chatHistory.push({
      uuid,
      content: textResponse,
      role: "assistant",
      sources,
      closed: true,
      error,
      animate: false,
      pending: false,
    });
  } else if (type === "textResponse") {
    setLoadingResponse(false);
    setChatHistory([
      ...remHistory,
      {
        uuid,
        content: textResponse,
        role: "assistant",
        sources,
        closed: close,
        error,
        animate: !close,
        pending: false,
        chatId,
      },
    ]);
    _chatHistory.push({
      uuid,
      content: textResponse,
      role: "assistant",
      sources,
      closed: close,
      error,
      animate: !close,
      pending: false,
      chatId,
    });
  } else if (type === "textResponseChunk") {
    const chatIdx = _chatHistory.findIndex((chat) => chat.uuid === uuid);
    if (chatIdx !== -1) {
      const existingHistory = { ..._chatHistory[chatIdx] };
      const updatedHistory = {
        ...existingHistory,
        content: existingHistory.content + textResponse,
        sources,
        error,
        closed: close,
        animate: !close,
        pending: false,
        chatId,
      };
      _chatHistory[chatIdx] = updatedHistory;
    } else {
      _chatHistory.push({
        uuid,
        sources,
        error,
        content: textResponse,
        role: "assistant",
        closed: close,
        animate: !close,
        pending: false,
        chatId,
      });
    }
    setChatHistory([..._chatHistory]);
  } else if (type === "finalizeResponseStream") {
    const chatIdx = _chatHistory.findIndex((chat) => chat.uuid === uuid);
    if (chatIdx !== -1) {
      const existingHistory = { ..._chatHistory[chatIdx] };
      const updatedHistory = {
        ...existingHistory,
        chatId, // finalize response stream only has some specific keys for data. we are explicitly listing them here.
      };
      _chatHistory[chatIdx] = updatedHistory;
    }
    setChatHistory([..._chatHistory]);
    setLoadingResponse(false);
  } else if (type === "stopGeneration") {
    const chatIdx = _chatHistory.length - 1;
    const existingHistory = { ..._chatHistory[chatIdx] };
    const updatedHistory = {
      ...existingHistory,
      sources: [],
      closed: true,
      error: null,
      animate: false,
      pending: false,
    };
    _chatHistory[chatIdx] = updatedHistory;

    setChatHistory([..._chatHistory]);
    setLoadingResponse(false);
  }
}

export function chatPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    "给定下面的对话、相关上下文和后续问题，回答用户当前提出的问题。根据需要，根据用户的指示，只返回您对上述信息的问题的回答。"
  );
}
