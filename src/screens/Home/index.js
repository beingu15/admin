import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';


const Home = () => {
  const navigation = useNavigation();
  const[orders,setOrders]=useState(0)
  const[users,setUsers]=useState(0)
  const[products,setProducts]=useState(0)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleContainerStyle: {
        paddingTop: 20, // Adjust padding to visually increase header height
        paddingBottom: 10, // Adjust padding to visually increase header height
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => console.log('Header Right pressed')}>
          <Text style={{ color: '#fff', marginRight: 10 }}>Right</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
          <Image
            source={require('../../assets/images/Vector.png')}
            style={{ width: 50, height: 50, resizeMode: 'contain', padding: 12 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  useEffect(()=>{
    getAllCount()
  },[])

const getAllCount=async()=>{
 const ProductRef=await firestore().collection('Products').get();
 const UserRef=await firestore().collection('Users').get();
 const OrdersRef=await firestore().collection('Orders').get();
 setOrders(OrdersRef.size)
 setProducts(ProductRef.size)
setUsers(UserRef.size)
}

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <View style={{ width: '90%', height: '30%', borderRadius: 15, backgroundColor: 'lightyellow', alignSelf: 'center', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 8 }}>
        <Image style={{ width: 70, height: 60, resizeMode: 'contain', marginRight: 15 }} source={require('../../assets/images/order.png')} />
        <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
          <View>
            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 32 }}>{orders}</Text>
            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>orders</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ width: '90%', height: '30%', borderRadius: 15, backgroundColor: 'lightgreen', alignSelf: 'center', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 8 }}>
        <Image style={{ width: 70, height: 60, resizeMode: 'contain', marginRight: 15 }} source={require('../../assets/images/products.png')} />
        <TouchableOpacity onPress={() => navigation.navigate('Products')}>
          <View>
            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 32 }}>{products}</Text>
            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>products</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ width: '90%', height: '30%', borderRadius: 15, backgroundColor: 'lightblue', alignSelf: 'center', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 8 }}>
        <Image style={{ width: 70, height: 60, resizeMode: 'contain', marginRight: 15 }} source={require('../../assets/images/man.png')} />
        <TouchableOpacity onPress={() => navigation.navigate('Users')}>
          <View>
            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 32 }}>{users}</Text>
            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 18 }}>users</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
