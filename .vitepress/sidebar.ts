export const sidebar = {
  "/guide/": [
    {
      text: "Introduction & Basics",
      collapsed: false,
      items: [
        {
          text: "Getting Started",
          link: "/guide/getting-started",
        },
        {
          text: "Why Flowstride",
          link: "/guide/why-flowstride",
        },
        {
          text: "Core Concepts",
          link: "/guide/core-concepts",
        },
        {
          text: "Execution Model",
          link: "/guide/execution-model",
        },
        {
          text: "CLI",
          link: "/guide/the-cli",
        },
        {
          text: "Your First Script",
          link: "/guide/your-first-script",
        },
      ],
    },
  ],

  "/flow-language/": [
    {
      text: "Flow Language",
      collapsed: false,

      items: [
        {
          text: "Getting Started",
          collapsed: true,

          items: [
            {
              text: "Variables",
              link: "/flow-language/getting-started/variables",
            },
            {
              text: "Sessions",
              link: "/flow-language/getting-started/sessions",
            },
            {
              text: "Plugins",
              link: "/flow-language/getting-started/plugins",
            },
            {
              text: "Docstrings",
              link: "/flow-language/getting-started/docstrings",
            },
          ],
        },

        // {
        //   text: "UI Automation",
        //   collapsed: true,

        //   items: [
        //     {
        //       text: "flow.open",
        //       link: "/flow-language/ui-automation/flow.open",
        //     },
        //     {
        //       text: "flow.click",
        //       link: "/flow-language/ui-automation/flow.click",
        //     },
        //   ],
        // },

        // {
        //   text: "API Automation",
        //   collapsed: true,

        //   items: [],
        // },

        // {
        //   text: "Assertions",
        //   collapsed: true,

        //   items: [],
        // },

        // {
        //   text: "Control Flow",
        //   collapsed: true,

        //   items: [],
        // },

        // {
        //   text: "Advanced Automation",
        //   collapsed: true,

        //   items: [],
        // },

        // {
        //   text: "Data Generation",
        //   collapsed: true,

        //   items: [],
        // },

        // {
        //   text: "Runtime Variables",
        //   collapsed: true,

        //   items: [],
        // },
      ],
    },
  ],

  "/projects/": [
    {
      text: "Projects",
      collapsed: false,
      items: [],
    },
  ],

  "/reporting/": [],

  "/cloud/": [],

  "/reference/": [],
};
