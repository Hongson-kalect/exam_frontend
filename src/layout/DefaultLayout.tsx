import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export function DefaultLayout({ children }: any) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex">
        <Header />
      </div>
      <div className="bg-white w-full" style={{ height: "calc(100% - 42px)" }}>
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
}
