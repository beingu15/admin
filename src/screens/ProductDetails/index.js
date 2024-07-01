import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import NavigationBack from '../../common/NavigationBack'
import colors from '../../common/colors'
import Accordion from '../../components/Accordion'
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const ProductDetails = () => {
  const navigation=useNavigation()
  const route=useRoute()
  const product=route.params.product
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: product.name,
      headerTitleAlign: 'right',
      headerStyle: {
        backgroundColor: '#f4511e',
        height: 80,
      },
      headerTintColor: '#fff',
      headerLeft: () => <NavigationBack />,
      headerRight: () => <RightComponent />,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
    });
  }, [navigation]);
  const RightComponent = () => (
    <TouchableOpacity onPress={() => {}}>
      <FontAwesome name={"edit"} size={20} color="#000" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{flex:1,padding:15}}>
      <Image source={{uri:product.image}} style={{width:'100%',height:200,resizeMode:'contain'}}/>
      <View style={{flex:1,backgroundColor:colors.white_level3,padding:15,borderRadius:12}}>
        <Text style={{fontFamily:'Roboto-Bold',fontSize:20}}>{product.name}</Text>
        <Text style={{fontFamily:'Roboto-Bold',fontSize:20}}>{product.description}</Text>
        <Text style={{fontFamily:'Roboto-Regular',fontSize:18}}>${product.price}{' '}<Text style={{color:colors.green}}>25% off</Text></Text>

      </View>
      <Accordion title="More Info">
           
          </Accordion>
          <Accordion title="Extra Info">
           <Text>MANUFACTURER</Text> 
          </Accordion>
          <Accordion title="Product Review">
           
          </Accordion>
          <Accordion title="Delivery Info">
            
          </Accordion>
    </ScrollView>
  )
}

export default ProductDetails