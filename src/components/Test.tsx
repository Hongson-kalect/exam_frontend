import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
} from "@mui/icons-material";
import { Button } from "antd";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../stores/appState";
import useUserState from "../stores/userState";
import { setCookie } from "../utils/cookie";
import { fetchData } from "../utils/fetchFunction";

export interface ILoginProps {}

export function Login(props: ILoginProps) {
  const params = useParams();
  const navigate = useNavigate();
  const appState = useAppState();
  const userState = useUserState();
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailRef.current?.value && passwordRef.current?.value) {
      const fetchBody = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      appState.setIsLoading(true);
      const response = await fetchData("login", "POST", fetchBody);
      appState.setIsLoading(false);
      if (response.status === 1) {
        userState.setUserId(response.data.token);
        navigate("/");
      } else {
        console.log(response.message);
      }
    }
  };
  const togglePasswordVisible = () => {
    setIsShowPassword(!isShowPassword);
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-bl from-blue-700 to-green-500">
      <div className="flex flex-col border bg-white border-black w-4/12 h-5/6 rounded-lg p-4 bg-center bg-cover overflow-auto hide-scroll">
        <p className="text-center font-semibold text-3xl text-green-400">
          Test
        </p>
        <form action="" onSubmit={handleSubmitForm} className="flex flex-col">
          <div className="form-input ">
            <input
              ref={emailRef}
              className="border border-gray-800 w-full mt-12 h-10 rounded-md px-3 py-2 text-lg"
              type="text"
              name="email"
              placeholder="enter email..."
            />
          </div>
          <div className="form-input relative ">
            <input
              ref={passwordRef}
              className="border border-gray-800 w-full mt-8 h-10 rounded-md px-3 py-2 text-lg"
              type={isShowPassword ? "text" : "password"}
              name="password"
              placeholder="enter password..."
            />
            <div className="icon absolute right-4 top-10">
              {!isShowPassword ? (
                <Visibility
                  onClick={togglePasswordVisible}
                  className="cursor-pointer"
                />
              ) : (
                <VisibilityOff onClick={togglePasswordVisible} />
              )}
            </div>
          </div>
          <div className="mt-12 mx-10 text-center">
            <Button
              htmlType="submit"
              size="large"
              className="w-full"
              type="primary"
            >
              Login
            </Button>
          </div>
        </form>
        <p className="italic text-blue-500 text-sm text-center mt-4 cursor-pointer">
          create one account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 text-base text-center underline mt-2 cursor-pointer not-italic"
          >
            sign up
          </span>{" "}
          here
        </p>
        <p className="italic text-blue-500 text-sm underline text-center mt-4 cursor-pointer">
          forget your password?
        </p>
        <p className="text-center mt-10">or login with</p>
        <div
          className="other-login-method flex items-center justify-around flex-1"
          style={{ padding: "20px 25% 50px 25%" }}
        >
          <Google color="warning" className="!text-5xl cursor-pointer" />
          <Facebook color="primary" className="text-5xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
