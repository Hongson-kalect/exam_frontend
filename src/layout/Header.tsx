import { Logout, LogoutOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { eraseCookie } from "../utils/cookie";
import useUserState from "../stores/userState";

export interface IHeaderProps {}

export function Header(props: IHeaderProps) {
  const navigate = useNavigate();
  const userState = useUserState();
  const handelLogOut = () => {
    // clear current user info
    eraseCookie("token");
    navigate("/login");
  };
  return (
    <div className="flex items-center justify-between py-2 h-full">
      <div className="title w-1/4 uppercase text-2xl text-primary cursor-pointer hover:opacity-80 mx-4 font-semibold">
        exam application
      </div>
      <div className="notify p-1 text-center w-1/2 h-full overflow-auto hide-scroll"></div>
      <div className="ultil flex items-center justify-end px-1 py-1 gap-1 w-1/4 overflow-hidden text-sm">
        <div className="profile flex items-center gap-1">
          <p className="whitespace-nowrap text-ellipsis ">{userState.name}</p>
          <Avatar
            src={userState.avatar}
            className="w-8 h-8 cursor-pointer hover:opacity-80"
          >
            {userState.avatar
              ? ""
              : userState.avatar.charAt(0).toUpperCase() || "A"}
          </Avatar>
        </div>
        <p className="help border-l pl-1 cursor-pointer hover:opacity-80">
          HELP?
        </p>
        <div className="language-wrap flex flex-nowrap gap-1 border-x pl-1">
          <p className="bg-yellow-200 text-red-600 w-6 h-6 text-center rounded-full cursor-pointer hover:opacity-80">
            VI
          </p>
          <p className=" w-6 h-6 cursor-pointer hover:opacity-80">EN</p>
        </div>
        <div
          className="log-out cursor-pointer hover:opacity-80"
          onClick={handelLogOut}
        >
          <LogoutOutlined className="text-3xl" color="error" />
        </div>
      </div>
    </div>
  );
}
