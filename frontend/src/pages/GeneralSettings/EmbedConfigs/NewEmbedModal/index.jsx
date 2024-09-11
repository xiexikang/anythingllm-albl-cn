import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { TagsInput } from "react-tag-input-component";
import Embed from "@/models/embed";

export function enforceSubmissionSchema(form) {
  const data = {};
  for (var [key, value] of form.entries()) {
    if (!value || value === null) continue;
    data[key] = value;
    if (value === "on") data[key] = true;
  }

  // Always set value on nullable keys since empty or off will not send anything from form element.
  if (!data.hasOwnProperty("allowlist_domains")) data.allowlist_domains = null;
  if (!data.hasOwnProperty("allow_model_override"))
    data.allow_model_override = false;
  if (!data.hasOwnProperty("allow_temperature_override"))
    data.allow_temperature_override = false;
  if (!data.hasOwnProperty("allow_prompt_override"))
    data.allow_prompt_override = false;
  return data;
}

export default function NewEmbedModal({ closeModal }) {
  const [error, setError] = useState(null);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const data = enforceSubmissionSchema(form);
    const { embed, error } = await Embed.newEmbed(data);
    if (!!embed) window.location.reload();
    setError(error);
  };

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
          为工作区创建新的嵌入
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            data-modal-hide="staticModal"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <form onSubmit={handleCreate}>
          <div className="p-6 space-y-6 flex h-auto max-h-[80vh] w-full overflow-y-scroll">
            <div className="w-full flex flex-col gap-y-6">
              <WorkspaceSelection />
              <ChatModeSelection />
              <PermittedDomains />
              <NumberInput
                name="max_chats_per_day"
                title="每天最多聊天次数"
                hint="限制此嵌入式聊天在 24 小时内可以处理的聊天量。 0是无限的。"
              />
              <NumberInput
                name="max_chats_per_session"
                title="每个会话的最大聊天数"
                hint="限制会话用户在 24 小时内可以使用此嵌入发送的聊天量。 0是无限的."
              />
              <BooleanInput
                name="allow_model_override"
                title="启用动态模型使用"
                hint="允许设置首选 LLM 模型以覆盖工作区默认值."
              />
              <BooleanInput
                name="allow_temperature_override"
                title="启用动态 LLM 温度"
                hint="允许设置 LLM 温度以覆盖工作区默认值."
              />
              <BooleanInput
                name="allow_prompt_override"
                title="启用提示覆盖"
                hint="允许设置系统提示来覆盖工作区默认值."
              />

              {error && <p className="text-red-400 text-sm">错误: {error}</p>}
              <p className="text-white text-xs md:text-sm pb-8">
                创建嵌入后，您将获得一个链接，您可以通过简单的方式在您的网站上发布
                <code className="bg-stone-800 text-white mx-1 px-1 rounded-sm">
                  &lt;script&gt;
                </code>{" "}
                tag.
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button
              onClick={closeModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
            >
              取消
            </button>
            <button
              type="submit"
              className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const WorkspaceSelection = ({ defaultValue = null }) => {
  const [workspaces, setWorkspaces] = useState([]);
  useEffect(() => {
    async function fetchWorkspaces() {
      const _workspaces = await Workspace.all();
      setWorkspaces(_workspaces);
    }
    fetchWorkspaces();
  }, []);

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label
          htmlFor="workspace_id"
          className="block  text-sm font-medium text-white"
        >
          工作区
        </label>
        <p className="text-slate-300 text-xs">
        这是您的聊天窗口所基于的工作区。 所有默认值将从工作区继承，除非被此配置覆盖.
        </p>
      </div>
      <select
        name="workspace_id"
        required={true}
        defaultValue={defaultValue}
        className="min-w-[15rem] rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
      >
        {workspaces.map((workspace) => {
          return (
            <option
              selected={defaultValue === workspace.id}
              value={workspace.id}
            >
              {workspace.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const ChatModeSelection = ({ defaultValue = null }) => {
  const [chatMode, setChatMode] = useState(defaultValue ?? "query");

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label
          className="block text-sm font-medium text-white"
          htmlFor="chat_mode"
        >
          允许的聊天方式
        </label>
        <p className="text-slate-300 text-xs">
          设置聊天机器人的操作方式。 查询意味着只会响应文档是否有助于回答查询.
          <br />
          聊天功能甚至可以针对一般问题打开聊天窗口，并且可以完整回答与您的工作区无关的查询。
        </p>
      </div>
      <div className="mt-2 gap-y-3 flex flex-col">
        <label
          className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
            chatMode === "chat" ? "border-white border-opacity-40" : ""
          } hover:border-white/60`}
        >
          <input
            type="radio"
            name="chat_mode"
            value={"chat"}
            checked={chatMode === "chat"}
            onChange={(e) => setChatMode(e.target.value)}
            className="hidden"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
              chatMode === "chat" ? "bg-white" : ""
            }`}
          ></div>
          <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
            聊天：无论上下文如何，都回答所有问题
          </div>
        </label>
        <label
          className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
            chatMode === "query" ? "border-white border-opacity-40" : ""
          } hover:border-white/60`}
        >
          <input
            type="radio"
            name="chat_mode"
            value={"query"}
            checked={chatMode === "query"}
            onChange={(e) => setChatMode(e.target.value)}
            className="hidden"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
              chatMode === "query" ? "bg-white" : ""
            }`}
          ></div>
          <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
            查询：仅响应与工作区中文档相关的聊天
          </div>
        </label>
      </div>
    </div>
  );
};

export const PermittedDomains = ({ defaultValue = [] }) => {
  const [domains, setDomains] = useState(defaultValue);
  const handleChange = (data) => {
    const validDomains = data
      .map((input) => {
        let url = input;
        if (!url.includes("http://") && !url.includes("https://"))
          url = `https://${url}`;
        try {
          new URL(url);
          return url;
        } catch {
          return null;
        }
      })
      .filter((u) => !!u);
    setDomains(validDomains);
  };

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label
          htmlFor="allowlist_domains"
          className="block text-sm font-medium text-white"
        >
          限制来自域的请求
        </label>
        <p className="text-slate-300 text-xs">
          此过滤器将阻止来自除以下域之外的域的任何请求下面的列表。
          <br />
          将此留空意味着任何人都可以在任何网站上使用您的嵌入内容.
        </p>
      </div>
      <input type="hidden" name="allowlist_domains" value={domains.join(",")} />
      <TagsInput
        value={domains}
        onChange={handleChange}
        placeholder="https://mysite.com, https://useanything.com"
        classNames={{
          tag: "bg-blue-300/10 text-zinc-800 m-1",
          input:
            "flex bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white p-2.5",
        }}
      />
    </div>
  );
};

export const NumberInput = ({ name, title, hint, defaultValue = 0 }) => {
  return (
    <div>
      <div className="flex flex-col mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {title}
        </label>
        <p className="text-slate-300 text-xs">{hint}</p>
      </div>
      <input
        type="number"
        name={name}
        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-[15rem] p-2.5"
        min={0}
        defaultValue={defaultValue}
        onScroll={(e) => e.target.blur()}
      />
    </div>
  );
};

export const BooleanInput = ({ name, title, hint, defaultValue = null }) => {
  const [status, setStatus] = useState(defaultValue ?? false);

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {title}
        </label>
        <p className="text-slate-300 text-xs">{hint}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          name={name}
          type="checkbox"
          onClick={() => setStatus(!status)}
          checked={status}
          className="peer sr-only pointer-events-none"
        />
        <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800" />
      </label>
    </div>
  );
};
