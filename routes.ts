import { CommandIcon, BrandDiscordFillIcon, BrandGithubFillIcon, HeartIcon } from "@/ui/icons";

export type InnerRoutes = { title: string; href: string };
export type SingleRoute = { title: string; href?: string; data: InnerRoutes[] };
export type NestedRoute = { title: string; href?: string; data: SingleRoute[] };

export const ROUTES = {
  services: [
    {
      title: "Component",
      href: "https://oeri.vercel.app"
    }
  ],
  docs: [
    {
      title: "Docs",
      href: "/",
      data: [
        { title: "ocx", href: "/ocx" },
        { title: "cvx", href: "/cvx" },
        { title: "cnx", href: "/cnx" },
        { title: "clean", href: "/clean" },
        { title: "links", href: "/links" },
        { title: "license", href: "/license" },
        { title: "Code of Conduct", href: "/coc" },
        { title: "others", href: "/others" }
      ]
    },
    {
      title: "About",
      href: "/about",
      data: [{ title: "About app", href: "/about/app" }]
    }
  ] as SingleRoute[],
  docsHead: [
    { title: "Getting Started", href: "/" },
    { title: "Table of Contents", href: "/toc" }
  ] as InnerRoutes[],
  sections: [
    {
      label: "Github Repository",
      href: "https://github.com/ilkhoeri/cretex",
      icon: BrandGithubFillIcon,
      color: "#6e5494"
    },
    {
      label: "Discord Community",
      href: "https://discord.gg/Xct5BBPDZ9",
      icon: BrandDiscordFillIcon,
      color: "#436ab2"
    },
    {
      label: "Sponsor",
      href: "https://github.com/sponsors/ilkhoeri",
      icon: HeartIcon,
      color: "#b11c66"
    }
  ],
  suggestions: {
    title: "Main",
    data: [
      {
        title: "Getting Started",
        href: "/",
        icon: CommandIcon
      }
    ]
  },
  footRoutes: [] as InnerRoutes[]
};
