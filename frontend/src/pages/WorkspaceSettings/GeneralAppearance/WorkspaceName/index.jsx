export default function WorkspaceName({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          工作区名称
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          这只会改变工作区的显示名称.
        </p>
      </div>
      <input
        name="name"
        type="text"
        minLength={2}
        maxLength={80}
        defaultValue={workspace?.name}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="我的工作区"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
