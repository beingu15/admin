import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../store/store';
import Login from '../Login';
import SignUp from '../SignUp';
import Home from '../Home';
import Splash from '../Splash';
import CustomDrawer from '../../components/CustomDrawer';
import CustomFooter from '../../components/CustomFooter';
import Products from '../Products';
import Orders from '../Orders';
import Profile from '../Profile';
import { DimensionContextProvider } from '../../context';
import Users from '../Users';
import ProductDetails from '../ProductDetails';
import OrderDetails from '../OrderDetails';
import CreateProduct from '../CreateProduct';
import Banner from '../Banner';
import Offers from '../Offers';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector(state => state.isLoggedIn);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [isLoggedIn]);

  return (
    <DimensionContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {loading ? (
            <Stack.Screen name="Splash" component={Splash} />
          ) : (
            <>
              {isLoggedIn ? (
                <Stack.Screen name="SideBar" component={SideBar} />
              ) : (
                <Stack.Screen name="Login" component={Login} />
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </DimensionContextProvider>
  );
};

const SideBar = () => {
  return (
    <Drawer.Navigator 
      screenOptions={{ headerShown: false }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Footer" component={Footer} />
    </Drawer.Navigator>
  );
};

const Footer = () => {
  return (
    <Tab.Navigator  screenOptions={{headerShown:false}}
    tabBar={props => <CustomFooter {...props} />}>
      <Tab.Screen name="StackNav" component={StackNav} />
     
    </Tab.Navigator>
  );
};

const StackNavigator=createNativeStackNavigator()
const StackNav=()=>{
  return(
    <StackNavigator.Navigator >

      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Products" component={Products} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Users" component={Users} />
      <Tab.Screen name="OrderDetails" component={OrderDetails} />
      <Tab.Screen name="ProductDetails" component={ProductDetails} />
      <Tab.Screen name="CreateProduct" component={CreateProduct} />
      <Tab.Screen name="Banner" component={Banner} />
      <Tab.Screen name="Offers" component={Offers} />



    </StackNavigator.Navigator>
  )
}
export default App;
