import { DefaultLayout } from "./DefaultLayout";
import { SubjectLeftOption } from "../components/Subject/SubjectComponent/SubjectLeftOption";

import {
  ArrowBackIos,
  Groups,
  Home,
  ManageSearch,
  MeetingRoom,
  PostAdd,
  Search,
  SearchOutlined,
} from "@mui/icons-material";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import * as React from "react";
import { fetchData } from "../utils/fetchFunction";
import { Button } from "../components/Button";
import { getLocalStorage } from "../utils/localStorage";
import { getCookie } from "../utils/cookie";
import { toast } from "react-toastify";
import { getSession, setSession } from "../utils/session";
import { Modal, Spin } from "antd";
import { MemberManage } from "../components/Subject/SubjectComponent/MemberManage";
import useExamState from "../stores/examStates";
import useUserState from "../stores/userState";
import { IAppState } from "../stores/appState";

export interface ISubjectProps {
  children?: React.ReactNode;
  Layout?: React.FC;
  appState: IAppState;
}

export function Subject(props: ISubjectProps) {
  const examState = useExamState();
  const userState = useUserState();

  const navigate = useNavigate();
  const params = useParams();
  const [permission, setPermission] = React.useState("member");
  const [name, setName] = React.useState("70DCHT12");
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [memberShow, setMemberShow] = React.useState(false);

  const onSeach = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const getPermission = async () => {
    const fetchBody = {
      subjectId: examState.subjectId,
      id: userState.userId,
    };

    const permission = await fetchData("subject/permission", "post", fetchBody);
    setSession("permission", permission);
    setPermission(permission);
  };

  const handleLeaveRoom = async () => {
    const permission = getSession("permission");
    if (permission === "host") {
      toast.warning(
        "Your are host of this room, disband this instead or pass host before leave"
      );
    } else {
      const yes = window.confirm("Are you sure about leave?");
      if (yes) {
        const fetchBody = {
          subjectId: examState.subjectId,
          id: userState.userId,
        };
        props.appState.setIsLoading(true);
        const leaveRes = await fetchData("subject/leave", "post", fetchBody);
        props.appState.setIsLoading(false);
        if (leaveRes.status === 1) {
          toast.success("Leave room completed");
          navigate("/");
        } else {
          toast.success(leaveRes.message);
        }
      }
    }
  };

  const handleDisbandRoom = async () => {
    const yes = window.confirm(
      "Are you sure about disband this room? This action cannot reverce!!!"
    );
    if (yes) {
      const realYes = window.confirm("No regret?");
      if (realYes) {
        const fetchBody = {
          subjectId: examState.subjectId,
          id: userState.userId,
        };
        props.appState.setIsLoading(true);
        const fetchRes: any = await fetchData(
          "subject/disband",
          "post",
          fetchBody
        );
        props.appState.setIsLoading(false);
        if (fetchRes.status === 1) {
          toast.success("Delete Completed");
          navigate("/");
        } else {
          toast.error(fetchRes.message);
        }
      }
    }
  };

  const to = (link: string) => {
    navigate(link);
  };
  React.useEffect(() => {
    if (!(examState.subjectId && userState.userId)) {
      navigate("/");
    } else getPermission();
  }, []);
  React.useEffect(() => {
    const fetchName = async () => {
      if (examState.subjectId) {
        const subjectName = await fetchData(
          "subject/get-name/" + examState.subjectId,
          "get"
        );
        setName(subjectName.data?.name || "A");
      }
    };
    fetchName();
  }, [params]);

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full">
        <div className="header flex  items-center justify-between border bg-primary py-1 px-2">
          <div className="left-header items-center flex justify-start  font-bold">
            <div className="px-2 py-1 cursor-pointer">
              <ArrowBackIos
                className="text-sm stroke-slate-200 stroke-2"
                onClick={() => navigate("/")}
              />
            </div>
            {/* diplayName here */}
            <p className="pt-0.5 text-white">{name}</p>
          </div>
          <div className="right-header flex items-center justify-end">
            {isSearchVisible && (
              <div
                className="input-wrap w-1/5  rounded-l-full h-7 overflow-hidden mr-2"
                style={{ width: "20vw" }}
              >
                <form
                  onSubmit={onSeach}
                  className="flex items-center justify-center "
                >
                  <input
                    ref={searchRef}
                    className="mx-1 px-4 py-1 w-full rounded-full outline-none caret-primary"
                    type="text"
                    placeholder="search..."
                  />
                </form>
              </div>
            )}
            <div
              className="p-1 cursor-pointer"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="mr-1 text-3xl text-white" />
            </div>
            <Tooltip title="Member">
              <div onClick={() => setMemberShow(true)}>
                <Groups
                  fontSize="large"
                  className="text-white cursor-pointer"
                />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="content flex" style={{ height: "calc( 100% - 40px )" }}>
          <div className="left-content">
            <div>
              <SubjectLeftOption
                icon={<Home />}
                title="Home"
                onClick={() => to("home")}
              />
              <SubjectLeftOption
                icon={<ManageSearch />}
                title="View all question"
                onClick={() => to("question")}
              />
              <SubjectLeftOption
                icon={<PostAdd />}
                title="View Test Subject"
                onClick={() => to("subject_test")}
              />
              {(permission === "host" || permission === "deputy") && (
                <SubjectLeftOption
                  icon={<MeetingRoom />}
                  title="Create a new Examination Room"
                  onClick={() => to("create_exam")}
                />
              )}
            </div>
            <div className="bottom">
              <div className="bottom-button">
                <Button
                  size="small"
                  background="bg-green-500"
                  color="text-white"
                  title="Room Info"
                  onClick={() => to("info")}
                />
              </div>
              <div className="bottom-button">
                <Button
                  size="small"
                  background="bg-red-400"
                  color="text-white"
                  title="Leave Room"
                  onClick={handleLeaveRoom}
                />
              </div>
              {permission === "host" && (
                <div className="bottom-button">
                  <Button
                    size="small"
                    background="bg-red-500"
                    color="text-white"
                    title="Disband Room"
                    onClick={handleDisbandRoom}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="right-content">
            <div className="mg5">
              <div className="subject-layout-child hide-scroll">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={memberShow}
        onCancel={() => {
          setMemberShow(false);
        }}
        width={360}
        closable={false}
        footer={false}
      >
        <div
          className=" overflow-y-scroll hide-scroll"
          style={{ height: "70vh" }}
        >
          <MemberManage />
        </div>
      </Modal>
    </DefaultLayout>
  );
}
export default Subject;
