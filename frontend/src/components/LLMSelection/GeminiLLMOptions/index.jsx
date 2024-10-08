export default function GeminiLLMOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Google AI 密钥
          </label>
          <input
            type="password"
            name="GeminiLLMApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="请输入"
            defaultValue={settings?.GeminiLLMApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {!settings?.credentialsOnly && (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-4">
              聊天模型选择
            </label>
            <select
              name="GeminiLLMModelPref"
              defaultValue={settings?.GeminiLLMModelPref || "gemini-pro"}
              required={true}
              className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              {["gemini-pro"].map((model) => {
                return (
                  <option key={model} value={model}>
                    {model}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
