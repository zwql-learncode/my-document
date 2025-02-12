import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Design Pattern",
      items: ["repository", "dependency-injection"],
    },
    {
      type: "category",
      label: "Architecture Pattern",
      items: ["microservices"],
    },
  ],
};

export default sidebars;
