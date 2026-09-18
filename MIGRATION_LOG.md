# TypeScript Migration Log

## Purpose

Record the TypeScript migration errors encountered while converting the Week 4 SPA from JavaScript to TypeScript, along with the root cause and the fix applied.

---

## 1. Property does not exist on type

### Error

```text
Property 'type' does not exist on type 'HTMLElement'.
```

### Cause

The `Button` component was typed to return the generic `HTMLElement`, but the implementation creates a `<button>` element. The code later accessed the button-specific `.type` property.

### Fix

Changed the return type from:

```ts
HTMLElement
```

to:

```ts
HTMLButtonElement
```

### Lesson

Use the most specific DOM type that represents the actual element.

---

## 2. Property does not exist on EventTarget

### Error

```text
Property 'tagName' does not exist on type 'EventTarget'.
```

### Cause

`event.target` is typed as `EventTarget | null`. `EventTarget` does not guarantee the `tagName` property.

### Fix

Narrowed the target before accessing `tagName`:

```ts
const target = event.target;

if (!(target instanceof Element)) return;
```

### Lesson

When TypeScript gives a broad type, narrow it before accessing properties that are only available on a more specific type.

---

## 3. Callback type mismatch

### Error

```text
Type '(event: any) => void' is not assignable to type '() => void'.
```

### Cause

`ButtonProps` originally declared `onClick` as a function that receives no arguments:

```ts
onClick: () => void;
```

But actual callers supplied click handlers receiving an event.

### Fix

Changed the contract to:

```ts
onClick?: (event: MouseEvent) => void;
```

`onClick` was also made optional because the existing application and tests legitimately create buttons without a click handler.

### Lesson

Type definitions must describe the actual API usage rather than artificially restricting valid callers.

---

## 4. Router contract mismatch

### Error

```text
Property 'navigate' does not exist on type 'RouterStore'.
```

### Cause

`RouterStore` represented the store interface used by the router and only contained `dispatch`. It was incorrectly being used to type the actual router object in page components.

### Fix

Separated the contracts:

```ts
type Router = {
    navigate: (path: string) => void;
};
```

and retained the store-related contract separately.

### Lesson

Similar-looking objects should have separate contracts when their responsibilities differ.

---

## 5. Route component contract mismatch

### Error

Page components receiving:

```ts
{
    state,
    params,
    router,
    store
}
```

were incompatible with the previous:

```ts
type RouteComponent = (params: RouteParams) => HTMLElement;
```

### Cause

`RouteComponent` incorrectly described a page component as receiving only route parameters.

### Fix

Changed the route component contract to represent the actual page props/context passed by `index.js`.

### Lesson

When an assignability error occurs, trace the data flow and fix the underlying contract rather than using a type assertion to suppress the error.

---

## 6. Empty array inferred incorrectly under strict mode

### Error

```text
Type 'Middleware' is not assignable to type 'never'.
```

### Cause

The parameter:

```ts
middlewares = []
```

was inferred as:

```ts
never[]
```

because the empty array had no contextual element type.

### Fix

```ts
middlewares: Middleware[] = []
```

### Lesson

An empty array may require an explicit type when TypeScript cannot infer its intended element type.

---

## 7. Implicit any array under strict mode

### Error

```text
Variable 'paramNames' implicitly has type 'any[]'
```

### Cause

```ts
const paramNames = [];
```

did not provide enough information for TypeScript to determine the element type.

### Fix

```ts
const paramNames: string[] = [];
```

### Lesson

Strict mode requires explicit type information when inference cannot safely determine a type.

---

## 8. Missing accumulator type in reduce

### Error

The accumulator used to construct route parameters could not be safely typed under strict mode.

### Cause

The accumulator object was initially inferred without an explicit structure.

### Fix

```ts
acc: Record<string, string>
```

### Lesson

When using `reduce()` to construct an object dynamically, explicitly type the accumulator when TypeScript cannot infer its structure.

---

## 9. Possibly undefined page properties

### Error

Page parameters were reported as potentially `undefined` under strict mode.

### Cause

Properties such as `state` had been made optional even though the application always supplies them.

### Fix

Made genuinely required properties mandatory:

```ts
type HomePageProps = {
    state: AppState;
    router: Router;
};
```

and applied the same principle to the other page prop types.

### Lesson

Do not make properties optional simply to avoid a type error. The type should represent the actual runtime contract.

---

## 10. Implicit any callback parameter

### Error

```text
Parameter 'recipe' implicitly has an 'any' type.
```

### Cause

Strict mode could not infer the type of the callback parameter.

