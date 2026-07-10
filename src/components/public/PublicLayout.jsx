import React from "react";
import { Outlet } from "react-router-dom";
import PublicNav from "@/components/public/PublicNav";
import PublicFooter from "@/components/public/PublicFooter";

export default function PublicLayout() {
  return (
    <div className="universe-shell min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
