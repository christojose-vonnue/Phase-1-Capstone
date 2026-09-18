# TypeScript Decisions

This document records important TypeScript design decisions made during the JavaScript-to-TypeScript migration.

The purpose is to document not only what was chosen, but also why the approach was used and what alternatives were considered.

---

## 1. Discriminated Union for Actions

### Decision

Application actions are represented using a discriminated union.

The action's `type` property determines which payload belongs to that action.

Conceptually:

```ts
type Action =
  | {
      type: typeof ACTION_TYPES.SOME_ACTION;
      payload: SomePayload;
    }
  | {
      type: typeof ACTION_TYPES.ANOTHER_ACTION;
      payload: AnotherPayload;
    };
```

### Why

This allows TypeScript to narrow the action based on its `type`.

It prevents unrelated payloads from being passed to an action.

It also makes reducer logic easier to reason about because the action type and payload remain connected.

### Alternative

A single broad action type such as:

```ts
{
  type: string;
  payload: unknown;
}
```

could have been used.

However, this would lose the relationship between individual action types and their payloads.

---

## 2. `Record<string, string>` for Route Parameters

### Decision

Dynamic route parameters use:

```ts
Record<string, string>
```

### Why

Route parameters are dynamic by nature.

For example:

```text
/recipes/123
```

could produce:

```ts
{
  id: "123"
}
```

The parameter names are not necessarily known as a fixed set at compile time, while the router knows that parameter values are strings.

`Record<string, string>` expresses exactly that constraint.

### Alternative

An index signature could be used:

```ts
{
  [key: string]: string;
}
```

This is also valid, but `Record<string, string>` communicates the intent more directly and works naturally with the generic utility-type concepts used in the project.

---

## 3. `import type` for Type-Only Dependencies

### Decision

Types that are only needed during compilation are imported using:

```ts
import type
```

### Why

For example:

```ts
import type { AppState } from "../reducer";
```

makes it explicit that the import is used only for type information.

This separates runtime dependencies from compile-time type dependencies and makes the code's intent clearer.

### Alternative

A normal import could be used:

```ts
import { AppState } from "../reducer";
```

when the imported symbol is only a type.

However, `import type` makes the distinction explicit and avoids treating a type-only dependency as a runtime dependency.

---

## 4. Strict TypeScript Configuration

### Decision

The project uses:

```json
"strict": true
```

### Why

The purpose of the migration was not simply to make TypeScript compile.

Strict mode exposes problems such as:

* Potentially undefined values
* Incorrect function arguments
* Missing properties
* Unsafe assumptions
* Incompatible types
* Implicitly unsafe code

This provides substantially stronger type checking across the application.

### Alternative

The project could have remained in a partially relaxed configuration such as:

```json
"strict": false
```

This would have made migration easier initially, but would provide less protection in the final project.

The migration therefore progressed from a more permissive configuration toward strict checking.

---

## 5. Explicit DOM Type Narrowing

### Decision

DOM values are narrowed using runtime checks when necessary.

For example:

```ts
if (element instanceof HTMLInputElement) {
  element.value;
}
```

### Why

DOM APIs frequently return broad types such as:

```ts
Element
```

or:

```ts
EventTarget
```

TypeScript cannot automatically assume that such a value is a particular HTML element.

Runtime narrowing proves the actual type before accessing element-specific properties.

### Alternative

A type assertion could be used:

```ts
const input = element as HTMLInputElement;
```

This is shorter, but it tells TypeScript to trust the programmer without performing a runtime check.

Where practical, explicit narrowing provides stronger evidence and avoids unnecessary unsafe assertions.

---

## Summary

The major TypeScript decisions in the project follow one principle:

> Use TypeScript to describe and enforce the actual relationships in the application rather than adding types only to satisfy the compiler.

The project therefore uses:

```text
Discriminated unions
        ↓
Correct action/payload relationships

Record<string, string>
        ↓
Dynamic but constrained route parameters

import type
        ↓
Explicit type-only dependencies

strict: true
        ↓
Strong compiler checking

DOM narrowing
        ↓
Runtime-backed type safety
```
