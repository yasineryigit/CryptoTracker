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


export default function MarketScreen() {

    const [coinDatas, setCoinDatas] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState('')
    const timer = useRef();

    useEffect(() => {

        timer.current = setInterval(() => {

            getAllCoins().then((response) => {
                setCoinDatas(response.data)
            })
        }, 1000);//her saniye, o kodu okutan kişileri getir

    }, [])


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
            var savedFavorites = await AsyncStorage.getItem('favorites')
            console.log("savedFavorites: ", savedFavorites)
            savedFavorites += ("," + selectedCoin)
            console.log("kaydedilecek: ", savedFavorites)
            AsyncStorage.setItem('favorites', savedFavorites).then(() => {
                console.log(selectedCoin, " added")
            })
            alert(`${selectedCoin} added\n Current favorites:${savedFavorites}`)
        } catch (e) {
            console.log("error:", e)
        }

    }

    return (
        <View>

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
                        }
                        }
                    />
                )}

                ListHeaderComponent={<ListHeader />}
            />

            <Menu
                opened={openMenu}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <MenuTrigger text='Select action' />
                <MenuOptions >
                    <MenuOption onSelect={() => {

                        saveSelectedCoin()
                        setOpenMenu(false)
                    }
                    } text='Add to favorites' />

                    <MenuOption onSelect={() => setOpenMenu(false)} text='Cancel' />
                </MenuOptions>
            </Menu>
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