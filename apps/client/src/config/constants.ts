import { IElement } from "@/Components/Layouts/Dashboard/SideNav";
import { NavItem } from "@/Components/Nav";
import {
  MdOutlineAdd,
  MdOutlineDashboard,
  MdOutlineLibraryBooks,
  MdOutlineModeEditOutline,
  MdOutlinePeopleAlt,
  MdOutlinePerson,
} from "react-icons/md";

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
      {
        name: "Edit",
        Icon: MdOutlineModeEditOutline,
        href: "/dashboard/posts/edit",
      },
    ],
  },
  {
    name: "Users",
    Icon: MdOutlinePeopleAlt,
    href: "/dashboard/users",
  },
  {
    name: "Profile",
    Icon: MdOutlinePerson,
    href: "/dashboard/profile",
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
