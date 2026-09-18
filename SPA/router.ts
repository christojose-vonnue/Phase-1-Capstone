// router.js - Client-Side Router with Dynamic Route Parser
import { ACTION_TYPES } from '@utils/constants';
import type { Action,AppState } from "./reducer";

/**
 * Represents dynamic parameters extracted from a route.
 *
 * Each key is a parameter name and each value is its
 * corresponding value from the current URL.
 *
 * Example:
 * /recipes/:id → { id: "123" }
 */
export type RouteParams = Record<string, string>;

type MatchResult = {
    isMatch: boolean;
    params: RouteParams;
};
type Router = {
    navigate: (path: string) => void;
};

type PageStore = {
    dispatch: (action: Action) => Action;
};

type PageProps = {
    state: AppState;
    params: RouteParams;
    router: Router;
    store: PageStore;
};



type RouteComponent = (params: PageProps) => HTMLElement;

export type ResolvedRoute = {
    path: string;
    rawPath: string;
    params: RouteParams;
    component: RouteComponent;
};

export type RouterStore = {
    dispatch: (action: Action) => Action;
};

export function matchRoute(templatePattern : string, currentPath : string) : MatchResult {
  const paramNames : string[]= [];
  // Convert /detail/:id into regex string: ^/detail/([^/]+)$
  const regexPath = templatePattern.replace(/:([^/]+)/g, (_, key) => {
    paramNames.push(key);
    return '([^/]+)';
  });

  const regex = new RegExp(`^${regexPath}$`);
  const match = currentPath.match(regex);

  if (!match) return { isMatch: false, params: {} };

  const params : RouteParams = paramNames.reduce((acc : Record<string,string>, paramName, index) => {
    acc[paramName] = match[index + 1];
    return acc;
  }, {});

  return { isMatch: true, params };
}


export function createRouter(store : RouterStore) {

    const routes = new Map();

    function register(path : string, component : RouteComponent) {
        routes.set(path, component);
    }


    function resolve(path : string) : ResolvedRoute | null  {

        for (const [routePattern, component] of routes) {

            const result = matchRoute(
                routePattern,
                path
            );

            if (result.isMatch) {
                return {
                    path: routePattern,
                    rawPath: path,
                    params: result.params,
                    component
                };
            }
        }

        return null;
    }


    function navigate(path : string) : void {

        const matchedRoute = resolve(path);

        if (!matchedRoute) {
            console.warn(`No route registered for: ${path}`);
            return;
        }

        const currentPath = window.location.pathname;

        if (currentPath !== path) {
            window.history.pushState({}, "", path);
        }

        store.dispatch({
            type: ACTION_TYPES.NAVIGATE,

            payload: {
                path: matchedRoute.path,
                rawPath: matchedRoute.rawPath,
                params: matchedRoute.params
            }
        });
    }


    function handlePopState() : void{
        navigate(window.location.pathname);
    }


    window.addEventListener(
        "popstate",
        handlePopState
    );


    document.addEventListener("click", (event) => {

        const target=event.target

        if(!(target instanceof HTMLElement))return

        const link = target.closest(
            "a[data-link]"
        );

        if (!link) {
            return;
        }

        event.preventDefault();

        const href = link.getAttribute("href");

        if (href) {
            navigate(href);
        }
    });


    return {
        register,
        navigate,
        resolve,
        matchRoute
    };
}
