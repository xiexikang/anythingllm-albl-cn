export default function MaxContextSnippets({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          最大上下文片段
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          <span>该设置控制上下文片段的最大数量发送给LLM的每一个聊天或查询.</span>
          <br />
          <i>推荐: 4</i>
        </p>
      </div>
      <input
        name="topN"
        type="number"
        min={1}
        max={12}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.topN ?? 4}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2"
        placeholder="4"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
