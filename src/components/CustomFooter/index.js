import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import colors from '../../common/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const FooterIcon = ({ name, label, IconComponent, isActive, onPress }) => {
  const activeSize = 34;
  const inactiveSize = 24;
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <IconComponent name={name} size={isActive ? activeSize : inactiveSize} color={colors.black} />
      <Text style={[styles.iconLabel, isActive && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const CustomFooter = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState('Home');

  const handlePress = (screen) => {
    setActive(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.footerContainer}>
      <FooterIcon
        name="home"
        label="Home"
        IconComponent={AntDesign}
        isActive={active === 'Home'}
        onPress={() => handlePress('Home')}
      />
      <FooterIcon
        name="box-open"
        label="Products"
        IconComponent={FontAwesome5}
        isActive={active === 'Products'}
        onPress={() => handlePress('Products')}
      />
      <FooterIcon
        name="luggage-cart"
        label="Orders"
        IconComponent={FontAwesome5}
        isActive={active === 'Orders'}
        onPress={() => handlePress('Orders')}
      />
      <FooterIcon
        name="face-man-profile"
        label="Profile"
        IconComponent={MaterialCommunityIcons}
        isActive={active === 'Profile'}
        onPress={() => handlePress('Profile')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    height: 75,
    backgroundColor: colors.orange_light,
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    color: colors.black,
    marginTop: 5,
  },
  activeLabel: {
    fontWeight: 'bold',
  },
});

export default CustomFooter;
