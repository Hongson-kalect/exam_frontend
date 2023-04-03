import { MoreVert } from "@mui/icons-material";
import { Avatar } from "antd";
import { type } from "os";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useExamState from "../../../stores/examStates";
import useUserState from "../../../stores/userState";
import { getCookie } from "../../../utils/cookie";
import { fetchData } from "../../../utils/fetchFunction";
import { getLocalStorage } from "../../../utils/localStorage";
import { getSession } from "../../../utils/session";

export interface IMemberItemProps {
  getMember: () => void;
  search: string;
  email: any;
  type: "host" | "deputy" | "member";
}

export function MemberItem({
  search,
  email,
  type,
  getMember,
}: IMemberItemProps) {
  const navigate = useNavigate();
  const examState = useExamState();
  const userState = useUserState();

  const [permission] = React.useState(() => getSession("permission"));
  const [memberInfo, setMemberInfo] = React.useState<any>({});
  const getMemberInfo = async () => {
    const infoRes = await fetchData(
      "member/info?email=" +
        email +
        "&subjectId=" +
        examState.subjectId +
        "&userId=" +
        userState.userId,
      "get"
    );
    if (infoRes.status === 1) {
      setMemberInfo(infoRes.data);
      getMember();
    } else {
      toast.error(infoRes.message);
    }
  };
  const handleMakeHost = async (e: any) => {
    const yes = window.confirm(
      "Are you sure made this account to host? You will push to home"
    );
    if (yes) {
      const fetchBody = {
        userId: userState.userId,
        subjectId: examState.subjectId,
        email: e.target.dataset.email,
      };
      const makeHostRes = await fetchData(
        "subject/make-host",
        "post",
        fetchBody
      );
      if (makeHostRes.status === 1) {
        getMember();
        navigate("/");
      }
      console.log(makeHostRes);
    }
  };
  const handleRemoveDeputy = async (e: any) => {
    const yes = window.confirm("Are you sure take deputy permisson?");
    if (yes) {
      const fetchBody = {
        userId: userState.userId,
        subjectId: examState.subjectId,
        email: e.target.dataset.email,
      };
      const removeDeputyRes = await fetchData(
        "subject/remove-deputy",
        "post",
        fetchBody
      );
      if (removeDeputyRes.status === 1) {
        getMember();
      }
      console.log(removeDeputyRes);
    }
  };
  const handleMakeDeputy = async (e: any) => {
    const yes = window.confirm("Make this account to a deputy?");
    if (yes) {
      const fetchBody = {
        userId: userState.userId,
        subjectId: examState.subjectId,
        email: e.target.dataset.email,
      };
      const makeDeputyRes = await fetchData(
        "subject/make-deputy",
        "post",
        fetchBody
      );
      if (makeDeputyRes.status === 1) {
        getMember();
      }
      console.log(makeDeputyRes);
    }
  };
  const handleKick = async (e: any) => {
    const yes = window.confirm("This member will be remove! Are you sure?");
    if (yes) {
      const fetchBody = {
        userId: userState.userId,
        subjectId: examState.subjectId,
        email: e.target.dataset.email,
      };
      const kicktRes = await fetchData("subject/kick", "post", fetchBody);
      if (kicktRes.status === 1) {
        getMember();
      }
      console.log(kicktRes);
    }
  };
  React.useEffect(() => {
    getMemberInfo();
  }, []);
  if (
    memberInfo.email?.includes(search) ||
    memberInfo.firstName?.includes(search) ||
    memberInfo.lastName?.includes(search)
  )
    return (
      <div className="flex gap-x-4 items-center shadow px-2 bg-gray-200 hover:bg-blue-200 rounded-lg">
        <Avatar alt="avatar" src={memberInfo?.avatar}>
          {memberInfo.lastName.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex flex-col flex-1">
          <div className="flex gap-x-4 items-center">
            <p className="font-semibold text-sm">
              {memberInfo.lastName + " " + memberInfo.firstName}
            </p>
            <p className="text-xs rounded-full bg-slate-300 color-white px-2">
              {type === "host" ? "Host" : type === "deputy" ? "Deputy" : ""}
            </p>
          </div>
          <p className="text-xs"> {memberInfo.email}</p>
        </div>
        {type !== "host" && permission === "host" && (
          <div className="more relative cursor-pointer">
            <MoreVert />
            <div className="absolute bg-white shadow-lg right-2 top-7/12 z-10 rounded-lg px-3 py-1 w-40">
              <p
                className="shadow px-1 hover:bg-red-100"
                data-email={email}
                onClick={(e) => handleMakeHost(e)}
              >
                Make host
              </p>
              {type === "deputy" ? (
                <p
                  className="shadow px-1 hover:bg-red-100"
                  data-email={email}
                  onClick={(e) => handleRemoveDeputy(e)}
                >
                  Remove deputy
                </p>
              ) : (
                <p
                  className="shadow px-1 hover:bg-red-100"
                  data-email={email}
                  onClick={(e) => handleMakeDeputy(e)}
                >
                  Make deputy
                </p>
              )}
              <p
                className="shadow px-1 bg-red-200 hover:bg-red-500 hover:text-white"
                data-email={email}
                onClick={(e) => handleKick(e)}
              >
                Kick
              </p>
            </div>
          </div>
        )}
        {type === "member" && permission === "deputy" && (
          <div className="more relative cursor-pointer">
            <MoreVert />
            <div className="absolute bg-white shadow-lg right-2 top-7/12 z-10 rounded-lg px-3 py-1 w-40">
              <p
                className="shadow px-1 bg-red-200 hover:bg-red-500 hover:text-white"
                data-email={email}
                onClick={(e) => handleKick(e)}
              >
                Kick
              </p>
            </div>
          </div>
        )}
      </div>
    );
  else return <div></div>;
}
