import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavigationBack from '../../common/NavigationBack';
import colors from '../../common/colors';
import Feather from 'react-native-vector-icons/Feather';
import CustomButton from '../../components/CustomButton';
import ActionSheet from "react-native-actions-sheet";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Snackbar from 'react-native-snackbar';
import CustomDropDown from '../../components/CustomDropDown';

const OrderDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params.order;
  const actionSheetRef = useRef(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (order) {
      setOrderStatus(order?.orderStatus);
    }
  }, [order]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Order Detail',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#f4511e',
        height: 80,
      },
      headerTintColor: '#fff',
      headerLeft: () => <NavigationBack />,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
    });
  }, [navigation]);

  const handleUpdateOrder = async () => {
    try {
      if (order?.id && status !== '') {
        await firestore().collection('Orders').doc(order.id).update({
          orderStatus: status,
        }).then(() => {
          actionSheetRef.current?.hide();
          setOrderStatus(status);
          Snackbar.show({
            text: 'Order status is updated',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.green,
          });
        });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  const statusData = [
    'Ordered', 'Order Inprogress', 'OrderPacked', 'OrderShipped', 
    'OutForDelivery', 'Delivered', 'Returned', 'Failed'
  ];

  const reOrder = () => {
    actionSheetRef.current?.show();
  };

  return (
    <View style={{ flex: 1 }}>
      <ActionSheet ref={actionSheetRef}>
        <View style={{ padding: 15 }}>
          <TouchableOpacity onPress={() => actionSheetRef.current?.hide()} style={{ alignSelf: 'flex-end' }}>
            <AntDesign name={"closecircleo"} size={20} color="#000" />
          </TouchableOpacity>
          <View style={{ marginVertical: 20 }}>
            <CustomDropDown data={statusData} setData={setStatus} />
            <CustomButton width={'90%'} text={'UpdateStatus'} onPress={handleUpdateOrder} />
          </View>
        </View>
      </ActionSheet>
      <ScrollView style={{ padding: 15 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={{ backgroundColor: colors.orange, borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="box" size={30} color={colors.black} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Order ID: #{order?.orderId ?? 'No Order ID'}</Text>
            <Text>{orderStatus ?? ''}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Items:</Text>
          {order?.cartItems && order.cartItems.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <View style={{ backgroundColor: colors.orange, padding: 15, marginRight: 15 }}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={{ width: '50%', overflow: 'hidden' }}>
                <Text>{item.name}</Text>
                <Text>{item.description}</Text>
              </View>
              <Text>${item.price}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginVertical: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Payment Details</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: colors.black_level2, borderBottomWidth: 1, paddingBottom: 10 }}>
            <View>
              <Text>Bag Total</Text>
              <Text>Coupon Discount</Text>
              <Text>Delivery</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text>${order.totalAmount}</Text>
              <Text>{order.couponDiscount}</Text>
              <Text>${order.deliveryCharge}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Total Amount</Text>
            <Text style={{ fontWeight: 'bold' }}>${order.totalAmount}</Text>
          </View>
        </View>

        <View style={{ marginVertical: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Address</Text>
          <Text>{order.address}</Text>
        </View>

        <View style={{ marginVertical: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Payment Method</Text>
          <Text>{order.paymentMethod}</Text>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' }}>
        <TouchableOpacity onPress={reOrder} style={{ backgroundColor: 'lightblue', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Updatestatus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderDetails;
