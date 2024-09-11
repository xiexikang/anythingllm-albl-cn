import { chatPrompt } from "@/utils/chat";

export default function ChatPromptSettings({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          提示
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          将在此工作区上使用的提示。 定义 AI 生成响应的上下文和指令。 您应该提供精心设计的提示，以便人工智能可以生成相关且准确的响应。
        </p>
      </div>
      <textarea
        name="openAiPrompt"
        rows={5}
        defaultValue={chatPrompt(workspace)}
        className="bg-zinc-900 placeholder:text-white/20 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2"
        placeholder="给定下面的对话、相关上下文和后续问题，回答用户当前提出的问题。根据需要，根据用户的指示，只返回您对上述信息的问题的回答。"
        required={true}
        wrap="soft"
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
