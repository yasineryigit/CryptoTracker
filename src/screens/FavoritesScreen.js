import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCoin } from '../api/apiCalls';
import ListItem from '../components/ListItem';

export default function FavoritesScreen() {

    const [savedFavorites, setSavedFavorites] = useState([])
    const [coinDatas, setCoinDatas] = useState([])
    const timer = useRef();

    useEffect(() => {
        getFavorites()
    }, [])

    useEffect(() => {
        fetchCoins()
    }, [savedFavorites])

    useEffect(() => {

        console.log("coinDatas:", coinDatas)

    }, [coinDatas])

    const fetchCoins = () => {
        timer.current = setInterval(() => {

            setCoinDatas([]);
            savedFavorites.forEach((savedFavorite) => {
                if (savedFavorite !== "null") {
                    getCoin(savedFavorite).then((response) => {
                        console.log("gelen response:", response.data)
                        let data = response.data

                        setCoinDatas(
                            coinDatas.map(item =>
                                item.id === index.id
                                    ? { item: data }
                                    : { ...item, data }
                            ))
                    })
                }
            })


        }, 2000);

    }


    const getFavorites = async () => {
        try {
            var savedFavorites = await AsyncStorage.getItem('favorites')
            const myArray = savedFavorites.split(",");
            console.log("Splited array: ", myArray)
            setSavedFavorites(myArray)
        } catch (e) {
            console.log("error:", e)
        }
    }

    const ListHeader = () => (
        <>
            <View style={styles.titleWrapper}>
                <Text style={styles.largeTitle}>Favorites</Text>
            </View>
            <View style={styles.divider} />
        </>
    )

    return (
        <View style={styles.container}>
            <Text>this is my favorites</Text>
            {
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={coinDatas}
                    renderItem={({ item }) => (
                        <ListItem
                            name={item.name}
                            symbol={item.symbol}
                            currentPrice={item.market_data.current_price.usd}
                            price_change_percentage_24h={item.market_data.price_change_percentage_24h}
                            logoUrl={item.image.thumb}
                            onPress={() => { }
                            }
                        />
                    )}
                    ListHeaderComponent={<ListHeader />}
                />
            }
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