import { MainNavItem, SidebarNavItem } from "types/nav"

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
  chartsNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "",
      items: [
        {
          title: "Changelog",
          href: "/docs/changelog",
          items: [],
        },
      ],
    },
  ],
  chartsNav: [],
}
