import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MarketScreen from '../screens/MarketScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { getAllCoins } from '../api/apiCalls';


const Tab = createBottomTabNavigator();

const MyTabs = () => {

    const [coinDatas, setCoinDatas] = useState([]);
    const timer = useRef();

    useEffect(() => {
        timer.current = setInterval(() => {
            getAllCoins().then((response) => {
                setCoinDatas(response.data)
                console.log("mytabs interval working")
            }).catch((error) => {
            })
        }, 1000)

        return () => {
            clearInterval(timer.current)
        }
    }, [])

    return (

        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                // Floating Tab Bar...
                tabBarStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    bottom: 40,
                    marginHorizontal: 20,
                    // Max Height...
                    height: 60,
                    borderRadius: 10,
                    // Shadow...
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowOffset: {
                        width: 10,
                        height: 10
                    },
                    paddingHorizontal: 20,
                }
            }}
        >
            <Tab.Screen
                name="MarketScreen"
                component={MarketScreen}
                initialParams={{
                    coinDatas
                }}
                options={{
                    tabBarLabel: 'Market',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="FavoritesScreen"
                component={FavoritesScreen}
                initialParams={{
                    coinDatas
                }}
                options={{
                    tabBarLabel: 'Favorites',
                    tabBarIcon: ({ color }) => (
                        <Icon name="heart" color={color} size={26} />
                    ),
                }}
            />

        </Tab.Navigator>
    )
}

export default MyTabs;