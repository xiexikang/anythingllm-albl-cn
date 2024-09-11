import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import ZillizLogo from "@/media/vectordbs/zilliz.png";
import AstraDBLogo from "@/media/vectordbs/astraDB.png";
import ChromaLogo from "@/media/vectordbs/chroma.png";
import PineconeLogo from "@/media/vectordbs/pinecone.png";
import LanceDbLogo from "@/media/vectordbs/lancedb.png";
import WeaviateLogo from "@/media/vectordbs/weaviate.png";
import QDrantLogo from "@/media/vectordbs/qdrant.png";
import MilvusLogo from "@/media/vectordbs/milvus.png";
import React, { useState, useEffect } from "react";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";

const TITLE = "资料处理及私隐";
const DESCRIPTION = "当涉及到您的个人数据时，我们致力于透明度和控制.";
export const LLM_SELECTION_PRIVACY = {
  openai: {
    name: "OpenAI",
    description: [
      "您的聊天内容不会用于培训",
      "OpenAI 可以看到您在响应创建中使用的提示和文档文本",
    ],
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    description: [
      "您的聊天内容不会用于培训",
      "您的文本和嵌入文本对 OpenAI 或 Microsoft 不可见",
    ],
    logo: AzureOpenAiLogo,
  },
  anthropic: {
    name: "Anthropic",
    description: [
      "您的聊天内容不会用于培训",
      "Anthropic 可以看到您在创建响应时使用的提示和文档文本",
    ],
    logo: AnthropicLogo,
  },
  gemini: {
    name: "Google Gemini",
    description: [
      "您的聊天内容将被去识别化并用于训练",
      "Google 可以看到您在创建回复时使用的提示和文档文本",
    ],
    logo: GeminiLogo,
  },
  lmstudio: {
    name: "LMStudio",
    description: ["您的模型和聊天只能在运行 LMStudio 的服务器上访问"],
    logo: LMStudioLogo,
  },
  localai: {
    name: "LocalAI",
    description: ["您的模型和聊天只能在运行 LocalAI 的服务器上访问"],
    logo: LocalAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: ["您的模型和聊天只能在运行 Ollama 模型的计算机上访问"],
    logo: OllamaLogo,
  },
  native: {
    name: "Custom Llama Model",
    description: ["您的模型和聊天只能在此 AnythingLLM 实例上访问"],
    logo: AnythingLLMIcon,
  },
  togetherai: {
    name: "TogetherAI",
    description: [
      "您的聊天内容不会用于培训",
      "TogetherAI 可以看到您在创建响应时使用的提示和文档文本",
    ],
    logo: TogetherAILogo,
  },
  mistral: {
    name: "Mistral",
    description: ["Mistral 可以看到您在创建响应时使用的提示和文档文本"],
    logo: MistralLogo,
  },
  huggingface: {
    name: "HuggingFace",
    description: [
      "您的提示和响应中使用的文档文本将发送到您的 HuggingFace 托管端点",
    ],
    logo: HuggingFaceLogo,
  },
  perplexity: {
    name: "Perplexity AI",
    description: [
      "您的聊天内容不会用于培训",
      "Perplexity AI 可以看到您在创建响应时使用的提示和文档文本",
    ],
    logo: PerplexityLogo,
  },
  openrouter: {
    name: "OpenRouter",
    description: [
      "您的聊天内容不会用于培训",
      "OpenRouter 可以看到您在响应创建中使用的提示和文档文本",
    ],
    logo: OpenRouterLogo,
  },
  groq: {
    name: "Groq",
    description: [
      "您的聊天内容不会用于培训",
      "Groq 可以看到您在响应创建中使用的提示和文档文本",
    ],
    logo: GroqLogo,
  },
};

