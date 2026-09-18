// import { Button, Card, Modal } from "./component.js";
// import { ACTION_TYPES ,Recipe} from "./constants.js";
// import type { AppState, Action } from "./reducer.ts";
// import type { RouteParams } from "./router.js";

import { Button, Card, Modal } from "@components/component";
import { ACTION_TYPES } from "@utils/constants";
import type { AppState, Action } from "../reducer";
import type { RouteParams } from "../router";
import type { Recipe } from "../reducer"

type PageStore = {
    dispatch: (action: Action) => Action;
};
type HomePageProps = {
    state?: AppState;
    router: Router;
};
type Router = {
    navigate: (path: string) => void;
};

type ListPageProps = {
    state: AppState;
    router: Router;
    store: PageStore;
};

type DetailPageProps = {
    state: AppState;
    params?: RouteParams;
    router: Router;
};

type SettingsPageProps = {
    state: AppState;
    router?: Router;
    store: PageStore;
};
export function renderHomePage({ router }:HomePageProps) : HTMLElement {

    const main = document.createElement("main");
    main.className = "page page-home";

    const title = document.createElement("h1");
    title.textContent = "Recipe Browser";

    const description = document.createElement("p");
    description.textContent =
        "Discover recipes from different cuisines and explore cooking instructions.";

    const browseButton = Button({
        text: "Browse Recipes",
        className: "btn-primary",
        onClick: () => router.navigate("/list")
    });

    main.appendChild(title);
    main.appendChild(description);
    main.appendChild(browseButton);

    return main;
}


export function renderListPage({ state, router, store } : ListPageProps) : HTMLElement{

    const main = document.createElement("main");
    main.className = "page page-list";

    const title = document.createElement("h1");
    title.textContent = "Recipes";

    const addButton = Button({ text: "Add Recipe", className: "btn-primary", onClick: () => { 
        openAddRecipeModal(); 
    } });
    const recipeContainer = document.createElement("section");
    recipeContainer.className = "recipe-grid";


    const recipes = Array.isArray(state.recipes)
        ? state.recipes
        : [];
    if (state.loading) {
        const loadingMessage = document.createElement("p");
        loadingMessage.textContent = "Loading recipes...";
        recipeContainer.appendChild(loadingMessage);

        main.appendChild(title);
        main.appendChild(addButton);
        main.appendChild(recipeContainer);

        return main;
    }

    if (state.error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = `Error: ${state.error}`;

        recipeContainer.appendChild(errorMessage);

        main.appendChild(title);
        main.appendChild(addButton);
        main.appendChild(recipeContainer);

        return main;
    }

    if (recipes.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.textContent =
            "No recipes available yet.";

        recipeContainer.appendChild(emptyMessage);

    } else {

        recipes.forEach((recipe) => {

            const card = Card({
                title: recipe.title,
                description: recipe.description,
                category: recipe.category,

                onClick: () => {
                    router.navigate(
                        `/detail/${recipe.id}`
                    );
                }
            });
            const editButton = Button({
                text: "Edit",
                onClick: (event) => {
                    event.stopPropagation();
                    openEditRecipeModal(recipe);
                }
            });
            const deleteButton = Button({
                text: "Delete",
                className: "btn-danger",
                onClick: (event) => {
                    event.stopPropagation();

                    store.dispatch({
                        type: ACTION_TYPES.DELETE_RECIPE,
                        payload: recipe.id
                    });
                }
            });
            recipeContainer.appendChild(card);
            recipeContainer.appendChild(editButton);
            recipeContainer.appendChild(deleteButton);
        });
    }


    main.appendChild(title); 
    main.appendChild(addButton);
    main.appendChild(recipeContainer);

    function openAddRecipeModal() { 
        const form = document.createElement("form"); 
        form.className = "recipe-form";
        const titleLabel = document.createElement("label"); 
        titleLabel.textContent = "Recipe Title"; 
        const titleInput = document.createElement("input");
        titleInput.type = "text"; titleInput.name = "title"; 
        titleInput.required = true; titleInput.placeholder = "Enter recipe title"; 
        const descriptionLabel = document.createElement("label"); 
        descriptionLabel.textContent = "Description";
        const descriptionInput = document.createElement("textarea"); 
        descriptionInput.name = "description"; descriptionInput.required = true; 
        descriptionInput.placeholder = "Enter recipe description"; 
        const categoryLabel = document.createElement("label");
        categoryLabel.textContent = "Category"; 
        const categorySelect = document.createElement("select"); 
        categorySelect.name = "category"; 
        categorySelect.required = true; 
        state.categories.forEach( (category) => {
            const option = document.createElement("option");
            option.value = category; option.textContent = category; 
            categorySelect.appendChild( option ); } 
        ); /* SUBMIT BUTTON */ 
        const submitButton = Button({ text: "Add Recipe", className: "btn-primary" });
        submitButton.type = "submit"; 
        /* FORM STRUCTURE */ 
        form.appendChild(titleLabel); 
        form.appendChild(titleInput);
        form.appendChild(descriptionLabel); 
        form.appendChild(descriptionInput); 
        form.appendChild(categoryLabel);
        form.appendChild(categorySelect); 
        form.appendChild(submitButton); 
        
        const modal = Modal({ title: "Add New Recipe", bodyNode: form, onClose: () => { modal.remove(); } }); 
        
        form.addEventListener( "submit", (event) => { 
            event.preventDefault(); 
            const newRecipe = { id: Date.now(), title: titleInput.value.trim(), description: descriptionInput.value.trim(), category: categorySelect.value }; 
            store.dispatch({ type: ACTION_TYPES.ADD_RECIPE, payload: newRecipe }); 
            modal.remove(); 
        } ); 
        document.body.appendChild(modal);
        titleInput.focus(); 
        form.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                modal.remove();
            }

            const target=event.target
            if(!(target instanceof Element)) return;

            if (event.key === "Enter" && target.tagName !== "TEXTAREA") {
                event.preventDefault();
                form.requestSubmit();
            }

        });
    }
    function openEditRecipeModal(recipe : Recipe) {
        
        const form = document.createElement("form");
        
        form.className ="recipe-form";
        
        
        /* TITLE */
        
        const titleLabel = document.createElement("label");
        titleLabel.textContent = "Recipe Title";
        const titleInput =document.createElement("input");
        
        titleInput.type = "text";
        titleInput.name = "title";
        titleInput.required = true;
        
        titleInput.value = recipe.title;
        
        
        /* DESCRIPTION */
        
        const descriptionLabel = document.createElement("label");
        
        descriptionLabel.textContent ="Description";
        
        
        const descriptionInput =document.createElement("textarea");
        
        descriptionInput.name ="description";
        
        descriptionInput.required = true;
        
        descriptionInput.value = recipe.description;
        
        
        /* CATEGORY */

        const categoryLabel =document.createElement("label");

        categoryLabel.textContent = "Category";
        
        
        const categorySelect = document.createElement("select");
        
        categorySelect.name ="category";
        
        categorySelect.required = true;
        
        
        state.categories.forEach((category) => {
                
                const option = document.createElement("option");
                
                option.value = category;
                option.textContent = category;
                
                option.selected = category === recipe.category;
                
                categorySelect.appendChild(option);
            }
        );
        
        
        /* SUBMIT */
        
        const submitButton =
        Button({
            text: "Save Changes",
            className: "btn-primary"
        });
        
        
        submitButton.type ="submit";
        
        
        /* FORM */
        
        form.appendChild(titleLabel);
        form.appendChild(titleInput);
        
        form.appendChild(descriptionLabel);
        form.appendChild(descriptionInput);
        
        form.appendChild(categoryLabel);
        form.appendChild(categorySelect);
        
        form.appendChild(submitButton);
        
        
        /* MODAL */
        
        const modal = Modal({
            title: "Edit Recipe",
            bodyNode: form,
            onClose: () => {
                modal.remove();
            }
            
        });
        
        
        /* SUBMIT */
        
        form.addEventListener("submit",(event) => {
                event.preventDefault();
                const updatedRecipe = {
                    id: recipe.id,
                    title:titleInput.value.trim(),
                    description:descriptionInput.value.trim(),
                    category: categorySelect.value
                }; 
                store.dispatch({
                    
                    type:ACTION_TYPES.UPDATE_RECIPE,
                    payload: updatedRecipe
                    
                });
              modal.remove();
                
            }
        );
        
        
        document.body.appendChild(modal);
        titleInput.focus();
        
        form.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                modal.remove();
            }

            const target= event.target
            if(!(target instanceof Element)) return

            if (event.key === "Enter" && target.tagName !== "TEXTAREA") {
                event.preventDefault();
                form.requestSubmit();
            }

        });
        
    }
    return main;
}

