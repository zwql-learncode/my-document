import type { Config } from "@docusaurus/types";

const config: Config = {
  title: "Nguyễn Quang Hưng",
  url: "https://zwql-learncode.github.io/", // Thay URL phù hợp
  baseUrl: "/my-docs/",
  organizationName: "zwql-learncode", // GitHub username
  projectName: "my-docs",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themes: [],
};

export default config;
