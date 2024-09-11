export default function DocumentSimilarityThreshold({
  workspace,
  setHasChanges,
}) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          文档相似度阈值
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          要考虑的源所需的最小相似度分数与聊天有关,数字越高，越相似来源必须是聊天.
        </p>
      </div>
      <select
        name="similarityThreshold"
        defaultValue={workspace?.similarityThreshold ?? 0.25}
        className="bg-zinc-900 text-white text-sm mt-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={() => setHasChanges(true)}
        required={true}
      >
        <option value={0.0}>不限制</option>
        <option value={0.25}>低 (相似度得分 &ge; .25)</option>
        <option value={0.5}>中 (相似度得分 &ge; .50)</option>
        <option value={0.75}>高 (相似度得分 &ge; .75)</option>
      </select>
    </div>
  );
}
