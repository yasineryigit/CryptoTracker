import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { getAllCoins } from '../api/apiCalls';
import ListItem from '../components/ListItem';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';


export default function MarketScreen() {

    const [coinDatas, setCoinDatas] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState('')
    const [isRunning, setIsRunning] = useState(true);
    const funRef = useRef(null);


    useFocusEffect(
        React.useCallback(() => {

            if (isRunning) {
                funRef.current = setInterval(() => { // Save reference to interval.
                    getAllCoins().then((response) => {
                        setCoinDatas(response.data)
                        console.log("marketscreen interval working")
                    }).catch((error) => {
                    })
                }, 1000);
            }
            return () => {
                clearInterval(funRef.current); // Stop the interval.
            };
        }, [])
    );


    useEffect(() => {

        //console.log("coinDatas:", coinDatas)

    }, [coinDatas])

    const ListHeader = () => (
        <>
            <View style={styles.titleWrapper}>
                <Text style={styles.largeTitle}>Markets</Text>
            </View>
            <View style={styles.divider} />
        </>
    )

    const saveSelectedCoin = async () => {

        try {
            const jsonValue = await AsyncStorage.getItem('favorites')
            if (jsonValue !== null) { //if saved value is not null then push into it
                let value = JSON.parse(jsonValue)
                found = value.find(x => x === selectedCoin) ? true : false
                if (!found) {
                    value.push(selectedCoin)
                    console.log("kaydedilecek array:", value)
                    await AsyncStorage.setItem('favorites', JSON.stringify(value))
                    showToast('success', 'Successful', `${selectedCoin} added to your favorites successfully`)
                } else {
                    showToast('info', 'Has been already added', `${selectedCoin} has already been added to your favorites`)
                }

            } else {//if saved value is null then push array
                let favorites = [];
                favorites.push(selectedCoin)
                console.log("kaydedilecek array:", favorites)
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites))
                showToast('success', 'Successful', `${selectedCoin} added to your favorites successfully`)
            }

        } catch (e) {
            console.log("error while async storage:", e)
        }
    }


    const showToast = (type, text1, text2) => {
        Toast.show({
            type, text1, text2
        });
    }

    return (

        <View style={styles.container}>
            <Menu
                opened={openMenu}
            >
                <MenuTrigger triggerOnLongPress={true} />
                <MenuOptions >
                    <MenuOption onSelect={() => {
                        saveSelectedCoin()
                        setOpenMenu(false)
                    }
                    } text='Add to favorites' />

                    <MenuOption onSelect={() => setOpenMenu(false)} text='Cancel' />
                </MenuOptions>
            </Menu>

            <FlatList
                keyExtractor={(item) => item.id}
                data={coinDatas}
                renderItem={({ item }) => (
                    <ListItem
                        name={item.name}
                        symbol={item.symbol}
                        currentPrice={item.current_price}
                        price_change_percentage_24h={item.price_change_percentage_24h}
                        logoUrl={item.image}
                        onPress={() => {
                            setOpenMenu(true)
                            setSelectedCoin(item.id)
                        }}
                    />
                )}
                ListHeaderComponent={<ListHeader />}
            />
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleWrapper: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    largeTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#A9ABB1',
        marginHorizontal: 16,
        marginTop: 16,
    },
    bottomSheet: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});