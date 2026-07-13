# image / img

## Introduction

`image` and `img` are **Flow Elements** that tell Flowstride to search specifically for images on the page.

When used as Flow Elements, both keywords behave identically. Flowstride searches for HTML `<img>` elements whose `alt` attribute matches the supplied text.

For readability, `image` is the recommended keyword, while `img` is available as a shorter HTML-style alias.

---

## Why Use the image / img Element?

Modern web applications display logos, avatars, product photos, banners, thumbnails, and many other visual assets using HTML `<img>` elements.

By specifying either `image` or `img`, you tell Flowstride that you're looking specifically for an image rather than another type of control. This narrows the search space, improves readability, and reduces ambiguity.

---

## How Flowstride Finds Images

When you specify either `image` or `img`, Flowstride uses its heuristic locator engine to search for HTML `<img>` elements whose `alt` attribute matches the supplied text.

The comparison is performed case-insensitively.

Like every Flow Element, both keywords participate in:

- Heuristic element matching
- Ambiguity resolution
- Spatial selector resolution

---

## Syntax

### Using `image`

```flow
flow.click image "Company Logo";
```

### Using `img`

```flow
flow.click img "Company Logo";
```

---

## Examples

### Click a company logo

```flow
...

When "Click the company logo"
    flow.click image "Company Logo";

Then "The homepage opens"
    flow.expect visible "Welcome";
```

---

### Click a user avatar

```flow
...

When "Open the user profile"
    flow.click img "Samuel Okolo";

Then "The profile page is displayed"
    flow.expect visible "Profile";
```

---

### Use a Spatial Selector

```flow
...

When "Click the featured product image"
    flow.click image "Laptop" near "Featured Products";

Then "The product details page opens"
    flow.expect visible "Specifications";
```

---

## image vs img

Although both keywords behave identically as Flow Elements, there is one implementation detail worth understanding.

### As Flow Elements

The following commands are functionally identical:

```flow
flow.click image "Company Logo";
```

```flow
flow.click img "Company Logo";
```

Both resolve to the exact same locator implementation and search for an HTML `<img>` element whose `alt` attribute matches `"Company Logo"`.

For most Flowstride scripts, you can use either keyword interchangeably.

---

### As Standalone Raw Selectors

When used by themselves, the two keywords behave differently.

For example:

```flow
flow.expect visible "img";
```

Since `img` is a native HTML tag, Flowstride immediately treats it as a raw CSS selector equivalent to:

```css
img
```

However,

```flow
flow.expect visible "image";
```

does **not** represent a native HTML tag.

Instead, Flowstride falls back to its standard heuristic locator engine rather than treating it as a raw CSS selector.

For normal Flowstride automation, this distinction rarely matters because both keywords behave identically when used as Flow Elements.

---

## Important Notes

::: info image and img are equivalent Flow Elements

When used as Flow Elements, `image` and `img` behave exactly the same.

Both search for HTML `<img>` elements using their `alt` attribute.

:::

::: info Images are identified by their alt text

Flowstride locates images by matching the value of the HTML `alt` attribute.

For example:

```html
<img alt="Company Logo" />
```

can be targeted using either:

```flow
flow.click image "Company Logo";
```

or

```flow
flow.click img "Company Logo";
```

:::

::: info Reduces ambiguity

Specifying `image` or `img` narrows the search space.

When multiple elements contain similar text, using an image element helps Flowstride identify the intended image more accurately.

:::

---

## Common Mistakes

::: warning Don't use the visible caption

Flowstride identifies images using their `alt` attribute, not surrounding text or captions.

Correct:

```html
<img alt="Company Logo" />
```

```flow
flow.click image "Company Logo";
```

:::

::: warning Prefer image for readability

Although both keywords are fully supported, `image` is generally easier to read and understand.

For example:

```flow
flow.click image "Company Logo";
```

is usually more expressive than:

```flow
flow.click img "Company Logo";
```

Both commands behave identically as Flow Elements.

:::

::: warning Combine with spatial selectors when necessary

If multiple images share the same `alt` text, combine the element with a spatial selector or an index.

```flow
flow.click image "Product" near "Featured";

flow.click img "Avatar [1]";
```

:::

---
