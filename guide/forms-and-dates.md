# Forms, dropdowns and dates

Use Flowstride's native commands to fill a form, select dependent values and verify what the application accepted. This workflow is available in OS and Cloud.

## A complete travel form

The following example uses the public QA-TestCraft travel form. It assumes the **From**, **To** and **Date** controls and their current field names. Change the date to an allowed future date when you run it.

```flow
Feature: Select a travel route

  Scenario: Travel from Lagos to Abuja on 14 November 2026
    Given "The travel form is open"
      flow.open "https://www.qacar.online/";

    When "Choose the departure and arrival cities"
      flow.select "Lagos" from "From";
      flow.select "Abuja" from "To";

    When "Choose the travel date"
      flow.set input "Date" to "2026-11-14";

    Then "The departure, destination and date match the selected trip"
      flow.assert.that {
        "selector": "select[name='from']",
        "condition": "value",
        "value": "Lagos"
      };

      flow.assert.that {
        "selector": "select[name='to']",
        "condition": "value",
        "value": "Abuja"
      };

      flow.assert.that {
        "selector": "input[name='date']",
        "condition": "value",
        "value": "2026-11-14"
      };
```

`flow.select` chooses the displayed option label. Its underlying value can be different; inspect the application's contract before asserting it. Date inputs use `YYYY-MM-DD` internally even if the browser displays `dd/mm/yyyy`.

## Searchable and dependent dropdowns

`flow.select` supports native selects and common custom menu/listbox implementations, including searchable controls. Target the actual control, not an unrelated heading. Assert the selected label or hidden field your widget exposes.

```flow
flow.select "$randomPair[Country]" from "Country";
flow.select "@randomPair[State]" from "State";
flow.select "@randomPair[City]" from "City";
```

The first call chooses a correlated location from Flowstride's bundled data. The next two reuse its state/city. Your application's choices must contain that triplet; correlation does not create missing options or wait for an arbitrary custom widget's data contract. Prefer explicit known values for a small dependent-dropdown fixture.

## Typing versus setting

Use `flow.type` for ordinary text entry. It can retry and tolerate formatting, so assert an exact value when punctuation, masks or whitespace are significant. `flow.set` applies a value setter and dispatches input/change events; it is useful for date fields that reject ordinary text entry.

A date widget can still reject direct changes. The calendar fallback looks for matching day controls; it is not a universal month/year navigation algorithm. For a custom calendar, use explicit previous/next-month and day controls, then assert the resulting date.

## Checkboxes and custom toggles

```flow
flow.check "Remember me";
flow.assert.that {
  "selector": "input[name='remember']",
  "condition": "checked"
};
flow.uncheck "Remember me";
flow.assert.that {
  "selector": "input[name='remember']",
  "condition": "checked",
  "not": true
};
```

Check/uncheck aim to establish a state rather than toggle blindly. Custom ARIA/class-based widgets need an observable state assertion matching their markup. A radio button normally cannot be unchecked independently; select a different radio choice instead.

## Dialogs, uploads and hover menus

Register `flow.acceptDialog;` or `flow.rejectDialog;` **before** the action that triggers the dialog. Then assert the application's resulting state. These commands do not supply arbitrary text to a prompt.

For upload, use `flow.upload "fixtures/document.pdf" into "Upload document";` and assert the uploaded filename/result. Flowstride safely arms a chooser before triggering it, but your application still validates the file.

`flow.hover` moves the pointer and triggers hover behavior without clicking. After opening a menu, use a separate click when a selection is intended. `flow.drag` has native and fallback mechanisms; verify the accepted drop through application state rather than treating command completion as proof.

See [targeting](/guide/targeting), [all browser commands](/reference/ui-commands), [downloads](/guide/native-browser-workflows#downloads), and [failure diagnostics](/guide/assertions-and-diagnostics).
