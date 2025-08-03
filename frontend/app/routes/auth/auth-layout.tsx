import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Outlet />
    </div>
  );
}

export default AuthLayout;