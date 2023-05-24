import { useRouter } from "next/router";
import { IconType } from "react-icons";
import Link from "next/link";
import { useState } from "react";

export interface IElement {
  name: string;
  Icon: IconType;
  href?: string;
  elements?: IElement[];
}

const NavLink = ({ element }: { element: IElement }) => {
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
};

const NavDropDown = ({ element }: { element: IElement }) => {
  const path = useRouter().pathname;
  const [open, setOpen] = useState(
    Boolean(element.elements?.find((e) => e.href === path))
  );

  return (
    <li className={`rounded-md ${open ? "bg-stone-800" : ""}`}>
      <button
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
          {element.elements?.map((element, index) => (
            <li key={index}>
              <Link
                href={element.href ?? ""}
                className={`flex items-center gap-4 p-4 rounded-md hover:bg-stone-700 font-semibold tracking-wide ${
                  open ? "text-white" : ""
                } ${
                  element.href === path
                    ? "bg-white !text-stone-800 hover:!bg-stone-100"
                    : ""
                }`}
              >
                <element.Icon
                  className={`text-xl ${open ? "fill-white" : ""} ${
                    element.href === path ? "!fill-stone-800" : ""
                  }`}
                />{" "}
                {element.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const SideNav = ({ sideNavElements }: { sideNavElements: IElement[] }) => {
  return (
    <aside className="h-[calc(100vh_-_80px)] fixed w-screen hidden lg:static lg:w-auto lg:block left-0 w-84">
      <ul className="flex flex-col gap-4">
        {sideNavElements.map((element, index) =>
          !element.elements ? (
            <NavLink element={element} key={index} />
          ) : (
            <NavDropDown element={element} key={index} />
          )
        )}
      </ul>
    </aside>
  );
};

export default SideNav;
