import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {
  useLayoutEffect,
  useCallback,
  useState,
  useRef,
  useEffect,
 
} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import NavigationBack from '../../common/NavigationBack';
import CustomTextInput from '../../components/CustomTextInput';
import CustomDropDown from '../../components/CustomDropDown';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../common/colors';
import uploadImage from '../../common/storage';
import ActionSheet from 'react-native-actions-sheet';
import Snackbar from 'react-native-snackbar';



const CreateProduct = () => {
  const actionSheetRef = useRef(null);
  const route = useRoute();
  const {type,data}=route.params
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [uploadUri, setUploadUri] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(null);
  const [qun, setQun] = useState(0);

  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setUploadUri(data.image || '');
      setDesc(data.description || '');
      setQun(data.quantity || 0);
      setPrice(data.price || '');
      console.warn(data.categoryName);
    }
  }, [data]);
  useLayoutEffect(() => {
    navigation.setOptions({
      title:type=== 'create'?'Create Product':'EditProduct' ,
      headerLeft: () => <NavigationBack />,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getCategories();
    }, []),
  );

  const getCategories = async () => {
    await firestore()
      .collection('Categories')
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const objArray = [];
          snapshot?.docs.forEach(document => {
            console.log(document);
            const result = {id: document.id, ...document?.data()};
            objArray.push(result);
          });
          setCategories(objArray);
          setCategoryWithObj(objArray);
        }
      });
  };

  const setCategoryWithObj = objArray => {
    if (data && data.categoryId) {
      const result = objArray.find(ele => ele.id === data.categoryId);
      setCategory(result);
    }
  };

  const handleCamera = async () => {
    const options = {
      mediaType: 'photo',
    };
    await launchCamera(options, response => {
      actionSheetRef.current?.hide();
      if (response && response.assets) {
        setUploadUri(response?.assets[0]?.uri);
      }
    });
  };

  const handleGallery = async () => {
    const options = {
      mediaType: 'photo',
    };
    await launchImageLibrary(options, response => {
      actionSheetRef.current?.hide();
      if (response && response.assets) {
        setUploadUri(response?.assets[0]?.uri);
      }
    });
  };

  const handleUpdateProduct = async () => {
    if (
      uploadUri &&
      name !== '' &&
      desc !== '' &&
      category !== '' &&
      qun !== 0 &&
      price !== ''
    ) {
      const responseUri = uploadUri.includes('file://')
        ? await uploadImage(uploadUri)
        : uploadUri;
      const product = {
        updated: Date.now(),
        name: name,
        description: desc,
        categoryId: category.id,
        categoryName: category.name,
        price: price,
        quantity: qun,
        image: responseUri,
      };
      await firestore()
        .collection('Products')
        .doc(data.id)
        .update(product)
        .then(() => {
          Snackbar.show({
            text: 'Product Updated successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.primaryGreen,
            textColor: colors.white,
          });
          navigation.goBack();
        });
    } else {
      Snackbar.show({
        text: 'Fill up all the fields to continue.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
        textColor: colors.white,
      });
    }
  };

  const handleCreateProduct = async () => {
    if (
      uploadUri &&
      name !== '' &&
      desc !== '' &&
      category !== '' &&
      qun !== 0 &&
      price !== ''
    ) {
      const responseUri = await uploadImage(uploadUri);
      const product = {
        created: Date.now(),
        updated: Date.now(),
        name: name,
        description: desc,
        categoryId: category.id,
        categoryName: category.name,
        price: price,
        quantity: qun,
        image: responseUri,
      };
      await firestore()
        .collection('Products')
        .add(product)
        .then(() => {
          Snackbar.show({
            text: 'Product Added successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.primaryGreen,
            textColor: colors.white,
          });
          navigation.goBack();
        });
    } else {
      Snackbar.show({
        text: 'Fill up all the fields to continue.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
        textColor: colors.white,
      });
    }
  };

  return (
    <ScrollView
      style={{padding: 15}}
      contentContainerStyle={{paddingBottom: 100}}
      showsVerticalScrollIndicator={false}>
      <ActionSheet ref={actionSheetRef}>
        <View style={{padding: 15}}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: colors.black_level_3,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}>
            <Text
              style={{
                color: colors.black_level_2,
                fontSize: 18,
                fontFamily: 'Lato-Regular',
                lineHeight: 55,
              }}>
              Select Option
            </Text>
            <TouchableOpacity onPress={() => actionSheetRef.current?.hide()}>
              <AntDesign
                name="closecircleo"
                size={25}
                color={colors.black_level_2}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingBottom: 50,
              padding: 20,
              justifyContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={handleCamera}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <AntDesign name="camerao" size={40} color={colors.primaryGreen} />
              <Text
                style={{
                  color: colors.black_level_2,
                  fontSize: 18,
                  fontFamily: 'Lato-Regular',
                  lineHeight: 55,
                }}>
                Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGallery}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Entypo name="image" size={40} color={colors.primaryGreen} />
              <Text
                style={{
                  color: colors.black_level_2,
                  fontSize: 18,
                  fontFamily: 'Lato-Regular',
                  lineHeight: 55,
                }}>
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
      <CustomTextInput
        width={'100%'}
        value={name}
        border={true}
        placeholder={'Name'}
        onChangeText={text => setName(text)}
      />
      <CustomTextInput
        width={'100%'}
        border={true}
        value={desc}
        placeholder={'Description'}
        onChangeText={text => setDesc(text)}
        multiline={true}
      />
      {categories.length > 0 ? (
        <CustomDropDown
          prevDate={category}
          data={categories}
          setData={obj => setCategory(obj)}
        />
      ) : null}
      <CustomTextInput
        width={'100%'}
        border={true}
        value={price}
        placeholder={'Price'}
        onChangeText={text => setPrice(text)}
      />
      <CustomTextInput
        width={'100%'}
        border={true}
        value={qun}
        placeholder={'Quantity'}
        onChangeText={text => setQun(text)}
      />

      <TouchableOpacity
        onPress={() => actionSheetRef.current?.show()}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          marginVertical: 10,
          borderColor: colors.primaryGreen,
          borderWidth: 1,
          borderRadius: 8,
        }}>
        <Text
          style={{
            color: colors.black_level_2,
            fontSize: 16,
            fontFamily: 'Lato-Regular',
            lineHeight: 55,
          }}>
          Upload Product Image
        </Text>
        {uploadUri ? (
          <View>
            <TouchableOpacity
              style={{
                position: 'absolute',
                zIndex: 9,
                right: 0,
                top: -10,
                backgroundColor: colors.white_level_3,
                borderRadius: 25,
                overFlow: 'hidden',
              }}
              onPress={() => setUploadUri(null)}>
              <AntDesign
                name="closecircleo"
                size={25}
                color={colors.black_level_2}
              />
            </TouchableOpacity>
            <Image
              source={{uri: uploadUri}}
              style={{width: 100, height: 100, resizeMode: 'contain'}}
            />
          </View>
        ) : (
          <Entypo name="images" size={40} color={colors.black_level_2} />
        )}
      </TouchableOpacity>

      <CustomButton
        width={'100%'}
        text={type==='create'?'create':'update'}
        onPress={type === 'create'? handleCreateProduct:handleUpdateProduct}
      />
    </ScrollView>
  );
};
export default CreateProduct;