import React from "react";
import {
  Button,
  DropDown,
  DropDownItem,
  DropDownItemsWrapper,
  DropDownTrigger,
} from "ui";
import { MdOutlineMenu } from "react-icons/md";
import { NAV_ITEMS } from "@/config/constants";
import Logo from "./Logo";
import useGetUser from "@/features/User/useGetUser";
import useSignOut from "@/features/Auth/useSignOut";

export interface NavItem {
  name: string;
  href: string;
}

interface NavProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Nav({ open, setOpen }: NavProps) {
  const {
    signOut,
    meta: { isLoading },
  } = useSignOut();
  const user = useGetUser();

  const handleSignOut = () => signOut();

  return (
    <nav className="h-16 ">
      <div className="h-full px-4 lg:px-0 container mx-auto flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Logo />
          <Button
            onClick={() => setOpen && setOpen(!open)}
            variant="text"
            className="lg:hidden"
          >
            <MdOutlineMenu className="text-lg" />
          </Button>
        </div>
        <div className="flex items-center gap-4 font-semibold text-gray-600">
          {!user && <Button href="/sign-in">Sign In</Button>}
          {user && (
            <DropDown>
              <DropDownTrigger>
                <div className="hover:bg-gray-100 rounded-full border border-stone-300 w-10 h-10 text-xs uppercase flex items-center justify-center font-semibold">
                  {user?.username.slice(0, 2)}
                </div>
              </DropDownTrigger>
              <DropDownItemsWrapper>
                {NAV_ITEMS.map(({ href, name }) => (
                  <DropDownItem key={href}>
                    <Button
                      variant="text"
                      className="!justify-start block"
                      href={href}
                    >
                      {name}
                    </Button>
                  </DropDownItem>
                ))}

                {user && user.Role?.id === 1 ? (
                  <DropDownItem>
                    <Button
                      variant="text"
                      className="justify-start block"
                      href="/dashboard"
                    >
                      Dashboard
                    </Button>
                  </DropDownItem>
                ) : null}

                <DropDownItem className="!p-0">
                  <Button
                    className="!justify-start w-full"
                    isLoading={isLoading}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </DropDownItem>
              </DropDownItemsWrapper>
            </DropDown>
          )}
        </div>
      </div>
    </nav>
  );
}
