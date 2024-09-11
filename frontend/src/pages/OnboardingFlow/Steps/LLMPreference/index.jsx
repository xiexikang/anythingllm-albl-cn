import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import NativeLLMOptions from "@/components/LLMSelection/NativeLLMOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import MistralOptions from "@/components/LLMSelection/MistralOptions";
import HuggingFaceOptions from "@/components/LLMSelection/HuggingFaceOptions";
import TogetherAiOptions from "@/components/LLMSelection/TogetherAiOptions";
import PerplexityOptions from "@/components/LLMSelection/PerplexityOptions";
import OpenRouterOptions from "@/components/LLMSelection/OpenRouterOptions";
import GroqAiOptions from "@/components/LLMSelection/GroqAiOptions";
import LLMItem from "@/components/LLMSelection/LLMItem";
import System from "@/models/system";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const TITLE = "LLM 偏好";
const DESCRIPTION =
  "AnythingLLM可以与许多LLM提供商一起工作, 这将是处理聊天的服务.";

export default function LLMPreference({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(null);
  const [settings, setSettings] = useState(null);
  const formRef = useRef(null);
  const hiddenSubmitButtonRef = useRef(null);
  const isHosted = window.location.hostname.includes("useanything.com");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedLLM(_settings?.LLMProvider || "openai");
    }
    fetchKeys();
  }, []);

  const LLMS = [
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
      name: "Anthropic",
      value: "anthropic",
      logo: AnthropicLogo,
      options: <AnthropicAiOptions settings={settings} />,
      description: "一个友好的人工智能助手由Anthropic主持.",
    },
    {
      name: "Gemini",
      value: "gemini",
      logo: GeminiLogo,
      options: <GeminiLLMOptions settings={settings} />,
      description: "谷歌最大、最强大的人工智能模型",
    },
    {
      name: "HuggingFace",
      value: "huggingface",
      logo: HuggingFaceLogo,
      options: <HuggingFaceOptions settings={settings} />,
      description:
        "访问150,000多个开源LLM和全球人工智能社区",
    },
    {
      name: "Ollama",
      value: "ollama",
      logo: OllamaLogo,
      options: <OllamaLLMOptions settings={settings} />,
      description: "在您自己的机器上本地运行LLM.",
    },
    {
      name: "LM Studio",
      value: "lmstudio",
      logo: LMStudioLogo,
      options: <LMStudioOptions settings={settings} />,
      description:
        "只需点击几下即可发现、下载并运行数千个前沿LLM.",
    },
    {
      name: "Local AI",
      value: "localai",
      logo: LocalAiLogo,
      options: <LocalAiOptions settings={settings} />,
      description: "在您自己的机器上本地运行LLM.",
    },
    {
      name: "Together AI",
      value: "togetherai",
      logo: TogetherAILogo,
      options: <TogetherAiOptions settings={settings} />,
      description: "运行来自Together AI的开源模型.",
    },
    {
      name: "Mistral",
      value: "mistral",
      logo: MistralLogo,
      options: <MistralOptions settings={settings} />,
      description: "运行Mistral AI的开源模型.",
    },
    {
      name: "Perplexity AI",
      value: "perplexity",
      logo: PerplexityLogo,
      options: <PerplexityOptions settings={settings} />,
      description:
        "运行由Perplexity AI托管的强大的互联网连接模型.",
    },
    {
      name: "OpenRouter",
      value: "openrouter",
      logo: OpenRouterLogo,
      options: <OpenRouterOptions settings={settings} />,
      description: "LLM的统一接口.",
    },
    {
      name: "Groq",
      value: "groq",
      logo: GroqLogo,
      options: <GroqAiOptions settings={settings} />,
      description:
        "可用于实时人工智能应用的最快LLM推理.",
    },
    {
      name: "Native",
      value: "native",
      logo: AnythingLLMIcon,
      options: <NativeLLMOptions settings={settings} />,
      description:
        "使用下载的自定义Llama模型在AnythingLLM实例上聊天.",
    },
  ];

  function handleForward() {
    if (hiddenSubmitButtonRef.current) {
      hiddenSubmitButtonRef.current.click();
    }
  }

  function handleBack() {
    navigate(paths.onboarding.home());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {};
    const formData = new FormData(form);
    data.LLMProvider = selectedLLM;
    for (var [key, value] of formData.entries()) data[key] = value;

    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`无法保存 LLM 设置: ${error}`, "error");
      return;
    }
    navigate(paths.onboarding.embeddingPreference());
  };

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  useEffect(() => {
    const filtered = LLMS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM]);

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="w-full">
        <div className="w-full relative border-slate-300/40 shadow border-2 rounded-lg text-white">
          <div className="w-full p-4 absolute top-0 rounded-t-lg backdrop-blur-sm">
            <div className="w-full flex items-center sticky top-0">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="absolute left-4 z-30 text-white"
              />
              <input
                type="text"
                placeholder="搜索LLM提供商"
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
            {filteredLLMs.map((llm) => {
              if (llm.value === "native" && isHosted) return null;
              return (
                <LLMItem
                  key={llm.name}
                  name={llm.name}
                  value={llm.value}
                  image={llm.logo}
                  description={llm.description}
                  checked={selectedLLM === llm.value}
                  onClick={() => setSelectedLLM(llm.value)}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-y-1">
          {selectedLLM &&
            LLMS.find((llm) => llm.value === selectedLLM)?.options}
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
