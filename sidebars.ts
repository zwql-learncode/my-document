import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Architecture Pattern",
      items: [
        {
          type: "category",
          label: "Microservices",
          items: ["microservices_doc", "200lab/grpc_200lab"],
        },
        {
          type: "category",
          label: "Clean Architecture",
          items: ["ddd-doc"],
        },
        "milan/vsa_milan",
        "milan/cqrs_milan",
      ],
    },
    {
      type: "category",
      label: "Design Pattern",
      items: ["repository", "dependency-injection", "guru/mediator-guru"],
    },
    {
      type: "category",
      label: "200lab Document",
      items: [
        {
          type: "category",
          label: "Architecture Pattern",
          items: ["200lab/microservices_200lab", "200lab/cqrs_200lab"],
        },
        {
          type: "category",
          label: "Database",
          items: ["200lab/redis_200lab"],
        },
        {
          type: "category",
          label: "DevOps",
          items: ["200lab/docker_200lab"],
        },
        {
          type: "category",
          label: "Optimization",
          items: ["200lab/caching_200lab"],
        },
      ],
    },
    {
      type: "category",
      label: "Mehmet Ozkaya Document",
      items: [
        {
          type: "category",
          label: "Microservices Course Tutorial",
          items: [
            "mehmet/microservices",
            "mehmet/docker",
            "mehmet/vsa",
            "mehmet/cqrs",
            "mehmet/distributed-cache_mehmet",
            "mehmet/grpc_mehmet",
            "mehmet/clean-architecture_mehmet",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
