import { COMPLETE_QUESTIONNAIRE } from "@/utils/constants";
import paths from "@/utils/paths";
import { CheckCircle } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TITLE = "欢迎使用阿里巴啦";
const DESCRIPTION = "帮助我们根据您的需求打造 AnythingLLM.";

async function sendQuestionnaire({ email, useCase, comment }) {
  if (import.meta.env.DEV) {
    console.log("sendQuestionnaire", { email, useCase, comment });
    return;
  }

  return fetch(`https://onboarding-wxich7363q-uc.a.run.app`, {
    method: "POST",
    body: JSON.stringify({
      email,
      useCase,
      comment,
      sourceId: "0VRjqHh6Vukqi0x0Vd0n/m8JuT7k8nOz",
    }),
  })
    .then(() => {
      window.localStorage.setItem(COMPLETE_QUESTIONNAIRE, true);
      console.log(`✅ Questionnaire responses sent.`);
    })
    .catch((error) => {
      console.error(`sendQuestionnaire`, error.message);
    });
}

export default function Survey({ setHeader, setForwardBtn, setBackBtn }) {
  const [selectedOption, setSelectedOption] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate();
  const submitRef = useRef(null);

  function handleForward() {
    if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
      navigate(paths.onboarding.createWorkspace());
      return;
    }

    if (!formRef.current) {
      skipSurvey();
      return;
    }

    // Check if any inputs are not empty. If that is the case, trigger form validation.
    // via the requestSubmit() handler
    const formData = new FormData(formRef.current);
    if (
      !!formData.get("email") ||
      !!formData.get("use_case") ||
      !!formData.get("comment")
    ) {
      formRef.current.requestSubmit();
      return;
    }

    skipSurvey();
  }

  function skipSurvey() {
    navigate(paths.onboarding.createWorkspace());
  }

  function handleBack() {
    navigate(paths.onboarding.dataHandling());
  }

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    await sendQuestionnaire({
      email: formData.get("email"),
      useCase: formData.get("use_case") || "other",
      comment: formData.get("comment") || null,
    });

    navigate(paths.onboarding.createWorkspace());
  };

  if (!!window?.localStorage?.getItem(COMPLETE_QUESTIONNAIRE)) {
    return (
      <div className="w-full flex justify-center items-center py-40">
        <div className="w-full flex items-center justify-center px-1 md:px-8 py-4">
          <div className="w-auto flex flex-col gap-y-1 items-center">
            <CheckCircle size={60} className="text-green-500" />
            <p className="text-white text-lg">Thank you for your feedback!</p>
            <a
              href={paths.mailToMintplex()}
              className="text-sky-400 underline text-xs"
            >
              team@mintplexlabs.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} ref={formRef} className="">
        <div className="md:min-w-[400px]">
          <label htmlFor="email" className="text-white text-base font-medium">
            你的邮箱是什么?{" "}
          </label>
          <input
            name="email"
            type="email"
            placeholder="请输入"
            required={true}
            className="mt-2 bg-zinc-900 text-white placeholder:text-white/20 text-sm font-medium font-['Plus Jakarta Sans'] leading-tight w-full h-11 p-2.5 bg-zinc-900 rounded-lg"
          />
        </div>

        <div className="mt-8">
          <label
            className="text-white text-base font-medium"
            htmlFor="use_case"
          >
            你会用AnythingLLM做什么?{" "}
          </label>
          <div className="mt-2 gap-y-3 flex flex-col">
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "job" ? "border-white border-opacity-40" : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"job"}
                checked={selectedOption === "job"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "job" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                为工作
              </div>
            </label>
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "personal"
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"personal"}
                checked={selectedOption === "personal"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "personal" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                供我个人使用
              </div>
            </label>
            <label
              className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
                selectedOption === "other"
                  ? "border-white border-opacity-40"
                  : ""
              } hover:border-white/60`}
            >
              <input
                type="radio"
                name="use_case"
                value={"other"}
                checked={selectedOption === "other"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
                  selectedOption === "other" ? "bg-white" : ""
                }`}
              ></div>
              <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
                其他
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="comment" className="text-white text-base font-medium">
            对团队有什么意见吗?{" "}
            <span className="text-neutral-400 text-base font-light">
              (可选)
            </span>
          </label>
          <textarea
            name="comment"
            rows={5}
            className="mt-2 bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="如果你现在有任何问题或意见，你可以在这里留下，我们会给你答复的。你也可以发邮件到team@mintplexlabs.com"
            wrap="soft"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          ref={submitRef}
          hidden
          aria-hidden="true"
        ></button>

        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={skipSurvey}
            className="text-white text-base font-medium text-opacity-30 hover:text-opacity-100 mt-8"
          >
            跳过调查
          </button>
        </div>
      </form>
    </div>
  );
}
