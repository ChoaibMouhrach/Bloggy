import React, { useState } from "react";
import Nav from "./Nav";
import NavigationContent from "./NavigationContent";

interface PublicProps {
  children: React.ReactNode;
}

function PublicLayout({ children }: PublicProps) {
  const [open, setOpen] = useState(false);
  return (
    <main className="h-screen flex flex-col gap-4">
      <Nav open={open} setOpen={setOpen} />
      <section className="container px-4 lg:px-0 mx-auto h-[calc(100vh_-_80px)] overflow-y-scroll">
        {open ? <NavigationContent forceOpen /> : children}
      </section>
    </main>
  );
}

export default PublicLayout;
