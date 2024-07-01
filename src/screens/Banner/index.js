import firestore from '@react-native-firebase/firestore';
import { View, Text, TouchableOpacity, FlatList, ImageBackground, Dimensions, Image, StyleSheet, Alert } from 'react-native'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import NavigationBack from '../../common/NavigationBack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Snackbar from 'react-native-snackbar';
import ActionSheet from 'react-native-actions-sheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomDropDown from '../../components/CustomDropDown';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../common/colors';
import uploadImage from '../../common/storage';







const Banner = () => {
    const navigation=useNavigation()
    const[banners,setBanners]=useState([])
    const {width,height}=Dimensions.get('screen')
    const actionSheetRef = useRef(null);
    const[head,setHead]=useState('')
    const[desc,setDesc]=useState('')
    const [uploadUri, setUploadUri] = useState(null);
    const[type,setType]=useState(null)
    const[bannerId,setBannerId]=useState('')
    useLayoutEffect(() => {
        navigation.setOptions({
          title: 'banners',
          headerTitleAlign: 'right',
          headerStyle: {
            backgroundColor: '#f4511e',
            height: 80,
          },
          headerTintColor: '#fff',
          headerLeft: () => <NavigationBack />,
          headerRight: () => <RightComponent/>,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
          },
        });
      }, [navigation]);

      
      const RightComponent = () => (
        <TouchableOpacity onPress={() => {
          setType('add')
          actionSheetRef.current?.show()}}>
          <FontAwesome  name={"plus"} size={20} color="#000" />
        </TouchableOpacity>
      );

      useFocusEffect(
        useCallback(() => {
          getBanners();
        }, [])
      );

      const getBanners =async()=>{
        await firestore().collection('Banners').get().then(snapshot=>{
            if(snapshot.empty){
                Snackbar.show({
                    text: 'No Bnners found',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: colors.red,
                  });
            }else{
                const objArray=[];
                snapshot?.docs.forEach(document=>{
                    console.log(document);
                    const result ={id:document.id,...document?.data()};
                    objArray.push(result)
                })
                setBanners(objArray)
            }
        })

      }
      const handleCreate=async()=>{
        if (
          uploadUri &&
          head !== '' &&
          desc !== '' 
         
        ) {
          const responseUri = await uploadImage(uploadUri);
          const product = {
            
           
            description: desc,
            head:head,
            image: responseUri,
          };
          await firestore()
            .collection('Banners')
            .add(product)
            .then(() => {
              Snackbar.show({
                text: 'banner Added successfully',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.primaryGreen,
                textColor: colors.white,
              });
              actionSheetRef.current?.hide()
              setHead('')
              setDesc('')
              setUploadUri(null)
              getBanners()
            });
        } else {
          Snackbar.show({
            text: 'Fill up all the fields to continue.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.red,
            textColor: colors.white,
          });
        }

      }

      const handleCamera = async () => {
        const options = {
          mediaType: 'photo',
        };
        await launchCamera(options, response => {
          
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
          
          if (response && response.assets) {
            setUploadUri(response?.assets[0]?.uri);
          }
        });
      };


      const handleEdit = async(bannerData) => {
        setBannerId(bannerData.id)
        setHead(bannerData.head)
        setDesc(bannerData.description)
        setUploadUri(bannerData.image)
        setType('update')
        actionSheetRef.current?.show()
       
      };
      const handleDelete= async(bannerData)=>{
        Alert.alert('confirm banner deletion', 'My Alert Msg', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: async() => {
            await firestore()
        .collection('Banners')
       .doc(bannerData.id)
       .delete()
        .then(()=> {
          Snackbar.show({
            text: 'product deleted successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.red,
          });
          
        });
        getBanners()
          }},
        ]);
    };

    const handleUpdateSubmit=async ()=>{
      if(bannerId &&
        uploadUri &&
        head !== '' &&
        desc !== '' ){
          const responseUri =uploadUri.includes('file://')? await uploadImage(uploadUri):uploadUri;
          const product = {
            
           
            description: desc,
            head:head,
            image: responseUri,
          };
          await firestore()
            .collection('Banners')
            .doc(bannerId)
            .update(product)
            .then(() => {
              Snackbar.show({
                text: 'banner updated successfully',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.primaryGreen,
                textColor: colors.white,
              });
              actionSheetRef.current?.hide()
              setHead('')
              setDesc('')
              setUploadUri(null)
              getBanners()
            });
        } else {
          Snackbar.show({
            text: 'Fill up all the fields to continue.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.red,
            textColor: colors.white,
          });
        }


      }

    
    
    
  return (
    <View style={{flex:1}}>
        <ActionSheet ref={actionSheetRef}>
        <View style={{ padding: 15 }}>
          <Text>{type==='add'?'create banner':'updateBanner'}</Text>
          <TouchableOpacity onPress={() => actionSheetRef.current?.hide()} style={{ alignSelf: 'flex-end' }}>
            <AntDesign name={"closecircleo"} size={20} color="#000" />
          </TouchableOpacity>
          <View style={{ marginVertical: 20 }}>
          <CustomTextInput
        width={'100%'}
        value={head}
        border={true}
        placeholder={'Heading'}
        onChangeText={text => setHead(text)}
      />
       <CustomTextInput
        width={'100%'}
        value={desc}
        border={true}
        placeholder={'Description'}
        onChangeText={text => setDesc(text)}
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
          Upload banner Image
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
              <AntDesign name="camerao" size={40} color={colors.orange} />
              <Text
                style={{
                  color: colors.orange,
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
              <Entypo name="image" size={40} color={colors.iron} />
              <Text
                style={{
                  color: colors.iron,
                  fontSize: 18,
                  fontFamily: 'Lato-Regular',
                  lineHeight: 55,
                }}>
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
            <CustomButton width={'90%'} text={type==='add'?'CreateBanner':'update banner'} onPress={type==='add' ? handleCreate : handleUpdateSubmit} />
          </View>
        </View>
      </ActionSheet>
      <FlatList 
      data={banners} 
      keyExtractor={(item,index)=>String(index)}
      renderItem={({item,index})=>{
        
       
        return(
            <ImageBackground source={{uri:item.image}} style={{width:width*0.95,height:height*0.2,resizeMode:'cover',borderRadius:10,
                overflow:'hidden',marginTop:10
            }}>
              <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <FontAwesome name={"edit"} size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <FontAwesome name={"trash-o"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
                <Text>{item.head}</Text>
                <Text>{item.description}</Text>

            </ImageBackground>
        )
      }}/>
    </View>
  )
}
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
})




export default Banner