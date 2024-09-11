import React, { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { nFormatter, numberWithCommas } from "@/utils/numbers";

function isNullOrNaN(value) {
  if (value === null) return true;
  return isNaN(value);
}

export default function EmbeddingTextSplitterPreference() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    if (
      Number(form.get("text_splitter_chunk_overlap")) >=
      Number(form.get("text_splitter_chunk_size"))
    ) {
      showToast(
        "Chunk overlap cannot be larger or equal to chunk size.",
        "error"
      );
      return;
    }

    setSaving(true);
    await Admin.updateSystemPreferences({
      text_splitter_chunk_size: isNullOrNaN(
        form.get("text_splitter_chunk_size")
      )
        ? 1000
        : Number(form.get("text_splitter_chunk_size")),
      text_splitter_chunk_overlap: isNullOrNaN(
        form.get("text_splitter_chunk_overlap")
      )
        ? 1000
        : Number(form.get("text_splitter_chunk_overlap")),
    });
    setSaving(false);
    setHasChanges(false);
    showToast("已保存文本分块策略设置.", "success");
  };

  useEffect(() => {
    async function fetchSettings() {
      const _settings = (await Admin.systemPreferences())?.settings;
      setSettings(_settings ?? {});
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          <form
            onSubmit={handleSubmit}
            onChange={() => setHasChanges(true)}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-4 border-white border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    文本分割和分块偏好
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  如果你了解文本拆分的原理和产生的影响，且想要更改新文档在插入向量数据库{" "}
                  <br />
                  的默认分割和分块方式时，可以修改下面的配置。
                  {/* 有时，您可能希望更改新文档在插入矢量数据库之前的默认分割和分块方式. <br />
                  仅当您了解文本拆分的工作原理及其副作用时，才应修改此设置. */}
                </p>
                <p className="text-xs leading-[18px] font-semibold text-white/80">
                  {/* 此处的更改仅适用于{" "}
                  <i>新嵌入的文档</i>, 不存在的文件. */}
                  此更改只对新上传的文档产生影响，之前上传过的文档的拆分方式不受影响。
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton className="mt-3 mr-0 -mb-14 z-10">
                    {saving ? "保存..." : "保存"}
                  </CTAButton>
                )}
              </div>

              <div className="flex flex-col gap-y-4 mt-8">
                <div className="flex flex-col max-w-[300px]">
                  <div className="flex flex-col gap-y-2 mb-4">
                    <label className="text-white text-sm font-semibold block">
                      文本块大小
                    </label>
                    <p className="text-xs text-white/60">
                      单个向量中最大字符长度。
                    </p>
                  </div>
                  <input
                    type="number"
                    name="text_splitter_chunk_size"
                    min={1}
                    max={settings?.max_embed_chunk_size || 1000}
                    onWheel={(e) => e?.currentTarget?.blur()}
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="maximum length of vectorized text"
                    defaultValue={
                      isNullOrNaN(settings?.text_splitter_chunk_size)
                        ? 1000
                        : Number(settings?.text_splitter_chunk_size)
                    }
                    required={true}
                    autoComplete="off"
                  />
                  <p className="text-xs text-white/40">
                    嵌入模型最大长度为{" "}
                    {numberWithCommas(settings?.max_embed_chunk_size || 1000)}.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-y-4 mt-8">
                <div className="flex flex-col max-w-[300px]">
                  <div className="flex flex-col gap-y-2 mb-4">
                    <label className="text-white text-sm font-semibold block">
                      文本块重叠
                    </label>
                    <p className="text-xs text-white/60">
                      连续块之间重叠的字符数。
                    </p>
                  </div>
                  <input
                    type="number"
                    name="text_splitter_chunk_overlap"
                    min={0}
                    onWheel={(e) => e?.currentTarget?.blur()}
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="向量化文本的最大长度"
                    defaultValue={
                      isNullOrNaN(settings?.text_splitter_chunk_overlap)
                        ? 20
                        : Number(settings?.text_splitter_chunk_overlap)
                    }
                    required={true}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
