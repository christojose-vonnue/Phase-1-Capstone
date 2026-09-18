import { INITIAL_STATE,ROUTES,ACTION_TYPES } from "@utils/constants";
import { appReducer} from "./reducer";
import { createStore } from "./store";
import { createRouter } from "./router";
import { storageMiddleware,loadRecipesFromStorage } from "@utils/storage";
import { Navbar } from "@components/component";

import {
    renderHomePage,
    renderListPage,
    renderDetailPage,
    renderSettingsPage
} from "@components/page";


const store = createStore(
    appReducer,
    INITIAL_STATE,
    [
        storageMiddleware
    ]
);

// Router

const router = createRouter(store);

router.register(
    ROUTES.HOME,
    renderHomePage
);

router.register(
    ROUTES.LIST,
    renderListPage
);

router.register(
    ROUTES.DETAIL,
    renderDetailPage
);

router.register(
    ROUTES.SETTINGS,
    renderSettingsPage
);


// Render

function renderApp(rootElement : HTMLElement) {
    const state = store.getState();
    const currentRoute = state.currentRoute;
    const resolvedRoute = router.resolve( currentRoute.rawPath);
    document.documentElement.className = state.theme;

    // Clear previous page
    rootElement.replaceChildren();

    const navbar = Navbar({ router });
    rootElement.appendChild(navbar);
    // Handle unknown routes
    if (!resolvedRoute) {
        const errorPage = document.createElement("main");
        errorPage.className = "page page-error";
        const heading = document.createElement("h1");
        heading.textContent = "404 - Page Not Found";
        errorPage.append(heading);
        rootElement.append(errorPage);
        return;
    }


    // Get the page component
    const PageComponent = resolvedRoute.component;

    // Render the page
  const pageElement: HTMLElement = PageComponent({
    state,
    params: currentRoute.params,
    router,
    store
});

    rootElement.append(pageElement);
}


// We start / intitalize here

function initApp() {
    
    const appRoot = document.getElementById("app");
    if (!appRoot) {
        throw new Error(
            "Root #app element not found in DOM"
        );
    }
    store.subscribe(() => { 
        renderApp(appRoot);
    });

    const savedRecipes = loadRecipesFromStorage();

    store.dispatch({
        type: ACTION_TYPES.LOAD_RECIPES_SUCCESS,
        payload: savedRecipes
    });

   

    // url is updated here

     const currentPath = window.location.pathname;

    if (
        currentPath.endsWith("/index.html") ||
        currentPath.endsWith("/")
    ) {
        router.navigate(ROUTES.HOME);
    } else {
        router.navigate(currentPath);
    }
}
document.addEventListener("DOMContentLoaded", initApp);
