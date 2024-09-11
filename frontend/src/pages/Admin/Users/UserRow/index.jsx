import { useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import EditUserModal from "./EditUserModal";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";

const ModMap = {
  admin: ["admin", "manager", "default"],
  manager: ["manager", "default"],
  default: [],
};

export default function UserRow({ currUser, user }) {
  const rowRef = useRef(null);
  const canModify = ModMap[currUser?.role || "default"].includes(user.role);
  const [suspended, setSuspended] = useState(user.suspended === 1);
  const { isOpen, openModal, closeModal } = useModal();
  const handleSuspend = async () => {
    if (
      !window.confirm(
        `你确定要${!suspended ? "停用" : "启用"} ${user.username}?`
      )
    )
      return false;

    const { success, error } = await Admin.updateUser(user.id, {
      suspended: suspended ? 0 : 1,
    });
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      showToast(`用户 ${!suspended ? "已被停用" : "已启用"}.`, "success", {
        clear: true,
      });
      setSuspended(!suspended);
    }
  };
  const handleDelete = async () => {
    if (
      !window.confirm(
        `您确定要删除 ${user.username}?\n在您这样做之后，他们将注销，并且无法使用。\n\n这个动作是不可逆的.`
      )
    )
      return false;
    const { success, error } = await Admin.deleteUser(user.id);
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      rowRef?.current?.remove();
      showToast("用户从系统中删除.", "success", { clear: true });
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          {user.username}
        </th>
        <td className="px-6 py-4">{titleCase(user.role)}</td>
        <td className="px-6 py-4">{user.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          {canModify && (
            <button
              onClick={openModal}
              className="text-sm font-medium text-white/80 rounded-lg hover:text-white px-2 py-1 hover:bg-white hover:bg-opacity-10"
            >
              编辑
            </button>
          )}
          {currUser?.id !== user.id && canModify && (
            <>
              <button
                onClick={handleSuspend}
                className="text-sm font-medium text-white/80 hover:text-orange-300 rounded-lg px-2 py-1 hover:bg-white hover:bg-opacity-10"
              >
                {suspended ? "启用" : "停用"}
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-white/80 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
              >
                删除
              </button>
            </>
          )}
        </td>
      </tr>
      <ModalWrapper isOpen={isOpen}>
        <EditUserModal
          currentUser={currUser}
          user={user}
          closeModal={closeModal}
        />
      </ModalWrapper>
    </>
  );
}
