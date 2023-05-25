import { useRouter } from "next/router";
import { IconType } from "react-icons";
import Link from "next/link";
import React, { useState } from "react";

export interface IElement {
  name: string;
  Icon: IconType;
  href?: string;
  elements?: IElement[];
}

function NavLink({ element }: { element: IElement }) {
  const active = useRouter().pathname === element.href;

  return (
    <li>
      <Link
        href={element.href ?? ""}
        className={`flex items-center gap-4 p-4 rounded-md hover:bg-stone-100 font-semibold tracking-wide ${
          active ? "hover:!bg-stone-700 bg-stone-800 text-white" : ""
        }`}
      >
        <element.Icon
          className={`text-xl ${active ? "fill-white" : "fill-stone-800"}`}
        />{" "}
        {element.name}
      </Link>
    </li>
  );
}

function NavDropDown({ element }: { element: IElement }) {
  const path = useRouter().pathname;
  const [open, setOpen] = useState(
    Boolean(element.elements?.find((e) => e.href === path))
  );

  return (
    <li className={`rounded-md ${open ? "bg-stone-800" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full gap-4 p-4 rounded-md hover:bg-stone-100 font-semibold tracking-wide ${
          open ? "text-white hover:!bg-stone-700" : ""
        }`}
      >
        <element.Icon className={`text-xl ${open ? "fill-white" : ""}`} />{" "}
        {element.name}
      </button>

      {open && (
        <ul className="flex flex-col gap-4 p-4">
          {element.elements?.map((subElement, index) => (
            <li key={subElement.href}>
              <Link
                href={subElement.href ?? ""}
                className={`flex items-center gap-4 p-4 rounded-md hover:bg-stone-700 font-semibold tracking-wide ${
                  open ? "text-white" : ""
                } ${
                  subElement.href === path
                    ? "bg-white !text-stone-800 hover:!bg-stone-100"
                    : ""
                }`}
              >
                <subElement.Icon
                  className={`text-xl ${open ? "fill-white" : ""} ${
                    subElement.href === path ? "!fill-stone-800" : ""
                  }`}
                />{" "}
                {subElement.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SideNav({ sideNavElements }: { sideNavElements: IElement[] }) {
  return (
    <aside className="h-[calc(100vh_-_80px)] fixed w-screen hidden lg:static lg:w-auto lg:block left-0 w-84">
      <ul className="flex flex-col gap-4">
        {sideNavElements.map((element) =>
          !element.elements ? (
            <NavLink element={element} key={element.href} />
          ) : (
            <NavDropDown element={element} key={element.href} />
          )
        )}
      </ul>
    </aside>
  );
}

export default SideNav;
