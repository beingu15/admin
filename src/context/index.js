import React,{ createContext, useContext, useEffect, useState } from "react";
import { useWindowDimensions,Dimensions as dim, Dimensions } from "react-native";


export const DimensionContext = createContext();
export const useDimensionContext = () => useContext(DimensionContext);

export const DimensionContextProvider = ({children}) => {
    const dimensions = useWindowDimensions();
    const initialHeight=dim.get('window').height;
    const initialWidth=dim.get('window').width;

    const[windowWidth,setWindowWidth]=useState(initialWidth);
    const[windowHeight,setWindowHeight]=useState(initialHeight);
    const[isPortrait,setIsPortrait]=useState(false);
    const checkisPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width
    }

    useEffect(()=>{
        setIsPortrait(checkisPortrait())
        Dimensions.addEventListener('change',() =>{
            setIsPortrait(checkisPortrait())  
        })

    },[])

    useEffect(() =>{
       setItem() 

    },[dimensions]);
    
    
    const setItem = () => {
        const{height,width} = dimensions;
        setWindowHeight(height)
        setWindowWidth(width)
    

    };
    return (
    <DimensionContext.Provider 
    value ={{
        windowWidth,
        windowHeight,
        isPortrait
    }}>
        {children}
        </DimensionContext.Provider>
    );
};
