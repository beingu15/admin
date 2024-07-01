import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const NavigationBack = () => {
    const navigation=useNavigation()
  return (
    <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image source={require('../assets/images/back.png')} style={{width:50,height:50,resizeMode:'contain',padding:12}}/>
          </TouchableOpacity>
  )
}

export default NavigationBack