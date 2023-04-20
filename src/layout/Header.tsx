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
    <div className="top-nav bg-gray-300">
      <div className="flex left app-name">exam application</div>
      {/* <div className="notify p-1 text-center w-1/2 h-full overflow-auto hide-scroll"></div> */}
      <div className="flex right">
        <div className="itemLeft">
          <p className="whitespace-nowrap text-ellipsis ">{userState.name}</p>
          <Avatar className="userAvatar" src={userState.avatar}>
            {userState.avatar
              ? ""
              : userState.avatar.charAt(0).toUpperCase() || "A"}
          </Avatar>
        </div>
        <div className="itemLeft">
          <p className="">HELP?</p>
        </div>
        <div className="itemLeft">
          <p>VI</p>
          <p>EN</p>
        </div>
        <div className="itemLeft" onClick={handelLogOut}>
          <LogoutOutlined className="text-3xl" color="error" />
        </div>
      </div>
    </div>
  );
}
