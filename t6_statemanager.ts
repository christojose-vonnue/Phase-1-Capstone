export type Action = {
    type: string;
};

export function createStore<S, A extends Action>(
    initialState: S,
    reducer: (state: S, action: A) => S
) {
    let state = initialState;

    const listeners: Array<(state: S) => void> = [];

    function dispatch(action: A): void {
        state = reducer(state, action);

        listeners.forEach(listener => listener(state));
    }

    function getState(): S {
        return state;
    }

    function subscribe(listener: (state: S) => void): () => void {
        listeners.push(listener);

        return () => {
            const index = listeners.indexOf(listener);

            if (index !== -1) {
                listeners.splice(index, 1);
            }
        };
    }

    return {
        dispatch,
        getState,
        subscribe
    };
}