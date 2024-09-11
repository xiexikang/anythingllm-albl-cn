export default function ChatHistorySettings({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <label htmlFor="name" className="block mb-2 input-label">
          聊天记录
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          <span>将包含在响应的短期记忆中的先前聊天的数量, 建议 20, 超过 45 的任何内容都可能会导致连续的聊天失败，具体取决于消息大小。</span>
        </p>
      </div>
      <input
        name="openAiHistory"
        type="number"
        min={1}
        max={45}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiHistory ?? 20}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="20"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
