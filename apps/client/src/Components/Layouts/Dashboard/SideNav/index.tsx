import React from "react";
import SideNavDropDown from "./DropDown";
import NavLink, { IElement } from "./NavLink";
import { MdOutlinePerson } from "react-icons/md";
import useGetUser from "@/features/User/useGetUser";

interface SideNavProps {
  open: boolean;
  sideNavElements: IElement[];
}

function SideNav({ open, sideNavElements }: SideNavProps) {
  const user = useGetUser();

  return (
    <aside
      className={`h-[calc(100vh_-_96px)] bg-white px-4 lg:px-0 fixed w-screen lg:static lg:w-auto lg:block left-0 w-84 ${
        open ? "" : "hidden"
      }`}
    >
      <ul className="flex flex-col gap-4">
        {user && user.Role?.id === 1
          ? sideNavElements.map((element) =>
              !element.elements ? (
                <NavLink element={element} key={Math.random()} />
              ) : (
                <SideNavDropDown element={element} key={Math.random()} />
              )
            )
          : null}

        <NavLink
          element={{
            name: "Profile",
            href: "/dashboard/profile",
            Icon: MdOutlinePerson,
          }}
          key={Math.random()}
        />
      </ul>
    </aside>
  );
}

export default SideNav;
