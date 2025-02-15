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
      label: "Mehmet Ozkaya Document",
      items: ["microservices", "docker"],
    },
  ],
};

export default sidebars;
