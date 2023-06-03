import {
  MdOutlineAdd,
  MdOutlineDashboard,
  MdOutlineLibraryBooks,
  MdOutlineLock,
  MdOutlinePeopleAlt,
  MdOutlineTag,
} from "react-icons/md";
import { NavItem } from "@/Components/Nav";
import { IElement } from "@/Components/Layouts/Dashboard/SideNav/NavLink";

export const SIDE_NAV_ELEMENTS: IElement[] = [
  {
    name: "Dashboard",
    Icon: MdOutlineDashboard,
    href: "/dashboard",
  },
  {
    name: "Posts",
    Icon: MdOutlineLibraryBooks,
    elements: [
      {
        name: "Posts",
        Icon: MdOutlineLibraryBooks,
        href: "/dashboard/posts",
      },
      {
        name: "Create",
        Icon: MdOutlineAdd,
        href: "/dashboard/posts/create",
      },
    ],
  },
  {
    name: "Tags",
    Icon: MdOutlineTag,
    elements: [
      {
        name: "Tags",
        Icon: MdOutlineTag,
        href: "/dashboard/tags",
      },
      {
        name: "Create",
        Icon: MdOutlineAdd,
        href: "/dashboard/tags/create",
      },
    ],
  },
  {
    name: "Roles",
    Icon: MdOutlineLock,
    elements: [
      {
        name: "Roles",
        Icon: MdOutlineLock,
        href: "/dashboard/roles",
      },
      {
        name: "Create",
        Icon: MdOutlineAdd,
        href: "/dashboard/roles/create",
      },
    ],
  },
  {
    name: "Users",
    Icon: MdOutlinePeopleAlt,
    elements: [
      {
        name: "Users",
        Icon: MdOutlinePeopleAlt,
        href: "/dashboard/users",
      },
      {
        name: "Create",
        Icon: MdOutlineAdd,
        href: "/dashboard/users/create",
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Posts",
    href: "/posts",
  },
];

export const ROLES = {
  ADMIN: 1,
  MEMBER: 2,
};
