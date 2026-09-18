import { describe, it, expect, vi } from "vitest";
import { createStore } from "../store";
import { INITIAL_STATE,ACTION_TYPES } from "@utils/constants";
import type { AppState, Action } from "../reducer";

describe("createStore", () => {
    it("returns the initial state", () => {
        const reducer = (state: AppState, action: Action): AppState => state;

        const store = createStore(reducer, INITIAL_STATE);

        expect(store.getState()).toEqual(INITIAL_STATE);
    });

    it("updates state when an action is dispatched", () => {
    const reducer = (state: AppState, action: Action): AppState => {
        if (action.type === ACTION_TYPES.TOGGLE_THEME) {
            return {
                ...state,
                theme: state.theme === "dark" ? "light" : "dark"
            };
        }

        return state;
    };

    const store = createStore(reducer, INITIAL_STATE);

    store.dispatch({
        type: ACTION_TYPES.TOGGLE_THEME
    });

    expect(store.getState().theme).toBe("light");
});

    it("notifies subscribers when state changes", () => {
    const reducer = (state: AppState, action: Action): AppState => {
        if (action.type === ACTION_TYPES.TOGGLE_THEME) {
            return {
                ...state,
                theme: state.theme === "dark" ? "light" : "dark"
            };
        }

        return state;
    };

    const store = createStore(reducer, INITIAL_STATE);

    const listener = vi.fn();

    store.subscribe(listener);

    store.dispatch({
        type: ACTION_TYPES.TOGGLE_THEME
    });

    expect(listener).toHaveBeenCalledTimes(1);
});

   it("allows a subscriber to unsubscribe", () => {
    const reducer = (state: AppState, action: Action): AppState => {
        if (action.type === ACTION_TYPES.TOGGLE_THEME) {
            return {
                ...state,
                theme: state.theme === "dark" ? "light" : "dark"
            };
        }

        return state;
    };

    const store = createStore(reducer, INITIAL_STATE);

    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);

    unsubscribe();

    store.dispatch({
        type: ACTION_TYPES.TOGGLE_THEME
    });

    expect(listener).not.toHaveBeenCalled();
});

  it("does not notify subscribers when the reducer returns the same state", () => {
    const reducer = (state: AppState, action: Action): AppState => {
        return state;
    };

    const store = createStore(reducer, INITIAL_STATE);

    const listener = vi.fn();

    store.subscribe(listener);

    store.dispatch({
        type: ACTION_TYPES.UNKNOWN_ACTION
    });

    expect(listener).not.toHaveBeenCalled();
});
it("supports middleware", () => {
    const reducer = (state: AppState, action: Action): AppState => {
        if (action.type === ACTION_TYPES.TOGGLE_THEME) {
            return {
                ...state,
                theme: state.theme === "dark" ? "light" : "dark"
            };
        }

        return state;
    };

    const middleware = vi.fn(() => (next: (action: Action) => Action) => (action: Action) => {
        return next(action);
    });

    const store = createStore(
        reducer,
        INITIAL_STATE,
        [middleware]
    );

    store.dispatch({
        type: ACTION_TYPES.TOGGLE_THEME
    });

    expect(middleware).toHaveBeenCalledTimes(1);
    expect(store.getState().theme).toBe("light");
});
});