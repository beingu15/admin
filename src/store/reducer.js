
import {  LOGIN, SIGNOUT} from "./constants";


const initialState={
    isLoggedIn:false,
    
    userId:'',
    
}

export const BeKartReducer=(state = initialState, action)=>{
    console.warn(action.type);
    switch (action.type) {
        case LOGIN:
             
            return{
                ...state,
                
                userId:action.payload.userId,
                isLoggedIn:true,

            };
            case SIGNOUT:
             
            return{
                ...state,
               
                userId:'',
                isLoggedIn:false,
            };
            
    
        default:
           return state;
    }
}