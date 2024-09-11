import { useState } from "react";

export default function useCopyText(delay = 2500) {
  const [copied, setCopied] = useState(false);
  const copyText = async (content) => {
    if (!content) return;
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard 向剪贴板写文本
      navigator?.clipboard?.writeText(content);
      setCopied(content);
      setTimeout(() => {
        setCopied(false);
      }, delay);
      return;
    } else {
      // 创建text area
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
        // 执行复制命令并移除文本框
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
        setCopied(content);
        setTimeout(() => {
          setCopied(false);
        }, delay);
      });
    }
  };

  return { copyText, copied };
}
