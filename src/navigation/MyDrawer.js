
import React from 'react';

import { DrawerContent } from '../screens/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MarketScreen from '../screens/MarketScreen';
import MyTabs from './MyTabs';


const Drawer = createDrawerNavigator();

export function MyDrawer(props) {

    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="MyTabs" component={MyTabs} />
        </Drawer.Navigator>
    );
}



