import firestore from '@react-native-firebase/firestore';
import { View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity, Dimensions,Alert } from 'react-native';
import React, { useCallback, useState, useRef, useMemo, useLayoutEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import colors from '../../common/colors';
import Empty from '../../common/Empty';
import NavigationBack from '../../common/NavigationBack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchInputRef = useRef(null);
  const navigation = useNavigation();
  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'products',
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
    <TouchableOpacity onPress={() => navigation.navigate('CreateProduct',{type:'create'})}>
      <FontAwesome  name={"plus"} size={20} color="#000" />
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      getProducts();
    }, [])
  );

  const getProducts = async () => {
    try {
      const snapshot = await firestore().collection('Products').get();
      if (snapshot.empty) {
        Snackbar.show({
          text: 'No products found',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.red,
        });
      } else {
        const productArray = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(product => product.username !== 'admin');
        setProducts(productArray);
        setFilteredProducts(productArray);
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const renderHeader = useMemo(() => (
    <TextInput
      ref={searchInputRef}
      style={styles.searchInput}
      value={searchText}
      placeholder={'Search'}
      onChangeText={handleSearch}
      placeholderTextColor={colors.orange}
    />
  ), [searchText]);
  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: item })}
        style={styles.productContainer}
        pointerEvents="box-none">
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <FontAwesome name={"edit"} size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <FontAwesome name={"trash-o"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <View>
          <Image
            source={
              item?.image
                ? { uri: item?.image }
                : require('../../assets/images/man.png')
            }
            style={styles.productImage}
          />
        </View>
        <View style={styles.text}>
          <Text style={styles.productName}>{item?.name}</Text>
          <Text>{item?.description}</Text>
          <Text>{item?.price}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);
 
  const handleEdit = (productData) => {
    navigation.navigate('CreateProduct', { type: 'edit', data: productData });
  };
  const handleDelete= async(productData)=>{
    Alert.alert('confirm', 'My Alert Msg', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: async() => {
        await firestore()
    .collection('Products')
   .doc(productData.id)
   .delete()
    .then(()=> {
      Snackbar.show({
        text: 'product deleted successfully',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
      });
      
    });
    getProducts()
      }},
    ]);
    
};

  

  return (
    <FlatList
      data={filteredProducts}
      extraData={filteredProducts}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={() => <Empty />}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps='handled'
      numColumns={2}
    />
  );
};

const { width, height } = Dimensions.get('screen');
const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: colors.white,
    width: (width * 0.45) - 10, // Adjusting the width to account for the margin
    height: height * 0.3,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 8, // Adding horizontal margin for spacing
    alignSelf: 'center',
    borderColor: colors.orange,
    borderWidth: 1,
    position: 'relative', // Added position relative for absolute positioning of icons
  },
  iconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
    zIndex: 1, // Ensure icons are on top
  },
  productImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 10,
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
  text: {
    padding: 12,
    marginVertical: 12,
  },
  productName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
});

export default Products;