export function renderDetailPage({ state, params, router }:DetailPageProps) :HTMLElement {

    const main = document.createElement("main");
    main.className = "page page-detail";


    const recipeId = params?.id;


    const recipes = Array.isArray(state.recipes)
        ? state.recipes
        : [];


    const recipe = recipes.find(
        (item) => String(item.id) === String(recipeId)
    );


    if (!recipe) {

        const title = document.createElement("h1");

        title.textContent = "Recipe Not Found";

        const backButton = Button({
            text: "Back to Recipes",
            onClick: () => router.navigate("/list")
        });

        main.appendChild(title);
        main.appendChild(backButton);

        return main;
    }


    const title = document.createElement("h1");

    title.textContent = recipe.title;


    const category = document.createElement("p");

    category.textContent =
        `Category: ${recipe.category}`;


    const description = document.createElement("p");

    description.textContent =
        recipe.description;


    const backButton = Button({
        text: "Back to Recipes",
        onClick: () => router.navigate("/list")
    });


    main.appendChild(title);
    main.appendChild(category);
    main.appendChild(description);
    main.appendChild(backButton);


    return main;
}


export function renderSettingsPage({ state, store }:SettingsPageProps) : HTMLElement {

    const main = document.createElement("main");
    main.className = "page page-settings";


    const title = document.createElement("h1");
    title.textContent = "Settings";


    const themeText = document.createElement("p");

    themeText.textContent =
        `Current theme: ${state.theme}`;


    const themeButton = Button({
        text: "Toggle Theme",
        onClick: () => {

            store.dispatch({

                type: ACTION_TYPES.TOGGLE_THEME

            });
        }
    });


    main.appendChild(title);
    main.appendChild(themeText);
    main.appendChild(themeButton);


    return main;
}