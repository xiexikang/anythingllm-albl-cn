import React, { useEffect, useRef, useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import WorkspaceLLMItem from "./WorkspaceLLMItem";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import ChatModelSelection from "../ChatModelSelection";
import useUser from "../../../../hooks/useUser";

const DISABLED_PROVIDERS = ["azure", "lmstudio", "native"];
const LLM_DEFAULT = {
  name: "系统默认",
  value: "default",
  logo: AnythingLLMIcon,
  options: () => <React.Fragment />,
  description: "使用此工作区的系统 LLM 首选项.",
  requiredConfig: [],
};

export default function WorkspaceLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(
    // workspace?.chatProvider ?? "default"
    // 这里默认修改成localai
    workspace?.chatProvider ?? "localai"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  // 这里不需要LLM_DEFAULT[LLM_DEFAULT, ...AVAILABLE_LLM_PROVIDERS]
  const LLMS = [...AVAILABLE_LLM_PROVIDERS].filter(
    (llm) => !DISABLED_PROVIDERS.includes(llm.value)
  );

  function updateLLMChoice(selection) {
    setSearchQuery("");
    setSelectedLLM(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  }

  function handleXButton() {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  }

  useEffect(() => {
    const filtered = LLMS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [LLMS, searchQuery, selectedLLM]);

  const selectedLLMObject = LLMS.find((llm) => llm.value === selectedLLM);

  const { user } = useUser();
  return user?.role === "admin" || !user?.role ? (
    <div className="border-b border-white/40 pb-8">
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          工作空间 LLM 提供者
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          将用于此目的的特定LLM提供商和模型作区。默认情况下，它使用系统LLM提供程序和设置。
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="chatProvider" value={selectedLLM} />
        {searchMenuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
            onClick={() => setSearchMenuOpen(false)}
          />
        )}
        {searchMenuOpen ? (
          <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-[#18181B] rounded-lg flex flex-col justify-between cursor-pointer border-2 border-[#46C8FF] z-20">
            <div className="w-full flex flex-col gap-y-1">
              <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-[#18181B]">
                <MagnifyingGlass
                  size={20}
                  weight="bold"
                  className="absolute left-4 z-30 text-white -ml-4 my-2"
                />
                <input
                  type="text"
                  name="llm-search"
                  autoComplete="off"
                  placeholder="搜索所有 LLM 提供商"
                  className="-ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none focus:border-white text-white placeholder:text-white placeholder:font-medium"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <X
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-white hover:text-[#9CA3AF]"
                  onClick={handleXButton}
                />
              </div>
              <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
                {filteredLLMs.map((llm) => {
                  return (
                    <WorkspaceLLMItem
                      llm={llm}
                      key={llm.name}
                      availableLLMs={LLMS}
                      settings={settings}
                      checked={selectedLLM === llm.value}
                      onClick={() => updateLLMChoice(llm.value)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <button
            className="w-full max-w-[640px] h-[64px] bg-[#18181B] rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-[#46C8FF] transition-all duration-300"
            type="button"
            onClick={() => setSearchMenuOpen(true)}
          >
            <div className="flex gap-x-4 items-center">
              <img
                src={selectedLLMObject.logo}
                alt={`${selectedLLMObject.name} logo`}
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col text-left">
                <div className="text-sm font-semibold text-white">
                  {selectedLLMObject.name}
                </div>
                <div className="mt-1 text-xs text-[#D2D5DB]">
                  {selectedLLMObject.description}
                </div>
              </div>
            </div>
            <CaretUpDown size={24} weight="bold" className="text-white" />
          </button>
        )}
      </div>
      {selectedLLM !== "default" && (
        <div className="mt-4 flex flex-col gap-y-1">
          <ChatModelSelection
            provider={selectedLLM}
            workspace={workspace}
            setHasChanges={setHasChanges}
          />
        </div>
      )}
    </div>
  ) : null;
}
