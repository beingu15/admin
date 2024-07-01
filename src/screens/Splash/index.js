import { View, Text, Image } from 'react-native'
import React from 'react'

const Splash = () => {
  return (
    <View style={{flex:1,justifyContent:'center'}}>
      <Image source={require('../../assets/images/LOGO.png')}
      style={{
        width:250,
        height:150,
        resizeMode:'contain',
        alignSelf:'center',
        
      }}/>
    </View>
  )
}

export default Splash