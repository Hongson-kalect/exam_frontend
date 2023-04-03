import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export function DefaultLayout({ children }: any) {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-8">
        <Header />
      </div>
      <div className="bg-white" style={{ height: "calc(100% - 32px)" }}>
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
}
