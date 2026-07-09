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
            // {
            //   text: "Plugins",
            //   link: "/flow-language/getting-started/plugins",
            // },
            {
              text: "Docstrings",
              link: "/flow-language/getting-started/docstrings",
            },
          ],
        },
        {
          text: "Dynamic Variables",
          collapsed: true,

          items: [
            {
              text: "Dynamic Variables",
              link: "/flow-language/dynamic-variables/dynamic-variables",
            },
          ],
        },

        {
          text: "Flow Commands",
          collapsed: true,

          items: [
            {
              text: "flow.open",
              link: "/flow-language/flow-commands/flow.open",
            },
            {
              text: "flow.click",
              link: "/flow-language/flow-commands/flow.click",
            },
            {
              text: "flow.forceClick",
              link: "/flow-language/flow-commands/flow.forceClick",
            },
            {
              text: "flow.type",
              link: "/flow-language/flow-commands/flow.type",
            },
            {
              text: "flow.forceType",
              link: "/flow-language/flow-commands/flow.forceType",
            },
            {
              text: "flow.passcode",
              link: "/flow-language/flow-commands/flow.passcode",
            },
            {
              text: "flow.upload",
              link: "/flow-language/flow-commands/flow.upload",
            },
            {
              text: "flow.set",
              link: "/flow-language/flow-commands/flow.set",
            },
            {
              text: "flow.select",
              link: "/flow-language/flow-commands/flow.select",
            },
            {
              text: "flow.drag",
              link: "/flow-language/flow-commands/flow.drag",
            },
            {
              text: "flow.switchTo",
              link: "/flow-language/flow-commands/flow.switchTo",
            },
            {
              text: "flow.close",
              link: "/flow-language/flow-commands/flow.close",
            },
            {
              text: "flow.acceptDialog",
              link: "/flow-language/flow-commands/flow.acceptDialog",
            },
            {
              text: "flow.rejectDialog",
              link: "/flow-language/flow-commands/flow.rejectDialog",
            },
            {
              text: "flow.injectAudio",
              link: "/flow-language/flow-commands/flow.injectAudio",
            },
            {
              text: "flow.waitForPipeline",
              link: "/flow-language/flow-commands/flow.waitForPipeline",
            },
            {
              text: "flow.check",
              link: "/flow-language/flow-commands/flow.check",
            },
            {
              text: "flow.uncheck",
              link: "/flow-language/flow-commands/flow.uncheck",
            },
            {
              text: "flow.expect",
              link: "/flow-language/flow-commands/flow.expect",
            },
            {
              text: "flow.save",
              link: "/flow-language/flow-commands/flow.save",
            },
            {
              text: "flow.use",
              link: "/flow-language/flow-commands/flow.use",
            },
          ],
        },

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
