import { useEffect, useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import { Trash } from "@phosphor-icons/react";

export default function InviteRow({ invite }) {
  const rowRef = useRef(null);
  const [status, setStatus] = useState(invite.status);
  const [copied, setCopied] = useState(false);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `您确定要停用此邀请吗？\n执行此操作后，它将不再可用。\n\n此操作不可逆转.`
      )
    )
      return false;
    if (rowRef?.current) {
      rowRef.current.children[0].innerText = "Disabled";
    }
    setStatus("disabled");
    await Admin.disableInvite(invite.id);
  };
  const copyInviteLink = () => {
    if (!invite) return false;
    const content = `${window.location.origin}/accept-invite/${invite.code}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator?.clipboard?.writeText(content);
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
          {titleCase(status)}
        </td>
        <td className="px-6 py-4">
          {invite.claimedBy ? invite.claimedBy?.username || "--" : "--"}
        </td>
        <td className="px-6 py-4">{invite.createdBy?.username || "--"}</td>
        <td className="px-6 py-4">{invite.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          {status === "pending" && (
            <>
              <button
                onClick={copyInviteLink}
                disabled={copied}
                className="font-medium text-blue-300 rounded-lg hover:text-white hover:text-opacity-60 hover:underline"
              >
                {copied ? "Copied" : "复制邀请链接"}
              </button>
              <td className="px-6 py-4 flex items-center gap-x-6">
                <button
                  onClick={handleDelete}
                  className="font-medium text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </>
          )}
        </td>
      </tr>
    </>
  );
}
