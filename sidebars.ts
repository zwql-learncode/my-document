import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Architecture Pattern",
      items: ["milan/vsa_milan"],
    },
    {
      type: "category",
      label: "Design Pattern",
      items: [
        "repository",
        "dependency-injection",
        "milan/cqrs_milan",
        "guru/mediator-guru",
      ],
    },
    {
      type: "category",
      label: "200lab Document",
      items: [
        {
          type: "category",
          label: "Architecture Pattern",
          items: ["200lab/microservices_200lab"],
        },
        {
          type: "category",
          label: "Design Pattern",
          items: ["200lab/cqrs_200lab"],
        },
        {
          type: "category",
          label: "CI/CD",
          items: ["200lab/docker_200lab"],
        },
      ],
    },
    {
      type: "category",
      label: "Mehmet Ozkaya Document",
      items: [
        "mehmet/microservices",
        "mehmet/docker",
        "mehmet/vsa",
        "mehmet/cqrs",
        "mehmet/distributed-cache_mehmet",
      ],
    },
  ],
};

export default sidebars;
