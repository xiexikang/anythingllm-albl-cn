import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BookOpen } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import WorkspaceRow from "./WorkspaceRow";
import NewWorkspaceModal from "./NewWorkspaceModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";

export default function AdminWorkspaces() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                实例的工作空间
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              可以查看所有的工作区。删除工作区将会删除所有的聊天记录和配置。
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton onClick={openModal} className="mt-3 mr-0 -mb-14 z-10">
              <BookOpen className="h-4 w-4" weight="bold" /> 创建工作区
            </CTAButton>
          </div>
          <WorkspacesContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewWorkspaceModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function WorkspacesContainer() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const _users = await Admin.users();
      const _workspaces = await Admin.workspaces();
      setUsers(_users);
      setWorkspaces(_workspaces);
      setLoading(false);
    }
    fetchData();
  }, []);

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
    <table className="w-full text-sm text-left rounded-lg mt-6">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            名称
          </th>
          <th scope="col" className="px-6 py-3">
            链接
          </th>
          <th scope="col" className="px-6 py-3">
            用户数
          </th>
          <th scope="col" className="px-6 py-3">
            创建日期
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {workspaces.map((workspace) => (
          <WorkspaceRow
            key={workspace.id}
            workspace={workspace}
            users={users}
          />
        ))}
      </tbody>
    </table>
  );
}
