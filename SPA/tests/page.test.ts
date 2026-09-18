// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    renderHomePage,
    renderListPage,
    renderDetailPage,
    renderSettingsPage
} from "@components/page";
import { ACTION_TYPES } from "@utils/constants";

const recipe = {
    id: 1,
    title: "Chicken Curry",
    description: "A simple Indian chicken curry",
    category: "Indian"
};

const categories = ["Indian", "Japanese", "American"];
// export type AppState = {
//     currentRoute: {
//         path: string;
//         rawPath: string;
//         params: Record<string, string>;
//     };
//     categories: string[];
//     selectedRecipeId: number | null;
//     filter: string | null;
//     theme: string;
//     loading: boolean;
//     error: string | null;
//     recipes: Recipe[];
// };

//  {
//     currentRoute: {
//         path: '/';
//         rawPath: '/';
//         params: '{}';
//     };
//     categories: ['Indian','Chinese','American'];
//     selectedRecipeId: null;
//     filter: null;
//     theme: 'dark';
//     loading: false;
//     error:  null;
//     recipes: [];
// };
function createState(overrides = {}) {
    return {
    currentRoute: {
        path: '/',
        rawPath: '/',
        params: {},
    },
    categories: categories,
    selectedRecipeId: null,
    filter: null,
    theme: 'dark',
    loading: false,
    error:  null,
    recipes: [recipe],
    ...overrides
};
}

function createRouter() {
    return {
        navigate: vi.fn()
    };
}

function createStore() {
    return {
        dispatch: vi.fn()
    };
}

beforeEach(() => {
    document.body.innerHTML = "";
});


describe("renderHomePage", () => {
    it("renders the home page", () => {
        const router = createRouter();

        const page = renderHomePage({
            state: createState(),
            router
        });

        expect(page.className).toContain("page-home");
        expect(page.textContent).toContain("Recipe Browser");
        expect(page.textContent).toContain(
            "Discover recipes from different cuisines"
        );
        expect(page.textContent).toContain("Browse Recipes");
    });

    it("navigates to recipes when Browse Recipes is clicked", () => {
        const router = createRouter();

        const page = renderHomePage({
            state: createState(),
            router
        });

        const button = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Browse Recipes");

        if(!(button instanceof HTMLButtonElement)) return
        button.click();

        expect(router.navigate).toHaveBeenCalledWith("/list");
    });
});


