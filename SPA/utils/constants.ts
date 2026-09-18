export const ACTION_TYPES ={
    NAVIGATE:"NAVIGATE",
    SEARCH:"SEARCH_RECIPES",
    INSTRUCTIONS:"INSTRUCTIONS_TO_COOK",
    TOGGLE_THEME:"TOGGLE_THEME",

    // Recipe operations 
    ADD_RECIPE: "ADD_RECIPE", 
    UPDATE_RECIPE: "UPDATE_RECIPE", 
    DELETE_RECIPE: "DELETE_RECIPE",

    // Async states 
    LOAD_RECIPES_START: "LOAD_RECIPES_START", 
    LOAD_RECIPES_SUCCESS: "LOAD_RECIPES_SUCCESS", 
    LOAD_RECIPES_ERROR: "LOAD_RECIPES_ERROR",
    UNKNOWN_ACTION :  "UNKNOWN_ACTION"
} as const
export type ACTIONS =  typeof ACTION_TYPES

export const ROUTES={
    HOME:"/",
    LIST:"/list",
    DETAIL: "/detail/:id",
    SETTINGS:"/settings"
}

export type Recipe = {
    id: number,
    title: string,
    description: string,
    category: string
}

export const INITIAL_STATE={
    currentRoute:{
        path:ROUTES.HOME,
        rawPath: ROUTES.HOME,
        params:{}
    },
    categories:["Indian","Japanese","American"], //sections or search params 
    selectedRecipeId:null,
    filter:null,
    theme:'dark',
    loading : false,
    error : null,
    recipes : []
}



export type STATE = typeof INITIAL_STATE 

// State
// ├── currentRoute      → separate type, to derive
// ├── categories        → string[]
// ├── selectedRecipeId  → number | null
// ├── filter            → string | null
// ├── theme             → "dark" | "light"
// ├── loading           → boolean
// ├── error             → string | null
// └── recipes           → Recipe[]