import { ACTION_TYPES, INITIAL_STATE } from "@utils/constants";

export type Action =
    | {
        type: typeof ACTION_TYPES.NAVIGATE;
        payload: {
            path: string;
            rawPath: string;
            params: Record<string, string>;
        };
    }
    | {
        type: typeof ACTION_TYPES.SEARCH;
        payload: string;
    }
    | {
        type: typeof ACTION_TYPES.INSTRUCTIONS;
        payload: string | number;
    }
    | {
        type: typeof ACTION_TYPES.TOGGLE_THEME;
    }
    | {
        type: typeof ACTION_TYPES.ADD_RECIPE;
        payload: Recipe;
    }
    | {
        type: typeof ACTION_TYPES.UPDATE_RECIPE;
        payload: {
            id: number;
            title?: string;
            description?: string;
            category?: string;
        };
    }
    | {
        type: typeof ACTION_TYPES.DELETE_RECIPE;
        payload: number;
    }
    | {
        type: typeof ACTION_TYPES.LOAD_RECIPES_START;
    }
    | {
        type: typeof ACTION_TYPES.LOAD_RECIPES_SUCCESS;
        payload: Recipe[];
    }
    | {
        type: typeof ACTION_TYPES.LOAD_RECIPES_ERROR;
        payload: string;
    }
    
    | {
        type : typeof ACTION_TYPES.UNKNOWN_ACTION;
    };

export type AppState = {
    currentRoute: {
        path: string;
        rawPath: string;
        params: Record<string, string>;
    };
    categories: string[];
    selectedRecipeId: number | null;
    filter: string | null;
    theme: string;
    loading: boolean;
    error: string | null;
    recipes: Recipe[];
};

export type Recipe = {
    id: number,
    title: string,
    description: string,
    category: string
}
export function appReducer(state : AppState=INITIAL_STATE,action : Action){ 
    switch(action.type){
        case ACTION_TYPES.NAVIGATE:
            return{
                ...state,
                currentRoute:{
                    path : action.payload.path,
                    rawPath : action.payload.rawPath,
                    params : action.payload.params || {}
                }
            };

        case ACTION_TYPES.INSTRUCTIONS:
            return{
                ...state,
                selectedRecipieId : action.payload 
            };

        case ACTION_TYPES.SEARCH:
            return{
                ...state,
                filter : action.payload
            }
        case ACTION_TYPES.TOGGLE_THEME:
            return{
                ...state,
                theme : state.theme === 'dark' ? 'light' : 'dark'
            }

        case ACTION_TYPES.ADD_RECIPE:
             return { ...state,
                 recipes: [ ...state.recipes, action.payload ], 
                 error: null };
        
        case ACTION_TYPES.UPDATE_RECIPE: 
            return { ...state, 
                    recipes: state.recipes.map((recipe) => String(recipe.id) === String(action.payload.id) ? { ...recipe, ...action.payload } : recipe ), 
                    error: null };
        case ACTION_TYPES.DELETE_RECIPE: 
            return { ...state, 
                recipes: state.recipes.filter( (recipe) => String(recipe.id) !== String(action.payload) ), 
                selectedRecipeId: String(state.selectedRecipeId) === String(action.payload) ? null : state.selectedRecipeId, 
                error: null };

        // Loading aync actions 
        case ACTION_TYPES.LOAD_RECIPES_START: 
            return { ...state, 
                    loading: true, 
                    error: null };

        case ACTION_TYPES.LOAD_RECIPES_SUCCESS: 
            return { ...state, 
                    recipes: action.payload, 
                    loading: false, 
                    error: null };

        case ACTION_TYPES.LOAD_RECIPES_ERROR: 
            return { ...state, 
                    loading: false, 
                    error: action.payload };
        default:
            return state
    }
}

