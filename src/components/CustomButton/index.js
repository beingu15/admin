import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '../../common/colors'

const CustomButton = (props) => {
    const{onPress,text,width}=props
  return (
    <TouchableOpacity onPress={onPress}
    style={{
        alignSelf:'center', 
        width:width,
        padding:15,
        backgroundColor:colors.orange,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        marginVertical:15
    }}>
        <Text style={{
            color:colors.white,
            fontSize:18,
            fontFamily:'Roboto-Bold'}}>
            {text}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton