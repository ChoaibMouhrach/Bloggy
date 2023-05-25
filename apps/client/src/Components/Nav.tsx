import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "ui";
import { NAV_ITEMS } from "@/config/constants";
import { useSignOutMutation } from "@/features/apis/authApi";
import { getUser, removeUser } from "@/features/slices/userSlice";
import useToast from "@/hooks/useToast";

export interface NavItem {
  name: string;
  href: string;
}

export function Nav() {
  const [signOut, { isLoading }] = useSignOutMutation();
  const user = useSelector(getUser);
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
    <nav className="h-16">
      <div className="h-full container mx-auto flex items-center justify-between border-b ">
        <Link href="/" className="font-bold tracking-wide text-lg">
          ChoaibMouhrach
        </Link>
        <div className="flex items-center gap-4 font-semibold text-gray-600">
          {NAV_ITEMS.map(({ href, name }) => (
            <Link key={href} href={href}>
              {name}
            </Link>
          ))}
          {user && <Link href="/dashboard">Dashboard</Link>}
          {user ? (
            <Button isLoading={isLoading} onClick={handleSignOut}>
              Logout
            </Button>
          ) : (
            <Button href="/sign-in">Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
