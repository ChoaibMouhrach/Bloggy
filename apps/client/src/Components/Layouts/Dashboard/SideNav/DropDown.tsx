import { useRouter } from "next/router";
import React, { useState } from "react";
import Link from "next/link";
import { IElement } from "./NavLink";

function SideNavDropDown({ element }: { element: IElement }) {
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
          {element.elements?.map((subElement) => (
            <li key={subElement.href ?? Math.random()}>
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

export default SideNavDropDown;
