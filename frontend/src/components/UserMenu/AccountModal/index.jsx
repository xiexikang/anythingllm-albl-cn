import usePfp from "@/hooks/usePfp";
import System from "@/models/system";
import { AUTH_USER } from "@/utils/constants";
import showToast from "@/utils/toast";
import { Plus, X } from "@phosphor-icons/react";

export default function AccountModal({ user, hideModal }) {
  const { pfp, setPfp } = usePfp();
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("file", file);
    const { success, error } = await System.uploadPfp(formData);
    if (!success) {
      showToast(`上传个人资料图片失败: ${error}`, "error");
      return;
    }

    const pfpUrl = await System.fetchPfp(user.id);
    setPfp(pfpUrl);
    showToast("个人资料图片已上传.", "success");
  };

  const handleRemovePfp = async () => {
    const { success, error } = await System.removePfp();
    if (!success) {
      showToast(`删除个人资料图片失败: ${error}`, "error");
      return;
    }

    setPfp(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (!value || value === null) continue;
      data[key] = value;
    }

    const { success, error } = await System.updateUser(data);
    if (success) {
      let storedUser = JSON.parse(localStorage.getItem(AUTH_USER));

      if (storedUser) {
        storedUser.username = data.username;
        localStorage.setItem(AUTH_USER, JSON.stringify(storedUser));
      }
      showToast("个人资料已更新.", "success", { clear: true });
      hideModal();
    } else {
      showToast(`更新用户失败: ${error}`, "error");
    }
  };

  return (
    <div
      id="account-modal"
      className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center"
    >
      <div className="relative w-[500px] max-w-2xl max-h-full bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">编辑账号</h3>
          <button
            onClick={hideModal}
            type="button"
            className="text-gray-400 bg-transparent hover:border-white/60 rounded-lg p-1.5 ml-auto inline-flex items-center hover:bg-menu-item-selected-gradient hover:border-slate-100 border-transparent"
          >
            <X className="text-lg" />
          </button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <label className="w-48 h-48 flex flex-col items-center justify-center bg-zinc-900/50 transition-all duration-300 rounded-full mt-8 border-2 border-dashed border-white border-opacity-60 cursor-pointer hover:opacity-60">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {pfp ? (
                  <img
                    src={pfp}
                    alt="User profile picture"
                    className="w-48 h-48 rounded-full object-cover bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3">
                    <Plus className="w-8 h-8 text-white/80 m-2" />
                    <span className="text-white text-opacity-80 text-sm font-semibold">
                      上传头像
                    </span>
                    <span className="text-white text-opacity-60 text-xs">
                      800 x 800
                    </span>
                  </div>
                )}
              </label>
              {pfp && (
                <button
                  type="button"
                  onClick={handleRemovePfp}
                  className="mt-3 text-white text-opacity-60 text-sm font-medium hover:underline"
                >
                  删除头像
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-4 px-6">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-white"
              >
                用户名
              </label>
              <input
                name="username"
                type="text"
                className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="请输入用户名"
                minLength={2}
                defaultValue={user.username}
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                新密码
              </label>
              <input
                name="password"
                type="password"
                className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={`请输入新密码`}
              />
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-500/50 pt-4 p-6">
            <button
              onClick={hideModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white bg-transparent hover:bg-stone-900"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white bg-transparent border border-slate-200 hover:bg-slate-200 hover:text-slate-800"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
