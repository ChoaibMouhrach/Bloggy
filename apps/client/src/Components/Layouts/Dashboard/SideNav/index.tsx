import React from "react";
import SideNavDropDown from "./DropDown";
import NavLink, { IElement } from "./NavLink";

function SideNav({ sideNavElements }: { sideNavElements: IElement[] }) {
  return (
    <aside className="h-[calc(100vh_-_96px)] fixed w-screen hidden lg:static lg:w-auto lg:block left-0 w-84">
      <ul className="flex flex-col gap-4">
        {sideNavElements.map((element, index) =>
          !element.elements ? (
            <NavLink element={element} key={element.href} />
          ) : (
            <SideNavDropDown element={element} key={element.href} />
          )
        )}
      </ul>
    </aside>
  );
}

export default SideNav;
