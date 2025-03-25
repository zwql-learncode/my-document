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
          items: ["microservices_doc"],
        },
        "milan/vsa_milan",
        "milan/cqrs_milan",
        "ddd-doc",
      ],
    },
    {
      type: "category",
      label: "Design Pattern",
      items: [
        {
          type: "category",
          label: "23 Classical Design Patterns - Guru Refactoring Document",
          items: [
            {
              type: "category",
              label: "Structural Design Patterns",
              items: ["guru/proxy-guru", "guru/decorator-guru"],
            },
            {
              type: "category",
              label: "Behavioral Design Patterns",
              items: ["guru/mediator-guru"],
            },
          ],
        },
        {
          type: "category",
          label: "Other",
          items: ["repository", "dependency-injection"],
        },
      ],
    },
    {
      type: "category",
      label: "200lab Document",
      items: [
        {
          type: "category",
          label: "Architecture Pattern",
          items: [
            "200lab/microservices_200lab",
            "200lab/ca_200lab",
            "200lab/cqrs_200lab",
          ],
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
        {
          type: "category",
          label: "Communication",
          items: [
            "200lab/rest-api_200lab",
            "200lab/grpc_200lab",
            "200lab/message-broker_200lab",
            "200lab/rabbitmq_200lab",
          ],
        },
        "200lab/ddd-200lab",
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
            "mehmet/event-sourcing_mehmet",
            "mehmet/rabbitmq_mehmet",
            "mehmet/domain-event-integration-event_mehmet",
            "mehmet/api-gateways_mehmet",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