### Fix

Reused the existing `Recipe` type for the parameter.

### Lesson

Prefer existing domain types instead of creating duplicate types or falling back to `any`.

---

## Migration Principle

For each TypeScript error, the migration process followed:

```text
Compiler error
      ↓
Inspect actual code and data flow
      ↓
Identify the root cause
      ↓
Add or correct the appropriate type
      ↓
Run tsc --noEmit again
```

Type assertions and `any` were not used as shortcuts when the underlying contract could be correctly modeled.

## Current Status

* Initial non-strict migration errors in the main SPA source: **resolved**
* `strict: true`: **enabled**
* Strict-mode errors in main SPA source: **resolved**
* Main SPA source: **passes ****`tsc --noEmit`**** with strict mode**
* Test files: **remaining work**

---

## 11. Test Migration to TypeScript + Vitest

### Reducer Test Migration

Converted `reducer.test.js` to `reducer.test.ts`.

The existing reducer tests were updated to use the application's `AppState` and `Action` types. The unknown-action test required `UNKNOWN_ACTION` to be represented in the `Action` union because the reducer intentionally handles unknown actions through its `default` branch.

Result:

* `reducer.test.ts`: all tests passed.

### Store Test Migration

The original store tests contained dummy counter state such as:

```ts
{ count: 0 }
```

and dummy actions such as:

```ts
"INCREMENT"
```

These did not match the SPA-specific `createStore` contract.

The tests were adapted to use the actual application state and actions, primarily:

```ts
INITIAL_STATE
ACTION_TYPES.TOGGLE_THEME
```

The production `store.ts` was not made generic merely to accommodate the test fixtures.

Result:

* `store.test.ts`: 6/6 tests passed.

### Component Test Migration

Converted `component.test.js` to `component.test.ts`.

DOM query results were narrowed before accessing element-specific properties. For example:

```ts
if (!(homeLink instanceof Element)) return;

homeLink.click();
```

The existing component contract was also corrected so `Card` can legitimately be used without an `onClick` handler:

```ts
onClick?: () => void;
```

Result:

* `component.test.ts`: 15/15 tests passed.

### Router Test Migration

Converted `router.test.js` to `router.test.ts`.

The router and store contracts were reused rather than duplicated in the test. `ReturnType<typeof createRouter>` was used where the router variable needed the exact return type of `createRouter`.

The router tests require a browser-like environment, so Vitest was configured to use `jsdom`. `jsdom` was installed after Vitest reported:

```text
Cannot find package 'jsdom'
```

Result:

* `router.test.ts`: 10/10 tests passed.

### Page Test Migration

Converted `page.test.js` to `page.test.ts`.

Most migration errors were caused by DOM query results potentially being `null`. Specific DOM element types were used with type narrowing before accessing properties such as `.value`.

The test helper `createState()` was also corrected to satisfy the `AppState` contract.

Two behavioral test failures were caused by the fixture containing:

```ts
recipes: []
```

while the tests expected the `Chicken Curry` recipe. The intended recipe fixture was restored:

```ts
const recipe = {
    id: 1,
    title: "Chicken Curry",
    description: "A simple Indian chicken curry",
    category: "Indian"
};
```

with:

```ts
recipes: [recipe]
```

Result:

* `page.test.ts`: 21/21 tests passed.

### Vitest and dist Test Execution

Vitest was added as a development dependency.

The initial full test run also discovered that compiled tests under `dist/` were being executed alongside the source tests. The Vitest configuration was adjusted to exclude compiled `dist` test files so the migrated source tests are the intended test suite.

### TypeScript Verification

Ran:

```text
npx tsc --noEmit -p src/Day4/tsconfig.json
```

Result:

* No TypeScript errors.

Also ran:

```text
npx tsc
```

Result:

* Compilation completed successfully.

### Final Test Result

Ran the complete Vitest suite:

```text
npx vitest run
```

Final result:

```text
Test Files: 9 passed
Tests:      114 passed
```

All migrated tests passed successfully with no TypeScript compilation errors.

---

## Current Status

* Initial non-strict migration errors in the main SPA source: **resolved**
* `strict: true`: **enabled**
* Strict-mode errors in main SPA source: **resolved**
* Main SPA source: **passes `tsc --noEmit` with strict mode**
* Test files migrated to TypeScript: **completed**
* Vitest configured and running: **completed**
* DOM/nullability errors in tests: **resolved through type narrowing**
* Test fixture/type-contract issues: **resolved**
* TypeScript checks: **passed**
* Final test suite: **114/114 tests passed**
