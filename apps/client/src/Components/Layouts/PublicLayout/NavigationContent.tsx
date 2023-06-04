import React from "react";
import { Button } from "ui";
import useGetUser from "@/features/User/useGetUser";

interface NavigationContentProps {
  forceOpen?: boolean;
}

export default function NavigationContent({
  forceOpen,
}: NavigationContentProps) {
  const user = useGetUser();

  return (
    <div
      className={`gap-2 ${
        forceOpen ? "flex flex-col" : "hidden lg:flex items-center "
      }`}
    >
      <Button className="!justify-start" variant="text" href="/">
        Home
      </Button>
      {!user && (
        <Button className="!justify-start" href="/sign-in">
          Sign In
        </Button>
      )}
    </div>
  );
}
