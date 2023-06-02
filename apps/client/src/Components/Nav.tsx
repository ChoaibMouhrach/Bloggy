import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  Button,
  DropDown,
  DropDownItem,
  DropDownItemsWrapper,
  DropDownTrigger,
} from "ui";
import { MdOutlineMenu } from "react-icons/md";
import { NAV_ITEMS } from "@/config/constants";
import { useSignOutMutation } from "@/features/Auth/auth.api";
import { removeUser } from "@/features/User/user.slice";
import useToast from "@/features/Toast/useToast";
import Logo from "./Logo";
import useGetUser from "@/features/User/useGetUser";

export interface NavItem {
  name: string;
  href: string;
}

interface NavProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Nav({ open, setOpen }: NavProps) {
  const [signOut, { isLoading }] = useSignOutMutation();
  const user = useGetUser();
  const router = useRouter();
  const { t } = useToast();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    const response = await signOut();

    if ("data" in response) {
      dispatch(removeUser());
      t([
        {
          state: "success",
          title: "GoodBye",
        },
      ]);

      router.push("/");
    }

    if ("error" in response) {
      t([
        {
          state: "danger",
          title: "Sorry! we couldn't sign you out",
        },
      ]);
    }
  };

  return (
    <nav className="h-16 px-4 lg:px-0">
      <div className="h-full container mx-auto flex items-center justify-between border-b">
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

                <DropDownItem>
                  <Button
                    variant="text"
                    className="justify-start block"
                    href="/dashboard"
                  >
                    Dashboard
                  </Button>
                </DropDownItem>

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
