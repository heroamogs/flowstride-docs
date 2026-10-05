# The Manual Workspace

## Introduction

Automation is powerful, but not every testing scenario can or should be automated immediately.

Software teams frequently need to design test plans, map out complex user journeys, explore new features manually, and document visual evidence of defects before writing a single line of automation code.

Traditional workflows force quality assurance teams to juggle multiple disjointed tools. You might use a spreadsheet for test steps, a separate diagramming tool for flowcharts, a third party cloud drive for defect videos, and a disconnected test management platform to record runs.

Flowstride solves this fragmentation with the **Manual Workspace**.

Powered by a highly performant WebAssembly native engine, the Manual Workspace is a dedicated visual environment running directly inside your browser. It allows you to visually design test flows, execute them step by step, securely vault defect evidence, and generate professional PDF reports without ever leaving the Flowstride ecosystem.

---

## Launching the Workspace

Because Flowstride prioritises security and local control, the Manual Workspace runs entirely on your machine.

When you execute the command to open the workspace from your command line interface, Flowstride launches a secure local server.

This server creates a highly secure, local only sandbox inside your project directory called `manual_flows`. This sandbox contains dedicated vaults for:

- **templates**: Your saved visual test designs.
- **runs**: Your historical execution records.
- **media**: Reference images and videos used during test design.
- **defect_media**: Evidence captured when a test step fails.

Your test data remains strictly on your machine unless you are using the Flowstride Cloud synchronisation features available in the Enterprise version.

---

## The Visual Canvas

The core of the Manual Workspace is the visual canvas.

When you open a new test, you are placed into a boundless workspace where you can visually map out the user journey exactly as the user will experience it.

A collapsible tool palette on the left provides everything you need to construct your flow.

- **Hand**: Pan and navigate around large workspaces.
- **Select**: Highlight and interact with existing elements.
- **Step**: Create a new test action.
- **Group**: Draw boundaries around related steps to organise complex flows into logical sections.
- **Arrow**: Connect steps sequentially to define the exact path of execution.
- **Text**: Add floating annotations and context for other engineers.

This spatial approach allows you to see the entire business process at a glance, making it significantly easier to understand than a flat list of spreadsheet rows.

---

## Designing Steps

Every step in your flow represents a specific action the user takes or a state they observe.

When you select a step on the canvas, the properties panel opens on the right side of the screen. This panel is where you define the exact parameters of the test.

The details tab allows you to configure:

- **Step Name**: A concise, readable title for the action.
- **Description**: High level context about what this step achieves.
- **Steps**: The exact instructions required to reproduce the action, supported by a rich text editor.
- **Expected Result**: The specific outcome that must occur for the step to be considered successful, also supported by rich text.

By separating the visual flow from the technical details, the Manual Workspace keeps your high level architecture clean while preserving the deep context required for accurate execution.

---

## Design Mode vs Execution Mode

The workspace operates in two distinct states, accessible via a toggle at the top of the interface.

### Design Mode

This is your authoring environment. In Design Mode, the canvas is fully unlocked. You can drop new steps, draw connections, group elements, and modify text. This mode is used strictly for planning and updating the architecture of your test cases.

### Execution Mode

Once your design is complete, switching to Execution Mode locks the canvas. You can no longer alter the flow architecture. Instead, the interface becomes an interactive test runner. You progress through the steps sequentially, recording whether each step passed or failed, capturing the exact metrics of the manual run.

When you save your progress in Execution Mode, Flowstride generates a detailed JSON execution report vaulting it securely in your local `runs` directory organised precisely by date and time.

---

## Managing Defect Evidence

When a test fails, evidence is critical.

The Manual Workspace provides a secure vaulting system for defect media. You can upload screenshots, screen recordings, and images directly into the workspace.

Flowstride handles this media intelligently based on your license.

### Local Vaulting (Community Edition)

By default, all defect evidence is vaulted strictly into your local `manual_flows/defect_media` directory. A strict file size limit is enforced to keep your repository lightweight, and the assets never touch an external network.

### Cloud Synchronisation (Enterprise Edition)

For teams utilising Flowstride Cloud, the workspace seamlessly bridges the gap between local execution and global collaboration.

When you upload defect evidence, the engine securely communicates with the Flowstride Cloud backend to request a cryptographic presigned ticket. The heavy media payload is then pushed directly to a secure cloud storage bucket. Furthermore, your execution metrics (Passed, Failed, Pending) are automatically synchronised to your cloud dashboard, allowing your entire team to monitor quality metrics in real time.

If your machine loses internet connection, the system gracefully degrades to local vaulting until the connection is restored.

---

## Test Case Documentation and Reporting

Visual flows are excellent for engineers, but stakeholders often require formal documentation.

Flowstride automatically translates your visual canvas into a structured, tabular Test Case Log. By accessing the **TestCase** view from the sidebar, you can review a clean, grouped table displaying every step in your flow.

The log automatically renders:

- The Serial Number
- The Action command
- The Expected Result
- The Actual Result
- The final Status (Pending, Pass, or Fail)

With a single click of the **Export PDF** button, Flowstride compiles this log into a professional, shareable document ready for compliance reviews or stakeholder meetings.

---

## Common Mistakes

::: warning Avoid These Common Mistakes

## Mixing Design and Execution

Do not attempt to modify the core structure of your test while in Execution Mode. If you discover a missing step during a test run, save your current run, switch back to Design Mode, update the template, and then resume testing. This ensures your templates remain the single source of truth.

## Ignoring Logical Groups

As your visual flows grow, an unstructured canvas quickly becomes difficult to read. Always use the **Group** tool to bound related steps together (for example, wrapping all login steps in an "Authentication" group).

## Uploading Oversized Media

The local vault enforces file size limits to prevent your repository from becoming bloated. Ensure your screen recordings are compressed and concise before attaching them as defect evidence.

:::

---

## Best Practices

To get the most out of the Manual Workspace, follow these guidelines.

- **Keep Steps Atomic:** A single step should represent a single logical action and validation. Do not combine ten different actions into one step properties panel.
- **Use Descriptive Names:** "Click Login" is a better step name than "Step 4".
- **Utilise Rich Text:** Use bolding and lists within the Expected Result field to make validation criteria immediately obvious to the tester reading it.
- **Link Your Flows:** Connect your steps logically with the Arrow tool so the exact path of execution is unambiguous, even to an engineer who has never seen the application before.
