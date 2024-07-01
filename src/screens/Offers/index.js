import firestore from '@react-native-firebase/firestore';
import {
  View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet
} from 'react-native';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import NavigationBack from '../../common/NavigationBack';
import Snackbar from 'react-native-snackbar';
import colors from '../../common/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actions-sheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';

const Offers = () => {
  const navigation = useNavigation();
  const [offers, setOffers] = useState([]);
  const [offerCode, setOfferCode] = useState('');
  const [head, setHead] = useState('');
  const [subhead, setSubhead] = useState('');
  const [type, setType] = useState(null);
  const actionSheetRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Offers',
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
    <TouchableOpacity onPress={() => {
      setType('add');
      actionSheetRef.current?.show();
    }}>
      <FontAwesome name={"plus"} size={20} color="#000" />
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      getOffers();
    }, [])
  );

  const getOffers = async () => {
    try {
      const snapshot = await firestore().collection('Offers').get();
      if (snapshot.empty) {
        Snackbar.show({
          text: 'No offers found',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.red,
        });
      } else {
        const offersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOffers(offersList);
      }
    } catch (error) {
      Snackbar.show({
        text: 'Error fetching offers',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
      });
    }
  };

  const handleCreate = async () => {
    // Handle the creation of a new offer
  };

  const renderItem = ({ item }) => (
    <View style={styles.offerContainer}>
      <View style={styles.leftDotsContainer}>
        {Array(4).fill(null).map((_, i) => (
          <View key={i} style={styles.dot}></View>
        ))}
      </View>
      <View style={styles.offerContent}>
        <View style={styles.offerTextContainer}>
          <Text style={styles.offerPercentage}>{item.offer}</Text>
          <View>
            <Text style={styles.offerText}>%</Text>
            <Text style={styles.offerText}>Off</Text>
          </View>
          <View style={styles.offerDescription}>
            <Text style={styles.offerHead}>{item.head}</Text>
            <Text style={styles.offerSubhead}>{item.subhead}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightDotsContainer}>
        {Array(2).fill(null).map((_, i) => (
          <View key={i} style={styles.dot}></View>
        ))}
      </View>
      <View style={styles.offerCodeContainer}>
        <Text style={styles.useCodeText}>Use code</Text>
        <View style={styles.offerCode}>
          <Text style={styles.offerCodeText}>{item.offercode}</Text>
        </View>
      </View>
      <View style={styles.rightDotsContainer}>
        {Array(4).fill(null).map((_, i) => (
          <View key={i} style={styles.dot}></View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.actionSheetContent}>
          <TouchableOpacity onPress={() => actionSheetRef.current?.hide()} style={styles.closeButton}>
            <AntDesign name={"closecircleo"} size={20} color="#000" />
          </TouchableOpacity>
          <View style={styles.actionSheetForm}>
            <CustomTextInput
              width={'100%'}
              value={head}
              border={true}
              placeholder={'Heading'}
              onChangeText={text => setHead(text)}
            />
            <CustomTextInput
              width={'100%'}
              value={subhead}
              border={true}
              placeholder={'Description'}
              onChangeText={text => setSubhead(text)}
            />
            <CustomTextInput
              width={'100%'}
              value={offerCode}
              border={true}
              placeholder={'Offer Percentage'}
              onChangeText={text => setOfferCode(text)}
            />
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.show()}
              style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload banner Image</Text>
            </TouchableOpacity>
            <CustomButton width={'90%'} text={'Update Banner'} onPress={handleCreate} />
          </View>
        </View>
      </ActionSheet>
      <FlatList
        data={offers}
        extraData={offers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  actionSheetContent: {
    padding: 15,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  actionSheetForm: {
    marginVertical: 20,
  },
  uploadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderColor: colors.primaryGreen,
    borderWidth: 1,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: colors.black_level_2,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    lineHeight: 55,
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  leftDotsContainer: {
    marginRight: -12.5,
    zIndex: 99,
  },
  rightDotsContainer: {
    marginLeft: -12.5,
  },
  dot: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: colors.white_level2,
  },
  offerContent: {
    width: '64%',
    backgroundColor: colors.orange_light,
    height: 100,
    padding: 20,
  },
  offerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerPercentage: {
    fontFamily: 'Roboto-Bold',
    color: colors.orange,
    fontSize: 50,
  },
  offerText: {
    fontFamily: 'Roboto-Regular',
    color: colors.orange,
    fontSize: 20,
  },
  offerDescription: {
    marginLeft: 10,
  },
  offerHead: {
    fontFamily: 'Roboto-Bold',
    color: colors.black,
    fontSize: 18,
  },
  offerSubhead: {
    fontFamily: 'Roboto-Bold',
    color: colors.black,
    fontSize: 12,
  },
  offerCodeContainer: {
    width: '30%',
    backgroundColor: colors.orange_light,
    height: 100,
    padding: 20,
  },
  useCodeText: {
    fontFamily: 'Roboto-Bold',
    color: colors.black,
    fontSize: 14,
  },
  offerCode: {
    marginVertical: 10,
    padding: 5,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.orange,
    overflow: 'hidden',
  },
  offerCodeText: {
    fontFamily: 'Roboto-Regular',
    color: colors.white,
  },
});

export default Offers;
