# Component testing

Mount a small UI component in Flowstride's local Vite harness, use normal browser actions/assertions, update its props and unmount it. OS and Cloud support vanilla JavaScript factories, React components and Vue single-file components.

Install the framework packages your component imports in the project. The harness does not automatically load your application's Vite configuration, router, backend or providers. Use a small wrapper component for required application context.

## A vanilla component

Create `src/components/Counter.js`:

```js
export function mount(target, props) {
  const button = document.createElement('button');
  let count = props.start ?? 0;
  const render = () => { button.textContent = `Count ${count}`; };
  button.addEventListener('click', () => { count += 1; render(); });
  render();
  target.append(button);
  return { unmount: () => button.remove() };
}
```

Create `flows/component.flow`:

```flow
Feature: Counter component

  Scenario: A vanilla counter responds to a click
    Given "The component is mounted"
      flow.component.mount {
        "framework": "vanilla",
        "module": "src/components/Counter.js",
        "export": "mount",
        "props": {
          "start": 2
        }
      };

    When "The counter is clicked"
      flow.click button "Count 2";

    Then "Its displayed state changes"
      flow.assert.that {
        "role": "button",
        "name": "Count 3",
        "condition": "visible"
      };
```

Run with `npx flowstride run flows/component.flow --ci`. The vanilla factory receives `(target, props)` and can return a DOM node or an object with `unmount()`.

## Vue

Install your project's compatible Vue dependency, then create `src/components/Counter.vue`:

```vue
<script setup>
import { ref } from 'vue';
defineProps({ label: { type: String, default: 'Count' } });
const count = ref(0);
</script>

<template>
  <button @click="count += 1">{{ label }} {{ count }}</button>
</template>
```

Use `framework: "vue"`, that module path and `export: "default"` in the same mount structure. Assert **Count 0**, click it, then assert **Count 1**. Pass `props.label` when the test needs a different label. The project must supply Vue and any packages imported by the component.

## React

The [native component example](/guide/native-browser-workflows#component-tests) shows React mount/update/unmount. Use `framework: "react"`, a project-local JSX/TSX module and its exported component. Keep your compatible React/React DOM dependencies installed.

## Prop changes, styles and cleanup

```flow
flow.component.update {
  "props": {
    "label": "Updated counter"
  }
};
flow.component.unmount {};
flow.assert.that {
  "selector": "button",
  "condition": "count",
  "value": 0
};
```

Use `Given` and `When` to prepare and update a component, an intermediate `And` to check it, and the final `Then` for the last commands and checks. Keep every execution block before that final `Then`. Framework-specific update behavior matters: vanilla updates unmount the previous result and call the factory again, so its internal state resets. React and Vue updates retain state according to their normal rendering rules. An optional `css` array on mount imports project styles.

An intentionally wrong label/count should fail. Verify unmounting removes the target, and use normal run artifacts to investigate failures. Component isolation is useful for UI behavior; it does not replace a complete API/UI journey through the production application.

## Complete Vue lifecycle flow

With the Vue component above and its dependency installed:

```flow
Feature: Vue counter lifecycle

  Scenario: Click, update and remove a counter
    Given "The Vue counter is mounted"
      flow.component.mount {
        "framework": "vue",
        "module": "src/components/Counter.vue",
        "props": {
          "label": "Count"
        }
      };

    When "Increment the counter"
      flow.click button "Count 0";

    And "The counter responds"
      flow.expect text "Count 1";

    When "Change its label"
      flow.component.update {
        "props": {
          "label": "Updated counter"
        }
      };

    And "The component preserves its state"
      flow.expect text "Updated counter 1";

    When "Remove the component"
      flow.component.unmount {};

    Then "No counter button remains"
      flow.assert.that {
        "selector": "button",
        "condition": "count",
        "value": 0
      };
```
