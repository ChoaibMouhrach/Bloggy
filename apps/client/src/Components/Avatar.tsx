import React from "react";
import {
  Button,
  DropDown,
  DropDownItem,
  DropDownItemsWrapper,
  DropDownTrigger,
} from "ui";
import { IUser } from "..";
import useSignOut from "@/features/Auth/useSignOut";

interface AvatarProps {
  user: IUser;
}

export default function Avatar({ user }: AvatarProps) {
  const {
    signOut,
    meta: { isLoading },
  } = useSignOut();

  const handleSignOut = () => signOut();

  return (
    <DropDown>
      <DropDownTrigger>
        <div className="hover:bg-gray-100 rounded-full border border-stone-300 w-10 h-10 text-xs uppercase flex items-center justify-center font-semibold">
          {user.username.slice(0, 2)}
        </div>
      </DropDownTrigger>
      <DropDownItemsWrapper>
        {user && user.Role?.id === 1 ? (
          <DropDownItem>
            <Button
              className="!justify-start w-full"
              variant="text"
              href="/dashboard"
            >
              Dashboard
            </Button>
          </DropDownItem>
        ) : null}
        <DropDownItem>
          <Button
            className="!justify-start w-full"
            variant="text"
            href="/dashboard/profile"
          >
            Profile
          </Button>
        </DropDownItem>
        <DropDownItem>
          <Button
            onClick={handleSignOut}
            isLoading={isLoading}
            className="!justify-start w-full"
          >
            Sign Out
          </Button>
        </DropDownItem>
      </DropDownItemsWrapper>
    </DropDown>
  );
}
