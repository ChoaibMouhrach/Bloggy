import {
  Button,
  DropDown,
  DropDownItem,
  DropDownItemsWrapper,
  DropDownTrigger,
} from "ui";
import { IUser } from "..";

interface AvatarProps {
  user: IUser;
}

export default function Avatar({ user }: AvatarProps) {
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
          <Button className="!justify-start w-full">Sign Out</Button>
        </DropDownItem>
      </DropDownItemsWrapper>
    </DropDown>
  );
}
