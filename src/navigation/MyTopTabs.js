import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CoinNewsScreen from '../screens/CoinNewsScreen';
import DetailsScreen from '../screens/DetailsScreen';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const Tab = createMaterialTopTabNavigator();


function MyTopTabs(props) {
    const insets = useSafeAreaInsets();
    console.log("MyTopTabs gelen props:", props)
    const selectedCoin = props.route.params.selectedCoin;
    return (
        <Tab.Navigator
            initialRouteName="DetailsScreen"
            screenOptions={{
                activeTintColor: "#e91e63",
                tabBarShowIcon:true,
                tabBarShowLabel: false,
                labelStyle: { fontSize: 12 },
                style: { backgroundColor: 'white', marginTop: insets.top }
            }}
        >
            <Tab.Screen
                name="DetailsScreen"
                component={DetailsScreen}
                options={{
                    tabBarLabel: 'INFO',
                    tabBarIcon: ({ color }) => (
                        <Icon name="analytics-outline" color={color} size={20} />
                    ),
                }}
                initialParams={{ selectedCoin }}
            />
            <Tab.Screen
                name="CoinNewsScreen"
                component={CoinNewsScreen}
                options={{
                    tabBarLabel: `${selectedCoin.name} News`,
                    tabBarIcon: ({ color }) => (
                        <Icon name="newspaper-outline" color={color} size={20} />
                    ),
                }}
                initialParams={{ selectedCoin }} />
        </Tab.Navigator>
    );
}

export default MyTopTabs
