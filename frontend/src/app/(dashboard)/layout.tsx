import Header from "@/components/Headers/Header";
import DashboardSidebarLayout from "@/components/Sidebar/Sidebar";
import React from "react";
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }:DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex">
        <DashboardSidebarLayout />
        <section className=" w-full">{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;
