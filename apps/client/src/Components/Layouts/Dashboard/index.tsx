// imports
import React from "react";
import SideNav from "./SideNav";
import { Nav } from "../../Nav";
import { SIDE_NAV_ELEMENTS } from "@/config/constants";

// interfaces
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// layout
export function DashboardLayout({ children }: DashboardLayoutProps) {
  // JSX
  return (
    <main className="h-screen w-screen flex flex-col gap-4">
      {/* Navigation bar */}
      <Nav />
      <section className="container mx-auto grid grid-cols-6">
        <SideNav sideNavElements={SIDE_NAV_ELEMENTS} />
        <article className="overflow-scroll h-[calc(100vh_-_80px)] flex flex-col gap-8 col-start-1 lg:col-start-2 col-end-7 px-4">
          {children}
        </article>
      </section>
    </main>
  );
}
