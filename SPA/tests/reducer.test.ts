import { describe, it, expect } from "vitest";
import { appReducer } from "../reducer";
import { ACTION_TYPES, ROUTES } from "@utils/constants";

const initialState = {
    currentRoute: {
        path: ROUTES.HOME,
        rawPath: ROUTES.HOME,
        params: {}
    },
    recipes: [
        {
            id: 1,
            title: "Chicken Curry",
            description: "Indian curry",
            category: "Indian"
        },
        {
            id: 2,
            title: "Sushi",
            description: "Japanese sushi",
            category: "Japanese"
        }
    ],
    categories: ["Indian", "Japanese", "American"],
    selectedRecipeId: null,
    filter: null,
    theme: "dark",
    loading: false,
    error: null
};

describe("appReducer", () => {

    it("handles navigation", () => {
        const state = appReducer(initialState, {
            type: ACTION_TYPES.NAVIGATE,
            payload: {
                path: "/detail/1",
                rawPath: "/detail/1",
                params: { id: "1" }
            }
        });

        expect(state.currentRoute.path).toBe("/detail/1");
        expect(state.currentRoute.params).toEqual({ id: "1" });
    });

    it("handles search/filter", () => {
        const state = appReducer(initialState, {
            type: ACTION_TYPES.SEARCH,
            payload: "chicken"
        });

        expect(state.filter).toBe("chicken");
    });

    it("toggles the theme", () => {
        const lightState = appReducer(initialState, {
            type: ACTION_TYPES.TOGGLE_THEME
        });

        expect(lightState.theme).toBe("light");

        const darkState = appReducer(lightState, {
            type: ACTION_TYPES.TOGGLE_THEME
        });

        expect(darkState.theme).toBe("dark");
    });

    it("adds a recipe", () => {
        const newRecipe = {
            id: 3,
            title: "Burger",
            description: "American burger",
            category: "American"
        };

        const state = appReducer(initialState, {
            type: ACTION_TYPES.ADD_RECIPE,
            payload: newRecipe
        });

        expect(state.recipes).toHaveLength(3);
        expect(state.recipes[2]).toEqual(newRecipe);
        expect(state.error).toBeNull();
    });

    it("updates a recipe", () => {
        const state = appReducer(initialState, {
            type: ACTION_TYPES.UPDATE_RECIPE,
            payload: {
                id: 1,
                title: "Updated Chicken Curry"
            }
        });

        expect(state.recipes[0].title).toBe("Updated Chicken Curry");
        expect(state.recipes[0].description).toBe("Indian curry");
    });

    it("deletes a recipe", () => {
        const state = appReducer(initialState, {
            type: ACTION_TYPES.DELETE_RECIPE,
            payload: 1
        });

        expect(state.recipes).toHaveLength(1);
        expect(state.recipes[0].id).toBe(2);
    });

    it("handles loading start", () => {
        const state = appReducer(initialState, {
            type: ACTION_TYPES.LOAD_RECIPES_START
        });

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("handles loading success", () => {
        const recipes = [
            {
                id: 10,
                title: "Pasta",
                description: "Italian pasta",
                category: "Italian"
            }
        ];

        const state = appReducer(initialState, {
            type: ACTION_TYPES.LOAD_RECIPES_SUCCESS,
            payload: recipes
        });

        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.recipes).toEqual(recipes);
    });

    it("handles loading error", () => {
        const state = appReducer(initialState, {
            type: ACTION_TYPES.LOAD_RECIPES_ERROR,
            payload: "Failed to load recipes"
        });

        expect(state.loading).toBe(false);
        expect(state.error).toBe("Failed to load recipes");
    });

    it("returns the existing state for an unknown action", () => {
        const state = appReducer(initialState, {
            type: "UNKNOWN_ACTION"
        });

        expect(state).toBe(initialState);
    });
});