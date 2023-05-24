import { useRouter } from "next/router";
import { IElement } from ".";
import { useState } from "react";
import Link from "next/link";

const SideNavDropDown = ({ element }: { element: IElement }) => {
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

export default SideNavDropDown;
