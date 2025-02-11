import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Design Pattern",
      items: ["repository", "dependency-injection"],
    },
  ],
};

export default sidebars;
