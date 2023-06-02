import { getUser } from "@/features/slices/userSlice";
import { useSelector } from "react-redux";
import { Button } from "ui";

interface NavigationContent {
  forceOpen?: boolean;
}

export default function NavigationContent({ forceOpen }: NavigationContent) {
  const user = useSelector(getUser);

  return (
    <div
      className={`gap-2 ${
        forceOpen ? "flex flex-col" : "hidden lg:flex items-center "
      }`}
    >
      <Button className="!justify-start" variant="text" href="/">
        Home
      </Button>
      <Button className="!justify-start" variant="text" href="/posts">
        Posts
      </Button>
      {!user && (
        <Button className="!justify-start" href="/sign-in">
          Sign In
        </Button>
      )}
    </div>
  );
}
