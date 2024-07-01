import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import NavigationBack from '../../common/NavigationBack';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation=useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'profile',
      headerTitleAlign: 'right',
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
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile