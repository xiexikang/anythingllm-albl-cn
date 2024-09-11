import React, { useEffect, useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import pluralize from "pluralize";
import { TagsInput } from "react-tag-input-component";
import { Warning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

const DEFAULT_BRANCHES = ["main", "master"];
export default function GithubOptions() {
  const [loading, setLoading] = useState(false);
  const [repo, setRepo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [ignores, setIgnores] = useState([]);

  const [settings, setSettings] = useState({
    repo: null,
    accessToken: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast(
        "Fetching all files for repo - this may take a while.",
        "info",
        { clear: true, autoClose: false }
      );
      const { data, error } = await System.dataConnectors.github.collect({
        repo: form.get("repo"),
        accessToken: form.get("accessToken"),
        branch: form.get("branch"),
        ignorePaths: ignores,
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `${data.files} ${pluralize("file", data.files)} collected from ${
          data.author
        }/${data.repo}:${data.branch}. Output folder is ${data.destination}.`,
        "success",
        { clear: true }
      );
      e.target.reset();
      setLoading(false);
      return;
    } catch (e) {
      console.error(e);
      showToast(e.message, "error", { clear: true });
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pb-6 pb-16">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col py-2">
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    GitHub Repo URL
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    您希望收集的GitHub repo的Url.
                  </p>
                </div>
                <input
                  type="url"
                  name="repo"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                  placeholder="https://github.com/Mintplex-Labs/anything-llm"
                  required={true}
                  autoComplete="off"
                  onChange={(e) => setRepo(e.target.value)}
                  onBlur={() => setSettings({ ...settings, repo })}
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white font-bold text-sm flex gap-x-2 items-center">
                    <p className="font-bold text-white">Github访问令牌</p>{" "}
                    <p className="text-xs text-white/50 font-light flex items-center">
                      可选
                      {!accessToken && (
                        <Warning
                          size={14}
                          className="ml-1 text-orange-500 cursor-pointer"
                          data-tooltip-id="access-token-tooltip"
                          data-tooltip-place="right"
                        />
                      )}
                      <Tooltip
                        delayHide={300}
                        id="access-token-tooltip"
                        className="max-w-xs"
                        clickable={true}
                      >
                        <p className="text-sm">
                          没有一个{" "}
                          <a
                            href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                            rel="noreferrer"
                            target="_blank"
                            className="underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            个人访问令牌
                          </a>
                          , 由于速率限制，GitHub API可能会限制可以收集的文件数量. 你可以{" "}
                          <a
                            href="https://github.com/settings/personal-access-tokens/new"
                            rel="noreferrer"
                            target="_blank"
                            className="underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            创建一个临时访问令牌
                          </a>{" "}
                          为了避免这个问题.
                        </p>
                      </Tooltip>
                    </p>
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    访问令牌防止速率限制.
                  </p>
                </div>
                <input
                  type="text"
                  name="accessToken"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                  placeholder="github_pat_1234_abcdefg"
                  required={false}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => setAccessToken(e.target.value)}
                  onBlur={() => setSettings({ ...settings, accessToken })}
                />
              </div>
              <GitHubBranchSelection
                repo={settings.repo}
                accessToken={settings.accessToken}
              />
            </div>

            <div className="flex flex-col w-full py-4 pr-10">
              <div className="flex flex-col gap-y-1 mb-4">
                <label className="text-white text-sm flex gap-x-2 items-center">
                  <p className="text-white text-sm font-bold">文件忽略</p>
                </label>
                <p className="text-xs font-normal text-white/50">
                  .gitignore格式的列表，以便在收集期间忽略特定的文件。在要保存的每个条目后按enter键.
                </p>
              </div>
              <TagsInput
                value={ignores}
                onChange={setIgnores}
                name="ignores"
                placeholder="!*.js, images/*, .DS_Store, bin/*"
                classNames={{
                  tag: "bg-blue-300/10 text-zinc-800",
                  input:
                    "flex bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <button
              type="提交"
              disabled={loading}
              className="mt-2 w-full justify-center border border-slate-200 px-4 py-2 rounded-lg text-[#222628] text-sm font-bold items-center flex gap-x-2 bg-slate-200 hover:bg-slate-300 hover:text-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? "提交中..." : "提交"}
            </button>
            {loading && (
              <p className="text-xs text-white/50">
                完成后，所有文件都可以嵌入到文档选择器中的工作区中.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function GitHubBranchSelection({ repo, accessToken }) {
  const [allBranches, setAllBranches] = useState(DEFAULT_BRANCHES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllBranches() {
      if (!repo) {
        setAllBranches(DEFAULT_BRANCHES);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { branches } = await System.dataConnectors.github.branches({
        repo,
        accessToken,
      });
      setAllBranches(branches.length > 0 ? branches : DEFAULT_BRANCHES);
      setLoading(false);
    }
    fetchAllBranches();
  }, [repo, accessToken]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <div className="flex flex-col gap-y-1 mb-4">
          <label className="text-white text-sm font-bold">Branch</label>
          <p className="text-xs font-normal text-white/50">
            Branch you wish to collect files from.
          </p>
        </div>
        <select
          name="branch"
          required={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available branches --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <div className="flex flex-col gap-y-1 mb-4">
        <label className="text-white text-sm font-bold">分支</label>
        <p className="text-xs font-normal text-white/50">
          希望从中收集文件的分支.
        </p>
      </div>
      <select
        name="branch"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {allBranches.map((branch) => {
          return (
            <option key={branch} value={branch}>
              {branch}
            </option>
          );
        })}
      </select>
    </div>
  );
}
