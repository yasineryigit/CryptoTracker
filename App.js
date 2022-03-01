import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MyTabs from './src/navigation/MyTabs';
import Toast from 'react-native-toast-message';
import DetailsScreen from './src/screens/DetailsScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import StartScreen from './src/screens/StartScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createStackNavigator()

const MyStackNavigator = () => {
  return (

    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="MyTabs"
        component={MyTabs} />

      <Stack.Screen name="DetailsScreen"
        component={DetailsScreen} />

      <Stack.Screen name="WebViewScreen"
        component={WebViewScreen} />

      <Stack.Screen name="StartScreen"
        component={StartScreen} />

      <Stack.Screen name="LoginScreen"
        component={LoginScreen} />

      <Stack.Screen name="RegisterScreen"
        component={RegisterScreen} />


      <Stack.Screen name="SplashScreen"
        component={SplashScreen} />


    </Stack.Navigator>
  )
}

export default function App() {

  return (
    <>
      <NavigationContainer>

        <MyStackNavigator />

      </NavigationContainer>


      <Toast />
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});