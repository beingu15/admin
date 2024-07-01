import React, { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import colors from '../../common/colors';
import Snackbar from 'react-native-snackbar';
import { useDispatch } from 'react-redux';
import { login } from '../../store/action';

const Login = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (email.trim().toLowerCase() === '' || password.trim() === '') {
      Snackbar.show({
        text: 'Please fill in both fields.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
      });
      return;
    }

    try {
      const snapshot = await firestore()
        .collection('Users')
        .where('email', '==', email.trim().toLowerCase())
        .get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (password.trim() === userData.password) {
          dispatch(login({ userId: userDoc.id }));
          Snackbar.show({
            text: 'Login Successful',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.green,
          });
          // navigation.navigate('MyDrawer')
        } else {
          Snackbar.show({
            text: 'Incorrect password.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: colors.red,
          });
        }
      } else {
        Snackbar.show({
          text: 'No user found with this email.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.red,
        });
      }
    } catch (error) {
      Snackbar.show({
        text: `Error: ${error.message}`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
      });
    }
  };

  const handleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../assets/images/background.jpg')}
        style={{ width: '100%', height: '30%' }}
      />
      <ScrollView
        style={{
          marginTop: -50,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'white',
        }}
      >
        <Image
          source={require('../../assets/images/LOGO.png')}
          style={{
            width: 150,
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <Text style={{ alignSelf: 'center', fontFamily: 'Roboto-Bold', fontSize: 20 }}>
          Admin Login
        </Text>
        <CustomTextInput
          width="80%"
          border={true}
          placeholder="Email"
          placeholderTextColor={colors.grey}
          onChangeText={text => setEmail(text)}
          value={email} // Added this line
          icon={<Image source={require('../../assets/images/email.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }} />}
        />
        <CustomTextInput
          width="80%"
          border={true}
          placeholder="Password"
          placeholderTextColor={colors.grey}
          onChangeText={text => setPassword(text)}
          value={password} // Added this line
          secureTextEntry={secureTextEntry}
          icon={
            <TouchableOpacity onPress={handleSecureTextEntry}>
              <Image
                source={secureTextEntry ? require('../../assets/images/eyeclose.png') : require('../../assets/images/eyeopen.png')}
                style={{ width: 25, height: 25, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          }
        />
        <CustomButton text="Login" onPress={handleLogin} width="80%" />
      </ScrollView>
    </View>
  );
};

export default Login;
