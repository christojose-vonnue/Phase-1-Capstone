import type { AppState, Action } from "./reducer.ts";
type Reducer = (
    state: AppState,
    action: Action
) => AppState;

type MiddlewareAPI = {
    getState:() => AppState;
    dispatch : (action : Action)=>Action
}

type Next =(action:Action)=> Action

export type Middleware = (api : MiddlewareAPI)=>(next : Next) => (action : Action) =>Action
export function createStore(reducer : Reducer, initialState : AppState,middlewares : Middleware[] = []){

    let state=initialState;
    const listeners= new Set<(state:AppState,previousState:AppState,action:Action)=>void>()

    function getState(){
        return state;
    } 

    function subscribe(listener : (state:AppState,previousState:AppState,action:Action)=>void){
        listeners.add(listener)
        return function unsubscribe(){
            listeners.delete(listener)
        }
    }

    // const dispatch=(action)=>{
    //     const previousState = state;
    //     state=reducer(state,action)
    //     if(state !== previousState){

    //         listeners.forEach((listener)=>{listener(state,previousState,action)})
    //     }
    // }
    function baseDispatch(action : Action) { 
        const previousState = state 
        state = reducer(state, action)
        if (state !== previousState) { 
            listeners.forEach( (listener) => { 
                listener( state, previousState, action ); 
            } ); 
        } return action; } 
        
    // Middleware API 
    const middlewareAPI : MiddlewareAPI = { getState, dispatch: (action : Action) => dispatch(action) }; 
    // Build middleware chain
    const chain = middlewares.map( (middleware: Middleware)  => middleware(middlewareAPI) ); 
    
    let dispatch = chain.reduceRight( (next, middleware) => middleware(next), baseDispatch );


    return{
        getState,
        subscribe,
        dispatch
    }
}