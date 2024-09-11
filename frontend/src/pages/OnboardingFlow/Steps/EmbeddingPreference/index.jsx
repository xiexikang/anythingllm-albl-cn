import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import NativeEmbeddingOptions from "@/components/EmbeddingSelection/NativeEmbeddingOptions";
import OpenAiOptions from "@/components/EmbeddingSelection/OpenAiOptions";
import AzureAiOptions from "@/components/EmbeddingSelection/AzureAiOptions";
import LocalAiOptions from "@/components/EmbeddingSelection/LocalAiOptions";
import OllamaEmbeddingOptions from "@/components/EmbeddingSelection/OllamaOptions";
import EmbedderItem from "@/components/EmbeddingSelection/EmbedderItem";
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const TITLE = "嵌入的偏好";
const DESCRIPTION =
  "AnythingLLM可以与许多嵌入模型一起工作,这将是将文档转换为向量的模型。";

export default function EmbeddingPreference({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmbedders, setFilteredEmbedders] = useState([]);
  const [selectedEmbedder, setSelectedEmbedder] = useState(null);
  const [settings, setSettings] = useState(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedEmbedder(_settings?.EmbeddingEngine || "native");
    }
    fetchKeys();
  }, []);

  const EMBEDDERS = [
    {
      name: "AnythingLLM Embedder",
      value: "native",
      logo: AnythingLLMIcon,
      options: <NativeEmbeddingOptions settings={settings} />,
      description:
        "使用AnythingLLM的内置嵌入引擎。零设置!",
    },
    {
      name: "OpenAI",
      value: "openai",
      logo: OpenAiLogo,
      options: <OpenAiOptions settings={settings} />,
      description: "大多数非商业用途的标准选择.",
    },
    {
      name: "Azure OpenAI",
      value: "azure",
      logo: AzureOpenAiLogo,
      options: <AzureAiOptions settings={settings} />,
      description: "OpenAI的企业选项托管在Azure服务上.",
    },
    {
      name: "Local AI",
      value: "localai",
      logo: LocalAiLogo,
      options: <LocalAiOptions settings={settings} />,
      description: "在您自己的机器上本地运行嵌入模型。",
    },
    {
      name: "Ollama",
      value: "ollama",
      logo: OllamaLogo,
      options: <OllamaEmbeddingOptions settings={settings} />,
      description: "在您自己的机器上本地运行嵌入模型。",
    },
  ];

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.llmPreference());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    data.EmbeddingEngine = selectedEmbedder;
    for (var [key, value] of formData.entries()) data[key] = value;

    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`无法保存嵌入设置: ${error}`, "error");
      return;
    }
    navigate(paths.onboarding.vectorDatabase());
  };

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  useEffect(() => {
    const filtered = EMBEDDERS.filter((embedder) =>
      embedder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmbedders(filtered);
  }, [searchQuery, selectedEmbedder]);

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div className="w-full relative border-slate-300/40 shadow border-2 rounded-lg text-white">
          <div className="w-full p-4 absolute top-0 rounded-t-lg backdrop-blur-sm">
            <div className="w-full flex items-center sticky top-0 z-20">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="absolute left-4 z-30 text-white"
              />
              <input
                type="text"
                placeholder="搜索嵌入提供商"
                className="bg-zinc-600 z-20 pl-10 h-[38px] rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="px-4 pt-[70px] flex flex-col gap-y-1 max-h-[390px] overflow-y-auto no-scroll pb-4">
            {filteredEmbedders.map((embedder) => {
              return (
                <EmbedderItem
                  key={embedder.name}
                  name={embedder.name}
                  value={embedder.value}
                  image={embedder.logo}
                  description={embedder.description}
                  checked={selectedEmbedder === embedder.value}
                  onClick={() => setSelectedEmbedder(embedder.value)}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-y-1">
          {selectedEmbedder &&
            EMBEDDERS.find((embedder) => embedder.value === selectedEmbedder)
              ?.options}
        </div>
        <button
          type="submit"
          ref={hiddenSubmitButtonRef}
          hidden
          aria-hidden="true"
        ></button>
      </form>
    </div>
  );
}
