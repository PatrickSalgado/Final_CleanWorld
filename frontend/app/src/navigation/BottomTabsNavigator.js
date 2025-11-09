import React, { useContext, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Animated, View, Text } from 'react-native';
import { AppContext } from '../context/AppContext';

// Telas
import LoginGScreen from '../screens/LoginScreen/LoginGScreen';
import LoginGEnterprise from '../screens/LoginScreen/LoginGEnterprise';
import RegisterUserTwo from '../screens/RegisterScreen/RegisterUser/RegisterUserTwo';
import RegisterUserOne from '../screens/RegisterScreen/RegisterUser/RegisterUserOne';
import DiscardingProfile from '../screens/Profile/DiscardingProfile/DiscardingProfile';
import PreRegister from '../screens/RegisterScreen/PreRegister';
import RegisterEnterpriseOne from '../screens/RegisterScreen/RegisterEnterprise/RegisterEnterpriseOne';
import RegisterEnterpriseTwo from '../screens/RegisterScreen/RegisterEnterprise/RegisterEnterpriseTwo';
import EnterpriseProfile from '../screens/Profile/CollectorProfile/EnterpriseProfile';
import RegisterVehicle from '../screens/EnterpriseScreen/RegisterVehicle';
import MaterialDiscarding from '../screens/DiscardingScreen/MaterialDiscarding';
import OrdenAccept from '../screens/DiscardingScreen/OrdenAccept';
import OrderList from '../screens/EnterpriseScreen/OrderList';
import OrderAccepted from '../screens/EnterpriseScreen/OrderAccepted';
import UserMenu from '../screens/DiscardingScreen/UserMenu';
import EnterpriseMenu from '../screens/EnterpriseScreen/EnterpriseMenu';
import ListVehicle from '../screens/EnterpriseScreen/ListVehicle';
import NewRequest from "../screens/discardRequest/NewRequest";

const TAB_CONFIG = {
  EnterpriseProfile: {
    label: 'Perfil',
    icon: 'business-outline',
  },
  UserMenu: {
    label: 'Início',
    icon: 'home-outline',
  },
  EnterpriseMenu: {
    label: 'Início',
    icon: 'home-outline',
  },
  DiscardingProfile: {
    label: 'Perfil',
    icon: 'person-outline',
  },
  ListVehicle: {
    label: 'Lista Veículos',
    icon: 'person-outline',
  },
  MaterialDiscarding: {
    label: 'Descarte',
    icon: 'leaf-outline',
  },
  OrdenAccept: {
    label: 'Solicitações',
    icon: 'document-text-outline',
  },
  OrderList: {
    label: 'Solicitações',
    icon: 'list-outline',
  },
  OrderAccepted: {
    label: 'Aceitos',
    icon: 'checkmark-circle-outline',
  },
  RegisterVehicle: {
    label: 'Veículos',
    icon: 'car-outline',
  },
  newRequest: {
    label: 'Nova Solicitação de Descarte',
    icon: 'leaf-outline',
  },
};

export default function BottomTabsNavigator() {
  const Tab = createBottomTabNavigator();
  const { userType } = useContext(AppContext);

  const getTabBarVisibility = useCallback(
    (routeName) =>
      [
        'Login',
        'Pre-registro',
        'RegisterEnterpriseOne',
        'RegisterEnterpriseTwo',
        'RegisterUserOne',
        'RegisterUserTwo',
        'LoginGEnterprise',
      ].includes(routeName)
        ? 'none'
        : 'flex',
    []
  );

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Login"
        screenOptions={({ route }) => {
          const config = TAB_CONFIG[route.name];

          return {
            headerShown: false,
            tabBarStyle: {
              display: getTabBarVisibility(route.name),
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: 70,
              paddingBottom: 10,
              paddingTop: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            },
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, color, size }) => {
              const scale = new Animated.Value(focused ? 1.2 : 1);
              Animated.spring(scale, {
                toValue: focused ? 1.2 : 1,
                useNativeDriver: true,
                speed: 20,
                bounciness: 10,
              }).start();

              return (
                <Animated.View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ scale }],
                  }}
                >
                  <View
                    style={{
                      backgroundColor: focused ? '#34C75922' : 'transparent',
                      borderRadius: 30,
                      padding: 5,
                    }}
                  >
                    <Ionicons
                      name={config?.icon || 'alert-circle-outline'}
                      size={size}
                      color={focused ? '#34C759' : '#8E8E93'}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: focused ? '700' : '500',
                      color: focused ? '#34C759' : '#8E8E93',
                    }}
                  >
                    {config?.label || route.name}
                  </Text>
                </Animated.View>
              );
            },
          };
        }}
      >
        {/* Telas ocultas */}
        <Tab.Screen name="Login" component={LoginGScreen} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="RegisterEnterpriseOne" component={RegisterEnterpriseOne} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="RegisterEnterpriseTwo" component={RegisterEnterpriseTwo} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="Pre-registro" component={PreRegister} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="RegisterUserOne" component={RegisterUserOne} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="RegisterUserTwo" component={RegisterUserTwo} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="LoginGEnterprise" component={LoginGEnterprise} options={{ tabBarButton: () => null }} />

        {/* Menus */}
        <Tab.Screen
          name="EnterpriseMenu"
          component={EnterpriseMenu}
          options={{ tabBarButton: userType === 1 ? undefined : () => null }}
        />
        <Tab.Screen
          name="UserMenu"
          component={UserMenu}
          options={{ tabBarButton: userType === 0 ? undefined : () => null }}
        />

        {/* Usuário tipo 0 (Descartador) */}
        {userType === 0 && (
          <>
          
            <Tab.Screen name="DiscardingProfile" component={DiscardingProfile} />
            <Tab.Screen name="Solicitar" component={NewRequest} />
            {/*<Tab.Screen name="MaterialDiscarding" component={MaterialDiscarding} />*/}
            <Tab.Screen name="OrdenAccept" component={OrdenAccept} />
            
          </>
        )}

        {/* Usuário tipo 1 (Empresa) */}
        {userType === 1 && (
          <>
            <Tab.Screen name="EnterpriseProfile" component={EnterpriseProfile} />
            <Tab.Screen name="RegisterVehicle" component={RegisterVehicle} />
            <Tab.Screen name="ListVehicle" component={ListVehicle} />
            <Tab.Screen name="OrderList" component={OrderList} />
            <Tab.Screen name="OrderAccepted" component={OrderAccepted} />

          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
