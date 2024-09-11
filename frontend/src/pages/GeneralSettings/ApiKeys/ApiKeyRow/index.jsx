import { useEffect, useRef, useState } from "react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { Trash } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";

export default function ApiKeyRow({ apiKey }) {
  const rowRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `您确定删除该API秘钥吗？一旦删除，持有者将无法继续使用，且此操作无法撤销。`
      )
    )
      return false;
    if (rowRef?.current) {
      rowRef.current.remove();
    }

    const user = userFromStorage();
    const Model = !!user ? Admin : System;
    await Model.deleteApiKey(apiKey.id);
    showToast("API密钥永久删除", "info");
  };

  const copyApiKey = () => {
    if (!apiKey) return false;
    const content = apiKey.secret;
    if (navigator.clipboard && window.isSecureContext) {
      navigator?.clipboard?.writeText(content);
      showToast("API密钥已复制", "success");
      setCopied(true);
      return;
    } else {
      let textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "absolute";
      textArea.style.opacity = 0;
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
        showToast("API密钥已复制", "success");
        setCopied(true);
      });
    }
  };

  useEffect(() => {
    function resetStatus() {
      if (!copied) return false;
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    resetStatus();
  }, [copied]);

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <td scope="row" className="px-6 py-4 whitespace-nowrap">
          {apiKey.secret}
        </td>
        <td className="px-6 py-4 text-center">
          {apiKey.createdBy?.username || "--"}
        </td>
        <td className="px-6 py-4">{apiKey.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={copyApiKey}
            disabled={copied}
            className="font-medium text-blue-300 rounded-lg hover:text-white hover:text-opacity-60 hover:underline"
          >
            {copied ? "已复制" : "复制"}
          </button>
          <button
            onClick={handleDelete}
            className="font-medium text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
    </>
  );
}
