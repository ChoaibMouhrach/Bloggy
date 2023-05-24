import { IconType } from "react-icons";
import NavLink from "./NavLink";
import SideNavDropDown from "./DropDown";

export interface IElement {
  name: string;
  Icon: IconType;
  href?: string;
  elements?: IElement[];
}

const SideNav = ({ sideNavElements }: { sideNavElements: IElement[] }) => {
  return (
    <aside className="h-[calc(100vh_-_96px)] fixed w-screen hidden lg:static lg:w-auto lg:block left-0 w-84">
      <ul className="flex flex-col gap-4">
        {sideNavElements.map((element, index) =>
          !element.elements ? (
            <NavLink element={element} key={index} />
          ) : (
            <SideNavDropDown element={element} key={index} />
          )
        )}
      </ul>
    </aside>
  );
};

export default SideNav;
