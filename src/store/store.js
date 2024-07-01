import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore,persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";


import { BeKartReducer } from "./reducer";

// redux persist config
const persistconfig = {
    key:'BeKartAdmin',
    storage:AsyncStorage
};



// middleware
const persistedReducer=persistReducer(persistconfig,BeKartReducer)



// redux:store
const store = configureStore({
    reducer:persistedReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
        immutableCheck:false,
        serializableCheck:false
    })
})


let persister = persistStore(store);


export{store,persister};
    
    




