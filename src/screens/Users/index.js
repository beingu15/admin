import firestore from '@react-native-firebase/firestore';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useCallback, useLayoutEffect, useState, useEffect, useMemo, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import NavigationBack from '../../common/NavigationBack';
import colors from '../../common/colors';
import CustomTextInput from '../../components/CustomTextInput';
import Snackbar from 'react-native-snackbar';
import Empty from '../../common/Empty';

const Users = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Users',
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

  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [])
  );

  const getUsers = async () => {
    try {
      const snapshot = await firestore().collection('Users').get();
      if (snapshot.empty) {
        Snackbar.show({
          text: 'No users found',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.red,
        });
      } else {
        const usersArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersArray);
        setFilteredUsers(usersArray);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleBlockUser = async data => {
    try {
      await firestore().collection('Users').doc(data.id).update({
        active: !data.active,
      });
      const updatedUsers = users.map(user =>
        user.id === data.id ? { ...user, active: !user.active } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      Snackbar.show({
        text: 'User updated successfully',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.grey,
      });
    } catch (error) {
      console.error("Error updating user: ", error);
    }
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

  const BlockUser = React.memo(({ data }) => (
    <TouchableOpacity
      onPress={() => handleBlockUser(data)}
      style={styles.blockButton}
    >
      <Text style={styles.blockButtonText}>
        {data.active ? 'Block' : 'Unblock'}
      </Text>
    </TouchableOpacity>
  ));

  const renderUser = useCallback(({ item }) => {
    if (item.username === 'admin') return null;
    return (
      <View style={styles.userContainer}>
        <Image
          source={item.profileimage ? { uri: item.profileimage } : require('../../assets/images/man.png')}
          style={styles.userImage}
        />
        <View>
          <Text>{item.username}</Text>
          <Text>{item.email}</Text>
          <Text>{item.mobilenumber}</Text>
        </View>
        <BlockUser data={item} />
      </View>
    );
  }, [filteredUsers]);

  return (
    <FlatList
      data={filteredUsers}
      extraData={filteredUsers}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={Empty}
      renderItem={renderUser}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.grey,
    width: '90%',
    borderRadius: 15,
    marginVertical: 8,
    alignSelf: 'center',
    padding: 10,
  },
  userImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    overflow: 'hidden',
    borderRadius: 45,
    marginRight: 15,
  },
  blockButton: {
    padding: 4,
    borderRadius: 4,
    borderColor: colors.red,
    borderWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    top: 15,
    right: 5,
  },
  blockButtonText: {
    fontWeight: 'bold',
    color: colors.orange,
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

export default Users;
