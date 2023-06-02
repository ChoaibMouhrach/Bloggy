import React from "react";
import SideNavDropDown from "./DropDown";
import NavLink, { IElement } from "./NavLink";

interface SideNavProps {
  open: boolean;
  sideNavElements: IElement[];
}

function SideNav({ open, sideNavElements }: SideNavProps) {
  return (
    <aside
      className={`h-[calc(100vh_-_96px)] bg-white px-4 lg:px-0 fixed w-screen lg:static lg:w-auto lg:block left-0 w-84 ${
        open ? "" : "hidden"
      }`}
    >
      <ul className="flex flex-col gap-4">
        {sideNavElements.map((element) =>
          !element.elements ? (
            <NavLink element={element} key={Math.random()} />
          ) : (
            <SideNavDropDown element={element} key={Math.random()} />
          )
        )}
      </ul>
    </aside>
  );
}

export default SideNav;
