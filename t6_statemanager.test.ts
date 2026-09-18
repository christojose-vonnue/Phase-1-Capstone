import { describe, it, expect, vi } from "vitest";
import { createStore } from "./t6_statemanager";

type State = {
    count: number;
};

type Action =
    | {
        type: "INCREMENT";
    }
    | {
        type: "DECREMENT";
    };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "INCREMENT":
            return {
                count: state.count + 1
            };

        case "DECREMENT":
            return {
                count: state.count - 1
            };
    }
}

describe("Type-safe State Manager", () => {

    it("dispatches typed actions and updates state", () => {
        const store = createStore<State, Action>(
            { count: 0 },
            reducer
        );

        store.dispatch({
            type: "INCREMENT"
        });

        expect(store.getState()).toEqual({
            count: 1
        });

        store.dispatch({
            type: "DECREMENT"
        });

        expect(store.getState()).toEqual({
            count: 0
        });
    });

    it("notifies subscribers when state changes", () => {
        const store = createStore<State, Action>(
            { count: 0 },
            reducer
        );

        const listener = vi.fn();

        store.subscribe(listener);

        store.dispatch({
            type: "INCREMENT"
        });

        expect(listener).toHaveBeenCalledWith({
            count: 1
        });
    });

    it("stops notifying after unsubscribe", () => {
        const store = createStore<State, Action>(
            { count: 0 },
            reducer
        );

        const listener = vi.fn();

        const unsubscribe = store.subscribe(listener);

        unsubscribe();

        store.dispatch({
            type: "INCREMENT"
        });

        expect(listener).not.toHaveBeenCalled();
    });
});