describe("renderListPage", () => {
    it("renders recipes", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        expect(page.textContent).toContain("Recipes");
        expect(page.textContent).toContain("Chicken Curry");
        expect(page.textContent).toContain("A simple Indian chicken curry");
        expect(page.textContent).toContain("Indian");
        expect(page.textContent).toContain("Add Recipe");
        expect(page.textContent).toContain("Edit");
        expect(page.textContent).toContain("Delete");
    });

    it("navigates to recipe detail when a card is clicked", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const card = page.querySelector(".card");
        if(!(card instanceof HTMLButtonElement)) return
        card.click();

        expect(router.navigate).toHaveBeenCalledWith("/detail/1");
    });

    it("dispatches DELETE_RECIPE when Delete is clicked", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const deleteButton = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Delete");

        if(!(deleteButton instanceof HTMLButtonElement)) return
        deleteButton.click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTION_TYPES.DELETE_RECIPE,
            payload: 1
        });
    });

    it("shows loading state", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState({
                loading: true
            }),
            router,
            store
        });

        expect(page.textContent).toContain("Loading recipes...");
    });

    it("shows error state", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState({
                error: "Failed to load recipes"
            }),
            router,
            store
        });

        expect(page.textContent).toContain(
            "Error: Failed to load recipes"
        );
    });

    it("shows empty state when there are no recipes", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState({
                recipes: []
            }),
            router,
            store
        });

        expect(page.textContent).toContain(
            "No recipes available yet."
        );
    });

    it("handles missing recipes array", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState({
                recipes: undefined
            }),
            router,
            store
        });

        expect(page.textContent).toContain(
            "No recipes available yet."
        );
    });

    it("opens Add Recipe modal", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const addButton = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Add Recipe");

        if(!(addButton instanceof HTMLButtonElement)) return
        addButton.click();

        expect(document.body.textContent).toContain(
            "Add New Recipe"
        );

        expect(document.body.querySelector(
            'input[name="title"]'
        )).toBeTruthy();

        expect(document.body.querySelector(
            'textarea[name="description"]'
        )).toBeTruthy();

        expect(document.body.querySelector(
            'select[name="category"]'
        )).toBeTruthy();
    });

    it("adds a recipe through the Add Recipe form", () => {
        const router = createRouter();
        const store = createStore();

        vi.spyOn(Date, "now").mockReturnValue(12345);

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const addButton = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Add Recipe");

        if(!(addButton instanceof HTMLButtonElement)) return
        addButton.click();

        
        const form = document.querySelector("form");
        if(!(form instanceof HTMLFormElement)) return

        const titleInput = form.querySelector('input[name="title"]');
        if(!(titleInput instanceof HTMLInputElement)) return

        const descriptionInput = form.querySelector(
            'textarea[name="description"]'
        );
        if(!(descriptionInput instanceof HTMLTextAreaElement)) return

        const categorySelect = form.querySelector(
            'select[name="category"]'
        );
        if(!(categorySelect instanceof HTMLSelectElement)) return


        titleInput.value = "  Pasta  ";
        descriptionInput.value = "  Delicious pasta  ";
        categorySelect.value = "American";

        form.dispatchEvent(
            new Event("submit", {
                bubbles: true,
                cancelable: true
            })
        );

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTION_TYPES.ADD_RECIPE,
            payload: {
                id: 12345,
                title: "Pasta",
                description: "Delicious pasta",
                category: "American"
            }
        });

        expect(document.querySelector(".modal-overlay")).toBeNull();

        vi.restoreAllMocks();
    });

    it("closes Add Recipe modal with Escape", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const addButton = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Add Recipe");
        if(!(addButton instanceof HTMLButtonElement)) return
        addButton.click();

        const form = document.querySelector("form");
        if(!(form instanceof HTMLFormElement)) return

        form.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true
            })
        );

        expect(document.querySelector(".modal-overlay")).toBeNull();
    });

    it("opens Edit Recipe modal", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const editButton = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Edit");
        
        if(!(editButton instanceof HTMLButtonElement)) return
        editButton.click();

        expect(document.body.textContent).toContain(
            "Edit Recipe"
        );

        const titleInput = document.querySelector(
            'input[name="title"]'
        );
        if(!(titleInput instanceof HTMLInputElement)) return
        expect(titleInput.value).toBe("Chicken Curry");
    });

    it("updates a recipe through the Edit Recipe form", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const editButton = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Edit");
        if(!(editButton instanceof HTMLButtonElement)) return
        editButton.click();

        
         const form = document.querySelector("form");
        if(!(form instanceof HTMLFormElement)) return

        const titleInput = form.querySelector('input[name="title"]');
        if(!(titleInput instanceof HTMLInputElement)) return

        const descriptionInput = form.querySelector(
            'textarea[name="description"]'
        );
        if(!(descriptionInput instanceof HTMLTextAreaElement)) return

        const categorySelect = form.querySelector(
            'select[name="category"]'
        );
        if(!(categorySelect instanceof HTMLSelectElement)) return


        titleInput.value = "Updated Curry";
        descriptionInput.value = "Updated description";
        categorySelect.value = "Japanese";

        form.dispatchEvent(
            new Event("submit", {
                bubbles: true,
                cancelable: true
            })
        );

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTION_TYPES.UPDATE_RECIPE,
            payload: {
                id: 1,
                title: "Updated Curry",
                description: "Updated description",
                category: "Japanese"
            }
        });

        expect(document.querySelector(".modal-overlay")).toBeNull();
    });

    it("closes Edit Recipe modal with Escape", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderListPage({
            state: createState(),
            router,
            store
        });

        const editButton = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Edit");
        if(!(editButton instanceof HTMLButtonElement)) return

        editButton.click();

        const form = document.querySelector("form");

        if(!(form instanceof HTMLFormElement)) return
        form.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true
            })
        );

        expect(document.querySelector(".modal-overlay")).toBeNull();
    });
});


describe("renderDetailPage", () => {
    it("renders a recipe detail page", () => {
        const router = createRouter();

        const page = renderDetailPage({
            state: createState(),
            params: { id: "1" },
            router
        });

        expect(page.textContent).toContain("Chicken Curry");
        expect(page.textContent).toContain("Category: Indian");
        expect(page.textContent).toContain(
            "A simple Indian chicken curry"
        );
        expect(page.textContent).toContain("Back to Recipes");
    });

    it("navigates back to recipes", () => {
        const router = createRouter();

        const page = renderDetailPage({
            state: createState(),
            params: { id: "1" },
            router
        });

        const button = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Back to Recipes");

        if(!(button instanceof HTMLButtonElement)) return
        button.click();

        expect(router.navigate).toHaveBeenCalledWith("/list");
    });

    it("shows Recipe Not Found for an invalid id", () => {
        const router = createRouter();

        const page = renderDetailPage({
            state: createState(),
            params: { id: "999" },
            router
        });

        expect(page.textContent).toContain("Recipe Not Found");
    });

    it("handles missing recipes in detail page", () => {
        const router = createRouter();

        const page = renderDetailPage({
            state: createState({
                recipes: undefined
            }),
            params: { id: "1" },
            router
        });

        expect(page.textContent).toContain("Recipe Not Found");
    });
});


describe("renderSettingsPage", () => {
    it("renders the current theme", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderSettingsPage({
            state: createState({
                theme: "dark"
            }),
            router,
            store
        });

        expect(page.textContent).toContain("Settings");
        expect(page.textContent).toContain(
            "Current theme: dark"
        );
        expect(page.textContent).toContain("Toggle Theme");
    });

    it("dispatches TOGGLE_THEME when clicked", () => {
        const router = createRouter();
        const store = createStore();

        const page = renderSettingsPage({
            state: createState(),
            router,
            store
        });

        const button = Array.from(
            page.querySelectorAll("button")
        ).find(button => button.textContent === "Toggle Theme");
        if(!(button instanceof HTMLButtonElement)) return
        button.click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTION_TYPES.TOGGLE_THEME
        });
    });
});