export const VECTOR_DB_PRIVACY = {
  chroma: {
    name: "Chroma",
    description: [
      "您的向量和文档文本存储在您的 Chroma 实例上",
      "对您的实例的访问由您管理",
    ],
    logo: ChromaLogo,
  },
  pinecone: {
    name: "Pinecone",
    description: [
      "您的矢量和文档文本存储在 Pinecone 的服务器上",
      "对您数据的访问由 Pinecone 管理",
    ],
    logo: PineconeLogo,
  },
  qdrant: {
    name: "Qdrant",
    description: ["您的矢量和文档文本存储在您的 Qdrant 实例（云或自托管）上"],
    logo: QDrantLogo,
  },
  weaviate: {
    name: "Weaviate",
    description: ["您的矢量和文档文本存储在 Weaviate 实例（云或自托管）上"],
    logo: WeaviateLogo,
  },
  milvus: {
    name: "Milvus",
    description: ["您的向量和文档文本存储在您的 Milvus 实例（云或自托管）上"],
    logo: MilvusLogo,
  },
  zilliz: {
    name: "Zilliz Cloud",
    description: ["您的矢量和文档文本存储在您的 Zilliz 云集群上."],
    logo: ZillizLogo,
  },
  astra: {
    name: "AstraDB",
    description: ["您的矢量和文档文本存储在您的云 AstraDB 数据库中."],
    logo: AstraDBLogo,
  },
  lancedb: {
    name: "LanceDB",
    description: ["您的矢量和文档文本私密存储在 阿里巴啦 的此实例上"],
    logo: LanceDbLogo,
  },
};

export const EMBEDDING_ENGINE_PRIVACY = {
  native: {
    name: "AnythingLLM Embedder",
    description: ["您的文档文本私密地嵌入到 阿里巴啦 的此实例中"],
    logo: AnythingLLMIcon,
  },
  openai: {
    name: "OpenAI",
    description: ["您的文档文本将发送到 OpenAI 服务器", "您的文档不用于培训"],
    logo: OpenAiLogo,
  },
  azure: {
    name: "Azure OpenAI",
    description: [
      "您的文档文本将发送到您的 Microsoft Azure 服务",
      "您的文档不用于培训",
    ],
    logo: AzureOpenAiLogo,
  },
  localai: {
    name: "LocalAI",
    description: ["您的文档文本私密地嵌入到运行 LocalAI 的服务器上"],
    logo: LocalAiLogo,
  },
  ollama: {
    name: "Ollama",
    description: ["您的文档文本私密地嵌入到运行 Ollama 的服务器上"],
    logo: OllamaLogo,
  },
};

export default function DataHandling({ setHeader, setForwardBtn, setBackBtn }) {
  const [llmChoice, setLLMChoice] = useState("openai");
  const [loading, setLoading] = useState(true);
  const [vectorDb, setVectorDb] = useState("pinecone");
  const [embeddingEngine, setEmbeddingEngine] = useState("openai");
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: false, disabled: false, onClick: handleBack });
    async function fetchKeys() {
      const _settings = await System.keys();
      setLLMChoice(_settings?.LLMProvider || "openai");
      setVectorDb(_settings?.VectorDB || "pinecone");
      setEmbeddingEngine(_settings?.EmbeddingEngine || "openai");

      setLoading(false);
    }
    fetchKeys();
  }, []);

  function handleForward() {
    navigate(paths.onboarding.survey());
  }

  function handleBack() {
    navigate(paths.onboarding.userSetup());
  }

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-20">
        <PreLoader />
      </div>
    );

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">LLM选择</div>
          <div className="flex items-center gap-2.5">
            <img
              src={LLM_SELECTION_PRIVACY[llmChoice].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {LLM_SELECTION_PRIVACY[llmChoice].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {LLM_SELECTION_PRIVACY[llmChoice].description.map((desc) => (
              <li className="text-white/90 text-sm">{desc}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">嵌入引擎</div>
          <div className="flex items-center gap-2.5">
            <img
              src={EMBEDDING_ENGINE_PRIVACY[embeddingEngine].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {EMBEDDING_ENGINE_PRIVACY[embeddingEngine].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {EMBEDDING_ENGINE_PRIVACY[embeddingEngine].description.map(
              (desc) => (
                <li className="text-white/90 text-sm">{desc}</li>
              )
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 pb-4">
          <div className="text-white text-base font-bold">向量数据库</div>
          <div className="flex items-center gap-2.5">
            <img
              src={VECTOR_DB_PRIVACY[vectorDb].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {VECTOR_DB_PRIVACY[vectorDb].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {VECTOR_DB_PRIVACY[vectorDb].description.map((desc) => (
              <li className="text-white/90 text-sm">{desc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
