import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useRef, useState } from "react";
import VectorDBIdentifier from "./VectorDBIdentifier";
import MaxContextSnippets from "./MaxContextSnippets";
import DocumentSimilarityThreshold from "./DocumentSimilarityThreshold";

export default function VectorDatabase({ workspace }) {
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const formEl = useRef(null);

  const handleUpdate = async (e) => {
    setSaving(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!!updatedWorkspace) {
      showToast("工作区已更新!", "success", { clear: true });
    } else {
      showToast(`错误: ${message}`, "error", { clear: true });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace) return null;
  return (
    <form
      ref={formEl}
      onSubmit={handleUpdate}
      className="w-1/2 flex flex-col gap-y-6"
    >
      <VectorDBIdentifier workspace={workspace} />
      <MaxContextSnippets workspace={workspace} setHasChanges={setHasChanges} />
      <DocumentSimilarityThreshold
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
      {hasChanges && (
        <button
          type="submit"
          className="w-fit transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          {saving ? "更新中..." : "更新工作区"}
        </button>
      )}
    </form>
  );
}
