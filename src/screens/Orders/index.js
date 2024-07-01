import React, { useLayoutEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore';
import colors from '../../common/colors';
import Empty from '../../common/Empty';
import NavigationBack from '../../common/NavigationBack';
import moment from 'moment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigation = useNavigation();
  const searchInputRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Orders',
      headerTitleAlign: 'left',
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

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, [])
  );

  const getOrders = async () => {
    try {
      const snapshot = await firestore().collection('Orders').get();
      if (snapshot.empty) {
        Snackbar.show({
          text: 'No orders found',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.red,
        });
      } else {
        const orderArray = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(order => order.username !== 'admin'); // Filter out admin orders
        setOrders(orderArray);
        setFilteredOrders(orderArray);
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
      // Handle error gracefully, e.g., show error message to user
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredOrders(orders); // Show all orders when search text is empty
    } else {
      const filtered = orders.filter(order => 
        order.orderId.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const renderHeader = useMemo(() => (
    <TextInput
      ref={searchInputRef} // Attach the ref to the TextInput
      style={styles.searchInput}
      value={searchText}
      placeholder={'Search by Order ID'}
      onChangeText={handleSearch}
    />
  ), [searchText]);
  const dateFormat=(time)=>{
    return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
  }
  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { order: item })} style={styles.orderContainer}>
        <View>
          <Text>Order ID: {item?.orderId}</Text>
          <Text>Customer Name: {item?.userName}</Text>
          <Text>Phone: {item?.userPhone}</Text>
          <Text>Payment Method: {item?.paymentMethod}</Text>
          <Text>ordered on: {dateFormat(item?.created)}</Text>
          <Text>tiotal amount: {item?.totalAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);

  return (
    <FlatList
      data={filteredOrders}
      extraData={filteredOrders}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={() => <Empty />}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      keyboardShouldPersistTaps='handled'
    />
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    width: '90%',
    borderRadius: 15,
    marginVertical: 8,
    alignSelf: 'center',
    padding: 10,
    minHeight: 150, // Adjusted minHeight to increase container height
  },
  searchInput: {
    width: '90%',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default Orders;
