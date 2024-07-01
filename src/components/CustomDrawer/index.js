import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { useDimensionContext } from '../../context'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { signout } from '../../store/action'
import colors from '../../common/colors'
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomDrawer = () => {

    // const dimensions=useDimensionContext()
    // const responsiveStyle=style()

   const navigation=useNavigation()
   const dispatch = useDispatch()
   const handleSignOut=()=>{
    dispatch(signout())

   }
   const contents=[
    {itemId:0,
     itemName:'Home',
     navigation:'Footer',
     icon: () => <Feather name="home" size={25} color={colors.black} />
    },
    {itemId:1,
      itemName:'Products',
      navigation:'Footer',
      icon: () => <Feather name="box" size={25} color={colors.black} />
     },
     {itemId:2,
      itemName:'Categories',
      navigation:'Footer',
      icon: () => <MaterialIcons name="category" size={25} color={colors.black} />
     },
     {itemId:3,
      itemName:'Orders',
      navigation:'Footer',
      icon: () => <Feather name="layers" size={25} color={colors.black} />
     
     },
     {itemId:4,
      itemName:'Reviews',
      navigation:'Footer',
      icon: () => <MaterialIcons name="reviews" size={25} color={colors.black} />
     },
     {itemId:5,
      itemName:'Banners',
      navigation:'Banner',
      icon: () => <MaterialIcons name="signpost" size={25} color={colors.black} />
     },
     {itemId:6,
      itemName:'Offers',
      navigation:'Offers',
      icon: () => <MaterialIcons name="local-offer" size={25} color={colors.black} />
     },
    {itemId:7,
        itemName:'Logout',
        
        icon: () => <MaterialIcons name="logout" size={25} color={colors.black} />,
        onPress: handleSignOut,
       }

   ]
   const handleTouch =itemData=>{
    if(itemData.navigation){
        navigation.navigate(itemData.navigation)
    }else{
        itemData.onPress()
    }
   }
  return (
    <ScrollView>
      <View style={{padding:10,marginTop:30,borderBottomWidth:StyleSheet.hairlineWidth,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
        <View style={{width:100,height:100,borderRadius:50,backgroundColor:colors.orange}}></View>
        <View style={{padding:12}}>
        <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Admin</Text>
        <Text style={{fontFamily:'Roboto-Regular',fontSize:14}}>Admin@gmail.com</Text>
        </View>
      </View>
     <View style={{marginTop:20}}>
      {contents.map((item,index)=>(
       <TouchableOpacity onPress={()=>handleTouch(item)}
       key={String(item.itemId)} style={{padding:10,marginVertical:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:StyleSheet.hairlineWidth}}>
        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
         {item.icon()}
        <Text style={{fontFamily:'Roboto-Bold',fontSize:16,marginLeft:12}}>{item.itemName}</Text>
        </View>
       <Image style={{width:24,height:24,resizeMode:'contain'}} source={require('../../assets/images/arrow-right.png')}/>
       </TouchableOpacity>
      ))}
      </View>
    </ScrollView>
  )
}

export default CustomDrawer