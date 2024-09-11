import { Gauge } from "@phosphor-icons/react";
export default function NativeTranscriptionOptions() {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
        <div className="gap-x-2 flex items-center">
          <Gauge size={25} />
          <p className="text-sm">
            在RAM或CPU有限的机器上使用本地耳语模型在处理媒体文件时，会使AnythingLLM停止吗.
            <br />
            我们建议至少有2GB的内存和上传文件 &lt;10Mb.
            <br />
            <br />
            <i>内置的模型会在第一次使用时自动下载.</i>
          </p>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            模型选择
          </label>
          <select
            disabled={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <option disabled={true} selected={true}>
              Xenova/whisper-small
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
