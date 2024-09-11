import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import showToast from "@/utils/toast";
import System from "@/models/system";
import paths from "@/utils/paths";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import PreLoader from "@/components/Preloader";
import CTAButton from "@/components/lib/CTAButton";

export default function GeneralSecurity() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <MultiUserMode />
        <PasswordProtection />
      </div>
    </div>
  );
}

function MultiUserMode() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [useMultiUserMode, setUseMultiUserMode] = useState(false);
  const [multiUserModeEnabled, setMultiUserModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setHasChanges(false);
    if (useMultiUserMode) {
      const form = new FormData(e.target);
      const data = {
        username: form.get("username"),
        password: form.get("password"),
      };

      const { success, error } = await System.setupMultiUser(data);
      if (success) {
        showToast("多用户模式启用成功.", "success");
        setSaving(false);
        setTimeout(() => {
          window.localStorage.removeItem(AUTH_USER);
          window.localStorage.removeItem(AUTH_TOKEN);
          window.localStorage.removeItem(AUTH_TIMESTAMP);
          window.location = paths.settings.users();
        }, 2_000);
        return;
      }

      showToast(`无法启用多用户模式: ${error}`, "error");
      setSaving(false);
      return;
    }
  };

  useEffect(() => {
    async function fetchIsMultiUserMode() {
      setLoading(true);
      const multiUserModeEnabled = await System.isMultiUserMode();
      setMultiUserModeEnabled(multiUserModeEnabled);
      setLoading(false);
    }
    fetchIsMultiUserMode();
  }, []);

  if (loading) {
    return (
      <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
        <div className="w-full h-full flex justify-center items-center">
          <PreLoader />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setHasChanges(true)}
      className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16"
    >
      <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
        <div className="w-full flex flex-col gap-y-1">
          <div className="items-center flex gap-x-4">
            <p className="text-lg leading-6 font-bold text-white">多用户模式</p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            设置您的实例以通过激活多用户模式来支持您的团队。
          </p>
        </div>
        {hasChanges && (
          <div className="flex justify-end">
            <CTAButton
              onClick={() => handleSubmit()}
              className="mt-3 mr-0 -mb-20 z-10"
            >
              {saving ? "保存..." : "保存"}
            </CTAButton>
          </div>
        )}
        <div className="relative w-full max-h-full">
          <div className="relative rounded-lg">
            <div className="flex items-start justify-between px-6 py-4"></div>
            <div className="space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div className="">
                  <label className="mb-2.5 block font-medium text-white">
                    {multiUserModeEnabled
                      ? "多用户模式已启用"
                      : "启用多用户模式"}
                  </label>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      onClick={() => setUseMultiUserMode(!useMultiUserMode)}
                      checked={useMultiUserMode}
                      className="peer sr-only pointer-events-none"
                    />
                    <div
                      hidden={multiUserModeEnabled}
                      className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"
                    ></div>
                  </label>
                </div>
                {useMultiUserMode && (
                  <div className="w-full flex flex-col gap-y-2 my-5">
                    <div className="w-80">
                      <label
                        htmlFor="username"
                        className="block mb-3 font-medium text-white"
                      >
                        管理员帐户用户名
                      </label>
                      <input
                        name="username"
                        type="text"
                        className="bg-zinc-900 text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 placeholder:text-white/20 focus:ring-blue-500"
                        placeholder="请输入"
                        minLength={2}
                        required={true}
                        autoComplete="off"
                        disabled={multiUserModeEnabled}
                        defaultValue={multiUserModeEnabled ? "********" : ""}
                      />
                    </div>
                    <div className="mt-4 w-80">
                      <label
                        htmlFor="password"
                        className="block mb-3 font-medium text-white"
                      >
                        管理员帐号密码
                      </label>
                      <input
                        name="password"
                        type="text"
                        className="bg-zinc-900 text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 placeholder:text-white/20 focus:ring-blue-500"
                        placeholder="请输入"
                        minLength={8}
                        required={true}
                        autoComplete="off"
                        defaultValue={multiUserModeEnabled ? "********" : ""}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between space-x-14">
              <p className="text-white/80 text-xs rounded-lg w-96">
                默认情况下，您将是唯一的管理员。
                作为管理员，您需要为所有新用户或管理员创建帐户。
                不要丢失密码，因为只有管理员用户可以重置密码.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function PasswordProtection() {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [multiUserModeEnabled, setMultiUserModeEnabled] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (multiUserModeEnabled) return false;

    setSaving(true);
    setHasChanges(false);
    const form = new FormData(e.target);
    const data = {
      usePassword,
      newPassword: form.get("password"),
    };

    const { success, error } = await System.updateSystemPassword(data);
    if (success) {
      showToast("您的页面将在几秒钟后刷新.", "success");
      setSaving(false);
      setTimeout(() => {
        window.localStorage.removeItem(AUTH_USER);
        window.localStorage.removeItem(AUTH_TOKEN);
        window.localStorage.removeItem(AUTH_TIMESTAMP);
        window.location.reload();
      }, 3_000);
      return;
    } else {
      showToast(`更新密码失败: ${error}`, "error");
      setSaving(false);
    }
  };

  useEffect(() => {
    async function fetchIsMultiUserMode() {
      setLoading(true);
      const multiUserModeEnabled = await System.isMultiUserMode();
      const settings = await System.keys();
      setMultiUserModeEnabled(multiUserModeEnabled);
      setUsePassword(settings?.RequiresAuth);
      setLoading(false);
    }
    fetchIsMultiUserMode();
  }, []);

  if (loading) {
    return (
      <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
        <div className="w-full h-full flex justify-center items-center">
          <PreLoader />
        </div>
      </div>
    );
  }

  if (multiUserModeEnabled) return null;
  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setHasChanges(true)}
      className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16"
    >
      <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
        <div className="w-full flex flex-col gap-y-1">
          <div className="items-center flex gap-x-4">
            <p className="text-lg leading-6 font-bold text-white">密码保护</p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            使用密码保护您的 AnythingLLM 实例。
            如果你忘记了没有恢复方法，因此请确保保存此密码.
          </p>
        </div>
        {hasChanges && (
          <div className="flex justify-end">
            <CTAButton
              onClick={() => handleSubmit()}
              className="mt-3 mr-0 -mb-20 z-10"
            >
              {saving ? "保存..." : "保存"}
            </CTAButton>
          </div>
        )}
        <div className="relative w-full max-h-full">
          <div className="relative rounded-lg">
            <div className="flex items-start justify-between px-6 py-4"></div>
            <div className="space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div className="">
                  <label className="mb-2.5 block font-medium text-white">
                    密码保护实例
                  </label>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      onClick={() => setUsePassword(!usePassword)}
                      checked={usePassword}
                      className="peer sr-only pointer-events-none"
                    />
                    <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
                  </label>
                </div>
                {usePassword && (
                  <div className="w-full flex flex-col gap-y-2 my-5">
                    <div className="mt-4 w-80">
                      <label
                        htmlFor="password"
                        className="block mb-3 font-medium text-white"
                      >
                        实例密码
                      </label>
                      <input
                        name="password"
                        type="text"
                        className="bg-zinc-900 text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 placeholder:text-white/20 focus:ring-blue-500"
                        placeholder="Your Instance Password"
                        minLength={8}
                        required={true}
                        autoComplete="off"
                        defaultValue={usePassword ? "********" : ""}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between space-x-14">
              <p className="text-white/80 text-xs rounded-lg w-96">
                默认情况下，您将是唯一的管理员。
                作为管理员，您需要为所有新用户或管理员创建帐户。
                不要丢失密码，因为只有管理员用户可以重置密码.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
