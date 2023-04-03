import * as React from "react";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchFunction";
import { Button } from "antd";
import { toast } from "react-toastify";

export interface ISignUpProps {}

export default function SignUp(props: ISignUpProps) {
  const navigate = useNavigate();
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const phoneRef = React.useRef<HTMLInputElement | null>(null);
  const firstNameRef = React.useRef<HTMLInputElement | null>(null);
  const lastNameRef = React.useRef<HTMLInputElement | null>(null);
  const genderRef = React.useRef<HTMLSelectElement | null>(null);
  const addressRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const rePasswordRef = React.useRef<HTMLInputElement | null>(null);
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      emailRef.current?.value &&
      !emailRef.current?.value.includes(" ") &&
      phoneRef.current?.value &&
      !phoneRef.current?.value.includes(" ") &&
      firstNameRef.current?.value &&
      lastNameRef.current?.value &&
      genderRef.current?.value &&
      !genderRef.current?.value.includes(" ") &&
      addressRef.current?.value &&
      passwordRef.current?.value &&
      !passwordRef.current?.value.includes(" ") &&
      rePasswordRef.current?.value &&
      !rePasswordRef.current?.value.includes(" ")
    ) {
      if (passwordRef.current?.value === rePasswordRef.current?.value) {
        const reqData = {
          email: emailRef.current?.value,
          phone: phoneRef.current?.value,
          firstName: firstNameRef.current?.value,
          lastName: lastNameRef.current?.value,
          gender: genderRef.current?.value,
          address: addressRef.current?.value,
          password: passwordRef.current?.value,
          token: v4(),
        };
        const data = await fetchData("signup", "POST", reqData);
        if (data.status === 1) {
          toast.success("Sign up successfully");
          navigate("/login");
        } else toast.error(data.message);
      } else {
        //handle error
        toast.error("Two password not match");
      }
    } else {
      //handle error
      toast.error("Please fill all fields");
    }
    // router.push("/");
  };
  return (
    <>
      <div className="flex items-center justify-center w-screen h-full bg-gradient-to-bl from-blue-700 to-green-500">
        <div className="flex flex-col border bg-white border-black w-6/12 h-5/6 rounded-lg p-4 bg-center bg-cover overflow-auto hide-scroll">
          <p className="text-center font-semibold text-3xl text-green-400">
            SIGN UP
          </p>
          <form
            action=""
            onSubmit={handleSubmitForm}
            className="flex flex-col gap-y-8"
          >
            <div className="form-input flex justify-between gap-x-6 mt-8">
              <input
                ref={emailRef}
                type="email"
                name="email"
                placeholder="enter email..."
                className="border border-gray-800 w-8/12 rounded-md px-3 py-1"
              />
              <input
                ref={phoneRef}
                type="text"
                name="phone"
                placeholder="enter phone number..."
                className="border border-gray-800 w-4/12 rounded-md px-3 py-2"
              />
            </div>
            <div className="form-input flex justify-between gap-x-4">
              <input
                ref={firstNameRef}
                type="text"
                name="firstName"
                placeholder="enter your first name..."
                className="border border-gray-800 w-5/12 rounded-md px-3 py-1"
              />
              <input
                ref={lastNameRef}
                type="text"
                name="lastName"
                placeholder="enter your last name..."
                className="border border-gray-800 w-6/12 rounded-md px-3 py-2"
              />
            </div>
            <div className="form-input flex justify-between gap-x-6">
              <select
                ref={genderRef}
                name="gender"
                id="gender"
                className="outline-none border border-gray-800 w-52 rounded-md px-3 py-1 text-center"
              >
                <option value="">---Choose gender---</option>
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
                <option value={"other"}>Other</option>
              </select>
              <input
                ref={addressRef}
                type="text"
                name="address"
                placeholder="enter your address..."
                className="border border-gray-800 flex-1 rounded-md px-3 py-2"
              />
            </div>
            <div className="form-input flex justify-between gap-x-4">
              <input
                ref={passwordRef}
                type="text"
                name="password"
                placeholder="enter your password..."
                className="border border-gray-800 w-6/12 rounded-md px-3 py-1"
              />
              <input
                ref={rePasswordRef}
                type="text"
                placeholder="re check your password..."
                className="border border-gray-800 w-6/12 rounded-md px-3 py-2"
              />
            </div>
            <div className="mt-12 mx-10 text-center">
              <Button
                htmlType="submit"
                size="large"
                className="w-full"
                type="primary"
              >
                Sign up
              </Button>
            </div>
          </form>
          <div className="italic text-gray-600 text-sm underline text-center mt-4 cursor-pointer">
            have an account already?{" "}
            <p className="text-blue-600" onClick={() => navigate("/login")}>
              Login
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
