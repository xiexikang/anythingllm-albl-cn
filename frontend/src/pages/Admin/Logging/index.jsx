import Sidebar from "@/components/SettingsSidebar";
import useQuery from "@/hooks/useQuery";
import System from "@/models/system";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import LogRow from "./LogRow";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";

export default function AdminLogs() {
  const handleResetLogs = async () => {
    if (!window.confirm("您确定要清除所有日志吗？ 此操作不可逆转.")) return;
    const { success, error } = await System.clearEventLogs();
    if (success) {
      showToast("日志已成功清除.", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showToast(`清除日志失败: ${error}`, "error");
    }
  };
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="flex gap-x-4 items-center">
              <p className="text-lg leading-6 font-bold text-white">日志</p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              可以查看所有的操作、事件日志。
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={handleResetLogs}
              className="mt-3 mr-0 -mb-14 z-10"
            >
              清除
            </CTAButton>
          </div>
          <LogsContainer />
        </div>
      </div>
    </div>
  );
}

function LogsContainer() {
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);

  const handlePrevious = () => {
    setOffset(Math.max(offset - 1, 0));
  };
  const handleNext = () => {
    setOffset(offset + 1);
  };

  useEffect(() => {
    async function fetchLogs() {
      const { logs: _logs, hasPages = false } = await System.eventLogs(offset);
      setLogs(_logs);
      setCanNext(hasPages);
      setLoading(false);
    }
    fetchLogs();
  }, [offset]);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left rounded-lg mt-6">
        <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              事件类型
            </th>
            <th scope="col" className="px-6 py-3">
              执行用户
            </th>
            <th scope="col" className="px-6 py-3">
              时间
            </th>
            <th scope="col" className="px-6 py-3 rounded-tr-lg">
              {" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {!!logs && logs.map((log) => <LogRow key={log.id} log={log} />)}
        </tbody>
      </table>
      <div className="flex w-full justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={offset === 0}
        >
          上一页
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={!canNext}
        >
          下一页
        </button>
      </div>
    </>
  );
}
