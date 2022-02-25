import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MyTabs from './src/navigation/MyTabs';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator()

const MyStackNavigator = () => {
  return (

    <Stack.Navigator
      initialRouteName="MyTabs"
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="MyTabs"
        options={{ headerShown: false }} component={MyTabs} />


    </Stack.Navigator>
  )
}

export default function App() {

  return (
    <>
      <MenuProvider style={styles.container}>
        <NavigationContainer>

          <MyStackNavigator />

        </NavigationContainer>

      </MenuProvider>
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