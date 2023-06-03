import React from "react";
import { MdOutlineMenu } from "react-icons/md";
import { Button } from "ui";
import Avatar from "@/Components/Avatar";
import Logo from "@/Components/Logo";
import NavigationContent from "./NavigationContent";
import useGetUser from "@/features/User/useGetUser";

interface NavProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Nav({ open, setOpen }: NavProps) {
  const user = useGetUser();
  return (
    <nav className="h-16 flex items-stretch">
      <div className="container px-4 lg:px-0 mx-auto border-b border-stone-300 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setOpen(!open)}
            variant="text"
            className="lg:hidden"
          >
            <MdOutlineMenu className="text-xl" />
          </Button>
          {user ? <Avatar user={user} /> : <NavigationContent />}
        </div>
      </div>
    </nav>
  );
}
